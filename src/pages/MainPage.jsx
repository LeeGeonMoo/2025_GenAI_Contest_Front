import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnnouncementList from '../components/AnnouncementList';
import AnnouncementDetailModal from '../components/AnnouncementDetailModal';
import { getFeed, getRecoUser } from '../api/feed';
import { search as searchAPI } from '../api/search';
import { likePost, unlikePost } from '../api/likes';
import { getUserLikes } from '../api/users';
import { CURRENT_USER_ID } from '../config/constants';
import { transformAnnouncement } from '../utils/transformAnnouncement';

function MainPage() {
  const navigate = useNavigate();

  // 사용하고 있는 state 선언
  const [categories, setCategories] = useState([
    '전체',
    '대학생활',
    '장학',
    '연구',
    '채용',
    '대외활동',
    '기타',
    '추천',
  ]);
  const [announcements, setAnnouncements] = useState([]);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [favorites, setFavorites] = useState(() => new Set());
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState(() => new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [allAvailableSources, setAllAvailableSources] = useState([]); // 전체 출처 목록
  const pageSize = 20;

  const activeCategory = categories[activeCategoryIndex];

  // 클라이언트 사이드 필터링 제거 - 검색 모드일 때만 백엔드에서 source 필터링 수행
  // 피드 모드에서는 source 필터링 없음

  // 검색 실행 함수
  const handleSearch = async () => {
    // 키워드나 소스 중 하나라도 선택되어 있으면 검색 모드
    const hasKeyword = searchQuery.trim().length > 0;
    const hasSource = selectedSources.size > 0;

    if (!hasKeyword && !hasSource) {
      // 둘 다 없으면 피드로 돌아가기
      setIsSearchMode(false);
      setCurrentPage(1);
      const category = activeCategoryIndex === 0 ? null : activeCategory;
      loadFeed(category, 1);
      return;
    }

    setIsSearchMode(true);
    setIsLoading(true);
    setFetchError(null);
    setCurrentPage(1);

    try {
      const category = activeCategoryIndex === 0 ? null : activeCategory;
      const sourceArray = selectedSources.size > 0 ? Array.from(selectedSources) : null;

      const data = await searchAPI({
        q: hasKeyword ? searchQuery.trim() : null,
        category: category === '전체' || !category ? null : category,
        source: sourceArray,
        page: 1,
        page_size: pageSize,
      });

      const transformedItems = data.items.map(transformAnnouncement);
      setAnnouncements(transformedItems);
      setTotalItems(data.meta.total);
      setTotalPages(data.meta.total_pages);

      // 검색 결과에 대한 좋아요 상태 확인
      updateFavoritesForCurrentPage(transformedItems);
    } catch (error) {
      console.error('Failed to search:', error);
      setFetchError('검색 중 오류가 발생했습니다.');
      setAnnouncements([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  // 검색 페이지 변경
  const handleSearchPageChange = async (page) => {
    setIsLoading(true);
    setFetchError(null);
    setCurrentPage(page);

    try {
      const category = activeCategoryIndex === 0 ? null : activeCategory;
      const sourceArray = selectedSources.size > 0 ? Array.from(selectedSources) : null;
      const hasKeyword = searchQuery.trim().length > 0;

      const data = await searchAPI({
        q: hasKeyword ? searchQuery.trim() : null,
        category: category === '전체' || !category ? null : category,
        source: sourceArray,
        page,
        page_size: pageSize,
      });

      const transformedItems = data.items.map(transformAnnouncement);
      setAnnouncements(transformedItems);
      setTotalItems(data.meta.total);
      setTotalPages(data.meta.total_pages);

      // 검색 결과에 대한 좋아요 상태 확인
      updateFavoritesForCurrentPage(transformedItems);
    } catch (error) {
      console.error('Failed to search:', error);
      setFetchError('검색 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 전체 출처 목록 수집 함수 (피드에서 여러 페이지를 순회하여 모든 출처 수집)
  const collectAllSources = async (category = null) => {
    try {
      const allSourcesSet = new Set();
      let page = 1;
      let hasMore = true;
      const maxPages = 10; // 최대 10페이지까지만 수집 (성능 고려)

      while (hasMore && page <= maxPages) {
        const data = await getFeed({
          category: category === '전체' || !category ? null : category,
          page,
          page_size: 100, // 출처 수집을 위해 큰 페이지 사이즈 사용
        });

        data.items.forEach((item) => {
          const transformedItem = transformAnnouncement(item);
          const sources = transformedItem.source ?? [];
          sources.forEach((s) => {
            const name = typeof s === 'string' ? s : s.name;
            if (name) allSourcesSet.add(name);
          });
        });

        hasMore = page < data.meta.total_pages;
        page += 1;
      }

      setAllAvailableSources(Array.from(allSourcesSet).sort());
    } catch (error) {
      console.error('Failed to collect all sources:', error);
      // 실패해도 현재 페이지의 출처라도 표시
      const currentSources = Array.from(
        new Set(
          announcements.flatMap((announcement) => {
            const sources = announcement.source ?? [];
            return sources.map((s) => (typeof s === 'string' ? s : s.name));
          }),
        ),
      ).sort();
      setAllAvailableSources(currentSources);
    }
  };

  // 피드 데이터 로드
  const loadFeed = async (category = null, page = 1) => {
    setIsLoading(true);
    setFetchError(null);
    try {
      let data;

      // '추천' 카테고리인 경우 getRecoUser 호출
      if (category === '추천') {
        data = await getRecoUser({
          user_id: CURRENT_USER_ID,
          limit: 10, // 현재 나오는건 10개로
        });

        // 디버깅용: semantic_score 출력
        console.log(
          '추천 탭 semantic scores:',
          data.items.map((item) => ({
            id: item.id,
            title: item.title,
            semantic_score: item.semantic_score,
          })),
        );
      } else {
        // 일반 카테고리
        data = await getFeed({
          category: category === '전체' || !category ? null : category,
          page,
          page_size: pageSize,
        });
      }

      const transformedItems = data.items.map(transformAnnouncement);
      setAnnouncements(transformedItems);
      setTotalItems(data.meta.total);
      setTotalPages(data.meta.total_pages);

      // 현재 페이지의 항목들에 대한 좋아요 상태 확인
      updateFavoritesForCurrentPage(transformedItems);

      // 전체 출처 목록 수집 (여러 페이지에서 수집) - 추천 탭이 아닐 때만
      if (category !== '추천') {
        await collectAllSources(category);
      }
    } catch (error) {
      console.error('Failed to load feed:', error);
      setFetchError('데이터를 불러오지 못했습니다.');
      setAnnouncements([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로드 및 카테고리 변경 시 피드 로드
  // 현재 페이지의 feed 항목들에 대한 좋아요 상태 확인
  const updateFavoritesForCurrentPage = async (feedItems) => {
    if (feedItems.length === 0) return;

    try {
      // 현재 페이지의 항목 ID들
      const currentPageIds = feedItems.map((item) => item.id);

      // 좋아요 목록에서 현재 페이지의 항목들만 확인
      // 좋아요 목록이 많을 수 있으므로, 현재 페이지 항목들만 필터링
      const allLikedIds = new Set();
      let page = 1;
      const pageSize = 100;
      let hasMore = true;
      let foundAll = false;

      while (hasMore && !foundAll) {
        const data = await getUserLikes(CURRENT_USER_ID, { page, page_size: pageSize });

        // 현재 페이지의 항목들 중 좋아요한 것만 추가
        data.items.forEach((item) => {
          if (currentPageIds.includes(item.id)) {
            allLikedIds.add(item.id);
          }
        });

        // 현재 페이지의 모든 항목을 찾았는지 확인
        foundAll = currentPageIds.every(
          (id) => allLikedIds.has(id) || !data.items.some((item) => item.id === id),
        );

        // 다음 페이지가 있는지 확인
        hasMore = page < data.meta.total_pages;
        page += 1;
      }

      // 기존 favorites에 현재 페이지 결과 병합
      setFavorites((prev) => {
        const next = new Set(prev);
        allLikedIds.forEach((id) => next.add(id));
        return next;
      });
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  useEffect(() => {
    const category = activeCategoryIndex === 0 ? null : activeCategory;

    // 검색 모드일 때 (키워드나 소스가 선택되어 있을 때)
    const hasKeyword = searchQuery.trim().length > 0;
    const hasSource = selectedSources.size > 0;

    if (isSearchMode && (hasKeyword || hasSource)) {
      // 카테고리 변경 시 검색 다시 실행 (키워드, 소스 유지)
      handleSearch();
    } else {
      // 검색 모드가 아니면 피드 로드
      loadFeed(category, 1);
      setCurrentPage(1);
    }

    // 카테고리 변경 시 전체 출처 목록도 업데이트
    collectAllSources(category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategoryIndex]);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    if (isSearchMode) {
      handleSearchPageChange(page);
    } else {
      setCurrentPage(page);
      const category = activeCategoryIndex === 0 ? null : activeCategory;
      loadFeed(category, page);
      // 페이지 변경 시 스크롤을 맨 위로
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 드롭다운에 표시할 출처 목록 (전체 출처 목록 사용)
  const allSources = allAvailableSources.length > 0 ? allAvailableSources : [];

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

  // 출처 필터 변경 시 자동 검색 제거 - 항상 '검색' 버튼을 눌러야만 검색됨

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

  // 좋아요 토글 함수 (API 호출)
  const toggleFavorite = async (id) => {
    const isLiked = favorites.has(id);

    try {
      if (isLiked) {
        // 좋아요 취소
        await unlikePost(CURRENT_USER_ID, id);
        setFavorites((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      } else {
        // 좋아요 추가
        await likePost(CURRENT_USER_ID, id);
        setFavorites((prev) => {
          const next = new Set(prev);
          next.add(id);
          return next;
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // 에러 발생 시 롤백하지 않음 (사용자에게 에러 표시만)
    }
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
            <button
              type="button"
              onClick={() => {
                // 전체 페이지 리로드로 초기화
                window.location.href = '/';
              }}
              className="text-[21px] font-semibold tracking-[-0.2px] text-[#0b3aa2]"
            >
              NotiSNU
            </button>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
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
              onClick={() => {
                setSearchQuery('');
                setSelectedSources(new Set());
                setIsSearchMode(false);
                setCurrentPage(1);
                setIsSourceDropdownOpen(false);
                const category = activeCategoryIndex === 0 ? null : activeCategory;
                loadFeed(category, 1);
              }}
              className="rounded-[6px] border border-[#e6e9ef] px-[12px] py-[7px] text-[14px] font-medium text-[#1e232e] transition-colors hover:bg-[#f8f9fb]"
            >
              초기화
            </button>
            <button
              type="button"
              onClick={handleSearch}
              disabled={isLoading}
              className="rounded-[6px] border border-[#0b3aa2] bg-[#0b3aa2] px-[12px] py-[7px] text-[14px] font-medium text-white transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              검색
            </button>
          </div>
        </section>

        <div className="mt-6 flex items-center justify-between text-[14px] text-[#5d6676]">
          <span>
            {isLoading
              ? '검색 결과 불러오는 중...'
              : `검색 결과 ${totalItems}개${
                  totalPages > 1 ? ` (${currentPage}/${totalPages}페이지)` : ''
                }`}
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
            announcements={announcements}
            favorites={favorites} // favorite 들에 하트 표시 해야해서 state로 정의해야.
            onToggleFavorite={(item) => toggleFavorite(item.id)}
            onSelectAnnouncement={(item) => setSelectedPostId(item.id)}
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
        open={Boolean(selectedPostId)}
        onClose={() => setSelectedPostId(null)}
        postId={selectedPostId}
      />
    </div>
  );
}

export default MainPage;
