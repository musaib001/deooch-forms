-- Workspace organisation: Favorites, Archive, Trash.
--
-- Scope note: the Jotform-style sidebar also shows "Shared with me",
-- "Assigned to me", "Sent", "Labels" and "Team Workspaces". Those need a real
-- sharing/assignment/label model and are deliberately NOT built here — only
-- the parts that can be backed by real data are added, so no nav item leads
-- nowhere. "Drafts" already works via forms.status = 'draft'.

-- Soft delete (Trash) and Archive live on the form itself: both are states of
-- the form, not per-user opinions.
alter table public.forms
  add column deleted_at timestamptz,
  add column archived_at timestamptz;

-- Favorites are per-user: two members can disagree about what matters to them,
-- so this can't be a column on forms.
create table public.form_favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  form_id uuid not null references public.forms(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, form_id)
);

alter table public.form_favorites enable row level security;

create policy form_favorites_self on public.form_favorites for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Partial indexes: the dashboard's default view filters deleted_at is null on
-- every load, and Trash/Archive are comparatively rare reads.
create index forms_active_idx on public.forms (created_at desc)
  where deleted_at is null and archived_at is null;
create index forms_deleted_idx on public.forms (deleted_at) where deleted_at is not null;
