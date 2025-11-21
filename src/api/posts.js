import apiClient from './client';

/**
 * 포스트 상세 정보 조회
 * @param {string} post_id - 포스트 ID
 * @returns {Promise} API 응답
 */
export const getPost = async (post_id) => {
  const response = await apiClient.get(`/posts/${post_id}`);
  return response.data;
};
