import apiClient from './client';

// api를 전부 기능별로 나눠놓았다.

/**
 * 사용자 프로필 조회
 * @param {string} user_id - 사용자 ID
 * @returns {Promise} API 응답
 */
export const getUser = async (user_id) => {
  const response = await apiClient.get(`/users/${user_id}`);
  return response.data;
};

/**
 * 사용자 프로필 수정
 * @param {string} user_id - 사용자 ID
 * @param {Object} data - 수정할 데이터
 * @param {string} data.name - 이름
 * @param {string} data.college - 단과대학
 * @param {string} data.department - 학과
 * @param {string} data.grade - 학년
 * @param {string[]} data.interests - 관심 분야 배열
 * @returns {Promise} API 응답
 */
export const updateUser = async (user_id, data) => {
  const response = await apiClient.put(`/users/${user_id}`, data);
  return response.data;
};

/**
 * 사용자 좋아요 목록 조회
 * @param {string} user_id - 사용자 ID
 * @param {Object} params - 쿼리 파라미터
 * @param {number} [params.page=1] - 페이지 번호
 * @param {number} [params.page_size=20] - 페이지당 항목 수
 * @returns {Promise} API 응답
 */
export const getUserLikes = async (user_id, { page = 1, page_size = 20 } = {}) => {
  const response = await apiClient.get(`/users/${user_id}/likes`, {
    params: { page, page_size },
  });
  return response.data;
};

/**
 * 사용자 알림 설정 조회
 * @param {string} user_id - 사용자 ID
 * @returns {Promise} API 응답
 */
export const getNotifications = async (user_id) => {
  const response = await apiClient.get(`/users/${user_id}/notifications`);
  return response.data;
};

/**
 * 사용자 알림 설정 업데이트
 * @param {string} user_id - 사용자 ID
 * @param {Object} data - 알림 설정 데이터
 * @param {boolean} [data.recommend_email] - "오늘의 추천!" 알림 설정
 * @param {boolean} [data.deadline_alert] - "마감 기한 Alert" 알림 설정
 * @returns {Promise} API 응답
 */
export const updateNotifications = async (user_id, data) => {
  const response = await apiClient.put(`/users/${user_id}/notifications`, data);
  return response.data;
};
