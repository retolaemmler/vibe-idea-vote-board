GRANT UPDATE (author_name, title, description, category) ON public.ideas TO anon, authenticated;
GRANT DELETE ON public.ideas TO anon, authenticated;
CREATE POLICY "Ideas editable by everyone" ON public.ideas FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Ideas deletable by everyone" ON public.ideas FOR DELETE TO anon, authenticated USING (true);