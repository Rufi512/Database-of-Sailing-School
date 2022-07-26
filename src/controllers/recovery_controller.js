//Recovery from security questions
import user from '../models/user'
import quest from '../models/quest'
import ejs from 'ejs'
import path from 'path'
import { validateEmail } from '../middlewares/verifyForms'
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import transporter from '../mailer'
dotenv.config();
const secret = process.env.SECRET
// Set security questions
export const setQuestions = async (req, res) => {
    try {
        const userFound = await user.findById(req.params.id)
        if (!userFound) return res.status(404).json({ message: 'Usuario no encontrado' })
        const quests = await quest.find({ user: userFound.id }, { answer: 0 })
        if(quests.length >= 4) return res.status(400).json({message:'Ya tienes el maximo de 4 preguntas de seguridad'})
        const questsRegistered = await quest.find({ user: userFound.id }, { answer: 0 })

        for (const elm of req.body.quests) {
            const sameQuestion = questsRegistered.filter((el)=>{el.question.toLowerCase() === elm.question.toLowerCase()})
            if(elm.id && !sameQuestion){
                const foundQuestionId = await quest.findOne(userFound.id, { answer: 0 })
                if(foundQuestionId.id === elm.id) return res.status(400).json({message:'Las preguntas no se pueden repetir'})
            } 

            if (elm.question == "" || elm.answer == "") return res.status(400).json({ message: 'Los campos no pueden quedar vacios!' })
            const createQuestion = new quest({
                user: userFound.id,
                question: elm.question,
                answer: await quest.encryptAnswer(elm.answer)
            })
            await createQuestion.save()
        }


        return res.json({ message: 'Preguntas de seguridad creadas!' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Error al guardar preguntas de seguridad' })
    }
}

//Get security questions 

export const getQuestions = async (req, res) => {
    //Search user by ci or email
    const userFound = await user.findOne({ $or: [{ email: req.body.user }, { ci: req.body.user }] })

    if (!userFound) return res.status(404).json({ message: 'Usuario no encontrado' })

    const quests = await quest.find({ user: userFound.id }, { answer: 0 })

    if (quests.length < 1) return res.status(400).json({ message: 'No hay preguntas de seguridad registradas :(' })

    res.json(quests)


}

export const getQuestionsOnLogin = async (req,res) =>{
    const userFound = await user.findById(req.params.id)

    const quests = await quest.find({ user: userFound.id }, { answer: 0 })

    if (quests.length < 1) return res.status(404).json({ message: 'Actualmente no hay preguntas de seguridad registradas :(' })

    res.json(quests)
}

//Check security
export const checkQuestions = async (req, res) => {
    try {
        let i = 0
        //Search user by ci or email
        const userFound = await user.findOne({ $or: [{ email: req.body.user }, { ci: req.body.user }] })

        if (!userFound) return res.status(404).json({ message: 'Usuario no encontrado' })

        const quests = await quest.find({ user: userFound.id })

        if (quests.length < 1) return res.status(400).json({ message: 'No hay preguntas de seguridad registradas :(' })

        //Compare Answers

        for (const elm of quests) {
            const matchAnswer = await quest.compareAnswer(
                req.body.answers[i],
                elm.answer
            );

            if (!matchAnswer) {
                return res.status(401).json({ message: "Respuestas invalidas" });
            }
            i++;
        }

        //If all awnser are corrects

        const token = jwt.sign({ id: userFound.id }, secret + userFound.password, {
            expiresIn: '15m'
        });

        ejs.renderFile(path.join(__dirname, '../templates/forgotPassword.ejs'), { link: `http://localhost:3000/reset-password/${userFound.id}/${token}` }, async (err, data) => {
            if (err) { console.log(err); return res.status(500).json({ message: 'Error fatal en servidor' }) }
            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Fred Foo 👻" <testRestPassword@mail.com>', // sender address
                to: [userFound.email], // list of receivers
                subject: "Recuperación de contraseña", // Subject line
                text: "Recuperar contraseña", // plain text body
                html: data, // html body
            });
            console.log(info)
            res.json({ message: 'Email enviado!' })

        })


    } catch (err) {
        res.status(500).json({ message: 'Error fatal al revisar respuestas de seguridad' })
        console.log(err)
    }
}

//Send recovery password link
export const forgotPassword = async (req, res) => {

    try {
        const userFound = await user.findOne({ $or: [{ email: req.body.user }, { ci: req.body.user }] })

        if (!userFound) return res.status(404).json({ message: 'Usuario no registrado en el sistema, verifique los datos' })

        const token = jwt.sign({ id: userFound.id }, secret + userFound.password, {
            expiresIn: '15m'
        });

        ejs.renderFile(path.join(__dirname, '../templates/forgotPassword.ejs'), { link: `http://localhost:3000/reset-password/${userFound.id}/${token}` }, async (err, data) => {
            if (err) { console.log(err); return res.status(500).json({ message: 'Error fatal en servidor' }) }
            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Fred Foo 👻" <testRestPassword@mail.com>', // sender address
                to: [userFound.email], // list of receivers
                subject: "Recuperación de contraseña", // Subject line
                text: "Recuperar contraseña", // plain text body
                html: data, // html body
            });
            console.log(info)
            res.json({ message: 'Email enviado!' })

        })
    } catch (err) {
        res.status(500).json({ message: 'Error fatal en servidor' })
        console.log(err)
    }


}

export const resetPassword = async (req, res) => {
    try {
        const { id, token } = req.params
        const userFind = await user.findById(id);
        if (!userFind) res.status(404).json({ message: 'Usuario no encontrado' })

        const decoded = jwt.verify(token, secret + userFind.password);

        if (id !== userFind.id) return res.status(400).json({ message: 'Informacion invalidas' })
        console.log(req.body)
        await user.updateOne({ _id: id }, {
            "$set": {
                password: await user.encryptPassword(req.body.password)
            }
        }, { upsert: true })

        res.json({ message: 'Contraseña restablecida! ' })

    } catch (err) {
        res.status(400).json({ message: 'Ticket de cambio de contraseña invalido' })
        console.log(err)
    }
}