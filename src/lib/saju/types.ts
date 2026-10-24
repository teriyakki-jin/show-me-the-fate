import type { DayBoundary, TenGodChart } from 'manseryeok';

export type SajuCalendar = 'solar' | 'lunar';
export type SajuGender = '남' | '여';

export interface SajuBirthInput {
  birthDate: string;
  birthTime: string | null;
  calendar: SajuCalendar;
  isLeapMonth: boolean;
  gender: SajuGender;
  dayBoundary: DayBoundary;
  trueSolarTimeEnabled: boolean;
  longitude: number;
}

export interface SajuPillarValue {
  stem: string;
  branch: string;
  korean: string;
  hanja: string;
}

export interface SajuLuckPillar {
  age: number;
  pillar: SajuPillarValue;
}

export interface SajuChart {
  pillars: {
    year: SajuPillarValue;
    month: SajuPillarValue;
    day: SajuPillarValue;
    hour: SajuPillarValue;
  };
  tenGods: TenGodChart;
  voidBranches: string[];
  luckPillars: {
    forward: boolean;
    startAge: number;
    startYears: number;
    startMonths: number;
    startDays: number;
    pillars: SajuLuckPillar[];
  };
  input: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
  };
  metadata: {
    calendar: SajuCalendar;
    timeKnown: boolean;
    hourPillarReliable: boolean;
    trueSolarTimeApplied: boolean;
    longitude: number | null;
    dayBoundary: DayBoundary;
    convention: string;
  };
}

export interface SavedSajuV2 {
  version: 2;
  id: string;
  name: string;
  input: SajuBirthInput;
  savedAt: string;
}

export const DEFAULT_BIRTH_INPUT: SajuBirthInput = {
  birthDate: '',
  birthTime: '12:00',
  calendar: 'solar',
  isLeapMonth: false,
  gender: '남',
  dayBoundary: 'midnight',
  trueSolarTimeEnabled: false,
  longitude: 126.978,
};
