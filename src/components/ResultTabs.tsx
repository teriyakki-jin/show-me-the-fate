export const RESULT_TABS = [
  { id: 'basic', label: '사주팔자', icon: '☯️' },
  { id: 'zodiac', label: '띠 분석', icon: '🐲' },
  { id: 'tenGods', label: '십신', icon: '⭐' },
  { id: 'fortune', label: '운세', icon: '🔮' },
  { id: 'career', label: '직업', icon: '💼' },
  { id: 'health', label: '건강', icon: '🏥' },
  { id: 'wealth', label: '재물', icon: '💰' },
  { id: 'love', label: '연애', icon: '💕' },
  { id: 'compatibility', label: '궁합', icon: '💑' },
] as const;

export type ResultTabId = (typeof RESULT_TABS)[number]['id'];

interface ResultTabsProps {
  activeTab: ResultTabId;
  onChange: (tab: ResultTabId) => void;
}

export function ResultTabs({ activeTab, onChange }: ResultTabsProps) {
  return (
    <nav aria-label="사주 분석 항목" className="flex gap-2 overflow-x-auto pb-2 fade-in">
      {RESULT_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          aria-current={activeTab === tab.id ? 'page' : undefined}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all text-sm ${activeTab === tab.id
              ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-500/50 text-white'
              : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'
            }`}
        >
          <span aria-hidden="true">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
