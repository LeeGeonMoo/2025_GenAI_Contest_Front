import { useEffect, useRef, useState } from 'react';
import { getRecoUser, getFeed } from '../api/feed';
import { CURRENT_USER_ID } from '../config/constants';
import { transformAnnouncement } from '../utils/transformAnnouncement';
import HeartButton from './HeartButton';

function TopRecommendations({ onSelectAnnouncement, favorites, onToggleFavorite, className = '' }) {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetchedRef = useRef(false);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const results = [];

      const profileData = await getRecoUser({ user_id: CURRENT_USER_ID, limit: 10 });
      if (profileData.items && profileData.items.length > 0) {
        const randomIndex = Math.floor(Math.random() * Math.min(profileData.items.length, 10));
        results.push({
          ...transformAnnouncement(profileData.items[randomIndex]),
          type: 'profile',
        });
      }

      const randomPage = Math.floor(Math.random() * 5) + 1;
      const randomData = await getFeed({ page: randomPage, page_size: 20 });
      if (randomData.items && randomData.items.length > 0) {
        const randomIndex = Math.floor(Math.random() * randomData.items.length);
        results.push({
          ...transformAnnouncement(randomData.items[randomIndex]),
          type: 'random',
        });
      }

      setRecommendations(results);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchRecommendations();
  }, []);

  const sectionClass = [
    'flex min-h-[255px] flex-col rounded-[14px] border border-[#e6e9ef] bg-white p-4 shadow-sm',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (isLoading) {
    return (
      <section className={sectionClass}>
        <Header />
        <div className="mt-3 grid flex-1 gap-3 md:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </section>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className={sectionClass}>
      <Header onRefresh={fetchRecommendations} />
      <div className="mt-3 grid flex-1 gap-3 md:grid-cols-2">
        {recommendations.map((item) => (
          <RecommendationCard
            key={item.id}
            announcement={item}
            type={item.type}
            onSelect={onSelectAnnouncement}
            isFavorite={favorites?.has(item.id)}
            onToggleFavorite={() => onToggleFavorite(item.id)}
          />
        ))}
      </div>
    </section>
  );
}

function Header({ onRefresh }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="pb-1 pl-1 text-[11px] font-semibold tracking-[0.35em] text-[#7a8497] uppercase">
          AI Spotlight
        </p>
        <h2 className="text-[17px] leading-tight font-bold text-[#1e232e]">
          숨은 기회를 먼저 발견하세요
        </h2>
      </div>
      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#e6e9ef] bg-white px-3.5 py-1.5 text-[12px] font-semibold text-[#5d6676] transition-all hover:border-[#0b3aa2] hover:text-[#0b3aa2]"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          새로고침
        </button>
      )}
    </div>
  );
}

function RecommendationCard({ announcement, type, onSelect, isFavorite, onToggleFavorite }) {
  const isProfile = type === 'profile';

  const gradient = isProfile
    ? 'bg-linear-to-br from-[#f5f7ff] to-white border-[#cadaff]'
    : 'bg-linear-to-br from-[#fff5f8] to-white border-[#ffdcea]';
  const badgeClass = isProfile
    ? 'bg-[#0b3aa2] text-white border-[#0b3aa2]'
    : 'bg-[#c73864] text-white border-[#c73864]';

  return (
    <div
      className={`flex h-full flex-col justify-between rounded-2xl border px-4 py-4 text-left transition-all hover:shadow-md ${gradient}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${badgeClass}`}
        >
          {isProfile ? '맞춤 추천' : '새로운 발견'}
        </span>
        <HeartButton
          active={isFavorite}
          onToggle={(e) => {
            e?.stopPropagation();
            onToggleFavorite();
          }}
          size="sm"
        />
      </div>

      <div className="mt-2 flex-1">
        <p className="text-[11px] text-[#7a8497]">
          {isProfile ? '당신의 프로필 기반 활동' : '관심권 밖에서 건져 올린 의외의 찬스'}
        </p>
        <button
          type="button"
          onClick={() => onSelect(announcement)}
          className="mt-2 flex w-full flex-col text-left"
        >
          {announcement.category && (
            <span className="mb-2 inline-flex w-fit rounded-md border border-white/60 bg-white/70 px-2 py-0.5 text-[10px] font-semibold text-[#526080]">
              {announcement.category}
            </span>
          )}
          <h3 className="mb-2 line-clamp-2 text-[15px] leading-snug font-bold text-[#1e232e]">
            {announcement.title}
          </h3>
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-[#5d6676]">
            {announcement.department && announcement.department !== 'Dummy College' && (
              <span className="flex items-center gap-0.5">
                <svg viewBox="0 0 20 20" className="h-3 w-3 shrink-0" fill="currentColor">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
                <span className="truncate">{announcement.department}</span>
              </span>
            )}
            {announcement.deadline && (
              <span className="flex items-center gap-0.5 font-semibold text-[#c73531]">
                <svg viewBox="0 0 20 20" className="h-3 w-3 shrink-0" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                ~ {announcement.deadline}
              </span>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[#e6e9ef] bg-white p-4">
      <div className="mb-2 h-5 w-20 animate-pulse rounded bg-[#e6e9ef]" />
      <div className="mb-2 h-3 w-full animate-pulse rounded bg-[#e6e9ef]" />
      <div className="mb-1.5 h-4 w-14 animate-pulse rounded bg-[#e6e9ef]" />
      <div className="mb-1 h-4 w-full animate-pulse rounded bg-[#e6e9ef]" />
      <div className="h-3 w-24 animate-pulse rounded bg-[#e6e9ef]" />
    </div>
  );
}

export default TopRecommendations;
