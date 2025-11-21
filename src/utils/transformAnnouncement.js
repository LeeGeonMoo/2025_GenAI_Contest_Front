/**
 * 백엔드 API 응답을 프론트엔드 형식으로 변환
 * @param {Object} item - 백엔드에서 받은 공지 항목
 * @returns {Object} - 프론트엔드에서 사용할 형식으로 변환된 항목
 */
export const transformAnnouncement = (item) => {
  // posted_at 형식 변환: ISO 8601 → "MM.DD"
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${month}.${day}`;
    } catch {
      return dateStr;
    }
  };

  // deadline 형식 변환: ISO 8601 → "~ MM.DD"
  const formatDeadline = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `~ ${month}.${day}`;
    } catch {
      return dateStr;
    }
  };

  // tags를 sub로 변환 (슬래시로 구분된 문자열)
  const sub = item.tags && item.tags.length > 0 ? item.tags.join('/') : null;

  return {
    ...item,
    postedAt: formatDate(item.posted_at),
    deadline: formatDeadline(item.deadline),
    sub, // tags를 sub로 변환
  };
};
