# Ad Dashboard Frontend

## 안내 및 출처 (Notice & Disclaimer)

본 프로젝트는 제 **인턴십 당시 데이터 분석 업무를 수행하며 느꼈던 실제 현업의 불편함**을 기술적으로 해결하기 위해 개인적으로 기획하고 개발한 토이 프로젝트입니다.

- **데이터 보안:** 실제 기업의 내부 DB 스키마나 소스 코드를 참고하거나 복제하지 않았습니다.
- **독자적 설계:** 본 프로젝트의 UI 구조 및 컴포넌트 설계는 일반적인 SPA 설계 패턴을 기반으로 새롭게 구현되었습니다.
- **가공 데이터:** 대시보드에 노출되는 모든 수치와 캠페인 데이터는 테스트 목적으로 생성된 가상 데이터 또는 메타 개발자 샌드박스 데이터입니다.

> 백엔드 저장소: [ad_dashboard](https://github.com/gitSoyoungLee/ad_dashboard)

---

Meta 광고 지출 데이터와 내부 전환 데이터를 통합하여 실질적인 광고 효율(CPA) 및 리드 가치를 분석하는 대시보드의 **프론트엔드 애플리케이션**입니다.

<img width="1918" height="837" alt="image" src="https://github.com/user-attachments/assets/5bcc0c97-0bbe-4b6b-9d37-b73b255fb25e" />


## 프로젝트 배경

Meta Ads Manager의 지출/결과 데이터와 서비스 내부의 가입/리드 데이터가 파편화되어 있어, 매일 수동으로 서로 다른 사이트에서 데이터를 확인하고 취합하는 비효율이 발생했습니다. 이 과정에서 리소스 낭비와 데이터 정합성 오류 가능성도 존재했습니다.

**"측정할 수 없으면 관리할 수 없다"** 는 원칙하에, 데이터 수집을 자동화하고 도메인 특화 지표를 한눈에 볼 수 있는 대시보드를 구축합니다.

## 화면 구성

### 1. 통합 성과 요약 (Dashboard)

최상단에서 전체 광고 계정의 건강 상태를 한눈에 파악합니다.

- **Summary Cards:** 총 지출액, 전환 수, 회원가입 수, 유효 리드 수, 통합 CAC, 리드 CPA
- **시계열 추이 차트:** 최근 30일간 지출액, 노출수, 클릭수, 유입 수 추이 시각화
- **AI 성과 분석:** 버튼 클릭으로 최근 7일 광고 성과를 AI가 진단 (종합 진단 · 소재별 진단 · 액션 아이템)
- **Meta 동기화:** 버튼 클릭으로 최신 광고 성과 데이터를 즉시 동기화
- **기간 필터:** 날짜 범위 선택을 통한 기간별 조회

<img width="1918" height="837" alt="image" src="https://github.com/user-attachments/assets/7e77b3b1-1570-4149-9ccc-2531d2bfc1c6" />
<img width="1564" height="595" alt="image 12" src="https://github.com/user-attachments/assets/c8928df7-c25c-4c5d-9205-eed9f92628da" />
<img width="1657" height="1282" alt="screencapture-localhost-5173-2026-06-10-14_21_14 - 복사본" src="https://github.com/user-attachments/assets/95d94d57-5796-47af-bd2d-521ebaded0ed" />


### 2. 캠페인 성과 (Campaigns)

광고 목적에 따라 서로 다른 KPI를 관리합니다.

<img width="1605" height="416" alt="image" src="https://github.com/user-attachments/assets/9e0b52c3-ae50-45a2-bc79-d0ca1d7fa12a" />


| 캠페인 유형    | 주요 지표                  | 표시 목적                     |
|-----------|------------------------|---------------------------|
| **트래픽**   | 지출액, 클릭수, CTR, CPC     | 소재 매력도 및 클릭 단가 판별         |
| **전환**    | 지출액, 회원가입 수, CPA, CTR  | **실제 DB 기준** 가입자 획득 단가 파악 |
| **DB 광고** | 지출액, 유효 리드 수, CPA, CTR | **유효 데이터 품질** 기준 성과 측정    |

- **유형/정렬 필터:** 캠페인 유형별 필터링 및 지출액/CPA 기준 정렬
- **드릴다운:** 캠페인 클릭 시 소재별(Ad-Level) 상세 성과 비교

### 3. 데이터 관리 (Data)

로우 데이터를 탭으로 구분하여 직접 조회합니다.

<img width="1587" height="556" alt="image" src="https://github.com/user-attachments/assets/a71cd491-b666-4543-a476-9a7adda1eb86" />

- **가입자 (Users):** UTM 소스/캠페인별 실제 가입자 목록
- **리드 (Leads):** 상태별(NEW/VERIFIED/REJECTED) 필터링 조회
- **Empty State:** 데이터 미존재 시 안내 화면 표시

## 기술 스택

| 구분         | 기술                    |
|------------|-----------------------|
| Language   | JavaScript (ES2022+)  |
| Framework  | React 19              |
| Routing    | React Router 7        |
| Styling    | Tailwind CSS 4        |
| Chart      | Recharts 3            |
| HTTP       | Axios                 |
| Build Tool | Vite 8                |
| Lint       | ESLint 9              |

## 프로젝트 구조

```
src/
├── api/                     # API 클라이언트
│   ├── client.js            # Axios 인스턴스 (baseURL, timeout)
│   ├── dashboard.js         # 대시보드 통계 API
│   ├── campaigns.js         # 캠페인/소재 성과 API
│   ├── aiAnalysis.js        # AI 성과 분석 API
│   └── sync.js              # 동기화/유저/리드 API
├── components/              # 공통 컴포넌트
│   ├── AiAnalysisSection.jsx # AI 성과 분석 섹션
│   ├── Navbar.jsx           # 상단 네비게이션 바
│   ├── Sidebar.jsx          # 사이드바 메뉴
│   ├── Spinner.jsx          # 로딩 스피너
│   ├── StatusBadge.jsx      # 캠페인 유형 배지
│   ├── SummaryCard.jsx      # 요약 지표 카드
│   └── TrendChart.jsx       # 시계열 추이 차트
├── layouts/                 # 레이아웃
│   └── DashboardLayout.jsx  # Sidebar + Navbar 레이아웃
├── pages/                   # 페이지 컴포넌트
│   ├── DashboardPage.jsx    # 통합 성과 요약 + 동기화
│   ├── CampaignsPage.jsx    # 캠페인 목록
│   ├── CampaignDetailPage.jsx # 캠페인 내 소재별 성과
│   └── DataPage.jsx         # 유저/리드 로우 데이터 조회
├── App.jsx                  # 라우트 정의
└── main.jsx                 # 엔트리포인트
```

## API 연동

백엔드 API(`http://localhost:8080`)와 Vite 프록시를 통해 통신합니다.

### 통계 API (`/api/v1/stats`)

| Method | Endpoint                                               | 화면           |
|--------|---------------------------------------------------------|--------------|
| GET    | `/summary?startDate={}&endDate={}`                     | 대시보드 Summary |
| GET    | `/trends?endDate={}`                                   | 대시보드 차트      |
| GET    | `/campaigns?startDate={}&endDate={}&type={}&sortBy={}` | 캠페인 목록       |
| GET    | `/campaigns/{campaignId}/ads?startDate={}&endDate={}`  | 캠페인 상세       |
| POST   | `/ai-analysis`                                         | 대시보드 AI 분석   |

### 리드/유저 API

| Method | Endpoint                                    | 화면       |
|--------|---------------------------------------------|----------|
| GET    | `/api/v1/users?utmCampaign={}`              | 데이터 관리   |
| GET    | `/api/v1/leads?status={}&metaCampaignId={}` | 데이터 관리   |

### 동기화 API

| Method | Endpoint            | 화면    |
|--------|---------------------|-------|
| POST   | `/api/v1/sync/meta` | 대시보드  |

## 시작하기

### 사전 요구사항

- Node.js 18+
- 백엔드 서버 실행 중 (`http://localhost:8080`)

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

개발 서버가 시작되면 `http://localhost:5173`에서 접속할 수 있습니다.
`/api` 경로의 요청은 Vite 프록시를 통해 백엔드(`localhost:8080`)로 전달됩니다.

### 빌드

```bash
npm run build
npm run preview
```
