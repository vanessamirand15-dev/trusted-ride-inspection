create type public.app_role as enum ('admin', 'reviewer');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
create or replace function public.is_reviewer(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('admin','reviewer'))
$$;

create policy "Users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  phone text not null default '',
  base_zip text not null default '',
  radius_miles integer not null default 25,
  certification text not null default '',
  years_experience integer not null default 0,
  specialties text[] not null default '{}',
  verification_status text not null default 'Pending Review',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "Inspectors read own profile" on public.profiles for select to authenticated using (id = auth.uid() or public.is_reviewer(auth.uid()));
create policy "Inspectors update own profile" on public.profiles for update to authenticated using (id = auth.uid() or public.is_reviewer(auth.uid())) with check (id = auth.uid() or public.is_reviewer(auth.uid()));

create or replace function public.guard_profile_update()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.verification_status is distinct from old.verification_status and not public.is_reviewer(auth.uid()) then
    new.verification_status := old.verification_status;
  end if;
  new.updated_at := now();
  return new;
end $$;
create trigger profiles_guard before update on public.profiles for each row execute function public.guard_profile_update();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, coalesce(new.email, ''), coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table public.inspection_jobs (
  id uuid primary key default gen_random_uuid(),
  inspector_id uuid not null,
  vehicle text not null,
  category text not null default 'Standard',
  location text not null default '',
  scheduled_at timestamptz not null default now(),
  payout_cents integer not null default 0,
  status text not null default 'Upcoming',
  notes text not null default '',
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.inspection_jobs to authenticated;
grant all on public.inspection_jobs to service_role;
alter table public.inspection_jobs enable row level security;
create policy "Read own or reviewer jobs" on public.inspection_jobs for select to authenticated using (inspector_id = auth.uid() or public.is_reviewer(auth.uid()));
create policy "Update own or reviewer jobs" on public.inspection_jobs for update to authenticated using (inspector_id = auth.uid() or public.is_reviewer(auth.uid())) with check (inspector_id = auth.uid() or public.is_reviewer(auth.uid()));
create policy "Reviewers create jobs" on public.inspection_jobs for insert to authenticated with check (public.is_reviewer(auth.uid()));
create policy "Reviewers delete jobs" on public.inspection_jobs for delete to authenticated using (public.is_reviewer(auth.uid()));

create or replace function public.guard_job_update()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_reviewer(auth.uid()) then
    if new.inspector_id <> old.inspector_id or new.payout_cents <> old.payout_cents or new.vehicle <> old.vehicle
       or new.category <> old.category or new.location <> old.location or new.scheduled_at <> old.scheduled_at then
      raise exception 'Only reviewers can change job assignment details';
    end if;
    if new.status not in ('Upcoming','In Progress','Completed') then raise exception 'Invalid status'; end if;
  end if;
  return new;
end $$;
create trigger jobs_guard before update on public.inspection_jobs for each row execute function public.guard_job_update();

create table public.inspector_documents (
  id uuid primary key default gen_random_uuid(),
  inspector_id uuid not null,
  doc_type text not null,
  file_name text not null,
  storage_path text not null,
  created_at timestamptz not null default now()
);
grant select, insert, delete on public.inspector_documents to authenticated;
grant all on public.inspector_documents to service_role;
alter table public.inspector_documents enable row level security;
create policy "Read own or reviewer docs" on public.inspector_documents for select to authenticated using (inspector_id = auth.uid() or public.is_reviewer(auth.uid()));
create policy "Insert own docs" on public.inspector_documents for insert to authenticated with check (inspector_id = auth.uid() and storage_path like auth.uid()::text || '/%');
create policy "Delete own docs" on public.inspector_documents for delete to authenticated using (inspector_id = auth.uid());