import user from "../models/user";
import student from "../models/student";
import representative from "../models/representative";
import section from "../models/section";
import comment from "../models/comment";
import roles from "../models/roles";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
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

export const createUser = async (req, res) => {
    const { ci, firstname, lastname, email, password, rol } = req.body;
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

    res.json({ message: "Usuario Registrado" });
};

//Actualiza la información de usuario

export const updateUser = async (req, res) => {
    const validId = mongoose.Types.ObjectId.isValid(
        req.params.id || req.userId
    );

    if (!validId) {
        return res.status(404).json({ message: "ID invalido" });
    }

    const foundUser = await user.findById(req.params.id || req.userId);

    if (req.params.id && req.rolUser !== "Admin") {
        return res
            .status(404)
            .json({ message: "No se ha encontrado al usuario" });
    }

    // Check if email or ci is in used to other user
    const userFind = await user.findOne({
        $or: [{ email: req.body.email }, { ci: req.body.ci }],
    });

    //Request the info from user what make the modification
    const userRequestFind = await user.findById(req.userId);

    const rolUserRequest = await roles.find({
        _id: { $in: userRequestFind.rol },
    });
    if (!foundUser)
        return res.status(404).json({ message: "Usuario no encontrado" });

    if (userFind && userFind.id !== (req.params.id || req.userId)) {
        return res.status(400).json({
            message: "Cambio de email rechazado,el email esta en uso!",
        });
    }

    const rolFind = await roles.findOne({ name: { $in: req.body.rol } });

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
    res.json({ message: "Usuario modificado" });
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
            .json({ message: "No tienes permisos para requerir al usuario" });
    }
};

//Delete User
export const deleteUser = async (req, res) => {
    const validId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!validId) return res.status(404).json({ message: "ID invalido" });

    const userFind = await user.findById(req.params.id);
    const userAdmin = await user.find()[0];
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
    res.json("Usuario Eliminado");
};

export const changePassword = async (req, res) => {
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

    res.json("Cambio de contraseña satisfatorio!");
};