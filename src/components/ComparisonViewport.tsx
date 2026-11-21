import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, Lock, Unlock, Layers, SplitSquareHorizontal, Eye } from 'lucide-react';
import { clampPercentage } from '../utils/kdpSpecs';

export type ViewMode = 'split' | 'loupe' | 'after' | 'before';
export type ZoomLevel = 100 | 200 | 400;

interface ComparisonViewportProps {
  /** Standard resolution image URLs (for full canvas view) */
  beforeSrc: string;
  afterSrc: string;
  /** High-resolution image URLs (for crisp 400% synced loupe) */
  beforeHiResSrc: string;
  afterHiResSrc: string;
  beforeLabel: string;
  afterLabel: string;
  aspectRatio: number; // width / height
  altText: string;
  /** Optional SVG guide overlay rendered directly over the page/cover */
  guidesOverlay?: React.ReactNode;
  showGuides: boolean;
  onToggleGuides: () => void;
  guidesLabel: string;
  /** Default focus coordinate when switching pages so loupe lands on artwork/fix area */
  defaultFocusPoint?: { x: number; y: number };
  /** Optional preset focus point triggered by parent (e.g. "Spine", "Barcode") */
  externalFocusPoint?: { x: number; y: number; key: number } | null;
}

export function ComparisonViewport({
  beforeSrc,
  afterSrc,
  beforeHiResSrc,
  afterHiResSrc,
  beforeLabel,
  afterLabel,
  aspectRatio,
  altText,
  guidesOverlay,
  showGuides,
  onToggleGuides,
  guidesLabel,
  defaultFocusPoint,
  externalFocusPoint,
}: ComparisonViewportProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [zoom, setZoom] = useState<ZoomLevel>(400);
  const [splitPos, setSplitPos] = useState<number>(50);
  const [focusPt, setFocusPt] = useState<{ x: number; y: number }>(
    defaultFocusPoint ?? { x: 50, y: 45 },
  );
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isDraggingSplit, setIsDraggingSplit] = useState<boolean>(false);
  const [loadedBefore, setLoadedBefore] = useState<boolean>(false);
  const [loadedAfter, setLoadedAfter] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoadedBefore(false);
    setLoadedAfter(false);
    if (defaultFocusPoint) {
      setFocusPt(defaultFocusPoint);
    }
  }, [beforeSrc, afterSrc, defaultFocusPoint?.x, defaultFocusPoint?.y]);

  useEffect(() => {
    if (externalFocusPoint) {
      setFocusPt({ x: externalFocusPoint.x, y: externalFocusPoint.y });
      setIsLocked(true);
      setViewMode('loupe');
      setZoom(400);
    }
  }, [externalFocusPoint]);

  const updatePointerCoords = (clientX: number, clientY: number, force = false) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const xPct = clampPercentage(((clientX - rect.left) / rect.width) * 100);
    const yPct = clampPercentage(((clientY - rect.top) / rect.height) * 100);

    if (isDraggingSplit && viewMode === 'split') {
      setSplitPos(xPct);
    }
    if (force || !isLocked) {
      setFocusPt({ x: xPct, y: yPct });
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    updatePointerCoords(e.clientX, e.clientY, false);
  };

  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewMode === 'loupe' || zoom > 100) {
      updatePointerCoords(e.clientX, e.clientY, true);
      setIsLocked((prev) => !prev);
    }
  };

  const showLoupePanel = viewMode === 'loupe' || zoom >= 200;

  return (
    <div className="space-y-4">
      {/* Inspection Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3">
        {/* Mode Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg" role="group" aria-label="وضع المعاينة">
          {(
            [
              { id: 'split', label: 'منزلق قبل/بعد', icon: SplitSquareHorizontal },
              { id: 'loupe', label: 'عدسة 400%', icon: ZoomIn },
              { id: 'after', label: 'النهائي فقط', icon: Eye },
              { id: 'before', label: 'الأصل فقط', icon: Eye },
            ] as const
          ).map((m) => {
            const Icon = m.icon;
            const active = viewMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setViewMode(m.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-white text-slate-950 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Zoom Level + Guides Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg" role="group" aria-label="نسبة التكبير">
            {([100, 200, 400] as ZoomLevel[]).map((z) => (
              <button
                key={z}
                type="button"
                onClick={() => setZoom(z)}
                className={`px-2.5 py-1.5 text-xs font-mono tabular-nums rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  zoom === z
                    ? 'bg-white text-blue-700 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {z}%
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onToggleGuides}
            aria-pressed={showGuides}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              showGuides
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{guidesLabel}</span>
          </button>
        </div>
      </div>

      {/* Main Prepress Canvas + Optional Synchronized 400% Dual Macro Loupe */}
      <div className={`grid gap-5 ${showLoupePanel ? 'grid-cols-1 xl:grid-cols-12 items-start' : 'grid-cols-1'}`}>
        {/* Primary Page/Cover Preview Stage */}
        <div
          className={`${
            showLoupePanel ? 'xl:col-span-7' : ''
          } prepress-grid border border-slate-200 rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center`}
        >
          <div className="w-full flex items-center justify-between text-xs text-slate-600 mb-3">
            <span className="font-medium text-slate-800">
              {viewMode === 'split'
                ? 'اسحب الخط الفاصل أو حرّك المؤشر لفحص التفاصيل بالعدسة'
                : viewMode === 'loupe'
                  ? isLocked
                    ? 'نقطة العدسة مُثبّتة — اضغط على الصفحة لتحريرها'
                    : 'حرّك المؤشر فوق الصفحة أو اضغط لتثبيت نقطة التكبير'
                  : viewMode === 'after'
                    ? afterLabel
                    : beforeLabel}
            </span>
            <span className="font-mono tabular-nums text-slate-500">
              X {focusPt.x.toFixed(0)}% · Y {focusPt.y.toFixed(0)}%
            </span>
          </div>

          {/* Exact-Aspect-Ratio Page Frame (LTR internal coordinates for accurate left/right split & print overlays) */}
          <div
            ref={stageRef}
            dir="ltr"
            data-testid="comparison-stage"
            onPointerMove={handlePointerMove}
            onPointerUp={() => setIsDraggingSplit(false)}
            onPointerLeave={() => setIsDraggingSplit(false)}
            onClick={handleStageClick}
            style={{ aspectRatio: String(aspectRatio) }}
            className="relative w-full max-w-[680px] bg-white shadow-sm border border-slate-300 overflow-hidden select-none cursor-crosshair"
          >
            {/* Loading Skeleton */}
            {(!loadedBefore || !loadedAfter) && (
              <div className="absolute inset-0 z-20 bg-slate-100/80 flex items-center justify-center">
                <span className="text-xs font-medium text-slate-600">جاري تجهيز المعاينة عالية الدقة...</span>
              </div>
            )}

            {/* Base Layer: AFTER (Vector Master) */}
            <img
              src={afterSrc}
              alt={`${altText} — ${afterLabel}`}
              onLoad={() => setLoadedAfter(true)}
              draggable={false}
              className={`absolute inset-0 w-full h-full object-fill ${
                viewMode === 'before' ? 'opacity-0' : 'opacity-100'
              }`}
            />

            {/* Overlay Layer: BEFORE (Original PDF), clipped cleanly in split mode */}
            <div
              style={{
                clipPath:
                  viewMode === 'split'
                    ? `inset(0 ${100 - splitPos}% 0 0)`
                    : viewMode === 'before'
                      ? 'inset(0 0 0 0)'
                      : 'inset(0 100% 0 0)',
              }}
              className="absolute inset-0"
            >
              <img
                src={beforeSrc}
                alt={`${altText} — ${beforeLabel}`}
                onLoad={() => setLoadedBefore(true)}
                draggable={false}
                className="w-full h-full object-fill"
              />
            </div>

            {/* KDP Print Guide Overlays (Trim, Bleed, Gutter, Spine, Barcode) */}
            {showGuides && guidesOverlay && (
              <div className="absolute inset-0 pointer-events-none z-10">{guidesOverlay}</div>
            )}

            {/* Interactive Split Divider Handle */}
            {viewMode === 'split' && (
              <div
                style={{ left: `${splitPos}%` }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                  setIsDraggingSplit(true);
                }}
                className="absolute top-0 bottom-0 w-0.5 bg-blue-700 z-20 cursor-ew-resize"
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-blue-700 text-white shadow flex items-center justify-center text-xs font-bold">
                  ⇄
                </div>
              </div>
            )}

            {/* Synchronized Loupe Reticle Marker */}
            {showLoupePanel && (
              <div
                style={{ left: `${focusPt.x}%`, top: `${focusPt.y}%` }}
                aria-hidden="true"
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-2 pointer-events-none z-20 ${
                  isLocked ? 'border-blue-700 bg-blue-500/10' : 'border-slate-900/70 bg-white/10'
                }`}
              />
            )}

            {/* Corner Unboxed Labels inside Split View */}
            {viewMode === 'split' && (
              <>
                <div
                  dir="rtl"
                  className="absolute top-2 left-2 z-20 bg-slate-900/85 text-white text-[11px] font-medium px-2.5 py-0.5 rounded pointer-events-none"
                >
                  قبل: {beforeLabel}
                </div>
                <div
                  dir="rtl"
                  className="absolute top-2 right-2 z-20 bg-blue-700/90 text-white text-[11px] font-medium px-2.5 py-0.5 rounded pointer-events-none"
                >
                  بعد: {afterLabel}
                </div>
              </>
            )}
          </div>

          {/* Accessible Split Range Slider */}
          {viewMode === 'split' && (
            <div className="w-full max-w-[680px] mt-4 flex items-center gap-3">
              <label htmlFor="split-slider" className="text-xs font-medium text-slate-600 whitespace-nowrap">
                نسبة المقارنة
              </label>
              <input
                id="split-slider"
                type="range"
                min={0}
                max={100}
                value={Math.round(splitPos)}
                onChange={(e) => setSplitPos(Number(e.target.value))}
                className="flex-1 accent-blue-700 cursor-pointer"
              />
              <span className="text-xs font-mono tabular-nums text-slate-700 w-10 text-left">
                {Math.round(splitPos)}%
              </span>
            </div>
          )}
        </div>

        {/* Synchronized Side-by-Side 200%/400% Macro Inspection Panel */}
        {showLoupePanel && (
          <div className="xl:col-span-5 bg-white border border-slate-200 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-950">
                  عدسة المقارنة المكبّرة ({zoom}%)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  مقارنة حقيقية من ملفي PDF بنفس الإحداثيات ({focusPt.x.toFixed(0)}%, {focusPt.y.toFixed(0)}%)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLocked((prev) => !prev)}
                aria-label={isLocked ? 'تحرير نقطة التكبير' : 'تثبيت نقطة التكبير'}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isLocked
                    ? 'bg-blue-50 border-blue-200 text-blue-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {isLocked ? <Lock className="w-3.5 h-3.5" aria-hidden="true" /> : <Unlock className="w-3.5 h-3.5" aria-hidden="true" />}
                <span>{isLocked ? 'مثبّت' : 'تتبّع المؤشر'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
              {/* Original 300 DPI Macro Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">الأصل (قبل الترقية)</span>
                  <span className="text-slate-500">{beforeLabel}</span>
                </div>
                <div
                  data-testid="loupe-before"
                  style={{
                    backgroundImage: `url("${beforeHiResSrc}")`,
                    backgroundSize: `${zoom}%`,
                    backgroundPosition: `${focusPt.x}% ${focusPt.y}%`,
                    backgroundRepeat: 'no-repeat',
                  }}
                  className="w-full h-56 rounded-lg border border-slate-300 bg-white overflow-hidden"
                />
              </div>

              {/* Mastered Vector / 450 DPI Macro Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-blue-800">النسخة النهائية (بعد الترقية)</span>
                  <span className="text-emerald-700 font-medium">{afterLabel}</span>
                </div>
                <div
                  data-testid="loupe-after"
                  style={{
                    backgroundImage: `url("${afterHiResSrc}")`,
                    backgroundSize: `${zoom}%`,
                    backgroundPosition: `${focusPt.x}% ${focusPt.y}%`,
                    backgroundRepeat: 'no-repeat',
                  }}
                  className="w-full h-56 rounded-lg border-2 border-blue-700 bg-white overflow-hidden"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
