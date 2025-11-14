import apiClient from './client';

/**
 * 피드 조회
 * @param {Object} params - 쿼리 파라미터
 * @param {string} [params.category] - 카테고리 필터
 * @param {number} [params.page=1] - 페이지 번호
 * @param {number} [params.page_size=20] - 페이지당 항목 수
 * @returns {Promise} API 응답
 */
export const getFeed = async ({ category = null, page = 1, page_size = 20 } = {}) => {
  const params = {};
  if (category) {
    params.category = category;
  }
  params.page = page;
  params.page_size = page_size;

  const response = await apiClient.get('/feed', { params });
  return response.data;
};
