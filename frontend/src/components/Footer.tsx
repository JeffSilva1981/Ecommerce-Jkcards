import {
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Youtube,
} from "lucide-react";
import { Link } from "react-router-dom";
import { storeConfig } from "../config/storeConfig";

const institutionalLinks = [
  {
    label: "Sobre a JKCards",
    to: "/sobre",
  },
  {
    label: "Política de vendas",
    to: "/politica-de-vendas",
  },
  {
    label: "Trocas e devoluções",
    to: "/trocas-e-devolucoes",
  },
  {
    label: "Política de privacidade",
    to: "/privacidade",
  },
  {
    label: "Termos de uso",
    to: "/termos-de-uso",
  },
];

const customerServiceLinks = [
  {
    label: "Envios e entregas",
    to: "/envios",
  },
  {
    label: "Formas de pagamento",
    to: "/pagamentos",
  },
  {
    label: "Dúvidas frequentes",
    to: "/duvidas-frequentes",
  },
  {
    label: "Fale conosco",
    to: "/contato",
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <footer className="border-t border-line/80 bg-panel/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Link
            to="/"
            onClick={scrollToTop}
            className="inline-flex items-center gap-3"
          >
            <span className="grid size-11 place-items-center rounded-lg bg-brand-gradient text-sm font-black text-ink shadow-glow-soft">
              JK
            </span>

            <div>
              <p className="font-black text-white">
                {storeConfig.name}
              </p>

              <p className="text-xs text-slate-400">
                Desde {storeConfig.startedIn}
              </p>
            </div>
          </Link>

          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
            Cards e produtos colecionáveis com atendimento
            próximo, compra segura e cuidado em cada pedido.
          </p>

          <div className="mt-5 flex items-center gap-2">
            <a
              href={storeConfig.social.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram da JKCards"
              title="Instagram"
              className="grid size-10 place-items-center rounded-lg border border-line bg-white/5 text-slate-300 transition hover:border-pink-400/60 hover:bg-pink-500/10 hover:text-pink-300"
            >
              <Instagram size={19} />
            </a>

            <a
              href={storeConfig.social.whatsapp}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp da JKCards"
              title="WhatsApp"
              className="grid size-10 place-items-center rounded-lg border border-line bg-white/5 text-slate-300 transition hover:border-emerald-400/60 hover:bg-emerald-500/10 hover:text-emerald-300"
            >
              <MessageCircle size={19} />
            </a>

            {storeConfig.social.youtube ? (
              <a
                href={storeConfig.social.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube da JKCards"
                title="YouTube"
                className="grid size-10 place-items-center rounded-lg border border-line bg-white/5 text-slate-300 transition hover:border-red-400/60 hover:bg-red-500/10 hover:text-red-300"
              >
                <Youtube size={19} />
              </a>
            ) : (
              <button
                type="button"
                disabled
                aria-label="YouTube da JKCards em breve"
                title="YouTube em breve"
                className="grid size-10 cursor-not-allowed place-items-center rounded-lg border border-line bg-white/5 text-slate-600"
              >
                <Youtube size={19} />
              </button>
            )}
          </div>

          {!storeConfig.social.youtube ? (
            <p className="mt-2 text-xs text-slate-500">
              Canal no YouTube em breve.
            </p>
          ) : null}
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Institucional
          </h2>

          <nav className="mt-4 flex flex-col items-start gap-3">
            {institutionalLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={scrollToTop}
                className="text-sm text-slate-400 transition hover:text-skysoft"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Atendimento
          </h2>

          <nav className="mt-4 flex flex-col items-start gap-3">
            {customerServiceLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={scrollToTop}
                className="text-sm text-slate-400 transition hover:text-skysoft"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Contato
          </h2>

          <div className="mt-4 space-y-4">
            <a
              href={`mailto:${storeConfig.email}`}
              className="flex items-start gap-3 text-sm text-slate-400 transition hover:text-skysoft"
            >
              <Mail
                size={18}
                className="mt-0.5 shrink-0 text-skybrand"
              />

              <span className="break-all">
                {storeConfig.email}
              </span>
            </a>

            <div className="flex items-start gap-3 text-sm leading-6 text-slate-400">
              <MapPin
                size={18}
                className="mt-0.5 shrink-0 text-skybrand"
              />

              <address className="not-italic">
                {storeConfig.address.street}
                <br />
                {storeConfig.address.city}/
                {storeConfig.address.shortState}
              </address>
            </div>

            <a
              href={storeConfig.social.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
            >
              <MessageCircle size={17} />
              Falar pelo WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-line/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            © {currentYear} {storeConfig.name}. Todos os
            direitos reservados.
          </p>

          <p>
            E-commerce de cards e produtos colecionáveis.
          </p>
        </div>
      </div>
    </footer>
  );
}