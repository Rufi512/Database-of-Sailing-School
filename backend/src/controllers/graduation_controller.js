import student from "../models/student";
import section from "../models/section"
import chest from "../models/chest"
import { date } from "../libs/dateformat";
import dateFormat from "dateformat";

let now = new Date();
dateFormat.i18n = date;

//return the info from students gradues
export const graduate = async (req, res) => {
    try {
        let studentsApproves = []
        let studentsRejects = []
        const id = req.body.id
        const sectionFound = await section.findById(id)
        if (!sectionFound) return res.status(404).json({ message: 'Seccion no encontrada' })
        for (const el of sectionFound.students) {
            let scoresSubjects = []
            const studentFind = await student.findById(el).populate('subjects.subject', 'name')
            if (!studentFind) return
            //Check the subjects for student
            for (const subject of studentFind.subjects) {
                let sumScore = subject.scores.reduce((accumulator, value) => {
                    return accumulator + value;
                }, 0)

                if (sumScore > 0) {
                    scoresSubjects.push(sumScore / subject.scores.length)
                } else {
                    scoresSubjects.push(0)
                }

            }

            //Convert and sum scores
            scoresSubjects = scoresSubjects.reduce((accumulator, value) => {
                return accumulator + value;
            }, 0)

            //Check if the sum total and the division of the numbers is greater than 10

            if (scoresSubjects / studentFind.subjects.length < 10) {
                studentsRejects.push({ firstname: studentFind.firstname, lastname: studentFind.lastname, ci: studentFind.ci })
            } else {
                studentsApproves.push({ id:studentFind.id, firstname: studentFind.firstname, lastname: studentFind.lastname, ci: studentFind.ci })
            }

            if (req.body.is_test && req.body.is_test === false) {
                
                // FInd the archive from student
                
                let archiveFound = await chest.findOne({ student: studentFind.id })
                
                if (!archiveFound) {
                    const createChest = await new chest({
                        student: studentFind.id,
                        data:[],
                        last_modify: dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT")
                    })

                    const savedChest = await createChest.save()
                    archiveFound = await chest.findOne({ student: studentFind.id })
                } else {
                    archiveFound = await chest.findOne({ student: studentFind.id })
                }

                // Set data actual to save
                
                const dataNew = {section: {id:sectionFound.id, name:sectionFound.name, year:sectionFound.year}, subjects: studentFind.subjects,period_initial: sectionFound.period_initial, completion_period: sectionFound.completion_period}

                const findIndexData = archiveFound.data.findIndex((el)=> el.section.id === dataNew.section.id) || false
                
                //Set new data in same position index

                if(findIndexData){
                  archiveFound.data[findIndexData] = dataNew
                }else{
                  archiveFound.data.push(dataNew)
                }

                //Saved the data actual for the student (section/subjects)

                await chest.updateOne({ student: studentFind.id }, {$set:{data:dataNew}},{upsert:true})

                //Delete data subjects in student

                await student.updateOne({_id:student.id},{$set:{subjects:[]}})

            }



        }

        if(req.body.is_test && req.body.is_test === false){
          //If every is ok delete the section actual
          await section.deleteOne({_id:sectionFound.id})
          await student.updateMany({_id:sectionFound.students,$pull:{
                section:sectionFound.id
          }})
        }

        res.json({ message: 'Preview students gradues and rejects', studentsApproves, studentsRejects })
        
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error fatal en el servidor' })
    }
}