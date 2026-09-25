import { Button } from "@/components/ui/button";
import { pageCount as getPageCount } from "@/lib/pagination";

export function Pagination({
  page,
  total,
  pageSize,
  onPageChange,
}: {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  const pages = getPageCount(total, pageSize);
  const current = Math.min(Math.max(1, page), pages);

  return (
    <nav className="flex items-center gap-2" aria-label="Pagination">
      <Button
        variant="outline"
        disabled={current <= 1}
        onClick={() => onPageChange(current - 1)}
      >
        Previous
      </Button>
      <span className="text-muted-foreground text-sm">
        Page {current} of {pages}
      </span>
      <Button
        variant="outline"
        disabled={current >= pages}
        onClick={() => onPageChange(current + 1)}
      >
        Next
      </Button>
    </nav>
  );
}
