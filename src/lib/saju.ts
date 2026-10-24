// 사주 (Four Pillars of Destiny) interpretation and presentation library.
// Calendar math is delegated to the tested manseryeok adapter.

import { calculateSajuChart } from './saju/engine';
import type { SajuBirthInput, SajuPillarValue } from './saju/types';

export type { SajuBirthInput } from './saju/types';

// ==================== 기본 데이터 ====================

// 천간 (Heavenly Stems)
export const CHEONGAN = [
    { name: '갑', hanja: '甲', element: '목', yin_yang: '양', color: '#22c55e', meaning: '큰 나무, 시작, 리더십' },
    { name: '을', hanja: '乙', element: '목', yin_yang: '음', color: '#16a34a', meaning: '덩굴, 유연함, 적응력' },
    { name: '병', hanja: '丙', element: '화', yin_yang: '양', color: '#ef4444', meaning: '태양, 열정, 밝음' },
    { name: '정', hanja: '丁', element: '화', yin_yang: '음', color: '#dc2626', meaning: '촛불, 섬세함, 예술' },
    { name: '무', hanja: '戊', element: '토', yin_yang: '양', color: '#eab308', meaning: '큰 산, 안정, 포용' },
    { name: '기', hanja: '己', element: '토', yin_yang: '음', color: '#ca8a04', meaning: '논밭, 실용, 알뜰함' },
    { name: '경', hanja: '庚', element: '금', yin_yang: '양', color: '#f8fafc', meaning: '강철, 결단, 정의' },
    { name: '신', hanja: '辛', element: '금', yin_yang: '음', color: '#e2e8f0', meaning: '보석, 예리함, 완벽' },
    { name: '임', hanja: '壬', element: '수', yin_yang: '양', color: '#3b82f6', meaning: '큰 바다, 지혜, 포용' },
    { name: '계', hanja: '癸', element: '수', yin_yang: '음', color: '#2563eb', meaning: '이슬, 직관, 감성' },
];

// 지지 (Earthly Branches) with detailed info
export const JIJI = [
    { name: '자', hanja: '子', animal: '쥐', element: '수', color: '#3b82f6', month: 11, hour: '23:00-01:00', season: '겨울', personality: '영리하고 적응력이 뛰어남' },
    { name: '축', hanja: '丑', animal: '소', element: '토', color: '#eab308', month: 12, hour: '01:00-03:00', season: '겨울', personality: '성실하고 인내심이 강함' },
    { name: '인', hanja: '寅', animal: '호랑이', element: '목', color: '#22c55e', month: 1, hour: '03:00-05:00', season: '봄', personality: '용감하고 카리스마 있음' },
    { name: '묘', hanja: '卯', animal: '토끼', element: '목', color: '#16a34a', month: 2, hour: '05:00-07:00', season: '봄', personality: '온화하고 예술적 감각' },
    { name: '진', hanja: '辰', animal: '용', element: '토', color: '#ca8a04', month: 3, hour: '07:00-09:00', season: '봄', personality: '야망 있고 창의적' },
    { name: '사', hanja: '巳', animal: '뱀', element: '화', color: '#ef4444', month: 4, hour: '09:00-11:00', season: '여름', personality: '지혜롭고 신중함' },
    { name: '오', hanja: '午', animal: '말', element: '화', color: '#dc2626', month: 5, hour: '11:00-13:00', season: '여름', personality: '활발하고 열정적' },
    { name: '미', hanja: '未', animal: '양', element: '토', color: '#fbbf24', month: 6, hour: '13:00-15:00', season: '여름', personality: '온순하고 예술적' },
    { name: '신', hanja: '申', animal: '원숭이', element: '금', color: '#f8fafc', month: 7, hour: '15:00-17:00', season: '가을', personality: '재치있고 영리함' },
    { name: '유', hanja: '酉', animal: '닭', element: '금', color: '#e2e8f0', month: 8, hour: '17:00-19:00', season: '가을', personality: '부지런하고 성실' },
    { name: '술', hanja: '戌', animal: '개', element: '토', color: '#d97706', month: 9, hour: '19:00-21:00', season: '가을', personality: '충성스럽고 정직' },
    { name: '해', hanja: '亥', animal: '돼지', element: '수', color: '#2563eb', month: 10, hour: '21:00-23:00', season: '겨울', personality: '낙천적이고 관대함' },
];

