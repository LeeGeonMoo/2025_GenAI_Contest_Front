import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnnouncementList from '../components/AnnouncementList';
import HeartButton from '../components/HeartButton';
import AnnouncementDetailModal from '../components/AnnouncementDetailModal';

const initialLiked = [
  {
    id: 'liked-1',
    title: 'NAVER AI/DATA 신입 공채 설명회',
    sub: 'AI/데이터/신입',
    category: '채용',
    sources: [
      {
        name: '경력개발센터',
        url: 'https://career.snu.ac.kr/notice',
      },
    ],
    postedAt: '10.20',
    deadline: '~ 10.31',
    liked: true,
  },
  {
    id: 'liked-2',
    title: '2025-2학기 SNU 멘토링 멘티 모집',
    sub: '멘토링/교육',
    category: '멘토링',
    sources: [
      {
        name: '학부대학',
        url: 'https://uaa.snu.ac.kr/board/notice',
      },
    ],
    postedAt: '10.21',
    deadline: '~ 11.05',
    liked: true,
  },
  {
    id: 'liked-3',
    title: '[서울시] 겨울방학 대학생 아르바이트 모집',
    sub: '관공서/알바/행정',
    category: '인턴',
    sources: [
      {
        name: '대외활동',
        url: 'https://uaa.snu.ac.kr/board/external',
      },
    ],
    postedAt: '10.18',
    deadline: '~ 10.29',
    liked: true,
  },
  {
    id: 'liked-4',
    title: '2025년도 기계제품설계 과제전 안내',
    sub: '설계/과제/연구',
    category: '연구',
    sources: [
      {
        name: '기계공학부',
        url: 'https://me.snu.ac.kr/board/notice',
      },
    ],
    postedAt: '10.19',
    deadline: '~ 12.01',
    liked: true,
  },
  {
    id: 'liked-5',
    title: '[카카오] AI 엔지니어 인턴십 모집',
    sub: '인턴/채용/AI',
    category: '채용',
    sources: [
      {
        name: '경력개발센터',
        url: 'https://career.snu.ac.kr/notice',
      },
    ],
    postedAt: '10.17',
    deadline: '~ 10.28',
    liked: true,
  },
  {
    id: 'liked-6',
    title: '2025년도 봄학기 교환학생 프로그램 모집',
    sub: '국제교류/교환학생',
    category: '대외활동',
    sources: [
      {
        name: '국제협력본부',
        url: 'https://oia.snu.ac.kr/board/exchange',
      },
    ],
    postedAt: '10.16',
    deadline: '~ 11.15',
    liked: true,
  },
  {
    id: 'liked-7',
    title: 'AI 연구실 학부연구생 모집',
    sub: '연구/학부연구생',
    category: '연구',
    sources: [
      {
        name: '컴퓨터공학부',
        url: 'https://cse.snu.ac.kr/community/notice',
      },
    ],
    postedAt: '10.15',
    deadline: '~ 10.30',
    liked: true,
  },
  {
    id: 'liked-8',
    title: '2025년도 국가장학금 신청 안내',
    sub: '장학금/등록금',
    category: '장학',
    sources: [
      {
        name: '학부대학',
        url: 'https://uaa.snu.ac.kr/board/scholarship',
      },
    ],
    postedAt: '10.14',
    deadline: '~ 11.05',
    liked: true,
  },
  {
    id: 'liked-9',
    title: '[삼성전자] 2025 상반기 신입사원 공채',
    sub: '채용/신입/공채',
    category: '채용',
    sources: [
      {
        name: '경력개발센터',
        url: 'https://career.snu.ac.kr/notice',
      },
    ],
    postedAt: '10.13',
    deadline: '~ 11.10',
    liked: true,
  },
  {
    id: 'liked-10',
    title: '2025년도 창업 아이디어 경진대회',
    sub: '창업/경진대회',
    category: '대외활동',
    sources: [
      {
        name: '경력개발센터',
        url: 'https://career.snu.ac.kr/notice',
      },
    ],
    postedAt: '10.12',
    deadline: '~ 11.20',
    liked: true,
  },
  {
    id: 'liked-11',
    title: '겨울방학 해외봉사 프로그램 참가자 모집',
    sub: '봉사/해외/방학',
    category: '대외활동',
    sources: [
      {
        name: '학부대학',
        url: 'https://uaa.snu.ac.kr/board/external',
      },
    ],
    postedAt: '10.11',
    deadline: '~ 10.31',
    liked: true,
  },
  {
    id: 'liked-12',
    title: '2025년도 교내 동아리 신규 가입 모집',
    sub: '동아리/교내활동',
    category: '대학생활',
    sources: [
      {
        name: '학부대학',
        url: 'https://uaa.snu.ac.kr/board/club',
      },
    ],
    postedAt: '10.10',
    deadline: '~ 10.25',
    liked: true,
  },
  {
    id: 'liked-13',
    title: '데이터 사이언스 특강 안내',
    sub: '특강/데이터/학술',
    category: '연구',
    sources: [
      {
        name: '전기정보공학부',
        url: 'https://ee.snu.ac.kr/community/notice',
      },
    ],
    postedAt: '10.09',
    deadline: '없음',
    liked: true,
  },
  {
    id: 'liked-14',
    title: '[네이버] 클라우드 플랫폼 엔지니어 채용',
    sub: '채용/클라우드/경력',
    category: '채용',
    sources: [
      {
        name: '경력개발센터',
        url: 'https://career.snu.ac.kr/notice',
      },
    ],
    postedAt: '10.08',
    deadline: '~ 11.05',
    liked: true,
  },
  {
    id: 'liked-15',
    title: '2025년도 성적우수 장학금 신청',
    sub: '장학금/성적우수',
    category: '장학',
    sources: [
      {
        name: '학부대학',
        url: 'https://uaa.snu.ac.kr/board/scholarship',
      },
    ],
    postedAt: '10.07',
    deadline: '~ 10.20',
    liked: true,
  },
  {
    id: 'liked-16',
    title: 'AI 연구원 RA 모집 공고',
    sub: 'RA/연구/인턴',
    category: '연구',
    sources: [
      {
        name: '컴퓨터공학부',
        url: 'https://cse.snu.ac.kr/community/notice',
      },
    ],
    postedAt: '10.06',
    deadline: '~ 10.25',
    liked: true,
  },
  {
    id: 'liked-17',
    title: '2025년도 봄학기 수강신청 안내',
    sub: '수강신청/학사',
    category: '대학생활',
    sources: [
      {
        name: '학부대학',
        url: 'https://uaa.snu.ac.kr/board/academic',
      },
    ],
    postedAt: '10.05',
    deadline: '~ 10.15',
    liked: true,
  },
  {
    id: 'liked-18',
    title: '[구글] 소프트웨어 엔지니어 신입 채용',
    sub: '채용/신입/구글',
    category: '채용',
    sources: [
      {
        name: '경력개발센터',
        url: 'https://career.snu.ac.kr/notice',
      },
    ],
    postedAt: '10.04',
    deadline: '~ 11.01',
    liked: true,
  },
  {
    id: 'liked-19',
    title: '2025년도 학술대회 논문 발표 모집',
    sub: '학술대회/논문',
    category: '연구',
    sources: [
      {
        name: '전기정보공학부',
        url: 'https://ee.snu.ac.kr/community/notice',
      },
    ],
    postedAt: '10.03',
    deadline: '~ 11.10',
    liked: true,
  },
  {
    id: 'liked-20',
    title: '겨울방학 해외연수 프로그램 안내',
    sub: '해외연수/방학',
    category: '대외활동',
    sources: [
      {
        name: '국제협력본부',
        url: 'https://oia.snu.ac.kr/board/program',
      },
    ],
    postedAt: '10.02',
    deadline: '~ 10.20',
    liked: true,
  },
  {
    id: 'liked-21',
    title: '[마이크로소프트] Azure 인턴십 프로그램',
    sub: '인턴/클라우드/MS',
    category: '채용',
    sources: [
      {
        name: '경력개발센터',
        url: 'https://career.snu.ac.kr/notice',
      },
    ],
    postedAt: '10.01',
    deadline: '~ 10.25',
    liked: true,
  },
  {
    id: 'liked-22',
    title: '2025년도 교내 공모전 작품 접수',
    sub: '공모전/창작',
    category: '대외활동',
    sources: [
      {
        name: '학부대학',
        url: 'https://uaa.snu.ac.kr/board/contest',
      },
    ],
    postedAt: '09.30',
    deadline: '~ 11.15',
    liked: true,
  },
  {
    id: 'liked-23',
    title: '기계공학부 졸업논문 제출 안내',
    sub: '졸업논문/학사',
    category: '연구',
    sources: [
      {
        name: '기계공학부',
        url: 'https://me.snu.ac.kr/board/notice',
      },
    ],
    postedAt: '09.29',
    deadline: '~ 12.10',
    liked: true,
  },
  {
    id: 'liked-24',
    title: '[아마존] AWS 클라우드 엔지니어 채용',
    sub: '채용/AWS/클라우드',
    category: '채용',
    sources: [
      {
        name: '경력개발센터',
        url: 'https://career.snu.ac.kr/notice',
      },
    ],
    postedAt: '09.28',
    deadline: '~ 11.08',
    liked: true,
  },
];

const initialRecommended = [
  {
    id: 'rec-1',
    title: '[서울시] AI 기술인재 육성 프로그램 참여자 모집',
    tags: ['교육', '대외활동'],
    deadline: '~ 11.10',
    liked: false,
  },
  {
    id: 'rec-2',
    title: '[과기부] 2025 데이터 분석 캠프',
    tags: ['채용', '대외활동'],
    deadline: '~ 11.02',
    liked: false,
  },
];

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
  const [likedNotices, setLikedNotices] = useState(initialLiked);
  const [recommendations, setRecommendations] = useState(initialRecommended);
  const [recommendEmail, setRecommendEmail] = useState(true);
  const [deadlineAlert, setDeadlineAlert] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
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
