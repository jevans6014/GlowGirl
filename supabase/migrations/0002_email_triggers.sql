-- ============================================
-- GLOWGIRL — Email notification triggers
-- Run AFTER deploying the edge functions.
--
-- These use pg_net to POST the new row to each edge function.
-- Replace <PROJECT_REF> with your Supabase project ref (cvwprzwrfzpbykseqhnb)
-- and <ANON_KEY> with your anon/publishable key.
--
-- Alternatively, configure these as "Database Webhooks" in the
-- Supabase Dashboard (Database → Webhooks) pointing at each function —
-- that UI handles auth headers for you and is the recommended path.
-- ============================================

CREATE EXTENSION IF NOT EXISTS pg_net;

-- Helper: generic notifier
CREATE OR REPLACE FUNCTION public.notify_edge_function(fn text, payload jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://<PROJECT_REF>.supabase.co/functions/v1/' || fn,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer <ANON_KEY>'
    ),
    body := payload
  );
END;
$$;

-- Contact messages
CREATE OR REPLACE FUNCTION public.on_contact_message()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  PERFORM public.notify_edge_function('send-contact-notification', jsonb_build_object('record', to_jsonb(NEW)));
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_contact_message ON public.contact_messages;
CREATE TRIGGER trg_contact_message
  AFTER INSERT ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.on_contact_message();

-- Event inquiries
CREATE OR REPLACE FUNCTION public.on_event_inquiry()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  PERFORM public.notify_edge_function('send-event-notification', jsonb_build_object('record', to_jsonb(NEW)));
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_event_inquiry ON public.event_inquiries;
CREATE TRIGGER trg_event_inquiry
  AFTER INSERT ON public.event_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.on_event_inquiry();

-- Newsletter subscribers
CREATE OR REPLACE FUNCTION public.on_newsletter_subscribe()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  PERFORM public.notify_edge_function('send-newsletter-welcome', jsonb_build_object('record', to_jsonb(NEW)));
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_newsletter_subscribe ON public.newsletter_subscribers;
CREATE TRIGGER trg_newsletter_subscribe
  AFTER INSERT ON public.newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION public.on_newsletter_subscribe();
