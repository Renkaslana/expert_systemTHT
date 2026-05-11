/**
 * Knowledge base seeder.
 *
 * Populates PostgreSQL with the canonical KB used by the CF engine:
 *   • 24 symptoms (G001..G024)         — Setyaputri 2018, Tabel I
 *   • 5  diseases (P001..P005)         — Tabel II
 *   • 34 expert-weighted rules         — Tabel III
 *
 * Designed to be idempotent: running multiple times produces the same DB
 * state. Uses upsert by unique `code` for entities and compound key for
 * rules. Safe to run as part of CI / deploy hooks.
 *
 * Usage:
 *   npm run prisma:seed
 *   npm run db:reset              # drop, migrate, then auto-runs this seed
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ─────────────────────────────────────────────────────────────────────
// Source data — mirrors src/data/symptoms.ts and src/data/diseases.ts
// in the frontend. Single source of truth: Setyaputri et al. (2018).
// ─────────────────────────────────────────────────────────────────────

const SYMPTOMS = [
  { code: 'G001', name: 'Batuk', nameEn: 'Cough', category: 'umum', bodyArea: 'general', severity: 'low',
    description: 'Refleks tubuh untuk mengeluarkan iritan dari saluran pernapasan.' },
  { code: 'G002', name: 'Bersin', nameEn: 'Sneezing', category: 'hidung', bodyArea: 'nose', severity: 'low',
    description: 'Pengeluaran udara mendadak dari hidung dan mulut akibat iritasi.' },
  { code: 'G003', name: 'Dahak mengalir di tenggorok', nameEn: 'Post-nasal drip', category: 'tenggorokan', bodyArea: 'throat', severity: 'medium',
    description: 'Sensasi lendir kental yang turun dari belakang hidung ke tenggorokan.' },
  { code: 'G004', name: 'Demam', nameEn: 'Fever', category: 'umum', bodyArea: 'general', severity: 'medium',
    description: 'Peningkatan suhu tubuh di atas 37.5°C, biasanya tanda infeksi.' },
  { code: 'G005', name: 'Hidung mampet', nameEn: 'Nasal congestion', category: 'hidung', bodyArea: 'nose', severity: 'low',
    description: 'Kesulitan bernapas melalui hidung karena penyumbatan saluran.' },
  { code: 'G006', name: 'Hidung mampet sebelah', nameEn: 'Unilateral nasal block', category: 'hidung', bodyArea: 'nose', severity: 'medium',
    description: 'Penyumbatan hanya terjadi pada satu sisi hidung.' },
  { code: 'G007', name: 'Hidung mampet bergantian', nameEn: 'Alternating nasal block', category: 'hidung', bodyArea: 'nose', severity: 'medium',
    description: 'Penyumbatan berpindah dari sisi kiri ke kanan secara bergantian.' },
  { code: 'G008', name: 'Ingus bau', nameEn: 'Foul-smelling discharge', category: 'hidung', bodyArea: 'nose', severity: 'medium',
    description: 'Cairan hidung dengan bau tidak sedap, sering tanda infeksi bakteri.' },
  { code: 'G009', name: 'Riwayat mengorek telinga', nameEn: 'History of ear cleaning', category: 'telinga', bodyArea: 'ear', severity: 'medium',
    description: 'Kebiasaan membersihkan telinga dengan cotton bud atau alat lain.' },
  { code: 'G010', name: 'Penciuman berkurang', nameEn: 'Hyposmia', category: 'hidung', bodyArea: 'nose', severity: 'medium',
    description: 'Kemampuan mencium aroma menurun dari biasanya.' },
  { code: 'G011', name: 'Pendengaran berkurang', nameEn: 'Hearing loss', category: 'telinga', bodyArea: 'ear', severity: 'high',
    description: 'Kemampuan mendengar menurun pada satu atau kedua telinga.' },
  { code: 'G012', name: 'Pilek encer di kedua hidung', nameEn: 'Bilateral watery rhinorrhea', category: 'hidung', bodyArea: 'nose', severity: 'low',
    description: 'Cairan bening encer keluar terus dari kedua lubang hidung.' },
  { code: 'G013', name: 'Pilek', nameEn: 'Runny nose', category: 'hidung', bodyArea: 'nose', severity: 'low',
    description: 'Keluarnya cairan dari hidung, encer maupun kental.' },
  { code: 'G014', name: 'Sakit kepala', nameEn: 'Headache', category: 'umum', bodyArea: 'head', severity: 'medium',
    description: 'Nyeri di area kepala, dahi, atau sekitar mata.' },
  { code: 'G015', name: 'Telinga berair ≥ 2 bulan', nameEn: 'Ear discharge ≥ 2 months', category: 'telinga', bodyArea: 'ear', severity: 'high',
    description: 'Cairan keluar dari telinga selama dua bulan atau lebih.' },
  { code: 'G016', name: 'Telinga berair ≤ 2 bulan', nameEn: 'Ear discharge ≤ 2 months', category: 'telinga', bodyArea: 'ear', severity: 'medium',
    description: 'Cairan keluar dari telinga kurang dari dua bulan.' },
  { code: 'G017', name: 'Telinga berair bau ≥ 2 bulan', nameEn: 'Foul ear discharge ≥ 2 months', category: 'telinga', bodyArea: 'ear', severity: 'high',
    description: 'Cairan telinga dengan bau busuk berlangsung dua bulan atau lebih.' },
  { code: 'G018', name: 'Telinga mampet', nameEn: 'Ear fullness', category: 'telinga', bodyArea: 'ear', severity: 'medium',
    description: 'Sensasi telinga seperti tersumbat atau penuh.' },
  { code: 'G019', name: 'Telinga gatal', nameEn: 'Ear itching', category: 'telinga', bodyArea: 'ear', severity: 'low',
    description: 'Rasa gatal di dalam atau sekitar liang telinga.' },
  { code: 'G020', name: 'Telinga nyeri', nameEn: 'Ear pain', category: 'telinga', bodyArea: 'ear', severity: 'high',
    description: 'Rasa nyeri atau sakit di dalam telinga.' },
  { code: 'G021', name: 'Tenggorok nyeri', nameEn: 'Sore throat', category: 'tenggorokan', bodyArea: 'throat', severity: 'medium',
    description: 'Rasa nyeri atau perih saat menelan atau berbicara.' },
  { code: 'G022', name: 'Telinga nyeri saat mengunyah', nameEn: 'Ear pain on chewing', category: 'telinga', bodyArea: 'ear', severity: 'medium',
    description: 'Nyeri telinga yang muncul atau memburuk saat mengunyah.' },
  { code: 'G023', name: 'Telinga berdengung', nameEn: 'Tinnitus', category: 'telinga', bodyArea: 'ear', severity: 'medium',
    description: 'Mendengar suara berdengung tanpa sumber suara nyata.' },
  { code: 'G024', name: 'Tidur mendengkur', nameEn: 'Snoring', category: 'tenggorokan', bodyArea: 'throat', severity: 'medium',
    description: 'Suara keras saat tidur akibat getaran jaringan saluran napas.' },
] as const

const DISEASES = [
  {
    code: 'P001',
    name: 'Otitis Media Akut',
    nameShort: 'OMA',
    category: 'Penyakit Telinga',
    severity: 'moderate',
    icdCode: 'H66.0',
    iconKey: 'ear',
    description:
      'Otitis Media Akut adalah peradangan pada telinga tengah yang terjadi secara mendadak dan biasanya disertai infeksi. Sering muncul setelah infeksi saluran napas atas seperti pilek atau flu.',
    causes: [
      'Infeksi bakteri (Streptococcus pneumoniae, Haemophilus influenzae)',
      'Komplikasi dari infeksi saluran napas atas',
      'Disfungsi tuba Eustachius',
      'Paparan asap rokok atau polusi',
    ],
    generalSymptoms: [
      'Nyeri telinga yang tajam dan tiba-tiba',
      'Demam, terutama pada anak-anak',
      'Penurunan pendengaran sementara',
      'Telinga terasa penuh atau berdengung',
    ],
    treatmentAdvice: [
      'Istirahat cukup dan jaga hidrasi',
      'Kompres hangat di area telinga untuk meredakan nyeri',
      'Hindari memasukkan apapun ke dalam telinga',
      'Konsultasi dokter untuk evaluasi pemberian antibiotik',
    ],
    whenToSeeDoctor:
      'Segera ke dokter jika nyeri sangat hebat, demam tinggi > 39°C, keluar cairan dari telinga, atau gejala tidak membaik dalam 48 jam.',
    relatedDiseases: ['P003', 'P002'],
    expertSource: 'dr. M. Agus Sugicharto, Sp.THT-KL',
  },
  {
    code: 'P002',
    name: 'Serumen Obsturans',
    nameShort: 'Serumen',
    category: 'Penyakit Telinga',
    severity: 'mild',
    icdCode: 'H61.2',
    iconKey: 'ear',
    description:
      'Penumpukan serumen (kotoran telinga) yang menyumbat liang telinga sehingga mengganggu pendengaran. Umumnya disebabkan kebiasaan membersihkan telinga yang justru mendorong serumen lebih dalam.',
    causes: [
      'Penggunaan cotton bud yang mendorong serumen ke dalam',
      'Produksi serumen berlebih',
      'Bentuk liang telinga yang sempit atau berliku',
      'Penggunaan alat bantu dengar atau earphone in-ear',
    ],
    generalSymptoms: [
      'Telinga terasa penuh atau tersumbat',
      'Pendengaran berkurang secara perlahan',
      'Telinga gatal',
      'Berdengung ringan',
    ],
    treatmentAdvice: [
      'Hindari mengorek telinga sendiri',
      'Gunakan obat tetes pelunak serumen sesuai anjuran',
      'Bersihkan telinga oleh tenaga medis (irigasi/ekstraksi)',
      'Periksa rutin jika produksi serumen tinggi',
    ],
    whenToSeeDoctor:
      'Periksakan ke dokter THT jika pendengaran menurun signifikan, telinga nyeri, atau terdapat riwayat perforasi gendang telinga sebelum mencoba pelunak serumen.',
    relatedDiseases: ['P001', 'P003'],
    expertSource: 'dr. M. Agus Sugicharto, Sp.THT-KL',
  },
  {
    code: 'P003',
    name: 'Otitis Eksterna',
    nameShort: 'OE',
    category: 'Penyakit Telinga',
    severity: 'moderate',
    icdCode: 'H60.9',
    iconKey: 'ear',
    description:
      'Peradangan pada saluran telinga luar, sering disebut "swimmer\'s ear". Disebabkan infeksi bakteri atau jamur, umumnya dipicu oleh kelembapan atau trauma kecil di liang telinga.',
    causes: [
      'Paparan air berkepanjangan (berenang, mandi)',
      'Trauma akibat mengorek telinga',
      'Infeksi bakteri (Pseudomonas aeruginosa) atau jamur',
      'Penggunaan earphone in-ear yang tidak higienis',
    ],
    generalSymptoms: [
      'Nyeri telinga yang memburuk saat daun telinga ditarik',
      'Gatal di liang telinga',
      'Cairan keluar dari telinga',
      'Pendengaran berkurang akibat pembengkakan',
    ],
    treatmentAdvice: [
      'Jaga telinga tetap kering',
      'Hindari mengorek atau menggaruk telinga',
      'Gunakan obat tetes telinga antibiotik/antijamur sesuai resep',
      'Hindari berenang sampai sembuh',
    ],
    whenToSeeDoctor:
      'Konsultasi dokter THT jika nyeri hebat, demam, pembengkakan meluas ke wajah, atau gejala tidak membaik dalam 3 hari pengobatan.',
    relatedDiseases: ['P001', 'P002'],
    expertSource: 'dr. M. Agus Sugicharto, Sp.THT-KL',
  },
  {
    code: 'P004',
    name: 'Sinusitis',
    nameShort: 'Sinusitis',
    category: 'Penyakit Hidung',
    severity: 'moderate',
    icdCode: 'J32.9',
    iconKey: 'sinus',
    description:
      'Peradangan pada rongga sinus paranasal yang menyebabkan penumpukan lendir, tekanan, dan nyeri di area wajah. Bisa bersifat akut maupun kronis tergantung durasi gejala.',
    causes: [
      'Infeksi virus saluran napas atas',
      'Infeksi bakteri sekunder',
      'Alergi yang menyebabkan pembengkakan mukosa',
      'Kelainan struktur hidung (deviasi septum, polip)',
    ],
    generalSymptoms: [
      'Sakit kepala dan nyeri tekan di wajah',
      'Hidung tersumbat dan ingus kental',
      'Penurunan kemampuan mencium',
      'Dahak mengalir di tenggorokan',
    ],
    treatmentAdvice: [
      'Hidrasi cukup untuk membantu mengencerkan lendir',
      'Inhalasi uap hangat',
      'Cuci hidung dengan larutan saline',
      'Hindari iritan seperti asap rokok dan debu',
    ],
    whenToSeeDoctor:
      'Periksakan ke dokter jika gejala berlangsung > 10 hari, demam tinggi, nyeri wajah hebat, gangguan penglihatan, atau pembengkakan di sekitar mata.',
    relatedDiseases: ['P005'],
    expertSource: 'dr. M. Agus Sugicharto, Sp.THT-KL',
  },
  {
    code: 'P005',
    name: 'Rhinitis Kronis',
    nameShort: 'Rhinitis',
    category: 'Penyakit Hidung',
    severity: 'mild',
    icdCode: 'J31.0',
    iconKey: 'nose',
    description:
      'Peradangan kronis pada selaput lendir hidung yang berlangsung lebih dari 12 minggu. Dapat bersifat alergi maupun non-alergi, sering memengaruhi kualitas hidup penderita.',
    causes: [
      'Reaksi alergi terhadap debu, tungau, serbuk sari, bulu hewan',
      'Iritasi kronis dari asap rokok atau polusi',
      'Penggunaan dekongestan hidung berlebihan (rhinitis medikamentosa)',
      'Perubahan hormonal',
    ],
    generalSymptoms: [
      'Bersin berulang, terutama di pagi hari',
      'Hidung berair encer di kedua sisi',
      'Hidung tersumbat bergantian',
      'Penurunan penciuman ringan',
    ],
    treatmentAdvice: [
      'Identifikasi dan hindari pemicu alergi',
      'Cuci hidung rutin dengan larutan saline',
      'Gunakan antihistamin atau steroid hidung sesuai resep',
      'Pertimbangkan imunoterapi untuk alergi berat',
    ],
    whenToSeeDoctor:
      'Konsultasi dokter THT jika gejala mengganggu tidur, aktivitas harian, atau tidak membaik dengan pengobatan mandiri selama 2 minggu.',
    relatedDiseases: ['P004'],
    expertSource: 'dr. M. Agus Sugicharto, Sp.THT-KL',
  },
] as const

/**
 * 34 expert-weighted rules from Setyaputri 2018, Tabel III.
 * Validated by dr. M. Agus Sugicharto, Sp.THT-KL.
 *
 * Format: { diseaseCode, symptomCode, expertWeight }
 */
