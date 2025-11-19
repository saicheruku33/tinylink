// pages/code/[code].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
const base = process.env.NEXT_PUBLIC_BASE_URL || '';

export default function CodePage() {
  const router = useRouter();
  const { code } = router.query;
  const [data, setData] = useState(null);

  useEffect(()=> {
    if (!code) return;
    fetch('/api/links/' + code).then(r=> {
      if (!r.ok) return null;
      return r.json();
    }).then(setData).catch(()=>setData(null));
  }, [code]);

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-2">Stats for {data.code}</h1>
      <p>URL: <a href={data.url} target="_blank" rel="noreferrer">{data.url}</a></p>
      <p>Clicks: {data.clicks}</p>
      <p>Last clicked: {data.last_clicked ? new Date(data.last_clicked).toLocaleString() : '-'}</p>
      <p>Short URL: <a href={`${base}/${data.code}`} target="_blank" rel="noreferrer">{base}/{data.code}</a></p>
    </div>
  );
}
