import {Router} from 'express'
import * as authCtrl from '../controllers/auth_controller'
import * as recoveryCtrl from '../controllers/recovery_controller'
import {validateCaptcha} from '../middlewares/verifySignup'
import {authJwt} from '../middlewares'
const router = Router()
//POST
router.post('/login',[validateCaptcha],authCtrl.signIn)

router.post('/questions',[validateCaptcha],recoveryCtrl.getQuestions) //list question from user registered
router.post('/register/questions',[authJwt.verifyToken],recoveryCtrl.setQuestions) //set list question from user registered
router.post('/questions/check',recoveryCtrl.checkQuestions)

router.post('/forgot-password',[validateCaptcha],recoveryCtrl.forgotPassword)

router.post('/reset-password/:id/:token',recoveryCtrl.resetPassword)
export default router