import {Router} from 'express'
import * as repCtrl from '../controllers/representative_controller'
import {authJwt} from '../middlewares'
const router = Router()
//POST
router.get('/register',[authJwt.verifyToken,authJwt.isTeacher],repCtrl.register)
//PUT
router.put('/update/:id',[authJwt.verifyToken,authJwt.isTeacher],repCtrl.update)


export default router