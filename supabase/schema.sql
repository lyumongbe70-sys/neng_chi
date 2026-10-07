-- =====================================================================
-- 🚀 건강 쇼핑몰(건강기능식품 전문몰) PostgreSQL 통합 스키마 & RLS 정책
-- Supabase Dashboard > SQL Editor에 복사하여 실행하세요.
-- =====================================================================

-- 0. 확장 기능 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------
-- 1. 회원 프로필 테이블 (profiles)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  points INTEGER NOT NULL DEFAULT 1000,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 2. 상품 카테고리 테이블 (categories)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 3. 상품 테이블 (products)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  category_id INTEGER REFERENCES public.categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  original_price INTEGER NOT NULL,
  sale_price INTEGER NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 100,
  is_one_plus_one BOOLEAN NOT NULL DEFAULT false,
  is_deal BOOLEAN NOT NULL DEFAULT false,
  deal_end_at TIMESTAMPTZ,
  badge_text TEXT,
  thumbnail_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 4. 장바구니 테이블 (carts)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- ---------------------------------------------------------------------
-- 5. 찜 목록 테이블 (wishlists)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- ---------------------------------------------------------------------
-- 6. 주문 테이블 (orders)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  total_amount INTEGER NOT NULL,
  discount_amount INTEGER NOT NULL DEFAULT 0,
  used_points INTEGER NOT NULL DEFAULT 0,
  final_amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'PAYMENT_PENDING' 
    CHECK (status IN ('PAYMENT_PENDING', 'PAID', 'PREPARING', 'SHIPPING', 'DELIVERED', 'CANCELLED', 'REFUND_REQUESTED', 'REFUNDED')),
  recipient_name TEXT NOT NULL,
  recipient_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  tracking_number TEXT,
  shipping_company TEXT,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('CARD', 'KAKAOPAY', 'TOSSPAY', 'BANK_TRANSFER')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 7. 주문 상세 품목 테이블 (order_items)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 8. 게시판 테이블 (boards)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('NOTICE', 'QNA', 'FREE', 'RESERVATION')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_secret BOOLEAN NOT NULL DEFAULT false,
  is_answered BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 9. 리뷰 테이블 (reviews)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content TEXT NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 10. 메인 팝업 공지 테이블 (popups)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.popups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT,
  link_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_date TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '30 days',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 🔄 auth.users 가입 시 public.profiles 자동 생성 트리거 함수
-- =====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, phone, role, points)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    'USER',
    1000 -- 신규 가입 웰컴 포인트 1000P 지급
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =====================================================================
-- 🛡️ Row Level Security (RLS) 정책 설정
-- =====================================================================

-- 1. profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_read_own_or_admin" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');

