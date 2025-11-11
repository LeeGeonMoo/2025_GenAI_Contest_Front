import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function MainPage() {
  // 사용하고 있는 state 선언
  const [categories, setCategories] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [favorites, setFavorites] = useState(() => new Set());

  const activeCategory = categories[activeCategoryIndex];
  const filteredAnnouncements =
    activeCategoryIndex === 0 || !activeCategory
      ? announcements
      : announcements.filter((item) => item.category === activeCategory);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/dummy_data.json'); // 현재는 dummy_data를 긁어오지만 api 연결을 나중에 해야함.
        if (!response.ok) {
          throw new Error('Failed to fetch dummy data');
        }
        const data = await response.json();
        setCategories(data.categories ?? []);
        setAnnouncements(data.announcements ?? []);
        setFetchError(null);
      } catch (error) {
        console.error(error);
        setFetchError('데이터를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      setActiveCategoryIndex(0);
    }
  }, [categories]);

  // 누르면 즐겨찾기 state에 추가, 누르면 즐겨찾기 삭제하는 함수
  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

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
              <Link
                to="/mypage"
                className="rounded-[4px] border border-[#d3d8e0] px-[10px] py-[6px] text-[14px] font-medium text-[#1e232e] transition-colors hover:bg-[#f8f9fb]"
              >
                마이페이지
              </Link>
            </div>
          </div>
        </header>

        <nav className="border-b border-[#e6e9ef] pb-3">
          <div className="flex flex-wrap gap-4 text-[15px] font-medium text-[#5d6676]">
            {categories.map((item, index) => {
              const isActive = index === activeCategoryIndex;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActiveCategoryIndex(index)}
                  className={[
                    'pb-2 transition-colors',
                    isActive
                      ? 'border-b-2 border-[#0b3aa2] text-[#0b3aa2]'
                      : 'hover:text-[#1e232e]',
                  ].join(' ')}
                  aria-pressed={isActive}
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
          <span>
            {isLoading ? '검색 결과 불러오는 중...' : `검색 결과 ${filteredAnnouncements.length}개`}
          </span>
        </div>

        <section className="mt-3 overflow-hidden rounded-[6px] border border-[#e6e9ef] bg-white shadow-sm">
          <div className="hidden grid-cols-[3fr_1.1fr_1.5fr_1fr_1fr_0.5fr] items-center gap-4 border-b border-[#e6e9ef] bg-[#f8f9fb] px-6 py-3 text-[12px] font-semibold tracking-[0.05em] text-[#7a8497] uppercase sm:grid">
            <span>제목</span>
            <span className="text-center">카테고리</span>
            <span className="text-center">포스팅된 곳</span>
            <span className="text-center">작성일</span>
            <span className="text-center">마감일</span>
            <span className="text-right">즐겨찾기</span>
          </div>

          {isLoading ? (
            <div className="px-6 py-8 text-center text-[14px] text-[#7a8497]">
              데이터를 불러오는 중입니다...
            </div>
          ) : fetchError ? (
            <div className="px-6 py-8 text-center text-[14px] text-[#c73531]">{fetchError}</div>
          ) : (
            <ul className="divide-y divide-[#e6e9ef]">
              {filteredAnnouncements.map((item) => {
                const isFavorite = favorites.has(item.id);
                return (
                  <li
                    key={item.id}
                    className="grid grid-cols-1 items-start gap-4 px-6 py-4 text-[15px] text-[#1e232e] transition-colors hover:bg-[#f8f9fb] sm:grid-cols-[3fr_1.1fr_1.5fr_1fr_1fr_0.5fr] sm:items-center"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[16px] font-semibold text-[#1e232e]">
                          {item.title}
                        </span>
                      </div>
                      <span className="block text-[13px] text-[#8c95a6]">{item.sub}</span>
                    </div>

                    <div className="text-[14px] text-[#5d6676] sm:text-center">{item.category}</div>

                    <div className="flex flex-wrap justify-start gap-[6px] sm:justify-center">
                      {item.source.map((label) => (
                        <span
                          key={label}
                          className="inline-flex rounded-[4px] border border-[#e6e9ef] bg-white px-[6px] py-[3px] text-[12px] font-medium text-[#7a8497]"
                        >
                          {label}
                        </span>
                      ))}
                    </div>

                    <div className="text-[14px] text-[#5d6676] sm:text-center">{item.postedAt}</div>

                    <div className="flex justify-start sm:justify-center">
                      <span className="inline-flex rounded-[4px] bg-[#fff4f3] px-[8px] py-[3px] text-[13px] font-semibold text-[#c73531]">
                        {item.deadline}
                      </span>
                    </div>

                    <div className="flex justify-start sm:justify-center">
                      <button
                        type="button"
                        onClick={() => toggleFavorite(item.id)}
                        className={`flex h-6 w-6 items-center justify-center transition-colors ${
                          isFavorite ? 'text-[#c73531]' : 'text-[#9aa3b2] hover:text-[#0b3aa2]'
                        }`}
                        aria-pressed={isFavorite}
                        aria-label="즐겨찾기"
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                          <path
                            d="M12 21s-6.4-4.59-8.46-7.3C1.2 11.2 1.6 7.84 3.9 5.78 6 3.93 9.05 4.5 12 7.27c2.95-2.77 6-3.34 8.1-1.49 2.3 2.06 2.7 5.42.36 7.92C18.4 16.41 12 21 12 21Z"
                            fill={isFavorite ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="sr-only">즐겨찾기</span>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default MainPage;
