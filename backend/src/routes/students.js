import {Router} from 'express'
import * as usersCtrl from '../controllers/user_controller'
import * as commentCtrl from '../controllers/comment_controller'
import {authJwt} from '../middlewares'
import * as studentCtrl from '../controllers/students_controller'

const router = Router()

//GET

router.get('/actives', [authJwt.verifyToken,authJwt.isTeacher,authJwt.refreshToken], studentCtrl.active) //lista de estudiantes activos

router.get('/inactives', [authJwt.verifyToken,authJwt.isTeacher,authJwt.refreshToken], studentCtrl.inactive) //lista de estudiantes inactivos

router.get('/gradues', [authJwt.verifyToken,authJwt.isTeacher,authJwt.refreshToken], studentCtrl.gradues) // lista de estudiantes graduados

router.get('/info/:id', [authJwt.verifyToken,authJwt.isTeacher,authJwt.refreshToken],  studentCtrl.showStudent) //Muestra informacion del estudiante

//POST

router.post('/register', [authJwt.verifyToken,authJwt.isTeacher,authJwt.refreshToken], studentCtrl.createStudent) //Recibe formulario

router.post('/register/file', [authJwt.verifyToken,authJwt.isTeacher,authJwt.refreshToken], studentCtrl.createStudents) //Recibe csv

router.post('/comment/:id', [authJwt.verifyToken,authJwt.isTeacher,authJwt.refreshToken], commentCtrl.commentStudent)  // Añade comentario al estudiante

//PUT

router.put('/info/:id', [authJwt.verifyToken,authJwt.isTeacher,authJwt.refreshToken], studentCtrl.updateStudent) //Actualiza informacion del estudiante (Cedula,Nombre,Apellido y Notas)

router.put('/graduate', [authJwt.verifyToken,authJwt.isModerator,authJwt.refreshToken], studentCtrl.graduateStudent) //Gradua las estudiantes

router.put('/demote', [authJwt.verifyToken,authJwt.isModerator,authJwt.refreshToken], studentCtrl.demoteStudent) //Gradua las estudiantes

//DELETE

router.delete('/comment/delete/:id',[authJwt.verifyToken,authJwt.isTeacher,authJwt.refreshToken], commentCtrl.uncomment)  // Borra comentario al estudiante

router.post('/delete', [authJwt.verifyToken,authJwt.isAdmin,authJwt.refreshToken], studentCtrl.deleteStudents) // Borra al estudiantes de toda la base de datos


export default router