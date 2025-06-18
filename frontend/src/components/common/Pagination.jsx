export default function Pagination ({ page, setPage, maxPage }) {
  return (
    maxPage > 1
      ? (
        <div className='table__pagination'>
          <span
            className={`page-btn ${page === 1 ? 'disabled' : ''}`}
            onClick={() => setPage(page !== 1 ? page - 1 : page)}
          >
            ⟨
          </span>

          {Array.from({ length: maxPage }, (_, i) => (
            <span
              key={i}
              className={`page-number ${page === i + 1 ? 'active' : ''}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </span>
          ))}

          <span
            className={`page-btn ${page === maxPage ? 'disabled' : ''}`}
            onClick={() => setPage(page !== maxPage ? page + 1 : page)}
          >
            ⟩
          </span>
        </div>
        )
      : ''
  )
}
