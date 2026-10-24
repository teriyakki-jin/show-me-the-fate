import type { SavedSajuV2 } from '@/lib/saju/types';

interface SavedSajuListProps {
  items: SavedSajuV2[];
  onLoad: (item: SavedSajuV2) => void;
  onDelete: (id: string) => void;
}

export function SavedSajuList({ items, onLoad, onDelete }: SavedSajuListProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-8 pt-6 border-t border-gray-700" aria-labelledby="saved-saju-title">
      <h2 id="saved-saju-title" className="text-sm font-medium text-gray-400 mb-3">📁 저장된 사주</h2>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {items.map((saved) => (
          <div key={saved.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
            <button
              type="button"
              onClick={() => onLoad(saved)}
              className="flex-1 text-left text-sm text-white hover:text-purple-400"
            >
              {saved.name}
              <span className="text-xs text-gray-500 ml-2">
                {saved.input.gender === '남' ? '👨' : '👩'} {saved.input.birthDate}
              </span>
            </button>
            <button
              type="button"
              onClick={() => onDelete(saved.id)}
              className="text-gray-500 hover:text-red-400 p-1"
              aria-label={`${saved.name} 삭제`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
