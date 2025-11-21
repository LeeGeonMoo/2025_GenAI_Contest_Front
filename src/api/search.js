import apiClient from './client';

/**
 * 검색 API 호출
 * @param {Object} params - 검색 파라미터
 * @param {string} params.q - 검색어 (required)
 * @param {string} [params.category] - 카테고리 필터
 * @param {string[]} [params.source] - 공지 출처 필터 (다중 선택)
 * @param {string} [params.mode='keyword'] - 검색 모드 ('keyword' | 'semantic')
 * @param {number} [params.page=1] - 페이지 번호
 * @param {number} [params.page_size=20] - 페이지당 항목 수
 * @returns {Promise} API 응답
 */
export const search = async ({
  q = null,
  category = null,
  source = null,
  mode = 'keyword',
  page = 1,
  page_size = 20,
}) => {
  const params = {
    page,
    page_size,
  };

  // q가 있으면 추가
  if (q && q.trim()) {
    params.q = q.trim();
  }

  if (category) {
    params.category = category;
  }

  if (source && source.length > 0) {
    // FastAPI는 배열을 여러 번 반복해서 보내면 자동으로 리스트로 받음
    // 예: ?source=전기정보공학부&source=컴퓨터공학부
    // Axios의 paramsSerializer를 사용하여 배열을 반복되는 쿼리 파라미터로 변환
    params.source = source;
  }

  if (mode) {
    params.mode = mode;
  }

  // 배열 파라미터를 FastAPI가 기대하는 형식으로 변환
  // FastAPI는 ?source=value1&source=value2 형식을 기대하므로
  // paramsSerializer를 사용하여 배열을 반복되는 쿼리 파라미터로 변환
  const response = await apiClient.get('/search', {
    params,
    paramsSerializer: (params) => {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (Array.isArray(value)) {
          // 배열인 경우 각 값을 반복하여 추가
          value.forEach((item) => {
            searchParams.append(key, item);
          });
        } else if (value !== null && value !== undefined) {
          searchParams.append(key, value);
        }
      });
      return searchParams.toString();
    },
  });
  return response.data;
};
