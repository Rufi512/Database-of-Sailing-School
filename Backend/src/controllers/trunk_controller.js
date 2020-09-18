const trunk = require('../models/trunk')
const students = require('../models/students')
let { materias1, materias2, materias3, materias4 } = require('../data/subjects');

module.exports = {
	 //Llamamos la funcion para guardar sus notas actual en el trunk
    saveChest: async function(id,school_year, subjects) {
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

                break;
            }

            case "2-A":
            case "2-B": {
                trunkReg.record[1] = academic_information;
                break;
            }

            case "3-A":
            case "3-B": {
                trunkReg.record[2] = academic_information;
                break;
            }

            case "4-A":
            case "4-B": {
                trunkReg.record[3] = academic_information;
                break;
            }

            case "5-A":
            case "5-B": {
                trunkReg.record[4] = academic_information;
                break;
            }
        }

        trunkReg._id = student.id;
        (trunkReg.ci = student.ci),
            (trunkReg.firstName = student.firstName),
            (trunkReg.lastName = student.lastName),
            await trunkReg.save();
        console.log("Guardado");
    },

      //Guarda al estudiante ya registrado en el chest sus notas

    saveonChest: async function(id, school_year, subjects) {
        const student = await students.findById(id);
        const {ci,firstName,lastName} = student
        const academic_information = {
            school_year: student.school_year,
            subjects: student.subjects,
        };

        switch (school_year) {
            case "1-A":
            case "1-B": {
                await trunk.update(
                    { _id: id },
                    {
                        $set: {
                            ci: ci,
                            firstName: firstName,
                            lastName: lastName,
                            "record.0": academic_information,
                        },
                    }
                );
                break;
            }

            case "2-A":
            case "2-B": {
                await trunk.update(
                    { _id: id },
                    {
                        $set: {
                            ci: ci,
                            firstName: firstName,
                            lastName: lastName,
                            "record.1": academic_information,
                        },
                    }
                );
                break;
            }

            case "3-A":
            case "3-B": {
                await trunk.update(
                    { _id: id },
                    {
                        $set: {
                            ci: ci,
                            firstName: firstName,
                            lastName: lastName,
                            "record.2": academic_information,
                        },
                    }
                );
                break;
            }

            case "4-A":
            case "4-B": {
                await trunk.update(
                    { _id: id },
                    {
                        $set: {
                            ci: ci,
                            firstName: firstName,
                            lastName: lastName,
                            "record.3": academic_information,
                        },
                    }
                );
                break;
            }

            case "5-A":
            case "5-B": {
                await trunk.update(
                    { _id: id },
                    {
                        $set: {
                            ci: ci,
                            firstName: firstName,
                            lastName: lastName,
                            "record.4": academic_information,
                        },
                    }
                );
                break;
            }
        }

        console.log('Notas Guardadas en baul')
    }
}



