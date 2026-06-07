-- ============================================================
-- 0003_rls_hardening.sql
-- Locks down RLS so customer PII (orders, appointments, contact
-- messages, etc.) is readable ONLY by admins, and the anon role
-- can no longer read full appointment rows.
--
-- Run AFTER 0001_shop_booking.sql and 0002_email_triggers.sql.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Admin identity: a small allowlist table + helper function.
--    After creating the owner auth user, insert their UID:
--      insert into public.admin_users (user_id) values ('<auth-user-uuid>');
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
-- No client policies: only service_role / SQL editor can manage this table.
GRANT ALL ON public.admin_users TO service_role;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ------------------------------------------------------------
-- 2. Public availability without leaking PII.
--    Returns ONLY booked date/time so the client can grey out
--    taken slots. Replaces the old "anon can read appointments".
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_booked_slots()
RETURNS TABLE (appointment_date date, appointment_time time)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT appointment_date, appointment_time
  FROM public.appointments
  WHERE status <> 'cancelled';
$$;

REVOKE ALL ON FUNCTION public.get_booked_slots() FROM public;
GRANT EXECUTE ON FUNCTION public.get_booked_slots() TO anon, authenticated;

-- ------------------------------------------------------------
-- 3. Replace over-permissive read policies with admin-only reads.
-- ------------------------------------------------------------

-- ORDERS ---------------------------------------------------
DROP POLICY IF EXISTS "Authenticated can read orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can read orders" ON public.orders;
CREATE POLICY "Admins can read orders" ON public.orders
  FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ORDER ITEMS ----------------------------------------------
DROP POLICY IF EXISTS "Authenticated can read order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can read order items" ON public.order_items;
CREATE POLICY "Admins can read order items" ON public.order_items
  FOR SELECT TO authenticated USING (public.is_admin());

-- APPOINTMENTS ---------------------------------------------
-- Remove the PII-leaking anon read + the blanket authenticated read.
DROP POLICY IF EXISTS "Public can read appointment slots" ON public.appointments;
DROP POLICY IF EXISTS "Authenticated can read appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can read appointments" ON public.appointments;
CREATE POLICY "Admins can read appointments" ON public.appointments
  FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update appointments" ON public.appointments;
CREATE POLICY "Admins can update appointments" ON public.appointments
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- CONTACT MESSAGES (was: no admin read policy at all) -------
DROP POLICY IF EXISTS "Admins can read contact messages" ON public.contact_messages;
CREATE POLICY "Admins can read contact messages" ON public.contact_messages
  FOR SELECT TO authenticated USING (public.is_admin());

-- EVENT INQUIRIES ------------------------------------------
DROP POLICY IF EXISTS "Admins can read event inquiries" ON public.event_inquiries;
CREATE POLICY "Admins can read event inquiries" ON public.event_inquiries
  FOR SELECT TO authenticated USING (public.is_admin());

-- NEWSLETTER SUBSCRIBERS -----------------------------------
DROP POLICY IF EXISTS "Admins can read subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can read subscribers" ON public.newsletter_subscribers
  FOR SELECT TO authenticated USING (public.is_admin());

-- ------------------------------------------------------------
-- 4. Grants. Authenticated needs table-level privileges; the
--    is_admin() policies above still gate the actual rows.
-- ------------------------------------------------------------
GRANT SELECT ON public.contact_messages TO authenticated;
GRANT SELECT ON public.event_inquiries TO authenticated;
GRANT SELECT ON public.newsletter_subscribers TO authenticated;
GRANT UPDATE ON public.orders TO authenticated;
GRANT UPDATE ON public.appointments TO authenticated;

-- NOTE: anon no longer has any SELECT on appointments — availability
-- must be fetched via public.get_booked_slots().
