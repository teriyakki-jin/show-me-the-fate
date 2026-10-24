'use client';

import { useState, useEffect } from 'react';
import { calculateSaju, FIVE_ELEMENTS, TEN_GODS, calculateCompatibility } from '@/lib/saju';
import { parseSavedSajuList, serializeSavedSajuList } from '@/lib/saju/storage';
import { DEFAULT_BIRTH_INPUT, type SavedSajuV2, type SajuBirthInput } from '@/lib/saju/types';
import { ResultTabs, type ResultTabId } from '@/components/ResultTabs';
import { SafetyNotice } from '@/components/SafetyNotice';
import { SavedSajuList } from '@/components/SavedSajuList';

const STORAGE_KEY = 'savedSajuList';

function formatKoreanDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  return `${year}년 ${month}월 ${day}일`;
}

function formatDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function Home() {
  const [birthDate, setBirthDate] = useState(DEFAULT_BIRTH_INPUT.birthDate);
  const [birthTime, setBirthTime] = useState(DEFAULT_BIRTH_INPUT.birthTime ?? '12:00');
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [gender, setGender] = useState<'남' | '여'>('남');
  const [calendar, setCalendar] = useState<'solar' | 'lunar'>('solar');
  const [isLeapMonth, setIsLeapMonth] = useState(false);
  const [dayBoundary, setDayBoundary] = useState<SajuBirthInput['dayBoundary']>('midnight');
  const [trueSolarTimeEnabled, setTrueSolarTimeEnabled] = useState(false);
  const [longitude, setLongitude] = useState(126.978);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formError, setFormError] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calculateSaju> | null>(null);
  const [activeTab, setActiveTab] = useState<ResultTabId>('basic');

  // 저장 기능
  const [savedList, setSavedList] = useState<SavedSajuV2[]>([]);
  const [saveName, setSaveName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  // 궁합 기능
  const [partner, setPartner] = useState<{ birthDate: string; birthTime: string; gender: '남' | '여' }>({
    birthDate: '',
    birthTime: '12:00',
    gender: '여'
  });
  const [compatibilityResult, setCompatibilityResult] = useState<ReturnType<typeof calculateCompatibility> | null>(null);
  const [compatibilityError, setCompatibilityError] = useState('');

  // 저장된 사주 불러오기
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSavedList(parseSavedSajuList(localStorage.getItem(STORAGE_KEY)));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const getCurrentInput = (): SajuBirthInput => ({
    birthDate,
    birthTime: timeUnknown ? null : birthTime,
    calendar,
    isLeapMonth: calendar === 'lunar' && isLeapMonth,
    gender,
    dayBoundary,
    trueSolarTimeEnabled,
    longitude,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) return;

    try {
      setFormError('');
      setResult(calculateSaju(getCurrentInput()));
      setActiveTab('basic');
    } catch (error) {
      setFormError(error instanceof Error ? error.message : '사주를 계산하지 못했습니다.');
    }
  };

  const handleSave = () => {
    if (!saveName.trim() || !result) return;

    const newSaved: SavedSajuV2 = {
      version: 2,
      id: Date.now().toString(),
      name: saveName.trim(),
      input: getCurrentInput(),
      savedAt: new Date().toISOString()
    };

    const newList = [...savedList, newSaved];
    setSavedList(newList);
    localStorage.setItem(STORAGE_KEY, serializeSavedSajuList(newList));
    setSaveName('');
    setShowSaveModal(false);
  };

  const handleLoadSaved = (saved: SavedSajuV2) => {
    const input = saved.input;
    setBirthDate(input.birthDate);
    setBirthTime(input.birthTime ?? '12:00');
    setTimeUnknown(input.birthTime === null);
    setGender(input.gender);
    setCalendar(input.calendar);
    setIsLeapMonth(input.isLeapMonth);
    setDayBoundary(input.dayBoundary);
    setTrueSolarTimeEnabled(input.trueSolarTimeEnabled);
    setLongitude(input.longitude);
    setResult(calculateSaju(input));
    setActiveTab('basic');
  };

  const handleDeleteSaved = (id: string) => {
    const newList = savedList.filter(s => s.id !== id);
    setSavedList(newList);
    localStorage.setItem(STORAGE_KEY, serializeSavedSajuList(newList));
  };

  const handleCompatibility = () => {
    if (!result || !partner.birthDate) return;

    try {
      setCompatibilityError('');
      const partnerSaju = calculateSaju({
        ...DEFAULT_BIRTH_INPUT,
        birthDate: partner.birthDate,
        birthTime: partner.birthTime,
        gender: partner.gender,
      });

      const compatibility = calculateCompatibility(
        { dayGan: result.dayMaster, yearZhi: result.yearPillar.zhi },
        { dayGan: partnerSaju.dayMaster, yearZhi: partnerSaju.yearPillar.zhi }
      );

      setCompatibilityResult(compatibility);
    } catch (error) {
      setCompatibilityResult(null);
      setCompatibilityError(error instanceof Error ? error.message : '궁합을 계산하지 못했습니다.');
    }
  };

  const getElementClass = (element: string) => {
    const classes: Record<string, string> = {
      목: 'element-wood bg-element-wood',
      화: 'element-fire bg-element-fire',
      토: 'element-earth bg-element-earth',
      금: 'element-metal bg-element-metal',
      수: 'element-water bg-element-water',
    };
    return classes[element] || '';
  };

  return (
    <>
      <div className="aurora-bg" />
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
        {!result ? (
          // Input Form
          <div className="glass-card p-8 sm:p-12 max-w-lg w-full fade-in">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4 float-animation">🌙</div>
              <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-3">
                사주팔자
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                절기 기준 사주 원국과 전통 명리 해석을 확인해 보세요
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <fieldset className="fade-in fade-in-delay-1">
                <legend className="block text-sm font-medium text-gray-300 mb-2">달력 기준</legend>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    ['solar', '☀️ 양력'],
                    ['lunar', '🌙 음력'],
                  ] as const).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        if (calendar !== value) setBirthDate('');
                        setCalendar(value);
                        if (value === 'solar') setIsLeapMonth(false);
                      }}
                      className={`py-3 rounded-xl border transition-all ${calendar === value
                          ? 'border-purple-500 bg-purple-500/20 text-white'
                          : 'border-gray-700 bg-gray-800/50 text-gray-400'
                        }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="fade-in fade-in-delay-1">
                <label htmlFor="birth-date" className="block text-sm font-medium text-gray-300 mb-2">
                  생년월일
                </label>
                {calendar === 'solar' ? (
                  <input
                    id="birth-date"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="input-field"
                    min="1800-01-01"
                    max={formatDateInputValue(new Date())}
                    required
                  />
                ) : (
                  <>
                    <input
                      id="birth-date"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                      placeholder="예: 1992-09-29"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="input-field"
                      maxLength={10}
                      required
                    />
                    <p className="mt-2 text-xs text-gray-500">음력 날짜를 YYYY-MM-DD 형식으로 입력하세요.</p>
                  </>
                )}
                {calendar === 'lunar' && (
                  <label className="mt-3 flex items-center gap-2 text-sm text-gray-400">
                    <input
                      type="checkbox"
                      checked={isLeapMonth}
                      onChange={(e) => setIsLeapMonth(e.target.checked)}
                      className="accent-purple-500"
                    />
                    윤달로 입력
                  </label>
                )}
              </div>

              <div className="fade-in fade-in-delay-2">
                <label htmlFor="birth-time" className="block text-sm font-medium text-gray-300 mb-2">
                  태어난 시간
                </label>
                <input
                  id="birth-time"
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="input-field"
                  disabled={timeUnknown}
                  required={!timeUnknown}
                />
                <label className="mt-3 flex items-center gap-2 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    checked={timeUnknown}
                    onChange={(e) => setTimeUnknown(e.target.checked)}
                    className="accent-purple-500"
                  />
                  출생 시간을 모릅니다
                </label>
              </div>

              <div className="fade-in fade-in-delay-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  성별
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setGender('남')}
                    className={`flex-1 py-3 px-4 rounded-xl border transition-all ${gender === '남'
                        ? 'border-purple-500 bg-purple-500/20 text-white'
                        : 'border-gray-700 bg-gray-800/50 text-gray-400'
                      }`}
                  >
                    👨 남성
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('여')}
                    className={`flex-1 py-3 px-4 rounded-xl border transition-all ${gender === '여'
                        ? 'border-pink-500 bg-pink-500/20 text-white'
                        : 'border-gray-700 bg-gray-800/50 text-gray-400'
                      }`}
                  >
                    👩 여성
                  </button>
                </div>
              </div>

              <div className="fade-in fade-in-delay-3">
                <button
                  type="button"
                  onClick={() => setShowAdvanced((value) => !value)}
                  className="w-full flex items-center justify-between text-sm text-gray-400 hover:text-white"
                  aria-expanded={showAdvanced}
                >
                  <span>고급 계산 설정</span>
                  <span>{showAdvanced ? '−' : '+'}</span>
                </button>
                {showAdvanced && (
                  <div className="mt-4 space-y-4 rounded-xl border border-gray-700 bg-gray-900/40 p-4">
                    <div>
                      <label htmlFor="day-boundary" className="block text-xs text-gray-400 mb-2">23시 자시 관법</label>
                      <select
                        id="day-boundary"
                        value={dayBoundary}
                        onChange={(e) => setDayBoundary(e.target.value as SajuBirthInput['dayBoundary'])}
                        className="input-field py-3 text-sm"
                      >
                        <option value="midnight" className="bg-gray-900">자정 기준 — 일주는 00시에 변경</option>
                        <option value="jasi" className="bg-gray-900">야자시 — 23시부터 다음 일주</option>
                        <option value="splitJasi" className="bg-gray-900">분리 자시 — 시주 천간만 다음날 기준</option>
                      </select>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={trueSolarTimeEnabled}
                        onChange={(e) => setTrueSolarTimeEnabled(e.target.checked)}
                        className="accent-purple-500"
                      />
                      출생지 경도로 진태양시 보정
                    </label>
                    {trueSolarTimeEnabled && (
                      <div>
                        <label htmlFor="longitude" className="block text-xs text-gray-400 mb-2">출생지 경도 (서울 126.978°)</label>
                        <input
                          id="longitude"
                          type="number"
                          min="-180"
                          max="180"
                          step="0.001"
                          value={longitude}
                          onChange={(e) => setLongitude(Number(e.target.value))}
                          className="input-field py-3 text-sm"
                        />
                      </div>
                    )}
                    <p className="text-xs leading-relaxed text-gray-500">
                      관법에 따라 자시와 대운 시작 시점은 다르게 해석될 수 있습니다. 기본값은 한국 표준시와 자정 경계입니다.
                    </p>
                  </div>
                )}
              </div>

              {formError && (
                <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                  {formError}
                </div>
              )}

              <button
                type="submit"
                className="btn-primary w-full mt-8 fade-in fade-in-delay-3"
              >
                사주 보기 ✨
              </button>
            </form>

            <div className="mt-6">
              <SafetyNotice />
            </div>

            <SavedSajuList items={savedList} onLoad={handleLoadSaved} onDelete={handleDeleteSaved} />
          </div>
        ) : (
          // Result Display
          <div className="max-w-5xl w-full space-y-6">
            {/* Header */}
            <div className="text-center fade-in mb-4">
              <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
                사주 분석 결과
              </h1>
              <p className="text-gray-400">
                {formatKoreanDate(birthDate)} · {calendar === 'lunar' ? '음력' : '양력'} · {gender === '남' ? '남성' : '여성'}
              </p>
              <p className="mt-2 text-xs text-gray-500">
                {result.calculationMetadata.convention}
                {!result.calculationMetadata.timeKnown && ' · 출생시간 미상으로 정오 기준 시주'}
              </p>
              {/* 저장 버튼 */}
              <button
                onClick={() => setShowSaveModal(true)}
                className="mt-3 px-4 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg hover:border-purple-500 transition-all"
              >
                💾 저장하기
              </button>
            </div>

            <ResultTabs activeTab={activeTab} onChange={setActiveTab} />

            {/* Tab Content */}
            {activeTab === 'basic' && (
              <div className="space-y-6 fade-in">
                {/* Four Pillars */}
                <div className="glass-card p-6 sm:p-8">
                  <h2 className="text-xl font-semibold mb-6 text-center">사주팔자 (四柱八字)</h2>
                  <div className="grid grid-cols-4 gap-3 sm:gap-4">
                    {[
                      { label: '시주', pillar: result.hourPillar },
                      { label: '일주', pillar: result.dayPillar },
                      { label: '월주', pillar: result.monthPillar },
                      { label: '연주', pillar: result.yearPillar },
                    ].map(({ label, pillar }, index) => (
                      <div key={label} className={`pillar-card p-4 sm:p-6 text-center fade-in fade-in-delay-${index + 1}`}>
                        <div className="text-xs sm:text-sm text-gray-400 mb-3">{label}</div>
                        <div className="space-y-2">
                          <div className="text-2xl sm:text-4xl font-bold" style={{ color: pillar.gan.color }}>
                            {pillar.gan.hanja}
                          </div>
                          <div className="text-2xl sm:text-4xl font-bold" style={{ color: pillar.zhi.color }}>
                            {pillar.zhi.hanja}
                          </div>
                        </div>
                        <div className="mt-3 space-y-1">
                          <div className="text-xs sm:text-sm text-gray-300">{pillar.gan.name}{pillar.zhi.name}</div>
                          <div className={`element-badge inline-block ${getElementClass(pillar.gan.element)}`}>
                            {pillar.gan.element}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Day Master */}
                <div className="glass-card p-6 sm:p-8">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span className="text-2xl">👤</span>
                    일간 ({result.dayMaster.name}{result.dayMaster.hanja}) 분석
                  </h2>
                  <div className={`element-badge inline-block ${getElementClass(result.dayMaster.element)} mb-4`}>
                    {FIVE_ELEMENTS[result.dayMaster.element as keyof typeof FIVE_ELEMENTS].name}
                  </div>
                  <div className="text-lg font-medium text-purple-300 mb-2">
                    {result.dayMasterInterpretation.short}
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {result.dayMasterInterpretation.long}
                  </p>
                </div>

                {/* Element Analysis */}
                <div className="glass-card p-6 sm:p-8">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span className="text-2xl">☯️</span>
                    8글자 기준 오행 분포
                  </h2>
                  <p className="mb-5 text-xs leading-relaxed text-gray-500">
                    천간과 지지의 대표 오행을 같은 비중으로 센 참고 지표입니다. 월령·지장간 가중 분석과는 구분됩니다.
                  </p>
                  <div className="space-y-4">
                    {Object.entries(result.elementCount).map(([element, count]) => {
                      const info = FIVE_ELEMENTS[element as keyof typeof FIVE_ELEMENTS];
                      const percentage = (count / 8) * 100;
                      return (
                        <div key={element} className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className={`font-medium ${getElementClass(element).split(' ')[0]}`}>
                              {info.name}
                            </span>
                            <span className="text-gray-400">{count}개</span>
                          </div>
                          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${info.gradient} transition-all duration-1000`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'zodiac' && result.zodiac && (
              <div className="space-y-6 fade-in">
                <div className="glass-card p-6 sm:p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-6xl">{result.zodiac.emoji}</div>
                    <div>
                      <h2 className="text-2xl font-bold">{result.zodiacAnimal}띠</h2>
                      <p className="text-gray-400">{result.yearPillar.zhi.name}({result.yearPillar.zhi.hanja})</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-purple-400">✨ 성격</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.zodiac.traits.map((trait, i) => (
                          <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">{trait}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-green-400">💪 강점</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.zodiac.strengths.map((s, i) => (
                          <span key={i} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tenGods' && (
              <div className="space-y-6 fade-in">
                <div className="glass-card p-6 sm:p-8">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    십신 (十神) 배치
                  </h2>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: '시주', tenGod: result.tenGods.hour },
                      { label: '일주', tenGod: result.tenGods.day },
                      { label: '월주', tenGod: result.tenGods.month },
                      { label: '연주', tenGod: result.tenGods.year },
                    ].map(({ label, tenGod }) => {
                      const godInfo = TEN_GODS[tenGod];
                      return (
                        <div key={label} className="pillar-card p-4 text-center">
                          <div className="text-xs text-gray-400 mb-2">{label}</div>
                          <div className="text-lg font-bold text-purple-400">{tenGod}</div>
                          <div className="text-xs text-gray-500 mt-1">{godInfo.hanja}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'fortune' && (
              <div className="space-y-6 fade-in">
                {/* Today */}
                <div className="glass-card p-6 sm:p-8">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span className="text-2xl">🌅</span>
                    오늘의 운세
                  </h2>
                  <div className="space-y-2">
                    {result.todayFortune.messages.map((msg, i) => (
                      <div key={i} className="flex items-center gap-2 text-gray-300">
                        <span className="text-purple-400">•</span>
                        {msg}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Yearly */}
                <div className="glass-card p-6 sm:p-8">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span className="text-2xl">📅</span>
                    {result.yearlyFortune.year}년 세운
                  </h2>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                      {result.yearlyFortune.tenGod}
                    </span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-lg">
                          {i < result.yearlyFortune.fortune.luck ? '⭐' : '☆'}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300">{result.yearlyFortune.fortune.message}</p>
                </div>

                {/* Daeun */}
                <div className="glass-card p-6 sm:p-8">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span className="text-2xl">🌊</span>
                    대운 (10년 주기)
                  </h2>
                  <p className="mb-5 text-sm text-gray-400">
                    {result.luckPillarInfo.forward ? '순행' : '역행'} · 첫 대운 약 {result.luckPillarInfo.startAge}세
                    <span className="ml-2 text-xs text-gray-500">
                      ({result.luckPillarInfo.startYears}년 {result.luckPillarInfo.startMonths}개월 {result.luckPillarInfo.startDays}일 환산)
                    </span>
                  </p>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                    {result.daeun.map((d, i) => (
                      <div
                        key={i}
                        className={`pillar-card p-2 sm:p-3 text-center ${d.startYear <= new Date().getFullYear() && d.endYear >= new Date().getFullYear()
                            ? 'ring-2 ring-purple-500'
                            : ''
                          }`}
                      >
                        <div className="text-xs text-gray-500">{d.age}세</div>
                        <div className="text-sm font-bold" style={{ color: d.pillar.gan.color }}>
                          {d.pillar.gan.hanja}
                        </div>
                        <div className="text-sm font-bold" style={{ color: d.pillar.zhi.color }}>
                          {d.pillar.zhi.hanja}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'career' && (
              <div className="space-y-6 fade-in">
                <div className="glass-card p-6 sm:p-8">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span className="text-2xl">💼</span>
                    직업 적성 분석
                  </h2>
                  <div className="space-y-4">
                    {result.careerAptitude.map((career, i) => (
                      <div key={i} className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-purple-300">{career.category}</span>
                          <span className="text-sm text-gray-400">적합도 {career.score}%</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {career.jobs.map((job, j) => (
                            <span key={j} className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
                              {job}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">{career.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'health' && (
              <div className="space-y-6 fade-in">
                <div className="glass-card p-6 sm:p-8">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span className="text-2xl">🏥</span>
                    건강 성찰 가이드
                  </h2>
                  <p className="mb-4 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-200/80">
                    오행 상징을 생활 습관에 비유한 콘텐츠이며 의학적 진단이나 치료 조언이 아닙니다.
                  </p>
                  <p className="text-gray-300 mb-6">{result.healthFortune.overall}</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                      <div className="text-sm text-red-400 mb-2">⚠️ 생활 습관을 살필 영역</div>
                      <p className="text-gray-300">{result.healthFortune.weakOrgans.join(', ')}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        {result.healthFortune.advice.join(' / ')}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                      <div className="text-sm text-green-400 mb-2">💪 상징적으로 강조된 영역</div>
                      <p className="text-gray-300">{result.healthFortune.strongOrgans.join(', ')}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                      <div className="text-sm text-cyan-400 mb-2">🥗 추천 음식</div>
                      <div className="flex flex-wrap gap-2">
                        {result.healthFortune.foodRecommend.map((f, i) => (
                          <span key={i} className="px-2 py-1 bg-cyan-500/20 rounded text-xs">{f}</span>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                      <div className="text-sm text-purple-400 mb-2">🏃 추천 운동</div>
                      <div className="flex flex-wrap gap-2">
                        {result.healthFortune.exerciseRecommend.map((e, i) => (
                          <span key={i} className="px-2 py-1 bg-purple-500/20 rounded text-xs">{e}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'wealth' && (
              <div className="space-y-6 fade-in">
                <div className="glass-card p-6 sm:p-8">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span className="text-2xl">💰</span>
                    재물 운세
                  </h2>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-2xl font-bold text-yellow-400">{result.wealthFortune.type}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-400">재물운</span>
                      <span className="text-xl font-bold text-yellow-400">{result.wealthFortune.score}점</span>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6">{result.wealthFortune.description}</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                      <div className="text-sm text-green-400 mb-2">✨ 재물 강점</div>
                      <div className="flex flex-wrap gap-2">
                        {result.wealthFortune.strengths.map((s, i) => (
                          <span key={i} className="px-2 py-1 bg-green-500/20 rounded text-sm">{s}</span>
                        ))}
                      </div>
                    </div>
                    {result.wealthFortune.cautions.length > 0 && (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                        <div className="text-sm text-red-400 mb-2">⚠️ 주의사항</div>
                        <div className="flex flex-wrap gap-2">
                          {result.wealthFortune.cautions.map((c, i) => (
                            <span key={i} className="px-2 py-1 bg-red-500/20 rounded text-sm">{c}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                    <div className="text-sm text-yellow-400 mb-2">💡 금전 습관 참고</div>
                    <p className="text-gray-300">{result.wealthFortune.advice}</p>
                    <p className="mt-2 text-xs text-gray-500">개인 맞춤 금융 조언이 아니며 투자 판단은 별도의 전문 정보로 검토하세요.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'love' && (
              <div className="space-y-6 fade-in">
                <div className="glass-card p-6 sm:p-8">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span className="text-2xl">💕</span>
                    연애/결혼 운세
                  </h2>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-2xl font-bold text-pink-400">{result.loveFortune.style}</span>
                    <span className="text-xl font-bold text-pink-400">{result.loveFortune.score}점</span>
                  </div>
                  <p className="text-gray-300 mb-6">{result.loveFortune.description}</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20">
                      <div className="text-sm text-pink-400 mb-2">💝 이상형</div>
                      <div className="flex flex-wrap gap-2">
                        {result.loveFortune.idealPartner.map((p, i) => (
                          <span key={i} className="px-2 py-1 bg-pink-500/20 rounded text-sm">{p}</span>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                      <div className="text-sm text-purple-400 mb-2">❤️ 연애 키워드</div>
                      <div className="flex flex-wrap gap-2">
                        {result.loveFortune.loveKeyword.map((k, i) => (
                          <span key={i} className="px-2 py-1 bg-purple-500/20 rounded text-sm">{k}</span>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                      <div className="text-sm text-green-400 mb-2">🐲 궁합 좋은 띠</div>
                      <div className="flex gap-2">
                        {result.loveFortune.compatibleZodiac.map((z, i) => (
                          <span key={i} className="px-2 py-1 bg-green-500/20 rounded text-sm">{z}띠</span>
                        ))}
                      </div>
                    </div>
                    {result.loveFortune.cautions.length > 0 && (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                        <div className="text-sm text-red-400 mb-2">⚠️ 주의사항</div>
                        {result.loveFortune.cautions.map((c, i) => (
                          <span key={i} className="text-sm text-gray-300">{c}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20">
                    <div className="text-sm text-pink-400 mb-2">💒 결혼 조언</div>
                    <p className="text-gray-300">{result.loveFortune.marriageAdvice}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'compatibility' && (
              <div className="space-y-6 fade-in">
                <div className="glass-card p-6 sm:p-8">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span className="text-2xl">💑</span>
                    궁합 참고 지표
                  </h2>
                  <p className="mb-5 text-xs leading-relaxed text-gray-500">
                    일간 오행·음양과 띠 관계를 단순 점수화한 콘텐츠로, 실제 관계의 가치나 미래를 판정하지 않습니다.
                  </p>

                  {/* Partner Input */}
                  <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700 mb-6">
                    <h3 className="text-sm text-gray-400 mb-4">상대방 정보 입력</h3>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">생년월일</label>
                        <input
                          type="date"
                          value={partner.birthDate}
                          onChange={(e) => setPartner({ ...partner, birthDate: e.target.value })}
                          min="1800-01-01"
                          max={formatDateInputValue(new Date())}
                          className="input-field text-sm py-2"
                        />
                      </div>
                      <div>
                        <label htmlFor="partner-time" className="block text-xs text-gray-500 mb-1">시간</label>
                        <input
                          id="partner-time"
                          type="time"
                          value={partner.birthTime}
                          onChange={(e) => setPartner({ ...partner, birthTime: e.target.value })}
                          className="input-field text-sm py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">성별</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setPartner({ ...partner, gender: '남' })}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm transition-all ${partner.gender === '남'
                                ? 'bg-purple-500/20 border border-purple-500 text-white'
                                : 'border border-gray-600 text-gray-400'
                              }`}
                          >
                            남성
                          </button>
                          <button
                            type="button"
                            onClick={() => setPartner({ ...partner, gender: '여' })}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm transition-all ${partner.gender === '여'
                                ? 'bg-pink-500/20 border border-pink-500 text-white'
                                : 'border border-gray-600 text-gray-400'
                              }`}
                          >
                            여성
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleCompatibility}
                      disabled={!partner.birthDate}
                      className="mt-4 w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl font-medium disabled:opacity-50"
                    >
                      궁합 확인 💕
                    </button>
                    {compatibilityError && (
                      <p role="alert" className="mt-3 text-sm text-red-300">{compatibilityError}</p>
                    )}
                  </div>

                  {/* Result */}
                  {compatibilityResult && (
                    <div className="space-y-4">
                      <div className="text-center p-6 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30">
                        <div className="text-6xl mb-4">
                          {compatibilityResult.score >= 80 ? '💕' : compatibilityResult.score >= 60 ? '💛' : '💔'}
                        </div>
                        <div className="text-4xl font-bold gradient-text mb-2">{compatibilityResult.score}점</div>
                        <div className="text-xl text-purple-300">{compatibilityResult.grade}</div>
                      </div>
                      <div className="space-y-2">
                        {compatibilityResult.analysis.map((a, i) => (
                          <div key={i} className="p-3 rounded-lg bg-gray-800/50 text-sm text-gray-300">
                            {a}
                          </div>
                        ))}
                      </div>
                      <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                        <p className="text-gray-300">{compatibilityResult.advice}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Back Button */}
            <div className="text-center fade-in pb-8">
              <button
                onClick={() => setResult(null)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                다시 분석하기
              </button>
            </div>
          </div>
        )}

        {/* Save Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div role="dialog" aria-modal="true" aria-labelledby="save-dialog-title" className="glass-card p-6 max-w-md w-full">
              <h3 id="save-dialog-title" className="text-xl font-bold mb-4">💾 사주 저장하기</h3>
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="이름을 입력하세요 (예: 내 사주)"
                className="input-field mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-600 rounded-xl hover:bg-gray-800"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  disabled={!saveName.trim()}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-medium disabled:opacity-50"
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
