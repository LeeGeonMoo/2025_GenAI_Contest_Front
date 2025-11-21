# 오늘 작업 목록

## 📋 현재 상황 파악

### ✅ 백엔드 구현 완료된 API

1. **GET /api/feed** ✅
   - `category` 파라미터 지원
   - 페이지네이션 지원
   - 프론트엔드 명세서에 맞게 구현됨

2. **GET /api/users/{user_id}** ✅
   - 사용자 프로필 조회
   - 구현됨

3. **PUT /api/users/{user_id}** ✅
   - 사용자 프로필 수정
   - 구현됨

4. **GET /api/users/{user_id}/likes** ✅
   - 사용자 좋아요 목록 조회
   - 페이지네이션 지원
   - ⚠️ **주의**: 명세서는 `GET /api/likes/{user_id}`인데 백엔드는 `GET /api/users/{user_id}/likes`로 구현됨

5. **POST /api/likes** ✅
   - 좋아요 추가
   - 구현됨

6. **DELETE /api/likes/{user_id}/{post_id}** ✅
   - 좋아요 취소
   - 구현됨

7. **GET /api/posts/{post_id}** ✅
   - 개별 포스트 조회
   - 구현됨

8. **GET /api/search** ⚠️
   - 검색 기능 구현됨
   - ❌ `category` 파라미터 없음 (명세서 요구사항)
   - ❌ `source` 파라미터 없음 (명세서 요구사항)

9. **POST /api/chat** ✅
   - 챗봇 API 구현됨

### ❌ 백엔드 미구현 API

1. **GET /api/users/{user_id}/notifications** ❌
   - 알림 설정 조회
   - 미구현

2. **PUT /api/users/{user_id}/notifications** ❌
   - 알림 설정 업데이트
   - 미구현

### 🔌 프론트엔드 연결 상태

#### ✅ 연결 완료

- **MainPage**: `GET /api/feed` 연결됨

#### ❌ 더미 데이터 사용 중 (연결 필요)

- **MyPage**:
  - 관심 활동 목록 (`GET /api/users/{user_id}/likes`)
  - AI 추천 (`GET /api/feed/reco-likes`)
  - 프로필 조회 (`GET /api/users/{user_id}`)
  - 프로필 수정 (`PUT /api/users/{user_id}`)
  - 알림 설정 조회/수정 (API 미구현)

- **MainPage**:
  - 좋아요 토글 (`POST /api/likes`, `DELETE /api/likes/{user_id}/{post_id}`)
  - 검색 기능 (`GET /api/search`)
  - 개별 포스트 조회 (`GET /api/posts/{post_id}`)

- **ChatWidget**:
  - 챗봇 API (`POST /api/chat`)

---

## 🎯 오늘 작업 목록

### 1단계: 프론트엔드 API 클라이언트 구현 (우선순위: 높음)

#### 1.1 API 클라이언트 파일 생성

- [ ] `src/api/users.js` - 사용자 관련 API
  - `getUser(user_id)`
  - `updateUser(user_id, data)`
  - `getUserLikes(user_id, page, page_size)`
  - `getUserNotifications(user_id)` (백엔드 구현 후)
  - `updateUserNotifications(user_id, data)` (백엔드 구현 후)

- [ ] `src/api/likes.js` - 좋아요 관련 API
  - `likePost(user_id, post_id)`
  - `unlikePost(user_id, post_id)`

- [ ] `src/api/posts.js` - 포스트 관련 API
  - `getPost(post_id)`

- [ ] `src/api/search.js` - 검색 관련 API
  - `search(query, options)` - `category`, `source` 파라미터 포함

- [ ] `src/api/chat.js` - 챗봇 관련 API
  - `sendMessage(question, user_id)`

- [ ] `src/api/recommendations.js` - 추천 관련 API
  - `getRecommendationsByLikes(user_id, limit)`

#### 1.2 API 응답 데이터 변환 함수

- [ ] 날짜 형식 변환 유틸리티 (`utils/dateFormatter.js`)
- [ ] Source 필드 변환 유틸리티 (`utils/sourceFormatter.js`)

---

### 2단계: MyPage API 연결 (우선순위: 높음)

#### 2.1 관심 활동 목록

- [ ] `GET /api/users/{user_id}/likes` 연결
- [ ] 더미 데이터 제거
- [ ] 로딩 상태 처리
- [ ] 에러 처리
- [ ] 페이지네이션 처리

#### 2.2 AI 추천

- [ ] `GET /api/feed/reco-likes` 연결
- [ ] 더미 데이터 제거
- [ ] 로딩 상태 처리
- [ ] 에러 처리

#### 2.3 프로필 조회

- [ ] `GET /api/users/{user_id}` 연결
- [ ] 프로필 폼 초기값 설정
- [ ] 로딩 상태 처리
- [ ] 에러 처리

#### 2.4 프로필 수정

- [ ] `PUT /api/users/{user_id}` 연결
- [ ] 저장 성공 처리
- [ ] 에러 처리
- [ ] 폼 validation

#### 2.5 알림 설정 (백엔드 구현 후)

