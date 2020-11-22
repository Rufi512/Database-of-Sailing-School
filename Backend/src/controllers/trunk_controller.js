const trunk = require('../models/trunk')
const students = require('../models/students')

module.exports = {
  //Llamamos la funcion para guardar sus notas actual en el trunk
  createChest: async function (id, school_year) {
    const student = await students.findById(id);

    const academic_information = {
      school_year: student.school_year,
      subjects: student.subjects,
    };

    const trunkReg = new trunk();

    switch (school_year) {
      case "1-A":
      case "1-B": {
        trunkReg.record[0] = academic_information;
        trunkReg.comments[0] = student.commits;
        break;
      }

      case "2-A":
      case "2-B": {
        trunkReg.record[1] = academic_information;
        trunkReg.comments[1] = student.commits;
        break;
      }

      case "3-A":
      case "3-B": {
        trunkReg.record[2] = academic_information;
        trunkReg.comments[2] = student.commits;
        break;
      }

      case "4-A":
      case "4-B": {
        trunkReg.record[3] = academic_information;
        trunkReg.comments[3] = student.commits
        break;
      }

      case "5-A":
      case "5-B": {
        trunkReg.record[4] = academic_information;
        trunkReg.comments[4] = student.commits;
        break;
      }
    }

    trunkReg._id = student.id;
    (trunkReg.ci = student.ci),
      (trunkReg.firstName = student.firstName),
      (trunkReg.lastName = student.lastName),
      await trunkReg.save();
  },

  //Guarda al estudiante ya registrado en el chest sus notas

  saveonChest: async function (id, school_year) {
    const student = await students.findById(id);
    const {ci, firstName, lastName, commits} = student
    const academic_information = {
      school_year: student.school_year,
      subjects: student.subjects,
    };

    switch (school_year) {
      case "1-A":
      case "1-B": {
        await trunk.updateOne(
          {_id: id},
          {
            $set: {
              ci: ci,
              firstName: firstName,
              lastName: lastName,
              "record.0": academic_information,
              "comments.0": commits
            },
          }
        );
        break;
      }

      case "2-A":
      case "2-B": {
        await trunk.updateOne(
          {_id: id},
          {
            $set: {
              ci: ci,
              firstName: firstName,
              lastName: lastName,
              "record.1": academic_information,
              "comments.1": commits
            },
          }
        );
        break;
      }

      case "3-A":
      case "3-B": {
        await trunk.updateOne(
          {_id: id},
          {
            $set: {
              ci: ci,
              firstName: firstName,
              lastName: lastName,
              "record.2": academic_information,
              "comments.2": commits
            },
          }
        );
        break;
      }

      case "4-A":
      case "4-B": {
        await trunk.updateOne(
          {_id: id},
          {
            $set: {
              ci: ci,
              firstName: firstName,
              lastName: lastName,
              "record.3": academic_information,
              "comments.3": commits
            },
          }
        );
        break;
      }

      case "5-A":
      case "5-B": {
        await trunk.updateOne(
          {_id: id},
          {
            $set: {
              ci: ci,
              firstName: firstName,
              lastName: lastName,
              "record.4": academic_information,
              "comments.4": commits
            },
          }
        );
        break;
      }
    }

    console.log('Notas Guardadas en baul')
  },

  eraseOnChest: async function (id) {
    const student = await students.findById(id)
    const {ci, firstName, lastName, school_year} = student

    switch (school_year) {
      case "2-A":
      case "2-B": {
        await trunk.updateOne(
          {_id: id},
          {
            $set: {
              ci: ci,
              firstName: firstName,
              lastName: lastName,
              "record.0": null,
              "comments.0": null
            },
          }
        );
        break;
      }

      case "3-A":
      case "3-B": {
        await trunk.updateOne(
          {_id: id},
          {
            $set: {
              ci: ci,
              firstName: firstName,
              lastName: lastName,
              "record.1": null,
              "comments.1": null
            },
          }
        );
        break;
      }

      case "4-A":
      case "4-B": {
        await trunk.updateOne(
          {_id: id},
          {
            $set: {
              ci: ci,
              firstName: firstName,
              lastName: lastName,
              "record.2": null,
              "comments.2": null
            },
          }
        );
        break;
      }

      case "5-A":
      case "5-B": {
        await trunk.updateOne(
          {_id: id},
          {
            $set: {
              ci: ci,
              firstName: firstName,
              lastName: lastName,
              "record.3": null,
              "comments.3": null
            },
          }
        );
        break;
      }
    }


  }
}



