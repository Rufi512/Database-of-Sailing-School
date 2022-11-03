import user from "../models/user";
import student from "../models/student";
import log from "../models/log";
import representative from "../models/representative";
import section from "../models/section";
import comment from "../models/comment";
import roles from "../models/roles";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {verifyCreate} from '../middlewares/verifyForms'
import { verifySignup } from "../middlewares";
dotenv.config();
const secret = process.env.SECRET;

export const getUsers = async (req, res) => {
    if (req.query) {
        const { limit, page, students } = req.query;
        if (limit && isNaN(limit))
            return res
                .status(400)
                .json({ message: "El limite de elementos no es un numero!" });
        if (page && isNaN(page))
            return res
                .status(400)
                .json({ message: "El limite de paginas no es un numero!" });
        if (Number(students))
            return res
                .status(400)
                .json({ message: "La busqueda no es una cadena!" });
    }

    let optionsPagination = {
        lean: false,
        limit: req.query && Number(req.query.limit) ? req.query.limit : 10,
        page: req.query && Number(req.query.page) ? req.query.page : 1,
        select: { password: 0 },
        populate: { path: "rol", select: { name: 1 } },
    };

    const users = await user.paginate({}, optionsPagination);

    console.log(users);
    if (users.length === 1) {
        return res.status(404).json({ message: "Usuarios no encontrados" });
    }

    res.json(users);
};

export const getLogs = async (req, res) => {
    try{
    if (req.query) {
        const { limit, page, reqLogs } = req.query;
        if (limit && isNaN(limit))
            return res
                .status(400)
                .json({ message: "El limite de elementos no es un numero!" });
        if (page && isNaN(page))
            return res
                .status(400)
                .json({ message: "El limite de paginas no es un numero!" });
        if (Number(reqLogs))
            return res
                .status(400)
                .json({ message: "La busqueda no es una cadena!" });
    }

    let optionsPagination = {
        lean: false,
        limit: req.query && Number(req.query.limit) ? req.query.limit : 10,
        page: req.query && Number(req.query.page) ? req.query.page : 1,
        sort:{ field: 'asc', created_at: -1 }
    };

    console.log(req.query)

    const logs = await log.paginate({}, optionsPagination);

    console.log(logs);
    if (logs.length === 1) {
        return res.status(404).json({ message: "No hay información registrada" });
    }

    res.json(logs);
}catch(e){
    res.status(500).json({message:'Error en el servidor'})
    console.log(e)
}
};


