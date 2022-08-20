import user from "../models/user";
import roles from "../models/roles";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const secret = process.env.SECRET ? process.env.SECRET : "secretWord";

export const signIn = async (req, res) => {
    //Confirmamos si existe el usuario por medio de email o cedula

    const userFound = await user.findOne({ $or: [{ email: req.body.user }, { ci: req.body.user }] })


    if (!userFound) {
        return res.status(400).json({message:"Usuario no encontrado"});
    }

    //Comparamos contraseñas
    const matchPassword = await user.comparePassword(
        req.body.password,
        userFound.password
    );

    if (!matchPassword) {
        return res.status(401).json({message:"Contraseña invalida"});
    }

    //Generamos el token
    const token = jwt.sign({ id: userFound.id }, secret, {
        expiresIn: 86400, //24 hours
    });

    const rolFind = await roles.findOne({ _id: { $in: userFound.rol } })

    res.json({
        token,
        rol: rolFind.name
    });
};

export const verifyTokenConfirm = (req,res) =>{
    return res.json({message:'Token valido'})
}

