import type { Disease, CFRule } from '@/types'

export const DISEASES: Disease[] = [
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
]

export const DISEASE_BY_CODE: Record<string, Disease> = Object.fromEntries(
  DISEASES.map((d) => [d.code, d]),
)

export const CF_RULES: CFRule[] = [
  // P001 — Otitis Media Akut
  { diseaseCode: 'P001', symptomCode: 'G001', expertWeight: 0.8 },
  { diseaseCode: 'P001', symptomCode: 'G004', expertWeight: 0.8 },
  { diseaseCode: 'P001', symptomCode: 'G011', expertWeight: 0.6 },
  { diseaseCode: 'P001', symptomCode: 'G013', expertWeight: 0.8 },
  { diseaseCode: 'P001', symptomCode: 'G014', expertWeight: 0.4 },
  { diseaseCode: 'P001', symptomCode: 'G016', expertWeight: 0.8 },
  { diseaseCode: 'P001', symptomCode: 'G020', expertWeight: 1.0 },
  { diseaseCode: 'P001', symptomCode: 'G023', expertWeight: 0.6 },
  // P002 — Serumen
  { diseaseCode: 'P002', symptomCode: 'G009', expertWeight: 0.4 },
  { diseaseCode: 'P002', symptomCode: 'G011', expertWeight: 0.8 },
  { diseaseCode: 'P002', symptomCode: 'G018', expertWeight: 1.0 },
  { diseaseCode: 'P002', symptomCode: 'G019', expertWeight: 0.2 },
  // P003 — Otitis Eksterna
  { diseaseCode: 'P003', symptomCode: 'G009', expertWeight: 0.8 },
  { diseaseCode: 'P003', symptomCode: 'G011', expertWeight: 0.8 },
  { diseaseCode: 'P003', symptomCode: 'G016', expertWeight: 0.4 },
  { diseaseCode: 'P003', symptomCode: 'G018', expertWeight: 0.6 },
  { diseaseCode: 'P003', symptomCode: 'G019', expertWeight: 0.8 },
  { diseaseCode: 'P003', symptomCode: 'G020', expertWeight: 1.0 },
  { diseaseCode: 'P003', symptomCode: 'G023', expertWeight: 0.6 },
  // P004 — Sinusitis
  { diseaseCode: 'P004', symptomCode: 'G001', expertWeight: 0.4 },
  { diseaseCode: 'P004', symptomCode: 'G003', expertWeight: 0.8 },
  { diseaseCode: 'P004', symptomCode: 'G004', expertWeight: 0.4 },
  { diseaseCode: 'P004', symptomCode: 'G005', expertWeight: 0.4 },
  { diseaseCode: 'P004', symptomCode: 'G006', expertWeight: 0.6 },
  { diseaseCode: 'P004', symptomCode: 'G010', expertWeight: 0.6 },
  { diseaseCode: 'P004', symptomCode: 'G012', expertWeight: 0.6 },
  { diseaseCode: 'P004', symptomCode: 'G014', expertWeight: 1.0 },
  // P005 — Rhinitis Kronis
  { diseaseCode: 'P005', symptomCode: 'G002', expertWeight: 0.8 },
  { diseaseCode: 'P005', symptomCode: 'G005', expertWeight: 0.8 },
  { diseaseCode: 'P005', symptomCode: 'G007', expertWeight: 0.8 },
  { diseaseCode: 'P005', symptomCode: 'G010', expertWeight: 0.6 },
  { diseaseCode: 'P005', symptomCode: 'G012', expertWeight: 1.0 },
  { diseaseCode: 'P005', symptomCode: 'G013', expertWeight: 1.0 },
  { diseaseCode: 'P005', symptomCode: 'G014', expertWeight: 0.4 },
]
