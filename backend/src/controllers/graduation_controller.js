import student from "../models/student";
import { materias1, materias2, materias3, materias4 } from "../libs/subjects.js";
import date from "../libs/dateformat";
import dateFormat from "dateformat";

let now = new Date();
var newSchoolYear = "1-A";
var subjectsUpgrade = materias1;

dateFormat.i18n = date;

//Actualiza la información del estudiante (Notas y Grado)
export const graduate = async (id) => {
  const studentFind = await student.findById(id);
  
  const academic_information = {
    school_year: studentFind.school_year,
    subjects: studentFind.subjects,
  };
 
 /*Verificamos si el estudiante es apto para ser graduado*/
  const pass_information = academic_information.subjects.map((el)=>{
    if(Math.round((el.score[0] + el.score[1] + el.score[2]) / 3) >= 10  ){
      return true
    }else{
      return false
    }
  })

  const validGradue = pass_information.filter((el)=>{return el === false})

  if(validGradue.length > 0 || studentFind.status === false){
    return false
  }


  switch (studentFind.school_year) {
    case "1-A": {
      await student.updateOne(
        { _id: id },
        {
          $set: {
            "record.0": academic_information,
          },
        }
      );
      subjectsUpgrade = materias2;
      newSchoolYear = "2-A";
      break;
    }
    case "1-B": {
      await student.updateOne(
        { _id: id },
        {
          $set: {
            "record.0": academic_information,
          },
        }
      );

      subjectsUpgrade = materias2;
      newSchoolYear = "2-B";
      break;
    }

    case "2-A": {
      await student.updateOne(
        { _id: id },
        {
          $set: {
            "record.1": academic_information,
          },
        }
      );
      subjectsUpgrade = materias3;
      newSchoolYear = "3-A";
      break;
    }
    case "2-B": {
      await student.updateOne(
        { _id: id },
        {
          $set: {
            "record.1": academic_information,
          },
        }
      );
      subjectsUpgrade = materias3;
      newSchoolYear = "3-B";
      break;
    }

    case "3-A": {
      await student.updateOne(
        { _id: id },
        {
          $set: {
            "record.2": academic_information,
          },
        }
      );
      subjectsUpgrade = materias4;
      newSchoolYear = "4-A";
      break;
    }
    case "3-B": {
      await student.updateOne(
        { _id: id },
        {
          $set: {
            "record.2": academic_information,
          },
        }
      );
      subjectsUpgrade = materias4;
      newSchoolYear = "4-B";
      break;
    }

    case "4-A": {
      await student.updateOne(
        { _id: id },
        {
          $set: {
            "record.3": academic_information,
          },
        }
      );
      subjectsUpgrade = materias4;
      newSchoolYear = "5-A";
      break;
    }
    case "4-B": {
      await student.updateOne(
        { _id: id },
        {
          $set: {
            "record.3": academic_information,
          },
        }
      );
      newSchoolYear = "5-B";
      subjectsUpgrade = materias4;
      break;
    }
    case "5-A":
    case "5-B": {
      await student.updateOne(
        { _id: id },
        {
          $set: {
            status: false,
            "record.4": academic_information,
          },
        }
      );
      newSchoolYear = "graduado";
      subjectsUpgrade = null;
      break;
    }
  }

  await student.updateOne(
    { _id: id },
    {
      $set: {
        school_year: newSchoolYear,
        subjects: subjectsUpgrade,
        last_modify: dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT"),
      },
    }
  );
   
  return true
  
};

export const demote = async (id) => {
  const studentFind = await student.findById(id);
  if (studentFind.school_year === "1-A" || studentFind.school_year === "1-B" || studentFind.status === false) {
    return false
  }
  switch (studentFind.school_year) {
    case "2-A": {
      await student.updateOne(
        { _id: id },
        {
          $set: {
            "record.0": null,
          },
        }
      );
      subjectsUpgrade = materias1;
      newSchoolYear = "1-A";
      break;
    }
    case "2-B": {
      await student.updateOne(
        { _id: id },
        {
          $set: {
            "record.0": null,
          },
        }
      );
      subjectsUpgrade = materias1;
      newSchoolYear = "1-B";
      break;
    }

    case "3-A": {
      await student.updateOne(
        { _id: id },
        {
          $set: {
            "record.1": null,
          },
        }
      );
      subjectsUpgrade = materias2;
      newSchoolYear = "2-A";
      break;
    }
    case "3-B": {
      await student.updateOne(
        { _id: id },
        {
          $set: {
            "record.1": null,
          },
        }
      );
      subjectsUpgrade = materias2;
      newSchoolYear = "2-B";
      break;
    }

    case "4-A": {
      await student.updateOne(
        { _id: id },
        {
          $set: {
            "record.2": null,
          },
        }
      );
      subjectsUpgrade = materias3;
      newSchoolYear = "3-A";
      break;
    }
    case "4-B": {
      await student.updateOne(
        { _id: id },
        {
          $set: {
            "record.2": null,
          },
        }
      );
      newSchoolYear = "3-B";
      subjectsUpgrade = materias3;
      break;
    }
    case "5-A": {
      await student.updateOne(
        { _id: id },
        {
          $set: {
            "record.3": null,
          },
        }
      );
      subjectsUpgrade = materias4;
      newSchoolYear = "4-A";
      break;
    }
    case "5-B": {
      await student.updateOne(
        { _id: id },
        {
          $set: {
            "record.3": null,
          },
        }
      );
      subjectsUpgrade = materias4;
      newSchoolYear = "4-B";
      break;
    }
  }

  await student.updateOne(
    { _id: id },
    {
      $set: {
        school_year: newSchoolYear,
        subjects: subjectsUpgrade,
        last_modify: dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT"),
      },
    }
  );

  return true
};
