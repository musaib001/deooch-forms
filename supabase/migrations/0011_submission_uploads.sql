-- Private bucket for respondent file uploads. Kept private: form uploads can
-- contain PII (resumes, IDs), so files are only reachable through the
-- owner-authorized download endpoint, which mints short-lived signed URLs.
-- All reads/writes go through the service-role client, so no storage RLS
-- policies are needed here.
insert into storage.buckets (id, name, public)
values ('submission-uploads', 'submission-uploads', false)
on conflict (id) do nothing;
