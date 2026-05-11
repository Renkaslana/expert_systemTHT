import { Router } from 'express'
import {
  createSession,
  getSession,
} from '@http/controllers/sessions.controller.js'

export const sessionsRouter: Router = Router()

sessionsRouter.post('/sessions', createSession)
sessionsRouter.get('/sessions/:token', getSession)
