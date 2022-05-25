import {Router} from 'express'
import * as sectionsCtrl from '../controllers/sections_controller'
import {authJwt} from '../middlewares'
const router = Router()

//GET
router.get('/info/:id',sectionsCtrl.sectionInfo)
router.get('/list',sectionsCtrl.list)

//POST
router.post('/register',sectionsCtrl.create)
router.post('/add/subjects',sectionsCtrl.addSubjectSection)
//PUT
router.put('/update/:id',sectionsCtrl.update)
//Delete
router.delete('/delete/subjects/:id',sectionsCtrl.deleteSubjectsSection)

export default router