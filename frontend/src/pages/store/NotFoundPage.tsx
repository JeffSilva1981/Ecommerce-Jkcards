import {
  Home,
  Search,
  ShoppingBag,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function NotFoundPage() {
  const location = useLocation();

  return (
    <section className="mx-auto flex min-h-[55vh] max-w-3xl items-center justify-center py-10 text-center">
      <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-2 bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600" />

        <div className="px-6 py-12 sm:px-10">
          <div className="mx-auto grid size-20 place-items-center rounded-full bg-cyan-50 text-cyan-600">
            <Search size={34} />
          </div>

          <p className="mt-6 text-sm font-black uppercase tracking-[0.25em] text-cyan-600">
            Erro 404
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#00102D] sm:text-4xl">
            Página não encontrada
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            O endereço acessado não existe, foi alterado ou não
            está mais disponível. Você pode voltar para a página
            inicial ou continuar navegando pelos produtos da
            JKCards.
          </p>

          <p className="mx-auto mt-4 max-w-xl break-all rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500">
            {location.pathname}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-600"
            >
              <Home size={18} />
              Voltar ao início
            </Link>

            <Link
              to="/produtos"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-[#00102D] transition hover:border-cyan-400 hover:text-cyan-700"
            >
              <ShoppingBag size={18} />
              Ver produtos
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}