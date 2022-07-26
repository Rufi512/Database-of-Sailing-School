import {Router} from 'express'
import * as subjectsCtrl from '../controllers/subjects_controller'
import {authJwt} from '../middlewares'
const router = Router()

//GET
router.get('/list',[authJwt.verifyToken,authJwt.isTeacher],subjectsCtrl.list)
//POST
router.post('/register',[authJwt.verifyToken,authJwt.isModerator],subjectsCtrl.register)
//Assign subjects in section 
router.post('/assign',[authJwt.verifyToken,authJwt.isModerator],subjectsCtrl.assign) // Assign for year school
router.post('/section/assign',[authJwt.verifyToken,authJwt.isModerator],subjectsCtrl.addSubjectsBySection) // Assign for section added previous
//PUT
router.put('/update/:id',[authJwt.verifyToken,authJwt.isModerator],subjectsCtrl.update)
//Delete
router.delete('/delete',[authJwt.checkPassword,authJwt.isAdmin],subjectsCtrl.deleteSubject)
export default router