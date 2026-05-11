/**
 * Test fixture — full knowledge base extracted from:
 *   Setyaputri, Fadlil & Sunardi (2018). Tabel I (24 symptoms),
 *   Tabel II (5 diseases), Tabel III (34 expert-weighted rules).
 *
 * This mirrors the data in src/data/symptoms.ts + diseases.ts in the
 * frontend. Once the seeder runs, the same data lives in the production
 * database. We keep this fixture as a self-contained source of truth
 * for unit tests so they don't depend on a live DB.
 */
import type { KnowledgeBase } from '../../src/domain/cf/types.js'

export const TEST_KB: KnowledgeBase = {
  diseases: [
    { code: 'P001', name: 'Otitis Media Akut', category: 'Penyakit Telinga' },
    { code: 'P002', name: 'Serumen', category: 'Penyakit Telinga' },
    { code: 'P003', name: 'Otitis Eksterna', category: 'Penyakit Telinga' },
    { code: 'P004', name: 'Sinusitis', category: 'Penyakit Hidung & Sinus' },
    { code: 'P005', name: 'Rhinitis Kronis', category: 'Penyakit Hidung' },
  ],
  symptoms: [
    { code: 'G001', name: 'Batuk' },
    { code: 'G002', name: 'Bersin' },
    { code: 'G003', name: 'Dahak mengalir di tenggorokan' },
    { code: 'G004', name: 'Demam' },
    { code: 'G005', name: 'Hidung mampet' },
    { code: 'G006', name: 'Hidung mampet sebelah' },
    { code: 'G007', name: 'Hidung mampet bergantian' },
    { code: 'G008', name: 'Ingus bau' },
    { code: 'G009', name: 'Riwayat mengorek telinga' },
    { code: 'G010', name: 'Penciuman berkurang' },
    { code: 'G011', name: 'Pendengaran berkurang' },
    { code: 'G012', name: 'Pilek encer' },
    { code: 'G013', name: 'Pilek' },
    { code: 'G014', name: 'Sakit kepala' },
    { code: 'G015', name: 'Telinga berair ≥ 2 bulan' },
    { code: 'G016', name: 'Telinga berair ≤ 2 bulan' },
    { code: 'G017', name: 'Telinga berair bau ≥ 2 bulan' },
    { code: 'G018', name: 'Telinga mampet' },
    { code: 'G019', name: 'Telinga gatal' },
    { code: 'G020', name: 'Telinga nyeri' },
    { code: 'G021', name: 'Tenggorok nyeri' },
    { code: 'G022', name: 'Telinga nyeri saat mengunyah' },
    { code: 'G023', name: 'Telinga berdengung' },
    { code: 'G024', name: 'Tidur mendengkur' },
  ],
  rules: [
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
  ],
}

// Sanity assertion at module load — catches accidental edits.
if (TEST_KB.symptoms.length !== 24) {
  throw new Error(`TEST_KB must have 24 symptoms, got ${TEST_KB.symptoms.length}`)
}
if (TEST_KB.diseases.length !== 5) {
  throw new Error(`TEST_KB must have 5 diseases, got ${TEST_KB.diseases.length}`)
}
if (TEST_KB.rules.length !== 34) {
  throw new Error(`TEST_KB must have 34 rules, got ${TEST_KB.rules.length}`)
}
