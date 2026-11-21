import { Download, CheckCircle2, FileCheck2, BookCopy } from 'lucide-react';
import type { AuditReport } from '../types/audit';

interface KdpUploadGuideProps {
  report: AuditReport;
}

function formatMb(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function KdpUploadGuide({ report }: KdpUploadGuideProps) {
  const kdpSettings = [
    { field: 'Ink and paper type', value: 'Black & white interior with white paper', note: 'يطابق تماماً سماكة الكعب المحسوبة (0.2072")' },
    { field: 'Trim size', value: '8.5 × 11 in (21.59 × 27.94 cm)', note: 'مقاس الكتب الداخلية المصنوعة: 612.00 × 792.00 pt' },
    { field: 'Bleed settings', value: 'No Bleed (PDF only)', note: 'جميع الصفحات بهوامش أمان ≥ 0.500" بدون نزيف' },
    { field: 'Paperback cover finish', value: 'Glossy أو Matte (حسب اختيارك)', note: 'الملف جاهز بدقة 450 DPI + Bleed 0.125" على الجهات الأربع' },
    { field: 'Manuscript upload', value: report.interior.master.fileName, note: '92 صفحة · 100% فيكتور + 4 خطوط مدمجة' },
    { field: 'Book Cover upload', value: 'Upload a cover you already have (print-ready PDF)', note: 'ارفع ملف الغلاف الكامل بدون تفعيل خيار "My cover includes a barcode"' },
  ];

  return (
    <div className="space-y-8">
      {/* Direct Master PDF Download Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Interior Master Download */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>ملف الكتاب الداخلي النهائي (Manuscript)</span>
              <span dir="ltr" className="font-mono tabular-nums font-semibold text-slate-800">
                {formatMb(report.interior.master.fileSizeBytes)}
              </span>
            </div>
            <div className="flex items-start gap-3">
              <FileCheck2 className="w-6 h-6 text-blue-700 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h2 className="text-base font-bold text-slate-950">
                  الكتاب الداخلي — 92 صفحة فيكتور كامل
                </h2>
                <p className="text-xs font-mono text-slate-500 mt-1 break-all" dir="ltr">
                  {report.interior.master.fileName}
                </p>
              </div>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                <span>مقاس دقيق <span dir="ltr" className="inline-block font-mono">8.500 × 11.000 in</span> (<span dir="ltr" className="inline-block font-mono">612 × 792 pt</span>) مع TrimBox مدمج</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                <span>0 صور نقطية · 46 صفحة رسوم محوّلة إلى Bezier Vector + 4 خطوط TrueType مدمجة</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                <span>شامل إصلاحات صفحة 2 (الحقوق) وصفحة 5 (توسيط الأشرطة) وصفحة 87 (أذن نوفا)</span>
              </li>
            </ul>
          </div>

          <a
            href={report.interior.master.downloadUrl}
            download={report.interior.master.fileName}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>تحميل الكتاب الداخلي (PDF فيكتور)</span>
          </a>
        </div>

        {/* Cover Master Download */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>ملف الغلاف الكامل النهائي (Full-Wrap Cover)</span>
              <span dir="ltr" className="font-mono tabular-nums font-semibold text-slate-800">
                {formatMb(report.cover.master.fileSizeBytes)}
              </span>
            </div>
            <div className="flex items-start gap-3">
              <BookCopy className="w-6 h-6 text-blue-700 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h2 className="text-base font-bold text-slate-950">
                  الغلاف الكامل — 450 DPI + نصوص وباركود فيكتور
                </h2>
                <p className="text-xs font-mono text-slate-500 mt-1 break-all" dir="ltr">
                  {report.cover.master.fileName}
                </p>
              </div>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                <span>مقاس دقيق 17.457 × 11.250 بوصة (1256.92 × 810 pt) لـ 92 صفحة ورق أبيض</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                <span>إزالة نص الكعب الضيق بسلاسة تامة لتفادي رفض KDP Print Previewer</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                <span>مربع باركود أبيض فيكتور 2.000 × 1.200&quot; على بُعد 0.250&quot; + نصوص ظهر الغلاف فيكتور</span>
              </li>
            </ul>
          </div>

          <a
            href={report.cover.master.downloadUrl}
            download={report.cover.master.fileName}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>تحميل الغلاف الكامل (PDF جاهز لـ KDP)</span>
          </a>
        </div>
      </section>

      {/* Exact Amazon KDP Upload Settings Checklist */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-950">
            إعدادات الرفع الدقيقة في لوحة Amazon KDP (Paperback Content)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            اختر القيم التالية حرفياً عند رفع الكتاب لضمان تطابق الحسابات الهندسية بنسبة 100%
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">الحقل في Amazon KDP</th>
                <th className="py-3 px-4">القيمة المطلوبة</th>
                <th className="py-3 px-4">الملاحظة التقنية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {kdpSettings.map((item) => (
                <tr key={item.field} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono text-xs font-semibold text-slate-900" dir="ltr">
                    {item.field}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-blue-800 font-semibold" dir="ltr">
                    {item.value}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
