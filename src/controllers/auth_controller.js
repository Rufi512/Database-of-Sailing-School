import user from "../models/user";
import roles from "../models/roles";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifySignup, authJwt } from "../middlewares";
dotenv.config();
const secret = process.env.SECRET ? process.env.SECRET : "secretWord";

export const signIn = async (req, res) => {
    try {
        //Confirmamos si existe el usuario por medio de email o cedula

        const userFound = await user.findOne({
            $or: [{ email: req.body.user }, { ci: req.body.user }],
        });

        //Get the user master
        const listUsers = await user.paginate({}, {});
        const userAdmin = listUsers.docs[0];

        if (!userFound) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        if (userFound.block_count >= 3)
            return res
                .status(400)
                .json({
                    message:
                        "El usuario esta bloqueado, desbloquee su usuario en: desbloquear usuario",
                });

        req.userId = userFound.id;

        //Comparamos contraseñas
        const matchPassword = await user.comparePassword(
            req.body.password,
            userFound.password
        );

        if (!matchPassword) {
            if (userFound.id !== userAdmin.id) {
                await authJwt.blockUser(req);
            }
            return res.status(401).json({ message: "Contraseña invalida" });
        }

        //Generamos el token
        const token = jwt.sign({ id: userFound.id }, secret, {
            expiresIn: 86400, //24 hours
        });

        const rolFind = await roles.findOne({ _id: { $in: userFound.rol } });

        await verifySignup.registerLog(req, "Ingreso de sesión");
        await authJwt.blockUser(req, true);
        res.json({
            token,
            rol: rolFind.name,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fatal en el servidor" });
    }
};

export const verifyTokenConfirm = (req, res) => {
    console.log(req.rolUser);
    return res.json({ rol: req.rolUser, message: "Token valido" });
};