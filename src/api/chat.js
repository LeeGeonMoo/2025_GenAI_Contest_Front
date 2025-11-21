import apiClient from './client';

/**
 * 챗봇 API 호출
 * @param {Object} params - 챗봇 파라미터
 * @param {string} params.question - 질문 (required)
 * @param {string} [params.user_id] - 사용자 ID
 * @param {string} [params.department] - 학과
 * @param {string} [params.grade] - 학년
 * @returns {Promise} API 응답
 */
export const sendChatMessage = async ({
  question,
  user_id = null,
  department = null,
  grade = null,
}) => {
  const response = await apiClient.post('/chat', {
    question,
    user_id,
    department,
    grade,
  });
  return response.data;
};
