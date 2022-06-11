import {Router} from 'express'
import * as repCtrl from '../controllers/representative_controller'
const router = Router()
//POST
router.get('/register',[authJwt.verifyToken,authJwt.isTeacher],repCtrl.register)
//PUT
router.put('/update/:id',[authJwt.verifyToken,authJwt.isTeacher],repCtrl.update)


export default router