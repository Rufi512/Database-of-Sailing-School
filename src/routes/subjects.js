import {Router} from 'express'
import * as subjectsCtrl from '../controllers/subjects_controller'
import {authJwt} from '../middlewares'
const router = Router()

//GET
router.get('/list',subjectsCtrl.list)
router.get('/list/section/:id',subjectsCtrl.listAvalaibleSection)
//POST
router.post('/register',subjectsCtrl.register)
//Assign subjects in section 
router.put('/section/update/:id',subjectsCtrl.updateSubjectsBySection) // Assign for section added previous
//PUT
router.put('/update/:id',subjectsCtrl.update)
//Delete
router.post('/delete',subjectsCtrl.deleteSubject)
export default router