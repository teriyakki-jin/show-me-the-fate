import {
  EARTHLY_BRANCHES,
  EARTHLY_BRANCHES_HANJA,
  HEAVENLY_STEMS,
  HEAVENLY_STEMS_HANJA,
  calculateFourPillars,
  type FourPillarsDetail,
  type Pillar,
} from 'manseryeok';

import type { SajuBirthInput, SajuChart, SajuPillarValue } from './types';

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_PATTERN = /^(\d{2}):(\d{2})$/;

function parseDate(value: string): { year: number; month: number; day: number } {
  const match = DATE_PATTERN.exec(value);
  if (!match) {
    throw new RangeError('생년월일은 YYYY-MM-DD 형식이어야 합니다.');
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

function parseTime(value: string | null): {
  hour: number;
  minute: number;
  timeKnown: boolean;
} {
  if (value === null) {
    return { hour: 12, minute: 0, timeKnown: false };
  }

  const match = TIME_PATTERN.exec(value);
  if (!match) {
    throw new RangeError('출생 시간은 HH:mm 형식이어야 합니다.');
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) {
    throw new RangeError('출생 시간은 00:00부터 23:59 사이여야 합니다.');
  }

  return { hour, minute, timeKnown: true };
}

function assertSupportedInput(input: SajuBirthInput, year: number): void {
  const now = new Date();
  const currentYear = now.getFullYear();
  const localToday = [
    currentYear,
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
  if (year > currentYear || (year === currentYear && input.birthDate > localToday)) {
    throw new RangeError('미래의 생년월일은 입력할 수 없습니다.');
  }

  const maxYear = input.calendar === 'lunar' ? 2100 : 2300;
  if (year < 1800 || year > maxYear) {
    throw new RangeError(`지원 연도는 1800년부터 ${maxYear}년까지입니다.`);
  }

  if (input.trueSolarTimeEnabled && (!Number.isFinite(input.longitude) || input.longitude < -180 || input.longitude > 180)) {
    throw new RangeError('경도는 -180도부터 180도 사이여야 합니다.');
  }
}

function pillarToValue(pillar: Pillar): SajuPillarValue {
  const stemIndex = HEAVENLY_STEMS.indexOf(pillar.heavenlyStem);
  const branchIndex = EARTHLY_BRANCHES.indexOf(pillar.earthlyBranch);

  return {
    stem: pillar.heavenlyStem,
    branch: pillar.earthlyBranch,
    korean: `${pillar.heavenlyStem}${pillar.earthlyBranch}`,
    hanja: `${HEAVENLY_STEMS_HANJA[stemIndex]}${EARTHLY_BRANCHES_HANJA[branchIndex]}`,
  };
}

function requireLuckPillars(result: FourPillarsDetail): NonNullable<FourPillarsDetail['luckPillars']> {
  if (!result.luckPillars) {
    throw new Error('성별을 지정했지만 대운 계산 결과가 없습니다.');
  }
  return result.luckPillars;
}

export function calculateSajuChart(input: SajuBirthInput): SajuChart {
  const { year, month, day } = parseDate(input.birthDate);
  const { hour, minute, timeKnown } = parseTime(input.birthTime);
  assertSupportedInput(input, year);

  let result: FourPillarsDetail;
  try {
    result = calculateFourPillars({
      year,
      month,
      day,
      hour,
      minute,
      isLunar: input.calendar === 'lunar',
      isLeapMonth: input.calendar === 'lunar' && input.isLeapMonth,
      gender: input.gender === '남' ? 'male' : 'female',
      dayBoundary: input.dayBoundary,
      trueSolarTime: input.trueSolarTimeEnabled
        ? {
            longitude: input.longitude,
            applyEquationOfTime: true,
            applyHistoricalDst: true,
          }
        : undefined,
    });
  } catch (error) {
    if (error instanceof RangeError) {
      throw new RangeError(`실재하지 않는 날짜이거나 지원하지 않는 입력입니다: ${error.message}`);
    }
    throw error;
  }

  const luckPillars = requireLuckPillars(result);

  return {
    pillars: {
      year: pillarToValue(result.year),
      month: pillarToValue(result.month),
      day: pillarToValue(result.day),
      hour: pillarToValue(result.hour),
    },
    tenGods: result.tenGods,
    voidBranches: [...result.voidBranches],
    luckPillars: {
      forward: luckPillars.forward,
      startAge: luckPillars.startAge,
      startYears: luckPillars.startYears,
      startMonths: luckPillars.startMonths,
      startDays: luckPillars.startDays,
      pillars: luckPillars.pillars.map((item) => ({
        age: item.age,
        pillar: pillarToValue(item.pillar),
      })),
    },
    input: { year, month, day, hour, minute },
    metadata: {
      calendar: input.calendar,
      timeKnown,
      hourPillarReliable: timeKnown,
      trueSolarTimeApplied: input.trueSolarTimeEnabled,
      longitude: input.trueSolarTimeEnabled ? input.longitude : null,
      dayBoundary: input.dayBoundary,
      convention: '한국 표준시·절기 기준, 대운수는 인접 절기까지의 일수÷3 반올림',
    },
  };
}
