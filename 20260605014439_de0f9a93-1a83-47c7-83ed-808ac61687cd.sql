CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send a message" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE TABLE public.event_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  event_type text,
  event_date date,
  guests integer,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.event_inquiries TO anon, authenticated;
GRANT ALL ON public.event_inquiries TO service_role;
ALTER TABLE public.event_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an event inquiry" ON public.event_inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);

Modified
bun.lock
        "@radix-ui/react-toggle-group": "^1.1.11",
        "@radix-ui/react-tooltip": "^1.2.8",
        "@supabase/supabase-js": "^2.107.0",
        "@tailwindcss/vite": "^4.2.1",
        "@tanstack/react-query": "^5.83.0",
        "date-fns": "^4.1.0",
        "embla-carousel-react": "^8.6.0",
        "framer-motion": "^12.40.0",
        "input-otp": "^1.4.2",
        "lucide-react": "^0.575.0",
    "@standard-schema/utils": ["@standard-schema/utils@0.3.0", "", {}, "sha512-e7Mew686owMaPJVNNLs55PUvgz371nKgwsc4vxE49zsODpJEnxgxRo2y/OKrqueavXgZNMDVj3DdHFlaSAeU8g=="],
    "@supabase/auth-js": ["@supabase/auth-js@2.107.0", "https://europe-west1-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache/@supabase/auth-js/-/auth-js-2.107.0.tgz", { "dependencies": { "tslib": "2.8.1" } }, "sha512-XA7x+WIeIvuC3GTZ2ey67QcBbGw4n+o5B7M+dMm9KT1lL3wX1B52DfEWW00WuPt/LnniJLLIn1WIm9YPtuxzKQ=="],
    "@supabase/functions-js": ["@supabase/functions-js@2.107.0", "https://europe-west1-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache/@supabase/functions-js/-/functions-js-2.107.0.tgz", { "dependencies": { "tslib": "2.8.1" } }, "sha512-iMtRUmEj1KOgQd/a3MR4hnBlPnZc62DW8+z8aPpnzbxWkexEZUVL2fSgvvp15gqFg1V55e2yMGqgK+yhSQxp5w=="],
    "@supabase/phoenix": ["@supabase/phoenix@0.4.2", "https://europe-west1-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache/@supabase/phoenix/-/phoenix-0.4.2.tgz", {}, "sha512-YSAGnmDAfuleFCVt3CeurQZAhxRfXWeZIIkwp7NhYzQ1UwW6ePSnzsFAiUm/mbCkfoCf70QQHKW/K6RKh52a4A=="],
    "@supabase/postgrest-js": ["@supabase/postgrest-js@2.107.0", "https://europe-west1-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache/@supabase/postgrest-js/-/postgrest-js-2.107.0.tgz", { "dependencies": { "tslib": "2.8.1" } }, "sha512-7ARs47/tyIjX7T0Ive20d4NY8zQYXsP5/P07jJWxffSIM2gpnSnGRnL/Fe15GPbdjsW2sTYeckHcyaoKbM6yWQ=="],
    "@supabase/realtime-js": ["@supabase/realtime-js@2.107.0", "https://europe-west1-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache/@supabase/realtime-js/-/realtime-js-2.107.0.tgz", { "dependencies": { "@supabase/phoenix": "^0.4.2", "tslib": "2.8.1" } }, "sha512-cF2KYdR3JIn9YlWGeluY9S0G+otqTdL6hB8GzpatlEIY6fZudCcyFo6Dc3+X9tjeb+x9XcIyNAk9qhNAknjH1A=="],
    "@supabase/storage-js": ["@supabase/storage-js@2.107.0", "https://europe-west1-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache/@supabase/storage-js/-/storage-js-2.107.0.tgz", { "dependencies": { "iceberg-js": "^0.8.1", "tslib": "2.8.1" } }, "sha512-/X8OOVwKBn8aVKuHAGOz2yLA0d2OauqhVuy4mNtN+o7wttHOgx1/j+pqOzlsjmhOHrYykF6AJNZhs3gKZzcMUw=="],
    "@supabase/supabase-js": ["@supabase/supabase-js@2.107.0", "https://europe-west1-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache/@supabase/supabase-js/-/supabase-js-2.107.0.tgz", { "dependencies": { "@supabase/auth-js": "2.107.0", "@supabase/functions-js": "2.107.0", "@supabase/postgrest-js": "2.107.0", "@supabase/realtime-js": "2.107.0", "@supabase/storage-js": "2.107.0" } }, "sha512-ChKzdlWVweMUUhr0U79JhMmgm1haS/C5JquaiCDr70JaGARRtjjoY9rkIheXWybXxTSNzRiQs3Sk8IAg1HS3ZA=="],
    "@tabby_ai/hijri-converter": ["@tabby_ai/hijri-converter@1.0.5", "", {}, "sha512-r5bClKrcIusDoo049dSL8CawnHR6mRdDwhlQuIgZRNty68q0x8k3Lf1BtPAMxRf/GgnHBnIO4ujd3+GQdLWzxQ=="],
    "flatted": ["flatted@3.4.2", "", {}, "sha512-PjDse7RzhcPkIJwy5t7KPWQSZ9cAbzQXcafsetQoD7sOJRQlGikNbx7yZp2OotDnJyrDcbyRq3Ttb18iYOqkxA=="],
    "framer-motion": ["framer-motion@12.40.0", "https://europe-west1-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache/framer-motion/-/framer-motion-12.40.0.tgz", { "dependencies": { "motion-dom": "^12.40.0", "motion-utils": "^12.39.0", "tslib": "^2.4.0" }, "peerDependencies": { "@emotion/is-prop-valid": "*", "react": "^18.0.0 || ^19.0.0", "react-dom": "^18.0.0 || ^19.0.0" }, "optionalPeers": ["@emotion/is-prop-valid", "react", "react-dom"] }, "sha512-uaBd3qC1v3KQqBEjwTUd183K6PbS+j0yR9w9VmEOLWA/tnUcSn8Xa3uck7t4dgpDoUss8xQTcj8W2L07lrnLFg=="],
    "fsevents": ["fsevents@2.3.3", "", { "os": "darwin" }, "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw=="],
    "httpxy": ["httpxy@0.5.3", "", {}, "sha512-SMS9V6Sn7VWaS11lYhoAr0ceoaiolTWf4jYdJn0NJhCdKMu9R2H9Fh0LBDWBHQF6HRLI1PmaePYsjanSpE5PEw=="],
    "iceberg-js": ["iceberg-js@0.8.1", "https://europe-west1-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache/iceberg-js/-/iceberg-js-0.8.1.tgz", {}, "sha512-1dhVQZXhcHje7798IVM+xoo/1ZdVfzOMIc8/rgVSijRK38EDqOJoGula9N/8ZI5RD8QTxNQtK/Gozpr+qUqRRA=="],
    "iconv-lite": ["iconv-lite@0.6.3", "", { "dependencies": { "safer-buffer": ">= 2.1.2 < 3.0.0" } }, "sha512-4fCk79wshMdzMp2rH06qWrJE4iolqLhCUH+OiuIgU++RB0+94NlDL81atO7GX55uUKueo0txHNtvEyI6D7WdMw=="],
    "minimatch": ["minimatch@3.1.5", "", { "dependencies": { "brace-expansion": "^1.1.7" } }, "sha512-VgjWUsnnT6n+NUk6eZq77zeFdpW2LWDzP6zFGrCbHXiYNul5Dzqk2HHQ5uFH2DNW5Xbp8+jVzaeNt94ssEEl4w=="],
    "motion-dom": ["motion-dom@12.40.0", "https://europe-west1-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache/motion-dom/-/motion-dom-12.40.0.tgz", { "dependencies": { "motion-utils": "^12.39.0" } }, "sha512-HxU3ZaBwNPVQUBQf1xxgq+7JrPNZvjLVxgbpEZL7RrWJnsxOf0/OM+yrHG9ogLQ31Do/r57Oz2gQWPK+6q62mg=="],
    "motion-utils": ["motion-utils@12.39.0", "https://europe-west1-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache/motion-utils/-/motion-utils-12.39.0.tgz", {}, "sha512-8nadJAJjTtqRkmRF36FoJTrywK9nnFmnPwnSMyxaOCU7GDjN9RTMJIxx9De8ErM+vpPhMccr/6fo5WciyQLnMQ=="],
    "ms": ["ms@2.1.3", "", {}, "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA=="],

