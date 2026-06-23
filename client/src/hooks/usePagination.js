import { useMemo, useState } from "react";

export const usePagination = (items, pageSize = 10) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const paginatedItems = useMemo(() => {
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize, totalPages]);

  const goToPage = (nextPage) => {
    setPage(Math.min(Math.max(1, nextPage), totalPages));
  };

  const resetPage = () => setPage(1);

  return {
    page,
    totalPages,
    paginatedItems,
    goToPage,
    resetPage,
    setPage,
  };
};
