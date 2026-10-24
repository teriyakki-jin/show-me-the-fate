import { describe, expect, it } from 'vitest';

import { calculateSajuChart } from './engine';

const baseInput = {
  birthDate: '1992-10-24',
  birthTime: '05:30',
  calendar: 'solar' as const,
  isLeapMonth: false,
  gender: '남' as const,
  dayBoundary: 'midnight' as const,
  trueSolarTimeEnabled: false,
  longitude: 126.978,
};

describe('calculateSajuChart', () => {
  it('검증된 기준 사주를 계산한다', () => {
    const chart = calculateSajuChart(baseInput);

    expect([
      chart.pillars.year.korean,
      chart.pillars.month.korean,
      chart.pillars.day.korean,
      chart.pillars.hour.korean,
    ]).toEqual(['임신', '경술', '계유', '을묘']);
    expect(chart.pillars.year.hanja).toBe('壬申');
    expect(chart.metadata.timeKnown).toBe(true);
  });

  it('입춘 절입 전후를 분 단위로 구분한다', () => {
    const before = calculateSajuChart({
      ...baseInput,
      birthDate: '2024-02-04',
      birthTime: '17:26',
    });
    const after = calculateSajuChart({
      ...baseInput,
      birthDate: '2024-02-04',
      birthTime: '17:28',
    });

    expect(before.pillars.year.korean).toBe('계묘');
    expect(after.pillars.year.korean).toBe('갑진');
  });

  it('자시 관법을 명시적으로 적용한다', () => {
    const midnight = calculateSajuChart({
      ...baseInput,
      birthDate: '2024-03-10',
      birthTime: '23:30',
      dayBoundary: 'midnight',
    });
    const jasi = calculateSajuChart({
      ...baseInput,
      birthDate: '2024-03-10',
      birthTime: '23:30',
      dayBoundary: 'jasi',
    });

    expect(midnight.pillars.day.korean).toBe('계유');
    expect(midnight.pillars.hour.korean).toBe('임자');
    expect(jasi.pillars.day.korean).toBe('갑술');
    expect(jasi.pillars.hour.korean).toBe('갑자');
  });

  it('음력과 윤달 입력을 계산 엔진에 전달한다', () => {
    const lunar = calculateSajuChart({
      ...baseInput,
      birthDate: '1992-09-29',
      calendar: 'lunar',
    });

    expect([
      lunar.pillars.year.korean,
      lunar.pillars.month.korean,
      lunar.pillars.day.korean,
      lunar.pillars.hour.korean,
    ]).toEqual(['임신', '경술', '계유', '을묘']);
  });

  it('개인별 대운 방향과 시작 나이를 반환한다', () => {
    const male = calculateSajuChart(baseInput);
    const female = calculateSajuChart({ ...baseInput, gender: '여' });

    expect(male.luckPillars.forward).not.toBe(female.luckPillars.forward);
    expect(male.luckPillars.startAge).toBeGreaterThanOrEqual(1);
    expect(male.luckPillars.pillars).toHaveLength(10);
    expect(male.luckPillars.pillars[0].age).toBe(male.luckPillars.startAge);
  });

  it('출생 시간을 모르면 정오를 사용하고 불확실성을 표시한다', () => {
    const chart = calculateSajuChart({ ...baseInput, birthTime: null });

    expect(chart.metadata.timeKnown).toBe(false);
    expect(chart.metadata.hourPillarReliable).toBe(false);
    expect(chart.input.hour).toBe(12);
    expect(chart.input.minute).toBe(0);
  });

  it('진태양시 보정 사용 여부와 경도를 기록한다', () => {
    const chart = calculateSajuChart({
      ...baseInput,
      birthDate: '1990-05-15',
      birthTime: '07:05',
      trueSolarTimeEnabled: true,
      longitude: 126.978,
    });

    expect(chart.metadata.trueSolarTimeApplied).toBe(true);
    expect(chart.metadata.longitude).toBe(126.978);
    expect(chart.pillars.hour.korean.endsWith('묘')).toBe(true);
  });

  it.each([
    [{ ...baseInput, birthDate: '2024-02-31' }, '실재하지 않는'],
    [{ ...baseInput, birthDate: '1799-12-31' }, '1800'],
    [{ ...baseInput, birthDate: '2999-01-01' }, '미래'],
    [{ ...baseInput, birthTime: '24:00' }, '시간'],
    [{ ...baseInput, longitude: 181, trueSolarTimeEnabled: true }, '경도'],
  ])('잘못된 입력을 설명 가능한 오류로 거부한다', (input, message) => {
    expect(() => calculateSajuChart(input)).toThrow(message);
  });
});
