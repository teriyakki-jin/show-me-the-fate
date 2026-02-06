# 🌙 Show Me The Fate (사주팔자)

> Next.js와 TypeScript로 제작된 현대적인 디자인의 사주 분석 웹 애플리케이션입니다.
> 
> **Live Demo:** [https://dark-aurora-one.vercel.app](https://dark-aurora-one.vercel.app)

![App Preview](https://github.com/user-attachments/assets/placeholder)

## ✨ 주요 기능

이 앱은 사용자의 생년월일시를 기반으로 정통 명리학 이론을 적용하여 다양한 운세 분석을 제공합니다.

### 1. 기본 분석
- **사주팔자(四柱八字)**: 연월일시의 4기둥과 8글자 분석 및 오행(목화토금수) 분포 시각화
- **일간(日干) 분석**: 타고난 성향과 기질 상세 해석
- **십신(十神) 배치**: 육친론에 따른 심리 및 사회적 관계 구조 분석

### 2. 운세 및 상세 통변
- **운세(Fortune)**:
  - 오늘의 운세 (일진)
  - 연운 (세운, 1년 운세)
  - 대운 (10년 주기 운세 흐름)
- **적성 및 테마 운세**:
  - 💼 **직업/적성**: 오행과 십신 기반의 타고난 직업 적성 및 추천 직업군
  - 🏥 **건강**: 오행의 과부족을 통한 취약 장기 분석 및 식단/운동 가이드
  - 💰 **재물**: 재성(편재/정재) 분석을 통한 자산 관리 및 투자 조언
  - 💕 **연애/결혼**: 이상형, 연애 스타일, 결혼 운세 및 조언

### 3. 부가 기능
- **💑 궁합 보기**: 상대방 정보를 입력하여 두 사람의 오행 조화 및 궁합 점수 계산 (백분율)
- **💾 저장 기능**: 분석한 사주 데이터를 브라우저(localStorage)에 저장하고 언제든 다시 불러오기
- **🐲 띠(생초) 분석**: 동물 띠에 따른 성격 장단점 분석

## 🛠 기술 스택

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Design**: Glassmorphism UI, Dark Aurora Theme
- **Deployment**: [Vercel](https://vercel.com/)

## 🚀 설치 및 실행

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 또는 yarn

### 개발 서버 실행

```bash
# 저장소 클론
git clone https://github.com/teriyakki-jin/show-me-the-fate.git

# 이동
cd show-me-the-fate

# 의존성 설치
npm install

# 개발 서버 시작
npm run dev
```

브라우저에서 `http://localhost:3000` (또는 터미널에 표시된 포트)으로 접속하세요.

## 📝 라이선스

This project is licensed under the MIT License.
