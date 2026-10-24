import type { SavedSajuV2, SajuBirthInput } from './types';

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

function isGender(value: unknown): value is SajuBirthInput['gender'] {
  return value === '남' || value === '여';
}

function isValidBirthDate(value: unknown, calendar: unknown): value is string {
  if (typeof value !== 'string') return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1800 || month < 1 || month > 12 || day < 1) return false;

  if (calendar === 'lunar') return year <= 2100 && day <= 30;
  if (calendar !== 'solar' || year > 2300) return false;

  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function isValidBirthTime(value: unknown): value is string | null {
  if (value === null) return true;
  if (typeof value !== 'string') return false;
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  return Boolean(match && Number(match[1]) <= 23 && Number(match[2]) <= 59);
}

function isBirthInput(value: unknown): value is SajuBirthInput {
  if (!isRecord(value)) return false;

  return (
    (value.calendar === 'solar' || value.calendar === 'lunar') &&
    isValidBirthDate(value.birthDate, value.calendar) &&
    isValidBirthTime(value.birthTime) &&
    typeof value.isLeapMonth === 'boolean' &&
    (value.calendar === 'lunar' || !value.isLeapMonth) &&
    isGender(value.gender) &&
    (value.dayBoundary === 'midnight' || value.dayBoundary === 'jasi' || value.dayBoundary === 'splitJasi') &&
    typeof value.trueSolarTimeEnabled === 'boolean' &&
    typeof value.longitude === 'number' &&
    Number.isFinite(value.longitude) &&
    value.longitude >= -180 &&
    value.longitude <= 180
  );
}

function isSavedSajuV2(value: unknown): value is SavedSajuV2 {
  if (!isRecord(value)) return false;

  return (
    value.version === 2 &&
    typeof value.id === 'string' &&
    value.id.length > 0 &&
    typeof value.name === 'string' &&
    value.name.trim().length > 0 &&
    typeof value.savedAt === 'string' &&
    isBirthInput(value.input)
  );
}

function migrateLegacy(value: unknown): SavedSajuV2 | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.id !== 'string' ||
    typeof value.name !== 'string' ||
    typeof value.birthDate !== 'string' ||
    typeof value.birthHour !== 'string' ||
    !isGender(value.gender) ||
    typeof value.savedAt !== 'string'
  ) {
    return null;
  }

  const parsedHour = Number.parseInt(value.birthHour, 10);
  if (!Number.isInteger(parsedHour) || parsedHour < 0 || parsedHour > 23) return null;

  return {
    version: 2,
    id: value.id,
    name: value.name,
    savedAt: value.savedAt,
    input: {
      birthDate: value.birthDate,
      birthTime: `${String(parsedHour).padStart(2, '0')}:00`,
      calendar: 'solar',
      isLeapMonth: false,
      gender: value.gender,
      dayBoundary: 'midnight',
      trueSolarTimeEnabled: false,
      longitude: 126.978,
    },
  };
}

export function parseSavedSajuList(raw: string | null): SavedSajuV2[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.flatMap((item) => {
      if (isSavedSajuV2(item)) return [item];
      const migrated = migrateLegacy(item);
      return migrated ? [migrated] : [];
    });
  } catch {
    return [];
  }
}

export function serializeSavedSajuList(list: SavedSajuV2[]): string {
  return JSON.stringify(list.filter(isSavedSajuV2));
}
