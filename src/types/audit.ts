import type { PageCategory } from '../data/bookContent';

export interface PageMarginInfo {
  leftIn: number;
  rightIn: number;
  topIn: number;
  bottomIn: number;
  passes: boolean;
}

export interface AuditPageEntry {
  page: number;
  category: PageCategory;
  side: 'recto' | 'verso';
  title: string;
  chapter?: number;
  hasVisualFix?: boolean;
  fixSummaryAr?: string;
  margins: PageMarginInfo | null;
}

export interface AppliedFix {
  id: string;
  target: 'interior' | 'cover';
  page: number;
  titleAr: string;
  beforeAr: string;
  afterAr: string;
}

export interface AuditReport {
  generatedAt: string;
  bookTitle: string;
  subtitle: string;
  pageCount: number;
  trimSizeIn: { width: number; height: number };
  paperStock: string;
  bleedMode: string;
  interior: {
    original: {
      fileName: string;
      fileSizeBytes: number;
      widthIn: number;
      heightIn: number;
      widthPt: number;
      heightPt: number;
      embeddedFonts: number;
      rasterImages: number;
      encoding: string;
      vectorPaths: boolean;
    };
    master: {
      fileName: string;
      downloadUrl: string;
      fileSizeBytes: number;
      widthIn: number;
      heightIn: number;
      widthPt: number;
      heightPt: number;
      embeddedFonts: number;
      rasterImages: number;
      tracedArtworkPages: number;
      pureVectorTextPages: number;
      blankPages: number;
      encoding: string;
      vectorPaths: boolean;
    };
    margins: {
      minInsideGutterIn: number;
      requiredInsideGutterIn: number;
      minOutsideIn: number;
      requiredOutsideIn: number;
      minTopIn: number;
      minBottomIn: number;
      allPagesPass: boolean;
    };
  };
  cover: {
    original: {
      fileName: string;
      fileSizeBytes: number;
      widthIn: number;
      heightIn: number;
      widthPt: number;
      heightPt: number;
      dpi: number;
      embeddedFonts: number;
      spineTextPresent: boolean;
      barcodeBoxIn: { x: number; y: number; width: number; height: number };
    };
    master: {
      fileName: string;
      downloadUrl: string;
      fileSizeBytes: number;
      widthIn: number;
      heightIn: number;
      widthPt: number;
      heightPt: number;
      dpi: number;
      embeddedFonts: number;
      spineWidthIn: number;
      spineTextPresent: boolean;
      barcodeBoxIn: { x: number; y: number; width: number; height: number };
      hasTrimAndBleedBoxes: boolean;
    };
  };
  fixesApplied: AppliedFix[];
  pages: AuditPageEntry[];
}

export type StudioView = 'audit' | 'interior' | 'cover' | 'kdp-guide';
