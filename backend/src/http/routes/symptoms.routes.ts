import { Router } from 'express'
import { listSymptoms } from '@http/controllers/symptoms.controller.js'

export const symptomsRouter: Router = Router()

symptomsRouter.get('/symptoms', listSymptoms)
