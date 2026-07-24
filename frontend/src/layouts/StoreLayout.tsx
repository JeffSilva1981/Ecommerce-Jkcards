import { MessageCircle } from "lucide-react";
import { Outlet } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { PrivacyNotice } from "../components/PrivacyNotice";
import { storeConfig } from "../config/storeConfig";

export function StoreLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-ink text-white">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <a
        href={storeConfig.social.whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar com a JKCards pelo WhatsApp"
        title="Falar pelo WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 transition hover:-translate-y-1 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-ink"
      >
        <MessageCircle size={28} />
      </a>

      <PrivacyNotice />

      <Footer />
    </div>
  );
}