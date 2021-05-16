import {Router} from 'express'
import * as usersCtrl from '../controllers/user_controller'
import * as commentCtrl from '../controllers/comment_controller'
import {authJwt} from '../middlewares'
import * as studentCtrl from '../controllers/students_controller'

const router = Router()

//GET

router.get('/actives', [authJwt.verifyToken,authJwt.isTeacher], studentCtrl.active) //Lista de estudiantes activos

router.get('/inactives', [authJwt.verifyToken,authJwt.isTeacher], studentCtrl.inactive) //Lista de estudiantes inactivos

router.get('/gradues', [authJwt.verifyToken,authJwt.isTeacher], studentCtrl.gradues) // Lista de estudiantes graduados

router.get('/info/:id', [authJwt.verifyToken,authJwt.isTeacher],  studentCtrl.showStudent) //Muestra informacion del estudiante

router.get('/sections/max', [authJwt.verifyToken,authJwt.isTeacher],  studentCtrl.sectionMax) //Muestra informacion del estudiante


//POST

router.post('/section', [authJwt.verifyToken,authJwt.isTeacher], studentCtrl.section) // Lista de estudiantes por secciones

router.post('/register', [authJwt.verifyToken,authJwt.isTeacher], studentCtrl.createStudent) //Recibe formulario

router.post('/register/file', [authJwt.verifyToken,authJwt.isTeacher], studentCtrl.createStudents) //Recibe csv

router.post('/comment/:id', [authJwt.verifyToken,authJwt.isTeacher], commentCtrl.commentStudent)  // Añade comentario al estudiante

//PUT

router.put('/info/:id', [authJwt.verifyToken,authJwt.isTeacher], studentCtrl.updateStudent) //Actualiza informacion del estudiante (Cedula,Nombre,Apellido y Notas)

router.put('/graduate', [authJwt.verifyToken,authJwt.isTeacher], studentCtrl.graduateStudent) //Gradua las estudiantes

router.put('/demote', [authJwt.verifyToken,authJwt.isTeacher], studentCtrl.demoteStudent) //Gradua las estudiantes

//DELETE

router.delete('/comment/delete/:id',[authJwt.verifyToken,authJwt.isTeacher], commentCtrl.uncomment)  // Borra comentario al estudiante

router.post('/delete', [authJwt.verifyToken,authJwt.isAdmin], studentCtrl.deleteStudents) // Borra al estudiantes de toda la base de datos


export default router
