const { Router } = require('express')
const fs = require('fs');
const {showStudents,showStudent} = require('../controllers/showStudents_controller')
const {createStudent,createStudents} = require('../controllers/students_controller')
const router = Router()



router.get('/students',showStudents)

router.get('/studentInfo/:id',showStudent)

router.post('/regStudent',createStudent) //Recibe formulario

router.post('/regStudents',createStudents) //Recibe csv








module.exports = router