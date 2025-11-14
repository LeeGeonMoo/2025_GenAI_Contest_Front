# 프론트엔드 데이터 명세서

## 📋 개요

프론트엔드에서 사용하는 데이터 구조와 API 연동 시 필요한 변환 로직을 정의합니다.

---

## 1. 메인 페이지 (MainPage)

### 1.1 필요한 데이터

#### 카테고리 목록

```typescript
categories: string[]
// 예: ["전체", "대학생활", "장학", "연구", "채용", "대외활동", "기타", "추천"]
```

**특이사항:**

- "전체"는 항상 첫 번째 (index 0)
- "추천"은 특별 처리 (별 아이콘 표시)
- 카테고리는 공지 목록에서 `category` 필드의 고유값으로 자동 생성 가능

#### 공지 목록

```typescript
announcements: Announcement[]
```

---

## 2. 공지 데이터 구조 (Announcement)

### 2.1 기본 구조

```typescript
interface Announcement {
  id: string | number; // 필수: 고유 식별자
  title: string; // 필수: 공지 제목
  sub?: string; // 선택: 서브타이틀 (예: "AI/교육/봉사")
  category: string | null; // 필수: 카테고리 (예: "대학생활", "장학")
  source: string[]; // 필수: 출처 배열 (예: ["전기정보공학부", "컴퓨터공학부"])
  postedAt: string; // 필수: 작성일 (예: "10.22")
  deadline: string; // 필수: 마감일 (예: "~ 10.27" 또는 "없음")
  highlight?: string; // 선택: 하이라이트 태그 (검색 결과 등에서 사용)
}
```

### 2.2 필드별 상세 설명

| 필드        | 타입               | 필수 | 설명                                 | 예시                                  |
| ----------- | ------------------ | ---- | ------------------------------------ | ------------------------------------- |
| `id`        | `string \| number` | ✅   | 공지 고유 ID                         | `"507f1f77bcf86cd799439011"` 또는 `1` |
| `title`     | `string`           | ✅   | 공지 제목                            | `"LG 청소년 AI 캠프 멘토 모집"`       |
| `sub`       | `string`           | ❌   | 서브타이틀/요약                      | `"AI/교육/봉사"`                      |
| `category`  | `string \| null`   | ✅   | 카테고리                             | `"대학생활"`, `"장학"`, `null`        |
| `source`    | `string[]`         | ✅   | 출처 배열 (중요: 배열!)              | `["전기정보공학부", "컴퓨터공학부"]`  |
| `postedAt`  | `string`           | ✅   | 작성일 (MM.DD 형식)                  | `"10.22"`                             |
| `deadline`  | `string`           | ✅   | 마감일 (포맷: "~ MM.DD" 또는 "없음") | `"~ 10.27"`, `"없음"`                 |
| `highlight` | `string`           | ❌   | 하이라이트 태그 (검색 결과 등)       | `"MATCH"`                             |

---

## 3. 컴포넌트별 사용 필드

### 3.1 AnnouncementList

**사용 필드:**

- `id` - 리스트 키 및 즐겨찾기 식별
- `title` - 제목 표시
- `sub` - 서브타이틀 표시 (있으면)
- `category` - 카테고리 표시
- `source` - 출처 태그 배열로 표시
- `postedAt` - 작성일 표시
- `deadline` - 마감일 표시
- `highlight` - 하이라이트 태그 표시 (있으면)

**특이사항:**

- `source`는 배열로 받아서 각각 태그로 표시
- `getSources` prop으로 커스터마이징 가능 (기본: `item.source ?? []`)

### 3.2 AnnouncementDetailModal

**사용 필드:**

- `title` - 모달 제목
- `sub` - 서브타이틀 (있으면)
- `category` - 카테고리 표시
- `source` 또는 `sources` - 출처 표시 (둘 다 지원)
- `postedAt` - 작성일 표시
- `deadline` - 마감일 표시
- `highlight` - 하이라이트 태그 (있으면)

**특이사항:**

- `source` 또는 `sources` 둘 다 처리 가능
- `sourceList = sources ?? source ?? []` 로 처리

---

## 4. 백엔드 API 응답 → 프론트엔드 형식 변환

### 4.1 백엔드 응답 구조 (GET /feed)

```json
{
  "items": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "공지 제목",
      "url": "https://...",
      "posted_at": "2024-10-22T00:00:00",  // ISO 8601
      "deadline_at": "2024-10-27T00:00:00" | null,
      "body": "본문 내용...",
      "summary": "요약 내용...",
      "tags": ["태그1", "태그2"],
      "college": "공과대학" | null,
      "department": "컴퓨터공학부" | null,
      "audience_grade": ["1", "2"],
      "category": "대학생활" | null,
      "source": "local-dummy-dataset",  // ⚠️ 문자열 (배열 아님!)
      "likes": 5,
      "created_at": "2024-10-22T00:00:00",
      "updated_at": "2024-10-22T00:00:00",
      "score": 0.85,
      "rank_reason": { ... }
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "page_size": 20,
    "scoring_weights": { ... }
  }
}
```

### 4.2 변환 함수 필요

