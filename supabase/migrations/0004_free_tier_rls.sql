-- Opens login to any Google account. Owner + invited Members keep unlimited,
-- team-wide access (existing behavior). Anyone else who logs in becomes a
-- 'free' self-signup user, scoped to only their own forms/submissions, with
-- quotas enforced at the application layer (see src/lib/forms/limits.ts).

drop policy forms_team_all on public.forms;

create policy forms_trusted_all on public.forms for all
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('owner', 'member')
  ));

create policy forms_free_own on public.forms for all
  using (
    created_by = auth.uid()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'free')
  )
  with check (
    created_by = auth.uid()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'free')
  );

drop policy form_versions_team_all on public.form_versions;

create policy form_versions_trusted_all on public.form_versions for all
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('owner', 'member')
  ));

create policy form_versions_free_own on public.form_versions for all
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'free')
    and exists (
      select 1 from public.forms f
      where f.id = form_versions.form_id and f.created_by = auth.uid()
    )
  );

drop policy submissions_team_select on public.submissions;

create policy submissions_trusted_select on public.submissions for select
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('owner', 'member')
  ));

create policy submissions_free_own_select on public.submissions for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'free')
    and exists (
      select 1 from public.forms f
      where f.id = submissions.form_id and f.created_by = auth.uid()
    )
  );
