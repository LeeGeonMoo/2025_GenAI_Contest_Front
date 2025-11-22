import { Fragment, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPost } from '../api/posts';
import { transformAnnouncement } from '../utils/transformAnnouncement';

function AnnouncementDetailModal({ open, onClose, postId }) {
  const [postDetail, setPostDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // postId가 변경되거나 모달이 열릴 때 상세 정보 가져오기
  useEffect(() => {
    if (!open || !postId) {
      setPostDetail(null);
      setError(null);
      return;
    }

    const loadPostDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getPost(postId);
        // 백엔드 응답을 프론트엔드 형식으로 변환
        const transformed = transformAnnouncement(data);
        setPostDetail(transformed);
      } catch (err) {
        console.error('Error loading post detail:', err);
        setError('상세 정보를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPostDetail();
  }, [open, postId]);

  if (!open || !postId) {
    return null;
  }

  if (isLoading) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-4"
        onClick={onClose}
      >
        <div
          className="max-h-[80vh] w-full max-w-[520px] rounded-2xl border border-[#c5cedd] bg-white p-6"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-center py-8">
            <div className="text-[14px] text-[#5d6676]">로딩 중...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !postDetail) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-4"
        onClick={onClose}
      >
        <div
          className="max-h-[80vh] w-full max-w-[520px] rounded-2xl border border-[#c5cedd] bg-white p-6"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-center py-8">
            <div className="text-[14px] text-[#c73531]">
              {error || '상세 정보를 불러올 수 없습니다.'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 원본 데이터에서 모든 정보 추출
  const {
    title,
    sub,
    category,
    source,
    sources,
    postedAt,
    deadline,
    summary,
    college,
    department,
    audience_grade,
    url,
    likes,
    tags,
  } = postDetail;

  const sourceList = sources ?? source ?? [];

  // source가 객체 배열인지 문자열 배열인지 확인하고 처리
  const getSourceName = (item) => {
    return typeof item === 'string' ? item : item.name;
  };

  const getSourceUrl = (item) => {
    return typeof item === 'object' && item.url ? item.url : null;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-[640px] overflow-y-auto rounded-2xl border border-[#c5cedd] bg-white transition-transform"
        onClick={(event) => event.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="sticky top-0 z-10 border-b border-[#c5cedd] bg-white px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {category && (
                <span className="inline-flex rounded-[6px] border border-[#d3d8e0] bg-[#f4f6fc] px-[10px] py-[4px] text-[12px] font-semibold text-[#0b3aa2]">
                  {category}
                </span>
              )}
              <h2 className="mt-3 text-[22px] leading-tight font-bold text-[#1e232e]">{title}</h2>
              {sub && <p className="mt-2 text-[14px] leading-relaxed text-[#5d6676]">{sub}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-full p-2 text-[#7a8497] transition-colors hover:bg-[#f1f4f9] hover:text-[#1e232e]"
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
        </div>

        {/* 본문 */}
        <div className="px-6 py-5">
          {/* 요약 */}
          {summary && (
            <div className="mb-6 rounded-xl border border-[#c5cedd] bg-[#f8f9fb] p-4">
              <div className="markdown-content text-[14px] leading-[1.7] text-[#1e232e]">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // 링크 처리
                    a: ({ node, children, href, ...props }) => {
                      const displayText =
                        typeof children[0] === 'string' && children[0].length > 50
                          ? children[0].substring(0, 50) + '...'
                          : children;
                      return (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="break-all text-[#0b3aa2] underline hover:text-[#0a3490]"
                          title={href}
                          {...props}
                        >
                          {displayText}
                        </a>
                      );
                    },
                    // 단락
                    p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                    // 리스트
                    ul: ({ node, ...props }) => (
                      <ul
                        className="mb-3 ml-4 list-outside list-disc space-y-1.5 [&_ul]:mt-1 [&_ul]:mb-0 [&_ul]:ml-4"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="mb-3 ml-4 list-outside list-decimal space-y-1.5 [&_ol]:mt-1 [&_ol]:mb-0 [&_ol]:ml-4"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="pl-1.5 [&>p]:mb-1 [&>p]:last:mb-0" {...props} />
                    ),
                    // Blockquote
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="my-2 border-l-4 border-[#0b3aa2] bg-[#e8eef7] py-2 pl-3 text-[#4a5568] italic"
                        {...props}
                      />
                    ),
                    // 코드
                    code: ({ node, inline, ...props }) =>
                      inline ? (
                        <code
                          className="rounded bg-[#e1e6ed] px-1.5 py-0.5 font-mono text-[13px]"
                          {...props}
                        />
                      ) : (
                        <code
                          className="my-2 block overflow-x-auto rounded bg-[#e1e6ed] p-2 font-mono text-[13px]"
                          {...props}
                        />
                      ),
                    // 강조
                    strong: ({ node, ...props }) => (
                      <strong className="font-semibold text-[#1e232e]" {...props} />
                    ),
                    em: ({ node, ...props }) => <em className="italic" {...props} />,
                    // 제목
                    h1: ({ node, ...props }) => (
                      <h1 className="mt-3 mb-2 text-base font-bold" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="mt-2 mb-2 text-[15px] font-bold" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="mt-2 mb-1 text-[14px] font-semibold" {...props} />
                    ),
                    // 구분선
                    hr: ({ node, ...props }) => (
                      <hr className="my-3 border-t border-[#c5cedd]" {...props} />
                    ),
                  }}
                >
                  {summary}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* 주요 정보 그리드 */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* 작성일 */}
            <div className="rounded-lg border border-[#c5cedd] bg-white p-4">
              <dt className="mb-1 text-[12px] font-semibold text-[#7a8497]">작성일</dt>
              <dd className="text-[14px] font-medium text-[#1e232e]">{postedAt ?? '-'}</dd>
            </div>

            {/* 마감일 */}
            <div className="rounded-lg border border-[#fff4f3] bg-[#fff4f3] p-4">
              <dt className="mb-1 text-[12px] font-semibold text-[#c73531]">마감일</dt>
              <dd className="text-[14px] font-semibold text-[#c73531]">{deadline ?? '-'}</dd>
            </div>

            {/* 단과대학 */}
            {college && college !== 'Dummy College' && (
              <div className="rounded-lg border border-[#c5cedd] bg-white p-4">
                <dt className="mb-1 text-[12px] font-semibold text-[#7a8497]">단과대학</dt>
                <dd className="text-[14px] font-medium text-[#1e232e]">{college}</dd>
              </div>
            )}

            {/* 학과/부서 */}
            {department && (
              <div
                className={`rounded-lg border border-[#c5cedd] bg-white p-4 ${
                  !college || college === 'Dummy College' ? 'sm:col-span-2' : ''
                }`}
              >
                <dt className="mb-1 text-[12px] font-semibold text-[#7a8497]">학과/부서</dt>
                <dd className="text-[14px] font-medium text-[#1e232e]">{department}</dd>
              </div>
            )}

            {/* 대상 학년 */}
            {audience_grade && audience_grade.length > 0 && (
              <div className="rounded-lg border border-[#c5cedd] bg-white p-4">
                <dt className="mb-2 text-[12px] font-semibold text-[#7a8497]">대상 학년</dt>
                <dd className="flex flex-wrap gap-2">
                  {audience_grade.map((grade) => (
                    <span
                      key={grade}
                      className="inline-flex rounded-md bg-[#f4f6fc] px-[10px] py-[4px] text-[13px] font-medium text-[#526080]"
                    >
                      {grade}학년
                    </span>
                  ))}
                </dd>
              </div>
            )}

            {/* 좋아요 수 */}
            <div className="rounded-lg border border-[#c5cedd] bg-white p-4">
              <dt className="mb-1 text-[12px] font-semibold text-[#7a8497]">좋아요</dt>
              <dd className="flex items-center gap-1 text-[14px] font-medium text-[#1e232e]">
                <svg className="h-4 w-4 text-[#c73531]" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                {likes ?? 0}
              </dd>
            </div>
          </div>

          {/* 포스팅된 곳 */}
          {sourceList && sourceList.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-[13px] font-semibold text-[#7a8497]">포스팅된 곳</h3>
              <div className="flex flex-wrap gap-2">
                {sourceList.map((item, index) => {
                  const sourceName = getSourceName(item);
                  const sourceUrl = getSourceUrl(item);

                  if (sourceUrl) {
                    return (
                      <a
                        key={`${sourceName}-${index}`}
                        href={sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-[#e0e5ef] bg-white px-[12px] py-[8px] text-[13px] font-medium text-[#526080] transition-all hover:border-[#0b3aa2] hover:bg-[#f8faff] hover:text-[#0b3aa2]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {sourceName}
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    );
                  }
                  return (
                    <span
                      key={`${sourceName}-${index}`}
                      className="inline-flex rounded-lg border border-[#e0e5ef] bg-white px-[12px] py-[8px] text-[13px] font-medium text-[#526080]"
                    >
                      {sourceName}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* 태그 */}
          {tags && tags.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-[13px] font-semibold text-[#7a8497]">태그</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex rounded-md bg-[#f4f6fc] px-[10px] py-[4px] text-[12px] font-medium text-[#526080]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 원본 링크 */}
          {url && (
            <div className="border-t border-[#c5cedd] pt-4">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#0b3aa2] px-4 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#0a2d7a]"
                onClick={(e) => e.stopPropagation()}
              >
                원본 공지 보기
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnnouncementDetailModal;