const CF_RULES = [
  // P001 — Otitis Media Akut (8 rules)
  { diseaseCode: 'P001', symptomCode: 'G001', expertWeight: 0.8 },
  { diseaseCode: 'P001', symptomCode: 'G004', expertWeight: 0.8 },
  { diseaseCode: 'P001', symptomCode: 'G011', expertWeight: 0.6 },
  { diseaseCode: 'P001', symptomCode: 'G013', expertWeight: 0.8 },
  { diseaseCode: 'P001', symptomCode: 'G014', expertWeight: 0.4 },
  { diseaseCode: 'P001', symptomCode: 'G016', expertWeight: 0.8 },
  { diseaseCode: 'P001', symptomCode: 'G020', expertWeight: 1.0 },
  { diseaseCode: 'P001', symptomCode: 'G023', expertWeight: 0.6 },
  // P002 — Serumen (4 rules)
  { diseaseCode: 'P002', symptomCode: 'G009', expertWeight: 0.4 },
  { diseaseCode: 'P002', symptomCode: 'G011', expertWeight: 0.8 },
  { diseaseCode: 'P002', symptomCode: 'G018', expertWeight: 1.0 },
  { diseaseCode: 'P002', symptomCode: 'G019', expertWeight: 0.2 },
  // P003 — Otitis Eksterna (7 rules)
  { diseaseCode: 'P003', symptomCode: 'G009', expertWeight: 0.8 },
  { diseaseCode: 'P003', symptomCode: 'G011', expertWeight: 0.8 },
  { diseaseCode: 'P003', symptomCode: 'G016', expertWeight: 0.4 },
  { diseaseCode: 'P003', symptomCode: 'G018', expertWeight: 0.6 },
  { diseaseCode: 'P003', symptomCode: 'G019', expertWeight: 0.8 },
  { diseaseCode: 'P003', symptomCode: 'G020', expertWeight: 1.0 },
  { diseaseCode: 'P003', symptomCode: 'G023', expertWeight: 0.6 },
  // P004 — Sinusitis (8 rules)
  { diseaseCode: 'P004', symptomCode: 'G001', expertWeight: 0.4 },
  { diseaseCode: 'P004', symptomCode: 'G003', expertWeight: 0.8 },
  { diseaseCode: 'P004', symptomCode: 'G004', expertWeight: 0.4 },
  { diseaseCode: 'P004', symptomCode: 'G005', expertWeight: 0.4 },
  { diseaseCode: 'P004', symptomCode: 'G006', expertWeight: 0.6 },
  { diseaseCode: 'P004', symptomCode: 'G010', expertWeight: 0.6 },
  { diseaseCode: 'P004', symptomCode: 'G012', expertWeight: 0.6 },
  { diseaseCode: 'P004', symptomCode: 'G014', expertWeight: 1.0 },
  // P005 — Rhinitis Kronis (7 rules)
  { diseaseCode: 'P005', symptomCode: 'G002', expertWeight: 0.8 },
  { diseaseCode: 'P005', symptomCode: 'G005', expertWeight: 0.8 },
  { diseaseCode: 'P005', symptomCode: 'G007', expertWeight: 0.8 },
  { diseaseCode: 'P005', symptomCode: 'G010', expertWeight: 0.6 },
  { diseaseCode: 'P005', symptomCode: 'G012', expertWeight: 1.0 },
  { diseaseCode: 'P005', symptomCode: 'G013', expertWeight: 1.0 },
  { diseaseCode: 'P005', symptomCode: 'G014', expertWeight: 0.4 },
] as const

