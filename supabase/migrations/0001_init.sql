-- Alliance knowledge base — future database schema
-- Target: Supabase (PostgreSQL 15+)
-- The current site is static and uses file-based content. This migration is the
-- planned path for a member portal, per-user data and server-backed calculators.
--
-- Run in a fresh Supabase project's SQL editor or via the Supabase CLI.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.alliance_role as enum ('member', 'captain', 'officer', 'commander', 'admin');
create type public.content_type as enum ('event', 'guide', 'strategy');
create type public.content_status as enum ('draft', 'in_review', 'published', 'archived');
create type public.calendar_source as enum ('alliance_leadership', 'in_game_screen', 'community_guide', 'planning_template');
create type public.gallery_category as enum (
  'events', 'heroes', 'troops', 'buildings', 'research',
  'alliance_activities', 'strategies', 'battle_reports'
);

-- ---------------------------------------------------------------------------
-- Identity and alliances
-- ---------------------------------------------------------------------------

create table public.alliances (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tag text,
  server_label text,
  description text,
  discord_url text,
  contact_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  timezone text default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.alliance_members (
  alliance_id uuid not null references public.alliances (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.alliance_role not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (alliance_id, user_id)
);

create index alliance_members_user_idx on public.alliance_members (user_id);

-- ---------------------------------------------------------------------------
-- Content
-- ---------------------------------------------------------------------------

create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  alliance_id uuid not null references public.alliances (id) on delete cascade,
  type public.content_type not null,
  slug text not null,
  title text not null,
  summary text not null default '',
  category text,
  status public.content_status not null default 'draft',
  featured boolean not null default false,
  sort_order integer not null default 99,
  hero_image_path text,
  tags text[] not null default '{}',
  body text not null default '',           -- MDX or Markdown
  data jsonb not null default '{}'::jsonb, -- template-specific frontmatter
  reviewer_id uuid references public.profiles (id) on delete set null,
  published_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_vector tsvector generated always as (
    to_tsvector(
      'english',
      coalesce(title, '') || ' ' || coalesce(summary, '') || ' ' || coalesce(body, '')
    )
  ) stored,
  unique (alliance_id, type, slug)
);

create index content_items_search_idx on public.content_items using gin (search_vector);
create index content_items_listing_idx on public.content_items (alliance_id, type, status, sort_order);

create table public.content_revisions (
  id bigint generated always as identity primary key,
  content_id uuid not null references public.content_items (id) on delete cascade,
  title text not null,
  body text not null,
  data jsonb not null default '{}'::jsonb,
  edited_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index content_revisions_content_idx on public.content_revisions (content_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Calendar, gallery, FAQ
-- ---------------------------------------------------------------------------

create table public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  external_id text not null, -- stable string used by the current JSON and search index
  alliance_id uuid not null references public.alliances (id) on delete cascade,
  title text not null,
  description text not null default '',
  category text not null,
  phase text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  source public.calendar_source not null default 'alliance_leadership',
  overlap_with text[] not null default '{}',
  href text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (alliance_id, external_id),
  check (ends_at is null or ends_at >= starts_at)
);

create index calendar_events_window_idx on public.calendar_events (alliance_id, starts_at, ends_at);

create table public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  external_id text not null,
  alliance_id uuid not null references public.alliances (id) on delete cascade,
  title text not null,
  category public.gallery_category not null,
  storage_path text not null,
  width integer,
  height integer,
  description text not null default '',
  tags text[] not null default '{}',
  credit text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (alliance_id, external_id)
);

create table public.faq_items (
  id uuid primary key default gen_random_uuid(),
  external_id text not null,
  alliance_id uuid not null references public.alliances (id) on delete cascade,
  category text not null,
  question text not null,
  answer text not null,
  tags text[] not null default '{}',
  sort_order integer not null default 99,
  is_published boolean not null default true,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (alliance_id, external_id)
);

-- ---------------------------------------------------------------------------
-- Audit
-- ---------------------------------------------------------------------------

create table public.audit_logs (
  id bigint generated always as identity primary key,
  alliance_id uuid references public.alliances (id) on delete cascade,
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null,
  entity_type text,
  entity_id text,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Updated-at triggers
-- ---------------------------------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger alliances_touch before update on public.alliances
for each row execute function public.touch_updated_at();
create trigger profiles_touch before update on public.profiles
for each row execute function public.touch_updated_at();
create trigger content_items_touch before update on public.content_items
for each row execute function public.touch_updated_at();
create trigger calendar_events_touch before update on public.calendar_events
for each row execute function public.touch_updated_at();
create trigger gallery_images_touch before update on public.gallery_images
for each row execute function public.touch_updated_at();
create trigger faq_items_touch before update on public.faq_items
for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- RLS helpers (SECURITY DEFINER avoids recursive policy evaluation)
-- ---------------------------------------------------------------------------

create or replace function public.is_alliance_member(target_alliance uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.alliance_members m
    where m.alliance_id = target_alliance
      and m.user_id = auth.uid()
  );
$$;

create or replace function public.has_alliance_role(target_alliance uuid, allowed text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.alliance_members m
    where m.alliance_id = target_alliance
      and m.user_id = auth.uid()
      and m.role::text = any (allowed)
  );
$$;

revoke all on function public.is_alliance_member(uuid) from public;
revoke all on function public.has_alliance_role(uuid, text[]) from public;
grant execute on function public.is_alliance_member(uuid) to authenticated, anon;
grant execute on function public.has_alliance_role(uuid, text[]) to authenticated;

-- ---------------------------------------------------------------------------
-- Enable RLS
-- ---------------------------------------------------------------------------

alter table public.alliances enable row level security;
alter table public.profiles enable row level security;
alter table public.alliance_members enable row level security;
alter table public.content_items enable row level security;
alter table public.content_revisions enable row level security;
alter table public.calendar_events enable row level security;
alter table public.gallery_images enable row level security;
alter table public.faq_items enable row level security;
alter table public.audit_logs enable row level security;

-- ---------------------------------------------------------------------------
-- Profiles and alliance roster
-- ---------------------------------------------------------------------------

create policy "Profiles are visible to their alliance"
on public.profiles for select
to authenticated
using (
  id = auth.uid()
  or exists (
    select 1
    from public.alliance_members me
    join public.alliance_members them on them.alliance_id = me.alliance_id
    where me.user_id = auth.uid()
      and them.user_id = profiles.id
  )
);

create policy "Users can insert their own profile"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "Alliance roster is visible to members"
on public.alliance_members for select
to authenticated
using (user_id = auth.uid() or public.is_alliance_member(alliance_id));

create policy "Commanders manage alliance membership"
on public.alliance_members for all
to authenticated
using (public.has_alliance_role(alliance_id, array['commander', 'admin']))
with check (public.has_alliance_role(alliance_id, array['commander', 'admin']));

-- ---------------------------------------------------------------------------
-- Public content (published only) and editor access
-- ---------------------------------------------------------------------------

create policy "Published content is publicly readable"
on public.content_items for select
to anon, authenticated
using (status = 'published');

create policy "Alliance members can read drafts"
on public.content_items for select
to authenticated
using (public.is_alliance_member(alliance_id));

create policy "Captains and above manage content"
on public.content_items for all
to authenticated
using (public.has_alliance_role(alliance_id, array['captain', 'officer', 'commander', 'admin']))
with check (public.has_alliance_role(alliance_id, array['captain', 'officer', 'commander', 'admin']));

create policy "Editors manage revisions"
on public.content_revisions for all
to authenticated
using (
  exists (
    select 1 from public.content_items c
    where c.id = content_revisions.content_id
      and public.has_alliance_role(c.alliance_id, array['captain', 'officer', 'commander', 'admin'])
  )
)
with check (
  exists (
    select 1 from public.content_items c
    where c.id = content_revisions.content_id
      and public.has_alliance_role(c.alliance_id, array['captain', 'officer', 'commander', 'admin'])
  )
);

create policy "Published calendar is public"
on public.calendar_events for select
to anon, authenticated
using (true);

create policy "Officers manage calendar"
on public.calendar_events for all
to authenticated
using (public.has_alliance_role(alliance_id, array['officer', 'commander', 'admin']))
with check (public.has_alliance_role(alliance_id, array['officer', 'commander', 'admin']));

create policy "Published gallery is public"
on public.gallery_images for select
to anon, authenticated
using (true);

create policy "Officers manage gallery"
on public.gallery_images for all
to authenticated
using (public.has_alliance_role(alliance_id, array['officer', 'commander', 'admin']))
with check (public.has_alliance_role(alliance_id, array['officer', 'commander', 'admin']));

create policy "Published FAQ is public"
on public.faq_items for select
to anon, authenticated
using (is_published = true);

create policy "Captains and above manage FAQ"
on public.faq_items for all
to authenticated
using (public.has_alliance_role(alliance_id, array['captain', 'officer', 'commander', 'admin']))
with check (public.has_alliance_role(alliance_id, array['captain', 'officer', 'commander', 'admin']));

create policy "Alliance identity is public"
on public.alliances for select
to anon, authenticated
using (true);

create policy "Commanders update alliance settings"
on public.alliances for update
to authenticated
using (public.has_alliance_role(id, array['commander', 'admin']))
with check (public.has_alliance_role(id, array['commander', 'admin']));

-- ---------------------------------------------------------------------------
-- Audit
-- ---------------------------------------------------------------------------

create policy "Members can append audit events"
on public.audit_logs for insert
to authenticated
with check (
  actor_id = auth.uid()
  and (alliance_id is null or public.is_alliance_member(alliance_id))
);

create policy "Commanders can read audit logs"
on public.audit_logs for select
to authenticated
using (alliance_id is not null and public.has_alliance_role(alliance_id, array['commander', 'admin']));

-- ---------------------------------------------------------------------------
-- Storage bucket for member-uploaded screenshots
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('alliance-media', 'alliance-media', true)
on conflict (id) do nothing;

create policy "Public can view alliance media"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'alliance-media');

create policy "Alliance editors can upload media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'alliance-media');

create policy "Alliance editors can update media"
on storage.objects for update
to authenticated
using (bucket_id = 'alliance-media')
with check (bucket_id = 'alliance-media');

-- Note: tighten storage object policies with alliance-scoped folder paths
-- (for example `alliance_id/filename`) before enabling public uploads.
