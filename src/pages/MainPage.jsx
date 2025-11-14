import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AnnouncementList from '../components/AnnouncementList';
import AnnouncementDetailModal from '../components/AnnouncementDetailModal';

function MainPage() {
  // 사용하고 있는 state 선언
  const [categories, setCategories] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [favorites, setFavorites] = useState(() => new Set());
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState(() => new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const activeCategory = categories[activeCategoryIndex];

  // 카테고리 및 출처 필터링
  let filteredAnnouncements =
    activeCategoryIndex === 0 || !activeCategory
      ? announcements
      : announcements.filter((item) => item.category === activeCategory);

  // 출처 필터링
  if (selectedSources.size > 0) {
    filteredAnnouncements = filteredAnnouncements.filter((item) => {
      const sources = item.source ?? [];
      const sourceNames = sources.map((s) => (typeof s === 'string' ? s : s.name));
      return sourceNames.some((name) => selectedSources.has(name));
    });
  }

  // 페이지네이션 계산
  const totalItems = filteredAnnouncements.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedAnnouncements = filteredAnnouncements.slice(startIndex, endIndex);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // 페이지 변경 시 스크롤을 맨 위로
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/dummy_data.json'); // 현재는 dummy_data를 긁어오지만 api 연결을 나중에 해야함.
        if (!response.ok) {
          throw new Error('Failed to fetch dummy data');
        }
        const data = await response.json();
        const fetchedCategories = data.categories ?? [];
        const uniqueCategories = fetchedCategories.filter(
          (item, index) => fetchedCategories.indexOf(item) === index,
        );
        setCategories(uniqueCategories);
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

  // 카테고리 변경 시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategoryIndex]);

  // 모든 공지에서 고유한 출처 목록 추출
  const allSources = Array.from(
    new Set(
      announcements.flatMap((announcement) => {
        const sources = announcement.source ?? [];
        return sources.map((s) => (typeof s === 'string' ? s : s.name));
      }),
    ),
  ).sort();

  // 출처 선택/해제 토글
  const toggleSource = (sourceName) => {
    setSelectedSources((prev) => {
      const next = new Set(prev);
      if (next.has(sourceName)) {
        next.delete(sourceName);
      } else {
        next.add(sourceName);
      }
      return next;
    });
    // 출처 필터 변경 시 첫 페이지로 이동
    setCurrentPage(1);
  };

  // 드롭다운 버튼 텍스트 결정
  const getSourceButtonText = () => {
    if (selectedSources.size === 0) {
      return '선택하세요';
    }
    if (selectedSources.size === 1) {
      return Array.from(selectedSources)[0];
    }
    return `${selectedSources.size}개 선택됨`;
  };

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

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = () => {
      setIsSourceDropdownOpen(false);
    };
    if (isSourceDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isSourceDropdownOpen]);

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
              const isRecommended = item === '추천';
              const classes = [
                'pb-2 transition-colors',
                isActive ? 'border-b-2 border-[#0b3aa2] text-[#0b3aa2]' : 'hover:text-[#1e232e]',
                isRecommended
                  ? 'flex items-center gap-1.5'
                  : '' /* 별 표시 추가 때문에 추가 가운데 정렬 추가되는 부분 */,
              ]
                .filter(Boolean)
                .join(' ');
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActiveCategoryIndex(index)}
                  className={classes}
                  aria-pressed={isActive}
                >
                  {isRecommended /* 별 표시 추가하는 부분 */ ? (
                    <span className="flex items-center gap-1.5">
                      <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
                        <path
                          d="m8 1.5 1.75 4.3 4.75.28-3.7 3.03 1.16 4.63L8 11.46l-3.96 2.28 1.16-4.63-3.7-3.03 4.75-.28L8 1.5Z"
                          fill={isActive ? 'currentColor' : '#9aa3b2'}
                        />
                      </svg>
                      추천
                    </span>
                  ) : (
                    item
                  )}
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
            <div className="relative">
              <label className="mb-1 block text-[13px] font-medium text-[#5d6676]">
                공지 출처 (포스팅된 곳)
              </label>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSourceDropdownOpen(!isSourceDropdownOpen);
                }}
                className="flex w-full items-center justify-between rounded-[6px] border border-[#e6e9ef] px-3 py-2 text-left text-[14px] font-medium text-[#1e232e] transition-colors hover:bg-[#f8f9fb]"
                aria-expanded={isSourceDropdownOpen}
                aria-haspopup="listbox"
              >
                <span className={selectedSources.size === 0 ? 'text-[#9aa3b2]' : ''}>
                  {getSourceButtonText()}
                </span>
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className={`h-5 w-5 text-[#7a8497] transition-transform ${
                    isSourceDropdownOpen ? 'rotate-90' : ''
                  }`}
                >
                  <path
                    d="M7.5 5.75a.75.75 0 0 1 1.28-.53l3 3a.75.75 0 0 1 0 1.06l-3 3A.75.75 0 0 1 7.5 11.5l2.47-2.47L7.5 6.56A.75.75 0 0 1 7.5 5.75Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
              {isSourceDropdownOpen && (
                <div
                  className="absolute z-10 mt-1 w-full rounded-[6px] border border-[#e6e9ef] bg-white shadow-lg"
                  role="listbox"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="max-h-[200px] overflow-y-auto p-2">
                    {allSources.length > 0 ? (
                      allSources.map((sourceName) => {
                        const isChecked = selectedSources.has(sourceName);
                        return (
                          <label
                            key={sourceName}
                            className="flex cursor-pointer items-center gap-2 rounded-[4px] px-2 py-1.5 text-[14px] text-[#1e232e] transition-colors hover:bg-[#f8f9fb]"
                            role="option"
                            aria-selected={isChecked}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleSource(sourceName)}
                              className="h-4 w-4 cursor-pointer rounded border-[#d3d8e0] text-[#0b3aa2] focus:ring-2 focus:ring-[#0b3aa2] focus:ring-offset-0"
                            />
                            <span className="flex-1">{sourceName}</span>
                          </label>
                        );
                      })
                    ) : (
                      <div className="px-2 py-1.5 text-[14px] text-[#9aa3b2]">출처가 없습니다</div>
                    )}
                  </div>
                </div>
              )}
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
            {isLoading
              ? '검색 결과 불러오는 중...'
              : `검색 결과 ${totalItems}개${totalPages > 1 ? ` (${currentPage}/${totalPages}페이지)` : ''}`}
          </span>
        </div>

        {activeCategory === '추천' /* 추천 탭에서만 위에 간단한 설명 추가*/ ? (
          <div className="mt-2 flex items-center gap-2 rounded-[6px] border border-[#e3e9f6] bg-[#f8faff] px-3 py-2 text-[13px] text-[#5d6676]">
            <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 text-[#0b3aa2]">
              <path
                d="m8 1.5 1.75 4.3 4.75.28-3.7 3.03 1.16 4.63L8 11.46l-3.96 2.28 1.16-4.63-3.7-3.03 4.75-.28L8 1.5Z"
                fill="currentColor"
              />
            </svg>
            사용자의 프로필을 기반으로, NotiSNU가 추천하는 활동들이에요.
          </div>
        ) : null}

        <section className="mt-3 overflow-hidden rounded-[6px] border border-[#e6e9ef] bg-white shadow-sm">
          <AnnouncementList // 공지리스트를 컴포넌트로 밖으로 싹 뺐음. 각종 state 넘겨주면서.
            announcements={paginatedAnnouncements}
            favorites={favorites}
            onToggleFavorite={(item) => toggleFavorite(item.id)}
            onSelectAnnouncement={(item) => setSelectedAnnouncement(item)}
            loading={isLoading}
            error={fetchError}
            emptyMessage="조건에 맞는 공지가 없습니다."
            showPagination={totalPages > 1}
            pagination={{
              currentPage,
              totalPages,
              pageSize,
              total: totalItems,
              onPageChange: handlePageChange,
            }}
          />
        </section>
      </div>
      <AnnouncementDetailModal
        open={Boolean(selectedAnnouncement)}
        onClose={() => setSelectedAnnouncement(null)}
        announcement={selectedAnnouncement} /* 해당 공지에 해당하는 모달 내용 고르기 위해서 */
      />
    </div>
  );
}

export default MainPage;
