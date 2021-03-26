import {Router} from 'express'
import * as usersCtrl from '../controllers/user_controller'
import {authJwt,verifySignup} from '../middlewares'
const router = Router()

router.get('/list',[authJwt.verifyToken,authJwt.isAdmin,authJwt.refreshToken],usersCtrl.getUsers)

router.put('/update/:id',[authJwt.verifyToken,authJwt.isAdmin,authJwt.refreshToken],usersCtrl.updateUser)

router.post('/register',[authJwt.verifyToken,authJwt.isAdmin,verifySignup.checkUser,verifySignup.checkRolesExisted,authJwt.refreshToken],usersCtrl.createUser)

router.delete('/delete/:id',[authJwt.verifyToken,authJwt.isAdmin,authJwt.refreshToken],usersCtrl.deleteUser)

export default router