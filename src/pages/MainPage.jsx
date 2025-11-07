const categories = ['전체', '대학생활', '장학', '연구', '채용', '대외활동', '기타'];

const announcements = [
  {
    id: 1,
    title: 'LG 청소년 AI 캠프 멘토 모집',
    sub: 'AI/교육/봉사',
    category: '대학생활',
    source: ['전기정보공학부', '컴퓨터공학부', '사범대학'],
    postedAt: '10.22',
    deadline: '~ 10.27',
    highlight: '추천',
  },
  {
    id: 2,
    title: '2025-2학기 SNU 멘토링 멘티 모집',
    sub: '멘토링/교육',
    category: '대학생활',
    source: ['학부대학'],
    postedAt: '10.21',
    deadline: '~ 11.05',
  },
  {
    id: 3,
    title: 'NAVER AI 신입 공채 설명회',
    sub: 'AI/데이터/신입',
    category: '채용',
    source: ['경력개발센터'],
    postedAt: '10.20',
    deadline: '없음',
  },
  {
    id: 4,
    title: '2025년도 기계제품설계 과제전 안내',
    sub: '설계/과제/연구',
    category: '연구',
    source: ['기계공학부'],
    postedAt: '10.19',
    deadline: '~ 12.01',
  },
];

function MainPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[1100px] px-6 pt-9 pb-20">
        <header className="mb-6 border-b border-[#e6e9ef] pt-[10px] pb-[14px]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-[21px] font-semibold tracking-[-0.2px] text-[#0b3aa2]">NotiSNU</h1>
            <div className="flex items-center gap-3 text-[15px] text-[#5d6676]">
              <span>
                <span className="font-semibold text-[#1e232e]">이건무</span> 님 환영합니다
              </span>
              <button
                type="button"
                className="rounded-[4px] border border-[#d3d8e0] px-[10px] py-[6px] text-[14px] font-medium text-[#1e232e] transition-colors hover:bg-[#f8f9fb]"
              >
                마이페이지
              </button>
            </div>
          </div>
        </header>

        <nav className="border-b border-[#e6e9ef] pb-3">
          <div className="flex flex-wrap gap-4 text-[15px] font-medium text-[#5d6676]">
            {categories.map((item, index) => {
              const isActive = index === 0;
              return (
                <button
                  key={item}
                  type="button"
                  className={[
                    'pb-2 transition-colors',
                    isActive
                      ? 'border-b-2 border-[#0b3aa2] text-[#0b3aa2]'
                      : 'hover:text-[#1e232e]',
                  ].join(' ')}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </nav>

        <section className="mt-6 rounded-[6px] border border-[#e6e9ef] bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_240px]">
            <div className="flex items-center gap-3 rounded-[6px] border border-[#e6e9ef] px-3 py-2">
              <span className="inline-flex h-5 w-5 items-center justify-center text-[#5d6676]">
                <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5">
                  <path
                    d="m17.5 16.09-3.63-3.63a5.83 5.83 0 1 0-1.41 1.41l3.63 3.63a1 1 0 0 0 1.41-1.41ZM4.85 9.08a4.23 4.23 0 1 1 4.23 4.23 4.23 4.23 0 0 1-4.23-4.23Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <input
                type="search"
                placeholder="공고명, 키워드 검색"
                className="w-full bg-transparent text-[15px] font-medium text-[#1e232e] outline-none placeholder:text-[#9aa3b2]"
              />
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-medium text-[#5d6676]">
                공지 출처 (포스팅된 곳)
              </label>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-[6px] border border-[#e6e9ef] px-3 py-2 text-left text-[14px] font-medium text-[#1e232e] transition-colors hover:bg-[#f8f9fb]"
              >
                선택하세요
                <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 text-[#7a8497]">
                  <path
                    d="M7.5 5.75a.75.75 0 0 1 1.28-.53l3 3a.75.75 0 0 1 0 1.06l-3 3A.75.75 0 0 1 7.5 11.5l2.47-2.47L7.5 6.56A.75.75 0 0 1 7.5 5.75Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              className="rounded-[6px] border border-[#e6e9ef] px-[12px] py-[7px] text-[14px] font-medium text-[#1e232e] transition-colors hover:bg-[#f8f9fb]"
            >
              초기화
            </button>
            <button
              type="button"
              className="rounded-[6px] border border-[#0b3aa2] bg-[#0b3aa2] px-[12px] py-[7px] text-[14px] font-medium text-white transition-colors hover:brightness-95"
            >
              검색
            </button>
          </div>
        </section>

        <div className="mt-6 flex items-center justify-between text-[14px] text-[#5d6676]">
          <span>검색 결과 {announcements.length}개</span>
        </div>

        <section className="mt-3 overflow-hidden rounded-[6px] border border-[#e6e9ef] bg-white shadow-sm">
          <div className="hidden grid-cols-[3fr,1.2fr,1.5fr,1fr,1fr,0.5fr] gap-4 border-b border-[#e6e9ef] bg-[#f8f9fb] px-4 py-3 text-[12px] font-semibold tracking-[0.05em] text-[#7a8497] uppercase sm:grid">
            <span>제목</span>
            <span>카테고리</span>
            <span>포스팅된 곳</span>
            <span>작성일</span>
            <span>마감일</span>
            <span className="text-right">즐겨찾기</span>
          </div>

          <div>
            {announcements.map((item) => (
              <article
                key={item.id}
                className="grid grid-cols-1 gap-4 border-b border-[#e6e9ef] px-4 py-4 text-[15px] text-[#1e232e] last:border-b-0 sm:grid-cols-[3fr,1.2fr,1.5fr,1fr,1fr,0.5fr] sm:items-center"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {item.highlight ? (
                      <span className="inline-flex rounded-[4px] border border-[#d3d8e0] bg-[#f4f6fc] px-[6px] py-[2px] text-[11px] font-semibold tracking-[0.08em] text-[#0b3aa2] uppercase">
                        {item.highlight}
                      </span>
                    ) : null}
                    <span className="text-[16px] font-semibold text-[#1e232e]">{item.title}</span>
                  </div>
                  <span className="text-[13px] text-[#8c95a6]">{item.sub}</span>
                </div>

                <span className="text-[14px] text-[#5d6676]">{item.category}</span>

                <div className="flex flex-wrap gap-[6px]">
                  {item.source.map((label) => (
                    <span
                      key={label}
                      className="inline-flex rounded-[4px] border border-[#e6e9ef] bg-white px-[6px] py-[3px] text-[12px] font-medium text-[#7a8497]"
                    >
                      {label}
                    </span>
                  ))}
                </div>

                <span className="text-[14px] text-[#5d6676]">{item.postedAt}</span>

                <span className="inline-flex w-fit rounded-[4px] bg-[#fff4f3] px-[6px] py-[3px] text-[13px] font-semibold text-[#c73531]">
                  {item.deadline}
                </span>

                <button
                  type="button"
                  className="hidden justify-end text-[#9aa3b2] transition-colors hover:text-[#0b3aa2] sm:flex"
                  aria-label="즐겨찾기"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
                    <path
                      d="m12 17.27-4.38 2.3a.75.75 0 0 1-1.09-.79l.84-4.88-3.54-3.45a.75.75 0 0 1 .42-1.28l4.9-.71 2.19-4.44a.75.75 0 0 1 1.34 0l2.19 4.44 4.9.71a.75.75 0 0 1 .42 1.28l-3.54 3.45.84 4.88a.75.75 0 0 1-1.09.79Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default MainPage;
