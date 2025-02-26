import { Pagination } from "@mui/material";

interface PaginationProps {
  total: number;
  page: number;
  setPage: (page: number) => void;
}

const PaginationComponent = ({ total, page, setPage }: PaginationProps) => {
  const totalPages = Math.ceil(total / 10);

  return (
    <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} />
  );
};

export default PaginationComponent;
