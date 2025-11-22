import axios from 'axios';

// 환경 변수에서 API URL을 가져오거나, 없으면 상대 경로 '/api' 사용 (Nginx 프록시용)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
