import {Router} from 'express'
import * as studentCtrl from '../controllers/students_controller'

const router = Router()

router.get('/actives', studentCtrl.active) //lista de estudiantes activos

router.get('/inactives', studentCtrl.inactive) //lista de estudiantes inactivos

router.get('/gradues', studentCtrl.gradues) // lista de estudiantes graduados

router.get('/info/:id', studentCtrl.showStudent) //Muestra informacion del estudiante

router.post('/register', studentCtrl.createStudent) //Recibe formulario

router.post('/register/file', studentCtrl.createStudents) //Recibe csv

router.post('/comment/:id', studentCtrl.commentStudent)  // Añade comentario al estudiante

router.put('/info/:id', studentCtrl.updateStudent) //Actualiza informacion del estudiante (Cedula,Nombre,Apellido y Notas)

router.put('/graduate', studentCtrl.graduateStudent) //Gradua las estudiantes

router.put('/demote', studentCtrl.demoteStudent) //Gradua las estudiantes

//delete
router.post('/comment/delete/:id', studentCtrl.uncomment)  // Borra comentario al estudiante

router.post('/delete', studentCtrl.deleteStudents) // Borra al estudiantes de toda la base de datos


export default router