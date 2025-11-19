// pages/index.js
import { useState, useEffect } from 'react';

export default function Home() {
  const [links, setLinks] = useState([]);
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const base = process.env.NEXT_PUBLIC_BASE_URL || '';

  const fetchLinks = async () => {
    const r = await fetch('/api/links');
    if (r.ok) setLinks(await r.json());
  };

  useEffect(() => { fetchLinks(); }, []);

  const create = async (e) => {
    e.preventDefault();
    setLoading(true);
    const r = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, code: code || undefined })
    });
    if (r.ok) { setUrl(''); setCode(''); fetchLinks(); } 
    else { alert('Error: ' + JSON.stringify(await r.json())); }
    setLoading(false);
  };

  const remove = async (c) => {
    if (!confirm('Delete ' + c + '?')) return;
    await fetch('/api/links/' + c, { method: 'DELETE' });
    fetchLinks();
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">TinyLink</h1>

        <form onSubmit={create} className="mb-6 flex gap-2">
          <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://example.com" className="border p-2 flex-1" />
          <input value={code} onChange={e=>setCode(e.target.value)} placeholder="optional code" className="border p-2 w-48" />
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-3 py-2 rounded">
            {loading ? 'Creating...' : 'Create'}
          </button>
        </form>

        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">Short</th><th>URL</th><th>Clicks</th><th>Last</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map(l => (
              <tr key={l.code} className="border-t">
                <td className="p-3"><a href={`${base}/${l.code}`} target="_blank" rel="noreferrer" className="text-blue-600">{l.code}</a></td>
                <td className="p-3"><a href={l.url} target="_blank" rel="noreferrer">{l.url}</a></td>
                <td className="p-3">{l.clicks}</td>
                <td className="p-3">{l.last_clicked ? new Date(l.last_clicked).toLocaleString() : '-'}</td>
                <td className="p-3"><button onClick={()=>remove(l.code)} className="text-red-600">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
