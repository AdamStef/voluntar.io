import { useSearchParams } from 'react-router-dom';
import { PaginationComponent } from './events/PaginationComponent';
import { useAppDispatch } from '@/utils/context/store';
import { setCurrentPage } from '@/utils/context/paging/pagingSlice';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

type Page = {
  number: number;
  totalPages: number;
};

interface PaginatedListProps {
  page: Page;
  // changePage: (page: number) => void;
}

const PaginatedList = ({ page }: PaginatedListProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const handlePageChange = (newPage: number) => {
    dispatch(setCurrentPage(newPage));
    queryClient.refetchQueries({ queryKey: ['events', { page: newPage }] });
    setSearchParams({ page: newPage.toLocaleString() });
  };

  useEffect(() => {
    const page = Number(searchParams.get('page')) ?? 0;
    dispatch(setCurrentPage(page));
  }, [searchParams, dispatch]);

  console.log('page', searchParams.get('page'));

  return (
    <>
      <PaginationComponent
        page={{
          number: Number(searchParams.get('page')) ?? 0,
          totalPages: page.totalPages,
        }}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default PaginatedList;
