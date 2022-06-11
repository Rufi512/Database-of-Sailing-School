import {Router} from 'express'
import * as sectionsCtrl from '../controllers/sections_controller'
import * as graduationCtrl from '../controllers/graduation_controller.js'
import {authJwt} from '../middlewares'
const router = Router()

//GET
router.get('/info/:id',[authJwt.verifyToken,authJwt.isTeacher],sectionsCtrl.sectionInfo)
router.get('/list',[authJwt.verifyToken,authJwt.isTeacher],sectionsCtrl.list)

//POST
router.post('/register',[authJwt.verifyToken,authJwt.isTeacher],sectionsCtrl.create)
router.post('/add/subjects',[authJwt.verifyToken,authJwt.isModerator],sectionsCtrl.addSubjectSection)
router.post('/gradue',[authJwt.verifyToken,authJwt.isModerator],graduationCtrl.graduate)
//PUT
router.put('/update/:id',[authJwt.verifyToken,authJwt.isTeacher],sectionsCtrl.update)
//Delete (required password for user admin to process)
router.delete('/delete/subjects/:id',[authJwt.verifyToken,authJwt.checkPassword,authJwt.isAdmin],sectionsCtrl.deleteSubjectsSection)
router.delete('/delete/:section_id',[authJwt.verifyToken,authJwt.checkPassword,authJwt.isAdmin],sectionsCtrl.deleteSection)

export default router