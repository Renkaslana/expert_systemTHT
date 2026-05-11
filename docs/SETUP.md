# Panduan Setup — Diagnova

> Step-by-step lengkap untuk developer yang baru clone project ini.
> Untuk quick start, lihat [README utama](../README.md#4-quick-start).

**Estimasi waktu:** 15–30 menit (tergantung kecepatan internet untuk
download Node, PostgreSQL, dan npm packages).

---

## 📋 Prasyarat

Tools yang **wajib** terinstall sebelum mulai:

| Tool | Versi minimal | Cek versi | Link |
|---|---|---|---|
| Node.js | 20.0+ | `node --version` | https://nodejs.org/ |
| npm | 10.0+ | `npm --version` | (bawaan Node) |
| PostgreSQL | 15+ | `psql --version` | https://www.postgresql.org/ |
| Git | any | `git --version` | https://git-scm.com/ |

Tools **opsional** tapi sangat membantu:

| Tool | Tujuan |
|---|---|
| VS Code | IDE — dengan extensions ESLint, Prettier, Prisma |
| pgAdmin / DBeaver | GUI untuk inspect database |
| Postman / Insomnia | Test API endpoint |

---

## 1. Install Prasyarat per OS

### 1.1 Windows

**Node.js + npm:**

```powershell
# Via winget (Windows Package Manager — bawaan Windows 10/11)
winget install OpenJS.NodeJS.LTS

# Verifikasi
node --version    # harus ≥ v20.0.0
npm --version
```

Alternative: download installer dari https://nodejs.org/

**PostgreSQL 17:**

```powershell
# Via winget (instalasi unattended dengan password "postgres")
winget install PostgreSQL.PostgreSQL.17 `
  --accept-package-agreements --accept-source-agreements --silent `
  --override "--mode unattended --superpassword postgres --servicename postgresql-x64-17 --serviceaccount postgres --servicepassword postgres --serverport 5432 --locale C"

# Cek service running
sc query postgresql-x64-17 | findstr STATE
# Expected: STATE : 4 RUNNING

# Tambahkan psql ke PATH (sesuaikan versi kalau perlu)
# Default install location: C:\Program Files\PostgreSQL\17\bin
# Bisa ditambah ke User PATH via System Properties → Environment Variables
```

Atau download installer dari https://www.postgresql.org/download/windows/

**Git:**

```powershell
winget install Git.Git
```

### 1.2 macOS

**Node.js + npm via Homebrew:**

```bash
brew install node@20
node --version
```

**PostgreSQL 17:**

```bash
brew install postgresql@17
brew services start postgresql@17

# Verify
psql --version
```

**Git:**

```bash
brew install git
# atau pakai bawaan macOS
```

### 1.3 Linux (Ubuntu / Debian)

**Node.js 20 via NodeSource:**

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
```

**PostgreSQL 17:**

```bash
sudo sh -c 'echo "deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get install -y postgresql-17

# Service running otomatis
sudo systemctl status postgresql
```

**Git:**

```bash
sudo apt-get install -y git
```

### 1.4 Linux (Fedora / RHEL)

```bash
# Node 20
sudo dnf install -y nodejs

# PostgreSQL
sudo dnf install -y postgresql-server postgresql-contrib
sudo postgresql-setup --initdb
sudo systemctl enable --now postgresql

# Git
sudo dnf install -y git
```

---

## 2. Setup Database

### 2.1 Set password user `postgres` (kalau belum)

**Windows (via winget di atas):** password `postgres` sudah di-set otomatis.

**macOS / Linux:**

```bash
# Switch ke user postgres dan masuk psql
sudo -u postgres psql

# Di dalam psql:
ALTER USER postgres WITH PASSWORD 'postgres';
\q
```

### 2.2 Buat database `diagnova`

```bash
# Linux/macOS:
psql -U postgres -c "CREATE DATABASE diagnova;"

# Windows (kalau psql di PATH):
psql -U postgres -c "CREATE DATABASE diagnova;"

# Windows (kalau psql tidak di PATH):
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "CREATE DATABASE diagnova;"
```

Output yang diharapkan: `CREATE DATABASE`

### 2.3 Verifikasi koneksi

```bash
psql -U postgres -d diagnova -c "\dt"
# Expected: "Did not find any relations." (karena belum ada tabel)
```

---

## 3. Clone Repository

```bash
git clone <repository-url>
cd Sistem_Pakar_THT
```

Sekarang Anda harus melihat struktur:

```
Sistem_Pakar_THT/
├── frontend/
├── backend/
├── docs/
├── .gitignore
└── README.md
```

---

## 4. Setup Backend

### 4.1 Install dependencies

```bash
cd backend
npm install
```

Output yang diharapkan:
```
added 294 packages, and audited 295 packages in 23s
```

### 4.2 Konfigurasi environment

```bash
# Copy template
cp .env.example .env

# Edit kalau credentials PostgreSQL Anda beda
# Default (yang sesuai dengan setup di section 2):
#   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/diagnova?schema=public"
#   PORT=3001
#   CORS_ORIGIN=http://localhost:5173
#   LOG_LEVEL=info
```

Edit `.env` dengan editor favorit kalau perlu:

```bash
# Linux/macOS
nano .env

# Windows
notepad .env

# atau buka di VS Code
code .env
```

### 4.3 Generate Prisma client

```bash
npm run prisma:generate
```

Output: `✔ Generated Prisma Client`

### 4.4 Apply migrations (buat tabel)

```bash
npm run prisma:migrate:deploy
```

Output: `All migrations have been successfully applied.`

Verifikasi:

```bash
psql -U postgres -d diagnova -c "\dt"
```

Expected: 6 tables muncul (`_prisma_migrations`, `cf_rules`,
`consultation_results`, `consultation_sessions`, `diseases`, `symptoms`).

### 4.5 Seed knowledge base

```bash
npm run prisma:seed
```

Output:
```
🌱 Diagnova KB seeder — Setyaputri 2018 (Tabel I, II, III)

📝 Seeding 24 symptoms…
📝 Seeding 5 diseases…
📝 Seeding 34 CF rules…

✅ Knowledge base ready:
   Symptoms : 24/24
   Diseases : 5/5
   CF Rules : 34/34
```

Verifikasi:

```bash
psql -U postgres -d diagnova -c "
  SELECT 'symptoms' as t, COUNT(*) FROM symptoms
  UNION ALL SELECT 'diseases', COUNT(*) FROM diseases
  UNION ALL SELECT 'cf_rules', COUNT(*) FROM cf_rules;
"
```

Expected output:
```
     t    | count
----------+-------
 symptoms |    24
 diseases |     5
 cf_rules |    34
```

### 4.6 Test backend tests

```bash
npm test
```

Expected: `83/83 tests pass` dalam ~3 detik.

### 4.7 Jalankan backend

```bash
npm run dev
```

Output:
```
[2026-05-11T13:00:00.000Z] INFO  🚀 Diagnova API ready {
  "env": "development",
  "port": 3001,
  "url": "http://localhost:3001/api/v1"
}
```

**Biarkan terminal ini terbuka.** Server akan auto-restart kalau Anda
edit file `backend/src/**/*.ts`.

### 4.8 Verifikasi backend live

Buka **terminal baru**:

```bash
curl http://localhost:3001/api/v1/health
```

Expected:
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "uptime": 5,
    "dbConnected": true,
    "timestamp": "2026-05-11T13:00:05.123Z"
  },
  "message": "Service healthy"
}
```

Kalau `dbConnected: false` → lihat [Troubleshooting](#troubleshooting).

---

## 5. Setup Frontend

### 5.1 Install dependencies

Buka **terminal baru** (atau gunakan terminal yang sama dengan curl tadi):

```bash
cd frontend           # dari root project
npm install
```

### 5.2 Konfigurasi environment

```bash
cp .env.example .env.local
```

Default content sudah benar untuk dev:

```
VITE_API_URL=http://localhost:3001/api/v1
```

### 5.3 Jalankan frontend

```bash
npm run dev
```

Output:
```
  VITE v5.4.21  ready in 800 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Biarkan terminal ini terbuka juga.** Vite akan hot-reload kalau Anda
edit file `frontend/src/**/*.tsx`.

### 5.4 Buka browser

http://localhost:5173

Anda akan lihat landing page Diagnova. 🎉

---

## 6. End-to-End Test

Coba flow utama:

1. Klik **"Konsultasi"** di navbar atau hero
2. Di halaman `/konsultasi`:
   - Pilih area **"Telinga"**
   - Centang gejala **"Telinga nyeri"** dengan tingkat **"Pasti"** (1.0)
   - Centang gejala **"Pendengaran berkurang"** dengan tingkat **"Sangat Mungkin"** (0.6)
   - Centang gejala **"Telinga berdengung"** dengan tingkat **"Mungkin"** (0.4)
3. Klik tombol **"Mulai Diagnosis"**
4. **Expected:** animasi loading multi-stage ~2.2 detik
5. Otomatis navigasi ke `/hasil`
6. **Expected hasil:**
   - Rank 1: **Otitis Eksterna** (P003) CF ~92%
   - Rank 2: **Otitis Media Akut** (P001) CF ~90%
   - Rank 3: **Serumen Obsturans** (P002) CF ~48%

Setiap result punya:
- Confidence meter (CF gauge)
- Contribution chart per gejala
- Explainability Panel dengan iteration steps + rumus

Setup sukses! ✅

---

## 7. Workflow setelah setup

### Sehari-hari (kedua server sudah pernah running)

```bash
# Pastikan PostgreSQL service running (cek sekali):
# Windows: sc query postgresql-x64-17
# macOS:   brew services list
# Linux:   sudo systemctl status postgresql

# Buka 2 terminal:

# Terminal 1
cd backend
npm run dev

# Terminal 2 (terminal baru)
cd frontend
npm run dev
```

### Stop semua

- Backend: `Ctrl+C` di terminal 1
- Frontend: `Ctrl+C` di terminal 2
- PostgreSQL: biarkan running (auto-start at boot)

---

## 🛠 Troubleshooting

### `dbConnected: false` di `/health`

**Diagnosis:** PostgreSQL service tidak running, atau credentials salah.

**Cek service:**

```bash
# Windows
sc query postgresql-x64-17

# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql
```

**Start kalau stopped:**

```bash
# Windows (sebagai Administrator)
net start postgresql-x64-17

# macOS
brew services start postgresql@17

# Linux
sudo systemctl start postgresql
```

**Cek credentials di `backend/.env`:**

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

Pastikan USER + PASSWORD match dengan apa yang Anda set di section 2.

---

### `EADDRINUSE: address already in use :::3001`

**Diagnosis:** ada proses lain (mungkin backend dev session sebelumnya)
yang masih pakai port 3001.

**Cek apa yang pakai:**

```bash
# Windows
netstat -ano | findstr ":3001"
# Catat PID di kolom terakhir, lalu:
taskkill /F /PID <pid-nya>

# macOS/Linux
lsof -i :3001
kill -9 <pid-nya>
```

**Alternative:** kill semua node:

```bash
# Windows
taskkill //F //IM node.exe

# macOS/Linux
killall node
```

---

### Frontend: `Network error / CORS / Status: null`

**Diagnosis 1:** Backend tidak running. Cek terminal 1 — pastikan ada
output `🚀 Diagnova API ready`. Curl `http://localhost:3001/api/v1/health`
harus return 200.

**Diagnosis 2:** Preflight cache lama di browser. Solusi:
1. Buka DevTools (F12)
2. Tab **Network** → centang **"Disable cache"**
3. **Hard refresh:** `Ctrl+Shift+R` (Win/Linux) atau `Cmd+Shift+R` (macOS)

**Diagnosis 3:** CORS_ORIGIN di backend salah. Cek `backend/.env`:

```env
CORS_ORIGIN=http://localhost:5173
```

(harus match dengan frontend dev port).

---

### `Prisma migrate error: drift detected`

**Diagnosis:** Schema di-edit manual atau migration corrupt.

**Solusi nuklir (DESTRUCTIVE — hapus semua data):**

```bash
cd backend
npm run db:reset
```

Ini akan:
1. DROP database `diagnova`
2. Re-create
3. Apply semua migrations
4. Auto re-seed

---

### `npm install` gagal

**Diagnosis 1:** Cache corrupt.

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Diagnosis 2:** Node version terlalu lama.

```bash
node --version
# Kalau < 20, upgrade Node dulu
```

---

### Frontend white screen / stuck di loading

**Diagnosis:** Bug AnimatePresence (sudah difix). Kalau muncul lagi:

1. Buka DevTools Console — cek error JavaScript
2. Buka DevTools Network — cek apakah POST /diagnose return 200
3. Kalau API OK tapi UI blank → kemungkinan komponen crash di
   ResultPage. Refresh page dan recoba.

---

### Browser warning: "Mixed content" / "Unsafe"

Localhost development HTTPS biasanya tidak setup. Browser kadang
complain. Untuk dev mode, ini aman diabaikan. Untuk production, pastikan
HTTPS di-setup.

---

## 8. Update / Migrasi

### Update knowledge base (rule base / bobot pakar)

```bash
# Edit backend/prisma/seed.ts
cd backend
npm run prisma:seed       # idempotent — aman re-run berkali-kali
```

### Update database schema

```bash
# Edit backend/prisma/schema.prisma
cd backend
npm run prisma:migrate -- --name "describe_the_change"
# Akan generate file migration di prisma/migrations/
```

### Update dependencies

```bash
# Backend
cd backend
npm outdated              # cek mana yang outdated
npm update                # update minor/patch versions
# Untuk major version, perlu manual edit package.json

# Frontend
cd frontend
npm outdated
npm update
```

---

## 9. Reset Total (Mulai Dari Nol)

Kalau benar-benar stuck dan ingin clean slate:

```bash
# 1. Stop servers (Ctrl+C kedua terminal)

# 2. Hapus database
psql -U postgres -c "DROP DATABASE diagnova;"
psql -U postgres -c "CREATE DATABASE diagnova;"

# 3. Hapus node_modules dan dependencies
cd backend && rm -rf node_modules package-lock.json && npm install
cd ../frontend && rm -rf node_modules package-lock.json && npm install

# 4. Re-setup database
cd ../backend
npm run prisma:migrate:deploy
npm run prisma:seed

# 5. Jalankan lagi
npm run dev
```

---

## 10. Kustomisasi

### Ubah port backend

Edit `backend/.env`:

```env
PORT=3002
```

Dan update `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:3002/api/v1
```

### Ubah port frontend (Vite default 5173)

Edit `frontend/vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    port: 4000,
  },
  // ...
})
```

Dan update `backend/.env`:

```env
CORS_ORIGIN=http://localhost:4000
```

### Pakai database PostgreSQL remote

Edit `backend/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@REMOTE_HOST:5432/diagnova?schema=public&sslmode=require"
```

---

## 11. Apa selanjutnya?

Setelah setup sukses:

- Baca **[README utama](../README.md)** untuk overview
- Baca **[docs/ARCHITECTURE.md](ARCHITECTURE.md)** untuk arsitektur
- Baca **[docs/backend/CF_ENGINE.md](backend/CF_ENGINE.md)** untuk
  pahami algoritma CF
- Buka **[docs/backend/API.md](backend/API.md)** untuk reference endpoint
- Mulai coding di `backend/src/` atau `frontend/src/`

---

## 12. Butuh bantuan?

- File issue di repository (kalau ada)
- Cek dokumentasi terkait di folder `docs/`
- Cek log: backend log via terminal 1, frontend log via DevTools console
