import {
  Home,
  Search,
  ShoppingBag,
} from "lucide-react";
import {
  Link,
  useLocation,
} from "react-router-dom";

export function NotFoundPage() {
  const location = useLocation();

  return (
    <section className="mx-auto flex min-h-[55vh] max-w-3xl items-center justify-center py-10 text-center">
      <div className="w-full rounded-2xl border border-line bg-panel/70 px-6 py-12 shadow-xl shadow-black/10 sm:px-10">
        <div className="mx-auto grid size-20 place-items-center rounded-full border border-skybrand/20 bg-skybrand/10 text-skysoft">
          <Search size={34} />
        </div>

        <p className="mt-6 text-sm font-black uppercase tracking-[0.25em] text-skysoft">
          Erro 404
        </p>

        <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
          Página não encontrada
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
          O endereço acessado não existe, foi alterado ou não
          está mais disponível. Você pode voltar para a
          página inicial ou continuar navegando pelos
          produtos da JKCards.
        </p>

        <p className="mx-auto mt-3 max-w-xl break-all rounded-lg bg-black/20 px-4 py-2 text-xs text-slate-500">
          {location.pathname}
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-skybrand px-5 py-3 text-sm font-bold text-ink transition hover:opacity-90"
          >
            <Home size={18} />
            Voltar ao início
          </Link>

          <Link
            to="/produtos"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:border-skybrand/60 hover:text-skysoft"
          >
            <ShoppingBag size={18} />
            Ver produtos
          </Link>
        </div>
      </div>
    </section>
  );
}