// ─────────────────────────────────────────────────────────────────────
// Seeder
// ─────────────────────────────────────────────────────────────────────

async function seedSymptoms() {
  console.info(`📝 Seeding ${SYMPTOMS.length} symptoms…`)
  const idByCode = new Map<string, string>()

  for (const s of SYMPTOMS) {
    const row = await prisma.symptom.upsert({
      where: { code: s.code },
      update: {
        name: s.name,
        nameEn: s.nameEn,
        category: s.category,
        bodyArea: s.bodyArea,
        severity: s.severity,
        description: s.description,
        isActive: true,
      },
      create: {
        code: s.code,
        name: s.name,
        nameEn: s.nameEn,
        category: s.category,
        bodyArea: s.bodyArea,
        severity: s.severity,
        description: s.description,
      },
    })
    idByCode.set(s.code, row.id)
  }

  return idByCode
}

async function seedDiseases() {
  console.info(`📝 Seeding ${DISEASES.length} diseases…`)
  const idByCode = new Map<string, string>()

  for (const d of DISEASES) {
    const row = await prisma.disease.upsert({
      where: { code: d.code },
      update: {
        name: d.name,
        nameShort: d.nameShort,
        category: d.category,
        severity: d.severity,
        icdCode: d.icdCode,
        iconKey: d.iconKey,
        description: d.description,
        causes: [...d.causes],
        generalSymptoms: [...d.generalSymptoms],
        treatmentAdvice: [...d.treatmentAdvice],
        relatedDiseases: [...d.relatedDiseases],
        whenToSeeDoctor: d.whenToSeeDoctor,
        expertSource: d.expertSource,
        isActive: true,
      },
      create: {
        code: d.code,
        name: d.name,
        nameShort: d.nameShort,
        category: d.category,
        severity: d.severity,
        icdCode: d.icdCode,
        iconKey: d.iconKey,
        description: d.description,
        causes: [...d.causes],
        generalSymptoms: [...d.generalSymptoms],
        treatmentAdvice: [...d.treatmentAdvice],
        relatedDiseases: [...d.relatedDiseases],
        whenToSeeDoctor: d.whenToSeeDoctor,
        expertSource: d.expertSource,
      },
    })
    idByCode.set(d.code, row.id)
  }

  return idByCode
}

