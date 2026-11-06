import postgres from 'postgres';
import { readFile } from 'node:fs/promises';

// Run explicitly for the Vercel database; never read Lovable's migration URL.
if (process.env.VERCEL !== '1' || !process.env.POSTGRES_URL) {
  throw new Error('Run in Vercel with its linked Supabase integration.');
}
const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require', max: 1, prepare: false });
try {
  await sql.begin(async tx => {
    await tx`SELECT pg_advisory_xact_lock(83061106)`;
    const [state] = await tx`SELECT to_regclass('public.ideas') AS ideas, to_regclass('public.idea_likes') AS likes`;
    if (!state.ideas && !state.likes) {
      for (const file of ['0000_migration.sql', '0001_add_category_anderes.sql', '0002_allow_edit_delete_ideas.sql', '0003_lock_like_count_updates.sql']) {
        await tx.unsafe(await readFile(new URL(`../drizzle/migrations/${file}`, import.meta.url), 'utf8'));
      }
      console.log('Initialized idea board schema in Vercel Supabase.');
    } else if (!state.ideas || !state.likes) {
      throw new Error('Partial existing schema; refusing to overwrite.');
    }
    // Supabase may grant new tables to API roles by default.
    await tx`REVOKE ALL ON public.idea_likes FROM anon, authenticated`;
    await tx`REVOKE UPDATE ON public.ideas FROM anon, authenticated`;
    await tx`GRANT UPDATE (author_name, title, description, category) ON public.ideas TO anon, authenticated`;
    await tx`SELECT id, author_name, title, description, category, like_count, created_at FROM public.ideas LIMIT 0`;
    await tx`SELECT public.my_likes('00000000-0000-0000-0000-000000000000'::uuid)`;
    const [permissions] = await tx`SELECT has_table_privilege('anon', 'public.idea_likes', 'SELECT') AS exposed, has_column_privilege('anon', 'public.ideas', 'like_count', 'UPDATE') AS counter_writable`;
    if (permissions.exposed || permissions.counter_writable) throw new Error('Unexpected public voting permissions.');
    console.log('Database schema and voting permissions verified.');
  });
} finally {
  await sql.end();
}
