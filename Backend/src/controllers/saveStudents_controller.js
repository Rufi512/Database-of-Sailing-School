const students = require('../models/students')
const dateFormat = require('dateformat')
const {materias1, materias2, materias3, materias4} = require('../data/subjects.js');
let now = new Date();
let {date} = require('../data/dateformat');
var newSchoolYear = '1-A'
var subjectsUpgrade = materias1;

dateFormat.i18n = date

module.exports = {
  // Registra al estudiante en el sistema

  register: async function (ci, firstName, lastName, school_year, subjects) {
    const studentReg = new students()
    studentReg.ci = ci;
    studentReg.firstName = firstName;
    studentReg.lastName = lastName;
    studentReg.school_year = school_year;
    studentReg.subjects = subjects;
    studentReg.last_modify = dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT");
    await studentReg.save()
    console.log('guardado')
  },


  //Actualiza la información del estudiante (Notas y Grado)
  upgrade: async function (id) {
    const student = await students.findById(id)
    switch (student.school_year) {
      case '1-A':
        {
          subjectsUpgrade = materias2
          newSchoolYear = '2-A'
          break;
        }
      case '1-B':
        {
          subjectsUpgrade = materias2
          newSchoolYear = '2-B'
          break;
        }

      case '2-A':
        {
          subjectsUpgrade = materias3
          newSchoolYear = '3-A'
          break;
        }
      case '2-B':
        {

          subjectsUpgrade = materias3
          newSchoolYear = '3-B'
          break;

        }

      case '3-A':
        {
          subjectsUpgrade = materias4
          newSchoolYear = '4-A'
          break;
        }
      case '3-B':
        {
          subjectsUpgrade = materias4
          newSchoolYear = '4-B'
          break;

        }

      case '4-A':
        {
          subjectsUpgrade = materias4
          newSchoolYear = '5-A'
          break;
        }
      case '4-B':
        {
          newSchoolYear = '5-B'
          subjectsUpgrade = materias4
          break;
        }
      case '5-A':
      case '5-B':
        {
          newSchoolYear = 'Graduado'

          subjectsUpgrade = null
          break;

        }
    }

    await students.updateOne({_id: id}, {
      $set: {
        school_year: newSchoolYear,
        subjects: subjectsUpgrade,
        commits: [],
        last_modify: dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT")
      }
    })
    console.log('Estudiante Actualizado con nuevo grado')

  },

  degrade: async function (id) {
    const student = await students.findById(id)
    if (student.school_year === '1-A' || student.school_year === '1-B') {
      return console.log('No se puede degradar mas al estudiantes:' + student.firstName)
    }
    switch (student.school_year) {

      case '2-A':
        {
          subjectsUpgrade = materias1
          newSchoolYear = '1-A'
          break;
        }
      case '2-B':
        {
          subjectsUpgrade = materias1
          newSchoolYear = '1-B'
          break;

        }

      case '3-A':
        {
          subjectsUpgrade = materias2
          newSchoolYear = '2-A'
          break;
        }
      case '3-B':
        {
          subjectsUpgrade = materias2
          newSchoolYear = '2-B'
          break;

        }

      case '4-A':
        {
          subjectsUpgrade = materias3
          newSchoolYear = '3-A'
          break;
        }
      case '4-B':
        {
          newSchoolYear = '3-B'
          subjectsUpgrade = materias3
          break;
        }
      case '5-A':
        {
          subjectsUpgrade = materias4
          newSchoolYear = '4-A'
          break;
        }
      case '5-B':
        {

          subjectsUpgrade = materias4
          newSchoolYear = '4-B'
          break;

        }
    }

    await students.updateOne({_id: id}, {
      $set: {
        school_year: newSchoolYear,
        subjects: subjectsUpgrade,
        commits: [],
        last_modify: dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT")
      }
    })
    console.log('Estudiante Degradado')

  },

  //Actualiza al estudiante (Solo Cedula,nombre,apellido,sus notas de las materias y estado)
  update: async function (id, CI, FirstName, LastName, Subjects, Status, res) {
    const {ci, firstName, lastName, subjects} = await students.findById(id)
    await students.updateOne({_id: id}, {
      $set: {
        ci: CI ? CI : ci,
        firstName: FirstName ? FirstName : firstName,
        lastName: LastName ? LastName : lastName,
        subjects: Subjects ? Subjects : subjects,
        status: Status,
        last_modify: dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT")
      }
    })
    res.json('Estudiante Actualizado!')

  },


  comments: async function (id, comment, res) {
    now = new Date()
    let author = "Anónimo"
    let commit_Information = {
      comment: comment,
      author,
      date_comment: dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT")
    }

    await students.updateOne({_id: id}, {
      $push: {
        commits: [commit_Information]
      }
    })
    res.json('Comentario Añadido')
  },

  unComment: async function (id, index, res) {
    var arrIndex = `commits.${index}`
    await students.updateOne({_id: id}, {
      $unset: {
        [arrIndex]: 1
      }

    }),

      await students.updateOne({_id: id}, {

        $pull: {
          commits: null
        }
      })
    res.json('Comentario eliminado')
  }



}
