import { PageShell } from '@/components/shared/PageShell'
import { HeroSection } from '@/components/landing/HeroSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { ExplainableAISection } from '@/components/landing/ExplainableAISection'
import { LiveDiagnosisDemo } from '@/components/landing/LiveDiagnosisDemo'
import { KnowledgeBaseSection } from '@/components/landing/KnowledgeBaseSection'
import { MethodologySection } from '@/components/landing/MethodologySection'
import { CTASection } from '@/components/landing/CTASection'

export function LandingPage() {
  return (
    <PageShell>
      <HeroSection />
      <HowItWorksSection />
      <ExplainableAISection />
      <LiveDiagnosisDemo />
      <KnowledgeBaseSection />
      <MethodologySection />
      <CTASection />
    </PageShell>
  )
}
