# 프론트엔드 API 명세서

## 개요

이 문서는 프론트엔드에서 필요한 모든 API 엔드포인트와 데이터 구조를 정의합니다.

## 기본 정보

- **Base URL**: `http://localhost:8000` (개발 환경)
- **API Prefix**: /api (`api/feed`, `api/posts` 등으로 접근)
- **Content-Type**: `application/json`

## 인증 및 사용자 정보

**현재 상태:**

- 백엔드에 인증 시스템이 아직 구현되지 않았습니다.
- 현재는 `user_id`를 query parameter나 request body로 직접 전달하는 방식입니다.

**향후 계획:**

- SNU OAuth + JWT 기반 인증 시스템 구현 예정
- 인증이 구현되면, Authorization 헤더에 JWT 토큰을 포함하여 요청하고, 백엔드에서 토큰을 검증하여 사용자 정보를 자동으로 추출합니다.
- `/feed/reco-user` 같은 사용자별 API는 인증된 사용자 정보를 백엔드에서 자동으로 조회하도록 변경될 예정입니다.

---

## 1. 피드 조회

### GET /feed

공지사항 피드를 조회합니다. **검색 기능과는 별개의 API입니다.**

**사용 시나리오:**

- 페이지 로드 시 기본 피드 조회
- 카테고리 탭 선택 시 해당 카테고리 필터링
- 검색 기능과는 **독립적으로** 동작

**Query Parameters:**

- `category` (optional, string): 카테고리 필터 (예: "채용", "연구", "멘토링") - **백엔드에서 필터링 기능까지 들어가야함**
- `page` (optional, number, default: 1, min: 1): 페이지 번호 (1부터 시작)
- `page_size` (optional, number, default: 20, min: 1, max: 100): 페이지당 항목 수

**참고:**

- `department`, `grade` 파라미터는 일반 피드 조회에서는 사용하지 않습니다. 백앤드에서 제외 필요.
- **페이지네이션은 백엔드에서 처리됩니다.** 프론트엔드는 `page`와 `page_size`만 전달하면 됩니다.
  - 예: `GET /feed?page=1&page_size=20` → 1페이지, 20개 항목
  - 예: `GET /feed?page=2&page_size=20` → 2페이지, 20개 항목 (21~40번째 항목)

**Response:**

```json
{
  "items": [
    {
      "id": "string",
      "title": "string",
      "tags": ["string"],
      "category": "string",
      "source": [
        {
          "name": "string",
          "url": "string | null"
        }
      ],
      "posted_at": "2024-01-01T00:00:00Z",
      "deadline": "2024-01-31T00:00:00Z | null"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "page_size": 20,
    "total_pages": 5
  }
}
```

**참고:**

- `rank_reason`과 `scoring_weights`는 일반 피드 조회에는 필요 없습니다.
- 백엔드에서 반환할 수 있지만, 프론트엔드에서는 사용하지 않습니다.

**페이지네이션 동작:**

- 백엔드에서 `offset = (page - 1) * page_size`로 계산하여 해당 페이지의 데이터만 반환합니다.
- `total` 필드로 전체 항목 수를 알 수 있으며, 프론트엔드에서 `Math.ceil(total / page_size)`로 총 페이지 수를 계산할 수 있습니다.

**사용 위치:**

- `MainPage.jsx`: 메인 피드 조회
- 카테고리별 필터링

---

## 2. 추천 피드

### GET /feed/reco-user

사용자 프로필 기반 추천 피드를 조회합니다.

**Query Parameters:**

- user_id (default는 1로. 어차피 프로토타입에서는 프로필 딱 1개만 만들어놓고, 정보만 수정해가면서 보여줄것.)
- `limit` (optional, number, default: 10): 추천 개수

**참고:**

- **구현 보류**: 현재는 구현 보류 상태입니다.
- **인증 방식**: 인증 시스템이 구현되면, Authorization 헤더의 JWT 토큰에서 사용자 정보를 자동으로 추출합니다. 따라서 `user_id`를 query parameter로 보낼 필요가 없습니다.
- `department`, `grade` 같은 파라미터는 필요 없습니다.
- 사용자의 `preference` (관심 분야 등)를 백엔드에서 조회하여 LLM에 전달하는 방식으로 구현 예정입니다.
- 현재는 인증이 없으므로 임시로 `user_id`를 query parameter로 받을 수 있지만, 인증 구현 후에는 제거될 예정입니다.

