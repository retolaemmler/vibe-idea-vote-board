REVOKE UPDATE ON public.ideas FROM anon, authenticated;
GRANT UPDATE (author_name, title, description, category) ON public.ideas TO anon, authenticated;