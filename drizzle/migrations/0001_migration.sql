create policy "Inspectors upload own documents" on storage.objects for insert to authenticated
  with check (bucket_id = 'inspector-documents' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Inspectors and reviewers read documents" on storage.objects for select to authenticated
  using (bucket_id = 'inspector-documents' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_reviewer(auth.uid())));
create policy "Inspectors delete own documents" on storage.objects for delete to authenticated
  using (bucket_id = 'inspector-documents' and (storage.foldername(name))[1] = auth.uid()::text);