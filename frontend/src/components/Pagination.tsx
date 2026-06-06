import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Button
        variant="secondary"
        icon={<ChevronLeft size={16} />}
        disabled={page <= 0}
        onClick={() => onChange(page - 1)}
      >
        Anterior
      </Button>
      <span className="text-sm text-slate-300">
        Pagina {page + 1} de {totalPages}
      </span>
      <Button
        variant="secondary"
        icon={<ChevronRight size={16} />}
        disabled={page >= totalPages - 1}
        onClick={() => onChange(page + 1)}
      >
        Proxima
      </Button>
    </div>
  );
}

