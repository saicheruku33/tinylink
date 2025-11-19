🚀 TinyLink — Modern URL Shortener (Next.js + PostgreSQL + Neon)

TinyLink is a full-stack URL shortening service built with Next.js, PostgreSQL (Neon), and Vercel.
It supports:

Creating short links

Optional custom short codes

Redirect handling

Click-count tracking

Fetching link statistics

Deleting links

RESTful API with validation

Fully deployed production instance

🌐 Live Demo

👉 Frontend/API: https://tinylink-five.vercel.app/

👉 Repository: https://github.com/saicheruku33/tinylink

👉 Assignment Details: /mnt/data/Take-Home Assignment_ TinyLink (1) (2).pdf

📚 Table of Contents

Features

Tech Stack

Architecture

Database Schema

API Endpoints

Environment Variables

Local Development Setup

Curl Test Commands

Deployment (Vercel + Neon)



⭐ Features
🔗 URL Shortening

Generate short URLs automatically

Provide custom short codes manually

🔁 Redirection

Visiting /<code> redirects instantly to the target URL

Uses 302 Found http redirect

📊 Analytics

Track click count

Track last clicked timestamp

🧼 CRUD Support

Create link

Fetch all links

Fetch link stats

Delete link

⚙️ Modern Stack

Next.js App Router

Neon Serverless PostgreSQL

Serverless Functions (Vercel)

Tailwind CSS

🛠 Tech Stack
Layer	Technology
Frontend	Next.js 16, React, Tailwind CSS
Backend	Next.js API Routes (Serverless)
Database	PostgreSQL (Neon Serverless)
Deployment	Vercel
Language	JavaScript
Libraries	pg, zod, dotenv
🧱 Architecture
Next.js App
 ├── pages/
 │   ├── index.js          → Dashboard UI
 │   ├── [code].js         → Redirect handler
 │   └── api/
 │       ├── healthz.js    → Health check
 │       └── links/
 │            ├── index.js → GET all, POST create
 │            └── [code].js→ GET stats, DELETE link
 ├── lib/
 │   ├── db.js             → PostgreSQL connection pool
 │   └── validators.js     → Input validation (zod)
 ├── migrations/
 │   └── 001_create_links.sql
 └── styles/, public/, etc.

🗄 Database Schema
CREATE TABLE IF NOT EXISTS links (
  code VARCHAR(8) PRIMARY KEY,
  target_url TEXT NOT NULL,
  clicks INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_clicked TIMESTAMP WITH TIME ZONE
);

🔌 API Endpoints
➤ GET /api/healthz

Healthcheck.

Response

{ "ok": true, "version": "1.0" }

➤ POST /api/links

Create a short link.

Automatic code
{
  "url": "https://example.com"
}

Custom code
{
  "url": "https://example.com/docs",
  "code": "abc1234"
}


Response

{
  "code": "abc1234",
  "url": "https://example.com/docs",
  "clicks": 0,
  "last_clicked": null
}

➤ GET /api/links

Fetch all links.

➤ GET /api/links/:code

Fetch stats for a single link.

➤ DELETE /api/links/:code

Delete a link permanently.

➤ GET /:code

Redirect to the original URL.

🔐 Environment Variables

Create a .env.local file:

DATABASE_URL=postgresql://USER:PASSWORD@HOST/neondb?sslmode=require
NEXT_PUBLIC_BASE_URL=http://localhost:3000


On Vercel, set:

Name	Value	Environment
DATABASE_URL	your Neon DB URL	Production
NEXT_PUBLIC_BASE_URL	https://tinylink-five.vercel.app
	Production
NODE_ENV	production	Production
🧑‍💻 Local Development Setup
1. Clone the repo
git clone https://github.com/saicheruku33/tinylink
cd tinylink

2. Install dependencies
npm install

3. Add .env.local
DATABASE_URL=YOUR_NEON_URL

4. Start dev server
npm run dev


App runs at:
👉 http://localhost:3000/

⚒ Curl Test Commands
Healthcheck
curl -i https://tinylink-five.vercel.app/api/healthz

Create automatic code
curl -i -X POST https://tinylink-five.vercel.app/api/links ^
  -H "Content-Type: application/json" ^
  -d "{\"url\":\"https://example.com\"}"

Create custom code
curl -i -X POST https://tinylink-five.vercel.app/api/links ^
  -H "Content-Type: application/json" ^
  -d "{\"url\":\"https://example.com/docs\",\"code\":\"abc1234\"}"

Fetch all links
curl https://tinylink-five.vercel.app/api/links

Get stats
curl https://tinylink-five.vercel.app/api/links/abc1234

Test redirect
curl -I https://tinylink-five.vercel.app/abc1234

Delete link
curl -i -X DELETE https://tinylink-five.vercel.app/api/links/abc1234

🚀 Deployment (Vercel + Neon)
Neon

Create serverless PostgreSQL database

Copy the connection string (pooler endpoint)

Ensure it ends with ?sslmode=require

Vercel

Import GitHub repo

Add Production Env vars

Deploy

Test APIs