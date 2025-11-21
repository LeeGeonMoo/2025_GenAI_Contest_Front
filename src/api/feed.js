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

/**
 * 좋아요 기반 추천 피드 조회
 * @param {Object} params - 쿼리 파라미터
 * @param {string} params.user_id - 사용자 ID (required)
 * @param {number} [params.limit=10] - 추천 개수
 * @returns {Promise} API 응답
 */
export const getRecoLikes = async ({ user_id, limit = 10 } = {}) => {
  const params = {
    user_id,
    limit,
  };

  const response = await apiClient.get('/feed/reco-likes', { params });
  return response.data;
};

/**
 * 사용자 프로필 기반 추천 피드 조회
 * @param {Object} params - 쿼리 파라미터
 * @param {string} params.user_id - 사용자 ID (required)
 * @param {number} [params.limit=10] - 추천 개수
 * @returns {Promise} API 응답
 */
export const getRecoUser = async ({ user_id, limit = 10 } = {}) => {
  const params = {
    user_id,
    limit,
  };

  const response = await apiClient.get('/feed/reco-user', { params });
  return response.data;
};
