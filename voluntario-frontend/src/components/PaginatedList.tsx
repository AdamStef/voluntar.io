import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PaginationComponent } from './events/PaginationComponent';
import { Page } from '@/utils/types/types';

interface PaginatedListProps<T> {
  page: Page<T>;
  changePage: (page: number) => void;
}

const PaginatedList = <T,>({ page, changePage }: PaginatedListProps<T>) => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const initialPage = parseInt(query.get('page') || '0');

  useEffect(() => {
    if (page.number !== initialPage) {
      navigate(`?page=${initialPage}`);
    }
  }, [page.number, navigate, initialPage]);

  const handlePageChange = (newPage: number) => {
    changePage(newPage);
    navigate(`?page=${newPage}`);
  };

  return (
    <>
      <PaginationComponent<T> page={page} onPageChange={handlePageChange} />
    </>
  );
};

export default PaginatedList;
