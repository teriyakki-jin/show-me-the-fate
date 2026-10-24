import { describe, expect, it } from 'vitest';

import { parseSavedSajuList, serializeSavedSajuList } from './storage';

describe('saved saju storage', () => {
  it('손상된 JSON은 빈 목록으로 복구한다', () => {
    expect(parseSavedSajuList('{broken')).toEqual([]);
  });

  it('예전 저장 형식을 v2 입력 형식으로 마이그레이션한다', () => {
    const legacy = JSON.stringify([
      {
        id: '1',
        name: '내 사주',
        birthDate: '1992-10-24',
        birthHour: '5',
        gender: '남',
        savedAt: '2026-02-06T00:00:00.000Z',
      },
    ]);

    expect(parseSavedSajuList(legacy)).toEqual([
      expect.objectContaining({
        version: 2,
        id: '1',
        name: '내 사주',
        input: expect.objectContaining({
          birthDate: '1992-10-24',
          birthTime: '05:00',
          calendar: 'solar',
          gender: '남',
        }),
      }),
    ]);
  });

  it('유효하지 않은 항목은 제외하고 유효한 v2 항목만 직렬화한다', () => {
    const list = parseSavedSajuList(
      JSON.stringify([
        null,
        { version: 2, id: '', name: '잘못됨' },
        {
          version: 2,
          id: '2',
          name: '테스트',
          savedAt: '2026-10-24T00:00:00.000Z',
          input: {
            birthDate: '2000-01-01',
            birthTime: null,
            calendar: 'solar',
            isLeapMonth: false,
            gender: '여',
            dayBoundary: 'midnight',
            trueSolarTimeEnabled: false,
            longitude: 126.978,
          },
        },
      ]),
    );

    expect(list).toHaveLength(1);
    expect(JSON.parse(serializeSavedSajuList(list))).toEqual(list);
  });

  it('형식만 비슷한 잘못된 날짜와 시간은 저장 데이터로 받아들이지 않는다', () => {
    const invalidItems = [
      {
        version: 2,
        id: 'bad-date',
        name: '잘못된 날짜',
        savedAt: '2026-10-24T00:00:00.000Z',
        input: {
          birthDate: 'not-a-date',
          birthTime: '12:00',
          calendar: 'solar',
          isLeapMonth: false,
          gender: '남',
          dayBoundary: 'midnight',
          trueSolarTimeEnabled: false,
          longitude: 126.978,
        },
      },
      {
        version: 2,
        id: 'bad-time',
        name: '잘못된 시간',
        savedAt: '2026-10-24T00:00:00.000Z',
        input: {
          birthDate: '2000-01-01',
          birthTime: '25:00',
          calendar: 'solar',
          isLeapMonth: false,
          gender: '여',
          dayBoundary: 'midnight',
          trueSolarTimeEnabled: false,
          longitude: 126.978,
        },
      },
    ];

    expect(parseSavedSajuList(JSON.stringify(invalidItems))).toEqual([]);
  });

  it('음력에서 가능한 30일 입력을 양력 날짜 규칙으로 잘못 거부하지 않는다', () => {
    const lunar = {
      version: 2,
      id: 'lunar-date',
      name: '음력 생일',
      savedAt: '2026-10-24T00:00:00.000Z',
      input: {
        birthDate: '2000-02-30',
        birthTime: '12:00',
        calendar: 'lunar',
        isLeapMonth: false,
        gender: '남',
        dayBoundary: 'midnight',
        trueSolarTimeEnabled: false,
        longitude: 126.978,
      },
    };

    expect(parseSavedSajuList(JSON.stringify([lunar]))).toHaveLength(1);
  });
});
