import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";

export function StoreLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-ink text-white">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
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
          <p className="text-xs text-slate-500">
            Projeto de portfolio &middot; React + Vite + Spring Boot
          </p>
        </div>
      </footer>
    </div>
  );
}
