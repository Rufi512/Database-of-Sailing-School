import {Router} from 'express'
import * as sectionsCtrl from '../controllers/sections_controller'
import * as graduationCtrl from '../controllers/graduation_controller.js'
import {authJwt} from '../middlewares'
const router = Router()

//GET
router.get('/info/:id',sectionsCtrl.sectionInfo)
router.get('/list',sectionsCtrl.list)

//POST
router.post('/register',sectionsCtrl.create)
router.post('/add/subjects',sectionsCtrl.addSubjectSection)
router.post('/gradue',graduationCtrl.graduate)
//PUT
router.put('/update/:id',sectionsCtrl.update)
//Delete
router.delete('/delete/subjects/:id',sectionsCtrl.deleteSubjectsSection)

export default router