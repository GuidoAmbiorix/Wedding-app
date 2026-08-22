-- Wedding Website Schema
-- Run this in Supabase SQL Editor

-- Weddings table (main config)
create table if not exists weddings (
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
create table if not exists guests (
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
create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid references guests(id) on delete cascade,
  status text check (status in ('pending','attending','declined','maybe')) default 'pending',
  plus_one_confirmed boolean default false,
  plus_one_name text,
  meal_choice text check (meal_choice in ('chicken','beef','fish','vegetarian','vegan')),
  message text,
  responded_at timestamptz,
  created_at timestamptz default now()
);

-- Events table
create table if not exists events (
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
create table if not exists albums (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

-- Gallery photos table
create table if not exists gallery_photos (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  caption text,
  year text,
  album_id uuid references albums(id) on delete set null,
  sort_order integer default 0,
  uploaded_at timestamptz default now()
);

-- Registry table
create table if not exists registry (
  id uuid primary key default gen_random_uuid(),
  store_name text not null,
  store_url text,
  logo_url text,
  description text,
  created_at timestamptz default now()
);

-- FAQ table
create table if not exists faq (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Accommodations table
create table if not exists accommodations (
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
create table if not exists guestbook (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  message text not null,
  photo_url text,
  approved boolean default false,
  created_at timestamptz default now()
);

-- Enable Row Level Security (public read for RSVP page)
alter table weddings enable row level security;
alter table guests enable row level security;
alter table rsvps enable row level security;
alter table events enable row level security;
alter table gallery_photos enable row level security;
alter table albums enable row level security;
alter table registry enable row level security;
alter table faq enable row level security;
alter table accommodations enable row level security;
alter table guestbook enable row level security;
alter table wedding_party enable row level security;

-- Policies: allow anon to read public data
create policy "Public read weddings" on weddings for select using (true);
create policy "Public read events" on events for select using (true);
create policy "Public read gallery" on gallery_photos for select using (true);
create policy "Public read albums" on albums for select using (true);
create policy "Public read registry" on registry for select using (true);
create policy "Public read faq" on faq for select using (true);
create policy "Public read accommodations" on accommodations for select using (true);
create policy "Public read approved guestbook" on guestbook for select using (approved = true);
create policy "Public read wedding_party" on wedding_party for select using (true);

-- Guests: only readable by token match (handled in app)
create policy "Public read guests by token" on guests for select using (true);

-- RSVPs: guests can insert/update their own
create policy "Anyone can read rsvps" on rsvps for select using (true);
create policy "Anyone can insert rsvp" on rsvps for insert with check (true);
create policy "Anyone can update rsvp" on rsvps for update using (true);

-- Guestbook: anyone can insert (admin approves)
create policy "Anyone can insert guestbook" on guestbook for insert with check (true);
create policy "Anyone can insert guests" on guests for insert with check (true);
create policy "Anyone can update guests" on guests for update using (true);
create policy "Anyone can insert events" on events for insert with check (true);
create policy "Anyone can update events" on events for update using (true);
create policy "Anyone can delete events" on events for delete using (true);
create policy "Anyone can insert registry" on registry for insert with check (true);
create policy "Anyone can update registry" on registry for update using (true);
create policy "Anyone can delete registry" on registry for delete using (true);
create policy "Anyone can insert faq" on faq for insert with check (true);
create policy "Anyone can update faq" on faq for update using (true);
create policy "Anyone can delete faq" on faq for delete using (true);
create policy "Anyone can insert accommodations" on accommodations for insert with check (true);
create policy "Anyone can update accommodations" on accommodations for update using (true);
create policy "Anyone can delete accommodations" on accommodations for delete using (true);
create policy "Anyone can insert gallery" on gallery_photos for insert with check (true);
create policy "Anyone can update gallery" on gallery_photos for update using (true);
create policy "Anyone can delete gallery" on gallery_photos for delete using (true);
create policy "Anyone can update weddings" on weddings for update using (true);
create policy "Anyone can insert weddings" on weddings for insert with check (true);
create policy "Anyone can update guestbook" on guestbook for update using (true);
create policy "Anyone can delete guests" on guests for delete using (true);
create policy "Anyone can insert wedding_party" on wedding_party for insert with check (true);
create policy "Anyone can update wedding_party" on wedding_party for update using (true);
create policy "Anyone can delete wedding_party" on wedding_party for delete using (true);
