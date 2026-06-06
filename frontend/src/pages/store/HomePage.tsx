import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/Button";
import { ProductsPage } from "./ProductsPage";

export function HomePage() {
  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-2xl border border-line/80 bg-panel-gradient shadow-glow">
        <div className="absolute inset-0 bg-hero-grid bg-[size:32px_32px] opacity-40" />
        <div className="absolute -left-32 -top-32 size-80 rounded-full bg-skybrand/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 size-80 rounded-full bg-gold/10 blur-3xl" />

        <div className="relative grid gap-8 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-skybrand/30 bg-skybrand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-skysoft">
              <Sparkles size={14} />
              Ecommerce + portfolio
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
              A loja dos seus{" "}
              <span className="bg-gradient-to-r from-skysoft via-skybrand to-skydeep bg-clip-text text-transparent">
                cards favoritos
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base text-slate-300 md:text-lg">
              Catalogo, carrinho, pedidos e painel admin integrados ao backend Spring Boot.
              Tudo em uma experiencia rapida feita para colecionadores e jogadores.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/produtos">
                <Button icon={<ArrowRight size={18} />}>Ver produtos</Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary">Entrar como admin</Button>
              </Link>
            </div>
            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Sparkles, label: "Cards e colecionaveis", hint: "Catalogo curado" },
                { icon: ShieldCheck, label: "Compra organizada", hint: "Carrinho persistente" },
                { icon: Truck, label: "Pedidos monitorados", hint: "Status em tempo real" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-xl border border-line/80 bg-white/5 p-4 backdrop-blur-sm transition hover:border-skybrand/40 hover:bg-white/10"
                  >
                    <div className="grid size-9 place-items-center rounded-lg bg-skybrand/15 text-skysoft">
                      <Icon size={18} />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-white">{item.label}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.hint}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="relative min-h-72 overflow-hidden rounded-2xl border border-line/60 bg-white/5">
            <img
              src="https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=1200&q=80"
              alt="Mesa com cards colecionaveis"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-ink/80 via-ink/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-skysoft">
                  Destaque
                </p>
                <p className="mt-1 text-lg font-bold text-white">
                  Colecao exclusiva JKCards
                </p>
              </div>
              <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-bold text-gold">
                NOVO
              </span>
            </div>
          </div>
        </div>
      </section>

      <ProductsPage />
    </div>
  );
}
