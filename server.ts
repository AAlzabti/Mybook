import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const ROOT = process.cwd();
const ORIG_INTERIOR = path.join(
  ROOT,
  'public/assets/aistudio/Nova_and_the_Fallen_Stars_Interior_92p_KDP_0ef6f7e7.pdf',
);
const ORIG_COVER = path.join(
  ROOT,
  'public/assets/aistudio/Nova_and_the_Fallen_Stars_Full_Wrap_Cover_KDP_fd61fdb0.pdf',
);
const MASTER_INTERIOR = path.join(
  ROOT,
  'public/output/Nova_and_the_Fallen_Stars_Interior_92p_KDP_Vector_Master.pdf',
);
const MASTER_COVER = path.join(
  ROOT,
  'public/output/Nova_and_the_Fallen_Stars_Full_Wrap_Cover_KDP_Master.pdf',
);
const AUDIT_JSON = path.join(ROOT, 'public/output/audit-report.json');
const CACHE_DIR = '/tmp/nova_kdp_render_cache';

fs.mkdirSync(CACHE_DIR, { recursive: true });

// Deduplicate concurrent Ghostscript renders for the same page/version/dpi
const inflightRenders = new Map<string, Promise<string>>();

async function renderPdfPageCached(
  pdfPath: string,
  cacheKey: string,
  pageNum: number,
  dpi: number,
  color: boolean,
): Promise<string> {
  const outPng = path.join(CACHE_DIR, `${cacheKey}.png`);
  if (fs.existsSync(outPng)) {
    return outPng;
  }
  const existing = inflightRenders.get(cacheKey);
  if (existing) return existing;

  const task = (async () => {
    const tmpPng = `${outPng}.${process.pid}.${Date.now()}.tmp.png`;
    await execFileAsync('gs', [
      '-q',
      '-dNOPAUSE',
      '-dBATCH',
      `-sDEVICE=${color ? 'png16m' : 'pnggray'}`,
      `-r${dpi}`,
      '-dTextAlphaBits=4',
      '-dGraphicsAlphaBits=4',
      `-dFirstPage=${pageNum}`,
      `-dLastPage=${pageNum}`,
      `-sOutputFile=${tmpPng}`,
      pdfPath,
    ]);
    fs.renameSync(tmpPng, outPng);
    return outPng;
  })();

  inflightRenders.set(cacheKey, task);
  try {
    return await task;
  } finally {
    inflightRenders.delete(cacheKey);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.get('/api/audit', (_req, res) => {
    if (!fs.existsSync(AUDIT_JSON)) {
      res.status(404).json({ error: 'Audit report not yet generated' });
      return;
    }
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.sendFile(AUDIT_JSON);
  });

  app.get('/api/download/interior', (_req, res) => {
    if (!fs.existsSync(MASTER_INTERIOR)) {
      res.status(404).json({ error: 'Master interior PDF not found' });
      return;
    }
    res.download(MASTER_INTERIOR, 'Nova_and_the_Fallen_Stars_Interior_92p_KDP_Vector_Master.pdf');
  });

  app.get('/api/download/cover', (_req, res) => {
    if (!fs.existsSync(MASTER_COVER)) {
      res.status(404).json({ error: 'Master cover PDF not found' });
      return;
    }
    res.download(MASTER_COVER, 'Nova_and_the_Fallen_Stars_Full_Wrap_Cover_KDP_Master.pdf');
  });

  app.get('/api/render/interior/:version/:page', async (req, res) => {
    const version = req.params.version === 'before' ? 'before' : req.params.version === 'after' ? 'after' : null;
    const pageNum = parseInt(req.params.page, 10);
    const reqDpi = parseInt(String(req.query.dpi ?? '144'), 10);
    const dpi = reqDpi >= 260 ? 300 : 144;

    if (!version || !Number.isInteger(pageNum) || pageNum < 1 || pageNum > 92) {
      res.status(400).json({ error: 'Invalid version or page number (1-92)' });
      return;
    }

    const pdfPath = version === 'before' ? ORIG_INTERIOR : MASTER_INTERIOR;
    if (!fs.existsSync(pdfPath)) {
      res.status(404).json({ error: 'PDF file unavailable' });
      return;
    }

    try {
      const mtime = Math.floor(fs.statSync(pdfPath).mtimeMs);
      const cacheKey = `int_${version}_p${pageNum}_d${dpi}_${mtime}`;
      const pngPath = await renderPdfPageCached(pdfPath, cacheKey, pageNum, dpi, false);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('Content-Type', 'image/png');
      res.sendFile(pngPath);
    } catch (err) {
      console.error('Render interior error:', err);
      res.status(500).json({ error: 'Failed to render interior page' });
    }
  });

  app.get('/api/render/cover/:version', async (req, res) => {
    const version = req.params.version === 'before' ? 'before' : req.params.version === 'after' ? 'after' : null;
    const reqDpi = parseInt(String(req.query.dpi ?? '120'), 10);
    const dpi = reqDpi >= 200 ? 240 : 120;

    if (!version) {
      res.status(400).json({ error: 'Invalid cover version' });
      return;
    }

    const pdfPath = version === 'before' ? ORIG_COVER : MASTER_COVER;
    if (!fs.existsSync(pdfPath)) {
      res.status(404).json({ error: 'Cover PDF unavailable' });
      return;
    }

    try {
      const preRendered = path.join(ROOT, `public/output/previews/cover_${version}_${dpi}.png`);
      if (fs.existsSync(preRendered)) {
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.setHeader('Content-Type', 'image/png');
        res.sendFile(preRendered);
        return;
      }
      const mtime = Math.floor(fs.statSync(pdfPath).mtimeMs);
      const cacheKey = `cov_${version}_d${dpi}_${mtime}`;
      const pngPath = await renderPdfPageCached(pdfPath, cacheKey, 1, dpi, true);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('Content-Type', 'image/png');
      res.sendFile(pngPath);
    } catch (err) {
      console.error('Render cover error:', err);
      res.status(500).json({ error: 'Failed to render cover' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(ROOT, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nova KDP Print Studio server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server boot failed:', err);
  process.exit(1);
});
