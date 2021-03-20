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
  const { comments } = studentFind;
  const academic_information = {
    school_year: studentFind.school_year,
    subjects: studentFind.subjects,
  };

  switch (studentFind.school_year) {
    case "1-A": {
      await student.updateOne(
        { _id: id },
        {
          $set: {
            "record.0": academic_information,
            "annual_comments.0": comments,
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
            "annual_comments.0": comments,
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
            "annual_comments.1": comments,
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
            "annual_comments.1": comments,
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
            "annual_comments.2": comments,
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
            "annual_comments.2": comments,
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
            "annual_comments.3": comments,
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
            "annual_comments.3": comments,
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
            "annual_comments.4": comments,
          },
        }
      );
      newSchoolYear = "Graduado";
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
        comments: [],
        last_modify: dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT"),
      },
    }
  );
};

export const demote = async (id) => {
  const studentFind = await student.findById(id);
  if (studentFind.school_year === "1-A" || studentFind.school_year === "1-B") {
    return console.log(
      "No se puede degradar mas al estudiante:" + student.firstName
    );
  }
  switch (studentFind.school_year) {
    case "2-A": {
      await student.updateOne(
        { _id: id },
        {
          $set: {
            "record.0": null,
            "annual_comments.0": null,
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
            "annual_comments.0": null,
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
            "annual_comments.1": null,
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
            "annual_comments.1": null,
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
            "annual_comments.2": null,
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
            "annual_comments.2": null,
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
            "annual_comments.3": null,
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
            "annual_comments.3": null,
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
        comments: [],
        last_modify: dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT"),
      },
    }
  );
};