Modified
package.json
    "@radix-ui/react-toggle-group": "^1.1.11",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@supabase/supabase-js": "^2.107.0",
    "@tailwindcss/vite": "^4.2.1",
    "@tanstack/react-query": "^5.83.0",
    "date-fns": "^4.1.0",
    "embla-carousel-react": "^8.6.0",
    "framer-motion": "^12.40.0",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.575.0",

Modified
routeTree.gen.ts
import { Route as rootRouteImport } from './routes/__root'
import { Route as PermanentJewelryRouteImport } from './routes/permanent-jewelry'
import { Route as JewelryMadeBossRouteImport } from './routes/jewelry-made-boss'
import { Route as EventsRouteImport } from './routes/events'
import { Route as ContactRouteImport } from './routes/contact'
import { Route as CollectionsRouteImport } from './routes/collections'
import { Route as CafeRouteImport } from './routes/cafe'
import { Route as AboutRouteImport } from './routes/about'
import { Route as IndexRouteImport } from './routes/index'
const PermanentJewelryRoute = PermanentJewelryRouteImport.update({
  id: '/permanent-jewelry',
  path: '/permanent-jewelry',
  getParentRoute: () => rootRouteImport,
} as any)
const JewelryMadeBossRoute = JewelryMadeBossRouteImport.update({
  id: '/jewelry-made-boss',
  path: '/jewelry-made-boss',
  getParentRoute: () => rootRouteImport,
} as any)
const EventsRoute = EventsRouteImport.update({
  id: '/events',
  path: '/events',
  getParentRoute: () => rootRouteImport,
} as any)
const ContactRoute = ContactRouteImport.update({
  id: '/contact',
  path: '/contact',
  getParentRoute: () => rootRouteImport,
} as any)
const CollectionsRoute = CollectionsRouteImport.update({
  id: '/collections',
  path: '/collections',
  getParentRoute: () => rootRouteImport,
} as any)
const CafeRoute = CafeRouteImport.update({
  id: '/cafe',
  path: '/cafe',
  getParentRoute: () => rootRouteImport,
} as any)
const AboutRoute = AboutRouteImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRouteImport,
} as any)
const IndexRoute = IndexRouteImport.update({
  id: '/',
export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/cafe': typeof CafeRoute
  '/collections': typeof CollectionsRoute
  '/contact': typeof ContactRoute
  '/events': typeof EventsRoute
  '/jewelry-made-boss': typeof JewelryMadeBossRoute
  '/permanent-jewelry': typeof PermanentJewelryRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/cafe': typeof CafeRoute
  '/collections': typeof CollectionsRoute
  '/contact': typeof ContactRoute
  '/events': typeof EventsRoute
  '/jewelry-made-boss': typeof JewelryMadeBossRoute
  '/permanent-jewelry': typeof PermanentJewelryRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/cafe': typeof CafeRoute
  '/collections': typeof CollectionsRoute
  '/contact': typeof ContactRoute
  '/events': typeof EventsRoute
  '/jewelry-made-boss': typeof JewelryMadeBossRoute
  '/permanent-jewelry': typeof PermanentJewelryRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/'
  fullPaths:
    | '/'
    | '/about'
    | '/cafe'
    | '/collections'
    | '/contact'
    | '/events'
    | '/jewelry-made-boss'
    | '/permanent-jewelry'
  fileRoutesByTo: FileRoutesByTo
  to: '/'
  id: '__root__' | '/'
  to:
    | '/'
    | '/about'
    | '/cafe'
    | '/collections'
    | '/contact'
    | '/events'
    | '/jewelry-made-boss'
    | '/permanent-jewelry'
  id:
    | '__root__'
    | '/'
    | '/about'
    | '/cafe'
    | '/collections'
    | '/contact'
    | '/events'
    | '/jewelry-made-boss'
    | '/permanent-jewelry'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AboutRoute: typeof AboutRoute
  CafeRoute: typeof CafeRoute
  CollectionsRoute: typeof CollectionsRoute
  ContactRoute: typeof ContactRoute
  EventsRoute: typeof EventsRoute
  JewelryMadeBossRoute: typeof JewelryMadeBossRoute
  PermanentJewelryRoute: typeof PermanentJewelryRoute
}
declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/permanent-jewelry': {
      id: '/permanent-jewelry'
      path: '/permanent-jewelry'
      fullPath: '/permanent-jewelry'
      preLoaderRoute: typeof PermanentJewelryRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/jewelry-made-boss': {
      id: '/jewelry-made-boss'
      path: '/jewelry-made-boss'
      fullPath: '/jewelry-made-boss'
      preLoaderRoute: typeof JewelryMadeBossRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/events': {
      id: '/events'
      path: '/events'
      fullPath: '/events'
      preLoaderRoute: typeof EventsRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/contact': {
      id: '/contact'
      path: '/contact'
      fullPath: '/contact'
      preLoaderRoute: typeof ContactRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/collections': {
      id: '/collections'
      path: '/collections'
      fullPath: '/collections'
      preLoaderRoute: typeof CollectionsRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/cafe': {
      id: '/cafe'
      path: '/cafe'
      fullPath: '/cafe'
      preLoaderRoute: typeof CafeRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/': {
      id: '/'
const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AboutRoute: AboutRoute,
  CafeRoute: CafeRoute,
  CollectionsRoute: CollectionsRoute,
  ContactRoute: ContactRoute,
  EventsRoute: EventsRoute,
  JewelryMadeBossRoute: JewelryMadeBossRoute,
  PermanentJewelryRoute: PermanentJewelryRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
import type { getRouter } from './router.tsx'
import type { startInstance } from './start.ts'
declare module '@tanstack/react-start' {
  interface Register {
    ssr: true
    router: Awaited<ReturnType<typeof getRouter>>
    config: Awaited<ReturnType<typeof startInstance.getOptions>>
  }
}

Modified
__root.tsx
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AnnouncementBar } from "@/components/AnnouncementBar";
function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
        <h1 className="font-display text-7xl text-charcoal">404</h1>
        <h2 className="mt-4 font-display text-2xl">This page took the day off.</h2>
        <p className="mt-2 text-sm text-mid-gray">Let's get you back to the glow.</p>
        <Link to="/" className="btn-primary mt-6">Go home</Link>
      </div>
    </div>
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        <h1 className="font-display text-3xl text-charcoal">Something didn't glow.</h1>
        <p className="mt-2 text-sm text-mid-gray">Try again or head home.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => { router.invalidate(); reset(); }} className="btn-primary">Try again</button>
          <a href="/" className="btn-secondary">Go home</a>
        </div>
      </div>
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { title: "GLOWGIRL — Charlotte's Girliest Permanent Jewelry & Café" },
      { name: "description", content: "Permanent jewelry, custom chains & charms, and a café made for girls who glow — in Charlotte's South End." },
      { name: "author", content: "GLOWGIRL" },
      { property: "og:site_name", content: "GLOWGIRL" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@glowgirlbrand" },
      { name: "theme-color", content: "#fac7d7" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "JewelryStore",
        name: "GLOWGIRL",
        image: "https://glowgirl.us/cdn/shop/files/logo.png",
        address: {
          "@type": "PostalAddress",
          streetAddress: "222 West Blvd Ste S112",
          addressLocality: "Charlotte",
          addressRegion: "NC",
          postalCode: "28203",
          addressCountry: "US",
        },
        telephone: "+1-704-612-9113",
        email: "contact@glowgirl.us",
        url: "https://glowgirl.us",
        priceRange: "$$",
        openingHours: "Th-Su 11:00-19:00",
      }),
    }],
  }),
  shellComponent: RootShell,
