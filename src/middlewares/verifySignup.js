import user from "../models/user";
import roles from "../models/roles";
import log from "../models/log";
import reCAPTCHA from "recaptcha2";
import { date } from "../libs/dateformat";
import dateFormat from "dateformat";
import dotenv from "dotenv";
dotenv.config();

export const validateCaptcha = async (req, res, next) => {
  const recaptcha = new reCAPTCHA({
    siteKey: process.env.SITE_KEY_CAPTCHA, // retrieved during setup
    secretKey: process.env.SERVER_KEY_CAPTCHA, // retrieved during setup
    ssl: true, // optional, defaults to true.
    // Disable if you don't want to access
    // the Google API via a secure connection
  });
  recaptcha
    .validate(req.body.recaptcha)
    .then(function () {
      console.log("No es el xokas xd");
      next();
    })
    .catch(function (err, errorCodes) {
      // invalid
      console.log(err);
      console.log(recaptcha.translateErrors(errorCodes)); // translate error codes to human readable text
      return res.status(401).json({ message: "Captcha Invalido!" });
    });
};

export const checkUser = async (req, res, next) => {
  // Si el usuario ya existe
  const userFind = await user.findOne({
    $or: [{ email: req.body.email }, { ci: req.body.ci }],
  });

  if (userFind)
    return res
      .status(400)
      .json({
        message: "Ya hay un mismo email o cedula registrada en el sistema ",
      });

  next();
};

export const checkRolesExisted = async (req, res, next) => {
  //Verficamos si existen los roles
  const rols = req.body.rol;
  const rol = await roles.findOne({ name: { $in: rols } });

  if (rol || rols === "") {
    next();
  } else {
    return res.status(400).json({ message: "El rol no existe!" });
  }
};

//Register logs from users
export const registerLog = async (req, reason) => {
  try {
    let now = new Date();
    dateFormat.i18n = date;
    const userIp = req.ip;
    let userData
    if(req.userId) userData = await user.findById(req.userId)
    const timeRequest = dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT");
    const newLog = new log({
      user:`${userData.firstname} ${userData.lastname}`,
      user_id:userData.id,
      ip:userIp,
      reason,
      created_at:timeRequest
    })
    await newLog.save()
  } catch(e) {
    console.log(e)
  }
};

export const validateInputUsers = (req, res, next) => {
  console.log(req);
  const { ci, firstname, lastname, email, rol } = req.body;
  const emailValidator =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!ci || !firstname || !lastname || !email || !rol)
    return res
      .status(401)
      .json({ message: "Petición no valida,rellene los campos correctamente" });

  if (!Number(ci) || !Number.isInteger(Number(ci)) || Number(ci) < 0) {
    return res
      .status(400)
      .json({ message: "Parámetros en Cédula inválidos,solo números!" });
  }

  if (ci.length < 4) {
    return res.status(400).json({ message: "Cedula del estudiante invalida" });
  }

  if (Number(ci) > 9999999999) {
    return res
      .status(400)
      .json({
        message:
          "Parámetros en Cédula inválidos limite numerico excedido (maximo 10 digitos)",
      });
  }

  if (!/^[A-Za-záéíóúñ'´ ]+$/.test(firstname)) {
    return res
      .status(400)
      .json({ message: "Parámetros en Nombre inválidos,solo caracteres!" });
  }

  if (!/^[A-Za-záéíóúñ'´ ]+$/.test(lastname)) {
    return res
      .status(400)
      .json({ message: "Parámetros en Apellido inválidos,solo caracteres!" });
  }

  if (firstname.length > 30) {
    return res
      .status(400)
      .json({ message: "Nombres muy largo maximo 30 caracteres!" });
  }

  if (lastname.length > 30) {
    return res
      .status(400)
      .json({ message: "Apellidos muy largo maximo 30 caracteres!" });
  }

  if (!emailValidator.test(email)) {
    return res.status(400).json({ message: "Email invalido" });
  }

  if (email.length > 40) {
    return res
      .status(400)
      .json({ message: "Email muy largo maximo 40 caracteres!" });
  }
  next();
};