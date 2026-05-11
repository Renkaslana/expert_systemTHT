# Database Schema — Diagnova

> Skema PostgreSQL + Prisma untuk knowledge base sistem pakar THT dan
> persistence sesi konsultasi. Bagian dari Fase 3 implementasi backend.

**Status:** ✅ Implemented · 24 symptoms + 5 diseases + 34 rules seeded · 53/53 tests pass
**Lokasi schema:** `backend/prisma/schema.prisma`
**Migration:** `20260510143651_init`

---

## 1. Diagram (ERD high-level)

```
┌──────────────────┐         ┌──────────────────┐
│    Symptom       │         │     Disease      │
├──────────────────┤         ├──────────────────┤
│ id (cuid) PK     │         │ id (cuid) PK     │
│ code      UQ     │         │ code      UQ     │
│ name             │         │ name             │
│ nameEn           │         │ nameShort        │
│ category enum    │         │ category         │
│ bodyArea enum    │         │ severity enum    │
│ severity enum    │         │ icdCode          │
│ description      │         │ iconKey enum     │
│ isActive         │         │ description      │
│ createdAt        │         │ causes[]         │
│ updatedAt        │         │ generalSymptoms[]│
└────────┬─────────┘         │ treatmentAdvice[]│
         │                   │ relatedDiseases[]│
         │ 1                 │ whenToSeeDoctor  │
         │                   │ expertSource     │
         │                   │ isActive         │
         │                   │ createdAt        │
         │                   │ updatedAt        │
         │                   └────────┬─────────┘
         │                            │ 1
         │                            │
         │   N      ┌──────────────┐  │ N
         └─────────►│   CFRule     │◄─┘
                   ├──────────────┤
                   │ id  PK       │
                   │ diseaseId FK │
                   │ symptomId FK │
                   │ expertWeight │ ← 0.2 | 0.4 | 0.6 | 0.8 | 1.0
                   │ rationale?   │
                   │ version      │
                   │ isActive     │
                   │ ─UNIQUE─     │
                   │ (diseaseId,  │
                   │  symptomId)  │
                   └──────────────┘

                   ┌────────────────────────┐
                   │ ConsultationSession    │
                   ├────────────────────────┤
                   │ id  PK                 │
                   │ sessionToken UQ (cuid) │ ← share URL token
                   │ inputSymptoms  Json    │
                   │ rawResults     Json    │
                   │ durationMs?            │
                   │ ipHash?                │
                   │ userAgent?             │
                   │ createdAt              │
                   └─────────┬──────────────┘
                             │ 1
                             │
                             │ N
                   ┌─────────▼──────────────┐
                   │ ConsultationResult     │
                   ├────────────────────────┤
                   │ id  PK                 │
                   │ sessionId FK           │
                   │ diseaseId FK ──────────│──► Disease
                   │ cfValue                │
                   │ rank (1 | 2 | 3)       │
                   │ createdAt              │
                   └────────────────────────┘
```

**Total tables:** 6 (5 application + 1 Prisma migrations table).

---

## 2. Tabel detail

### 2.1 `symptoms` (24 rows)

| Column | Type | Constraint | Catatan |
|---|---|---|---|
| `id` | text (cuid) | PK | Internal ID |
| `code` | text | UNIQUE | `G001`..`G024` |
| `name` | text | NOT NULL | Bahasa Indonesia |
| `nameEn` | text | NOT NULL | English |
| `category` | enum `SymptomCategory` | NOT NULL | `telinga` / `hidung` / `tenggorokan` / `umum` |
| `bodyArea` | enum `BodyArea` | NOT NULL | `ear` / `nose` / `throat` / `head` / `general` |
| `severity` | enum `SymptomSeverity` | NOT NULL | `low` / `medium` / `high` |
| `description` | text | NOT NULL | Penjelasan klinis 1 kalimat |
| `isActive` | boolean | DEFAULT true | Soft delete |
| `createdAt` | timestamp | DEFAULT now() | |
| `updatedAt` | timestamp | @updatedAt | |

**Indexes:** `(category)`, `(isActive)`

### 2.2 `diseases` (5 rows)

| Column | Type | Constraint | Catatan |
|---|---|---|---|
| `id` | text (cuid) | PK | |
| `code` | text | UNIQUE | `P001`..`P005` |
| `name` | text | NOT NULL | "Otitis Media Akut" |
| `nameShort` | text | NOT NULL | "OMA" |
| `category` | text | NOT NULL | "Penyakit Telinga" |
| `severity` | enum `DiseaseSeverity` | NOT NULL | `mild` / `moderate` / `severe` |
| `icdCode` | text | NOT NULL | "H66.0" |
| `iconKey` | enum `DiseaseIconKey` | NOT NULL | UI icon: `ear` / `nose` / `throat` / `sinus` / `general` |
| `description` | text | NOT NULL | Definisi klinis singkat |
| `causes` | text[] | NOT NULL | PG native array (4 items typical) |
| `generalSymptoms` | text[] | NOT NULL | Natural language list (bukan kode) |
| `treatmentAdvice` | text[] | NOT NULL | |
| `relatedDiseases` | text[] | NOT NULL | Array of disease codes (mis. `["P002","P003"]`) |
| `whenToSeeDoctor` | text | NOT NULL | Trigger eskalasi ke dokter |
| `expertSource` | text | DEFAULT "dr. M. Agus..." | Atribusi pakar |
| `isActive` | boolean | DEFAULT true | |
| `createdAt`, `updatedAt` | timestamp | | |

