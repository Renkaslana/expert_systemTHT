import { Router } from 'express'
import { listCfRules } from '@http/controllers/rules.controller.js'

export const rulesRouter: Router = Router()

rulesRouter.get('/cf-rules', listCfRules)
