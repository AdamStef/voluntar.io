import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';
import { Page } from '@/utils/types/types';

interface PaginationProps<T> {
  page: Page<T>;
  onPageChange: (page: number) => void;
}

export const PaginationComponent = <T,>({
  page,
  onPageChange,
}: PaginationProps<T>) => {
  const {
    number: currentPage,
    totalPages,
    first: isFirstPage,
    last: isLastPage,
  } = page;
  const displayCurrentPage = currentPage + 1;

  const changePage = (page: number) => {
    console.log('Changing page to:', page);
    onPageChange(page);
    window.scrollTo(0, 0);
  };

  return (
    <Pagination className="my-2">
      <PaginationContent>
        {!isFirstPage && (
          <PaginationItem>
            <PaginationPrevious onClick={() => changePage(currentPage - 1)} />
          </PaginationItem>
        )}
        {/* Render first page link */}
        {displayCurrentPage > 2 && (
          <PaginationItem>
            <PaginationLink onClick={() => changePage(0)}>{1}</PaginationLink>
          </PaginationItem>
        )}
        {/* Render previous ellipsis */}
        {displayCurrentPage > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Render previous page link */}
        {displayCurrentPage > 1 && (
          <PaginationItem>
            <PaginationLink onClick={() => changePage(currentPage - 1)}>
              {displayCurrentPage - 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Render current */}
        <PaginationItem>
          <PaginationLink className="bg-primary text-primary-foreground">
            {displayCurrentPage}
          </PaginationLink>
        </PaginationItem>

        {/* Render next page link */}
        {displayCurrentPage < totalPages && (
          <PaginationItem>
            <PaginationLink onClick={() => changePage(currentPage + 1)}>
              {displayCurrentPage + 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Render next ellipsis */}
        {displayCurrentPage < totalPages - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {/* Render last page link */}
        {displayCurrentPage < totalPages - 1 && (
          <PaginationItem>
            <PaginationLink onClick={() => changePage(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}
        {!isLastPage && (
          <PaginationItem>
            <PaginationNext onClick={() => changePage(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};
