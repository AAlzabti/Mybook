import { useState } from 'react';
import { Crosshair, CheckCircle2 } from 'lucide-react';
import type { AuditReport } from '../types/audit';
import { calculateKdpCoverGeometry } from '../utils/kdpSpecs';
import { ComparisonViewport } from './ComparisonViewport';

interface CoverInspectorProps {
  report: AuditReport;
}

export function CoverInspector({ report }: CoverInspectorProps) {
  const [showGuides, setShowGuides] = useState<boolean>(true);
  const [focusPreset, setFocusPreset] = useState<{ x: number; y: number; key: number } | null>(null);

  const geom = calculateKdpCoverGeometry(8.5, 11.0, 92, 'white-bw');
  const W = geom.totalWidthIn; // 17.4572
  const H = geom.totalHeightIn; // 11.2500

  const bleedXPct = (geom.bleedIn / W) * 100;
  const bleedYPct = (geom.bleedIn / H) * 100;
  const spineLeftPct = (geom.spineLeftIn / W) * 100;
  const spineWidthPct = (geom.spineWidthIn / W) * 100;
  const barcodeXPct = (geom.barcodeRectIn.x / W) * 100;
  const barcodeYPct = (geom.barcodeRectIn.y / H) * 100;
  const barcodeWPct = (geom.barcodeRectIn.width / W) * 100;
  const barcodeHPct = (geom.barcodeRectIn.height / H) * 100;

  const triggerFocus = (x: number, y: number) => {
    setFocusPreset({ x, y, key: Date.now() });
  };

  const coverGuidesSvg = (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
      {/* 0.125" Bleed Trim Frame */}
      <rect
        x={bleedXPct}
        y={bleedYPct}
        width={100 - 2 * bleedXPct}
        height={100 - 2 * bleedYPct}
        fill="none"
        stroke="#DC2626"
        strokeWidth="0.3"
        strokeDasharray="0.9 0.6"
      />
      {/* Exact 0.2072" Spine Fold Zone */}
      <rect
        x={spineLeftPct}
        y={0}
        width={spineWidthPct}
        height={100}
        fill="rgba(59, 130, 246, 0.22)"
        stroke="#2563EB"
        strokeWidth="0.25"
      />
      {/* Exact 2.000" x 1.200" KDP Barcode Safe Box */}
      <rect
        x={barcodeXPct}
        y={barcodeYPct}
        width={barcodeWPct}
        height={barcodeHPct}
        fill="rgba(22, 163, 74, 0.12)"
        stroke="#16A34A"
        strokeWidth="0.35"
        strokeDasharray="0.8 0.5"
      />
    </svg>
  );

  return (
    <div className="space-y-5">
      {/* Cover Geometry & Quick Macro Presets Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span dir="ltr" className="font-mono tabular-nums font-semibold text-slate-900">
              {geom.totalWidthIn.toFixed(4)} × {geom.totalHeightIn.toFixed(4)} in
            </span>
            <span aria-hidden="true">·</span>
            <span dir="ltr" className="font-mono tabular-nums">Spine {geom.spineWidthIn}&quot;</span>
            <span aria-hidden="true">·</span>
            <span dir="ltr" className="font-mono tabular-nums">Bleed 0.125&quot;</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
              كعب نظيف · باركود مطابق
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-950">
            فاحص الغلاف الكامل (Full-Wrap Cover · <span dir="ltr" className="inline-block">{report.cover.master.dpi} DPI</span> + فيكتور)
          </h2>
        </div>

        {/* One-Click Macro Focus Zones for Cover */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: 'فحص إزالة نص الكعب', x: 50, y: 50 },
            { label: 'فحص مربع الباركود', x: 42, y: 91 },
            { label: 'فحص نصوص ظهر الغلاف', x: 24, y: 20 },
            { label: 'فحص الغلاف الأمامي', x: 75, y: 52 },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => triggerFocus(preset.x, preset.y)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <Crosshair className="w-3.5 h-3.5 text-blue-700" aria-hidden="true" />
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Legend Strip for Cover Guides */}
      <div className="flex flex-wrap items-center gap-6 px-2 text-xs text-slate-600">
        <span className="inline-flex items-center gap-2">
          <span className="w-3 h-0.5 bg-red-600 inline-block" aria-hidden="true" />
          خط القص Trim (<span dir="ltr" className="font-mono tabular-nums">0.125&quot; Bleed</span>)
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-3 h-3 bg-blue-500/30 border border-blue-600 inline-block" aria-hidden="true" />
          منطقة الكعب Spine (<span dir="ltr" className="font-mono tabular-nums">0.2072&quot;</span> — خالية من النص)
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-3 h-3 bg-emerald-500/20 border border-emerald-600 inline-block" aria-hidden="true" />
          مربع الباركود الرسمي (<span dir="ltr" className="font-mono tabular-nums">2.000&quot; × 1.200&quot;</span>)
        </span>
      </div>

      {/* Interactive Cover Comparison & 400% Loupe */}
      <ComparisonViewport
        beforeSrc="/api/render/cover/before?dpi=120"
        afterSrc="/api/render/cover/after?dpi=120"
        beforeHiResSrc="/api/render/cover/before?dpi=240"
        afterHiResSrc="/api/render/cover/after?dpi=240"
        beforeLabel='الأصل (17.453×11.247" · 300 DPI)'
        afterLabel='النهائي (17.457×11.250" · 450 DPI + Vector)'
        aspectRatio={W / H}
        altText="الغلاف الكامل لكتاب Nova and the Fallen Stars"
        guidesOverlay={coverGuidesSvg}
        showGuides={showGuides}
        onToggleGuides={() => setShowGuides((s) => !s)}
        guidesLabel="خطوط KDP (القص / الكعب / الباركود)"
        defaultFocusPoint={{ x: 50, y: 50 }}
        externalFocusPoint={focusPreset}
      />
    </div>
  );
}
