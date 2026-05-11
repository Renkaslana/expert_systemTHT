import { ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MedicalDisclaimerProps {
  variant?: 'inline' | 'banner'
  className?: string
}

export function MedicalDisclaimer({ variant = 'inline', className }: MedicalDisclaimerProps) {
  return (
    <div
      role="note"
      className={cn(
        'flex items-start gap-3 rounded-2xl border text-sm',
        variant === 'banner'
          ? 'border-amber-500/20 bg-amber-500/5 p-4 text-amber-700 dark:text-amber-300'
          : 'border-border/80 bg-muted/40 p-3.5 text-muted-foreground',
        className,
      )}
    >
      <ShieldAlert
        className={cn(
          'mt-0.5 h-4 w-4 shrink-0',
          variant === 'banner' ? 'text-amber-500' : 'text-muted-foreground',
        )}
      />
      <div>
        <p className="font-semibold text-foreground">Disclaimer Medis</p>
        <p className="mt-0.5 leading-relaxed">
          Diagnova adalah alat bantu pre-konsultasi berbasis sistem pakar — bukan pengganti
          pemeriksaan dokter. Hasil diagnosis bersifat indikatif. Untuk keluhan serius, segera
          konsultasi dengan dokter spesialis THT.
        </p>
      </div>
    </div>
  )
}
