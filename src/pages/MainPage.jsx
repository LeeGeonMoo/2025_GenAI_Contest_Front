import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AnnouncementList from '../components/AnnouncementList';

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
            <Link to="/" className="text-[21px] font-semibold tracking-[-0.2px] text-[#0b3aa2]">
              NotiSNU
            </Link>
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
          <AnnouncementList // 공지리스트를 컴포넌트로 밖으로 싹 뺐음. 각종 state 넘겨주면서.
            announcements={filteredAnnouncements}
            favorites={favorites}
            onToggleFavorite={(item) => toggleFavorite(item.id)}
            loading={isLoading}
            error={fetchError}
            emptyMessage="조건에 맞는 공지가 없습니다."
          />
        </section>
      </div>
    </div>
  );
}

export default MainPage;