**Indexes:** `(category)`, `(isActive)`

**Kenapa `relatedDiseases` pakai array string, bukan tabel pivot?** Hubungan ini bersifat sugestif (untuk navigasi UI), bukan FK kuat. Array native PostgreSQL membuat query 1-shot tanpa JOIN, dan jumlah relasi per disease sangat kecil (1–3).

### 2.3 `cf_rules` (34 rows)

| Column | Type | Constraint | Catatan |
|---|---|---|---|
| `id` | text (cuid) | PK | |
| `diseaseId` | text | FK → `diseases.id`, ON DELETE CASCADE | |
| `symptomId` | text | FK → `symptoms.id`, ON DELETE CASCADE | |
| `expertWeight` | float8 | NOT NULL | `0.2` / `0.4` / `0.6` / `0.8` / `1.0` |
| `rationale` | text | NULL | Optional clinical note |
| `version` | int | DEFAULT 1 | Untuk audit trail kalau bobot di-tune |
| `isActive` | boolean | DEFAULT true | |
| `createdAt`, `updatedAt` | timestamp | | |

**Constraint khusus:** `UNIQUE(diseaseId, symptomId)` → satu disease tidak bisa punya 2 rule untuk gejala yang sama.

**Indexes:** `(diseaseId)`, `(symptomId)`, `(isActive)`

### 2.4 `consultation_sessions`

| Column | Type | Constraint | Catatan |
|---|---|---|---|
| `id` | text (cuid) | PK | |
| `sessionToken` | text (cuid) | UNIQUE | Share token (in URL) |
| `inputSymptoms` | jsonb | NOT NULL | `[{symptomCode, userWeight}, ...]` |
| `rawResults` | jsonb | NOT NULL | Full `DiagnosisResult[]` (replay tanpa rebuild) |
| `durationMs` | int | NULL | Engine wall-clock |
| `ipHash` | text | NULL | Hashed (bukan plain) — analytics + rate limit |
| `userAgent` | text | NULL | Diagnostic context |
| `createdAt` | timestamp | DEFAULT now() | |

**Indexes:** `(sessionToken)`, `(createdAt)`

**Mengapa `inputSymptoms` & `rawResults` JSON?** Format internal yang sering berkembang (frontend bisa minta field tambahan tanpa migrasi DB). DataIntensive load tetap rendah karena per-session ≤ 24 input + ≤ 3 result.

### 2.5 `consultation_results`

| Column | Type | Constraint | Catatan |
|---|---|---|---|
| `id` | text (cuid) | PK | |
| `sessionId` | text | FK → `consultation_sessions.id`, ON DELETE CASCADE | |
| `diseaseId` | text | FK → `diseases.id` | |
| `cfValue` | float8 | NOT NULL | 0..1 |
| `rank` | int | NOT NULL | 1, 2, atau 3 |
| `createdAt` | timestamp | DEFAULT now() | |

**Indexes:** `(sessionId)`, `(diseaseId)`, `(rank)`

**Tujuan denormalisasi:** Walaupun `rawResults` JSON di session table sudah punya semua data, kita tetap simpan di tabel terpisah supaya bisa ad-hoc analytics SQL (mis. "diagnosis paling sering muncul minggu ini" tanpa harus parsing JSON).

---

## 3. Enums

```prisma
enum SymptomCategory  { telinga | hidung | tenggorokan | umum }
enum BodyArea         { ear | nose | throat | head | general }
enum SymptomSeverity  { low | medium | high }
enum DiseaseSeverity  { mild | moderate | severe }
enum DiseaseIconKey   { ear | nose | throat | sinus | general }
```

---

## 4. Seed data

Disisipkan via `npm run prisma:seed` (idempotent — pakai `upsert`).

### 4.1 Sumber

Semua data berasal dari:
- **Setyaputri, Fadlil, Sunardi (2018), Tabel I, II, III** — tervalidasi
- **dr. M. Agus Sugicharto, Sp.THT-KL** — clinical validation

### 4.2 Knowledge base summary

```
Symptoms ........... 24 (G001 → G024)
Diseases ........... 5  (P001 → P005)
CF Rules ........... 34
  ├─ P001 OMA ............ 8 rules
  ├─ P002 Serumen ........ 4 rules
  ├─ P003 OE ............. 7 rules
  ├─ P004 Sinusitis ...... 8 rules
  └─ P005 Rhinitis ....... 7 rules
```

### 4.3 Pathognomonic rules (expertWeight = 1.0)

| Symptom | Disease(s) | Klinis |
|---|---|---|
| G020 Telinga nyeri | P001, P003 | Hampir-pasti otitis |
| G018 Telinga mampet | P002 | Hampir-pasti serumen |
| G014 Sakit kepala | P004 | Anchor sinusitis |
| G012 Pilek encer di kedua hidung | P005 | Anchor rhinitis |
| G013 Pilek | P005 | Anchor rhinitis |