async function seedRules(
  diseaseIdByCode: Map<string, string>,
  symptomIdByCode: Map<string, string>,
) {
  console.info(`📝 Seeding ${CF_RULES.length} CF rules…`)

  for (const r of CF_RULES) {
    const diseaseId = diseaseIdByCode.get(r.diseaseCode)
    const symptomId = symptomIdByCode.get(r.symptomCode)

    if (!diseaseId) throw new Error(`Disease not found: ${r.diseaseCode}`)
    if (!symptomId) throw new Error(`Symptom not found: ${r.symptomCode}`)

    await prisma.cFRule.upsert({
      where: {
        diseaseId_symptomId: { diseaseId, symptomId },
      },
      update: {
        expertWeight: r.expertWeight,
        isActive: true,
      },
      create: {
        diseaseId,
        symptomId,
        expertWeight: r.expertWeight,
      },
    })
  }
}

async function summarize() {
  const [symptomCount, diseaseCount, ruleCount] = await Promise.all([
    prisma.symptom.count({ where: { isActive: true } }),
    prisma.disease.count({ where: { isActive: true } }),
    prisma.cFRule.count({ where: { isActive: true } }),
  ])

  console.info(`\n✅ Knowledge base ready:`)
  console.info(`   Symptoms : ${symptomCount}/24`)
  console.info(`   Diseases : ${diseaseCount}/5`)
  console.info(`   CF Rules : ${ruleCount}/34`)

  const ok = symptomCount === 24 && diseaseCount === 5 && ruleCount === 34
  if (!ok) {
    throw new Error('Seed verification failed: counts do not match expected values')
  }
}

async function main() {
  console.info('🌱 Diagnova KB seeder — Setyaputri 2018 (Tabel I, II, III)\n')

  const t0 = Date.now()
  const symptomIds = await seedSymptoms()
  const diseaseIds = await seedDiseases()
  await seedRules(diseaseIds, symptomIds)
  await summarize()
  console.info(`\n⏱  Completed in ${Date.now() - t0}ms`)
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
