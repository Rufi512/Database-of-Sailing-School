import user from "../models/user";
import comment from "../models/comment";
import roles from "../models/roles";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const secret = process.env.SECRET;

export const getUsers = async (req, res) => {
    const users = await user
        .find({}, { password: 0 })
        .populate("rol", { _id: 0 })
        .sort({ _id: -1 });
    if (users.length === 1) {
        return res.status(404).json({ message: "Usuarios no encontrados" });
    }

    users.pop();

    res.json(users);
};

export const createUser = async (req, res) => {
    const { ci, firstname, lastname, email, password, rol } = req.body;

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

    const validId = mongoose.Types.ObjectId.isValid(req.params.id);

    if (!validId) {
        return res.status(404).json({ message: "ID invalido" });
    }

    const {
        ci,
        firstname,
        lastname,
        email
    } = await user.findById(req.params.id);

    const userFind = await user.findOne({ $or: [{ email: req.body.email }, { ci: req.body.ci }] });


    if (userFind && userFind.email !== email) {
        return res.status(400).json({message:"Cambio de email rechazado,el email esta en uso!"});
    }

    const rolFind = await roles.findOne({ name: { $in: req.body.rol } });

    if (!rolFind) return res.status(400).json({message:"Rol no existe"});

    if (req.body.password && req.body.allowPassword) {
        await user.updateOne({ _id: req.params.id }, {
            $set: {
                ci: req.body.ci,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: await user.encryptPassword(req.body.password),
                rol: rolFind._id,
            },
        });
    } else {
        await user.updateOne({ _id: req.params.id }, {
            $set: {
                ci: req.body.ci,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                rol: rolFind._id,
            },
        });
    }
    res.json("Usuario Actualizado!");
};

//Borrar Usuario
export const deleteUser = async (req, res) => {
    const validId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!validId) return res.status(404).json({message:"ID invalido"});

    const userFind = await user.findById(req.params.id);
    if (userFind) {
        await user.findByIdAndDelete(req.params.id);
        await comment.deleteMany({ user: req.params.id });
    } else {
        return res.status(404).json({message:"Usuario no encontrado"});
    }
    res.json("Usuario Eliminado");
};

//Recupera la contraseña
export const changePassword = async (req, res) => {
    if (!req.body.email || !req.body.ci || !req.body.password || !req.body.passwordConfirm) {
        res.status(400).json({message:"Llene los campos necesarios!"})
    }

    const userFind = await user.findOne({ email: req.body.email }, { ci: req.body.ci })
    if (!userFind) return res.status(404).json("Usuario no encontrado");

    if (req.body.password !== req.body.passwordConfirm) {
        res.status(400).json({message:"Las contraseñas no coinciden!"})
    }

    await user.updateOne({ _id: userFind._id }, {
        $set: {
            password: await user.encryptPassword(req.body.password),
        },
    });

    res.json("Cambio de contraseña satisfatorio!")


}