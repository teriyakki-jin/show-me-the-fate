'use client';

import { useState, useEffect } from 'react';
import { calculateSaju, FIVE_ELEMENTS, TEN_GODS, ZODIAC_DETAILS, TenGodType, calculateCompatibility, CHEONGAN, JIJI } from '@/lib/saju';

// 저장된 사주 타입
type SavedSaju = {
  id: string;
  name: string;
  birthDate: string;
  birthHour: string;
  gender: '남' | '여';
  savedAt: string;
};

export default function Home() {
  const [birthDate, setBirthDate] = useState('');
  const [birthHour, setBirthHour] = useState('12');
  const [gender, setGender] = useState<'남' | '여'>('남');
  const [result, setResult] = useState<ReturnType<typeof calculateSaju> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'zodiac' | 'tenGods' | 'fortune' | 'career' | 'health' | 'wealth' | 'love' | 'compatibility'>('basic');

  // 저장 기능
  const [savedList, setSavedList] = useState<SavedSaju[]>([]);
  const [saveName, setSaveName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  // 궁합 기능
  const [showCompatibility, setShowCompatibility] = useState(false);
  const [partner, setPartner] = useState<{ birthDate: string; birthHour: string; gender: '남' | '여' }>({
    birthDate: '',
    birthHour: '12',
    gender: '여'
  });
  const [compatibilityResult, setCompatibilityResult] = useState<ReturnType<typeof calculateCompatibility> | null>(null);

  // 저장된 사주 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('savedSajuList');
    if (saved) {
      setSavedList(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const date = new Date(birthDate);
    const sajuResult = calculateSaju(date, parseInt(birthHour), gender);
    setResult(sajuResult);
    setIsLoading(false);
    setActiveTab('basic');
  };

  const handleSave = () => {
    if (!saveName.trim() || !result) return;

    const newSaved: SavedSaju = {
      id: Date.now().toString(),
      name: saveName.trim(),
      birthDate,
      birthHour,
      gender,
      savedAt: new Date().toISOString()
    };

    const newList = [...savedList, newSaved];
    setSavedList(newList);
    localStorage.setItem('savedSajuList', JSON.stringify(newList));
    setSaveName('');
    setShowSaveModal(false);
  };

  const handleLoadSaved = (saved: SavedSaju) => {
    setBirthDate(saved.birthDate);
    setBirthHour(saved.birthHour);
    setGender(saved.gender);

    const date = new Date(saved.birthDate);
    const sajuResult = calculateSaju(date, parseInt(saved.birthHour), saved.gender);
    setResult(sajuResult);
    setActiveTab('basic');
  };

  const handleDeleteSaved = (id: string) => {
    const newList = savedList.filter(s => s.id !== id);
    setSavedList(newList);
    localStorage.setItem('savedSajuList', JSON.stringify(newList));
  };

  const handleCompatibility = () => {
    if (!result || !partner.birthDate) return;

    const partnerDate = new Date(partner.birthDate);
    const partnerSaju = calculateSaju(partnerDate, parseInt(partner.birthHour), partner.gender);

    const compatibility = calculateCompatibility(
      { dayGan: result.dayMaster, yearZhi: result.yearPillar.zhi },
      { dayGan: partnerSaju.dayMaster, yearZhi: partnerSaju.yearPillar.zhi }
    );

    setCompatibilityResult(compatibility);
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

  const hourOptions = [
    { value: '0', label: '자시 (23:30~01:30)' },
    { value: '2', label: '축시 (01:30~03:30)' },
    { value: '4', label: '인시 (03:30~05:30)' },
    { value: '6', label: '묘시 (05:30~07:30)' },
    { value: '8', label: '진시 (07:30~09:30)' },
    { value: '10', label: '사시 (09:30~11:30)' },
    { value: '12', label: '오시 (11:30~13:30)' },
    { value: '14', label: '미시 (13:30~15:30)' },
    { value: '16', label: '신시 (15:30~17:30)' },
    { value: '18', label: '유시 (17:30~19:30)' },
    { value: '20', label: '술시 (19:30~21:30)' },
    { value: '22', label: '해시 (21:30~23:30)' },
  ];

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
                당신의 사주를 분석하여 타고난 운명을 알려드립니다
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="fade-in fade-in-delay-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  생년월일
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="fade-in fade-in-delay-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  태어난 시간
                </label>
                <select
                  value={birthHour}
                  onChange={(e) => setBirthHour(e.target.value)}
                  className="input-field"
                >
                  {hourOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-900">
                      {option.label}
                    </option>
                  ))}
                </select>
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

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full mt-8 fade-in fade-in-delay-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    분석 중...
                  </span>
                ) : (
                  '사주 보기 ✨'
                )}
              </button>
            </form>

            {/* 저장된 사주 목록 */}
            {savedList.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-700">
                <h3 className="text-sm font-medium text-gray-400 mb-3">📁 저장된 사주</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {savedList.map((saved) => (
                    <div key={saved.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <button
                        onClick={() => handleLoadSaved(saved)}
                        className="flex-1 text-left text-sm text-white hover:text-purple-400"
                      >
                        {saved.name}
                        <span className="text-xs text-gray-500 ml-2">
                          {saved.gender === '남' ? '👨' : '👩'} {saved.birthDate}
                        </span>
                      </button>
                      <button
                        onClick={() => handleDeleteSaved(saved.id)}
                        className="text-gray-500 hover:text-red-400 p-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                {new Date(birthDate).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} 출생 · {gender === '남' ? '남성' : '여성'}
              </p>
              {/* 저장 버튼 */}
              <button
                onClick={() => setShowSaveModal(true)}
                className="mt-3 px-4 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg hover:border-purple-500 transition-all"
              >
                💾 저장하기
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-2 fade-in">
              {[
                { id: 'basic', label: '사주팔자', icon: '☯️' },
                { id: 'zodiac', label: '띠 분석', icon: '🐲' },
                { id: 'tenGods', label: '십신', icon: '⭐' },
                { id: 'fortune', label: '운세', icon: '🔮' },
                { id: 'career', label: '직업', icon: '💼' },
                { id: 'health', label: '건강', icon: '🏥' },
                { id: 'wealth', label: '재물', icon: '💰' },
                { id: 'love', label: '연애', icon: '💕' },
                { id: 'compatibility', label: '궁합', icon: '💑' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all text-sm ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-500/50 text-white'
                      : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'
                    }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

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
                    오행 분포
                  </h2>
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
                    건강 운세
                  </h2>
                  <p className="text-gray-300 mb-6">{result.healthFortune.overall}</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                      <div className="text-sm text-red-400 mb-2">⚠️ 주의할 장기</div>
                      <p className="text-gray-300">{result.healthFortune.weakOrgans.join(', ')}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        {result.healthFortune.advice.join(' / ')}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                      <div className="text-sm text-green-400 mb-2">💪 튼튼한 장기</div>
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
                    <div className="text-sm text-yellow-400 mb-2">💡 재테크 조언</div>
                    <p className="text-gray-300">{result.wealthFortune.advice}</p>
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
                    궁합 보기
                  </h2>

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
                          className="input-field text-sm py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">시간</label>
                        <select
                          value={partner.birthHour}
                          onChange={(e) => setPartner({ ...partner, birthHour: e.target.value })}
                          className="input-field text-sm py-2"
                        >
                          {hourOptions.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-gray-900">
                              {opt.label}
                            </option>
                          ))}
                        </select>
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
            <div className="glass-card p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">💾 사주 저장하기</h3>
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
