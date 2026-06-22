-- ============================================================
-- FIX: Infinite Recursion in RLS Policies
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================================

-- Step 1: Create helper function (SECURITY DEFINER bypasses RLS)
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

-- Step 2: Drop ALL existing policies on profiles
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_self" ON profiles;

-- Step 3: Recreate profiles policies using the helper function
CREATE POLICY "profiles_select_own"
    ON profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id OR public.is_admin(auth.uid()));

CREATE POLICY "profiles_update_own"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id OR public.is_admin(auth.uid()))
    WITH CHECK (auth.uid() = id OR public.is_admin(auth.uid()));

CREATE POLICY "profiles_insert_self"
    ON profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Step 4: Drop ALL existing policies on products
DROP POLICY IF EXISTS "products_select_all" ON products;
DROP POLICY IF EXISTS "products_insert_admin" ON products;
DROP POLICY IF EXISTS "products_update_admin" ON products;
DROP POLICY IF EXISTS "products_delete_admin" ON products;

-- Step 5: Recreate products policies using the helper function
CREATE POLICY "products_select_all"
    ON products FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "products_insert_admin"
    ON products FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "products_update_admin"
    ON products FOR UPDATE
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "products_delete_admin"
    ON products FOR DELETE
    TO authenticated
    USING (public.is_admin(auth.uid()));

-- Step 6: Drop ALL existing policies on orders
DROP POLICY IF EXISTS "orders_select" ON orders;
DROP POLICY IF EXISTS "orders_insert" ON orders;
DROP POLICY IF EXISTS "orders_update_admin" ON orders;
DROP POLICY IF EXISTS "orders_delete_admin" ON orders;

-- Step 7: Recreate orders policies using the helper function
CREATE POLICY "orders_select"
    ON orders FOR SELECT
    TO authenticated
    USING (member_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "orders_insert"
    ON orders FOR INSERT
    TO authenticated
    WITH CHECK (member_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "orders_update_admin"
    ON orders FOR UPDATE
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "orders_delete_admin"
    ON orders FOR DELETE
    TO authenticated
    USING (public.is_admin(auth.uid()));

-- Step 8: Drop ALL existing policies on order_items
DROP POLICY IF EXISTS "order_items_select" ON order_items;
DROP POLICY IF EXISTS "order_items_insert" ON order_items;
DROP POLICY IF EXISTS "order_items_update_admin" ON order_items;
DROP POLICY IF EXISTS "order_items_delete_admin" ON order_items;

-- Step 9: Recreate order_items policies using the helper function
CREATE POLICY "order_items_select"
    ON order_items FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM orders WHERE orders.id = order_items.order_id
        AND (orders.member_id = auth.uid() OR public.is_admin(auth.uid()))
    ));

CREATE POLICY "order_items_insert"
    ON order_items FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM orders WHERE orders.id = order_items.order_id
        AND (orders.member_id = auth.uid() OR public.is_admin(auth.uid()))
    ));

CREATE POLICY "order_items_update_admin"
    ON order_items FOR UPDATE
    TO authenticated
    USING (public.is_admin(auth.uid()));

CREATE POLICY "order_items_delete_admin"
    ON order_items FOR DELETE
    TO authenticated
    USING (public.is_admin(auth.uid()));
