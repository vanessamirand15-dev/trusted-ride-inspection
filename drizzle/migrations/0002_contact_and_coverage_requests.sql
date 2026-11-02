CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  email TEXT NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  subject TEXT NOT NULL CHECK (subject IN ('General Inquiry','Inspector Partnership','Booking Support','Academic Project Inquiry')),
  message TEXT NOT NULL CHECK (char_length(message) BETWEEN 1 AND 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT ALL ON public.contact_submissions TO service_role;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact" ON public.contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TABLE public.coverage_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  email TEXT NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  zip TEXT NOT NULL CHECK (zip ~ '^[0-9]{5}$'),
  city TEXT CHECK (city IS NULL OR char_length(city) <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.coverage_requests TO anon, authenticated;
GRANT ALL ON public.coverage_requests TO service_role;
ALTER TABLE public.coverage_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can request coverage" ON public.coverage_requests FOR INSERT TO anon, authenticated WITH CHECK (true);