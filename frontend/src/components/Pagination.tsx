import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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

  const pages: number[] = [];
  const half = Math.floor(
    maximumVisiblePages / 2,
  );

  let start = Math.max(
    currentPage - half,
    0,
  );

  let end = Math.min(
    start + maximumVisiblePages,
    totalPages,
  );

  if (
    end - start <
    maximumVisiblePages
  ) {
    start = Math.max(
      end - maximumVisiblePages,
      0,
    );
  }

  for (
    let pageNumber = start;
    pageNumber < end;
    pageNumber++
  ) {
    pages.push(pageNumber);
  }

  return pages;
}

export function Pagination({
  page,
  totalPages,
  onChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = createVisiblePages(
    page,
    totalPages,
  );

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

  return (
    <nav
      className="flex flex-col items-center justify-between gap-4 sm:flex-row"
      aria-label="Paginação"
    >
      <Button
        type="button"
        variant="secondary"
        icon={<ChevronLeft size={16} />}
        disabled={page <= 0}
        onClick={() => handleChange(page - 1)}
      >
        Anterior
      </Button>

      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-wrap justify-center gap-2">
          {visiblePages.map((pageNumber) => {
            const isActive =
              pageNumber === page;

            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() =>
                  handleChange(pageNumber)
                }
                aria-current={
                  isActive ? "page" : undefined
                }
                aria-label={`Ir para a página ${
                  pageNumber + 1
                }`}
                className={`grid size-10 place-items-center rounded-md border text-sm font-semibold transition ${
                  isActive
                    ? "border-skybrand bg-skybrand text-ink"
                    : "border-line bg-white/5 text-slate-300 hover:border-skybrand/60 hover:text-white"
                }`}
              >
                {pageNumber + 1}
              </button>
            );
          })}
        </div>

        <span className="text-xs text-slate-400">
          Página {page + 1} de {totalPages}
        </span>
      </div>

      <Button
        type="button"
        variant="secondary"
        icon={<ChevronRight size={16} />}
        disabled={
          page >= totalPages - 1
        }
        onClick={() => handleChange(page + 1)}
      >
        Próxima
      </Button>
    </nav>
  );
}