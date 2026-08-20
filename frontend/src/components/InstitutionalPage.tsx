import { ArrowLeft } from "lucide-react";
import { ReactNode, useEffect } from "react";
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
      metaDescription?.getAttribute("content") ?? null;

    document.title = `${title} | ${storeConfig.name}`;

    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    }

    return () => {
      document.title = previousTitle;

      if (!metaDescription) {
        return;
      }

      if (previousDescription === null) {
        metaDescription.removeAttribute("content");
        return;
      }

      metaDescription.setAttribute(
        "content",
        previousDescription,
      );
    };
  }, [description, title]);

  return (
    <section className="mx-auto w-full max-w-5xl">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-cyan-600"
      >
        <ArrowLeft size={17} />
        Voltar para a loja
      </Link>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="bg-gradient-to-r from-[#00102D] via-[#06234A] to-[#073B66] px-6 py-10 sm:px-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
            {eyebrow}
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            {title}
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-200">
            {description}
          </p>
        </header>

        <div className="space-y-8 px-6 py-8 text-slate-600 sm:px-10 sm:py-10">
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
      <h2 className="text-xl font-bold text-[#00102D]">
        {title}
      </h2>

      <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600 sm:text-base">
        {children}
      </div>
    </section>
  );
}