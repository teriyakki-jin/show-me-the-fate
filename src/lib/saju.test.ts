import { describe, expect, it } from 'vitest';

import { calculateSaju } from './saju';

describe('calculateSaju integration', () => {
  it('정밀 계산 엔진 결과를 화면용 해석 모델에 연결한다', () => {
    const result = calculateSaju({
      birthDate: '1992-10-24',
      birthTime: '05:30',
      calendar: 'solar',
      isLeapMonth: false,
      gender: '남',
      dayBoundary: 'midnight',
      trueSolarTimeEnabled: false,
      longitude: 126.978,
    });

    expect([
      `${result.yearPillar.gan.name}${result.yearPillar.zhi.name}`,
      `${result.monthPillar.gan.name}${result.monthPillar.zhi.name}`,
      `${result.dayPillar.gan.name}${result.dayPillar.zhi.name}`,
      `${result.hourPillar.gan.name}${result.hourPillar.zhi.name}`,
    ]).toEqual(['임신', '경술', '계유', '을묘']);
    expect(result.daeun).toHaveLength(10);
    expect(result.luckPillarInfo.startAge).toBe(result.daeun[0].age);
    expect(result.calculationMetadata.convention).toContain('절기');
  });

  it('출생시간 미상 상태를 결과까지 보존한다', () => {
    const result = calculateSaju({
      birthDate: '2000-01-01',
      birthTime: null,
      calendar: 'solar',
      isLeapMonth: false,
      gender: '여',
      dayBoundary: 'midnight',
      trueSolarTimeEnabled: false,
      longitude: 126.978,
    });

    expect(result.calculationMetadata.timeKnown).toBe(false);
    expect(result.birthInfo.hour).toBe(12);
  });
});
