import {Router} from 'express'
import * as sectionsCtrl from '../controllers/sections_controller'
import * as graduationCtrl from '../controllers/graduation_controller.js'
import {authJwt,verifySignup} from '../middlewares'
const router = Router()

//GET
router.get('/info/:id',sectionsCtrl.sectionInfo)
router.get('/list',sectionsCtrl.list)
router.get('/list/select',sectionsCtrl.listSelects)
//POST
router.post('/register',sectionsCtrl.create)
router.post('/gradue/test',graduationCtrl.graduate)
router.post('/gradue',[authJwt.verifyToken,authJwt.checkPassword,authJwt.isModerator],graduationCtrl.graduate)
router.post('/students/delete/:section_id',sectionsCtrl.deleteStudentsInSection)
//PUT
router.put('/update/:id',sectionsCtrl.update)
//Delete (required password for user admin to process)
router.post('/delete/:section_id',[authJwt.verifyToken,authJwt.checkPassword,authJwt.isModerator],sectionsCtrl.deleteSection)

export default router