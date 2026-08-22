-- Wedding Website Schema
-- Run this in Supabase SQL Editor

-- Weddings table (main config)
create table if not exists wedding_info (
  id uuid primary key default gen_random_uuid(),
  couple_name_1 text not null,
  couple_name_2 text not null,
  wedding_date date not null,
  venue text,
  venue_address text,
  cover_photo_url text,
  cover_video_url text,
  story text,
  theme text default 'ivory',
  created_at timestamptz default now()
);

-- Guests table
create table if not exists wedding_guests (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  plus_one_allowed boolean default false,
  plus_one_name text,
  table_name text,
  guest_group text check (guest_group in ('family','friends','bride','groom','coworkers','other')),
  dietary_restrictions text,
  notes text,
  rsvp_token text unique default encode(gen_random_bytes(16), 'hex'),
  invitation_sent_at timestamptz,
  created_at timestamptz default now()
);

-- RSVPs table
create table if not exists wedding_rsvps (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid references wedding_guests(id) on delete cascade,
  status text check (status in ('pending','attending','declined','maybe')) default 'pending',
  plus_one_confirmed boolean default false,
  plus_one_name text,
  meal_choice text check (meal_choice in ('chicken','beef','fish','vegetarian','vegan')),
  message text,
  responded_at timestamptz,
  created_at timestamptz default now()
);

-- Events table
create table if not exists wedding_events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  event_date date,
  event_time time,
  venue text,
  address text,
  dress_code text,
  notes text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Albums table
create table if not exists wedding_albums (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

-- Gallery photos table
create table if not exists wedding_gallery_photos (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  caption text,
  year text,
  album_id uuid references wedding_albums(id) on delete set null,
  sort_order integer default 0,
  uploaded_at timestamptz default now()
);

-- Registry table
create table if not exists wedding_registry (
  id uuid primary key default gen_random_uuid(),
  store_name text not null,
  store_url text,
  logo_url text,
  description text,
  created_at timestamptz default now()
);

-- FAQ table
create table if not exists wedding_faq (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Accommodations table
create table if not exists wedding_accommodations (
  id uuid primary key default gen_random_uuid(),
  hotel_name text not null,
  address text,
  url text,
  promo_code text,
  price_range text,
  distance_km numeric,
  created_at timestamptz default now()
);

-- Wedding party table (padrinos, damas, etc.)
create table if not exists wedding_party (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role_label text,
  role_group text check (role_group in ('honor','bridesmaid','groomsman')) default 'bridesmaid',
  photo_url text,
  bio text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Guestbook table
create table if not exists wedding_guestbook (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  message text not null,
  photo_url text,
  approved boolean default false,
  created_at timestamptz default now()
);

-- Enable Row Level Security (public read for RSVP page)
alter table wedding_info enable row level security;
alter table wedding_guests enable row level security;
alter table wedding_rsvps enable row level security;
alter table wedding_events enable row level security;
alter table wedding_gallery_photos enable row level security;
alter table wedding_albums enable row level security;
alter table wedding_registry enable row level security;
alter table wedding_faq enable row level security;
alter table wedding_accommodations enable row level security;
alter table wedding_guestbook enable row level security;
alter table wedding_party enable row level security;

-- Policies: allow anon to read public data
create policy "Public read wedding_info" on wedding_info for select using (true);
create policy "Public read wedding_events" on wedding_events for select using (true);
create policy "Public read wedding_gallery" on wedding_gallery_photos for select using (true);
create policy "Public read wedding_albums" on wedding_albums for select using (true);
create policy "Public read wedding_registry" on wedding_registry for select using (true);
create policy "Public read wedding_faq" on wedding_faq for select using (true);
create policy "Public read wedding_accommodations" on wedding_accommodations for select using (true);
create policy "Public read approved wedding_guestbook" on wedding_guestbook for select using (approved = true);
create policy "Public read wedding_party" on wedding_party for select using (true);

-- Guests: only readable by token match (handled in app)
create policy "Public read wedding_guests by token" on wedding_guests for select using (true);

-- RSVPs: guests can insert/update their own
create policy "Anyone can read wedding_rsvps" on wedding_rsvps for select using (true);
create policy "Anyone can insert wedding_rsvp" on wedding_rsvps for insert with check (true);
create policy "Anyone can update wedding_rsvp" on wedding_rsvps for update using (true);

-- Guestbook: anyone can insert (admin approves)
create policy "Anyone can insert wedding_guestbook" on wedding_guestbook for insert with check (true);
create policy "Anyone can insert wedding_guests" on wedding_guests for insert with check (true);
create policy "Anyone can update wedding_guests" on wedding_guests for update using (true);
create policy "Anyone can insert wedding_events" on wedding_events for insert with check (true);
create policy "Anyone can update wedding_events" on wedding_events for update using (true);
create policy "Anyone can delete wedding_events" on wedding_events for delete using (true);
create policy "Anyone can insert wedding_registry" on wedding_registry for insert with check (true);
create policy "Anyone can update wedding_registry" on wedding_registry for update using (true);
create policy "Anyone can delete wedding_registry" on wedding_registry for delete using (true);
create policy "Anyone can insert wedding_faq" on wedding_faq for insert with check (true);
create policy "Anyone can update wedding_faq" on wedding_faq for update using (true);
create policy "Anyone can delete wedding_faq" on wedding_faq for delete using (true);
create policy "Anyone can insert wedding_accommodations" on wedding_accommodations for insert with check (true);
create policy "Anyone can update wedding_accommodations" on wedding_accommodations for update using (true);
create policy "Anyone can delete wedding_accommodations" on wedding_accommodations for delete using (true);
create policy "Anyone can insert wedding_gallery" on wedding_gallery_photos for insert with check (true);
create policy "Anyone can update wedding_gallery" on wedding_gallery_photos for update using (true);
create policy "Anyone can delete wedding_gallery" on wedding_gallery_photos for delete using (true);
create policy "Anyone can update wedding_info" on wedding_info for update using (true);
create policy "Anyone can insert wedding_info" on wedding_info for insert with check (true);
create policy "Anyone can update wedding_guestbook" on wedding_guestbook for update using (true);
create policy "Anyone can delete wedding_guests" on wedding_guests for delete using (true);
create policy "Anyone can insert wedding_party" on wedding_party for insert with check (true);
create policy "Anyone can update wedding_party" on wedding_party for update using (true);
create policy "Anyone can delete wedding_party" on wedding_party for delete using (true);
