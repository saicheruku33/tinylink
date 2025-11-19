// pages/api/links/index.js
import db from '../../../lib/db';
import { validateUrl, validateCode, generateCode } from '../../../lib/validators';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await db.query('SELECT code, target_url AS url, clicks, last_clicked FROM links ORDER BY created_at DESC');
      return res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'server_error' });
    }
  }

  if (req.method === 'POST') {
    const { url, code } = req.body || {};
    if (!url || !validateUrl(url)) return res.status(400).json({ error: 'invalid_url' });

    let newCode = code;
    if (code) {
      if (!validateCode(code)) return res.status(400).json({ error: 'invalid_code' });
    } else {
      // generate unique code (try up to 7 times)
      for (let i = 0; i < 7; i++) {
        const c = generateCode(6);
        const r = await db.query('SELECT 1 FROM links WHERE code = $1', [c]);
        if (r.rowCount === 0) { newCode = c; break; }
      }
      if (!newCode) return res.status(500).json({ error: 'code_generation_failed' });
    }

    try {
      const insert = await db.query(
        `INSERT INTO links(code, target_url) VALUES ($1, $2) RETURNING code, target_url AS url, clicks, last_clicked`,
        [newCode, url]
      );
      return res.status(201).json(insert.rows[0]);
    } catch (err) {
      if (err.code === '23505') return res.status(409).json({ error: 'code_exists' });
      console.error(err);
      return res.status(500).json({ error: 'server_error' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).end('Method Not Allowed');
}
