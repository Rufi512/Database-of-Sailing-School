import {Router} from 'express'
import * as usersCtrl from '../controllers/user_controller'
import * as commentCtrl from '../controllers/comment_controller'
import {authJwt} from '../middlewares'
import * as studentCtrl from '../controllers/students_controller'

const router = Router()

//GET

router.get('/list',  studentCtrl.list) //Active Student List

router.get('/search/',  studentCtrl.search) //Student Finder

router.get('/inactives',  studentCtrl.inactive) //Inactive Student List

router.get('/gradues',  studentCtrl.gradues) // List of graduating students

router.get('/info/:id',   studentCtrl.showStudent) //Show student information

//POST

router.post('/section',  studentCtrl.section) // List of students by sections

router.post('/register',  studentCtrl.createStudent) //Receive form

router.post('/register/file',  studentCtrl.createStudents) //Receive files

router.post('/comment/:id',  commentCtrl.commentStudent)  //Add comment to student

//PUT

router.put('/info/:id',  studentCtrl.updateStudent) //Update student information (ID, Name, Surname and Notes)

router.put('/scores/:id',studentCtrl.saveScore) // save points 


//DELETE

router.delete('/comment/delete/:id', commentCtrl.uncomment)  // Delete student comment

router.post('/delete', [authJwt.verifyToken,authJwt.checkPassword,authJwt.isAdmin], studentCtrl.deleteStudents) // Delete the student from the entire database


export default router