// 띠 상세 해석
export const ZODIAC_DETAILS: Record<string, {
    emoji: string;
    traits: string[];
    strengths: string[];
    weaknesses: string[];
    compatible: string[];
    incompatible: string[];
    career: string[];
    luckyNumbers: number[];
    luckyColors: string[];
}> = {
    '쥐': {
        emoji: '🐀',
        traits: ['영리함', '적응력', '사교적', '야망'],
        strengths: ['기민한 판단력', '뛰어난 직관', '융통성', '수완'],
        weaknesses: ['소심함', '의심 많음', '물질적 집착'],
        compatible: ['용', '원숭이', '소'],
        incompatible: ['말', '토끼', '양'],
        career: ['사업가', '작가', '연구원', '정치인'],
        luckyNumbers: [2, 3],
        luckyColors: ['파랑', '금색', '녹색']
    },
    '소': {
        emoji: '🐂',
        traits: ['성실함', '인내심', '신뢰성', '꾸준함'],
        strengths: ['끈기', '책임감', '정직함', '근면'],
        weaknesses: ['완고함', '변화 거부', '표현 부족'],
        compatible: ['뱀', '닭', '쥐'],
        incompatible: ['양', '말', '개'],
        career: ['농업', '의료', '금융', '부동산'],
        luckyNumbers: [1, 4],
        luckyColors: ['흰색', '노랑', '녹색']
    },
    '호랑이': {
        emoji: '🐅',
        traits: ['용감함', '자신감', '카리스마', '독립적'],
        strengths: ['리더십', '결단력', '열정', '용기'],
        weaknesses: ['성급함', '독단적', '무모함'],
        compatible: ['말', '개', '돼지'],
        incompatible: ['원숭이', '뱀'],
        career: ['군인', 'CEO', '배우', '운동선수'],
        luckyNumbers: [1, 3, 4],
        luckyColors: ['파랑', '회색', '오렌지']
    },
    '토끼': {
        emoji: '🐇',
        traits: ['온화함', '우아함', '예술적', '친절'],
        strengths: ['외교술', '섬세함', '창의성', '신중함'],
        weaknesses: ['우유부단', '회피적', '보수적'],
        compatible: ['양', '돼지', '개'],
        incompatible: ['닭', '쥐'],
        career: ['예술가', '디자이너', '외교관', '상담사'],
        luckyNumbers: [3, 4, 6],
        luckyColors: ['분홍', '보라', '파랑']
    },
    '용': {
        emoji: '🐉',
        traits: ['야망', '자신감', '창의력', '열정'],
        strengths: ['리더십', '매력', '에너지', '결단력'],
        weaknesses: ['오만함', '성급함', '완벽주의'],
        compatible: ['쥐', '원숭이', '닭'],
        incompatible: ['개', '토끼'],
        career: ['기업인', '정치인', '배우', '건축가'],
        luckyNumbers: [1, 6, 7],
        luckyColors: ['금색', '은색', '흰색']
    },
    '뱀': {
        emoji: '🐍',
        traits: ['지혜', '신비', '직관', '우아함'],
        strengths: ['통찰력', '집중력', '결단력', '매력'],
        weaknesses: ['의심', '질투', '비밀주의'],
        compatible: ['소', '닭'],
        incompatible: ['호랑이', '돼지'],
        career: ['철학자', '과학자', '정신과의사', '탐정'],
        luckyNumbers: [2, 8, 9],
        luckyColors: ['검정', '빨강', '노랑']
    },
    '말': {
        emoji: '🐴',
        traits: ['활동적', '열정', '자유로움', '사교적'],
        strengths: ['낙관성', '친화력', '기민함', '다재다능'],
        weaknesses: ['변덕', '인내력 부족', '자기중심'],
        compatible: ['호랑이', '양', '개'],
        incompatible: ['쥐', '소'],
        career: ['여행가이드', '세일즈', '저널리스트', '공연'],
        luckyNumbers: [2, 3, 7],
        luckyColors: ['노랑', '녹색']
    },
    '양': {
        emoji: '🐏',
        traits: ['온순함', '예술적', '동정심', '평화'],
        strengths: ['창의성', '친절함', '인내심', '품위'],
        weaknesses: ['수동적', '걱정', '비관적'],
        compatible: ['토끼', '말', '돼지'],
        incompatible: ['소', '개'],
        career: ['예술가', '간호사', '사회복지사', '인테리어'],
        luckyNumbers: [2, 7],
        luckyColors: ['녹색', '빨강', '보라']
    },
    '원숭이': {
        emoji: '🐒',
        traits: ['영리함', '재치', '호기심', '사교적'],
        strengths: ['문제해결력', '적응력', '창의성', '유머'],
        weaknesses: ['허영심', '교활함', '불안정'],
        compatible: ['용', '쥐'],
        incompatible: ['호랑이', '돼지'],
        career: ['엔지니어', '프로그래머', '배우', '경영'],
        luckyNumbers: [4, 9],
        luckyColors: ['흰색', '파랑', '금색']
    },
    '닭': {
        emoji: '🐓',
        traits: ['부지런함', '용감함', '정직', '성실'],
        strengths: ['정확함', '관찰력', '자신감', '근면'],
        weaknesses: ['완벽주의', '비판적', '자기과시'],
        compatible: ['소', '뱀', '용'],
        incompatible: ['토끼', '개'],
        career: ['회계사', '군인', '음식업', '패션'],
        luckyNumbers: [5, 7, 8],
        luckyColors: ['금색', '갈색', '노랑']
    },
    '개': {
        emoji: '🐕',
        traits: ['충성심', '정직', '용감함', '신뢰'],
        strengths: ['의리', '정의감', '보호본능', '성실'],
        weaknesses: ['걱정', '비관적', '완고함'],
        compatible: ['호랑이', '토끼', '말'],
        incompatible: ['용', '양', '소'],
        career: ['경찰', '변호사', '간호사', '교사'],
        luckyNumbers: [3, 4, 9],
        luckyColors: ['빨강', '녹색', '보라']
    },
    '돼지': {
        emoji: '🐷',
        traits: ['낙천적', '관대함', '성실', '순수'],
        strengths: ['인내심', '관용', '친절', '부지런'],
        weaknesses: ['순진함', '물질적', '게으름'],
        compatible: ['호랑이', '토끼', '양'],
        incompatible: ['뱀', '원숭이'],
        career: ['요리사', '교사', '의사', '엔터테인먼트'],
        luckyNumbers: [2, 5, 8],
        luckyColors: ['노랑', '회색', '갈색']
    }
};

// 오행 (Five Elements) with relationships
export const FIVE_ELEMENTS = {
    목: {
        name: '목(木)',
        meaning: '성장, 인내, 창조',
        color: '#22c55e',
        gradient: 'from-green-500 to-emerald-600',
        season: '봄',
        direction: '동',
        organ: '간, 담',
        emotion: '분노',
        generates: '화',
        overcomes: '토',
        generatedBy: '수',
        overcomedBy: '금'
    },
    화: {
        name: '화(火)',
        meaning: '열정, 에너지, 활력',
        color: '#ef4444',
        gradient: 'from-red-500 to-orange-500',
        season: '여름',
        direction: '남',
        organ: '심장, 소장',
        emotion: '기쁨',
        generates: '토',
        overcomes: '금',
        generatedBy: '목',
        overcomedBy: '수'
    },
    토: {
        name: '토(土)',
        meaning: '안정, 신뢰, 중심',
        color: '#eab308',
        gradient: 'from-yellow-500 to-amber-600',
        season: '환절기',
        direction: '중앙',
        organ: '비장, 위장',
        emotion: '사려',
        generates: '금',
        overcomes: '수',
        generatedBy: '화',
        overcomedBy: '목'
    },
    금: {
        name: '금(金)',
        meaning: '결단, 정의, 변화',
        color: '#f8fafc',
        gradient: 'from-slate-200 to-slate-400',
        season: '가을',
        direction: '서',
        organ: '폐, 대장',
        emotion: '슬픔',
        generates: '수',
        overcomes: '목',
        generatedBy: '토',
        overcomedBy: '화'
    },
    수: {
        name: '수(水)',
        meaning: '지혜, 유연, 소통',
        color: '#3b82f6',
        gradient: 'from-blue-500 to-indigo-600',
        season: '겨울',
        direction: '북',
        organ: '신장, 방광',
        emotion: '두려움',
        generates: '목',
        overcomes: '화',
        generatedBy: '금',
        overcomedBy: '토'
    },
};

// ==================== 십신 (Ten Gods) ====================

export type TenGodType = '비견' | '겁재' | '식신' | '상관' | '편재' | '정재' | '편관' | '정관' | '편인' | '정인';

