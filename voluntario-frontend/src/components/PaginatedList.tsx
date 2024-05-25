import { useSearchParams } from 'react-router-dom';
import { PaginationComponent } from './events/PaginationComponent';

type Page = {
  number: number;
  totalPages: number;
};

interface PaginatedListProps {
  page: Page;
  changePage: (page: number) => void;
}

const PaginatedList = ({ page, changePage }: PaginatedListProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePageChange = (newPage: number) => {
    changePage(newPage);
    setSearchParams({ page: newPage.toLocaleString() });
  };

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
