import {Router} from 'express'
import * as usersCtrl from '../controllers/user_controller'
import * as commentCtrl from '../controllers/comment_controller'
import {authJwt} from '../middlewares'
import * as studentCtrl from '../controllers/students_controller'

const router = Router()

//GET

router.get('/list', [authJwt.verifyToken,authJwt.isTeacher], studentCtrl.list) //Active Student List

router.get('/search/', [authJwt.verifyToken,authJwt.isTeacher], studentCtrl.search) //Student Finder

router.get('/inactives', [authJwt.verifyToken,authJwt.isTeacher], studentCtrl.inactive) //Inactive Student List

router.get('/gradues', [authJwt.verifyToken,authJwt.isTeacher], studentCtrl.gradues) // List of graduating students

router.get('/info/:id', [authJwt.verifyToken,authJwt.isTeacher],  studentCtrl.showStudent) //Show student information

//POST

router.post('/section', [authJwt.verifyToken,authJwt.isTeacher], studentCtrl.section) // List of students by sections

router.post('/register', [authJwt.verifyToken,authJwt.isTeacher], studentCtrl.createStudent) //Receive form

router.post('/register/file', [authJwt.verifyToken,authJwt.isTeacher], studentCtrl.createStudents) //Receive files

router.post('/comment/:id', [authJwt.verifyToken,authJwt.isTeacher], commentCtrl.commentStudent)  //Add comment to student

//PUT

router.put('/info/:id', [authJwt.verifyToken,authJwt.isTeacher], studentCtrl.updateStudent) //Update student information (ID, Name, Surname and Notes)

router.put('/scores/:id', studentCtrl.saveScore) // save points 


//DELETE

router.delete('/comment/delete/:id',[authJwt.verifyToken,authJwt.isTeacher], commentCtrl.uncomment)  // Delete student comment

router.post('/delete', [authJwt.verifyToken,authJwt.isAdmin], studentCtrl.deleteStudents) // Delete the student from the entire database


export default router
