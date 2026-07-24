import {
  ShieldCheck,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";

const storageKey = "jkcards-privacy-notice-accepted";

export function PrivacyNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted =
      localStorage.getItem(storageKey) === "true";

    setVisible(!accepted);
  }, []);

  function handleAccept() {
    localStorage.setItem(storageKey, "true");
    setVisible(false);
  }

  function handleClose() {
    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <aside
      aria-label="Aviso de privacidade"
      className="fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-3xl rounded-xl border border-skybrand/30 bg-panel p-5 shadow-2xl shadow-black/50 sm:bottom-6 sm:left-6 sm:right-24"
    >
      <button
        type="button"
        onClick={handleClose}
        aria-label="Fechar aviso de privacidade"
        title="Fechar"
        className="absolute right-3 top-3 grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
      >
        <X size={18} />
      </button>

      <div className="flex items-start gap-4 pr-8">
        <span className="hidden size-11 shrink-0 place-items-center rounded-lg bg-skybrand/10 text-skysoft sm:grid">
          <ShieldCheck size={23} />
        </span>

        <div>
          <h2 className="font-bold text-white">
            Privacidade e funcionamento do site
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            A JKCards utiliza recursos necessários do
            navegador para manter funcionalidades como
            sessão, carrinho e preferências. Ao continuar,
            você reconhece o uso desses recursos conforme
            nossa{" "}
            <Link
              to="/privacidade"
              className="font-semibold text-skysoft hover:underline"
            >
              Política de privacidade
            </Link>
            .
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleAccept}
              className="rounded-lg bg-skybrand px-4 py-2 text-sm font-bold text-ink transition hover:opacity-90"
            >
              Entendi
            </button>

            <Link
              to="/privacidade"
              onClick={handleClose}
              className="rounded-lg border border-line bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-skybrand/60"
            >
              Saiba mais
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}