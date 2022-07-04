import {Router} from 'express'
import * as chestCtrl from '../controllers/chest_controller'
import {authJwt} from '../middlewares'
const router = Router()
//GET
router.get('/:id',[authJwt.verifyToken,authJwt.isTeacher],chestCtrl.info)

export default router