-- ============================================================
-- DispatchAI — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- COMPANIES (tenants)
-- ============================================================
create table if not exists companies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  plan text not null default 'starter' check (plan in ('starter', 'professional', 'enterprise')),
  seats_total int not null default 3,
  seats_used int not null default 1,
  domain text,
  logo_url text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- USERS (extends auth.users)
-- ============================================================
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  company_id uuid references companies(id) on delete set null,
  role text not null default 'member' check (role in ('admin', 'member')),
  created_at timestamptz not null default now()
);

-- Auto-create user record on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- BROKER RULES
-- ============================================================
create table if not exists broker_rules (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references companies(id) on delete cascade,
  broker_name text not null,
  rules_text text not null default '',
  contacts text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- TEMPLATES
-- ============================================================
create table if not exists templates (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references companies(id) on delete cascade,
  name text not null,
  content text not null default '',
  trigger_keywords text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- CHAT SESSIONS
-- ============================================================
create table if not exists chat_sessions (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references companies(id) on delete cascade,
  user_id uuid references public.users(id) on delete set null,
  title text not null default 'New chat',
  created_at timestamptz not null default now()
);

-- ============================================================
-- CHAT MESSAGES
-- ============================================================
create table if not exists chat_messages (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references chat_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null default '',
  tokens_used int,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table companies enable row level security;
alter table public.users enable row level security;
alter table broker_rules enable row level security;
alter table templates enable row level security;
alter table chat_sessions enable row level security;
alter table chat_messages enable row level security;

-- Companies: users see their own
create policy "Users see own company"
  on companies for select
  using (auth.uid() = id);

-- Users: users see their own record
create policy "Users see own profile"
  on public.users for select
  using (auth.uid() = id);

-- Users: users update their own profile
create policy "Users update own profile"
  on public.users for update
  using (auth.uid() = id);

-- Broker rules: company members see their company's rules
create policy "Company members see broker rules"
  on broker_rules for select
  using (
    company_id in (
      select company_id from public.users where id = auth.uid()
    )
  );

create policy "Company members add broker rules"
  on broker_rules for insert
  with check (
    company_id in (
      select company_id from public.users where id = auth.uid()
    )
  );

create policy "Company members update broker rules"
  on broker_rules for update
  using (
    company_id in (
      select company_id from public.users where id = auth.uid()
    )
  );

create policy "Company members delete broker rules"
  on broker_rules for delete
  using (
    company_id in (
      select company_id from public.users where id = auth.uid()
    )
  );

-- Templates: same RLS as broker_rules
create policy "Company members see templates"
  on templates for select
  using (
    company_id in (
      select company_id from public.users where id = auth.uid()
    )
  );

create policy "Company members add templates"
  on templates for insert
  with check (
    company_id in (
      select company_id from public.users where id = auth.uid()
    )
  );

create policy "Company members update templates"
  on templates for update
  using (
    company_id in (
      select company_id from public.users where id = auth.uid()
    )
  );

create policy "Company members delete templates"
  on templates for delete
  using (
    company_id in (
      select company_id from public.users where id = auth.uid()
    )
  );

-- Chat sessions: same company
create policy "Company members see chat sessions"
  on chat_sessions for select
  using (
    company_id in (
      select company_id from public.users where id = auth.uid()
    )
  );

create policy "Company members create chat sessions"
  on chat_sessions for insert
  with check (
    company_id in (
      select company_id from public.users where id = auth.uid()
    )
  );

-- Chat messages: via session company
create policy "Company members see chat messages"
  on chat_messages for select
  using (
    session_id in (
      select id from chat_sessions where company_id in (
        select company_id from public.users where id = auth.uid()
      )
    )
  );

create policy "Company members add chat messages"
  on chat_messages for insert
  with check (
    session_id in (
      select id from chat_sessions where company_id in (
        select company_id from public.users where id = auth.uid()
      )
    )
  );

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists broker_rules_company_idx on broker_rules(company_id);
create index if not exists templates_company_idx on templates(company_id);
create index if not exists chat_sessions_company_idx on chat_sessions(company_id);
create index if not exists chat_messages_session_idx on chat_messages(session_id);
create index if not exists users_company_idx on public.users(company_id);
