-- Core schema for deoochform: profiles/invites for a single flat team,
-- forms + versions, submissions, and API tokens for MCP auth.

create extension if not exists pgcrypto;

create type user_role as enum ('owner', 'member');
create type field_type as enum ('text','textarea','email','number','select','radio','checkbox','date','file');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role user_role not null default 'member',
  created_at timestamptz not null default now()
);

create table public.invites (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  invited_by uuid not null references public.profiles(id),
  accepted boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.forms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  fields jsonb not null default '[]'::jsonb,
  status text not null default 'published' check (status in ('draft','published','closed')),
  created_by uuid not null references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.form_versions (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.forms(id) on delete cascade,
  fields jsonb not null,
  edited_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.forms(id) on delete cascade,
  answers jsonb not null,
  respondent_meta jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now()
);

create table public.api_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  token_hash text not null unique,
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index forms_created_by_idx on public.forms (created_by);
create index submissions_form_id_submitted_at_idx on public.submissions (form_id, submitted_at desc);
create index api_tokens_token_hash_idx on public.api_tokens (token_hash) where revoked_at is null;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger forms_set_updated_at
  before update on public.forms
  for each row execute function public.set_updated_at();
