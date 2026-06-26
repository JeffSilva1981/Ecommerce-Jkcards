import { MessageCircle } from "lucide-react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";

const whatsappMessage = encodeURIComponent(
  "Olá! Vim pelo site JKCards e gostaria de tirar uma dúvida."
);

const whatsappUrl = `https://wa.me/5515988233584?text=${whatsappMessage}`;

export function StoreLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-ink text-white">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar com a JKCards pelo WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 transition hover:-translate-y-1 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-ink"
      >
        <MessageCircle size={28} />
      </a>

      <footer className="border-t border-line/80 bg-ink/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-md bg-brand-gradient text-xs font-black text-ink">
              JK
            </span>

            <span className="text-sm font-semibold text-slate-300">
              JKCards &middot; ecommerce de cards colecionaveis
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}