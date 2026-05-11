import { Router } from 'express'
import { diagnose } from '@http/controllers/diagnose.controller.js'

export const diagnoseRouter: Router = Router()

diagnoseRouter.post('/diagnose', diagnose)
