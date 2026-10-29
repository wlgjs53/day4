-- 상점 + 장바구니 테이블
-- Supabase 대시보드 > SQL Editor > New query 에 이 파일 전체를 붙여넣고
-- Run 버튼(또는 Ctrl+Enter)을 누르세요. 여러 번 실행해도 안전합니다.

-- 1) 상품 테이블 (누구나 읽기 가능, 수정은 대시보드 Table Editor 에서)
create table if not exists public.products (
  id bigint generated always as identity primary key,
  name text not null unique,
  description text not null default '',
  price integer not null check (price >= 0),   -- 원 단위
  emoji text not null default '🍊',            -- 이미지가 없을 때 보여줄 아이콘
  image_url text,                              -- 상품 이미지 주소(선택)
  category text not null default '기타',
  is_active boolean not null default true,     -- false 로 바꾸면 상점에서 숨겨짐
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "products_read_all" on public.products;
create policy "products_read_all" on public.products
  for select using (is_active = true);

-- 2) 장바구니 테이블 (본인 것만 조회/추가/수정/삭제)
create table if not exists public.cart_items (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  product_id bigint not null references public.products(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0 and quantity <= 99),
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

alter table public.cart_items enable row level security;

drop policy if exists "cart_select_own" on public.cart_items;
create policy "cart_select_own" on public.cart_items
  for select using (auth.uid() = user_id);

drop policy if exists "cart_insert_own" on public.cart_items;
create policy "cart_insert_own" on public.cart_items
  for insert with check (auth.uid() = user_id);

drop policy if exists "cart_update_own" on public.cart_items;
create policy "cart_update_own" on public.cart_items
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "cart_delete_own" on public.cart_items;
create policy "cart_delete_own" on public.cart_items
  for delete using (auth.uid() = user_id);

-- 3) 예시 상품 (나중에 Table Editor 에서 자유롭게 수정/삭제하세요)
insert into public.products (name, description, price, emoji, category) values
  ('제주 한라봉 선물세트 3kg', '꼭지가 볼록한 제주 한라봉. 새콤달콤한 오렌지빛 선물 박스.', 29000, '🍊', '먹거리'),
  ('돌하르방 미니어처', '현무암 느낌으로 만든 책상 위 수호신. 높이 약 10cm.', 15000, '🗿', '굿즈'),
  ('감귤 초콜릿 12입', '제주 감귤 필링을 넣은 한입 초콜릿.', 12000, '🍫', '먹거리'),
  ('해녀 에코백', '바다빛 해녀 일러스트가 들어간 면 에코백.', 18000, '👜', '굿즈'),
  ('동백 핸드크림', '동백 오일이 들어간 촉촉한 핸드크림 50ml.', 9000, '🌺', '뷰티'),
  ('제주 조랑말 키링', '초원을 달리는 조랑말 아크릴 키링.', 7000, '🐴', '굿즈')
on conflict (name) do nothing;
