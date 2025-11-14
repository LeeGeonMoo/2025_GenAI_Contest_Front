import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnnouncementList from '../components/AnnouncementList';
import HeartButton from '../components/HeartButton';
import AnnouncementDetailModal from '../components/AnnouncementDetailModal';

function Switch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-[26px] w-[46px] rounded-full transition-colors ${
        checked ? 'bg-[#0b3aa2]' : 'bg-[#cfd5df]'
      }`}
      aria-pressed={checked}
    >
      <span
        className="absolute top-1 h-[18px] w-[18px] rounded-full bg-white transition-transform"
        style={{ transform: checked ? 'translateX(20px)' : 'translateX(4px)' }}
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
  const [recommendEmail, setRecommendEmail] = useState(true);
  const [deadlineAlert, setDeadlineAlert] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const pageSize = 20;

  // 프로필 수정 폼 상태
  const [profileForm, setProfileForm] = useState({
    name: '이건무',
    college: '공과대학',
    department: '컴퓨터공학부',
    grade: '3',
    email: 'moo@snu.ac.kr',
    interests: ['채용/인턴', 'AI/데이터'],
  });

  const toggleLikedNotice = (id) => {
    setLikedNotices((prev) =>
      prev.map((item) => (item.id === id ? { ...item, liked: !item.liked } : item)),
    );
  };

  const toggleRecommended = (id) => {
    setRecommendations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, liked: !item.liked } : item)),
    );
  };

  // 페이지네이션 계산 (관심 활동용)
  const totalLikedItems = likedNotices.length;
  const totalLikedPages = Math.ceil(totalLikedItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedLikedNotices = likedNotices.slice(startIndex, endIndex);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // 페이지 변경 시 스크롤을 맨 위로
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 탭 변경 시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // 더미데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/interested_dummy_data.json');
        if (!response.ok) {
          throw new Error('Failed to fetch interested dummy data');
        }
        const data = await response.json();
        setLikedNotices(data.liked ?? []);
        setRecommendations(data.recommended ?? []);
      } catch (error) {
        console.error('Error loading interested dummy data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
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
                  announcements={paginatedLikedNotices}
                  isFavorite={(item) => item.liked}
                  onToggleFavorite={(item) => toggleLikedNotice(item.id)}
                  onSelectAnnouncement={(item) => setSelectedAnnouncement(item)}
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
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      // TODO: API 호출로 프로필 저장
                      console.log('프로필 저장:', profileForm);
                      setShowSaveSuccess(true);
                      setTimeout(() => {
                        setShowSaveSuccess(false);
                      }, 3000);
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
                        className="rounded-[6px] border border-[#0b3aa2] bg-[#0b3aa2] px-6 py-2 text-[14px] font-medium text-white transition-colors hover:brightness-95"
                      >
                        저장하기
                      </button>
                    </div>
                  </form>
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
                    <Switch checked={recommendEmail} onChange={setRecommendEmail} />
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
                    <Switch checked={deadlineAlert} onChange={setDeadlineAlert} />
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
        open={Boolean(selectedAnnouncement)}
        onClose={() => setSelectedAnnouncement(null)}
        announcement={selectedAnnouncement}
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
