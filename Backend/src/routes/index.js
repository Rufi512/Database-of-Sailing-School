const { Router } = require('express')
const fs = require('fs');
const {showStudents,showStudent} = require('../controllers/showStudents_controller')
const {saveStudent} = require('../controllers/trunk_controller')
const {updateStudent,updateBasic} = require('../controllers/updateStudents_controller')
const {createStudent,createStudents} = require('../controllers/createStudents_controller')
const router = Router()



router.get('/students',showStudents)

router.get('/studentInfo/:id',showStudent)

router.post('/studentUpdate/:id',updateStudent)

router.post('/studentUpdateBasic/:id',updateBasic) // Actualiza informacion del estudiante

router.put('/studentUpdateInfo/:id',saveStudent) //Actualiza y guarda en trunk las notas del estudiante

router.post('/regStudent',createStudent) //Recibe formulario

router.post('/regStudents',createStudents) //Recibe csv








module.exports = router