import { useState, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Search, CheckCircle2, Wrench } from 'lucide-react';
import type { AuditReport } from '../types/audit';
import { ComparisonViewport } from './ComparisonViewport';

interface InteriorInspectorProps {
  report: AuditReport;
  selectedPage: number;
  onSelectPage: (page: number) => void;
}

type PageFilter = 'all' | 'fixed' | 'coloring' | 'story';

export function InteriorInspector({ report, selectedPage, onSelectPage }: InteriorInspectorProps) {
  const [filter, setFilter] = useState<PageFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showGuides, setShowGuides] = useState<boolean>(true);

  const filteredPages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return report.pages.filter((p) => {
      if (filter === 'fixed' && !p.hasVisualFix) return false;
      if (filter === 'coloring' && p.category !== 'coloring') return false;
      if (filter === 'story' && p.category !== 'story') return false;
      if (q) {
        return (
          String(p.page).includes(q) ||
          p.title.toLowerCase().includes(q) ||
          (p.fixSummaryAr && p.fixSummaryAr.includes(q))
        );
      }
      return true;
    });
  }, [report.pages, filter, searchQuery]);

  const currentEntry = useMemo(
    () => report.pages.find((p) => p.page === selectedPage) ?? report.pages[0],
    [report.pages, selectedPage],
  );

  // KDP Interior No-Bleed Guide percentages for 8.5 x 11 in
  const insideGutterPct = (0.375 / 8.5) * 100; // 4.41%
  const outsideMarginPct = (0.25 / 8.5) * 100; // 2.94%
  const topBottomMarginPct = (0.25 / 11.0) * 100; // 2.27%
  const isRecto = currentEntry.side === 'recto'; // Odd page binds on LEFT in English book
  const leftSafePct = isRecto ? insideGutterPct : outsideMarginPct;
  const rightSafePct = isRecto ? outsideMarginPct : insideGutterPct;

  const interiorGuidesSvg = (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
      {/* Binding Gutter Strip (highlighted cleanly on binding side) */}
      <rect
        x={isRecto ? 0 : 100 - insideGutterPct}
        y={0}
        width={insideGutterPct}
        height={100}
        fill="rgba(29, 78, 216, 0.12)"
      />
      {/* Safe Live Area Dashed Box (Gutter 0.375" + Outside/Top/Bottom 0.250") */}
      <rect
        x={leftSafePct}
        y={topBottomMarginPct}
        width={100 - leftSafePct - rightSafePct}
        height={100 - 2 * topBottomMarginPct}
        fill="none"
        stroke="#1D4ED8"
        strokeWidth="0.35"
        strokeDasharray="1.2 0.8"
      />
    </svg>
  );

  const insideIn = currentEntry.margins
    ? isRecto
      ? currentEntry.margins.leftIn
      : currentEntry.margins.rightIn
    : null;
  const outsideIn = currentEntry.margins
    ? isRecto
      ? currentEntry.margins.rightIn
      : currentEntry.margins.leftIn
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Right (RTL) 92-Page Navigator Sidebar */}
      <aside
        aria-label="فهرس صفحات الكتاب"
        className="lg:col-span-3 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col max-h-[820px]"
      >
        <div className="p-4 border-b border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-950">صفحات الكتاب (92)</h2>
            <span className="text-xs font-mono tabular-nums text-slate-500">
              {filteredPages.length} صفحة
            </span>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search
              className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="رقم الصفحة أو الفصل..."
              aria-label="بحث في صفحات الكتاب"
              className="w-full pr-9 pl-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          {/* Segmented Filter Buttons */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-lg">
            {(
              [
                { id: 'all', label: 'الكل' },
                { id: 'fixed', label: 'المُصلَحة' },
                { id: 'coloring', label: 'التلوين' },
                { id: 'story', label: 'القصة' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`py-1.5 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  filter === tab.id
                    ? 'bg-white text-slate-950 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Page List */}
        <div className="overflow-y-auto divide-y divide-slate-100 flex-1">
          {filteredPages.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              لا توجد صفحات مطابقة لبحثك.
            </div>
          ) : (
            filteredPages.map((entry) => {
              const active = entry.page === selectedPage;
              return (
                <button
                  key={entry.page}
                  type="button"
                  onClick={() => onSelectPage(entry.page)}
                  className={`w-full text-right px-4 py-2.5 flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                    active ? 'bg-blue-50 text-blue-950' : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono tabular-nums font-bold text-slate-900">
                        ص {String(entry.page).padStart(2, '0')}
                      </span>
                      <span className="text-slate-400" aria-hidden="true">·</span>
                      <span className="text-[11px] text-slate-500">
                        {entry.side === 'recto' ? 'يمين' : 'يسار'}
                      </span>
                      {entry.hasVisualFix && (
                        <>
                          <span className="text-slate-400" aria-hidden="true">·</span>
                          <span className="text-[11px] font-semibold text-blue-700">مُصلَحة</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 truncate mt-0.5" dir="ltr">
                      {entry.title}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* Main Interior Inspection Stage */}
      <div className="lg:col-span-9 space-y-4">
        {/* Selected Page Metadata & Prev/Next Bar */}
        <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-mono tabular-nums font-semibold text-slate-900">
                صفحة {currentEntry.page} من 92
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {isRecto ? 'صفحة يمنى (التجليد يساراً)' : 'صفحة يسرى (التجليد يميناً)'}
              </span>
              {currentEntry.margins && currentEntry.category !== 'blank' && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums text-emerald-700 font-medium inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    داخلي {insideIn?.toFixed(3)}&quot; · خارجي {outsideIn?.toFixed(3)}&quot;
                  </span>
                </>
              )}
            </div>
            <h2 className="text-base font-bold text-slate-950" dir="ltr">
              {currentEntry.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onSelectPage(Math.max(1, selectedPage - 1))}
              disabled={selectedPage <= 1}
              aria-label="الصفحة السابقة"
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
              <span>السابقة</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectPage(Math.min(92, selectedPage + 1))}
              disabled={selectedPage >= 92}
              aria-label="الصفحة التالية"
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>التالية</span>
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Visual Fix Banner (only on fixed pages P2, P5, P87 — flat border, no thick left bar) */}
        {currentEntry.hasVisualFix && currentEntry.fixSummaryAr && (
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-3 text-xs text-blue-950">
            <Wrench className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-bold">تم تنفيذ إصلاح مخصّص لهذه الصفحة: </span>
              <span>{currentEntry.fixSummaryAr}</span>
            </div>
          </div>
        )}

        {/* Interactive Comparison & 400% Loupe */}
        <ComparisonViewport
          beforeSrc={`/api/render/interior/before/${currentEntry.page}?dpi=144`}
          afterSrc={`/api/render/interior/after/${currentEntry.page}?dpi=144`}
          beforeHiResSrc={`/api/render/interior/before/${currentEntry.page}?dpi=300`}
          afterHiResSrc={`/api/render/interior/after/${currentEntry.page}?dpi=300`}
          beforeLabel="300 DPI نقطي"
          afterLabel="فيكتور كامل (Bezier)"
          aspectRatio={8.5 / 11.0}
          altText={`صفحة ${currentEntry.page} — ${currentEntry.title}`}
          guidesOverlay={interiorGuidesSvg}
          showGuides={showGuides}
          onToggleGuides={() => setShowGuides((s) => !s)}
          guidesLabel="هوامش KDP (Gutter 0.375&quot;)"
          defaultFocusPoint={
            currentEntry.page === 87
              ? { x: 42, y: 66 }
              : currentEntry.page === 5
                ? { x: 50, y: 47 }
                : currentEntry.page === 2
                  ? { x: 50, y: 52 }
                  : currentEntry.category === 'story'
                    ? { x: 50, y: 34 }
                    : { x: 50, y: 48 }
          }
        />
      </div>
    </div>
  );
}
