const {Router} = require('express')
const {createStudent, createStudents} = require('../controllers/createStudents_controller')
const {showStudentsActive, showStudentsInactive, showStudentsGradues, showStudent} = require('../controllers/showStudents_controller')
const {updateStudentForm, studentUpgrade, studentDegrade, commitStudent, deleteCommit} = require('../controllers/updateStudents_controller.js')
const {deleteStudents} = require('../controllers/deleteStudents_controller')
const router = Router()



router.get('/students/actives', showStudentsActive) //lista de estudiantes activos

router.get('/students/inactives', showStudentsInactive) //lista de estudiantes inactivos

router.get('/students/gradues', showStudentsGradues) // lista de estudiantes graduados

router.get('/student/Info/:id', showStudent) //Muestra informacion del estudiante

router.put('/student/Upgrade', studentUpgrade) //Gradua y guarda en el trunk las notas del estudiante

router.put('/student/Degrade', studentDegrade) //Degrada al estudiante 

router.put('/student/Form/:id', updateStudentForm) //Actualiza informacion del estudiante (Cedula,Nombre,Apellido y Notas)

router.post('/student/Commit/:id', commitStudent) //Añade Comentario sobre el estudiante

router.post('/student/deleteCommit/:id', deleteCommit) //Borra el Comentario del estudiante

router.post('/student/Delete', deleteStudents) // Borra al estudiantes de toda la base de datos

router.post('/regStudent', createStudent) //Recibe formulario

router.post('/regStudents', createStudents) //Recibe csv








module.exports = router
