// pages/[code].js
import db from '../lib/db';

export async function getServerSideProps({ params, res }) {
  const { code } = params;

  try {
    const result = await db.query(
      `UPDATE links SET clicks = clicks + 1, last_clicked = now()
       WHERE code = $1
       RETURNING target_url`,
      [code]
    );

    if (result.rowCount === 0) {
      res.statusCode = 404;
      return { notFound: true };
    }

    const target = result.rows[0].target_url;
    res.setHeader('Location', target);
    res.statusCode = 302;
    res.end();
    return { props: {} };
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    return { props: {} };
  }
}

export default function RedirectPage() { return null; }
