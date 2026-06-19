# Warung Nusantara 🍜

Website pemesanan makanan dengan integrasi Midtrans Snap.

## Deploy ke Vercel

### 1. Upload ke GitHub
```bash
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/USERNAME/warung-nusantara.git
git push -u origin main
```

### 2. Import ke Vercel
- Buka https://vercel.com/new
- Import repo GitHub kamu
- Klik Deploy

### 3. Set Environment Variable di Vercel
Masuk ke: **Project > Settings > Environment Variables**

| Name | Value |
|------|-------|
| `MIDTRANS_SERVER_KEY` | `Mid-server-xxxxxxxxxx` (Server Key baru kamu) |

### 4. Redeploy
Setelah set env variable, klik **Redeploy**.

## Struktur Project
```
warung-nusantara/
├── public/
│   └── index.html        ← Frontend website
├── api/
│   └── create-transaction.js  ← Serverless function (Server Key aman di sini)
├── vercel.json
├── package.json
└── .env.example
```

## Sandbox Testing Midtrans
Gunakan kartu test: https://docs.midtrans.com/docs/testing-payment
