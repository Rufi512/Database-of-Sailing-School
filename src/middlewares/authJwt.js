import jwt from "jsonwebtoken";
import user from "../models/user";
import dotenv from "dotenv";
import roles from "../models/roles";
dotenv.config();
const secret = process.env.SECRET;

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    console.log(token);
    if (!token)
      return res.status(403).json({ message: "No se ha obtenido el token" });
    //Verificamos el token con el secret
    const decoded = jwt.verify(token, secret);
    //Buscamos el usuario que se refiere el token

    req.userId = decoded.id;

    const userFind = await user.findById(decoded.id, { password: 0 });

    if (!userFind)
      return res.status(404).json({ message: "Usuario no encontrado" });

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token perdido o no autorizado" });
  }
};

export const verifyTokenExpire = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token)
      return res.status(403).json({ message: "No se ha obtenido el token" });
    const decoded = jwt.verify(token, secret);

    req.userId = decoded.id;

    const userFind = await user.findById(decoded.id, { password: 0 });

    if (!userFind)
      return res.status(404).json({ message: "Usuario no encontrado" });

    return res.status(200)
  } catch (err) {
    return res.status(401).json({ message: "Token perdido o no autorizado" });
  }
};

export const checkPassword = async (req, res, next) => {
  try {
    console.log(req.body);
    const token = req.headers["x-access-token"];

    if (!token)
      return res.status(403).json({ message: "No se ha obtenido el token" });
    //Verificamos el token con el secret
    const decoded = jwt.verify(token, secret);

    //Buscamos el usuario que se refiere el token
    const userFound = await user.findById(decoded.id);

    if (!userFound)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const matchPassword = await user.comparePassword(
      req.body.password,
      userFound.password
    );

    console.log("comparePassword", matchPassword);

    if (!matchPassword) {
      return res.status(401).json({ message: "La contraseña es invalida" });
    }

    next();
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .json({ message: "Problema al comprobar información" });
  }
};

export const isTeacher = async (req, res, next) => {
  //Requerimos el id del usuario y buscamos los roles en la base de datos

  const userFind = await user.findById(req.userId);

  const rol = await roles.find({ _id: { $in: userFind.rol } });

  //Si el usuario registrado posee el rol necesario continua

  for (const el of rol) {
    if (
      el.name === "Teacher" ||
      el.name === "Moderator" ||
      el.name === "Admin"
    ) {
      next();
      return;
    }
  }

  return res
    .status(403)
    .json({ message: "Debes ser Maestro para completar la acción!" });
};

export const isModerator = async (req, res, next) => {
  const userFind = await user.findById(req.userId);

  const rol = await roles.find({ _id: { $in: userFind.rol } });

  for (const el of rol) {
    if (el.name === "Moderator" || el.name === "Admin") {
      next();
      return;
    }
  }

  return res
    .status(403)
    .json({ message: "Debes ser Moderador para completa la acción!" });
};

export const isAdmin = async (req, res, next) => {
  const userFind = await user.findById(req.userId);

  const rol = await roles.find({ _id: { $in: userFind.rol } });

  if (rol[0].name === "Admin") {
    next();
    return;
  }

  const userAdmin = await user.find()[0];

  if (userAdmin.id === req.params.id || userAdmin === req.body.id) {
    return res
      .status(401)
      .json({
        message: "No se admite modificacion a usuario administrador principal",
      });
  }

  return res
    .status(403)
    .json({ message: "Debes ser Administrador para completar la acción!" });
};