export const TEN_GODS: Record<TenGodType, {
    hanja: string;
    meaning: string;
    keyword: string;
    positive: string[];
    negative: string[];
    relationship: string;
}> = {
    '비견': {
        hanja: '比肩',
        meaning: '나와 같은 오행, 같은 음양',
        keyword: '형제, 동료, 경쟁',
        positive: ['독립심', '자존심', '추진력'],
        negative: ['고집', '경쟁심', '분쟁'],
        relationship: '형제자매, 친구, 동료'
    },
    '겁재': {
        hanja: '劫財',
        meaning: '나와 같은 오행, 다른 음양',
        keyword: '경쟁, 재물손실, 투쟁',
        positive: ['적극성', '도전정신', '사교성'],
        negative: ['충동', '낭비', '시기'],
        relationship: '이복형제, 경쟁자'
    },
    '식신': {
        hanja: '食神',
        meaning: '내가 생하는 오행, 같은 음양',
        keyword: '창작, 표현, 복덕',
        positive: ['재능', '낙천성', '건강'],
        negative: ['게으름', '탐식', '방종'],
        relationship: '자녀(여성), 표현력'
    },
    '상관': {
        hanja: '傷官',
        meaning: '내가 생하는 오행, 다른 음양',
        keyword: '예술, 반항, 자유',
        positive: ['창의성', '언변', '예술성'],
        negative: ['반항심', '비판', '자만'],
        relationship: '자녀(남성), 재능'
    },
    '편재': {
        hanja: '偏財',
        meaning: '내가 극하는 오행, 같은 음양',
        keyword: '재물, 사업, 유동자산',
        positive: ['통솔력', '사교성', '사업수완'],
        negative: ['낭비', '투기', '욕심'],
        relationship: '아버지, 부돈'
    },
    '정재': {
        hanja: '正財',
        meaning: '내가 극하는 오행, 다른 음양',
        keyword: '안정재물, 저축, 근면',
        positive: ['성실', '저축', '안정'],
        negative: ['인색', '소심', '계산적'],
        relationship: '아내(남성), 정직한 재물'
    },
    '편관': {
        hanja: '偏官',
        meaning: '나를 극하는 오행, 같은 음양',
        keyword: '권력, 압박, 직위',
        positive: ['결단력', '추진력', '권위'],
        negative: ['독재', '폭력성', '압박'],
        relationship: '남편(여성), 직장상사'
    },
    '정관': {
        hanja: '正官',
        meaning: '나를 극하는 오행, 다른 음양',
        keyword: '명예, 직장, 품위',
        positive: ['책임감', '성실', '명예'],
        negative: ['보수적', '권위적', '경직'],
        relationship: '남편(여성), 직장, 명예'
    },
    '편인': {
        hanja: '偏印',
        meaning: '나를 생하는 오행, 같은 음양',
        keyword: '학문, 편벽, 종교',
        positive: ['재치', '연구심', '통찰력'],
        negative: ['고독', '편벽', '변덕'],
        relationship: '계모, 스승'
    },
    '정인': {
        hanja: '正印',
        meaning: '나를 생하는 오행, 다른 음양',
        keyword: '학문, 인덕, 보호',
        positive: ['지혜', '인자함', '학문'],
        negative: ['의존', '우유부단', '나태'],
        relationship: '어머니, 문서, 자격증'
    }
};

// ==================== 계산 함수들 ====================

// 간지 60갑자 계산
export function getGanZhi(index: number) {
    const ganIndex = ((index % 10) + 10) % 10;
    const zhiIndex = ((index % 12) + 12) % 12;
    return {
        gan: CHEONGAN[ganIndex],
        zhi: JIJI[zhiIndex],
    };
}

// 연주 (Year Pillar) 계산
export function getYearPillar(year: number) {
    const baseYear = 1984; // 갑자년
    const diff = year - baseYear;
    const index = ((diff % 60) + 60) % 60;
    return getGanZhi(index);
}

// 월주 (Month Pillar) 계산
export function getMonthPillar(year: number, month: number) {
    const yearGan = getYearPillar(year).gan;
    const yearGanIndex = CHEONGAN.findIndex(g => g.name === yearGan.name);

    // 월건 계산 (인월 = 1월)
    const monthZhiIndex = (month + 1) % 12;

    // 월간 계산 (연간에 따라 결정)
    const monthGanBase = (yearGanIndex % 5) * 2;
    const monthGanIndex = ((monthGanBase + month - 1) % 10 + 10) % 10;

    return {
        gan: CHEONGAN[monthGanIndex],
        zhi: JIJI[monthZhiIndex],
    };
}

// 일주 (Day Pillar) 계산 - 정확한 만세력 기반
export function getDayPillar(year: number, month: number, day: number) {
    // 기준일: 2000년 1월 1일 = 무오(戊午)일
    // 무(戊) = 천간 4번째 (0-indexed), 오(午) = 지지 6번째 (0-indexed)
    // 육십갑자에서 무오는 55번째 (1-indexed) = 54번째 (0-indexed)
    const BASE_GANZHI_INDEX = 54; // 무오 = 54 (0-indexed)

    // UTC 기준으로 날짜 차이 계산 (시간대/서머타임 문제 해결)
    const baseDate = Date.UTC(2000, 0, 1); // 2000년 1월 1일 UTC
    const targetDate = Date.UTC(year, month - 1, day);
    const diffDays = Math.round((targetDate - baseDate) / (1000 * 60 * 60 * 24));

    // 60갑자 순환 적용
    const dayIndex = ((BASE_GANZHI_INDEX + diffDays) % 60 + 60) % 60;

    // 천간(10개)과 지지(12개) 인덱스 계산
    const ganIndex = dayIndex % 10;
    const zhiIndex = dayIndex % 12;

    return {
        gan: CHEONGAN[ganIndex],
        zhi: JIJI[zhiIndex],
    };
}

// 시주 (Hour Pillar) 계산
export function getHourPillar(dayGanIndex: number, hour: number) {
    const hourZhiIndex = Math.floor(((hour + 1) % 24) / 2);
    const hourGanBase = (dayGanIndex % 5) * 2;
    const hourGanIndex = ((hourGanBase + hourZhiIndex) % 10 + 10) % 10;

    return {
        gan: CHEONGAN[hourGanIndex],
        zhi: JIJI[hourZhiIndex],
    };
}

