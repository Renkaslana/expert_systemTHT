import { useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { LandingPage } from '@/pages/LandingPage'
import { ConsultationPage } from '@/pages/ConsultationPage'
import { ResultPage } from '@/pages/ResultPage'
import { DiseaseListPage } from '@/pages/DiseaseListPage'
import { DiseaseDetailPage } from '@/pages/DiseaseDetailPage'
import { AboutPage } from '@/pages/AboutPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function Router() {
  const location = useLocation()

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/konsultasi" element={<ConsultationPage />} />
          <Route path="/hasil" element={<ResultPage />} />
          <Route path="/penyakit" element={<DiseaseListPage />} />
          <Route path="/penyakit/:id" element={<DiseaseDetailPage />} />
          <Route path="/tentang" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  )
}
