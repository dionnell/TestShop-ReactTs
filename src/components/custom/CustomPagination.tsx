import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { useSearchParams } from 'react-router';

interface Props {
  totalPages: number;
}

function getPageRange(current: number, total: number, maxVisible: number): (number | '...')[] {
  if (total <= maxVisible + 2) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const half = Math.floor(maxVisible / 2);
  let start = Math.max(2, current - half);
  let end = Math.min(total - 1, current + half);

  if (current - half <= 2) end = Math.min(total - 1, maxVisible + 1);
  if (current + half >= total - 1) start = Math.max(2, total - maxVisible);

  const middle: (number | '...')[] = [];
  if (start > 2) middle.push('...');
  for (let i = start; i <= end; i++) middle.push(i);
  if (end < total - 1) middle.push('...');

  return [1, ...middle, total];
}

export const CustomPagination = ({ totalPages }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryPage = searchParams.get('page') ?? '1';
  const page = isNaN(+queryPage) ? 1 : +queryPage;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // En móvil muestra 3 páginas, en pantallas más grandes muestra 7
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const maxVisible = isMobile ? 3 : 7;
  const pages = totalPages > 1 ? getPageRange(page, totalPages, maxVisible) : [];


  return (
    <div className="flex items-center justify-center space-x-2 gap-1 flex-wrap">
      <Button
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
        Anteriores
      </Button>

      {pages.map((p, index) =>
        p === '...' ? (
          <span
            key={`ellipsis-${index}`}
            className="px-1 text-muted-foreground select-none"
          >
            …
          </span>
        ) : (
          <Button
            key={p}
            variant={page === p ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePageChange(p)}
          >
            {p}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="sm"
        disabled={page === totalPages}
        onClick={() => handlePageChange(page + 1)}
      >
        Siguientes
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};