// 십신 계산
export function calculateTenGod(dayGan: typeof CHEONGAN[number], targetGan: typeof CHEONGAN[number]): TenGodType {
    const dayElement = dayGan.element;
    const targetElement = targetGan.element;
    const sameYinYang = dayGan.yin_yang === targetGan.yin_yang;

    const elementOrder = ['목', '화', '토', '금', '수'];
    const dayIdx = elementOrder.indexOf(dayElement);
    const targetIdx = elementOrder.indexOf(targetElement);

    // 같은 오행
    if (dayElement === targetElement) {
        return sameYinYang ? '비견' : '겁재';
    }

    // 내가 생하는 오행
    if ((dayIdx + 1) % 5 === targetIdx) {
        return sameYinYang ? '식신' : '상관';
    }

    // 내가 극하는 오행
    if ((dayIdx + 2) % 5 === targetIdx) {
        return sameYinYang ? '편재' : '정재';
    }

    // 나를 극하는 오행
    if ((targetIdx + 2) % 5 === dayIdx) {
        return sameYinYang ? '편관' : '정관';
    }

    // 나를 생하는 오행
    if ((targetIdx + 1) % 5 === dayIdx) {
        return sameYinYang ? '편인' : '정인';
    }

    return '비견';
}

// 오행 분석
export function analyzeElements(pillars: ReturnType<typeof getGanZhi>[]) {
    const elementCount: Record<string, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };

    pillars.forEach(pillar => {
        elementCount[pillar.gan.element]++;
        elementCount[pillar.zhi.element]++;
    });

    return elementCount;
}

// 오행 상생상극 분석
export function analyzeElementRelations(elementCount: Record<string, number>) {
    const analysis: {
        balanced: boolean;
        dominant: string | null;
        lacking: string | null;
        generating: string[];
        overcoming: string[];
    } = {
        balanced: true,
        dominant: null,
        lacking: null,
        generating: [],
        overcoming: []
    };

    const entries = Object.entries(elementCount);
    const max = Math.max(...entries.map(([, v]) => v));
    const min = Math.min(...entries.map(([, v]) => v));

    if (max - min > 3) {
        analysis.balanced = false;
    }

    const dominantEntry = entries.find(([, v]) => v === max);
    const lackingEntry = entries.find(([, v]) => v === min);

    if (dominantEntry && max > 3) analysis.dominant = dominantEntry[0];
    if (lackingEntry && min === 0) analysis.lacking = lackingEntry[0];

    // 상생 관계 찾기
    Object.entries(FIVE_ELEMENTS).forEach(([element, info]) => {
        if (elementCount[element] > 0 && elementCount[info.generates] > 0) {
            analysis.generating.push(`${info.name} → ${FIVE_ELEMENTS[info.generates as keyof typeof FIVE_ELEMENTS].name}`);
        }
    });

    // 상극 관계 찾기
    Object.entries(FIVE_ELEMENTS).forEach(([element, info]) => {
        if (elementCount[element] > 2 && elementCount[info.overcomes] > 0) {
            analysis.overcoming.push(`${info.name} ⚔ ${FIVE_ELEMENTS[info.overcomes as keyof typeof FIVE_ELEMENTS].name}`);
        }
    });

    return analysis;
}

// 일간 기준 성격 해석
export function getDayMasterInterpretation(dayGan: typeof CHEONGAN[number]) {
    const interpretations: Record<string, {
        short: string;
        long: string;
        career: string[];
        love: string;
        health: string;
    }> = {
        갑: {
            short: '큰 나무 - 리더형',
            long: '리더십이 강하고 진취적인 성격입니다. 큰 나무처럼 굳건하며 목표를 향해 곧게 뻗어나갑니다. 정의감이 강하고 책임감 있는 모습을 보입니다. 때로는 융통성이 부족하고 고집이 셀 수 있습니다.',
            career: ['CEO', '정치인', '군인', '사업가', '건축가'],
            love: '연인에게 헌신적이지만 독점욕이 강할 수 있습니다. 믿음직한 파트너입니다.',
            health: '간과 눈 건강에 주의하세요. 스트레스 관리가 중요합니다.'
        },
        을: {
            short: '덩굴 - 적응형',
            long: '유연하고 적응력이 뛰어납니다. 덩굴처럼 상황에 맞게 변화하며, 섬세하고 예술적 감각이 있습니다. 타인을 배려하는 마음이 큽니다. 결단력이 부족할 때가 있습니다.',
            career: ['예술가', '디자이너', '상담사', '외교관', '통역사'],
            love: '로맨틱하고 상대방을 세심하게 배려합니다. 의존적이 되지 않도록 주의하세요.',
            health: '신경계통과 간 건강에 신경쓰세요.'
        },
        병: {
            short: '태양 - 열정형',
            long: '열정적이고 에너지가 넘칩니다. 태양처럼 밝고 따뜻한 성격으로 주변을 환하게 만듭니다. 적극적이고 표현력이 뛰어납니다. 성급하고 참을성이 부족할 수 있습니다.',
            career: ['연예인', '광고', '마케팅', '요리사', 'MC'],
            love: '열정적으로 사랑하지만 쉽게 식을 수 있습니다. 꾸준함이 필요합니다.',
            health: '심장과 혈압에 주의하세요. 과로를 피하세요.'
        },
        정: {
            short: '촛불 - 섬세형',
            long: '차분하고 내면의 열정을 가졌습니다. 촛불처럼 은은하게 빛나며, 깊은 사고력과 섬세함을 지녔습니다. 예술과 학문에 재능이 있습니다.',
            career: ['작가', '연구원', '교수', '심리상담사', '예술가'],
            love: '깊고 진지한 사랑을 추구합니다. 감정을 잘 표현하세요.',
            health: '심장 건강에 유의하고, 명상과 휴식을 취하세요.'
        },
        무: {
            short: '큰 산 - 안정형',
            long: '안정적이고 신뢰감을 줍니다. 큰 산처럼 묵직하고 포용력이 있으며, 중심을 잡아주는 역할을 합니다. 실용적이고 현실적입니다.',
            career: ['부동산', '건설', '농업', '은행', '관리직'],
            love: '믿음직하고 헌신적인 파트너입니다. 표현을 더 해주세요.',
            health: '소화기관에 주의하세요. 규칙적인 식사가 중요합니다.'
        },
        기: {
            short: '논밭 - 실용형',
            long: '꼼꼼하고 세심합니다. 비옥한 땅처럼 무엇이든 키워내는 능력이 있으며, 실속있고 알뜰합니다. 가정적이고 헌신적입니다.',
            career: ['회계사', '요리사', '교사', '간호사', '농부'],
            love: '안정적인 관계를 원합니다. 다소 보수적일 수 있습니다.',
            health: '위장관에 신경쓰고, 과식을 피하세요.'
        },
        경: {
            short: '강철 - 결단형',
            long: '결단력이 있고 원칙을 중시합니다. 강철처럼 단단하고 정의로우며, 개혁적인 성향이 있습니다. 명예와 의리를 중요시합니다.',
            career: ['변호사', '군인', '경찰', '외과의사', '엔지니어'],
            love: '직설적이고 솔직합니다. 부드러운 표현도 필요합니다.',
            health: '폐와 호흡기에 주의하세요. 스트레스 관리가 필요합니다.'
        },
        신: {
            short: '보석 - 완벽형',
            long: '예리하고 완벽주의적입니다. 보석처럼 세련되고 품위 있으며, 미적 감각이 뛰어납니다. 섬세하고 감수성이 풍부합니다.',
            career: ['보석상', '패션', '화가', '평론가', '감정사'],
            love: '이상이 높고 까다롭습니다. 완벽한 상대를 기대하지 마세요.',
            health: '호흡기와 피부에 주의하세요.'
        },
        임: {
            short: '큰 바다 - 지혜형',
            long: '지혜롭고 포용력이 큽니다. 큰 바다처럼 깊은 생각과 넓은 시야를 가졌습니다. 창의적이고 통찰력이 있습니다.',
            career: ['철학자', '심리학자', '무역', '해양관련', '여행업'],
            love: '자유를 사랑합니다. 구속을 싫어하니 이해해주세요.',
            health: '신장과 비뇨기에 주의하세요. 수분 섭취가 중요합니다.'
        },
        계: {
            short: '이슬 - 감성형',
            long: '직관적이고 감성적입니다. 이슬처럼 맑은 감수성을 지녔으며, 예술적 재능이 있습니다. 영적이고 신비로운 면이 있습니다.',
            career: ['점술가', '심리상담', '작가', '음악가', '종교인'],
            love: '감정이 깊고 로맨틱합니다. 현실적인 면도 챙기세요.',
            health: '신장 건강과 정신건강에 신경쓰세요.'
        },
    };

    return interpretations[dayGan.name] || interpretations['갑'];
}

