import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        type="button"
        className="pagination-btn"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft size={18} />
      </button>
      <span className="pagination-info">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        className="pagination-btn"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
