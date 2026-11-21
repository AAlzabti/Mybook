export type PaperStock = 'white-bw' | 'cream-bw' | 'standard-color' | 'premium-color';

export const KDP_PAPER_THICKNESS_IN: Record<PaperStock, number> = {
  'white-bw': 0.002252,
  'cream-bw': 0.0025,
  'standard-color': 0.002252,
  'premium-color': 0.002347,
};

export const KDP_BLEED_IN = 0.125;
export const KDP_BARCODE_WIDTH_IN = 2.0;
export const KDP_BARCODE_HEIGHT_IN = 1.2;
export const KDP_BARCODE_MARGIN_IN = 0.25;
export const KDP_SPINE_TEXT_SIDE_MARGIN_IN = 0.0625;
export const KDP_SPINE_TEXT_MIN_PAGES = 79;
export const PT_PER_INCH = 72;

export interface CoverGeometry {
  trimWidthIn: number;
  trimHeightIn: number;
  bleedIn: number;
  spineWidthIn: number;
  totalWidthIn: number;
  totalHeightIn: number;
  totalWidthPt: number;
  totalHeightPt: number;
  /** X-coordinates in inches from left edge of full-wrap PDF */
  backTrimLeftIn: number;
  backTrimRightIn: number;
  spineLeftIn: number;
  spineRightIn: number;
  frontTrimLeftIn: number;
  frontTrimRightIn: number;
  /** Barcode safe rectangle in inches from top-left of full-wrap PDF */
  barcodeRectIn: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  spineSafeTextHeightIn: number;
  isSpineTextRecommended: boolean;
}

export interface InteriorMarginRules {
  minInsideGutterIn: number;
  minOutsideIn: number;
  minTopBottomIn: number;
}

export function getKdpInteriorMarginRules(pageCount: number, hasBleed: boolean): InteriorMarginRules {
  let minInsideGutterIn = 0.375;
  if (pageCount >= 151 && pageCount <= 300) {
    minInsideGutterIn = 0.5;
  } else if (pageCount >= 301 && pageCount <= 500) {
    minInsideGutterIn = 0.625;
  } else if (pageCount >= 501 && pageCount <= 700) {
    minInsideGutterIn = 0.75;
  } else if (pageCount > 700) {
    minInsideGutterIn = 0.875;
  }

  return {
    minInsideGutterIn,
    minOutsideIn: hasBleed ? 0.375 : 0.25,
    minTopBottomIn: hasBleed ? 0.375 : 0.25,
  };
}

export function calculateKdpCoverGeometry(
  trimWidthIn: number,
  trimHeightIn: number,
  pageCount: number,
  paperStock: PaperStock = 'white-bw',
): CoverGeometry {
  const thickness = KDP_PAPER_THICKNESS_IN[paperStock];
  const spineWidthIn = Number((pageCount * thickness).toFixed(4));
  const totalWidthIn = Number((2 * trimWidthIn + spineWidthIn + 2 * KDP_BLEED_IN).toFixed(4));
  const totalHeightIn = Number((trimHeightIn + 2 * KDP_BLEED_IN).toFixed(4));

  const backTrimLeftIn = KDP_BLEED_IN;
  const backTrimRightIn = Number((KDP_BLEED_IN + trimWidthIn).toFixed(4));
  const spineLeftIn = backTrimRightIn;
  const spineRightIn = Number((spineLeftIn + spineWidthIn).toFixed(4));
  const frontTrimLeftIn = spineRightIn;
  const frontTrimRightIn = Number((frontTrimLeftIn + trimWidthIn).toFixed(4));

  // KDP official barcode zone: 2.0" x 1.2" at bottom-right of back cover,
  // 0.25" left of spine and 0.25" above bottom trim edge (0.375" above PDF bottom edge).
  const barcodeX = Number((spineLeftIn - KDP_BARCODE_MARGIN_IN - KDP_BARCODE_WIDTH_IN).toFixed(4));
  const barcodeY = Number(
    (totalHeightIn - KDP_BLEED_IN - KDP_BARCODE_MARGIN_IN - KDP_BARCODE_HEIGHT_IN).toFixed(4),
  );

  const spineSafeTextHeightIn = Math.max(
    0,
    Number((spineWidthIn - 2 * KDP_SPINE_TEXT_SIDE_MARGIN_IN).toFixed(4)),
  );
  // Under ~130 pages (spine < 0.30"), spine text has very tight tolerances (< 0.175" safe height)
  // and frequently triggers KDP previewer variance warnings or off-center binding prints.
  const isSpineTextRecommended = pageCount >= 130 && spineSafeTextHeightIn >= 0.17;

  return {
    trimWidthIn,
    trimHeightIn,
    bleedIn: KDP_BLEED_IN,
    spineWidthIn,
    totalWidthIn,
    totalHeightIn,
    totalWidthPt: Number((totalWidthIn * PT_PER_INCH).toFixed(2)),
    totalHeightPt: Number((totalHeightIn * PT_PER_INCH).toFixed(2)),
    backTrimLeftIn,
    backTrimRightIn,
    spineLeftIn,
    spineRightIn,
    frontTrimLeftIn,
    frontTrimRightIn,
    barcodeRectIn: {
      x: barcodeX,
      y: barcodeY,
      width: KDP_BARCODE_WIDTH_IN,
      height: KDP_BARCODE_HEIGHT_IN,
    },
    spineSafeTextHeightIn,
    isSpineTextRecommended,
  };
}

export interface PageMarginCheck {
  pageNumber: number;
  side: 'recto' | 'verso';
  leftIn: number;
  rightIn: number;
  topIn: number;
  bottomIn: number;
}

export interface PageMarginEvaluation {
  passes: boolean;
  insideMarginIn: number;
  outsideMarginIn: number;
  violations: string[];
}

export function evaluateInteriorPageMargins(
  page: PageMarginCheck,
  pageCount: number,
  hasBleed: boolean,
): PageMarginEvaluation {
  const rules = getKdpInteriorMarginRules(pageCount, hasBleed);
  // In English LTR books: odd (recto/right-hand) pages bind on LEFT; even (verso/left-hand) bind on RIGHT.
  const insideMarginIn = page.side === 'recto' ? page.leftIn : page.rightIn;
  const outsideMarginIn = page.side === 'recto' ? page.rightIn : page.leftIn;

  const violations: string[] = [];
  if (insideMarginIn < rules.minInsideGutterIn) {
    violations.push(`Inside gutter ${insideMarginIn.toFixed(3)}" < ${rules.minInsideGutterIn}"`);
  }
  if (outsideMarginIn < rules.minOutsideIn) {
    violations.push(`Outside margin ${outsideMarginIn.toFixed(3)}" < ${rules.minOutsideIn}"`);
  }
  if (page.topIn < rules.minTopBottomIn) {
    violations.push(`Top margin ${page.topIn.toFixed(3)}" < ${rules.minTopBottomIn}"`);
  }
  if (page.bottomIn < rules.minTopBottomIn) {
    violations.push(`Bottom margin ${page.bottomIn.toFixed(3)}" < ${rules.minTopBottomIn}"`);
  }

  return {
    passes: violations.length === 0,
    insideMarginIn,
    outsideMarginIn,
    violations,
  };
}

export function clampPercentage(value: number): number {
  if (!Number.isFinite(value)) return 50;
  return Math.max(0, Math.min(100, value));
}
