import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import Index from "./routes/index";
import AboutPage from "./routes/about";
import CafePage from "./routes/cafe";
import CollectionsPage from "./routes/collections";
import ContactPage from "./routes/contact";
import EventsPage from "./routes/events";
import JewelryMadeBossPage from "./routes/jewelry-made-boss";
import PermanentJewelryPage from "./routes/permanent-jewelry";
import ShopIndex from "./routes/shop/index";
import Collection from "./routes/shop/Collection";
import Product from "./routes/shop/Product";
import GiftCards from "./routes/shop/GiftCards.tsx";
import CartPage from "./routes/cart";
import CheckoutPage from "./routes/checkout";
import OrderSuccess from "./routes/order-success";
import BookPage from "./routes/book";
import AdminPage from "./routes/admin/index";

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
      <>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        <Toaster position="top-center" richColors closeButton />
      </>
    );
  }

  return (
    <>
      <AnnouncementBar />
      <Nav />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cafe" element={<CafePage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/jewelry-made-boss" element={<JewelryMadeBossPage />} />
          <Route path="/permanent-jewelry" element={<PermanentJewelryPage />} />
          {/* Shop */}
          <Route path="/shop" element={<ShopIndex />} />
          <Route path="/shop/gift-cards" element={<GiftCards />} />
          <Route path="/shop/chains" element={<Collection />} />
          <Route path="/shop/charms" element={<Collection />} />
          <Route path="/shop/gold-earrings" element={<Collection />} />
          <Route path="/shop/silver-earrings" element={<Collection />} />
          <Route path="/shop/gold-nameplate" element={<Collection />} />
          <Route path="/shop/silver-nameplate" element={<Collection />} />
          <Route path="/shop/:slug" element={<Product />} />
          {/* Cart & checkout */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          {/* Booking */}
          <Route path="/book" element={<BookPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-center" richColors closeButton />
    </>
  );
}
