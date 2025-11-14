# 프론트엔드-백엔드 API 연동 가이드

## 📋 현재 상황 분석

### ✅ 백엔드에 이미 구현된 API

| 기능                 | API 엔드포인트                 | 메서드 | 상태    |
| -------------------- | ------------------------------ | ------ | ------- |
| 공지 목록 조회       | `/feed`                        | GET    | ✅ 완료 |
| 공지 상세 조회       | `/posts/{post_id}`             | GET    | ✅ 완료 |
| 검색 (키워드/시맨틱) | `/search?q=...&mode=...`       | GET    | ✅ 완료 |
| 좋아요 추가          | `/likes`                       | POST   | ✅ 완료 |
| 좋아요 삭제          | `/likes/{user_id}/{post_id}`   | DELETE | ✅ 완료 |
| 프로필 기반 추천     | `/feed/reco-user`              | GET    | ✅ 완료 |
| 좋아요 기반 추천     | `/feed/reco-likes?user_id=...` | GET    | ✅ 완료 |
| 리마인더 조회        | `/reminders?user_id=...`       | GET    | ✅ 완료 |
| 리마인더 등록        | `/reminders`                   | POST   | ✅ 완료 |

### ❌ 백엔드에 없는 API (추가 필요)

| 기능               | 필요한 API                                               | 이유                                        |
| ------------------ | -------------------------------------------------------- | ------------------------------------------- |
| 사용자 좋아요 목록 | `GET /likes/{user_id}` 또는 `GET /users/{user_id}/likes` | 마이페이지에서 좋아요한 공지 목록 표시 필요 |
| 카테고리별 필터링  | `/feed?category=...`                                     | 프론트엔드에서 카테고리 탭으로 필터링 중    |

## 🔄 프론트엔드-백엔드 데이터 매핑

### 프론트엔드 더미 데이터 구조

```json
{
  "id": 1,
  "title": "LG 청소년 AI 캠프 멘토 모집",
  "sub": "AI/교육/봉사",
  "category": "대학생활",
  "source": ["전기정보공학부", "컴퓨터공학부"],
  "postedAt": "10.22",
  "deadline": "~ 10.27"
}
```

### 실제 API 응답 구조

**`GET /feed` 응답 예시:**

```json
{
  "items": [
    {
      "id": "507f1f77bcf86cd799439011",  // Beanie Document의 id (MongoDB _id를 문자열로 변환)
      "title": "공지 제목",
      "url": "https://example.com/notice/123",
      "posted_at": "2024-10-22T00:00:00",  // ISO 8601 형식 (datetime)
      "deadline_at": "2024-10-27T00:00:00" | null,  // ISO 8601 형식 또는 null
      "body": "본문 내용...",
      "summary": "요약 내용..." | null,
      "tags": ["태그1", "태그2"],  // 배열 (빈 배열일 수 있음)
      "college": "공과대학" | null,
      "department": "컴퓨터공학부" | null,
      "audience_grade": ["1", "2"],  // 배열 (빈 배열일 수 있음)
      "category": "대학생활" | null,
      "source": "local-dummy-dataset",  // 문자열 (배열 아님!)
      "hash": "abc123def456...",  // 중복 방지용 해시
      "likes": 5,  // 정수
      "created_at": "2024-10-22T00:00:00",  // ISO 8601 형식
      "updated_at": "2024-10-22T00:00:00",  // ISO 8601 형식
      "score": 0.85,  // _score_post()에서 추가됨 (0.0 ~ 1.0)
      "rank_reason": {  // _score_post()에서 추가됨
        "dept_match": 1.0,  // 0.5 또는 1.0
        "grade_match": 0.5,  // 0.5 또는 1.0
        "deadline_boost": 0.8,  // 0.0 ~ 1.0
        "recency_boost": 0.9  // 0.1 ~ 1.0
      }
    }
  ],
  "meta": {
    "total": 100,  // 전체 공지 수
    "page": 1,  // 현재 페이지
    "page_size": 20,  // 페이지당 항목 수
    "scoring_weights": {  // 점수 계산 가중치
      "department": 0.4,
      "grade": 0.2,
      "deadline": 0.2,
      "recency": 0.2
    }
  }
}
```

**실제 코드 확인:**

- `feed_service.py`의 `get_feed()` 메서드가 위 구조를 반환
- `_score_post()` 메서드가 `post.model_dump()`에 `score`와 `rank_reason`을 추가
- Beanie Document의 `model_dump()`는 `id` 필드로 직렬화 (MongoDB `_id` → `id`)

**중요 사항:**

