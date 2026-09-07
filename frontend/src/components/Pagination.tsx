import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

function createVisiblePages(
  currentPage: number,
  totalPages: number,
) {
  const maximumVisiblePages = 5;

  if (totalPages <= maximumVisiblePages) {
    return Array.from(
      { length: totalPages },
      (_, index) => index,
    );
  }

  const half = Math.floor(maximumVisiblePages / 2);

  const start = Math.max(
    0,
    Math.min(
      currentPage - half,
      totalPages - maximumVisiblePages,
    ),
  );

  return Array.from(
    { length: maximumVisiblePages },
    (_, index) => start + index,
  );
}

export function Pagination({
  page,
  totalPages,
  onChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = createVisiblePages(page, totalPages);

  function handleChange(nextPage: number) {
    if (
      nextPage < 0 ||
      nextPage >= totalPages ||
      nextPage === page
    ) {
      return;
    }

    onChange(nextPage);
  }

  const navigationButtonClasses =
    "disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-100";

  return (
    <nav
      className="flex flex-col items-center justify-between gap-4 sm:flex-row"
      aria-label="Paginação"
    >
      <Button
        type="button"
        variant="secondary"
        className={navigationButtonClasses}
        icon={<ChevronLeft size={17} />}
        disabled={page <= 0}
        onClick={() => handleChange(page - 1)}
      >
        Anterior
      </Button>

      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-2">
          {visiblePages.map((pageNumber) => {
            const isActive = pageNumber === page;

            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() => handleChange(pageNumber)}
                aria-current={isActive ? "page" : undefined}
                aria-label={`Ir para a página ${pageNumber + 1}`}
                className={`grid size-11 place-items-center rounded-xl border text-sm font-bold shadow-sm transition focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 ${
                  isActive
                    ? "border-sky-500 bg-sky-500 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                }`}
              >
                {pageNumber + 1}
              </button>
            );
          })}
        </div>

        <span className="text-xs text-slate-500">
          Página {page + 1} de {totalPages}
        </span>
      </div>

      <Button
        type="button"
        variant="secondary"
        className={navigationButtonClasses}
        icon={<ChevronRight size={17} />}
        disabled={page >= totalPages - 1}
        onClick={() => handleChange(page + 1)}
      >
        Próxima
      </Button>
    </nav>
  );
}