- [ ] `GET /api/users/{user_id}/notifications` 연결
- [ ] `PUT /api/users/{user_id}/notifications` 연결
- [ ] 토글 변경 시 API 호출

---

### 3단계: MainPage API 연결 (우선순위: 중간)

#### 3.1 좋아요 토글

- [ ] `POST /api/likes` 연결
- [ ] `DELETE /api/likes/{user_id}/{post_id}` 연결
- [ ] 로컬 상태와 서버 동기화
- [ ] 에러 처리 (롤백)

#### 3.2 검색 기능

- [ ] `GET /api/search` 연결
- [ ] 검색어 입력 시 API 호출
- [ ] 카테고리 필터 적용 (백엔드 구현 후)
- [ ] 출처 필터 적용 (백엔드 구현 후)
- [ ] 페이지네이션 처리
- [ ] 검색 결과 표시

#### 3.3 개별 포스트 조회

- [ ] `GET /api/posts/{post_id}` 연결
- [ ] AnnouncementDetailModal에 데이터 표시
- [ ] 로딩 상태 처리
- [ ] 에러 처리

---

### 4단계: ChatWidget API 연결 (우선순위: 중간)

#### 4.1 챗봇 메시지 전송

- [ ] `POST /api/chat` 연결
- [ ] 메시지 전송 처리
- [ ] 응답 표시
- [ ] 에러 처리
- [ ] 로딩 상태 표시

---

### 5단계: 백엔드 수정 필요 사항 (우선순위: 중간)

#### 5.1 검색 API 파라미터 추가

- [ ] `GET /api/search`에 `category` 파라미터 추가
- [ ] `GET /api/search`에 `source` 파라미터 추가 (배열)
- [ ] 검색 서비스 로직 수정

#### 5.2 알림 설정 API 구현

- [ ] `GET /api/users/{user_id}/notifications` 구현
- [ ] `PUT /api/users/{user_id}/notifications` 구현
- [ ] User 모델에 알림 설정 필드 추가 (필요시)

#### 5.3 API 경로 불일치 해결

- [ ] 명세서: `GET /api/likes/{user_id}`
- [ ] 백엔드: `GET /api/users/{user_id}/likes`
- [ ] 결정 필요: 명세서 수정 vs 백엔드 수정

---

### 6단계: 에러 처리 및 UX 개선 (우선순위: 낮음)

#### 6.1 전역 에러 처리

- [ ] API 에러 핸들러 구현
- [ ] 네트워크 에러 처리
- [ ] 404, 500 등 HTTP 에러 처리

#### 6.2 로딩 상태

- [ ] 스켈레톤 UI 추가
- [ ] 로딩 인디케이터 개선

#### 6.3 사용자 피드백

- [ ] 성공 메시지 표시
- [ ] 에러 메시지 표시
- [ ] 토스트 알림 (선택사항)

---

## 📝 작업 순서 제안

### Phase 1: API 클라이언트 기반 구축

1. API 클라이언트 파일들 생성 (`users.js`, `likes.js`, `posts.js`, `search.js`, `chat.js`)
2. 데이터 변환 유틸리티 함수 생성

### Phase 2: MyPage 연결 (가장 중요)

1. 관심 활동 목록 API 연결
2. 프로필 조회/수정 API 연결
3. AI 추천 API 연결
4. 알림 설정 API 연결 (백엔드 구현 후)

### Phase 3: MainPage 기능 연결

1. 좋아요 토글 API 연결
2. 검색 API 연결
3. 개별 포스트 조회 API 연결

### Phase 4: ChatWidget 연결

1. 챗봇 API 연결

### Phase 5: 백엔드 보완

1. 검색 API 파라미터 추가
2. 알림 설정 API 구현

---

## ⚠️ 주의사항

1. **User ID 하드코딩**
   - 현재 프론트엔드에서 `user_id`를 하드코딩해야 함
   - 인증 시스템 구현 전까지 임시로 처리

2. **API 경로 불일치**
   - 좋아요 목록 조회 경로가 명세서와 다름
   - 팀과 협의하여 결정 필요

3. **에러 처리**
   - 모든 API 호출에 에러 처리 필요
   - 사용자에게 명확한 에러 메시지 표시

4. **로딩 상태**
   - API 호출 중 로딩 상태 표시 필요
   - 사용자 경험 개선

5. **데이터 변환**
   - 백엔드 응답을 프론트엔드 형식으로 변환 필요
   - 날짜, source 필드 등

---

## 🔍 확인 필요 사항

1. 백엔드 `GET /api/users/{user_id}` 응답에 `name` 필드가 있는지 확인
2. 백엔드 `GET /api/users/{user_id}/likes` 응답 형식이 명세서와 일치하는지 확인
3. 백엔드 `GET /api/search` 응답 형식 확인
4. 백엔드 `POST /api/chat` 응답 형식 확인
5. User 모델에 알림 설정 필드가 있는지 확인

---

## 📚 참고 자료

- 프론트엔드 API 명세서: `docs/FRONTEND_API_SPEC.md`
- 백엔드 변경 사항: `2025_GenAI_Contest_Back/docs/backend_changes_2024.md`
