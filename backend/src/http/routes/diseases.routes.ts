import { Router } from 'express'
import {
  getDiseaseByCode,
  listDiseases,
} from '@http/controllers/diseases.controller.js'

export const diseasesRouter: Router = Router()

diseasesRouter.get('/diseases', listDiseases)
diseasesRouter.get('/diseases/:code', getDiseaseByCode)
