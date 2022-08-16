import {Router} from 'express'
import * as sectionsCtrl from '../controllers/sections_controller'
import * as graduationCtrl from '../controllers/graduation_controller.js'
import {authJwt,verifySignup} from '../middlewares'
const router = Router()

//GET
router.get('/info/:id',[authJwt.verifyToken,authJwt.isTeacher],sectionsCtrl.sectionInfo)
router.get('/list',[authJwt.verifyToken,authJwt.isTeacher],sectionsCtrl.list)
router.get('/list/select',[authJwt.verifyToken,authJwt.isTeacher],sectionsCtrl.listSelects)
//POST
router.post('/register',[authJwt.verifyToken,authJwt.isModerator],sectionsCtrl.create)
router.post('/gradue/test',[authJwt.verifyToken,authJwt.isModerator],graduationCtrl.graduate)
router.post('/gradue',[authJwt.verifyToken,authJwt.checkPassword,authJwt.isModerator],graduationCtrl.graduate)
router.post('/students/delete/:section_id',[authJwt.verifyToken,authJwt.checkPassword,authJwt.checkPassword,authJwt.isModerator],sectionsCtrl.deleteStudentsInSection)
//PUT
router.put('/update/:id',[authJwt.verifyToken,authJwt.isModerator],sectionsCtrl.update)
//Delete (required password for user admin to process)
router.post('/delete/:section_id',[authJwt.verifyToken,authJwt.checkPassword,authJwt.isModerator],sectionsCtrl.deleteSection)

export default router