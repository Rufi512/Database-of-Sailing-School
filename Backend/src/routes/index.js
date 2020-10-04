const { Router } = require('express')
const fs = require('fs');
const {createStudent,createStudents} = require('../controllers/createStudents_controller')
const {showStudents,showStudent,historyStudent} = require('../controllers/showStudents_controller')
const {updateStudent,updateStudentForm,upgradeStudent,commitStudent,deleteCommit} = require('../controllers/updateStudents_controller.js')
const router = Router()



router.get('/students',showStudents) //Muestra la lista de estudiantes

router.get('/studentInfo/:id',showStudent) //Muestra informacion del estudiante

router.get('/studentInfoHistory/:id',historyStudent) //Muestra historial del estudiante

router.put('/studentUpdateInfo/:id',upgradeStudent) //Actualiza y guarda en trunk las notas del estudiante

router.post('/studentUpdate/:id',updateStudent) //Actualiza informacion del estudiante (Basico)

router.put('/studentUpdateForm/:id',updateStudentForm) //Actualiza informacion del estudiante (Cedula,Nombre,Apellido y Notas)

router.post('/studentCommit/:id',commitStudent) //Añade Comentario sobre el estudiante

router.post('/studentDeleteCommit/:id',deleteCommit) 

router.post('/regStudent',createStudent) //Recibe formulario

router.post('/regStudents',createStudents) //Recibe csv








module.exports = router