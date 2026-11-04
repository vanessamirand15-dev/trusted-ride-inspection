ALTER TABLE public.profiles ADD COLUMN contact_preference text NOT NULL DEFAULT 'email', ADD COLUMN buyer_profile_completed boolean NOT NULL DEFAULT false;
CREATE OR REPLACE FUNCTION public.guard_buyer_profile() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN IF NEW.buyer_profile_completed AND (length(trim(NEW.full_name)) = 0 OR length(trim(NEW.phone)) = 0 OR NEW.contact_preference NOT IN ('email','phone')) THEN RAISE EXCEPTION 'Name, phone and contact preference are required'; END IF; RETURN NEW; END $$;
CREATE TRIGGER buyer_profile_validation BEFORE INSERT OR UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.guard_buyer_profile();
CREATE TABLE public.buyer_bookings (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL,
 vehicle text NOT NULL, vin text NOT NULL DEFAULT '', location text NOT NULL,
 preferred_date text NOT NULL, package text NOT NULL, purpose text NOT NULL DEFAULT 'buyer' CHECK (purpose IN ('buyer','seller')),
 timestamps text[] NOT NULL DEFAULT ARRAY[now()::text], inspector text, cancelled_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.buyer_bookings TO authenticated;
GRANT ALL ON public.buyer_bookings TO service_role;
ALTER TABLE public.buyer_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buyers read only owned bookings" ON public.buyer_bookings FOR SELECT TO authenticated USING (user_id = auth.uid() AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND buyer_profile_completed));
CREATE POLICY "Complete buyers create owned requests" ON public.buyer_bookings FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND cardinality(timestamps) = 1 AND inspector IS NULL AND cancelled_at IS NULL AND length(trim(vehicle)) > 0 AND length(trim(location)) > 0 AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND buyer_profile_completed));
CREATE POLICY "Buyers update only owned requests" ON public.buyer_bookings FOR UPDATE TO authenticated USING (user_id = auth.uid() AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND buyer_profile_completed)) WITH CHECK (user_id = auth.uid());
CREATE INDEX buyer_bookings_owner ON public.buyer_bookings(user_id);
CREATE FUNCTION public.guard_buyer_booking_update() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN
 IF NEW.user_id IS DISTINCT FROM OLD.user_id OR NEW.vehicle IS DISTINCT FROM OLD.vehicle OR NEW.vin IS DISTINCT FROM OLD.vin OR NEW.location IS DISTINCT FROM OLD.location OR NEW.preferred_date IS DISTINCT FROM OLD.preferred_date OR NEW.package IS DISTINCT FROM OLD.package OR NEW.purpose IS DISTINCT FROM OLD.purpose OR NEW.timestamps IS DISTINCT FROM OLD.timestamps OR NEW.inspector IS DISTINCT FROM OLD.inspector OR NEW.created_at IS DISTINCT FROM OLD.created_at OR NEW.id IS DISTINCT FROM OLD.id THEN RAISE EXCEPTION 'Only cancellation is available to buyers'; END IF;
 IF OLD.cancelled_at IS NOT NULL OR cardinality(OLD.timestamps) >= 5 OR NEW.cancelled_at IS NULL THEN RAISE EXCEPTION 'This booking cannot be cancelled'; END IF;
 NEW.cancelled_at := now(); RETURN NEW; END $$;
CREATE TRIGGER buyer_booking_guard BEFORE UPDATE ON public.buyer_bookings FOR EACH ROW EXECUTE FUNCTION public.guard_buyer_booking_update();