function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <AnnouncementBar />
      <Nav />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-center" richColors closeButton />
    </QueryClientProvider>
  );

Modified
src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import {
  Hero, Marquee, Experience, Collections, Explainer,
  Reviews, StudioInfo, JewelryMadeBoss, InstagramTeaser, Newsletter,
} from "@/components/home/sections";
import { pageHead } from "@/lib/site";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Your App" },
      { name: "description", content: "Replace this with a one-sentence description of your app." },
      { property: "og:title", content: "Your App" },
      { property: "og:description", content: "Replace this with a one-sentence description of your app." },
    ],
  head: () => pageHead({
    title: "Charlotte's Girliest Permanent Jewelry & Café",
    description: "Permanent jewelry, custom chains & charms, and a café made for girls who glow — in Charlotte's South End.",
    path: "/",
  }),
  component: Index,
});
// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: "#fcfbf8" }}
    >
      <img
        data-lovable-blank-page-placeholder="REMOVE_THIS"
        src="https://cdn.gpteng.co/blank-app-v1.svg"
        alt="Your app will live here!"
      />
    </div>
    <>
      <Hero />
      <Marquee />
      <Experience />
      <Collections />
      <Explainer />
      <Reviews />
      <StudioInfo />
      <JewelryMadeBoss />
      <InstagramTeaser />
      <Newsletter />
    </>
  );
}

