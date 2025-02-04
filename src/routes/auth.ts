import { Router } from 'express'
import {
  LoginController,
  LogoutController
} from '../controllers/auth.controller'
import validateSchema from '../middleware/validate-schema'
import { Login } from '../schemas/auth.schema'

const router = Router()

router.post('/login', validateSchema(Login), LoginController)
router.post('/logout', LogoutController)

export default router
