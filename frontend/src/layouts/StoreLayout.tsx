import { MessageCircle } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { PrivacyNotice } from "../components/PrivacyNotice";
import { storeConfig } from "../config/storeConfig";

export function StoreLayout() {
  const location = useLocation();

  const isProductsPage =
    location.pathname === "/" ||
    location.pathname === "/produtos";

  return (
    <div className="flex min-h-screen flex-col bg-ink text-white">
      <Header />

      <main
        className={`mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 ${
          isProductsPage ? "pb-12 pt-0" : "py-8"
        }`}
      >
        <Outlet />
      </main>

      <a
        href={storeConfig.social.whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar com a JKCards pelo WhatsApp"
        title="Falar pelo WhatsApp"
        className="fixed bottom-3 right-3 z-50 flex size-11 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 transition hover:-translate-y-1 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-ink sm:bottom-5 sm:right-5 sm:size-14"
      >
        <MessageCircle className="size-5 sm:size-7" />
      </a>

      <PrivacyNotice />

      <Footer />
    </div>
  );
}
