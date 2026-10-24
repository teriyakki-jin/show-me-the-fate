# 🌙 Show Me The Fate (사주팔자)

양력·음력 생년월일시를 절기 기준으로 계산하고, 사주 원국과 전통 명리 해석을 보여주는 Next.js 웹 앱입니다.

> **Live Demo:** [dark-aurora-one.vercel.app](https://dark-aurora-one.vercel.app)

## 주요 기능

- 분 단위 출생 시각과 절입 시각을 반영한 연주·월주·일주·시주 계산
- 양력/음력 및 윤달 입력, 자시 관법 선택
- 경도 기반 진태양시 보정 선택
- 성별과 연간 음양에 따른 대운 순행/역행 및 절기 기반 대운수 계산
- 십신, 공망, 띠, 오행 분포와 테마별 전통 해석
- 브라우저 로컬 저장 및 이전 저장 형식 자동 마이그레이션
- 반응형 UI와 키보드/스크린리더용 기본 접근성 속성

## 계산 기준과 한계

- 핵심 원국 계산은 [`manseryeok`](https://github.com/yhj1024/manseryeok) 2.x를 사용합니다.
- 기본 관법은 한국 표준시, 절기 기준, 야자시를 넘기지 않는 자정 일진 변경입니다.
- 대운수는 인접 절기까지의 일수를 3으로 나눈 뒤 반올림하는 방식입니다.
- 출생 시간을 모르면 정오로 계산하며, 결과에 시주 불확실성을 표시합니다.
- 오행 분포는 천간과 지지의 대표 오행 8글자를 같은 비중으로 센 참고 지표입니다. 월령·지장간·조후를 포함한 종합 신강약 판정은 제공하지 않습니다.
- 해석 문구와 점수는 전통 명리 개념을 바탕으로 한 재미·자기 성찰용 콘텐츠입니다. 의료·법률·재정·관계에 관한 중요한 결정의 근거로 사용하지 마세요.

## 기술 스택

- Next.js 16.4 (App Router), React 19, TypeScript
- Tailwind CSS 4
- manseryeok 2
- Vitest 5 + V8 coverage
- GitHub Actions

## 로컬 실행

요구 사항: Node.js 20.9 이상, npm

```bash
git clone https://github.com/teriyakki-jin/show-me-the-fate.git
cd show-me-the-fate
npm ci
npm run dev
```

브라우저에서 `http://localhost:3000`에 접속합니다.

## 검증

```bash
npm run lint
npm run typecheck
npm test
npm run coverage
npm run build
```

핵심 계산·저장 모듈은 라인, 함수, 구문, 분기 커버리지 80%를 최소 기준으로 둡니다. CI는 모든 pull request와 `main` 브랜치 push에서 위 검증을 실행합니다.

## 개인정보

입력한 출생 정보와 저장한 사주는 서버로 전송하지 않고 현재 브라우저의 `localStorage`에만 보관합니다. 브라우저 데이터를 지우면 저장 내용도 삭제됩니다.

## 라이선스

[MIT License](./LICENSE)
