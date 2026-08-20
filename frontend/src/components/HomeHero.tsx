import { ArrowRight, BadgeCheck, ShieldCheck, Truck } from "lucide-react";
import heroCharizard from "../assets/hero-charizard.jpg";
import heroDarkrai from "../assets/hero-darkrai.jpg";
import heroGreninja from "../assets/hero-greninja.jpg";

export function HomeHero() {
  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#f4f7fb]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_40%,rgba(56,189,248,0.18),transparent_35%)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-sky-700">
            <BadgeCheck size={16} />
            Pokémon TCG original
          </span>

          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Sua próxima carta favorita está aqui.
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
            Encontre cartas, acessórios e produtos selecionados para jogadores
            e colecionadores apaixonados por Pokémon TCG.
          </p>

          <a
            href="#produtos"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-xl hover:shadow-sky-500/30"
          >
            Explorar produtos
            <ArrowRight size={18} />
          </a>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-600">
            <span className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-sky-600" />
              Compra segura
            </span>

            <span className="flex items-center gap-2">
              <Truck size={18} className="text-sky-600" />
              Envio para todo o Brasil
            </span>
          </div>
        </div>

        <div className="relative mx-auto flex min-h-[340px] w-full max-w-[560px] items-center justify-center sm:min-h-[430px]">
          <div className="absolute h-64 w-64 rounded-full bg-sky-300/30 blur-3xl sm:h-80 sm:w-80" />

          <img
            src={heroDarkrai}
            alt="Carta Mega Darkrai EX"
            className="absolute left-[5%] top-1/2 w-[31%] -translate-y-1/2 -rotate-12 rounded-[4%] object-contain shadow-2xl transition duration-500 hover:z-20 hover:-translate-y-[54%] hover:scale-105"
          />

          <img
            src={heroCharizard}
            alt="Carta Mega Charizard X EX"
            style={{
              clipPath: "inset(4.5% 17.5% 4.5% 17.5% round 3%)",
            }}
            className="relative z-10 w-[55%] -translate-y-2 object-contain drop-shadow-2xl transition duration-500 hover:-translate-y-5 hover:scale-105"
          />

          <img
            src={heroGreninja}
            alt="Carta Mega Greninja EX"
            className="absolute right-[5%] top-1/2 w-[31%] -translate-y-1/2 rotate-12 rounded-[4%] object-contain shadow-2xl transition duration-500 hover:z-20 hover:-translate-y-[54%] hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
}