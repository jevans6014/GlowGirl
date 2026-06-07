import { Suspense, lazy } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Toaster } from "sonner";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Route-level code splitting: each page is its own chunk so the
// initial bundle stays small as more pages are added.
const Index = lazy(() => import("./routes/index"));
const AboutPage = lazy(() => import("./routes/about"));
const CafePage = lazy(() => import("./routes/cafe"));
const CollectionsPage = lazy(() => import("./routes/collections"));
const ContactPage = lazy(() => import("./routes/contact"));
const EventsPage = lazy(() => import("./routes/events"));
const JewelryMadeBossPage = lazy(() => import("./routes/jewelry-made-boss"));
const PermanentJewelryPage = lazy(() => import("./routes/permanent-jewelry"));
const ShopIndex = lazy(() => import("./routes/shop/index"));
const Collection = lazy(() => import("./routes/shop/Collection"));
const Product = lazy(() => import("./routes/shop/Product"));
const GiftCards = lazy(() => import("./routes/shop/GiftCards"));
const CartPage = lazy(() => import("./routes/cart"));
const CheckoutPage = lazy(() => import("./routes/checkout"));
const OrderSuccess = lazy(() => import("./routes/order-success"));
const BookPage = lazy(() => import("./routes/book"));
const TryOnPage = lazy(() => import("./routes/try-on.tsx"));
const AdminPage = lazy(() => import("./routes/admin/index"));

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-pink-deep" />
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-charcoal">404</h1>
        <h2 className="mt-4 font-display text-2xl">This page took the day off.</h2>
        <p className="mt-2 text-sm text-mid-gray">Let's get you back to the glow.</p>
        <Link to="/" className="btn-primary mt-6 inline-block">Go home</Link>
      </div>
    </div>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Suspense>
        <Toaster position="top-center" richColors closeButton />
      </ErrorBoundary>
    );
  }

  return (
    <>
      <AnnouncementBar />
      <Nav />
      <main className="min-h-screen">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/cafe" element={<CafePage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/jewelry-made-boss" element={<JewelryMadeBossPage />} />
              <Route path="/permanent-jewelry" element={<PermanentJewelryPage />} />
              <Route path="/try-on" element={<TryOnPage />} />
              {/* Shop — explicit routes win over the dynamic ones below */}
              <Route path="/shop" element={<ShopIndex />} />
              <Route path="/shop/gift-cards" element={<GiftCards />} />
              {/* Products are namespaced under /p/ so a product slug can
                  never collide with a collection slug. */}
              <Route path="/shop/p/:slug" element={<Product />} />
              {/* Single data-driven collection route (validated in Collection). */}
              <Route path="/shop/:category" element={<Collection />} />
              {/* Cart & checkout */}
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              {/* Booking */}
              <Route path="/book" element={<BookPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <Toaster position="top-center" richColors closeButton />
    </>
  );
}
