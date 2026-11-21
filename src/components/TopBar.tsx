import type { StudioView } from '../types/audit';

interface TopBarProps {
  activeView: StudioView;
  onSelectView: (view: StudioView) => void;
  onPrimaryAction: () => void;
}

const NAV_ITEMS: Array<{ id: StudioView; label: string }> = [
  { id: 'audit', label: 'تقرير الفحص' },
  { id: 'interior', label: 'فاحص الصفحات' },
  { id: 'cover', label: 'فاحص الغلاف' },
  { id: 'kdp-guide', label: 'إعدادات KDP' },
];

export function TopBar({ activeView, onSelectView, onPrimaryAction }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <button
          type="button"
          onClick={() => onSelectView('audit')}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 cursor-pointer"
        >
          Nova KDP Studio
        </button>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav aria-label="التنقل الرئيسي" className="flex items-center gap-6 overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectView(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600 ${
                  isActive ? 'text-slate-950 font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-700"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary CTA button */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onPrimaryAction}
            className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            تحميل الملفات الجاهزة
          </button>
        </div>
      </div>
    </header>
  );
}
