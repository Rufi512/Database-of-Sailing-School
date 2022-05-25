import {Router} from 'express'
import * as subjectsCtrl from '../controllers/subjects_controller'
import {authJwt} from '../middlewares'
const router = Router()

//GET
router.get('/list',subjectsCtrl.list)
//POST
router.post('/register',subjectsCtrl.register)
router.post('/assign',subjectsCtrl.assign)
router.post('/section/assign',subjectsCtrl.addSubjectsBySection)
//PUT
router.put('/update/:id',subjectsCtrl.update)
//Delete
router.delete('/delete',[authJwt.checkAdminPassword,authJwt.isAdmin],subjectsCtrl.deleteSubject)
export default router