// PaginatedList.tsx
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
  // const { page: initialPage } = useParams();
  const query = new URLSearchParams(location.search);
  console.log('Query:', query.get('page'));
  const initialPage = parseInt(query.get('page') || '0');
  // const [currentPage, setCurrentPage] = useState<number>(initialPage);

  useEffect(() => {
    if (page.number !== initialPage) {
      console.log('Navigating to:', initialPage);
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
      {/* <Pagination currentPage={currentPage} onPageChange={handlePageChange} /> */}
    </>
  );
};

export default PaginatedList;