Modified
start.ts
import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";
const errorMiddleware = createMiddleware().server(async ({ next }) => {
export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware],
}));

Modified
src/styles.css
@custom-variant dark (&:is(.dark *));
/*
 * Design system definition.
 *
 * The @theme inline block maps CSS custom properties to Tailwind utility
 * classes (e.g. --color-primary -> bg-primary, text-primary).
 *
 * The :root and .dark blocks define the actual color values using oklch.
 * All colors MUST use oklch format.
 *
 * To add a new semantic color:
 * 1. Add the variable to :root (light value) and .dark (dark value)
 * 2. Register it in @theme inline as --color-<name>: var(--<name>)
 */
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap");
/* GLOWGIRL — Luxury feminine design system */
:root {
  --radius: 1rem;
  /* Brand palette */
  --pink-blush: #fac7d7;
  --pink-deep: #e8a0b4;
  --pink-pale: #fde8ef;
  --cream: #fdf6f0;
  --gold: #c9a970;
  --gold-light: #f0ddb8;
  --charcoal: #2a2a2a;
  --mid-gray: #6b6b6b;
  --white: #ffffff;
  /* Semantic shadcn tokens (kept for shadcn components) */
  --background: var(--white);
  --foreground: var(--charcoal);
  --card: var(--white);
  --card-foreground: var(--charcoal);
  --popover: var(--white);
  --popover-foreground: var(--charcoal);
  --primary: var(--pink-blush);
  --primary-foreground: var(--charcoal);
  --secondary: var(--cream);
  --secondary-foreground: var(--charcoal);
  --muted: var(--pink-pale);
  --muted-foreground: var(--mid-gray);
  --accent: var(--gold);
  --accent-foreground: var(--charcoal);
  --destructive: oklch(0.6 0.22 25);
  --destructive-foreground: #fff;
  --border: #efe6dc;
  --input: #efe6dc;
  --ring: var(--pink-deep);
  --font-display: "Cormorant Garamond", serif;
  --font-body: "DM Sans", system-ui, sans-serif;
  --shadow-soft: 0 10px 40px -20px rgba(232, 160, 180, 0.35);
  --shadow-card: 0 8px 30px -12px rgba(42, 42, 42, 0.12);
}
@theme inline {
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);
  --radius-4xl: calc(var(--radius) + 16px);
  --radius-3xl: calc(var(--radius) + 16px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-ring-offset-background: var(--background);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.129 0.042 264.695);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.129 0.042 264.695);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.129 0.042 264.695);
  --primary: oklch(0.208 0.042 265.755);
  --primary-foreground: oklch(0.984 0.003 247.858);
  --secondary: oklch(0.968 0.007 247.896);
  --secondary-foreground: oklch(0.208 0.042 265.755);
  --muted: oklch(0.968 0.007 247.896);
  --muted-foreground: oklch(0.554 0.046 257.417);
  --accent: oklch(0.968 0.007 247.896);
  --accent-foreground: oklch(0.208 0.042 265.755);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.984 0.003 247.858);
  --border: oklch(0.929 0.013 255.508);
  --input: oklch(0.929 0.013 255.508);
  --ring: oklch(0.704 0.04 256.788);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.984 0.003 247.858);
  --sidebar-foreground: oklch(0.129 0.042 264.695);
  --sidebar-primary: oklch(0.208 0.042 265.755);
  --sidebar-primary-foreground: oklch(0.984 0.003 247.858);
  --sidebar-accent: oklch(0.968 0.007 247.896);
  --sidebar-accent-foreground: oklch(0.208 0.042 265.755);
  --sidebar-border: oklch(0.929 0.013 255.508);
  --sidebar-ring: oklch(0.704 0.04 256.788);
}
  /* Brand utility colors */
  --color-pink-blush: var(--pink-blush);
  --color-pink-deep: var(--pink-deep);
  --color-pink-pale: var(--pink-pale);
  --color-cream: var(--cream);
  --color-gold: var(--gold);
  --color-gold-light: var(--gold-light);
  --color-charcoal: var(--charcoal);
  --color-mid-gray: var(--mid-gray);
