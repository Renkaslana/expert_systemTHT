import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { PageShell } from '@/components/shared/PageShell'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function NotFoundPage() {
  return (
    <PageShell withAurora>
      <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="font-mono text-sm text-muted-foreground">404</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-5xl">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          Tautan yang Anda buka mungkin telah berubah atau tidak tersedia di prototype ini.
        </p>
        <Link to="/" className={cn(buttonVariants(), 'mt-6')}>
          <Home className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </PageShell>
  )
}
