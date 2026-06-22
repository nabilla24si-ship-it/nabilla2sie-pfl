-- ============================================================
-- SUPABASE SQL DDL - E-Commerce Admin & Member Dashboard
-- Paste this entire script into Supabase SQL Editor and run it.
-- ============================================================

-- ============================================================
-- 1. CREATE TABLES
-- ============================================================

-- 1.1 profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR NOT NULL,
    full_name VARCHAR,
    role VARCHAR NOT NULL DEFAULT 'Member' CHECK (role IN ('Admin', 'Member', 'Guest')),
    points INTEGER NOT NULL DEFAULT 0,
    tier VARCHAR NOT NULL DEFAULT 'Bronze' CHECK (tier IN ('Bronze', 'Silver', 'Gold', 'Platinum')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.2 products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    image_url VARCHAR,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.3 orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES profiles(id),
    total_amount NUMERIC NOT NULL,
    discount_applied NUMERIC NOT NULL DEFAULT 0,
    points_earned INTEGER NOT NULL DEFAULT 0,
    status VARCHAR NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.4 order_items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price_at_purchase NUMERIC NOT NULL
);

-- ============================================================
-- 2. ENABLE ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2.5 HELPER FUNCTION (prevents infinite recursion in RLS)
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles WHERE id = user_id AND role = 'Admin'
    );
$$;

-- ============================================================
-- 3. RLS POLICIES - PROFILES
-- ============================================================

-- SELECT: Users can see their own profile; Admins can see all
CREATE POLICY "profiles_select_own"
    ON profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id OR public.is_admin(auth.uid()));

-- UPDATE: Users can update their own profile; Admins can update all
CREATE POLICY "profiles_update_own"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id OR public.is_admin(auth.uid()))
    WITH CHECK (auth.uid() = id OR public.is_admin(auth.uid()));

-- INSERT: Allow insert for new user registration (trigger context uses service role, bypasses RLS)
CREATE POLICY "profiles_insert_self"
    ON profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- ============================================================
-- 4. RLS POLICIES - PRODUCTS
-- ============================================================

-- SELECT: Everyone (authenticated users of any role) can read products
CREATE POLICY "products_select_all"
    ON products FOR SELECT
    TO authenticated
    USING (true);

-- INSERT: Admin only
CREATE POLICY "products_insert_admin"
    ON products FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin(auth.uid()));

-- UPDATE: Admin only
CREATE POLICY "products_update_admin"
    ON products FOR UPDATE
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- DELETE: Admin only
CREATE POLICY "products_delete_admin"
    ON products FOR DELETE
    TO authenticated
    USING (public.is_admin(auth.uid()));

-- ============================================================
-- 5. RLS POLICIES - ORDERS
-- ============================================================

-- SELECT: Members see own orders; Admins see all
CREATE POLICY "orders_select"
    ON orders FOR SELECT
    TO authenticated
    USING (member_id = auth.uid() OR public.is_admin(auth.uid()));

-- INSERT: Members can create orders for themselves; Admins can create for anyone
CREATE POLICY "orders_insert"
    ON orders FOR INSERT
    TO authenticated
    WITH CHECK (member_id = auth.uid() OR public.is_admin(auth.uid()));

-- UPDATE: Admin only
CREATE POLICY "orders_update_admin"
    ON orders FOR UPDATE
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- DELETE: Admin only
CREATE POLICY "orders_delete_admin"
    ON orders FOR DELETE
    TO authenticated
    USING (public.is_admin(auth.uid()));

-- ============================================================
-- 6. RLS POLICIES - ORDER_ITEMS
-- ============================================================

-- SELECT: Same as orders (member sees own, admin sees all)
CREATE POLICY "order_items_select"
    ON order_items FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM orders WHERE orders.id = order_items.order_id
        AND (orders.member_id = auth.uid() OR public.is_admin(auth.uid()))
    ));

-- INSERT: Members (own orders) and Admin
CREATE POLICY "order_items_insert"
    ON order_items FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM orders WHERE orders.id = order_items.order_id
        AND (orders.member_id = auth.uid() OR public.is_admin(auth.uid()))
    ));

-- UPDATE: Admin only
CREATE POLICY "order_items_update_admin"
    ON order_items FOR UPDATE
    TO authenticated
    USING (public.is_admin(auth.uid()));

-- DELETE: Admin only
CREATE POLICY "order_items_delete_admin"
    ON order_items FOR DELETE
    TO authenticated
    USING (public.is_admin(auth.uid()));

-- ============================================================
-- 7. TRIGGER: Auto-create profile on user registration
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, points, tier)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'Member'),
        0,
        'Bronze'
    );
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 8. TRIGGER: Auto-update tier when points change
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_tier_on_points_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF NEW.points >= 3000 THEN
        NEW.tier := 'Platinum';
    ELSIF NEW.points >= 1500 THEN
        NEW.tier := 'Gold';
    ELSIF NEW.points >= 500 THEN
        NEW.tier := 'Silver';
    ELSE
        NEW.tier := 'Bronze';
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profiles_points_change ON profiles;
CREATE TRIGGER on_profiles_points_change
    BEFORE UPDATE OF points ON profiles
    FOR EACH ROW
    WHEN (OLD.points IS DISTINCT FROM NEW.points)
    EXECUTE FUNCTION public.update_tier_on_points_change();

-- ============================================================
-- 9. SEED DATA (Optional - Run separately if needed)
-- ============================================================

-- Insert sample products
INSERT INTO products (name, description, price, stock, image_url) VALUES
    ('Laptop Gaming Pro', 'High-performance gaming laptop with RTX 4060', 15000000, 20, NULL),
    ('Smartphone X1', 'Latest smartphone with 128GB storage', 8000000, 35, NULL),
    ('Wireless Headphone', 'Noise-cancelling Bluetooth headphone', 1500000, 50, NULL),
    ('Smartwatch Ultra', 'Fitness tracking smartwatch with GPS', 3500000, 25, NULL),
    ('Mechanical Keyboard', 'RGB mechanical keyboard with Cherry MX switches', 2000000, 40, NULL),
    ('Gaming Mouse', 'Ergonomic gaming mouse with 16000 DPI', 800000, 60, NULL),
    ('USB-C Hub', 'Multi-port USB-C hub with HDMI and ethernet', 500000, 100, NULL),
    ('Portable SSD 1TB', 'Fast portable SSD with USB 3.2', 1200000, 30, NULL),
    ('Monitor 27 inch', '4K IPS monitor for productivity', 5500000, 15, NULL),
    ('Webcam HD', '1080p webcam with auto-focus and noise reduction', 600000, 45, NULL);
