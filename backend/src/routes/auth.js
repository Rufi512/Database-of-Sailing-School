import {Router} from 'express'
import * as authCtrl from '../controllers/auth_controller'
const router = Router()

router.post('/register',authCtrl.signUp)

router.post('/login',authCtrl.signIn)

export default router