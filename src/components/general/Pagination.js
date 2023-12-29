import React from 'react';

const Pagination = ({ total, currentPage, onPageChange }) => {
  const pageArray = Array.from(Array(total).keys()).map((_, index) => index + 1);

  return (
    <div className="pagination">
      <select className="form-select" value={currentPage} onChange={(e) => onPageChange(parseInt(e.target.value, 10))}>
        {pageArray.map((pageNumber) => (
          <option key={pageNumber} value={pageNumber}>
            {pageNumber}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Pagination;