- `id`: Beanie가 MongoDB의 `_id`를 자동으로 `id` (문자열)로 변환
- `posted_at`, `deadline_at`, `created_at`, `updated_at`: ISO 8601 형식의 datetime 문자열
- `source`: **문자열** (프론트엔드는 배열을 기대하지만, 백엔드는 단일 문자열)
- `score`, `rank_reason`: `/feed` API에서만 추가되는 필드 (추천 점수)

**⚠️ Swagger (`/docs`)에서 응답 구조가 안 보이는 이유:**

- 백엔드 API가 `response_model`을 명시하지 않고 `Dict[str, Any]`를 반환하기 때문
- FastAPI는 타입 힌트만으로는 복잡한 중첩 구조를 자동 추론하지 못함
- 실제 응답은 위 구조와 동일하지만, Swagger 문서에는 "Any"로만 표시됨
- 실제 테스트는 `/docs`에서 "Try it out" 버튼으로 확인 가능

### 변환 필요 사항

- `id`: 이미 문자열로 제공됨 (변환 불필요)
- `posted_at` (ISO 8601) → `postedAt` (날짜 포맷: "MM.DD")
- `deadline_at` (ISO 8601 또는 null) → `deadline` (날짜 포맷: "~ MM.DD" 또는 "없음")
- `source` (문자열) → `source` (배열) - 백엔드는 단일 문자열, 프론트는 배열 기대
- `summary` → `sub` (요약을 서브타이틀로 사용 가능)
- `tags` → 추가 정보로 활용 가능
- `score`, `rank_reason`: 프론트엔드에서 사용하지 않으면 제거 가능

## 🛠️ 연동 작업 단계

### 1단계: API 클라이언트 설정

- [ ] 백엔드 API 베이스 URL 설정 (환경 변수)
- [ ] axios 인스턴스 생성 및 인터셉터 설정
- [ ] CORS 설정 확인 (백엔드)

### 2단계: 공지 목록 연동

- [ ] `MainPage.jsx`의 `/dummy_data.json` → `/feed` API로 변경
- [ ] 카테고리 필터링 로직 수정 (백엔드 API에 category 파라미터 추가 또는 프론트에서 필터링)
- [ ] 데이터 변환 함수 작성 (백엔드 응답 → 프론트 형식)

### 3단계: 검색 기능 연동

- [ ] 검색 입력창에 API 호출 연결
- [ ] 검색 모드 선택 (keyword/semantic) UI 추가
- [ ] 검색 결과 표시

### 4단계: 좋아요 기능 연동

- [ ] 좋아요 버튼 클릭 시 API 호출
- [ ] 사용자 ID 관리 (현재는 하드코딩, 추후 인증으로 대체)
- [ ] 좋아요 상태 동기화

### 5단계: 공지 상세 모달 연동

- [ ] `AnnouncementDetailModal`에 `/posts/{post_id}` API 연결
- [ ] 본문 내용 표시

### 6단계: 추천 기능 연동

- [ ] "추천" 탭 클릭 시 `/feed/reco-user` 또는 `/feed/reco-likes` 호출
- [ ] 추천 공지 표시

### 7단계: 마이페이지 연동

- [ ] 좋아요한 공지 목록 API 추가 (백엔드) 또는 User 모델의 `liked_post_ids` 활용
- [ ] 마이페이지에서 좋아요한 공지 목록 표시
- [ ] 리마인더 설정 연동

## 📝 필요한 추가 작업

### 백엔드에 추가 필요

1. **좋아요 목록 API**: `GET /likes/{user_id}` 또는 `GET /users/{user_id}/likes`
   - User 모델의 `liked_post_ids`를 활용하여 Post 목록 반환
2. **카테고리 필터링**: `/feed?category=...` 파라미터 추가
   - 현재는 department, grade만 필터링 가능

### 프론트엔드에 추가 필요

1. **API 클라이언트 유틸리티**: `src/utils/api.js` 또는 `src/services/api.js`
   - axios 인스턴스
   - API 호출 함수들
   - 에러 처리
   - 데이터 변환 함수

2. **환경 변수 설정**: `.env` 파일

   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```

3. **사용자 인증**: 현재는 하드코딩된 user_id 사용
   - 추후 인증 시스템 연동 필요

## 🚀 빠른 시작 가이드

### 백엔드 실행 확인

```bash
cd 2025_GenAI_Contest_Back
docker compose up -d
# http://localhost:8000/docs 에서 Swagger UI 확인
```

### 프론트엔드 연동 시작

1. API 클라이언트 파일 생성
2. 환경 변수 설정
3. MainPage.jsx부터 순차적으로 연동
