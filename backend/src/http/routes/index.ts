/**
 * Aggregates all v1 routes under /api/v1.
 */
import { Router } from 'express'
import { healthRouter } from './health.routes.js'
import { symptomsRouter } from './symptoms.routes.js'
import { diseasesRouter } from './diseases.routes.js'
import { rulesRouter } from './rules.routes.js'
import { diagnoseRouter } from './diagnose.routes.js'
import { sessionsRouter } from './sessions.routes.js'

export const apiRouter: Router = Router()

apiRouter.use(healthRouter)
apiRouter.use(symptomsRouter)
apiRouter.use(diseasesRouter)
apiRouter.use(rulesRouter)
apiRouter.use(diagnoseRouter)
apiRouter.use(sessionsRouter)
