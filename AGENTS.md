# Agent rules
- Likes go only through the `toggle_like` / `my_likes` database functions; `idea_likes` has no client grants so voter IDs stay private.
- Allowed categories are enforced by a CHECK on `ideas.category` and mirrored in `src/lib/ideas.ts`; change both together.
- Pages wrap content in `AppShell`; keep `__root.tsx` providers-only (mockup previews render inside it).
- Everyone may edit/delete ideas, but UPDATE is granted only on content columns so `like_count` stays controlled by `toggle_like`.
