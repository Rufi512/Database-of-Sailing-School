import {Router} from 'express'
import * as usersCtrl from '../controllers/user_controller'
import {authJwt,verifySignup} from '../middlewares'
const router = Router()

router.get('/list',[authJwt.verifyToken,authJwt.isAdmin],usersCtrl.getUsers)

router.put('/update/:id',[authJwt.verifyToken,authJwt.isAdmin],usersCtrl.updateUser)

router.post('/register',[authJwt.verifyToken,authJwt.isAdmin,verifySignup.checkUser,verifySignup.checkRolesExisted],usersCtrl.createUser)

router.delete('/delete/:id',[authJwt.verifyToken,authJwt.isAdmin],usersCtrl.deleteUser)

export default router