// 대운 계산
export function calculateDaeun(birthYear: number, birthMonth: number, gender: '남' | '여') {
    const yearGan = getYearPillar(birthYear).gan;
    const isYangYear = yearGan.yin_yang === '양';
    const isForward = (gender === '남' && isYangYear) || (gender === '여' && !isYangYear);

    const daeunList: Array<{
        age: number;
        pillar: ReturnType<typeof getGanZhi>;
        startYear: number;
        endYear: number;
    }> = [];

    const monthPillar = getMonthPillar(birthYear, birthMonth);
    const baseIndex = CHEONGAN.findIndex(g => g.name === monthPillar.gan.name) +
        JIJI.findIndex(z => z.name === monthPillar.zhi.name) * 10;

    for (let i = 0; i < 10; i++) {
        const age = (i + 1) * 10 - 7; // 대운 시작 나이 (대략)
        const index = isForward ? baseIndex + i + 1 : baseIndex - i - 1;
        const ganIdx = ((index % 10) + 10) % 10;
        const zhiIdx = (((i + (isForward ? 1 : -1)) + (JIJI.findIndex(z => z.name === monthPillar.zhi.name))) % 12 + 12) % 12;

        daeunList.push({
            age,
            pillar: { gan: CHEONGAN[ganIdx], zhi: JIJI[zhiIdx] },
            startYear: birthYear + age,
            endYear: birthYear + age + 9
        });
    }

    return daeunList;
}

// 세운 (연운) 계산
export function calculateYearlyFortune(targetYear: number, dayGan: typeof CHEONGAN[number]) {
    const yearPillar = getYearPillar(targetYear);
    const tenGod = calculateTenGod(dayGan, yearPillar.gan);

    const fortuneMessages: Record<TenGodType, { luck: number; message: string }> = {
        '비견': { luck: 3, message: '경쟁과 협력이 공존하는 해입니다. 독립적인 활동에 유리합니다.' },
        '겁재': { luck: 2, message: '재물 손실에 주의하세요. 투자와 지출을 신중히 하세요.' },
        '식신': { luck: 4, message: '창작 활동과 자기 표현에 좋은 해입니다. 건강도 양호합니다.' },
        '상관': { luck: 3, message: '예술적 재능이 빛나지만 대인관계에 주의하세요.' },
        '편재': { luck: 4, message: '사업 기회가 생깁니다. 적극적으로 움직이세요.' },
        '정재': { luck: 5, message: '안정적인 재물운입니다. 저축과 투자에 좋습니다.' },
        '편관': { luck: 2, message: '변화와 압박이 있을 수 있습니다. 건강 관리에 신경쓰세요.' },
        '정관': { luck: 4, message: '승진, 합격 등 좋은 소식이 있을 수 있습니다.' },
        '편인': { luck: 3, message: '학업과 연구에 유리합니다. 정서적 안정을 찾으세요.' },
        '정인': { luck: 5, message: '학업, 자격증, 문서운이 좋습니다. 귀인의 도움을 받습니다.' }
    };

    return {
        year: targetYear,
        pillar: yearPillar,
        tenGod,
        tenGodInfo: TEN_GODS[tenGod],
        fortune: fortuneMessages[tenGod]
    };
}

// 오늘의 운세
export function getTodayFortune(dayGan: typeof CHEONGAN[number]) {
    const today = new Date();
    const dayPillar = getDayPillar(today.getFullYear(), today.getMonth() + 1, today.getDate());
    const tenGod = calculateTenGod(dayGan, dayPillar.gan);

    const dailyMessages: Record<TenGodType, string[]> = {
        '비견': ['자기 주장이 강해지는 날', '동료와의 협력이 중요', '독립적인 활동에 유리'],
        '겁재': ['지출에 주의', '경쟁 상황 발생 가능', '충동적 결정은 피하세요'],
        '식신': ['건강하고 활력 넘치는 날', '맛있는 음식을 즐기세요', '창작 활동에 좋음'],
        '상관': ['언행 조심이 필요', '창의적 아이디어가 떠오름', '자기 표현의 날'],
        '편재': ['재물운이 활발', '사업 미팅에 좋은 날', '적극적으로 움직이세요'],
        '정재': ['안정적인 금전운', '저축하기 좋은 날', '성실함이 빛납니다'],
        '편관': ['긴장감이 있을 수 있음', '체력 관리 필요', '변화에 유연하게 대처'],
        '정관': ['직장에서 좋은 평가', '품위를 유지하세요', '책임감 있는 행동'],
        '편인': ['학습에 집중되는 날', '조용한 시간이 필요', '직감을 믿으세요'],
        '정인': ['귀인의 도움', '공부하기 좋은 날', '어른의 조언을 들으세요']
    };

    const messages = dailyMessages[tenGod];

    return {
        date: today,
        dayPillar,
        tenGod,
        messages,
        luckyHours: [
            JIJI[(JIJI.findIndex(z => z.element === dayGan.element) + 4) % 12],
            JIJI[(JIJI.findIndex(z => z.element === dayGan.element) + 8) % 12]
        ]
    };
}

