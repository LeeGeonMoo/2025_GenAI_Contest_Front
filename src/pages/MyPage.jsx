import { useState } from 'react';
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
    sources: ['경력개발센터'],
    postedAt: '10.20',
    deadline: '~ 10.31',
    liked: true,
  },
  {
    id: 'liked-2',
    title: '2025-2학기 SNU 멘토링 멘티 모집',
    sub: '멘토링/교육',
    category: '멘토링',
    sources: ['학부대학'],
    postedAt: '10.21',
    deadline: '~ 11.05',
    liked: true,
  },
  {
    id: 'liked-3',
    title: '[서울시] 겨울방학 대학생 아르바이트 모집',
    sub: '관공서/알바/행정',
    category: '인턴',
    sources: ['대외활동'],
    postedAt: '10.18',
    deadline: '~ 10.29',
    liked: true,
  },
  {
    id: 'liked-4',
    title: '2025년도 기계제품설계 과제전 안내',
    sub: '설계/과제/연구',
    category: '연구',
    sources: ['기계공학부'],
    postedAt: '10.19',
    deadline: '~ 12.01',
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

function MyPage() {
  const [likedNotices, setLikedNotices] = useState(initialLiked);
  const [recommendations, setRecommendations] = useState(initialRecommended);
  const [recommendEmail, setRecommendEmail] = useState(true);
  const [deadlineAlert, setDeadlineAlert] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <main className="flex flex-col gap-4">
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
                onSelectAnnouncement={(item) => setSelectedAnnouncement(item)}
                getSources={(item) => item.sources ?? []}
                getDeadline={(item) => item.deadline ?? '-'}
                rowClassName="grid grid-cols-1 gap-4 px-4 py-4 text-[15px] text-[#1e232e] transition-colors hover:bg-[#f8f9fb] sm:grid-cols-[3fr_1fr_1.5fr_1fr_1fr_0.5fr] sm:items-center"
                listClassName="divide-y divide-[#e6e9ef]"
                messagePaddingClassName="px-4"
                emptyMessage="관심 활동이 없습니다."
              />
            </section>
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
                        관심 활동과 맞는 새 공지를 메일로 받아요.
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
    </div>
  );
}

export default MyPage;
