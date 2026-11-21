import { useEffect, useState, useCallback } from 'react';
import type { AuditReport, AppliedFix, StudioView } from './types/audit';
import { TopBar } from './components/TopBar';
import { AuditOverview } from './components/AuditOverview';
import { InteriorInspector } from './components/InteriorInspector';
import { CoverInspector } from './components/CoverInspector';
import { KdpUploadGuide } from './components/KdpUploadGuide';

export default function App() {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<StudioView>('audit');
  const [selectedPage, setSelectedPage] = useState<number>(9);

  const loadAudit = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/audit');
      if (!res.ok) {
        throw new Error(`تعذر تحميل تقرير التدقيق (${res.status})`);
      }
      const data: AuditReport = await res.json();
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء تحميل البيانات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAudit();
  }, [loadAudit]);

  const handleInspectFix = (fix: AppliedFix) => {
    if (fix.target === 'cover') {
      setActiveView('cover');
    } else {
      setSelectedPage(fix.page);
      setActiveView('interior');
    }
  };

  const handleOpenInterior = (page = 9) => {
    setSelectedPage(page);
    setActiveView('interior');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <TopBar
        activeView={activeView}
        onSelectView={setActiveView}
        onPrimaryAction={() => setActiveView('kdp-guide')}
      />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 lg:py-8">
        {loading && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-4">
            <div className="h-6 w-64 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-full max-w-xl bg-slate-100 rounded animate-pulse" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="bg-white border border-red-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-red-900">تعذر تحميل بيانات التدقيق</h2>
              <p className="text-xs text-red-700 mt-1">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => void loadAudit()}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer self-start sm:self-center"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {!loading && !error && report && (
          <>
            {activeView === 'audit' && (
              <AuditOverview
                report={report}
                onInspectFix={handleInspectFix}
                onOpenInterior={handleOpenInterior}
                onOpenCover={() => setActiveView('cover')}
                onOpenDownloads={() => setActiveView('kdp-guide')}
              />
            )}

            {activeView === 'interior' && (
              <InteriorInspector
                report={report}
                selectedPage={selectedPage}
                onSelectPage={setSelectedPage}
              />
            )}

            {activeView === 'cover' && <CoverInspector report={report} />}

            {activeView === 'kdp-guide' && <KdpUploadGuide report={report} />}
          </>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span dir="ltr">Nova and the Fallen Stars — Amazon KDP Print-Ready Mastering Studio</span>
          <span dir="ltr" className="font-mono tabular-nums">8.5 × 11 in · 92 Pages · White Paper</span>
        </div>
      </footer>
    </div>
  );
}