CREATE POLICY "profiles_update_own_or_admin" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN')
  WITH CHECK (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');

-- 2. categories RLS (공개 읽기 / 관리자 쓰기)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_public_read" ON public.categories
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "categories_admin_all" ON public.categories
  FOR ALL TO authenticated
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');

-- 3. products RLS (공개 읽기 / 관리자 쓰기)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_public_read" ON public.products
  FOR SELECT TO anon, authenticated
  USING (is_active = true OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');

CREATE POLICY "products_admin_all" ON public.products
  FOR ALL TO authenticated
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');

-- 4. carts RLS (본인 데이터 전용)
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "carts_manage_own" ON public.carts
  FOR ALL TO authenticated
  USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN')
  WITH CHECK (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');

-- 5. wishlists RLS (본인 데이터 전용)
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wishlists_manage_own" ON public.wishlists
  FOR ALL TO authenticated
  USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN')
  WITH CHECK (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');

-- 6. orders & order_items RLS (본인 주문 조회/생성, 관리자 전체)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_read_own" ON public.orders
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');

CREATE POLICY "orders_insert_own" ON public.orders
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders_admin_update" ON public.orders
  FOR UPDATE TO authenticated
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');

CREATE POLICY "order_items_read_own" ON public.order_items
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN')
    )
  );

CREATE POLICY "order_items_insert_own" ON public.order_items
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

-- 7. boards RLS (NOTICE 공개 읽기, 비밀글은 작성자 및 관리자만)
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "boards_read_rule" ON public.boards
  FOR SELECT TO anon, authenticated
  USING (
    type = 'NOTICE'
    OR is_secret = false
    OR (auth.uid() = user_id)
    OR ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN')
  );

CREATE POLICY "boards_insert_auth" ON public.boards
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "boards_modify_own_or_admin" ON public.boards
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');

CREATE POLICY "boards_delete_own_or_admin" ON public.boards
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');

-- 8. reviews RLS (공개 읽기, 본인 작성/삭제)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_public_read" ON public.reviews
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "reviews_manage_own" ON public.reviews
  FOR ALL TO authenticated
  USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN')
  WITH CHECK (auth.uid() = user_id);

-- 9. popups RLS (활성 팝업 공개 읽기, 관리자 관리)
ALTER TABLE public.popups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "popups_public_read" ON public.popups
  FOR SELECT TO anon, authenticated
  USING (is_active = true AND now() BETWEEN start_date AND end_date);

CREATE POLICY "popups_admin_all" ON public.popups
  FOR ALL TO authenticated
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');

-- =====================================================================
-- 📦 더미 카테고리 & 초기 테스트 상품 4개 INSERT
-- =====================================================================

-- 카테고리 삽입
INSERT INTO public.categories (id, name, slug) VALUES
  (1, '비타민', 'vitamin'),
  (2, '유산균', 'probiotics'),
  (3, '오메가3/콜라겐', 'omega3-collagen'),
  (4, '다이어트', 'diet')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug;

-- 초기 테스트 상품 4개 삽입
INSERT INTO public.products (
  id, category_id, title, description, original_price, sale_price, stock_quantity,
  is_one_plus_one, is_deal, deal_end_at, badge_text, thumbnail_url, images, is_active, rating, review_count
) VALUES
(
  'p-vitamin-01',
  1,
  '[1+1 기획] 활력 데일리 멀티비타민 미네랄 2000 (총 4개월분)',
  '비타민 B군 8종 2000% 고함량 설계, 활력 충전 데일리 비타민',
  68000,
  34000,
  150,
  true,
  true,
  now() + INTERVAL '12 hours 45 minutes',
  '타임특가 1+1',
  '/products/vitamin.jpg',
  '["/products/vitamin.jpg", "/products/vitamin-detail.jpg"]'::jsonb,
  true,
  4.92,
  1280
),
(
  'p-probiotics-01',
  2,
  '100억 생유산균 신바이오틱스 프리미엄 (2개월분)',
  '식약처 인정 100억 보장균수, 4중 특허 코팅 장까지 살아가는 생유산균',
  52000,
  36000,
  200,
  false,
  true,
  now() + INTERVAL '8 hours 30 minutes',
  '오늘의 골드특가',
  '/products/probiotics.jpg',
  '["/products/probiotics.jpg"]'::jsonb,
  true,
  4.95,
  2410
),
(
  'p-omega-01',
  3,
  '[1+1] 초임계 알티지(rTG) 오메가3 1000 + 저분자 피쉬콜라겐',
  'IFOS 5-Star 최고등급 엔초비 원료, 레몬오일로 비린내 완벽 차단',
  84000,
  42000,
  95,
  true,
  false,
  NULL,
  '재구매율 95%',
  '/products/omega.jpg',
  '["/products/omega.jpg"]'::jsonb,
  true,
  4.88,
  890
),
(
  'p-diet-01',
  4,
  '슬림 컷 가르시니아 & 카테킨 다이어트 부스터 (1개월분)',
  '탄수화물의 지방 합성 억제 및 체지방 감소에 도움을 줄 수 있는 식약처 인증 기능성',
  38000,
  28000,
  180,
  false,
  true,
  now() + INTERVAL '15 hours',
  '단독특가',
  '/products/diet.jpg',
  '["/products/diet.jpg"]'::jsonb,
  true,
  4.85,
  640
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  sale_price = EXCLUDED.sale_price,
  is_one_plus_one = EXCLUDED.is_one_plus_one,
  is_deal = EXCLUDED.is_deal;

-- 팝업 공지 더미 1건
INSERT INTO public.popups (title, image_url, link_url, is_active, start_date, end_date)
VALUES (
  '신규회원 가입 축하 웰컴 1,000P 적립 & 1+1 타임특가',
  '/popups/welcome-event.jpg',
  '/#deal',
  true,
  now() - INTERVAL '1 day',
  now() + INTERVAL '30 days'
);
