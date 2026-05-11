# Prisma Studio (GUI) — Panduan Melihat Struktur & Data Database (Backend Diagnova)

Dokumen ini menjelaskan cara membuka **Prisma Studio** untuk melihat **tabel**, **kolom/struktur**, dan **data** pada database PostgreSQL yang dipakai backend Diagnova.

> Prisma Studio berjalan **lokal** (di laptop kamu). Tidak ada “login Prisma”.
> Prisma Studio membaca koneksi database dari file `backend/.env` melalui `DATABASE_URL`.

---

## 1) Prasyarat

- PostgreSQL sudah ter-install dan **running**
- Node.js sesuai requirement backend (disarankan Node ≥ 20)
- Dependencies backend sudah ter-install
- File env backend sudah benar: `backend/.env`

---

## 2) Pastikan PostgreSQL Running (Windows)

### Opsi A — Services (paling mudah)

1. Tekan `Win + R`
2. Ketik `services.msc` → Enter
3. Cari service bernama `postgresql-x64-XX` (contoh: `postgresql-x64-16`)
4. Pastikan kolom **Status** = `Running`
   - Jika belum: klik kanan → **Start**

### Opsi B — Cek port 5432

Buka PowerShell lalu jalankan:

```powershell
netstat -ano | findstr :5432
```

Jika ada baris `LISTENING`, berarti ada proses yang mendengarkan di port 5432 (umumnya PostgreSQL).

---

## 3) Konfigurasi Koneksi Database (`DATABASE_URL`)

1. Buka file: `backend/.env`
2. Pastikan ada variabel:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

Contoh untuk local Postgres default:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/diagnova?schema=public"
```

Keterangan:
- `USER` / `PASSWORD`: user & password Postgres kamu
- `HOST`: biasanya `localhost`
- `PORT`: biasanya `5432`
- `DATABASE`: nama database, di project ini default `diagnova`

> Jika belum punya file `backend/.env`, copy dari `backend/.env.example` lalu sesuaikan.

---

## 4) Siapkan Schema DB (Migrasi) + (Opsional) Seed Data

Masuk ke folder backend:

```bash
cd backend
```

Install dependencies (sekali saja):

```bash
npm install
```

Generate Prisma client:

```bash
npm run prisma:generate
```

Jalankan migration untuk membuat tabel:

```bash
npm run prisma:migrate
```

(Opsional) Isi data knowledge base (symptom/disease/rules):

```bash
npm run prisma:seed
```

---

## 5) Buka Prisma Studio (GUI)

Masih di folder `backend/`, jalankan:

```bash
npm run prisma:studio
```

Prisma Studio akan terbuka di browser (biasanya URL seperti `http://localhost:5555`).

---

## 6) Cara Membaca Tampilan Prisma Studio

### 6.1 “Open a Model”

Halaman awal biasanya menampilkan daftar **Models**. Di Prisma, model ini merepresentasikan **tabel**.

Contoh model yang ada di project ini:
- `Symptom` (tabel gejala)
- `Disease` (tabel penyakit)
- `CFRule` (tabel aturan CF)
- `ConsultationSession` (sesi konsultasi)
- `ConsultationResult` (hasil top-3 per sesi)

Angka di kanan (mis. `Symptom 24`) adalah jumlah record/row.

### 6.2 Melihat struktur (kolom) & data

1. Klik salah satu model (mis. `Symptom`)
2. Kamu akan melihat tabel data (rows)
3. Nama kolom yang tampil adalah “struktur” tabel (fields)

### 6.3 Menjelaskan fungsi tabel (script singkat)

Gunakan urutan demo ini saat presentasi:

1. `Symptom` → master gejala (`G001..G024`)
2. `Disease` → master penyakit (`P001..P005`)
3. `CFRule` → relasi disease ↔ symptom + `expertWeight` (inti knowledge base)
4. `ConsultationSession`/`ConsultationResult` → penyimpanan sesi & hasil (opsional, untuk share/riwayat)

Kalimat siap pakai:
- “`CFRule` menyimpan pengetahuan pakar: satu baris menyatakan gejala X mendukung penyakit Y dengan bobot pakar tertentu.”

---

## 7) Troubleshooting Cepat

### 7.1 Prisma Studio tidak bisa connect

Gejala umum:
- Error “Can’t reach database server” / “Connection refused”

Checklist:
- PostgreSQL benar-benar running (lihat bagian 2)
- `DATABASE_URL` di `backend/.env` benar (user/pass/db/port)
- Database `diagnova` sudah ada

### 7.2 Model ada tapi data kosong

Kemungkinan:
- Migration belum dijalankan → jalankan `npm run prisma:migrate`
- Seed belum dijalankan → jalankan `npm run prisma:seed`

---

## 8) Referensi

- Skema DB & ERD ringkas: lihat `docs/backend/SCHEMA.md`
- API contract: `docs/backend/API.md`
- CF engine: `docs/backend/CF_ENGINE.md`
