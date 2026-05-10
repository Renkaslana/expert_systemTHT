/**
 * Centralized image source for the landing page.
 *
 * Uses locally generated AI images (in /public) and curated Unsplash photos.
 * All generated images are in /public/img-*.png
 * Unsplash photos are royalty-free per the Unsplash license.
 *
 * Each slot exports a `region` so the SmartImage fallback gradient
 * stays on-brand when an image fails to load.
 */

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=85`

type Region = 'ear' | 'sinus' | 'throat' | 'workspace' | 'research'

interface ImgSlot {
  src: string
  region: Region
  alt: string
}

const slot = (src: string, region: Region, alt: string): ImgSlot => ({
  src,
  region,
  alt,
})

export const IMG = {
  // ── Hero — Generated: premium ENT otoscope consultation ───────────
  hero: slot(
    '/img-hero.png',
    'ear',
    'Dokter spesialis THT memeriksa telinga pasien dengan otoskop — Diagnova',
  ),

  // ── How it works — Generated ──────────────────────────────────────
  howIntake: slot(
    '/img-intake.png',
    'workspace',
    'Pasien memilih gejala ENT pada sistem Diagnova',
  ),
  howInfer: slot(
    '/img-infer.png',
    'workspace',
    'Sistem Certainty Factor menghitung peringkat diagnosis ENT secara real-time',
  ),
  howExplain: slot(
    '/img-explain.png',
    'workspace',
    'Dokter menjelaskan hasil diagnosis yang dapat ditelusuri kepada pasien',
  ),

  // ── Explainable AI section — Generated ───────────────────────────
  inspector: slot(
    '/img-inspector.png',
    'research',
    'Inspektur penalaran AI menampilkan jejak diagnosis Certainty Factor',
  ),

  // ── Live demo backdrop — Unsplash: clinical ambience ─────────────
  demoBackdrop: slot(
    u('1576091160550-2173dba999ef', 1800),
    'workspace',
    'Lingkungan klinik dengan peralatan medis modern',
  ),

  // ── Knowledge base — per-disease ─────────────────────────────────
  // Ear / Otitis Media
  diseaseEar: slot(
    '/otitis.png',
    'ear',
    'Pemeriksaan telinga dengan otoskop premium',
  ),
  // Ear canal / Serumen
  diseaseSerumen: slot(
    '/serumen.png',
    'ear',
    'Detail anatomi telinga manusia',
  ),
  // Otitis Externa
  diseaseExterna: slot(
    '/eksterna.png',
    'ear',
    'Otitis eksterna — radang liang telinga luar',
  ),
  // Sinusitis
  diseaseSinus: slot(
    '/sinusitis.png',
    'sinus',
    'Pemeriksaan sinus — pasien dengan keluhan sinusitis',
  ),
  // Rhinitis
  diseaseRhinitis: slot(
    u('1584516150909-c43483ee7932', 800),
    'sinus',
    'Rhinitis alergi — pilek kronis',
  ),

  // ── Methodology section ───────────────────────────────────────────
  methodResearch: slot(
    u('1532187863486-abf9dbad1b69', 1200),
    'research',
    'Peneliti mengkaji literatur klinis di laboratorium',
  ),
  methodBooks: slot(
    u('1481627834876-b7833e8f84f6', 800),
    'research',
    'Buku referensi medis dan jurnal klinis',
  ),
  methodReview: slot(
    u('1559757148-5c350d0d3c56', 1200),
    'workspace',
    'Tim klinis melakukan review bersama',
  ),
  methodNotes: slot(
    u('1532153975070-2e9ab71f1b14', 800),
    'research',
    'Tangan dokter menulis catatan klinis terstruktur',
  ),

  // ── CTA — Generated: cinematic premium clinic ─────────────────────
  ctaBackdrop: '/img-cta.png',
} as const

export type ImgKey = keyof typeof IMG
