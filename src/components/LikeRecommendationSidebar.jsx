import { useState, useEffect } from 'react';
import { getRecoLikes } from '../api/feed';
import { CURRENT_USER_ID } from '../config/constants';
import { transformAnnouncement } from '../utils/transformAnnouncement';
import HeartButton from './HeartButton';

function LikeRecommendationSidebar({ onSelectAnnouncement, favorites, onToggleFavorite }) {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 좋아요 기반 추천 가져오기 (Top 5 고정)
  const fetchRecommendations = async () => {
    setIsLoading(true);

    try {
      const data = await getRecoLikes({
        user_id: CURRENT_USER_ID,
        limit: 5, // Top 5만
      });

      if (data.items && data.items.length > 0) {
        const transformed = data.items.map(transformAnnouncement);
        console.log(
          '좋아요 기반 추천 로드:',
          transformed.map((t) => ({ id: t.id, title: t.title })),
        );
        setRecommendations(transformed);
      } else {
        setRecommendations([]);
      }
    } catch (error) {
      console.error('Failed to fetch like-based recommendations:', error);
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  if (isLoading) {
    return (
      <aside className="hidden lg:block lg:w-[280px] xl:w-[320px]">
        <div className="sticky top-6">
          <div className="rounded-lg border border-[#c5cedd] bg-white p-4">
            <h2 className="mb-3 text-[14px] font-semibold text-[#1e232e]">
              이런 공지도 좋아하실 것 같아요
            </h2>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </div>
      </aside>
    );
  }

  if (recommendations.length === 0) {
    return (
      <aside className="hidden lg:block lg:w-[280px] xl:w-[320px]">
        <div className="sticky top-6">
          <div className="rounded-lg border border-[#c5cedd] bg-white p-4">
            <h2 className="mb-3 text-[14px] font-semibold text-[#1e232e]">
              이런 공지도 좋아하실 것 같아요
            </h2>
            <div className="py-8 text-center">
              <span className="mb-3 block text-4xl">💡</span>
              <p className="mb-2 text-[12px] text-[#7a8497]">공지에 좋아요를 누르면</p>
              <p className="text-[12px] text-[#7a8497]">비슷한 공지를 추천해드려요</p>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden lg:block lg:w-[280px] xl:w-[320px]">
      <div className="sticky top-6">
        <div className="rounded-lg border border-[#c5cedd] bg-white">
          {/* 헤더 */}
          <div className="border-b border-[#c5cedd] px-4 py-3">
            <h2 className="text-[14px] font-semibold text-[#1e232e]">
              이런 공지도 좋아하실 것 같아요
            </h2>
            <p className="mt-1 text-[11px] text-[#9aa3b2]">좋아요 기반 Top 5 추천</p>
          </div>

          {/* 추천 리스트 */}
          <div className="divide-y divide-[#c5cedd]">
            {recommendations.map((item, index) => (
              <RecommendationCard
                key={item.id}
                rank={index + 1}
                announcement={item}
                onSelect={onSelectAnnouncement}
                isFavorite={favorites?.has(item.id)}
                onToggleFavorite={() => onToggleFavorite(item.id)}
              />
            ))}
          </div>
        </div>

        {/* 힌트 */}
        <p className="mt-3 px-2 text-[11px] text-[#9aa3b2]">🏆 좋아요한 공지 기반 Top 5 추천</p>
      </div>
    </aside>
  );
}

// 개별 추천 카드 - 깔끔한 랭킹 디자인
function RecommendationCard({ rank, announcement, onSelect, isFavorite, onToggleFavorite }) {
  // Top 3는 강조
  const isTop3 = rank <= 3;

  return (
    <div className="group w-full border-l-4 border-transparent p-4 transition-all hover:border-l-[#0b3aa2] hover:bg-[#fafbfc]">
      <div className="flex gap-3">
        {/* 왼쪽: 순위 숫자 */}
        <div className="flex shrink-0 items-start pt-0.5">
          <span
            className={`text-[22px] leading-none ${isTop3 ? 'font-black text-[#0b3aa2]' : 'font-bold text-[#9aa3b2]'}`}
          >
            {rank}
          </span>
        </div>

        {/* 오른쪽: 내용 */}
        <div className="min-w-0 flex-1">
          {/* 상단: 카테고리 + 좋아요 */}
          <div className="mb-1.5 flex items-start justify-between gap-2">
            {announcement.category && (
              <span className="inline-flex rounded-md border border-[#e0e5ef] bg-[#f4f6fc] px-2 py-0.5 text-[10px] font-semibold text-[#526080]">
                {announcement.category}
              </span>
            )}
            <HeartButton
              active={isFavorite}
              onToggle={(e) => {
                console.log('좋아요 클릭!', announcement.id, 'isFavorite:', isFavorite);
                e?.stopPropagation();
                e?.preventDefault();
                onToggleFavorite();
              }}
            />
          </div>

          {/* 제목 - 클릭 가능 */}
          <button
            type="button"
            onClick={() => onSelect(announcement)}
            className="w-full cursor-pointer text-left"
          >
            <h3
              className={`mb-2 line-clamp-2 text-[14px] leading-snug transition-colors group-hover:text-[#0b3aa2] ${isTop3 ? 'font-bold' : 'font-semibold'}`}
            >
              {announcement.title}
            </h3>

            {/* 정보 */}
            <div className="flex flex-wrap gap-x-2.5 gap-y-1 text-[11px] text-[#7a8497]">
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
    </div>
  );
}

// 스켈레톤
function SkeletonCard() {
  return (
    <div className="border-b border-[#c5cedd] p-3 last:border-0">
      <div className="mb-1.5 h-3 w-16 animate-pulse rounded bg-[#e6e9ef]"></div>
      <div className="mb-1 h-3 w-full animate-pulse rounded bg-[#e6e9ef]"></div>
      <div className="h-3 w-20 animate-pulse rounded bg-[#e6e9ef]"></div>
    </div>
  );
}

export default LikeRecommendationSidebar;