**Response:**

```json
{
  "items": [
    {
      "id": "string",
      "title": "string",
      "tags": ["string"],
      "category": "string",
      "source": [
        {
          "name": "string",
          "url": "string | null"
        }
      ],
      "posted_at": "2024-01-01T00:00:00Z",
      "deadline": "2024-01-31T00:00:00Z | null"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "page_size": 20,
    "total_pages": 5
  }
}
```

**사용 위치:**

- `MainPage.jsx`: "추천" 탭 (구현 보류)

---

## 3. 좋아요 기반 추천

### GET /feed/reco-likes

사용자의 좋아요 기반 추천 피드를 조회합니다.

**Query Parameters:**

- `user_id` (required, string): 사용자 ID
- `limit` (optional, number, default: 10): 추천 개수

**Response:**

```json
{
  "items": [
    {
      "id": "string",
      "title": "string",
      "tags": ["string"],
      "category": "string",
      "source": [
        {
          "name": "string",
          "url": "string | null"
        }
      ],
      "posted_at": "2024-01-01T00:00:00Z",
      "deadline": "2024-01-31T00:00:00Z | null"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "page_size": 20,
    "total_pages": 5
  }
}
```

**참고:**

- 응답 구조는 일반 피드와 동일합니다.
- 백엔드에서 알고리즘 잘 돌려서, 좋아요 태그 달린 것들 기반으로 추천 순위대로 공지 리스트 보내기기

**사용 위치:**

- `MyPage.jsx`: "✨ 이건무 님을 위한 AI 추천" 섹션

---

## 4. 검색

### GET /search

키워드/의미 기반 검색을 수행합니다. **피드 조회(`GET /feed`)와는 별개의 API입니다.**

**중요:**

- 검색 버튼을 클릭했을 때만 이 API를 호출합니다.
- 일반 피드 조회(`GET /feed`)와 동시에 호출되지 않습니다.
- 검색 결과는 `GET /feed` 결과를 덮어씁니다.
- **카테고리 필터링**: 현재 선택된 카테고리가 있으면 `category` 파라미터를 포함하여 해당 카테고리 안에서만 검색합니다.
  - 예: "채용" 카테고리 선택 상태에서 "인턴" 검색 → `GET /search?q=인턴&category=채용`
  - 예: 카테고리 없이 "인턴" 검색 → `GET /search?q=인턴` (전체 검색)
- **공지 출처 필터링**: 선택된 출처가 있으면 `source` 파라미터를 포함하여 해당 출처의 공지만 검색합니다.
  - 예: "전기정보공학부", "컴퓨터공학부" 선택 후 "인턴" 검색 → `GET /search?q=인턴&source=전기정보공학부&source=컴퓨터공학부`
  - 예: 출처 없이 "인턴" 검색 → `GET /search?q=인턴` (전체 검색)

**Query Parameters:**

- `q` (required, string): 검색어
- `category` (optional, string): 카테고리 필터 (예: "채용", "연구", "멘토링") - **특정 카테고리 안에서 검색**
- `source` (optional, array of strings): 공지 출처 필터 (예: `["전기정보공학부", "컴퓨터공학부"]`) - **여러 출처 선택 가능**
- `mode` (optional, string, default: "keyword"): 검색 모드 ("keyword" | "semantic")
- `page` (optional, number, default: 1, min: 1): 페이지 번호
- `page_size` (optional, number, default: 20, min: 1, max: 50): 페이지당 항목 수

**참고:**

- `category` 파라미터는 백엔드에 아직 구현되지 않았습니다. 구현이 필요합니다.
- `source` 파라미터는 백엔드에 아직 구현되지 않았습니다. 구현이 필요합니다.
  - 여러 출처를 선택할 수 있으므로 배열로 전달합니다.
  - 예: `GET /search?q=인턴&source=전기정보공학부&source=컴퓨터공학부` 또는 `GET /search?q=인턴&source[]=전기정보공학부&source[]=컴퓨터공학부`
