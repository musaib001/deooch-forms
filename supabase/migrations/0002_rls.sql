-- Row Level Security: single flat team (owner + members) has full access
-- to team data; anonymous respondents can read published forms and insert
-- submissions only.

alter table public.profiles enable row level security;
alter table public.invites enable row level security;
alter table public.forms enable row level security;
alter table public.form_versions enable row level security;
alter table public.submissions enable row level security;
alter table public.api_tokens enable row level security;

create policy profiles_select on public.profiles for select
  using (auth.uid() is not null);

create policy profiles_update_self on public.profiles for update
  using (id = auth.uid());

create policy invites_owner_all on public.invites for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner'));

create policy forms_team_all on public.forms for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid()));

create policy forms_public_read on public.forms for select
  using (status = 'published');

create policy form_versions_team_all on public.form_versions for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid()));

create policy submissions_team_select on public.submissions for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid()));

create policy submissions_public_insert on public.submissions for insert
  with check (true);

create policy api_tokens_self on public.api_tokens for all
  using (
    user_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner')
  );
