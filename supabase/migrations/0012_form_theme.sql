-- Presentation settings for a form. Both nullable: existing forms predate them
-- and fall back to the default theme with no cover.
--
-- `theme` is a slug from lib/forms/themes.ts, not a colour value — the palette
-- lives in code so re-theming the app doesn't require a data migration, and an
-- unknown slug degrades to the default rather than rendering a broken form.
alter table public.forms
  add column theme text,
  add column cover_url text;

-- Public bucket, unlike submission-uploads: a cover image is rendered to every
-- anonymous respondent, so it can't sit behind the owner-authorized download
-- route. Only form owners can write to it; anyone can read.
insert into storage.buckets (id, name, public)
values ('form-assets', 'form-assets', true)
on conflict (id) do nothing;

-- Uploads go through the owner's own session client (not service-role), so
-- storage RLS is what actually enforces "signed in to write".
create policy "form assets are publicly readable"
  on storage.objects for select
  using (bucket_id = 'form-assets');

create policy "authenticated users can upload form assets"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'form-assets');
