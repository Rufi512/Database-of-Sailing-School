import {Router} from 'express'
import * as repCtrl from '../controllers/representative_controller'
import {authJwt} from '../middlewares'
const router = Router()
//GET
router.get('/list/select',[authJwt.verifyToken,authJwt.isTeacher],repCtrl.listSelect)
router.get('/list',[authJwt.verifyToken,authJwt.isTeacher],repCtrl.list)
router.get('/detail/:id',[authJwt.verifyToken,authJwt.isTeacher],repCtrl.detail)
//POST
router.post('/register',[authJwt.verifyToken,authJwt.isTeacher],repCtrl.register)
//PUT
router.put('/update/:id',[authJwt.verifyToken,authJwt.isTeacher],repCtrl.update)
//DELETE
router.post('/delete/:id',[authJwt.verifyToken,authJwt.checkPassword,authJwt.isTeacher],repCtrl.deleteRep)


export default router