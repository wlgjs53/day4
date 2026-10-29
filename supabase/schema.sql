-- Supabase 대시보드 > SQL Editor 에 붙여넣고 Run 하세요.
-- 로그인한 사용자가 마음에 든 사진을 즐겨찾기(하트) 하는 테이블입니다.

create table if not exists public.favorites (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  image_id bigint not null,
  preview_url text not null,
  large_url text not null,
  tags text,
  photographer text,
  page_url text,
  created_at timestamptz not null default now(),
  unique (user_id, image_id)
);

-- 행 수준 보안(RLS): 본인 데이터만 읽고/쓰고/지울 수 있게 합니다.
alter table public.favorites enable row level security;

create policy "favorites_select_own" on public.favorites
  for select using (auth.uid() = user_id);

create policy "favorites_insert_own" on public.favorites
  for insert with check (auth.uid() = user_id);

create policy "favorites_delete_own" on public.favorites
  for delete using (auth.uid() = user_id);
