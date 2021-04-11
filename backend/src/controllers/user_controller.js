import user from "../models/user";
import comment from "../models/comment";
import roles from "../models/roles";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const secret = process.env.SECRET ? process.env.SECRET : "secretWord";

export const getUsers = async (req, res) => {
  const users = await user
    .find({}, { password: 0 })
    .populate("rol", { _id: 0 })
    .sort({ _id: -1 });
  if (users.length === 1) {
    return res.status(404).json("Usuarios no encontrados");
  }

  users.pop();

  res.json(users);
};

export const createUser = async (req, res) => {
  console.log("Secret:", secret);
  const { ci, firstName, lastName, email, password, rol } = req.body;
  if (!ci || !firstName || !lastName || !email || !password || !rol)
    return res.status(401).json("Petición no valida,rellene los campos correctamente");

  if (!Number(ci)) {
    return res.status(400).json("Parámetros en Cédula inválidos,solo números!");
  }

  if (!/^[A-Za-záéíóúñ'´ ]+$/.test(firstName)) {
    return res.status(400).json("Parámetros en Nombre inválidos,solo caracteres!");
  }

  if (!/^[A-Za-záéíóúñ'´ ]+$/.test(lastName)) {
    return res.status(400).json("Parámetros en Apellido inválidos,solo caracteres!");
  }

  const userFind = await user.findOne({ $or: [{ email: email }, { ci: ci }] });

  if (userFind)
    return res.status(400).json("Ya hay un usuario con la misma cédula o email registrado!");

  //Creamos el usuario
  const newUser = new user({
    ci,
    firstName,
    lastName,
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

  res.json("Usuario Registrado");
};

export const updateUser = async (req, res) => {

  const validId = mongoose.Types.ObjectId.isValid(req.params.id);

  if (!validId) {
    return res.status(404).json("ID invalido");
  }

  const {
    ci,
    firstName,
    lastName,
    email
  } = await user.findById(req.params.id);

  const userFind = await user.findOne({ $or: [{ email: req.body.email }, { ci: req.body.ci }] });

  if (!req.body.ci || !req.body.firstName || !req.body.lastName || !req.body.email || !req.body.rol)
    return res.status(400).json("Petición no valida");

  if (!Number(ci)) {
    return res.status(400).json("Parámetros en Cédula inválidos,solo números!");
  }

  if (!/^[A-Za-záéíóúñ'´ ]+$/.test(firstName)) {
    return res.status(400).json("Parámetros en Nombre inválidos,solo caracteres!");
  }

  if (!/^[A-Za-záéíóúñ'´ ]+$/.test(lastName)) {
    return res.status(400).json("Parámetros en Apellido inválidos,solo caracteres!");
  }

  if(userFind && userFind.ci !== ci ){ 
    return res.status(400).json("Cambio de cédula rechazado,la cédula la posee otro usuario!");
  }

  if(userFind && userFind.email !== email ){ 
    return res.status(400).json("Cambio de email rechazado,el email esta en uso!");
  }

  const rolFind = await roles.findOne({ name: { $in: req.body.rol } });

  if (!rolFind) return res.status(400).json("Rol no existe");

  if (req.body.password && req.body.allowPassword) {
    await user.updateOne(
      { _id: req.params.id },
      {
        $set: {
          ci:req.body.ci,
          firstName:req.body.firstName,
          lastName:req.body.lastName,
          email:req.body.email,
          password: await user.encryptPassword(req.body.password),
          rol: rolFind._id,
        },
      }
    );
  } else {
    await user.updateOne(
      { _id: req.params.id },
      {
        $set: {
          ci:req.body.ci,
          firstName:req.body.firstName,
          lastName:req.body.lastName,
          email:req.body.email,
          rol: rolFind._id,
        },
      }
    );
  }
  res.json("Usuario Actualizado!");
};

export const deleteUser = async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!validId) return res.status(404).json("ID invalido");

  const userFind = await user.findById(req.params.id);
  if (userFind) {
    await user.findByIdAndDelete(req.params.id);
    await comment.deleteMany({ user: req.params.id });
  } else {
    return res.status(404).json("Usuario no encontrado");
  }
  res.json("Usuario Eliminado");
};