// 궁합 계산
export function calculateCompatibility(
    person1: { dayGan: typeof CHEONGAN[number]; yearZhi: typeof JIJI[number] },
    person2: { dayGan: typeof CHEONGAN[number]; yearZhi: typeof JIJI[number] }
) {
    let score = 50; // 기본 점수
    const analysis: string[] = [];

    // 일간 오행 관계
    const element1 = person1.dayGan.element;
    const element2 = person2.dayGan.element;
    const elem1Info = FIVE_ELEMENTS[element1 as keyof typeof FIVE_ELEMENTS];
    const elem2Info = FIVE_ELEMENTS[element2 as keyof typeof FIVE_ELEMENTS];

    // 상생 관계 (+20점)
    if (elem1Info.generates === element2 || elem2Info.generates === element1) {
        score += 20;
        analysis.push(`✨ 오행이 서로 생(生)하는 상생 관계입니다. 서로를 발전시켜 줍니다.`);
    }

    // 같은 오행 (+10점)
    if (element1 === element2) {
        score += 10;
        analysis.push(`🤝 같은 오행으로 가치관이 비슷합니다.`);
    }

    // 상극 관계 (-10점)
    if (elem1Info.overcomes === element2 || elem2Info.overcomes === element1) {
        score -= 10;
        analysis.push(`⚡ 오행이 상극 관계입니다. 갈등이 있을 수 있지만 보완관계가 될 수도 있습니다.`);
    }

    // 띠 궁합
    const zodiac1 = ZODIAC_DETAILS[person1.yearZhi.animal];
    if (zodiac1.compatible.includes(person2.yearZhi.animal)) {
        score += 15;
        analysis.push(`💕 ${person1.yearZhi.animal}띠와 ${person2.yearZhi.animal}띠는 좋은 궁합입니다.`);
    }

    if (zodiac1.incompatible.includes(person2.yearZhi.animal)) {
        score -= 15;
        analysis.push(`💔 ${person1.yearZhi.animal}띠와 ${person2.yearZhi.animal}띠는 주의가 필요한 관계입니다.`);
    }

    // 음양 조화
    if (person1.dayGan.yin_yang !== person2.dayGan.yin_yang) {
        score += 10;
        analysis.push(`☯️ 음양이 조화를 이루어 균형 잡힌 관계입니다.`);
    }

    // 점수 범위 조정
    score = Math.max(20, Math.min(100, score));

    let grade: string;
    if (score >= 85) grade = '최상';
    else if (score >= 70) grade = '상';
    else if (score >= 55) grade = '중상';
    else if (score >= 40) grade = '중';
    else grade = '보통';

    return {
        score,
        grade,
        analysis,
        advice: score >= 70
            ? '서로 잘 맞는 좋은 인연입니다. 서로를 존중하며 행복한 관계를 이어가세요.'
            : '차이점을 인정하고 서로 배려한다면 좋은 관계가 될 수 있습니다.'
    };
}

// ==================== Phase 3: 상세 운세 분석 ====================

// 직업 적성 분석
export function analyzeCareerAptitude(dayGan: typeof CHEONGAN[number], tenGods: Record<string, TenGodType>, elementCount: Record<string, number>) {
    const careers: {
        category: string;
        jobs: string[];
        score: number;
        reason: string;
    }[] = [];

    // 일간 기반 기본 직업
    const dayMasterCareers = getDayMasterInterpretation(dayGan).career;
    careers.push({
        category: '타고난 적성',
        jobs: dayMasterCareers,
        score: 90,
        reason: `${dayGan.name}(${dayGan.hanja}) 일간의 기본 성향에 맞는 직업입니다.`
    });

    // 십신 기반 직업 분석
    const tenGodCareers: Record<TenGodType, { category: string; jobs: string[] }> = {
        '비견': { category: '독립/경쟁', jobs: ['사업가', '프리랜서', '스포츠선수', '영업'] },
        '겁재': { category: '도전/투자', jobs: ['투자자', '벤처', '무역', '증권'] },
        '식신': { category: '예술/요리', jobs: ['셰프', '작곡가', '화가', '웹툰작가'] },
        '상관': { category: '창작/언론', jobs: ['작가', 'PD', '비평가', '인플루언서'] },
        '편재': { category: '사업/영업', jobs: ['CEO', '마케팅', '무역상', '부동산'] },
        '정재': { category: '금융/관리', jobs: ['은행원', '회계사', '재무', '세무사'] },
        '편관': { category: '권력/무력', jobs: ['군인', '경찰', '검사', '외과의사'] },
        '정관': { category: '공직/관리', jobs: ['공무원', '판사', '외교관', '대기업'] },
        '편인': { category: '연구/종교', jobs: ['연구원', '점술가', '심리학자', '철학자'] },
        '정인': { category: '교육/학문', jobs: ['교수', '교사', '학자', '변호사'] }
    };

    // 월주 십신 (직업 환경)
    if (tenGods.month && tenGodCareers[tenGods.month]) {
        careers.push({
            category: tenGodCareers[tenGods.month].category,
            jobs: tenGodCareers[tenGods.month].jobs,
            score: 85,
            reason: `월주의 ${tenGods.month}이 직업 환경을 나타냅니다.`
        });
    }

    // 시주 십신 (노후/결과)
    if (tenGods.hour && tenGodCareers[tenGods.hour]) {
        careers.push({
            category: tenGodCareers[tenGods.hour].category + ' (후반)',
            jobs: tenGodCareers[tenGods.hour].jobs,
            score: 75,
            reason: `시주의 ${tenGods.hour}이 말년의 직업 운을 나타냅니다.`
        });
    }

    // 오행 기반 추천
    const dominantElement = Object.entries(elementCount).sort((a, b) => b[1] - a[1])[0][0];
    const elementCareers: Record<string, string[]> = {
        '목': ['교육', '의류', '출판', '가구', '농업'],
        '화': ['요식업', '전자', '에너지', '엔터테인먼트', '광고'],
        '토': ['부동산', '건설', '농산물', '도자기', '광업'],
        '금': ['금융', '기계', 'IT', '자동차', '보석'],
        '수': ['물류', '무역', '수산', '관광', '음료']
    };

    careers.push({
        category: `${FIVE_ELEMENTS[dominantElement as keyof typeof FIVE_ELEMENTS].name} 산업`,
        jobs: elementCareers[dominantElement] || [],
        score: 70,
        reason: `${FIVE_ELEMENTS[dominantElement as keyof typeof FIVE_ELEMENTS].name} 기운이 강해 관련 산업에 유리합니다.`
    });

    return careers;
}