- 페이지네이션은 백엔드에서 처리됩니다.

**사용 예시:**

- 전체 검색: `GET /search?q=인턴`
- 카테고리 필터링 검색: `GET /search?q=인턴&category=채용` (채용 카테고리 안에서 "인턴" 검색)
- 공지 출처 필터링 검색: `GET /search?q=인턴&source=전기정보공학부&source=컴퓨터공학부` (선택한 출처에서 "인턴" 검색)
- 복합 필터링 검색: `GET /search?q=인턴&category=채용&source=경력개발센터` (채용 카테고리 + 경력개발센터 출처에서 "인턴" 검색)

**Response:**

````json
{
  "items": [
    {
      "id": "string",
      "title": "string",
      "tags": ["string"],
      "category": "string",
      "source": [
        {
          "name": "string",
          "url": "string | null"
        }
      ],
      "posted_at": "2024-01-01T00:00:00Z",
      "deadline": "2024-01-31T00:00:00Z | null"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "page_size": 20,
    "total_pages": 5
  }
}

**사용 위치:**

- `MainPage.jsx`: 검색 기능
- 이것도 알아서 백에서 정확도 순으로 정렬해서 리스트 보내줘야함. 프론트는 sementic score 같은거 알 필요 없음음

---

## 5. 개별 포스트 조회

### GET /posts/{post_id}

특정 포스트의 상세 정보를 조회합니다.

**Path Parameters:**

- `post_id` (required, string): 포스트 ID (다른 전체 공지 호출 API 응답의 `id` 필드와 동일한 값)

**Response:**

```json
{
  "id": "string",
  "title": "string",
  "tags": ["string"],
  "category": "string",
  "source": "string",
  "posted_at": "2024-01-01T00:00:00Z",
  "deadline": "2024-01-31T00:00:00Z | null",
  "content": "string | null",
  "url": "string | null"
}
````

**사용 위치:**

- `AnnouncementDetailModal.jsx`: 모달 상세 정보

---

## 6. 좋아요

### POST /likes

포스트에 좋아요를 추가합니다.

**Request Body:**

```json
{
  "user_id": "string",
  "post_id": "string"
}
```

**참고:**

- `post_id`는 다른 API 응답의 `id` 필드와 동일한 값입니다.

**Response:**

```json
{
  "user_id": "string",
  "post_id": "string",
  "liked_at": "2024-01-01T00:00:00Z"
}
```

**사용 위치:**

- `MainPage.jsx`: 좋아요 토글
- `MyPage.jsx`: 좋아요 토글

---

## 7. 좋아요 취소

### DELETE /likes/{user_id}/{post_id}

포스트의 좋아요를 취소합니다.

**Path Parameters:**

- `user_id` (required, string): 사용자 ID
- `post_id` (required, string): 포스트 ID (다른 API 응답의 `id` 필드와 동일한 값)

**Response:**

```json
{
  "message": "Like removed"
}
```

**사용 위치:**

- `MainPage.jsx`: 좋아요 토글
- `MyPage.jsx`: 좋아요 토글

---

## 8. 사용자 좋아요 목록 조회

### GET /likes/{user_id}

사용자가 좋아요한 포스트 목록을 조회합니다.

**Path Parameters:**

- `user_id` (required, string): 사용자 ID
- 백엔드 로직에서 전부.. 사용자 id 받고, 해당하는 좋아요 목록들 가져오는 로직을 짜야한다.

**Query Parameters:**

- `page` (optional, number, default: 1, min: 1): 페이지 번호
- `page_size` (optional, number, default: 20, min: 1, max: 100): 페이지당 항목 수

**Response:**

```json
{
  "items": [
    {
      "id": "string",
      "title": "string",
      "tags": ["string"],
      "category": "string",
      "source": [
        {
          "name": "string",
          "url": "string | null"
        }
      ],
      "posted_at": "2024-01-01T00:00:00Z",
      "deadline": "2024-01-31T00:00:00Z | null"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "page_size": 20,
    "total_pages": 5
  }
}
```

**참고:**

- 페이지네이션은 백엔드에서 처리됩니다.
- `source`는 문자열로 반환되며, 프론트엔드에서 객체 배열로 변환해야 합니다.

**사용 위치:**

- `MyPage.jsx`: "❤️ 이건무 님의 관심 활동" 섹션

**참고:** 이 API는 백엔드에 아직 구현되지 않았습니다. 구현이 필요합니다.

---

## 9. 사용자 정보 조회

### GET /users/{user_id}

사용자 프로필 정보를 조회합니다.

**Path Parameters:**

- `user_id` (required, string): 사용자 ID

**Response:**

```json
{
  "id": "string",
  "email": "string",
  "name": "string | null",
  "college": "string | null",
  "department": "string | null",
  "grade": "string | null",
  "interests": ["string"]
}
```

**참고:**

- `interests`는 중복 선택 가능한 관심분야 배열입니다.
- 관심분야 예시: `["채용/인턴", "AI/데이터", "연구/논문", "공모전"]` 등
- 프론트엔드에서 정의된 카테고리: 커리어, 학술/연구, 교내생활, 대외활동, 기타

**사용 위치:**

- `MyPage.jsx`: 프로필 수정 폼 초기값

**구현 필요:**

- 이 API는 백엔드에 아직 구현되지 않았습니다. 구현이 필요합니다.
- 현재 User 모델에는 `name` 필드가 없습니다. 백엔드에 추가해야 합니다.

---

## 10. 사용자 프로필 수정

### PUT /users/{user_id}

사용자 프로필을 수정합니다.

**Path Parameters:**

- `user_id` (required, string): 사용자 ID

**Request Body:**

```json
{
  "name": "string",
  "college": "string",
  "department": "string",
  "grade": "string",
  "interests": ["string"]
}
```

**참고:**

- `interests`는 중복 선택 가능한 관심분야 배열입니다. 빈 배열 `[]`도 가능합니다.
- 관심분야 예시: `["채용/인턴", "AI/데이터", "연구/논문", "공모전"]` 등
- `name` 필드는 현재 User 모델에 없습니다. 필요시 백엔드에 추가해야 합니다.
- `email`은 변경할 수 없습니다.

**Response:**

```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "college": "string",
  "department": "string",
  "grade": "string",
  "interests": ["string"],
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**사용 위치:**

- `MyPage.jsx`: 프로필 수정 폼 저장

**참고:** 이 API는 백엔드에 아직 구현되지 않았습니다. 구현이 필요합니다.

---

## 11. 알림 설정

### GET /users/{user_id}/notifications

사용자의 알림 설정을 조회합니다.

**Path Parameters:**

- `user_id` (required, string): 사용자 ID

**Response:**

```json
{
  "recommend_email": true,
  "deadline_alert": false
}
```

**필드 설명:**

- `recommend_email`: "오늘의 추천!" 알림 설정 (관심 활동과 맞는 새 공지를 메일로 받는 알림)
- `deadline_alert`: "마감 기한 Alert" 알림 설정 (관심 공지 마감 3일 전, 1일 전 알림)

**사용 위치:**

- `MyPage.jsx`: 알림 설정 섹션 초기값

**참고:** 이 API는 백엔드에 아직 구현되지 않았습니다. 구현이 필요합니다.

---

### PUT /users/{user_id}/notifications

사용자의 알림 설정을 업데이트합니다.

**Path Parameters:**

- `user_id` (required, string): 사용자 ID

**Request Body:**

```json
{
  "recommend_email": true,
  "deadline_alert": false
}
```

**Response:**

```json
{
  "recommend_email": true,
  "deadline_alert": false,
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**사용 위치:**

- `MyPage.jsx`: 알림 설정 토글 변경 시

**참고:** 이 API는 백엔드에 아직 구현되지 않았습니다. 구현이 필요합니다.

---

## 12. 챗봇

### POST /chat

챗봇에 질문을 보냅니다.

**Request Body:**

```json
{
  "question": "string",
  "user_id": "string | null"
}
```

**Response:**

```json
{
  "answer": "string",
  "citations": ["string"],
  "notices": [
    {
      "post_id": "string",
      "title": "string",
      "summary": "string | null",
      "body_snippet": "string",
      "department": "string | null",
      "audience_grade": ["string"],
      "category": "string | null",
      "source": "string | null",
      "posted_at": "2024-01-01T00:00:00Z",
      "deadline_at": "2024-01-31T00:00:00Z | null",
      "score": 0.95,
      "signals": {}
    }
  ],
  "meta": {
    "question": "string",
    "refused": false,
    "reason": "string",
    "source": "string | null",
    "user_id": "string | null"
  }
}
```

**참고:**

- `citations`: 답변에 인용된 포스트 ID 배열
- `notices`: 검색된 컨텍스트 포스트 목록
- `meta.refused`: 답변이 거부되었는지 여부
- `meta.reason`: 거부 사유 (예: "empty_question", "no_context", "out_of_scope", "inappropriate" 등)

**사용 위치:**

- `ChatWidget.jsx`: 챗봇 메시지 전송

---

## 데이터 변환 요구사항

### 1. 날짜 형식 변환

백엔드에서 받은 ISO 8601 형식 (`2024-01-01T00:00:00Z`)을 프론트엔드 표시 형식 (`10.20`)으로 변환해야 합니다.

### 2. Source 필드 형식

프론트엔드에서는 `source`를 객체 배열로 사용합니다:

```json
"source": [
  {
    "name": "전기정보공학부",
    "url": "https://ee.snu.ac.kr/community/notice"
  }
]
```

**참고:**

- 백엔드에서 `source`를 문자열로 반환하는 경우, 프론트엔드에서 객체 배열로 변환해야 합니다.
- `url`은 선택적이며, 없을 경우 `null`로 설정합니다.

### 3. 카테고리 필터링

**백엔드에서 필터링하는 것을 권장합니다.** Post 모델에 `category` 필드가 이미 존재하므로, 백엔드 API에 `category` 파라미터를 추가하여 DB 쿼리 레벨에서 필터링하는 것이 효율적입니다.

**구현 필요:**

- 백엔드 `GET /feed`에 `category` 파라미터 추가
- 프론트엔드는 카테고리 선택 시 해당 파라미터로 API 호출

---

## 필요한 백엔드 API 구현

다음 API들은 백엔드에 아직 구현되지 않았으므로 구현이 필요합니다:

1. **GET /likes/{user_id}** - 사용자의 좋아요한 포스트 목록 조회
2. **GET /users/{user_id}** - 사용자 정보 조회
3. **PUT /users/{user_id}** - 사용자 프로필 수정
4. **GET /users/{user_id}/notifications** - 사용자 알림 설정 조회
5. **PUT /users/{user_id}/notifications** - 사용자 알림 설정 업데이트
6. **GET /feed**에 `category` 파라미터 추가 - **권장: DB 쿼리 레벨에서 필터링**
7. **GET /search**에 `category` 파라미터 추가 - **카테고리 안에서 검색 기능을 위해 필요**
8. **GET /search**에 `source` 파라미터 추가 - **공지 출처 필터링 기능을 위해 필요 (배열로 여러 출처 선택 가능)**
9. **GET /feed/reco-user** - 사용자 프로필 기반 추천 (구현 보류, `user_id`만 필요, 나머지는 백엔드에서 사용자 정보 조회하여 처리)

---

## 프론트엔드 구현 가이드

### 검색 vs 피드 조회 구분

**중요:** 검색과 피드 조회는 **상호 배타적**입니다.

**구현 예시:**

```javascript
// MainPage.jsx
const [mode, setMode] = useState('feed'); // 'feed' | 'search'
const [searchQuery, setSearchQuery] = useState('');
const [announcements, setAnnouncements] = useState([]);

// 피드 조회 (카테고리 선택 시)
const loadFeed = async (category) => {
  setMode('feed');
  const response = await fetch(`/feed?category=${category}&page=1&page_size=20`);
  const data = await response.json();
  setAnnouncements(data.items);
};

// 검색 (검색 버튼 클릭 시)
const handleSearch = async (query, category = null) => {
  if (!query.trim()) {
    // 검색어가 없으면 피드로 돌아가기
    setMode('feed');
    loadFeed(activeCategory);
    return;
  }

  setMode('search');
  // 카테고리가 선택되어 있으면 카테고리 필터도 포함
  const categoryParam = category ? `&category=${encodeURIComponent(category)}` : '';
  const response = await fetch(
    `/search?q=${encodeURIComponent(query)}${categoryParam}&page=1&page_size=20`,
  );
  const data = await response.json();
  setAnnouncements(data.items);
};

// 초기화 버튼 클릭 시
const handleReset = () => {
  setSearchQuery('');
  setMode('feed');
  loadFeed(activeCategory);
};
```

**상태 관리:**

- `mode` 상태로 현재 'feed' 모드인지 'search' 모드인지 구분
- 검색 모드일 때는 `GET /search`만 호출
- 피드 모드일 때는 `GET /feed`만 호출
- 두 API를 동시에 호출하지 않음

### 페이지네이션 구현

**중요:** 검색과 피드 모두 페이지네이션을 지원하므로, 프론트엔드에서 페이지네이션 UI를 구현해야 합니다.

**필요한 상태:**

```javascript
const [currentPage, setCurrentPage] = useState(1);
const [pageSize] = useState(20);
const [totalItems, setTotalItems] = useState(0);
const totalPages = Math.ceil(totalItems / pageSize);
```

**페이지네이션 UI 예시:**

```jsx
// 페이지네이션 컴포넌트
{
  totalPages > 1 && (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded border px-3 py-2 disabled:opacity-50"
      >
        이전
      </button>

      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1;
        // 현재 페이지 주변 5개만 표시
        if (
          page === 1 ||
          page === totalPages ||
          (page >= currentPage - 2 && page <= currentPage + 2)
        ) {
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`rounded border px-3 py-2 ${
                currentPage === page ? 'bg-blue-500 text-white' : ''
              }`}
            >
              {page}
            </button>
          );
        } else if (page === currentPage - 3 || page === currentPage + 3) {
          return <span key={page}>...</span>;
        }
        return null;
      })}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded border px-3 py-2 disabled:opacity-50"
      >
        다음
      </button>
    </div>
  );
}
```

**페이지 변경 핸들러:**

```javascript
const handlePageChange = async (page) => {
  setCurrentPage(page);

  if (mode === 'search') {
    // 검색 모드
    const categoryParam = activeCategory ? `&category=${encodeURIComponent(activeCategory)}` : '';
    const response = await fetch(
      `/api/search?q=${encodeURIComponent(searchQuery)}${categoryParam}&page=${page}&page_size=${pageSize}`,
    );
    const data = await response.json();
    setAnnouncements(data.items);
    setTotalItems(data.meta.total);
  } else {
    // 피드 모드
    const categoryParam = activeCategory ? `&category=${encodeURIComponent(activeCategory)}` : '';
    const response = await fetch(`/api/feed?${categoryParam}&page=${page}&page_size=${pageSize}`);
    const data = await response.json();
    setAnnouncements(data.items);
    setTotalItems(data.meta.total);
  }

  // 페이지 상단으로 스크롤
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
```

**API 응답에서 페이지네이션 정보 추출:**

```javascript
// 검색/피드 API 호출 후
const data = await response.json();
setAnnouncements(data.items);
setTotalItems(data.meta.total); // 전체 항목 수
// totalPages = Math.ceil(data.meta.total / data.meta.page_size)
```

**주의사항:**

- 검색 모드와 피드 모드 모두 동일한 페이지네이션 컴포넌트를 사용할 수 있습니다.
- 페이지 변경 시 현재 `mode`에 따라 적절한 API를 호출해야 합니다.
- 페이지 변경 시 스크롤을 상단으로 이동하는 것이 좋습니다.

---

## API 클라이언트 구조

프론트엔드에서 API 호출을 위한 추천 구조:

```
src/
  api/
    client.js          # axios 인스턴스 설정
    feed.js            # 피드 관련 API
    posts.js           # 포스트 관련 API
    likes.js           # 좋아요 관련 API
    users.js           # 사용자 관련 API
    search.js          # 검색 관련 API
    chat.js            # 챗봇 관련 API
```
