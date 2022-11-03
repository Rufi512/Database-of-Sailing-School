import {Router} from 'express'
import * as authCtrl from '../controllers/auth_controller'
import * as recoveryCtrl from '../controllers/recovery_controller'
import {validateCaptcha} from '../middlewares/verifySignup'
import {authJwt} from '../middlewares'
import {countries} from '../libs/countriesFormat'
const router = Router()
//GET
router.get('/codes/phones',(req,res)=>{
	let newList = []
	for(const countrie of countries){
		newList.push({label:`${countrie.dialCode} ${countrie.isoCode} - ${countrie.name}`, value:`${countrie.isoCode}`})
	}
	res.json(newList)
})
router.get('/questions/user/:id',[authJwt.verifyToken],recoveryCtrl.getQuestionsOnLogin) //list question from user registered
router.get('/questions/user/',[authJwt.verifyToken],recoveryCtrl.getQuestionsOnLogin)
router.get('/verify/token',[authJwt.verifyToken,authJwt.isUserOrAdmin],authCtrl.verifyTokenConfirm)

//POST
router.post('/login',[validateCaptcha],authCtrl.signIn)
router.post('/questions',[validateCaptcha],recoveryCtrl.getQuestions) //list question from user registered
router.post('/register/questions/:id',[authJwt.verifyToken,authJwt.isUserOrAdmin],recoveryCtrl.setQuestions) //set list question from user registered
router.post('/register/questions/',[authJwt.verifyToken,authJwt.isUserOrAdmin],recoveryCtrl.setQuestions)
router.post('/questions/check',recoveryCtrl.checkQuestions)
router.post('/send/unblocked',[validateCaptcha],recoveryCtrl.sendUnblocked)
router.post('/forgot-password',[validateCaptcha],recoveryCtrl.forgotPassword)
router.post('/reset-password/:id/:token',recoveryCtrl.resetPassword)
router.post('/unblocked/user/:id/:token',recoveryCtrl.unblockedUser)
router.delete('/question/delete/:id',[authJwt.verifyToken,authJwt.isUserOrAdmin],recoveryCtrl.deleteQuestionUser)

export default router