// 건강 운세 분석
export function analyzeHealth(dayGan: typeof CHEONGAN[number], elementCount: Record<string, number>) {
    const healthInfo: {
        overall: string;
        weakOrgans: string[];
        strongOrgans: string[];
        advice: string[];
        exerciseRecommend: string[];
        foodRecommend: string[];
    } = {
        overall: '',
        weakOrgans: [],
        strongOrgans: [],
        advice: [],
        exerciseRecommend: [],
        foodRecommend: []
    };

    // 오행별 관련 장기와 건강
    const elementHealth: Record<string, { organ: string; weak: string[]; food: string[]; exercise: string[] }> = {
        '목': {
            organ: '간, 담, 눈, 근육',
            weak: ['화면 사용 후 눈 쉬기', '규칙적으로 스트레칭하기', '과로 후 충분히 쉬기'],
            food: ['녹색 채소', '신맛 과일', '씀바귀'],
            exercise: ['스트레칭', '요가', '등산']
        },
        '화': {
            organ: '심장, 소장, 혀',
            weak: ['무리한 활동 피하기', '수면 리듬 살피기', '흥분 후 호흡 가다듬기'],
            food: ['붉은 과일', '토마토', '석류'],
            exercise: ['유산소', '수영', '명상']
        },
        '토': {
            organ: '비장, 위장, 입',
            weak: ['규칙적으로 식사하기', '천천히 먹기', '가벼운 걷기 습관 만들기'],
            food: ['노란 음식', '고구마', '호박'],
            exercise: ['걷기', '골프', '태극권']
        },
        '금': {
            organ: '폐, 대장, 코, 피부',
            weak: ['실내 환기하기', '건조한 환경 살피기', '편안한 호흡 연습하기'],
            food: ['흰색 음식', '배', '무'],
            exercise: ['호흡법', '에어로빅', '수영']
        },
        '수': {
            organ: '신장, 방광, 귀, 뼈',
            weak: ['적절히 수분 섭취하기', '관절에 무리 주지 않기', '오래 앉아 있지 않기'],
            food: ['검은 음식', '검은콩', '미역'],
            exercise: ['수영', '아쿠아로빅', '걷기']
        }
    };

    // 약한 오행 분석
    const sortedElements = Object.entries(elementCount).sort((a, b) => a[1] - b[1]);
    const weakestElement = sortedElements[0][0];
    const strongestElement = sortedElements[sortedElements.length - 1][0];

    const weakHealth = elementHealth[weakestElement];
    const strongHealth = elementHealth[strongestElement];

    healthInfo.weakOrgans = [weakHealth.organ];
    healthInfo.strongOrgans = [strongHealth.organ];
    healthInfo.advice = weakHealth.weak;
    healthInfo.foodRecommend = weakHealth.food;
    healthInfo.exerciseRecommend = weakHealth.exercise;

    healthInfo.overall = `${dayGan.name}(${dayGan.hanja}) 일간과 오행의 전통적 신체 상징을 생활 습관 점검 항목으로 풀었습니다.`;

    return healthInfo;
}

// 재물 운세 분석
export function analyzeWealth(tenGods: Record<string, TenGodType>) {
    const wealthInfo: {
        score: number;
        type: string;
        description: string;
        strengths: string[];
        cautions: string[];
        advice: string;
        luckyBusiness: string[];
    } = {
        score: 50,
        type: '',
        description: '',
        strengths: [],
        cautions: [],
        advice: '',
        luckyBusiness: []
    };

    // 재성(편재, 정재) 분석
    const tenGodValues = Object.values(tenGods);
    const hasJungJae = tenGodValues.includes('정재');
    const hasPyunJae = tenGodValues.includes('편재');
    const hasSikksin = tenGodValues.includes('식신');
    const hasSangGwan = tenGodValues.includes('상관');

    if (hasJungJae && hasPyunJae) {
        wealthInfo.score = 85;
        wealthInfo.type = '복합 재운';
        wealthInfo.description = '정재와 편재를 모두 갖춰 안정적이면서도 기회를 잡는 재물운입니다.';
        wealthInfo.strengths = ['안정적 수입', '투자 감각', '사업 수완'];
    } else if (hasJungJae) {
        wealthInfo.score = 75;
        wealthInfo.type = '안정형 재운';
        wealthInfo.description = '정재가 있어 꾸준하고 안정적인 재물 축적이 가능합니다.';
        wealthInfo.strengths = ['저축 능력', '성실한 수입', '신용도'];
        wealthInfo.cautions = ['큰 투자 주의', '도박성 거래 금지'];
    } else if (hasPyunJae) {
        wealthInfo.score = 70;
        wealthInfo.type = '투자형 재운';
        wealthInfo.description = '편재가 있어 사업과 투자를 통한 재물 획득에 유리합니다.';
        wealthInfo.strengths = ['사업 수완', '투자 감각', '기회 포착'];
        wealthInfo.cautions = ['과욕 주의', '분수 이상 지출 금지'];
    } else if (hasSikksin || hasSangGwan) {
        wealthInfo.score = 65;
        wealthInfo.type = '재능형 재운';
        wealthInfo.description = '식상이 재를 생하니, 재능과 기술로 돈을 법니다.';
        wealthInfo.strengths = ['전문성', '창작 수익', '다재다능'];
    } else {
        wealthInfo.score = 50;
        wealthInfo.type = '노력형 재운';
        wealthInfo.description = '재성이 약하지만 성실함으로 재물을 모을 수 있습니다.';
        wealthInfo.strengths = ['근면', '절약'];
        wealthInfo.cautions = ['투기 절대 금지', '보수적 재테크'];
    }

    // 추천 사업
    wealthInfo.luckyBusiness = ['온라인 비즈니스', '프랜차이즈', '부동산', '주식 장기투자'];
    wealthInfo.advice = wealthInfo.score >= 70
        ? '기회를 볼 때도 비상자금, 손실 가능성, 장기 목표를 함께 점검하세요.'
        : '수입과 지출을 기록하고 감당 가능한 범위에서 재무 목표를 세워보세요.';

    return wealthInfo;
}

