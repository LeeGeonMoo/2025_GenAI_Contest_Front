import HeartButton from './HeartButton';

const DEFAULT_HEADER_LABELS = ['제목', '카테고리', '포스팅된 곳', '작성일', '마감일', '즐겨찾기'];

function AnnouncementList({
  announcements = [],
  favorites,
  isFavorite,
  onToggleFavorite,
  loading = false,
  error = null,
  emptyMessage = '표시할 공지가 없습니다.',
  headerLabels = DEFAULT_HEADER_LABELS,
  getSources = (item) => item.source ?? [],
  getDeadline = (item) => item.deadline ?? '-',
  getHighlight = (item) => item.highlight,
  rowClassName = 'grid grid-cols-1 items-start gap-4 px-6 py-4 text-[15px] text-[#1e232e] transition-colors hover:bg-[#f8f9fb] sm:grid-cols-[3fr_1.1fr_1.5fr_1fr_1fr_0.5fr] sm:items-center',
  headerWrapperClassName = 'hidden grid-cols-[3fr_1.1fr_1.5fr_1fr_1fr_0.5fr] items-center gap-4 border-b border-[#e6e9ef] bg-[#f8f9fb] px-6 py-3 text-[12px] font-semibold tracking-[0.05em] text-[#7a8497] uppercase sm:grid',
  listClassName = 'divide-y divide-[#e6e9ef]',
  messagePaddingClassName = 'px-6',
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
                  <span className="text-[16px] font-semibold text-[#1e232e]">{item.title}</span>
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
                  sources.map((label) => (
                    <span
                      key={label}
                      className="inline-flex rounded-[4px] border border-[#e0e5ef] bg-white px-[6px] py-[3px] text-[12px] font-medium text-[#7a8497]"
                    >
                      {label}
                    </span>
                  ))
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
    </div>
  );
}

export default AnnouncementList;
