import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnnouncementList from '../components/AnnouncementList';
import HeartButton from '../components/HeartButton';
import AnnouncementDetailModal from '../components/AnnouncementDetailModal';
import {
  getUser,
  updateUser,
  getUserLikes,
  getNotifications,
  updateNotifications,
} from '../api/users';
import { likePost, unlikePost } from '../api/likes';
import { getRecoLikes } from '../api/feed';
import { CURRENT_USER_ID } from '../config/constants';
import { transformAnnouncement } from '../utils/transformAnnouncement';

function Switch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-[26px] w-[46px] rounded-full transition-colors duration-200 ease-in-out ${
        checked ? 'bg-[#0b3aa2]' : 'bg-[#cfd5df]'
      }`}
      aria-pressed={checked}
    >
      <span
        className="absolute top-[4px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-all duration-200 ease-in-out"
        style={{
          left: checked ? 'calc(100% - 18px - 4px)' : '4px',
        }}
      />
      <span className="sr-only">토글</span>
    </button>
  );
}

// 관심 분야 카테고리 정의, 더미 데이터
const INTEREST_CATEGORIES = {
  커리어: ['채용/인턴', '취업설명회', '창업/스타트업', '자격증'],
  '학술/연구': ['연구/논문', '학술대회', '특강/세미나'],
  교내생활: ['장학금', '근로/RA', '동아리/학생회', '행사/축제'],
  대외활동: ['공모전', '봉사활동', '대외활동'],
  기타: ['국제교류/어학', 'AI/데이터'],
};

function MyPage() {
  const [activeTab, setActiveTab] = useState('activities'); // 'activities' or 'profile'
  const [likedNotices, setLikedNotices] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendEmail, setRecommendEmail] = useState(null); // null로 초기화하여 로딩 완료 전까지 애니메이션 방지
  const [deadlineAlert, setDeadlineAlert] = useState(null);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLikedItems, setTotalLikedItems] = useState(0);
  const [totalLikedPages, setTotalLikedPages] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const pageSize = 20;

  // 프로필 수정 폼 상태
  const [profileForm, setProfileForm] = useState({
    name: '',
    college: '',
    department: '',
    grade: '',
    email: '',
    interests: [],
  });

  // 좋아요 토글 함수 (API 호출)
  const toggleLikedNotice = async (id) => {
    const item = likedNotices.find((item) => item.id === id);
    const isLiked = item?.liked || false;

    try {
      if (isLiked) {
        // 좋아요 취소 - 로컬 상태만 업데이트 (목록에서 제거하지 않음)
        await unlikePost(CURRENT_USER_ID, id);
        setLikedNotices((prev) =>
          prev.map((item) => (item.id === id ? { ...item, liked: false } : item)),
        );
      } else {
        // 좋아요 추가 - 로컬 상태만 업데이트
        await likePost(CURRENT_USER_ID, id);
        setLikedNotices((prev) =>
          prev.map((item) => (item.id === id ? { ...item, liked: true } : item)),
        );
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // 에러 발생 시 롤백하지 않음
    }
  };

  const toggleRecommended = async (id) => {
    const item = recommendations.find((item) => item.id === id);
    const isLiked = item?.liked || false;

    try {
      if (isLiked) {
        // 좋아요 취소
        await unlikePost(CURRENT_USER_ID, id);
        setRecommendations((prev) =>
          prev.map((item) => (item.id === id ? { ...item, liked: false } : item)),
        );
      } else {
        // 좋아요 추가
        await likePost(CURRENT_USER_ID, id);
        setRecommendations((prev) =>
          prev.map((item) => (item.id === id ? { ...item, liked: true } : item)),
        );
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // 에러 발생 시 롤백하지 않음
    }
  };

  // 백엔드 응답을 프론트엔드 형식으로 변환 (좋아요 목록용)
  const transformLikedAnnouncement = (item) => {
    const transformed = transformAnnouncement(item);
    return {
      ...transformed,
      liked: true, // 좋아요 목록이므로 항상 true
    };
  };

  // 좋아요 목록 로드
  const loadLikedNotices = async (page = 1) => {
    setIsLoadingData(true);
    try {
      const data = await getUserLikes(CURRENT_USER_ID, { page, page_size: pageSize });
      const transformedItems = data.items.map(transformLikedAnnouncement);
      setLikedNotices(transformedItems);
      setTotalLikedItems(data.meta.total);
      setTotalLikedPages(data.meta.total_pages);
    } catch (error) {
      console.error('Error loading liked notices:', error);
      setLikedNotices([]);
      setTotalLikedItems(0);
      setTotalLikedPages(0);
    } finally {
      setIsLoadingData(false);
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadLikedNotices(page);
    // 페이지 변경 시 스크롤을 맨 위로
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 탭 변경 시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // 좋아요 목록 초기 로드 및 페이지 변경 시 재로드
  useEffect(() => {
    if (activeTab === 'activities') {
      loadLikedNotices(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // 프로필 조회
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoadingProfile(true);
      setProfileError(null);
      try {
        const userData = await getUser(CURRENT_USER_ID);
        setProfileForm({
          name: userData.name || '',
          college: userData.college || '',
          department: userData.department || '',
          grade: userData.grade || '',
          email: userData.email || '',
          interests: userData.interests || [],
        });
      } catch (error) {
        console.error('Error loading profile:', error);
        setProfileError('프로필을 불러오지 못했습니다.');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  // 알림 설정 조회
  useEffect(() => {
    const loadNotifications = async () => {
      setIsLoadingNotifications(true);
      try {
        const data = await getNotifications(CURRENT_USER_ID);
        setRecommendEmail(data.recommend_email ?? true);
        setDeadlineAlert(data.deadline_alert ?? false);
      } catch (error) {
        console.error('Error loading notifications:', error);
        // 에러 발생 시 기본값 유지
      } finally {
        setIsLoadingNotifications(false);
      }
    };

    loadNotifications();
  }, []);

  // AI 추천 데이터 로드 (백엔드 API)
  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const data = await getRecoLikes({
          user_id: CURRENT_USER_ID,
          limit: 10,
        });

        const transformedItems = data.items.map(transformAnnouncement);

        // 디버깅용: semantic_score 출력
        console.log(
          'AI 추천 semantic scores:',
          data.items.map((item) => ({
            id: item.id,
            title: item.title,
            semantic_score: item.semantic_score,
          })),
        );

        setRecommendations(transformedItems);
      } catch (error) {
        console.error('Error loading recommendations:', error);
        // 에러 발생 시 빈 배열로 설정
        setRecommendations([]);
      }
    };

    loadRecommendations();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[1100px] px-6 pt-9 pb-20">
        <header className="mb-6 flex flex-col gap-3 border-b border-[#e6e9ef] pt-[10px] pb-[14px] sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="text-[21px] font-semibold tracking-[-0.2px] text-[#0b3aa2]">
            NotiSNU
          </Link>
          <div className="flex items-center gap-3 text-[15px] text-[#5d6676]">
            <span>
              <span className="font-semibold text-[#1e232e]">이건무</span> 님 환영합니다
            </span>
            <Link
              to="/"
              className="rounded-[4px] border border-[#d3d8e0] px-[10px] py-[6px] text-[14px] font-medium text-[#1e232e] transition-colors hover:bg-[#f8f9fb]"
            >
              공지 홈으로
            </Link>
          </div>
        </header>

        <h1 className="mb-5 text-[22px] font-semibold text-[#1e232e]">마이페이지</h1>

        {/* 탭 네비게이션 */}
        <div className="mb-6 border-b border-[#e6e9ef]">
          <div className="flex gap-6">
            <button
              type="button"
              onClick={() => setActiveTab('activities')}
              className={`pb-3 text-[15px] font-medium transition-colors ${
                activeTab === 'activities'
                  ? 'border-b-2 border-[#0b3aa2] text-[#0b3aa2]'
                  : 'text-[#5d6676] hover:text-[#1e232e]'
              }`}
            >
              관심 활동
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`pb-3 text-[15px] font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'border-b-2 border-[#0b3aa2] text-[#0b3aa2]'
                  : 'text-[#5d6676] hover:text-[#1e232e]'
              }`}
            >
              프로필 수정
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <main className="flex flex-col gap-4">
            {activeTab === 'activities' ? (
              <section className="overflow-hidden rounded-[6px] border border-[#e6e9ef] bg-white">
                <div className="border-b border-[#e6e9ef] px-4 py-3">
                  <h2 className="text-[16px] font-semibold text-[#1e232e]">
                    ❤️ 이건무 님의 관심 활동
                  </h2>
                </div>
                <AnnouncementList
                  announcements={likedNotices}
                  isFavorite={(item) => item.liked}
                  onToggleFavorite={(item) => toggleLikedNotice(item.id)}
                  onSelectAnnouncement={(item) => setSelectedPostId(item.id)}
                  getSources={(item) => {
                    const sources = item.sources ?? item.source ?? [];
                    // 문자열 배열인 경우 객체 배열로 변환 (호환성 유지)
                    if (sources.length > 0 && typeof sources[0] === 'string') {
                      return sources.map((name) => ({ name, url: null }));
                    }
                    return sources;
                  }}
                  getDeadline={(item) => item.deadline ?? '-'}
                  rowClassName="grid grid-cols-1 gap-4 px-4 py-4 text-[15px] text-[#1e232e] transition-colors hover:bg-[#f8f9fb] sm:grid-cols-[3fr_1fr_1.5fr_1fr_1fr_0.5fr] sm:items-center"
                  listClassName="divide-y divide-[#e6e9ef]"
                  messagePaddingClassName="px-4"
                  emptyMessage="관심 활동이 없습니다."
                  showPagination={totalLikedPages > 1}
                  pagination={{
                    currentPage,
                    totalPages: totalLikedPages,
                    pageSize,
                    total: totalLikedItems,
                    onPageChange: handlePageChange,
                  }}
                />
              </section>
            ) : (
              <section className="overflow-hidden rounded-[6px] border border-[#e6e9ef] bg-white">
                <div className="border-b border-[#e6e9ef] px-4 py-3">
                  <h2 className="text-[16px] font-semibold text-[#1e232e]">프로필 수정</h2>
                </div>
                <div className="px-4 py-6">
                  {isLoadingProfile ? (
                    <div className="py-8 text-center text-[14px] text-[#7a8497]">
                      프로필을 불러오는 중입니다...
                    </div>
                  ) : (
                    <>
                      {profileError && (
                        <div className="mb-4 rounded-[6px] border border-[#c73531] bg-[#fef2f2] px-3 py-2 text-[14px] text-[#c73531]">
                          {profileError}
                        </div>
                      )}
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          setIsSavingProfile(true);
                          setProfileError(null);
                          try {
                            await updateUser(CURRENT_USER_ID, {
                              name: profileForm.name,
                              college: profileForm.college,
                              department: profileForm.department,
                              grade: profileForm.grade,
                              interests: profileForm.interests,
                            });
                            setShowSaveSuccess(true);
                            setTimeout(() => {
                              setShowSaveSuccess(false);
                            }, 3000);
                          } catch (error) {
                            console.error('Error saving profile:', error);
                            setProfileError('프로필 저장에 실패했습니다.');
                          } finally {
                            setIsSavingProfile(false);
                          }
                        }}
                        className="space-y-6"
                      >
                        {/* 이름 */}
                        <div>
                          <label
                            htmlFor="name"
                            className="mb-2 block text-[14px] font-medium text-[#1e232e]"
                          >
                            이름
                          </label>
                          <input
                            type="text"
                            id="name"
                            value={profileForm.name}
                            onChange={(e) =>
                              setProfileForm((prev) => ({ ...prev, name: e.target.value }))
                            }
                            className="w-full rounded-[6px] border border-[#e6e9ef] px-3 py-2 text-[15px] text-[#1e232e] transition-colors outline-none focus:border-[#0b3aa2] focus:ring-1 focus:ring-[#0b3aa2]"
                          />
                        </div>

                        {/* 단과대학 */}
                        <div>
                          <label
                            htmlFor="college"
                            className="mb-2 block text-[14px] font-medium text-[#1e232e]"
                          >
                            단과대학
                          </label>
                          <input
                            type="text"
                            id="college"
                            value={profileForm.college}
                            onChange={(e) =>
                              setProfileForm((prev) => ({ ...prev, college: e.target.value }))
                            }
                            className="w-full rounded-[6px] border border-[#e6e9ef] px-3 py-2 text-[15px] text-[#1e232e] transition-colors outline-none focus:border-[#0b3aa2] focus:ring-1 focus:ring-[#0b3aa2]"
                          />
                        </div>

                        {/* 학과 */}
                        <div>
                          <label
                            htmlFor="department"
                            className="mb-2 block text-[14px] font-medium text-[#1e232e]"
                          >
                            학과
                          </label>
                          <input
                            type="text"
                            id="department"
                            value={profileForm.department}
                            onChange={(e) =>
                              setProfileForm((prev) => ({ ...prev, department: e.target.value }))
                            }
                            className="w-full rounded-[6px] border border-[#e6e9ef] px-3 py-2 text-[15px] text-[#1e232e] transition-colors outline-none focus:border-[#0b3aa2] focus:ring-1 focus:ring-[#0b3aa2]"
                          />
                        </div>

                        {/* 학년 */}
                        <div>
                          <label
                            htmlFor="grade"
                            className="mb-2 block text-[14px] font-medium text-[#1e232e]"
                          >
                            학년
                          </label>
                          <select
                            id="grade"
                            value={profileForm.grade}
                            onChange={(e) =>
                              setProfileForm((prev) => ({ ...prev, grade: e.target.value }))
                            }
                            className="w-full rounded-[6px] border border-[#e6e9ef] px-3 py-2 text-[15px] text-[#1e232e] transition-colors outline-none focus:border-[#0b3aa2] focus:ring-1 focus:ring-[#0b3aa2]"
                          >
                            <option value="1">1학년</option>
                            <option value="2">2학년</option>
                            <option value="3">3학년</option>
                            <option value="4">4학년</option>
                            <option value="5">5학년 이상</option>
                          </select>
                        </div>

                        {/* 스누메일 */}
                        <div>
                          <label
                            htmlFor="email"
                            className="mb-2 block text-[14px] font-medium text-[#1e232e]"
                          >
                            스누메일
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={profileForm.email}
                            onChange={(e) =>
                              setProfileForm((prev) => ({ ...prev, email: e.target.value }))
                            }
                            className="w-full rounded-[6px] border border-[#e6e9ef] bg-[#f8f9fb] px-3 py-2 text-[15px] text-[#5d6676] outline-none"
                            readOnly
                          />
                          <p className="mt-1 text-[12px] text-[#7a8497]">
                            스누메일은 변경할 수 없습니다.
                          </p>
                        </div>

                        {/* 관심 분야 */}
                        <div>
                          <label className="mb-3 block text-[14px] font-medium text-[#1e232e]">
                            관심 분야{' '}
                            <span className="text-[12px] text-[#7a8497]">(중복 선택 가능)</span>
                          </label>
                          <div className="space-y-4">
                            {Object.entries(INTEREST_CATEGORIES).map(([category, items]) => (
                              <div key={category}>
                                <h3 className="mb-2 text-[13px] font-semibold text-[#5d6676]">
                                  {category}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  {items.map((item) => {
                                    const isChecked = profileForm.interests.includes(item);
                                    return (
                                      <label
                                        key={item}
                                        className={`inline-flex cursor-pointer items-center rounded-[6px] border px-3 py-2 text-[13px] font-medium transition-colors ${
                                          isChecked
                                            ? 'border-[#0b3aa2] bg-[#f0f4ff] text-[#0b3aa2]'
                                            : 'border-[#e6e9ef] bg-white text-[#5d6676] hover:border-[#d3d8e0]'
                                        }`}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setProfileForm((prev) => ({
                                                ...prev,
                                                interests: [...prev.interests, item],
                                              }));
                                            } else {
                                              setProfileForm((prev) => ({
                                                ...prev,
                                                interests: prev.interests.filter((i) => i !== item),
                                              }));
                                            }
                                          }}
                                          className="sr-only"
                                        />
                                        <span>{item}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 저장 버튼 */}
                        <div className="flex justify-end pt-4">
                          <button
                            type="submit"
                            disabled={isSavingProfile}
                            className="rounded-[6px] border border-[#0b3aa2] bg-[#0b3aa2] px-6 py-2 text-[14px] font-medium text-white transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isSavingProfile ? '저장 중...' : '저장하기'}
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </section>
            )}
          </main>

          <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
            <section className="rounded-[6px] border border-[#e6e9ef] bg-white">
              <div className="border-b border-[#e6e9ef] px-4 py-3">
                <h2 className="text-[16px] font-semibold text-[#1e232e]">🔔 알림 설정</h2>
              </div>
              <div className="px-4 py-3">
                <div className="border-b border-[#e6e9ef] py-3 last:border-b-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[15px] font-medium text-[#1e232e]">오늘의 추천!</p>
                      <p className="mt-1 text-[13px] text-[#5d6676]">
                        관심 활동과 맞는 새 공지를 메일로 받아요
                      </p>
                    </div>
                    {recommendEmail !== null ? (
                      <Switch
                        checked={recommendEmail}
                        onChange={async (newValue) => {
                          const previousValue = recommendEmail;
                          setRecommendEmail(newValue);
                          try {
                            await updateNotifications(CURRENT_USER_ID, {
                              recommend_email: newValue,
                            });
                          } catch (error) {
                            console.error('Error updating notifications:', error);
                            // 에러 발생 시 롤백
                            setRecommendEmail(previousValue);
                          }
                        }}
                      />
                    ) : (
                      <div className="h-[26px] w-[46px] animate-pulse rounded-full bg-[#cfd5df]" />
                    )}
                  </div>
                </div>
                <div className="border-b border-[#e6e9ef] py-3 last:border-b-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[15px] font-medium text-[#1e232e]">마감 기한 Alert</p>
                      <p className="mt-1 text-[13px] text-[#5d6676]">
                        관심 공지 마감 3일 전, 1일 전 알림
                      </p>
                    </div>
                    {deadlineAlert !== null ? (
                      <Switch
                        checked={deadlineAlert}
                        onChange={async (newValue) => {
                          const previousValue = deadlineAlert;
                          setDeadlineAlert(newValue);
                          try {
                            await updateNotifications(CURRENT_USER_ID, {
                              deadline_alert: newValue,
                            });
                          } catch (error) {
                            console.error('Error updating notifications:', error);
                            // 에러 발생 시 롤백
                            setDeadlineAlert(previousValue);
                          }
                        }}
                      />
                    ) : (
                      <div className="h-[26px] w-[46px] animate-pulse rounded-full bg-[#cfd5df]" />
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[6px] border border-[#e6e9ef] bg-white">
              <div className="border-b border-[#e6e9ef] px-4 py-3">
                <h2 className="text-[16px] font-semibold text-[#1e232e]">
                  ✨ 이건무 님을 위한 AI 추천
                </h2>
              </div>
              <div className="px-4 pt-3">
                <p className="text-[13px] text-[#5d6676]">
                  좋아요를 누른 활동을 분석해 추천해드려요.
                </p>
              </div>
              <div className="flex flex-col gap-3 px-4 py-3">
                {recommendations.map((item) => (
                  <div key={item.id} className="rounded-[6px] border border-[#e6e9ef] bg-white">
                    <div className="gap-2 px-4 py-3">
                      <div className="mb-2 flex flex-wrap gap-[6px] text-[12px]">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-[4px] border border-[#d3d8e0] bg-[#f4f6fc] px-[8px] py-[3px] font-medium text-[#0b3aa2]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-[16px] leading-snug font-semibold text-[#1e232e]">
                        {item.title}
                      </p>
                    </div>
                    <div className="flex items-center justify-between border-t border-[#e6e9ef] px-4 py-2.5 text-[14px] text-[#5d6676]">
                      <span className="font-semibold text-[#c73531]">{item.deadline}</span>
                      <HeartButton
                        active={item.liked}
                        onToggle={() => toggleRecommended(item.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
      <AnnouncementDetailModal
        open={Boolean(selectedPostId)}
        onClose={() => setSelectedPostId(null)}
        postId={selectedPostId}
      />

      {/* 저장 성공 알림 */}
      {showSaveSuccess && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setShowSaveSuccess(false)}
        >
          <div
            className="flex items-center gap-3 rounded-[8px] border border-[#0b3aa2] bg-white px-4 py-3 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 shrink-0 text-[#0b3aa2]">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.236 4.53L8.22 10.22a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                clipRule="evenodd"
                fill="currentColor"
              />
            </svg>
            <p className="text-[14px] font-medium text-[#1e232e]">저장되었습니다.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPage;