// 연애/결혼 운세 분석
export function analyzeLove(dayGan: typeof CHEONGAN[number], tenGods: Record<string, TenGodType>, gender: '남' | '여', zodiacAnimal: string) {
    const loveInfo: {
        score: number;
        style: string;
        description: string;
        idealPartner: string[];
        compatibleZodiac: string[];
        cautions: string[];
        marriageAdvice: string;
        loveKeyword: string[];
    } = {
        score: 50,
        style: '',
        description: '',
        idealPartner: [],
        compatibleZodiac: [],
        cautions: [],
        marriageAdvice: '',
        loveKeyword: []
    };

    // 일간 기반 연애 스타일
    loveInfo.description = getDayMasterInterpretation(dayGan).love;

    // 성별에 따른 십신 분석
    const tenGodValues = Object.values(tenGods);

    if (gender === '남') {
        // 남성: 정재(아내), 편재(연인)
        const hasJungJae = tenGodValues.includes('정재');
        const hasPyunJae = tenGodValues.includes('편재');

        if (hasJungJae) {
            loveInfo.score += 20;
            loveInfo.style = '헌신적 로맨티스트';
            loveInfo.idealPartner.push('현모양처형', '알뜰한 여성', '가정적인 여성');
            loveInfo.loveKeyword.push('안정', '신뢰', '헌신');
        }
        if (hasPyunJae) {
            loveInfo.score += 10;
            loveInfo.style = loveInfo.style || '자유로운 연애파';
            loveInfo.idealPartner.push('활발한 여성', '사업가 타입', '독립적인 여성');
            loveInfo.loveKeyword.push('열정', '자유', '다양성');
            loveInfo.cautions.push('바람기 주의');
        }
    } else {
        // 여성: 정관(남편), 편관(연인)
        const hasJungGwan = tenGodValues.includes('정관');
        const hasPyunGwan = tenGodValues.includes('편관');

        if (hasJungGwan) {
            loveInfo.score += 20;
            loveInfo.style = '품위있는 로맨티스트';
            loveInfo.idealPartner.push('책임감 있는 남성', '사회적 지위', '성실한 남성');
            loveInfo.loveKeyword.push('안정', '품위', '존경');
        }
        if (hasPyunGwan) {
            loveInfo.score += 10;
            loveInfo.style = loveInfo.style || '카리스마에 끌리는 타입';
            loveInfo.idealPartner.push('강인한 남성', '리더 타입', '권위적인 남성');
            loveInfo.loveKeyword.push('열정', '보호', '강인함');
            loveInfo.cautions.push('감정 기복 주의');
        }
    }

    // 식신/상관 (표현력)
    if (tenGodValues.includes('식신') || tenGodValues.includes('상관')) {
        loveInfo.score += 10;
        loveInfo.loveKeyword.push('표현', '감성', '로맨스');
    }

    // 기본값
    if (!loveInfo.style) {
        loveInfo.style = '진중한 연애파';
        loveInfo.score = 60;
    }

    // 띠 궁합
    const zodiacInfo = ZODIAC_DETAILS[zodiacAnimal];
    if (zodiacInfo) {
        loveInfo.compatibleZodiac = zodiacInfo.compatible;
    }

    // 결혼 조언
    loveInfo.marriageAdvice = loveInfo.score >= 70
        ? '결혼운이 좋습니다. 좋은 인연을 만나 행복한 가정을 꾸릴 수 있습니다.'
        : '결혼 전 충분한 교제 기간을 가지세요. 서로를 깊이 이해하는 것이 중요합니다.';

    loveInfo.score = Math.min(100, loveInfo.score);

    return loveInfo;
}

// 전체 사주 계산 (확장)
export function calculateSaju(input: SajuBirthInput) {
    const chart = calculateSajuChart(input);
    const toDisplayPillar = (pillar: SajuPillarValue) => {
        const gan = CHEONGAN.find((item) => item.name === pillar.stem);
        const zhi = JIJI.find((item) => item.name === pillar.branch);
        if (!gan || !zhi) {
            throw new Error(`표시할 수 없는 간지입니다: ${pillar.korean}`);
        }
        return { gan, zhi };
    };

    const yearPillar = toDisplayPillar(chart.pillars.year);
    const monthPillar = toDisplayPillar(chart.pillars.month);
    const dayPillar = toDisplayPillar(chart.pillars.day);
    const hourPillar = toDisplayPillar(chart.pillars.hour);

    const pillars = [yearPillar, monthPillar, dayPillar, hourPillar];
    const elementCount = analyzeElements(pillars);
    const elementRelations = analyzeElementRelations(elementCount);
    const dayMasterInterpretation = getDayMasterInterpretation(dayPillar.gan);

    // 십신 배열
    const tenGods = {
        year: chart.tenGods.year.stem,
        month: chart.tenGods.month.stem,
        day: '비견' as TenGodType, // 일간 자체
        hour: chart.tenGods.hour.stem,
    };

    // 띠 정보
    const zodiac = ZODIAC_DETAILS[yearPillar.zhi.animal];

    // 대운
    const daeun = chart.luckPillars.pillars.map(({ age, pillar }) => ({
        age,
        pillar: toDisplayPillar(pillar),
        startYear: chart.input.year + age,
        endYear: chart.input.year + age + 9,
    }));

    // 올해 운세
    const currentYear = new Date().getFullYear();
    const yearlyFortune = calculateYearlyFortune(currentYear, dayPillar.gan);

    // 오늘 운세
    const todayFortune = getTodayFortune(dayPillar.gan);

    // Phase 3: 상세 분석
    const careerAptitude = analyzeCareerAptitude(dayPillar.gan, tenGods, elementCount);
    const healthFortune = analyzeHealth(dayPillar.gan, elementCount);
    const wealthFortune = analyzeWealth(tenGods);
    const loveFortune = analyzeLove(dayPillar.gan, tenGods, input.gender, yearPillar.zhi.animal);

    return {
        // 기본 사주
        yearPillar,
        monthPillar,
        dayPillar,
        hourPillar,

        // 분석
        elementCount,
        elementRelations,
        dayMasterInterpretation,
        dayMaster: dayPillar.gan,

        // 십신
        tenGods,

        // 띠
        zodiac,
        zodiacAnimal: yearPillar.zhi.animal,

        // 운세
        daeun,
        luckPillarInfo: {
            forward: chart.luckPillars.forward,
            startAge: chart.luckPillars.startAge,
            startYears: chart.luckPillars.startYears,
            startMonths: chart.luckPillars.startMonths,
            startDays: chart.luckPillars.startDays,
        },
        yearlyFortune,
        todayFortune,

        // Phase 3: 상세 분석
        careerAptitude,
        healthFortune,
        wealthFortune,
        loveFortune,

        // 메타 정보
        gender: input.gender,
        birthInfo: chart.input,
        calculationMetadata: chart.metadata,
        voidBranches: chart.voidBranches,
    };
}