### 4.4 Verifikasi via psql

```bash
PGPASSWORD=postgres psql -U postgres -d diagnova -c \
  "SELECT 'symptoms' as t, COUNT(*) FROM symptoms
   UNION ALL SELECT 'diseases', COUNT(*) FROM diseases
   UNION ALL SELECT 'cf_rules', COUNT(*) FROM cf_rules;"

#     t     | count
# ----------+-------
#  symptoms |    24
#  diseases |     5
#  cf_rules |    34
```

---

## 5. Repositories

Akses ke schema via tipe layer di `backend/src/repositories/`:

| Repository | Methods |
|---|---|
| `symptomRepo` | `findAll({category?, activeOnly?})`, `findByCode(code)`, `findManyByCodes(codes)`, `count()` |
| `diseaseRepo` | `findAll({activeOnly?})`, `findByCode(code)`, `count()` |
| `ruleRepo` | `findAll({activeOnly?})`, `findByDiseaseCode(code)`, `findBySymptomCode(code)`, `count()` |
| `sessionRepo` | `create(input)`, `findByToken(token)` |

**Prinsip desain:**
- Service layer hanya berinteraksi dengan repository, tidak langsung ke Prisma.
- Repository selalu mengembalikan domain-friendly shape (mis. `RuleRow` dengan `diseaseCode`/`symptomCode`, bukan internal IDs).
- ORM bisa diganti tanpa menyentuh service/domain.

### 5.1 Test coverage

13 integration test mencakup:

```
✓ symptomRepo.findAll returns 24 active symptoms
✓ symptomRepo.findByCode returns matching symptom
✓ symptomRepo.findByCode returns null for unknown code
✓ symptomRepo.findManyByCodes returns subset
✓ symptomRepo.findAll filters by category
✓ symptomRepo.count returns 24
✓ diseaseRepo.findAll returns 5 active diseases
✓ diseaseRepo.findByCode P001 returns Otitis Media Akut
✓ diseaseRepo.findByCode returns null for unknown code
✓ ruleRepo.findAll returns 34 active rules
✓ ruleRepo.findByDiseaseCode P001 returns 8 rules
✓ ruleRepo.findByDiseaseCode P002 returns 4 rules
✓ ruleRepo.findBySymptomCode G020 returns 2 rules with weight 1.0
```

---

## 6. Migration & maintenance

### 6.1 Apply migration

```bash
cd backend
npm run prisma:migrate           # interactive: creates+applies new migration
npm run prisma:migrate:deploy    # production: apply pending only
```

### 6.2 Reset DB (DESTRUCTIVE)

```bash
npm run db:reset                 # drop + recreate + migrate + auto-seed
```

### 6.3 Update knowledge base

1. Edit `backend/prisma/seed.ts` (single source of truth for KB).
2. Run `npm run prisma:seed` — upsert membaca diff dan update existing rows.
3. Tidak perlu migrasi schema kalau hanya nilai berubah.
4. Untuk add column baru, edit `schema.prisma` lalu `prisma migrate dev`.

### 6.4 Backup

```bash
PGPASSWORD=postgres pg_dump -U postgres -d diagnova \
  > diagnova-backup-$(date +%Y%m%d).sql
```

### 6.5 Inspect via GUI

```bash
npm run prisma:studio            # opens browser GUI on :5555
```

---

## 7. Tipe konsistensi dengan frontend

Frontend `frontend/src/types/index.ts` punya interface yang **harus match** schema:

| Frontend type | Backend table | Status |
|---|---|---|
| `Symptom` | `symptoms` | ✅ Match (code, name, nameEn, category, bodyArea, severity, description) |
| `Disease` | `diseases` | ✅ Match (semua field) |
| `CFRule` | `cf_rules` (joined) | ✅ Match (diseaseCode, symptomCode, expertWeight) — repo handles JOIN |

Backend mapper layer (`src/mappers/`, akan dibuat di Fase 4) bertugas mengubah Prisma model → API response shape yang persis match `Disease` / `Symptom` interface frontend.

---

## 8. Roadmap

| Status | Item |
|---|---|
| ✅ Done | Schema + 6 tables migrated |
| ✅ Done | Seed 24 symptoms + 5 diseases + 34 rules |
| ✅ Done | 4 repositories (symptom, disease, rule, session) |
| ✅ Done | 13 repository integration tests |
| ⏭ Fase 4 | Mappers (DB row → API DTO) |
| ⏭ Fase 4 | Public REST endpoints konsumsi repositories |
| ⏭ Fase 5 | Session create/find via REST |
| ⏭ Fase 7 | Performance: add indexes if N>1k sessions |

---

**File terkait:**
- `backend/prisma/schema.prisma` — source of truth schema
- `backend/prisma/seed.ts` — knowledge base seeder
- `backend/prisma/migrations/20260510143651_init/migration.sql` — initial DDL
- `backend/src/repositories/*.repo.ts` — typed data access
- `backend/tests/integration/repositories.test.ts` — 13 integration tests
