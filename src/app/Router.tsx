import { useEffect } from 'react'
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

/**
 * Resets scroll position to the top on every route change. React Router v6
 * does not restore scroll automatically, which caused links from sections
 * deep on the landing page (e.g. Knowledge Base "Detail" buttons) to land
 * the user in the middle/bottom of shorter destination pages.
 *
 * If the URL contains a hash (#anchor), let the browser handle it instead so
 * in-page anchor navigation still works.
 */
function ScrollToTop() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (hash) {
      // Defer to next tick so the destination element is in the DOM,
      // then smooth-scroll to it.
      const id = hash.replace('#', '')
      requestAnimationFrame(() => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          window.scrollTo(0, 0)
        }
      })
      return
    }
    window.scrollTo(0, 0)
    // `key` flips on every navigation (including same-pathname pushes),
    // so the listener fires reliably even when revisiting the same route.
  }, [pathname, hash, key])

  return null
}

export function Router() {
  const location = useLocation()

  return (
    <div className="flex min-h-full flex-col">
      <ScrollToTop />
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