```typescript
// 백엔드 응답 → 프론트엔드 형식
function transformBackendToFrontend(backendItem: BackendPost): Announcement {
  return {
    id: backendItem.id, // 그대로 사용
    title: backendItem.title, // 그대로 사용
    sub: backendItem.summary || null, // summary → sub
    category: backendItem.category || null, // 그대로 사용
    source: backendItem.source ? [backendItem.source] : [], // ⚠️ 문자열 → 배열 변환 필요!
    postedAt: formatDate(backendItem.posted_at), // ISO → "MM.DD"
    deadline: formatDeadline(backendItem.deadline_at), // ISO → "~ MM.DD" 또는 "없음"
    highlight: null, // 검색 결과일 때만 설정
  };
}

// 날짜 포맷팅 함수
function formatDate(isoDate: string): string {
  // "2024-10-22T00:00:00" → "10.22"
  const date = new Date(isoDate);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}.${day}`;
}

// 마감일 포맷팅 함수
function formatDeadline(isoDate: string | null): string {
  if (!isoDate) return '없음';
  // "2024-10-27T00:00:00" → "~ 10.27"
  const date = new Date(isoDate);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `~ ${month}.${day}`;
}
```

### 4.3 카테고리 목록 생성

```typescript
// 공지 목록에서 카테고리 추출
function extractCategories(announcements: Announcement[]): string[] {
  const categories = new Set<string>();
  categories.add('전체'); // 항상 첫 번째

  announcements.forEach((item) => {
    if (item.category) {
      categories.add(item.category);
    }
  });

  // "추천" 추가 (있으면)
  // categories.add("추천");

  return Array.from(categories);
}
```

---

## 5. API 엔드포인트 매핑

| 프론트엔드 기능   | 백엔드 API                                | 메서드 | 변환 필요         |
| ----------------- | ----------------------------------------- | ------ | ----------------- |
| 공지 목록 조회    | `/feed`                                   | GET    | ✅ 변환 함수 필요 |
| 카테고리별 필터링 | 프론트에서 필터링                         | -      | -                 |
| 검색              | `/search?q=...`                           | GET    | ✅ 변환 함수 필요 |
| 공지 상세         | `/posts/{id}`                             | GET    | ✅ 변환 함수 필요 |
| 좋아요 추가       | `/likes`                                  | POST   | -                 |
| 좋아요 삭제       | `/likes/{user_id}/{post_id}`              | DELETE | -                 |
| 추천 공지         | `/feed/reco-user` 또는 `/feed/reco-likes` | GET    | ✅ 변환 함수 필요 |

---

## 6. 구현 우선순위

### Phase 1: 기본 공지 목록

1. ✅ API 클라이언트 설정 (axios, 환경 변수)
2. ✅ `/feed` API 연동
3. ✅ 데이터 변환 함수 구현
4. ✅ 카테고리 목록 자동 생성

### Phase 2: 검색 및 상세

5. ✅ 검색 기능 연동 (`/search`)
6. ✅ 공지 상세 모달 연동 (`/posts/{id}`)

### Phase 3: 상호작용

7. ✅ 좋아요 기능 연동
8. ✅ 추천 기능 연동

---

## 7. 주의사항

### 7.1 데이터 타입 불일치

1. **`source` 필드**
   - 백엔드: `string` (단일 문자열)
   - 프론트엔드: `string[]` (배열)
   - **해결**: 변환 함수에서 `[source]`로 배열로 변환

2. **날짜 형식**
   - 백엔드: ISO 8601 (`"2024-10-22T00:00:00"`)
   - 프론트엔드: 간단한 형식 (`"10.22"`)
   - **해결**: 날짜 포맷팅 함수 필요

3. **`sub` 필드**
   - 백엔드: `summary` (요약)
   - 프론트엔드: `sub` (서브타이틀)
   - **해결**: `summary` → `sub` 매핑

### 7.2 선택적 필드 처리

- `category`, `summary`, `deadline_at` 등은 `null`일 수 있음
- 프론트엔드에서 `??` 또는 `||` 연산자로 기본값 처리 필요

---

## 8. 예시 변환 코드

```typescript
// utils/apiTransform.ts

export interface BackendPost {
  id: string;
  title: string;
  summary?: string | null;
  category?: string | null;
  source?: string | null;
  posted_at: string;
  deadline_at?: string | null;
  // ... 기타 필드
}

export interface FrontendAnnouncement {
  id: string;
  title: string;
  sub?: string;
  category: string | null;
  source: string[];
  postedAt: string;
  deadline: string;
  highlight?: string;
}

export function transformPost(backend: BackendPost): FrontendAnnouncement {
  return {
    id: backend.id,
    title: backend.title,
    sub: backend.summary || undefined,
    category: backend.category || null,
    source: backend.source ? [backend.source] : [],
    postedAt: formatDate(backend.posted_at),
    deadline: formatDeadline(backend.deadline_at),
  };
}

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}.${day}`;
}

export function formatDeadline(isoDate: string | null | undefined): string {
  if (!isoDate) return '없음';
  const date = new Date(isoDate);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `~ ${month}.${day}`;
}
```
