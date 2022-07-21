import {Router} from 'express'
import * as usersCtrl from '../controllers/user_controller'
import {authJwt,verifySignup} from '../middlewares'
const router = Router()

router.get('/list',[authJwt.verifyToken,authJwt.isAdmin],usersCtrl.getUsers)

router.get('/detail/:id',[authJwt.verifyToken],usersCtrl.getUser)

router.post('/register',[authJwt.verifyToken,verifySignup.validateInputUsers,authJwt.isAdmin,verifySignup.checkUser,verifySignup.checkRolesExisted],usersCtrl.createUser)

router.post('/change/password',usersCtrl.changePassword)

router.put('/update/:id',[authJwt.verifyToken,verifySignup.validateInputUsers],usersCtrl.updateUser)

router.delete('/delete/:id',[authJwt.verifyToken,authJwt.isAdmin],usersCtrl.deleteUser)

export default router