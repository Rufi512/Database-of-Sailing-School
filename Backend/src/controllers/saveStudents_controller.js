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
    const {comments} = student
    const academic_information = {
      school_year: student.school_year,
      subjects: student.subjects,
    };


    switch (student.school_year) {
      case '1-A':
        {
          await students.updateOne(
            {_id: id},
            {
              $set: {
                "record.0": academic_information,
                "annualComments.0": comments
              },
            }
          );
          subjectsUpgrade = materias2
          newSchoolYear = '2-A'
          break;
        }
      case '1-B':
        {
          await students.updateOne(
            {_id: id},
            {
              $set: {
                "record.0": academic_information,
                "annualComments.0": comments
              },
            }
          );

          subjectsUpgrade = materias2
          newSchoolYear = '2-B'
          break;
        }

      case '2-A':
        {
          await students.updateOne(
            {_id: id},
            {
              $set: {
                "record.1": academic_information,
                "annualComments.1": comments
              },
            }
          );
          subjectsUpgrade = materias3
          newSchoolYear = '3-A'
          break;
        }
      case '2-B':
        {
          await students.updateOne(
            {_id: id},
            {
              $set: {
                "record.1": academic_information,
                "annualComments.1": comments
              },
            }
          );
          subjectsUpgrade = materias3
          newSchoolYear = '3-B'
          break;

        }

      case '3-A':
        {
          await students.updateOne(
            {_id: id},
            {
              $set: {
                "record.2": academic_information,
                "annualComments.2": comments
              },
            }
          );
          subjectsUpgrade = materias4
          newSchoolYear = '4-A'
          break;
        }
      case '3-B':
        {
          await students.updateOne(
            {_id: id},
            {
              $set: {
                "record.2": academic_information,
                "annualComments.2": comments
              },
            }
          );
          subjectsUpgrade = materias4
          newSchoolYear = '4-B'
          break;

        }

      case '4-A':
        {
          await students.updateOne(
            {_id: id},
            {
              $set: {
                "record.3": academic_information,
                "annualComments.3": comments
              },
            }
          );
          subjectsUpgrade = materias4
          newSchoolYear = '5-A'
          break;
        }
      case '4-B':
        {
          await students.updateOne(
            {_id: id},
            {
              $set: {
                "record.3": academic_information,
                "annualComments.3": comments
              },
            }
          );
          newSchoolYear = '5-B'
          subjectsUpgrade = materias4
          break;
        }
      case '5-A':
      case '5-B':
        {
          await students.updateOne(
            {_id: id},
            {
              $set: {
                status:false,
                "record.4": academic_information,
                "annualComments.4": comments
              },
            }
          );
          newSchoolYear = 'Graduado'
          subjectsUpgrade = null
          break;

        }
    }

    await students.updateOne({_id: id}, {
      $set: {
        school_year: newSchoolYear,
        subjects: subjectsUpgrade,
        comments: [],
        last_modify: dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT")
      }
    })
  },

  degrade: async function (id) {
    const student = await students.findById(id)
    if (student.school_year === '1-A' || student.school_year === '1-B') {
      return console.log('No se puede degradar mas al estudiante:' + student.firstName)
    }
    switch (student.school_year) {

      case '2-A':
        {
          await students.updateOne(
            {_id: id},
            {
              $set: {
                "record.0": null,
                "annualComments.0": null
              },
            }
          );
          subjectsUpgrade = materias1
          newSchoolYear = '1-A'
          break;
        }
      case '2-B':
        {
          await students.updateOne(
            {_id: id},
            {
              $set: {
                "record.0": null,
                "annualComments.0": null
              },
            }
          );
          subjectsUpgrade = materias1
          newSchoolYear = '1-B'
          break;

        }

      case '3-A':
        {
          await students.updateOne(
            {_id: id},
            {
              $set: {
                "record.1": null,
                "annualComments.1": null
              },
            }
          );
          subjectsUpgrade = materias2
          newSchoolYear = '2-A'
          break;
        }
      case '3-B':
        {
          await students.updateOne(
            {_id: id},
            {
              $set: {
                "record.1": null,
                "annualComments.1": null
              },
            }
          );
          subjectsUpgrade = materias2
          newSchoolYear = '2-B'
          break;

        }

      case '4-A':
        {
          await students.updateOne(
            {_id: id},
            {
              $set: {
                "record.2": null,
                "annualComments.2": null
              },
            }
          );
          subjectsUpgrade = materias3
          newSchoolYear = '3-A'
          break;
        }
      case '4-B':
        {
          await students.updateOne(
            {_id: id},
            {
              $set: {
                "record.2": null,
                "annualComments.2": null
              },
            }
          );
          newSchoolYear = '3-B'
          subjectsUpgrade = materias3
          break;
        }
      case '5-A':
        {
          await students.updateOne(
            {_id: id},
            {
              $set: {
                "record.3": null,
                "annualComments.3": null
              },
            }
          );
          subjectsUpgrade = materias4
          newSchoolYear = '4-A'
          break;
        }
      case '5-B':
        {
          await students.updateOne(
            {_id: id},
            {
              $set: {
                "record.3": null,
                "annualComments.3": null
              },
            }
          );
          subjectsUpgrade = materias4
          newSchoolYear = '4-B'
          break;

        }
    }

    await students.updateOne({_id: id}, {
      $set: {
        school_year: newSchoolYear,
        subjects: subjectsUpgrade,
        comments: [],
        last_modify: dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT")
      }
    })
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
        comments: [commit_Information]
      }
    })
    res.json('Comentario Añadido')
  },

  unComment: async function (id, index, res) {
    var arrIndex = `comments.${index}`
    await students.updateOne({_id: id}, {
      $unset: {
        [arrIndex]: 1
      }

    }),

      await students.updateOne({_id: id}, {

        $pull: {
          comments: null
        }
      })
    res.json('Comentario eliminado')
  }



}
