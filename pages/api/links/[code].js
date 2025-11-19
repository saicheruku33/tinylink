// pages/api/links/[code].js
import db from '../../../lib/db';
import { validateCode } from '../../../lib/validators';

export default async function handler(req, res) {
  const { code } = req.query;
  if (!validateCode(code)) return res.status(400).json({ error: 'invalid_code' });

  if (req.method === 'GET') {
    try {
      const r = await db.query('SELECT code, target_url AS url, clicks, last_clicked FROM links WHERE code=$1', [code]);
      if (r.rowCount === 0) return res.status(404).json({ error: 'not_found' });
      return res.status(200).json(r.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'server_error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const r = await db.query('DELETE FROM links WHERE code=$1 RETURNING code', [code]);
      if (r.rowCount === 0) return res.status(404).json({ error: 'not_found' });
      return res.status(204).end();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'server_error' });
    }
  }

  res.setHeader('Allow', 'GET, DELETE');
  res.status(405).end('Method Not Allowed');
}
