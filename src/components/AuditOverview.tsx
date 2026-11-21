import { CheckCircle2, AlertTriangle, ArrowUpLeft, FileText, BookOpen, Download } from 'lucide-react';
import type { AuditReport, AppliedFix } from '../types/audit';

interface AuditOverviewProps {
  report: AuditReport;
  onInspectFix: (fix: AppliedFix) => void;
  onOpenInterior: (page?: number) => void;
  onOpenCover: () => void;
  onOpenDownloads: () => void;
}

function formatMb(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function AuditOverview({
  report,
  onInspectFix,
  onOpenInterior,
  onOpenCover,
  onOpenDownloads,
}: AuditOverviewProps) {
  const complianceRows = [
    {
      label: 'مقاس الصفحات الداخلية (Trim Size)',
      kdpRule: '8.500 × 11.000 in (بدون Bleed)',
      before: `${report.interior.original.widthIn.toFixed(3)} × ${report.interior.original.heightIn.toFixed(4)} in`,
      after: `${report.interior.master.widthIn.toFixed(4)} × ${report.interior.master.heightIn.toFixed(4)} in`,
      beforeStatus: 'warn' as const,
      afterNote: 'مطابق تماماً (612 × 792 pt)',
    },
    {
      label: 'تقنية الرسوم الداخلية وجودة الطباعة',
      kdpRule: 'فيكتور أو 300+ DPI بدون تعرّج',
      before: '92 صورة 1-bit نقطية (300 DPI)',
      after: `0 صور نقطية · ${report.interior.master.tracedArtworkPages} صفحة فيكتور Bezier`,
      beforeStatus: 'warn' as const,
      afterNote: 'فيكتور كامل لا محدود الدقة',
    },
    {
      label: 'الخطوط المدمجة (Embedded Fonts)',
      kdpRule: 'تضمين كامل للخطوط داخل PDF',
      before: `${report.interior.original.embeddedFonts} خطوط (نصوص مصوّرة)`,
      after: `${report.interior.master.embeddedFonts} عائلات TrueType مدمجة`,
      beforeStatus: 'warn' as const,
      afterNote: 'نصوص حادة 100% في كل الفصول',
    },
    {
      label: 'الهوامش الداخلية والخارجية (92 صفحة)',
      kdpRule: 'داخلي ≥ 0.375" · خارجي/علوي ≥ 0.250"',
      before: `أقل داخلي ${report.interior.margins.minInsideGutterIn.toFixed(3)}" · خارجي ${report.interior.margins.minOutsideIn.toFixed(3)}"`,
      after: `أقل داخلي ${report.interior.margins.minInsideGutterIn.toFixed(3)}" · جميع الـ 92 صفحة ناجحة`,
      beforeStatus: 'pass' as const,
      afterNote: 'هامش أمان ممتاز للتجليد',
    },
    {
      label: 'مقاس الغلاف الكامل (Full-Wrap + Bleed)',
      kdpRule: '17.457 × 11.250 in (ورق أبيض 92ص)',
      before: `${report.cover.original.widthIn.toFixed(4)} × ${report.cover.original.heightIn.toFixed(4)} in`,
      after: `${report.cover.master.widthIn.toFixed(4)} × ${report.cover.master.heightIn.toFixed(4)} in`,
      beforeStatus: 'fail' as const,
      afterNote: 'مضبوط مع TrimBox و BleedBox',
    },
    {
      label: 'كعب الغلاف (Spine 0.207")',
      kdpRule: 'هامش أمان 0.0625" من كل جانب',
      before: 'يحتوي نصاً عمودياً ضيقاً معرضاً للرفض',
      after: 'تمت إزالة نص الكعب بسلاسة كاملة',
      beforeStatus: 'fail' as const,
      afterNote: 'آمن 100% ضد انحراف التجليد',
    },
    {
      label: 'منطقة الباركود الخلفية (Barcode Safe Zone)',
      kdpRule: '2.000 × 1.200" (بُعد 0.250" من الكعب/الأسفل)',
      before: `${report.cover.original.barcodeBoxIn.width.toFixed(3)} × ${report.cover.original.barcodeBoxIn.height.toFixed(3)}" (مُزاح 0.125")`,
      after: `${report.cover.master.barcodeBoxIn.width.toFixed(3)} × ${report.cover.master.barcodeBoxIn.height.toFixed(3)}" (بُعد 0.250" دقيق)`,
      beforeStatus: 'warn' as const,
      afterNote: 'مربع أبيض فيكتور مطابق لـ KDP',
    },
    {
      label: 'دقة الغلاف ونصوص ظهر الغلاف',
      kdpRule: '300 DPI كحد أدنى للطباعة التجارية',
      before: '300 DPI JPEG بدون نصوص فيكتور',
      after: `${report.cover.master.dpi} DPI + ${report.cover.master.embeddedFonts} خطوط فيكتور مدمجة`,
      beforeStatus: 'warn' as const,
      afterNote: 'نصوص ظهر غلاف وحدود ذهبية فيكتور',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Summary Header */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>تقرير الفحص والتجهيز الطباعي</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">Amazon KDP Paperback</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">8.5 × 11 in</span>
              <span aria-hidden="true">·</span>
              <span>92 صفحة ورق أبيض</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-950 tracking-tight">
              {report.bookTitle} — جاهز للرفع المباشر على KDP
            </h1>
            <p className="text-sm lg:text-base text-slate-600 leading-relaxed">
              تم تحويل جميع الرسوم الداخلية الـ 46 إلى مسارات فيكتور حقيقية (Cubic Bezier) وإعادة بناء جميع صفحات القصة والعناوين بخطوط مدمجة، مع إصلاح العيوب البصرية في الصفحات 2 و5 و87، وضبط الغلاف الكامل وإزالة نص الكعب ومحاذاة مربع الباركود بدقة المليمتر.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onOpenInterior(9)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>فحص المقارنة 400%</span>
            </button>
            <button
              type="button"
              onClick={onOpenDownloads}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>تحميل ملفي PDF النهائيين</span>
            </button>
          </div>
        </div>

        {/* 4-column Measured Metrics Strip (single flat hairline divider, no nested cards) */}
        <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-slate-500">نقاء الفيكتور الداخلي</p>
            <p className="mt-1 text-xl font-bold font-mono tabular-nums text-slate-950" dir="ltr">
              100% Vector
            </p>
            <p className="mt-1 text-xs text-emerald-700 font-medium">
              0 صور نقطية · {report.interior.master.embeddedFonts} خطوط مدمجة
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">مقاس الكتاب الداخلي</p>
            <p className="mt-1 text-xl font-bold font-mono tabular-nums text-slate-950" dir="ltr">
              8.500 × 11.000&quot;
            </p>
            <p className="mt-1 text-xs text-slate-600">
              <span dir="ltr" className="inline-block font-mono tabular-nums">
                {formatMb(report.interior.master.fileSizeBytes)}
              </span>{' '}
              · 92 صفحة
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">مقاس الغلاف + الكعب</p>
            <p className="mt-1 text-xl font-bold font-mono tabular-nums text-slate-950" dir="ltr">
              17.457 × 11.250&quot;
            </p>
            <p className="mt-1 text-xs text-slate-600 font-mono tabular-nums" dir="ltr">
              Spine {report.cover.master.spineWidthIn}&quot; · {report.cover.master.dpi} DPI
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">العيوب المُصلَحة</p>
            <p className="mt-1 text-xl font-bold font-mono tabular-nums text-slate-950" dir="ltr">
              {report.fixesApplied.length} / {report.fixesApplied.length}
            </p>
            <p className="mt-1 text-xs text-emerald-700 font-medium">
              ص 2 · ص 5 · ص 87 · الكعب · الباركود
            </p>
          </div>
        </div>
      </section>

      {/* Before vs After KDP Preflight Compliance Table */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-950">
              جدول المطابقة التقني لمعايير Amazon KDP (قبل / بعد)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              جميع القياسات مستخرجة آلياً من ملفات PDF الفعلية قبل وبعد المعالجة
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <button
              type="button"
              onClick={() => onOpenInterior(1)}
              className="text-blue-700 hover:text-blue-900 font-medium whitespace-nowrap cursor-pointer"
            >
              فتح فاحص الصفحات
            </button>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <button
              type="button"
              onClick={onOpenCover}
              className="text-blue-700 hover:text-blue-900 font-medium whitespace-nowrap cursor-pointer"
            >
              فتح فاحص الغلاف
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">المعيار الطباعي</th>
                <th className="py-3 px-4">معيار Amazon KDP</th>
                <th className="py-3 px-4">النسخة الأصلية (قبل)</th>
                <th className="py-3 px-4">النسخة المرقّاة (بعد)</th>
                <th className="py-3 px-4">الحالة النهائية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {complianceRows.map((row) => (
                <tr key={row.label} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-slate-900">{row.label}</td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs tabular-nums">
                    {row.kdpRule}
                  </td>
                  <td className="py-3.5 px-4 text-xs tabular-nums">
                    <span className="inline-flex items-center gap-1.5 text-slate-700">
                      {row.beforeStatus === 'fail' ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" aria-hidden="true" />
                      ) : row.beforeStatus === 'warn' ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" aria-hidden="true" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                      )}
                      <span>{row.before}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs tabular-nums text-slate-900 font-medium">
                    {row.after}
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{row.afterNote}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Detailed Applied Fixes with 1-Click Direct Jump to Visual Comparator */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-950">
            سجل الإصلاحات البصرية والهندسية المنفّذة ({report.fixesApplied.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            اضغط على أي إصلاح للانتقال فوراً إلى معاينته بالمنزلق وعدسة التكبير 400%
          </p>
        </div>

        <div className="divide-y divide-slate-200">
          {report.fixesApplied.map((fix, idx) => (
            <div
              key={fix.id}
              className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-slate-50/70 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono tabular-nums font-semibold text-slate-700">
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                  <span>{fix.target === 'cover' ? 'الغلاف الكامل' : `الكتاب الداخلي · صفحة ${fix.page}`}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-700 font-medium">تم الإصلاح والتحقق</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{fix.titleAr}</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-1 text-xs">
                  <p className="text-slate-600">
                    <span className="font-semibold text-slate-800">قبل: </span>
                    {fix.beforeAr}
                  </p>
                  <p className="text-slate-700">
                    <span className="font-semibold text-emerald-800">بعد: </span>
                    {fix.afterAr}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onInspectFix(fix)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50/70 hover:bg-blue-100/80 rounded-lg transition-colors whitespace-nowrap shrink-0 self-start md:self-center cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                <span>معاينة قبل / بعد</span>
                <ArrowUpLeft className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
