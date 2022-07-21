import jwt from "jsonwebtoken";
import user from "../models/user";
import dotenv from "dotenv";
import roles from "../models/roles";
dotenv.config();
const secret = process.env.SECRET

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    console.log(token)
    if (!token) return res.status(403).json("No se ha obtenido el token");
    //Verificamos el token con el secret
    const decoded = jwt.verify(token, secret);
    //Buscamos el usuario que se refiere el token


    console.log(decoded)

    req.userId = decoded.id;

    const userFind = await user.findById(decoded.id, { password: 0 });

    if (!userFind) return res.status(404).json("Usuario no encontrado");

    next();
  } catch (err) {
    return res.status(401).json("Token perdido o no autorizado");
  }
};

export const checkPassword = async (req,res,next)=>{
  try {
    const token = req.headers["x-access-token"];

    if (!token) return res.status(403).json("No se ha obtenido el token");
    //Verificamos el token con el secret
    const decoded = jwt.verify(token, secret);
    
    //Buscamos el usuario que se refiere el token
    const userFound = await user.findById(decoded.id, { password: 0 });

    const matchPassword = await user.comparePassword(req.body.password,userFound.password);
    
    if (!userFound) return res.status(404).json("Usuario no encontrado");

    if(matchPassword){
      next()
    } 

    return res.status(401).json({message:'La contraseña es invalida'})

  } catch (err) {
    return res.status(401).json("Token perdido o no autorizado");
  }
} 

export const isTeacher = async (req, res, next) => {
  //Requerimos el id del usuario y buscamos los roles en la base de datos

  const userFind = await user.findById(req.userId);

  const rol = await roles.find({ _id: { $in: userFind.rol } });

  //Si el usuario registrado posee el rol necesario continua

  for (const el of rol) {
    if (el.name === "Teacher" || el.name === "Moderator" || el.name === "Admin") {
      next();
      return;
    }
  }

  return res.status(403).json("Debes ser Maestro para completar la acción!");
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

  return res.status(403).json("Debes ser Moderador para completa la acción!");
};

export const isAdmin = async (req, res, next) => {

  const userFind = await user.findById(req.userId);
  
  const rol = await roles.find({ _id: { $in: userFind.rol } });

  if (rol[0].name === "Admin") {
    next();
    return;
  }

  return res.status(403).json("Debes ser Administrador para completar la acción!");
};
