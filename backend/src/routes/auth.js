import {Router} from 'express'
import * as authCtrl from '../controllers/auth_controller'
import {validateCaptcha} from '../middlewares/verifySignup'
const router = Router()

router.post('/login',authCtrl.signIn)

export default router