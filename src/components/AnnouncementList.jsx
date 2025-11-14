import HeartButton from './HeartButton';

const DEFAULT_HEADER_LABELS = ['제목', '카테고리', '포스팅된 곳', '작성일', '마감일', '즐겨찾기'];

function AnnouncementList({
  announcements = [],
  favorites,
  isFavorite,
  onToggleFavorite,
  onSelectAnnouncement,
  loading = false,
  error = null,
  emptyMessage = '표시할 공지가 없습니다.',
  headerLabels = DEFAULT_HEADER_LABELS,
  getSources = (item) => {
    // source가 객체 배열인 경우 그대로 반환, 문자열 배열인 경우 호환성 유지
    const sources = item.source ?? [];
    if (sources.length > 0 && typeof sources[0] === 'string') {
      // 문자열 배열인 경우 객체 배열로 변환 (URL 없음)
      return sources.map((name) => ({ name, url: null }));
    }
    return sources;
  },
  getDeadline = (item) => item.deadline ?? '-',
  getHighlight = (item) => item.highlight,
  rowClassName = 'grid grid-cols-1 items-start gap-4 px-6 py-4 text-[15px] text-[#1e232e] transition-colors hover:bg-[#f8f9fb] sm:grid-cols-[3fr_1.1fr_1.5fr_1fr_1fr_0.5fr] sm:items-center',
  headerWrapperClassName = 'hidden grid-cols-[3fr_1.1fr_1.5fr_1fr_1fr_0.5fr] items-center gap-4 border-b border-[#e6e9ef] bg-[#f8f9fb] px-6 py-3 text-[12px] font-semibold tracking-[0.05em] text-[#7a8497] uppercase sm:grid',
  listClassName = 'divide-y divide-[#e6e9ef]',
  messagePaddingClassName = 'px-6',
  // 페이지네이션 관련 props
  pagination = null, // { currentPage, totalPages, pageSize, total, onPageChange }
  showPagination = false,
}) {
  const resolveFavorite = (item) => {
    if (typeof isFavorite === 'function') {
      return isFavorite(item);
    }
    if (favorites instanceof Set) {
      return favorites.has(item.id);
    }
    return false;
  };

  if (loading) {
    return (
      <div className={`${messagePaddingClassName} py-8 text-center text-[14px] text-[#7a8497]`}>
        데이터를 불러오는 중입니다...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${messagePaddingClassName} py-8 text-center text-[14px] text-[#c73531]`}>
        {error}
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className={`${messagePaddingClassName} py-8 text-center text-[14px] text-[#7a8497]`}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div>
      <div className={headerWrapperClassName}>
        {headerLabels.map((label, index) => {
          const isLast = index === headerLabels.length - 1;
          const alignmentClass = index === 0 ? '' : isLast ? 'text-right' : 'text-center';
          return (
            <span key={label} className={alignmentClass}>
              {label}
            </span>
          );
        })}
      </div>

      <ul className={listClassName}>
        {announcements.map((item) => {
          const isActive = resolveFavorite(item);
          const sources = getSources(item);
          const deadline = getDeadline(item);
          const highlight = getHighlight(item);

          return (
            <li key={item.id} className={rowClassName}>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  {highlight ? (
                    <span className="inline-flex rounded-[4px] border border-[#d3d8e0] bg-[#f4f6fc] px-[6px] py-[2px] text-[11px] font-semibold tracking-[0.08em] text-[#0b3aa2] uppercase">
                      {highlight}
                    </span>
                  ) : null}
                  {onSelectAnnouncement ? (
                    <button
                      type="button"
                      onClick={() => onSelectAnnouncement(item)}
                      className="text-left text-[16px] font-semibold text-[#1e232e] transition-colors hover:text-[#0b3aa2]"
                    >
                      {item.title}
                    </button>
                  ) : (
                    <span className="text-[16px] font-semibold text-[#1e232e]">{item.title}</span>
                  )}
                </div>
                {item.sub ? (
                  <span className="block text-[13px] text-[#8c95a6]">{item.sub}</span>
                ) : null}
              </div>

              <div className="text-[14px] text-[#5d6676] sm:text-center">
                {item.category ?? '-'}
              </div>

              <div className="flex flex-col items-center gap-[6px] text-center">
                {sources && sources.length > 0 ? (
                  sources.map((sourceItem, index) => {
                    const sourceName =
                      typeof sourceItem === 'string' ? sourceItem : sourceItem.name;
                    const sourceUrl = typeof sourceItem === 'object' ? sourceItem.url : null;

                    if (sourceUrl) {
                      return (
                        <a
                          key={`${sourceName}-${index}`}
                          href={sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex cursor-pointer rounded-[4px] border border-[#e0e5ef] bg-white px-[6px] py-[3px] text-[12px] font-medium text-[#7a8497] transition-colors hover:border-[#0b3aa2] hover:bg-[#f8faff] hover:text-[#0b3aa2]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {sourceName}
                        </a>
                      );
                    }
                    return (
                      <span
                        key={`${sourceName}-${index}`}
                        className="inline-flex rounded-[4px] border border-[#e0e5ef] bg-white px-[6px] py-[3px] text-[12px] font-medium text-[#7a8497]"
                      >
                        {sourceName}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-[12px] text-[#9aa3b2]">-</span>
                )}
              </div>

              <div className="text-[14px] text-[#5d6676] sm:text-center">
                {item.postedAt ?? '-'}
              </div>

              <div className="flex justify-start sm:justify-center">
                <span className="inline-flex rounded-[4px] bg-[#fff4f3] px-[8px] py-[3px] text-[13px] font-semibold text-[#c73531]">
                  {deadline}
                </span>
              </div>

              <div className="flex justify-start sm:justify-center">
                <HeartButton active={isActive} onToggle={() => onToggleFavorite?.(item)} />
              </div>
            </li>
          );
        })}
      </ul>

      {/* 페이지네이션 */}
      {showPagination && pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 border-t border-[#e6e9ef] px-6 py-4">
          <button
            type="button"
            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="flex items-center justify-center rounded-[6px] border border-[#e6e9ef] px-3 py-1.5 text-[14px] font-medium text-[#1e232e] transition-colors hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
            aria-label="이전 페이지"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
              <path
                d="M12.5 5.75a.75.75 0 0 0-1.28-.53l-3 3a.75.75 0 0 0 0 1.06l3 3A.75.75 0 0 0 12.5 11.5l-2.47-2.47L12.5 6.56A.75.75 0 0 0 12.5 5.75Z"
                fill="currentColor"
              />
            </svg>
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((page) => {
                // 현재 페이지 주변 2페이지씩만 표시
                const current = pagination.currentPage;
                return (
                  page === 1 ||
                  page === pagination.totalPages ||
                  (page >= current - 2 && page <= current + 2)
                );
              })
              .map((page, index, array) => {
                // 이전 페이지와의 간격이 2 이상이면 생략 표시 추가
                const prevPage = array[index - 1];
                const showEllipsis = prevPage && page - prevPage > 1;

                return (
                  <div key={page} className="flex items-center gap-1">
                    {showEllipsis && <span className="px-2 text-[14px] text-[#9aa3b2]">...</span>}
                    <button
                      type="button"
                      onClick={() => pagination.onPageChange(page)}
                      className={`min-w-[32px] rounded-[6px] px-2 py-1.5 text-[14px] font-medium transition-colors ${
                        page === pagination.currentPage
                          ? 'bg-[#0b3aa2] text-white'
                          : 'text-[#1e232e] hover:bg-[#f8f9fb]'
                      }`}
                      aria-label={`${page}페이지`}
                      aria-current={page === pagination.currentPage ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  </div>
                );
              })}
          </div>

          <button
            type="button"
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="flex items-center justify-center rounded-[6px] border border-[#e6e9ef] px-3 py-1.5 text-[14px] font-medium text-[#1e232e] transition-colors hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
            aria-label="다음 페이지"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
              <path
                d="M7.5 5.75a.75.75 0 0 1 1.28-.53l3 3a.75.75 0 0 1 0 1.06l-3 3A.75.75 0 0 1 7.5 11.5l2.47-2.47L7.5 6.56A.75.75 0 0 1 7.5 5.75Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default AnnouncementList;
