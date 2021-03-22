import user from "../models/roles";
import roles from "../models/roles";

export const checkUser = async (req, res, next) => {
  // Si el usuario ya existe
  const userFind = await user.findOne({
    $or: [{ email: req.body.email }, { ci: req.body.ci }],
  });

  if (userFind)
    return res.status(400).json("El usuario ya esta registrado en el sistema!");
  next();
};

export const checkRolesExisted = async (req, res, next) => {
  //Verficamos si existen los roles
  const rols = req.body.rol;
  const rol = await roles.findOne({ name: { $in: rols } });

  if (rol || rols === "") {
    next();
  } else {
    return res.status(400).json("El rol no existe!");
  }
};
