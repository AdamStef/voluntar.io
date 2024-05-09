import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';
import { useAppDispatch, useAppSelector } from '@/utils/context/store';
import { PagingSlice } from '@/utils/context/paging/pagingSlice';
import { QueryClient } from '@tanstack/react-query';

export const PaginationComponent = () => {
  const { currentPage, totalPages, isFirstPage, isLastPage } = useAppSelector(
    (state) => state.paging,
  );
  const dispatch = useAppDispatch();
  const queryClient = new QueryClient();

  const changePage = (page: number) => {
    // console.log('Changing page to:', page);
    // console.log('Current page:', currentPage);
    // console.log('Total pages:', totalPages);
    // console.log('Is first page:', isFirstPage);
    // console.log('Is last page:', isLastPage);

    dispatch({
      type: PagingSlice.actions.setCurrentPage.type,
      payload: page,
    });
    queryClient.invalidateQueries({ queryKey: ['events'] });
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
        {currentPage > 2 && (
          <PaginationItem>
            <PaginationLink onClick={() => changePage(1)}>{1}</PaginationLink>
          </PaginationItem>
        )}
        {/* Render previous ellipsis */}
        {currentPage > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Render previous page link */}
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationLink onClick={() => changePage(currentPage - 1)}>
              {currentPage - 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Render current */}
        <PaginationItem>
          <PaginationLink className="bg-primary text-primary-foreground">
            {currentPage}
          </PaginationLink>
        </PaginationItem>

        {/* Render next page link */}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationLink onClick={() => changePage(currentPage + 1)}>
              {currentPage + 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Render next ellipsis */}
        {currentPage < totalPages - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {/* Render last page link */}
        {currentPage < totalPages - 1 && (
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
