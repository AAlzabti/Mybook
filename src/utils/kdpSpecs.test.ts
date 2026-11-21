import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateKdpCoverGeometry,
  getKdpInteriorMarginRules,
  evaluateInteriorPageMargins,
  clampPercentage,
} from './kdpSpecs';

test('calculates exact KDP 92-page 8.5x11 white paper cover dimensions', () => {
  const cover = calculateKdpCoverGeometry(8.5, 11.0, 92, 'white-bw');
  assert.equal(cover.spineWidthIn, 0.2072);
  assert.equal(cover.totalWidthIn, 17.4572);
  assert.equal(cover.totalHeightIn, 11.25);
  assert.equal(cover.totalWidthPt, 1256.92);
  assert.equal(cover.totalHeightPt, 810);
  // Spine safe text height is only 0.0822" so spine text is not recommended
  assert.equal(cover.spineSafeTextHeightIn, 0.0822);
  assert.equal(cover.isSpineTextRecommended, false);
});

test('places KDP barcode box at exact 0.25" from spine and bottom trim', () => {
  const cover = calculateKdpCoverGeometry(8.5, 11.0, 92, 'white-bw');
  assert.equal(cover.barcodeRectIn.width, 2.0);
  assert.equal(cover.barcodeRectIn.height, 1.2);
  // Spine left edge is 0.125 + 8.5 = 8.625". Barcode right edge = 8.625 - 0.25 = 8.375", x = 6.375"
  assert.equal(cover.barcodeRectIn.x, 6.375);
  // Bottom trim edge is 11.25 - 0.125 = 11.125". Barcode bottom = 10.875", top y = 9.675"
  assert.equal(cover.barcodeRectIn.y, 9.675);
});

test('validates 92-page no-bleed interior margin thresholds for recto and verso pages', () => {
  const rules = getKdpInteriorMarginRules(92, false);
  assert.equal(rules.minInsideGutterIn, 0.375);
  assert.equal(rules.minOutsideIn, 0.25);

  const rectoPass = evaluateInteriorPageMargins(
    { pageNumber: 9, side: 'recto', leftIn: 0.722, rightIn: 0.611, topIn: 0.5, bottomIn: 0.583 },
    92,
    false,
  );
  assert.equal(rectoPass.passes, true);
  assert.equal(rectoPass.insideMarginIn, 0.722);

  const versoFail = evaluateInteriorPageMargins(
    { pageNumber: 8, side: 'verso', leftIn: 0.5, rightIn: 0.31, topIn: 0.5, bottomIn: 0.5 },
    92,
    false,
  );
  assert.equal(versoFail.passes, false);
  assert.equal(versoFail.violations.length, 1);
});

test('clamps split slider and zoom coordinates safely', () => {
  assert.equal(clampPercentage(-12), 0);
  assert.equal(clampPercentage(142), 100);
  assert.equal(clampPercentage(64.5), 64.5);
  assert.equal(clampPercentage(Number.NaN), 50);
});
