import { Fragment } from 'react';

function AnnouncementDetailModal({ open, onClose, announcement }) {
  if (!open || !announcement) {
    return null;
  }

  const { title, sub, category, source, sources, postedAt, deadline, highlight } = announcement;

  const sourceList = sources ?? source ?? [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[80vh] w-full max-w-[520px] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl transition-transform"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            {highlight ? (
              <span className="inline-flex rounded-[6px] border border-[#d3d8e0] bg-[#f4f6fc] px-[8px] py-[3px] text-[11px] font-semibold tracking-[0.08em] text-[#0b3aa2] uppercase">
                {highlight}
              </span>
            ) : null}
            <h2 className="mt-2 text-[20px] font-semibold text-[#1e232e]">{title}</h2>
            {sub ? <p className="mt-1 text-[14px] text-[#5d6676]">{sub}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#7a8497] transition-colors hover:bg-[#f1f4f9] hover:text-[#1e232e]"
            aria-label="닫기"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
              <path
                d="M6.75 6.75 17.25 17.25M17.25 6.75 6.75 17.25"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <dl className="mt-6 space-y-3 text-[14px] text-[#1e232e]">
          <div className="flex flex-col gap-1">
            <dt className="text-[13px] font-semibold text-[#7a8497]">카테고리</dt>
            <dd>{category ?? '-'}</dd>
          </div>

          <div className="flex flex-col gap-1">
            <dt className="text-[13px] font-semibold text-[#7a8497]">포스팅된 곳</dt>
            <dd className="flex flex-col gap-2">
              {sourceList && sourceList.length > 0 ? (
                sourceList.map((item) => (
                  <span
                    key={item}
                    className="inline-flex rounded-[6px] border border-[#e0e5ef] bg-white px-[10px] py-[6px] text-[13px] font-medium text-[#526080]"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-[13px] text-[#9aa3b2]">-</span>
              )}
            </dd>
          </div>

          <div className="flex flex-col gap-1">
            <dt className="text-[13px] font-semibold text-[#7a8497]">작성일</dt>
            <dd>{postedAt ?? '-'}</dd>
          </div>

          <div className="flex flex-col gap-1">
            <dt className="text-[13px] font-semibold text-[#7a8497]">마감일</dt>
            <dd>
              <span className="inline-flex rounded-[6px] bg-[#fff4f3] px-[10px] py-[4px] text-[13px] font-semibold text-[#c73531]">
                {deadline ?? '-'}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default AnnouncementDetailModal;
