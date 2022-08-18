import student from "../models/student";
import section from "../models/section";
import chest from "../models/chest";
import { date } from "../libs/dateformat";
import dateFormat from "dateformat";

let now = new Date();
dateFormat.i18n = date;

//return the info from students gradues
export const graduate = async (req, res) => {

    try {
        let studentsApproves = [];
        let studentsRejects = [];
        const id = req.body.id;
        const sectionFound = await section.findById(id);
        if (!sectionFound)
            return res.status(404).json({ message: "Seccion no encontrada" });
        for (const el of sectionFound.students) {
            let scoresSubjects = [];
            const studentFind = await student
                .findById(el)
                .populate("subjects.subject", "name");
            if (studentFind) {
                //Check the subjects for student
                for (const subject of studentFind.subjects) {
                    let sumScore = subject.scores.reduce(
                        (accumulator, value) => {
                            return accumulator + value;
                        },
                        0
                    );

                    if (sumScore > 0) {
                        scoresSubjects.push(sumScore / subject.scores.length);
                    } else {
                        scoresSubjects.push(0);
                    }
                }

                //Convert and sum scores
                scoresSubjects = scoresSubjects.reduce((accumulator, value) => {
                    return accumulator + value;
                }, 0);

                if (
                    isNaN(scoresSubjects / studentFind.subjects.length) ||
                    studentFind.subjects.length === 0 ||
                    studentFind.subjects.length !==
                        sectionFound.subjects.length ||
                    sectionFound.subjects.length === 0
                ) {
                    studentsRejects.push({
                        firstname: studentFind.firstname,
                        lastname: studentFind.lastname,
                        ci: studentFind.ci,
                        reason: "La cantidad de materias registradas en el estudiante no coincide con las registradas en el curso",
                    });
                }

                if (
                    scoresSubjects / studentFind.subjects.length < 10 &&
                    studentFind.subjects.length === sectionFound.subjects.length
                ) {
                    studentsRejects.push({
                        firstname: studentFind.firstname,
                        lastname: studentFind.lastname,
                        ci: studentFind.ci,
                        reason: "El estudiante no cuenta con la nota minima para pasar (10)",
                    });
                }

                if (
                    scoresSubjects / studentFind.subjects.length >= 10 &&
                    studentFind.subjects.length === sectionFound.subjects.length
                ) {
                    studentsApproves.push({
                        id: studentFind.id,
                        firstname: studentFind.firstname,
                        lastname: studentFind.lastname,
                        ci: studentFind.ci,
                    });
                }

                if (req.route.path != "/gradue/test") {
                    // FInd the archive from student
                    let archiveFound = await chest.findOne({
                        student: studentFind._id,
                    });

                    if (!archiveFound) {
                        const createChest = await new chest({
                            student: studentFind._id,
                            data: [],
                            last_modify: dateFormat(
                                now,
                                "dddd, d De mmmm , yyyy, h:MM:ss TT"
                            ),
                        });

                        const savedChest = await createChest.save();

                        archiveFound = await chest.findOne({
                            student: studentFind._id,
                        });
                    } else {
                        archiveFound = await chest.findOne({
                            student: studentFind._id,
                        });
                    }

                    // Set data actual to save
                    const dataNew = {
                        section: {
                            id: sectionFound._id,
                            name: sectionFound.name,
                            year: sectionFound.year,
                        },
                        subjects: studentFind.subjects,
                        approved: studentsApproves.filter((el) => {
                            return el.id === studentFind._id.toString();
                        })[0]
                            ? true
                            : false,
                        period_initial: sectionFound.period_initial,
                        completion_period: sectionFound.completion_period,
                    };

                    const findIndexData =
                        archiveFound.data.findIndex(
                            (el) => el.section.id === dataNew.section.id
                        ) || false;

                    //Set new data in same position index

                    if (findIndexData) {
                        archiveFound.data[findIndexData] = dataNew;
                    } else {
                        archiveFound.data.push(dataNew);
                    }

                    //Saved the data actual for the student (section/subjects)

                    await chest.updateOne(
                        { student: studentFind._id },
                        { $push: { data: dataNew } },
                        { upsert: true }
                    );

                    //Delete data subjects in student

                    await student.updateOne(
                        { _id: studentFind._id },
                        { $set: { subjects: [] } }
                    );
                }
            }
        }

        if (req.route.path !== "/gradue/test") {
            //If every is ok delete the section actual
            await section.deleteOne({ _id: sectionFound._id });
            await student.updateMany(
                { _id: { $in: sectionFound.students } },
                { $unset: { section: 1 }, $set: { subjects: [] } }
            );
        }

        if (req.route.path == "/gradue/test") {
            return res.json({
                message: "Preview students gradues and rejects",
                studentsApproves,
                studentsRejects,
            });
        }
        return res.json({ message: "Seccion graduada" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fatal en el servidor" });
    }
};