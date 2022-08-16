import {Router} from 'express'
import * as subjectsCtrl from '../controllers/subjects_controller'
import {authJwt} from '../middlewares'
const router = Router()

//GET
router.get('/list',[authJwt.verifyToken,authJwt.isTeacher],subjectsCtrl.list)
router.get('/list/section/:id',[authJwt.verifyToken,authJwt.isTeacher],subjectsCtrl.listAvalaibleSection)
//POST
router.post('/register',[authJwt.verifyToken,authJwt.isModerator],subjectsCtrl.register)
//Assign subjects in section 
router.put('/section/update/:id',[authJwt.verifyToken,authJwt.isModerator],subjectsCtrl.updateSubjectsBySection) // Assign for section added previous
//PUT
router.put('/update/:id',[authJwt.verifyToken,authJwt.isModerator],subjectsCtrl.update)
//Delete
router.post('/delete',[authJwt.verifyToken,authJwt.isModerator],subjectsCtrl.deleteSubject)
export default router