export type SymptomCategory = 'telinga' | 'hidung' | 'tenggorokan' | 'umum'
export type BodyArea = 'ear' | 'nose' | 'throat' | 'head' | 'general'
export type Severity = 'low' | 'medium' | 'high'
export type DiseaseSeverity = 'mild' | 'moderate' | 'severe'
export type ConfidenceLevel = 'very_high' | 'high' | 'medium' | 'low'
export type CFWeight = 0 | 0.2 | 0.4 | 0.6 | 0.8 | 1.0

export interface Symptom {
  code: string
  name: string
  nameEn: string
  category: SymptomCategory
  bodyArea: BodyArea
  severity: Severity
  description: string
}

export interface Disease {
  code: string
  name: string
  nameShort: string
  category: string
  severity: DiseaseSeverity
  icdCode: string
  iconKey: 'ear' | 'nose' | 'throat' | 'sinus' | 'general'
  description: string
  causes: string[]
  generalSymptoms: string[]
  treatmentAdvice: string[]
  whenToSeeDoctor: string
  relatedDiseases: string[]
  expertSource: string
}

export interface SymptomContribution {
  symptomCode: string
  symptomName: string
  userWeight: number
  expertWeight: number
  cfValue: number
  contributionPercent: number
}

export interface IterationStep {
  iteration: number
  symptomCode: string
  symptomName: string
  cfBefore: number
  cfAdded: number
  cfAfter: number
  formula: string
}

export interface DiagnosisResult {
  diseaseCode: string
  diseaseName: string
  diseaseCategory: string
  cfValue: number
  cfPercentage: string
  confidenceLevel: ConfidenceLevel
  rank: number
  contributingSymptoms: SymptomContribution[]
  iterationSteps: IterationStep[]
  explanation: string
}

export interface CFRule {
  diseaseCode: string
  symptomCode: string
  expertWeight: number
}
