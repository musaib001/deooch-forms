-- forms_public_read had no role restriction, so it silently granted every
-- authenticated user (including scoped 'free' accounts) read access to any
-- published form system-wide, bypassing the ownership scoping added in
-- 0004. Restrict it to the anon role — the only caller that should ever
-- rely on it (an unauthenticated visitor loading a public /f/[slug] link
-- before any session cookie exists). Authenticated reads now go through
-- forms_trusted_all / forms_free_own only, and the app's public-facing
-- routes (form render, submit) use the service-role client directly since
-- they're inherently public and shouldn't depend on the caller's own grant.

drop policy forms_public_read on public.forms;

create policy forms_public_read on public.forms for select
  to anon
  using (status = 'published');
