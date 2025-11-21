import apiClient from './client';

/**
 * 포스트에 좋아요 추가
 * @param {string} user_id - 사용자 ID
 * @param {string} post_id - 포스트 ID
 * @returns {Promise} API 응답
 */
export const likePost = async (user_id, post_id) => {
  const response = await apiClient.post('/likes', {
    user_id,
    post_id,
  });
  return response.data;
};

/**
 * 포스트의 좋아요 취소
 * @param {string} user_id - 사용자 ID
 * @param {string} post_id - 포스트 ID
 * @returns {Promise} API 응답
 */
export const unlikePost = async (user_id, post_id) => {
  const response = await apiClient.delete(`/likes/${user_id}/${post_id}`);
  return response.data;
};