export const createUser = async (req, res) => {
    try {
        const { ci, firstname, lastname, email, password, rol } = req.body;
        const checkRegister = await verifyCreate(req.body,true)
        console.log(checkRegister)
         if (checkRegister)
            return res.status(400).json({ message: checkRegister.message });

        if (!password)
            return res.status(400).json({
                message: "El usuario necesita una contraseña para ser creado!",
            });
        //Creamos el usuario
        const newUser = new user({
            ci,
            firstname,
            lastname,
            email,
            password: await user.encryptPassword(password),
            rol,
        });

        //Verificamos que exista un rol que pide el usuario
        const foundRoles = await roles.findOne({ name: { $in: rol } });
        if (foundRoles) {
            newUser.rol = foundRoles._id;
        }

        if (rol === "") {
            const rolFind = await roles.findOne({ name: "Teacher" });
            newUser.rol = rolFind._id;
        }

        const savedUser = await newUser.save();
        await verifySignup.registerLog(req,`Registro al usuario: ${savedUser.firstname} ${savedUser.lastname} - cedula: ${savedUser.ci}`)
        res.json({ message: "Usuario Registrado" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fatal en el servidor" });
    }
};

//Actualiza la información de usuario

export const updateUser = async (req, res) => {
    try {
        const validId = mongoose.Types.ObjectId.isValid(
            req.params.id || req.userId
        );

        if (!validId) {
            return res.status(404).json({ message: "ID invalido" });
        }

        const checkRegister = await verifyCreate(req.body,true)
         if (checkRegister)
            return res.status(400).json({ message: checkRegister.message });

        const foundUser = await user.findById(req.params.id || req.userId);
        
        //Request the info from user what make the modification
        const userRequestFind = await user.findById(req.userId);

        const rolFind = await roles.findOne({ name: { $in: req.body.rol } });

        if (req.rolUser) {
            if (req.params.id && req.rolUser !== "Admin") {
                return res
                    .status(404)
                    .json({ message: "No se ha encontrado al usuario" });
            }

            if(rolFind._id !== userRequestFind.rol && req.rolUser !== "Admin"){
                return res
                    .status(400)
                    .json({ message: "No puedes modificar el rol" });
            }
        }
        // Check if email or ci is in used to other user
        const userFind = await user.findOne({
            $or: [{ email: req.body.email }, { ci: req.body.ci }],
        });

        

        const rolUserRequest = await roles.find({
            _id: { $in: userRequestFind.rol },
        });

        const listUsers = await user.paginate({}, {});
        const userAdmin = listUsers.docs[0];

        if (userAdmin.id === userFind.id)
            return res
                .status(400)
                .json({ message: "No esta permitido editar a este usuario" });

        if (!foundUser)
            return res.status(404).json({ message: "Usuario no encontrado" });

        if (userFind && userFind.id !== (req.params.id || req.userId)) {
            return res.status(400).json({
                message: "Cambio de email rechazado,el email esta en uso!",
            });
        }


        if (!rolFind) return res.status(400).json({ message: "Rol no existe" });
        //Verify if the user is admin or is the same
        if (rolUserRequest[0].name != "Admin") {
            if (foundUser.id != req.userId) {
                return res.status(401).json({
                    message: "No tienes permisos para modificar al usuario",
                });
            }
        }

        //Allow modification

        if (req.body.password && req.body.allowPassword) {
            await user.updateOne(
                { _id: req.params.id || req.userId },
                {
                    $set: {
                        ci: req.body.ci,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        password: await user.encryptPassword(req.body.password),
                        rol: rolFind._id,
                    },
                }
            );
        } else {
            await user.updateOne(
                { _id: req.params.id || req.userId },
                {
                    $set: {
                        ci: req.body.ci,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        rol: rolFind._id,
                    },
                }
            );
        }
        await verifySignup.registerLog(req,`Modifico usuario: ${foundUser.firstname} ${foundUser.lastname} - cedula: ${foundUser.ci}`)
        res.json({ message: "Usuario modificado" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fatal en el servidor" });
    }
};

//Stats user

export const stats = async (req, res) => {
    const userFound = await user.findById(req.userId);
    const students = await student.find();
    const students_gradues = await student.find({ graduate: true });
    const frozen_students = await student.find({ status: false });
    const representatives = await representative.find();
    const sections = await section.find();
    return res.json({
        registered_students: students.length,
        graduate_students: students_gradues.length,
        frozen_students: frozen_students.length,
        registered_representatives: representatives.length,
        registered_sections: sections.length,
        user: `${userFound.firstname} ${userFound.lastname}`,
    });
};

//Detail user

export const getUser = async (req, res) => {
    try {
        if (req.params.id) {
            const validId = mongoose.Types.ObjectId.isValid(req.params.id);

            if (!validId) {
                return res
                    .status(404)
                    .json({ message: "El identificador no es valido!" });
            }
        }
        const foundUser = await user
            .findById(req.params.id || req.userId)
            .populate("rol", { name: 1, _id: 0 });

        const userFind = await user.findById(req.userId);

        const rol = await roles.find({ _id: { $in: userFind.rol } });
        if (!foundUser)
            return res.status(404).json({ message: "Usuario no encontrado" });
        if (rol[0].name === "Admin" || foundUser.id === req.userId) {
            return res.json(foundUser);
        } else {
            return res
                .status(403)
                .json({
                    message: "No tienes permisos para requerir al usuario",
                });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fatal en el servidor" });
    }
};

//Delete User
export const deleteUser = async (req, res) => {
    try {
        const validId = mongoose.Types.ObjectId.isValid(req.params.id);
        if (!validId) return res.status(404).json({ message: "ID invalido" });

        const userFind = await user.findById(req.params.id);
        const listUsers = await user.paginate({}, {});
        const userAdmin = listUsers.docs[0];

        if (userAdmin.id === userFind.id)
            return res
                .status(400)
                .json({ message: "No esta permitido borrar al usuario" });

        if (userFind) {
            await user.findByIdAndDelete(req.params.id);
            await comment.deleteMany({ user: req.params.id });
        } else {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        await verifySignup.registerLog(req,`Elimino al usuario: ${userFind.firstname} ${userFind.lastname} - cedula: ${userFind.ci}`)
        res.json("Usuario Eliminado");
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fatal en el servidor" });
    }
};

export const changePassword = async (req, res) => {
    try {
        if (
            !req.body.email ||
            !req.body.ci ||
            !req.body.password ||
            !req.body.passwordConfirm
        ) {
            res.status(400).json({ message: "Llene los campos necesarios!" });
        }

        const userFind = await user.findOne(
            { email: req.body.email },
            { ci: req.body.ci }
        );
        if (!userFind) return res.status(404).json("Usuario no encontrado");

        if (req.body.password !== req.body.passwordConfirm) {
            res.status(400).json({ message: "Las contraseñas no coinciden!" });
        }

        await user.updateOne(
            { _id: userFind._id },
            {
                $set: {
                    password: await user.encryptPassword(req.body.password),
                },
            }
        );

        await verifySignup.registerLog(req,`Cambio contraseña al usuario: ${userFind.firstname} ${userFind.lastname} - cedula: ${userFind.ci}`)

        res.json("Cambio de contraseña satisfatorio!");
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fatal en el servidor" });
    }
};