.dark {
  --background: oklch(0.129 0.042 264.695);
  --foreground: oklch(0.984 0.003 247.858);
  --card: oklch(0.208 0.042 265.755);
  --card-foreground: oklch(0.984 0.003 247.858);
  --popover: oklch(0.208 0.042 265.755);
  --popover-foreground: oklch(0.984 0.003 247.858);
  --primary: oklch(0.929 0.013 255.508);
  --primary-foreground: oklch(0.208 0.042 265.755);
  --secondary: oklch(0.279 0.041 260.031);
  --secondary-foreground: oklch(0.984 0.003 247.858);
  --muted: oklch(0.279 0.041 260.031);
  --muted-foreground: oklch(0.704 0.04 256.788);
  --accent: oklch(0.279 0.041 260.031);
  --accent-foreground: oklch(0.984 0.003 247.858);
  --destructive: oklch(0.704 0.191 22.216);
  --destructive-foreground: oklch(0.984 0.003 247.858);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.551 0.027 264.364);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.208 0.042 265.755);
  --sidebar-foreground: oklch(0.984 0.003 247.858);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.984 0.003 247.858);
  --sidebar-accent: oklch(0.279 0.041 260.031);
  --sidebar-accent-foreground: oklch(0.984 0.003 247.858);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.551 0.027 264.364);
  --font-display: var(--font-display);
  --font-body: var(--font-body);
}
    border-color: var(--color-border);
  }
  html {
    scroll-behavior: smooth;
  }
  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    font-family: var(--font-body);
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3, h4, h5 {
    font-family: var(--font-display);
    font-weight: 400;
    letter-spacing: -0.01em;
    color: var(--charcoal);
  }
}
/* === Custom utilities === */
@utility font-display { font-family: var(--font-display); }
@utility font-body { font-family: var(--font-body); }
@utility btn-primary {
  display: inline-flex; align-items: center; justify-content: center;
  background-color: var(--pink-blush);
  color: var(--charcoal);
  padding: 0.85rem 1.75rem;
  border-radius: 9999px;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-soft);
}
@utility btn-secondary {
  display: inline-flex; align-items: center; justify-content: center;
  background: transparent;
  color: var(--gold);
  border: 1.5px solid var(--gold);
  padding: 0.85rem 1.75rem;
  border-radius: 9999px;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
  transition: all 0.3s ease;
}
@utility section-pad {
  padding-block: 5rem;
}
/* Hover overrides (utilities don't compose hover well) */
.btn-primary:hover { background-color: var(--pink-deep); transform: translateY(-1px); }
.btn-secondary:hover { background-color: var(--gold); color: var(--white); }
/* Underline grow on hover */
.story-link {
  position: relative;
  display: inline-block;
}
.story-link::after {
  content: "";
  position: absolute;
  left: 50%; bottom: -2px;
  width: 0; height: 1px;
  background-color: currentColor;
  transition: width 0.3s ease, left 0.3s ease;
}
.story-link:hover::after {
  width: 100%; left: 0;
}
/* Marquee */
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 38s linear infinite;
}
/* Shimmer / sparkle */
@keyframes shimmer {
  0%, 100% { opacity: 0.2; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}
.animate-shimmer { animation: shimmer 3s ease-in-out infinite; }
@keyframes float-up {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-120vh) translateX(20px); opacity: 0; }
}
.animate-float { animation: float-up linear infinite; }
@keyframes bounce-check {
  0% { transform: scale(0); }
  60% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
.animate-bounce-check { animation: bounce-check 0.5s ease-out; }
/* Hero gradient */
.hero-gradient {
  background:
    radial-gradient(ellipse at 70% 20%, rgba(250, 199, 215, 0.55), transparent 55%),
    radial-gradient(ellipse at 20% 80%, rgba(240, 221, 184, 0.45), transparent 60%),
    linear-gradient(180deg, var(--pink-pale) 0%, var(--cream) 100%);
}
.frost {
  background-color: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}
.text-balance { text-wrap: balance; }