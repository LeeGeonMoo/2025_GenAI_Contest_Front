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
