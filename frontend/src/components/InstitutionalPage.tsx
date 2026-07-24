import { ArrowLeft } from "lucide-react";
import {
  ReactNode,
  useEffect,
} from "react";
import { Link } from "react-router-dom";
import { storeConfig } from "../config/storeConfig";

type InstitutionalPageProps = {
  title: string;
  description: string;
  eyebrow?: string;
  children: ReactNode;
};

export function InstitutionalPage({
  title,
  description,
  eyebrow = "JKCards",
  children,
}: InstitutionalPageProps) {
  useEffect(() => {
    const previousTitle = document.title;
    const metaDescription = document.querySelector(
      'meta[name="description"]',
    );
    const previousDescription =
      metaDescription?.getAttribute("content");

    document.title = `${title} | ${storeConfig.name}`;

    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        description,
      );
    }

    return () => {
      document.title = previousTitle;

      if (
        metaDescription &&
        previousDescription !== null &&
        previousDescription !== undefined
      ) {
        metaDescription.setAttribute(
          "content",
          previousDescription,
        );
      }
    };
  }, [description, title]);

  return (
    <section className="mx-auto w-full max-w-5xl">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-skysoft"
      >
        <ArrowLeft size={17} />
        Voltar para a loja
      </Link>

      <div className="overflow-hidden rounded-2xl border border-line bg-panel/70 shadow-xl shadow-black/10">
        <header className="border-b border-line bg-gradient-to-br from-skybrand/15 via-transparent to-gold/10 px-6 py-10 sm:px-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-skysoft">
            {eyebrow}
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            {title}
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            {description}
          </p>
        </header>

        <div className="space-y-8 px-6 py-8 text-slate-300 sm:px-10 sm:py-10">
          {children}
        </div>
      </div>
    </section>
  );
}

type InstitutionalSectionProps = {
  title: string;
  children: ReactNode;
};

export function InstitutionalSection({
  title,
  children,
}: InstitutionalSectionProps) {
  return (
    <section>
      <h2 className="text-xl font-bold text-white">
        {title}
      </h2>

      <div className="mt-3 space-y-3 text-sm leading-7 text-slate-300 sm:text-base">
        {children}
      </div>
    </section>
  );
}