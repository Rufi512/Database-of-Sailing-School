import {Router} from 'express'
import * as usersCtrl from '../controllers/user_controller'
import * as commentCtrl from '../controllers/comment_controller'
import {authJwt} from '../middlewares'
import * as studentCtrl from '../controllers/students_controller'

const router = Router()

//GET

router.get('/list',[authJwt.verifyToken,authJwt.isTeacher],studentCtrl.list) //Active Student List

router.get('/info/:id',[authJwt.verifyToken,authJwt.isTeacher],studentCtrl.showStudent) //Show student information

//POST


router.post('/register',[authJwt.verifyToken,authJwt.isTeacher],studentCtrl.createStudent) //Receive form

router.post('/register/file',[authJwt.verifyToken,authJwt.isTeacher],studentCtrl.createStudents) //Receive files

router.post('/comment/:id',[authJwt.verifyToken,authJwt.isTeacher],commentCtrl.commentStudent)  //Add comment to student

//PUT

router.put('/info/:id',[authJwt.verifyToken,authJwt.isTeacher],studentCtrl.updateStudent) //Update student information (ID, Name, Surname and Notes)

router.put('/scores/:id',[authJwt.verifyToken,authJwt.isTeacher],studentCtrl.saveScore) // save points 


//DELETE

router.delete('/comment/delete/:id',[authJwt.verifyToken,authJwt.isTeacher],commentCtrl.uncomment)  // Delete student comment

router.post('/delete', [authJwt.verifyToken,authJwt.checkPassword,authJwt.isModerator], studentCtrl.deleteStudents) // Delete the student from the entire database


export default router
