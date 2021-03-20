import user from '../models/user'
import roles from '../models/roles'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
const secret = process.env.SECRET ? process.env.SECRET : 'secretWord'

export const signUp = async (req,res)=>{
  console.log('Secret:',secret) 
  const {ci,firstName,lastName,email,password,rol} = req.body

  
  const userFound = user.find({"$or":[{email:req.body.email},{ci:req.body.ci}]})
  
  if(userFound){
    res.status(400).json('Usuario ya registrado en sistema!')
  }
  
  //Creamos el usuario
  const newUser = new user({
    ci,
    firstName,
    lastName,
    email,
    password: await user.encryptPassword(password),
    rol
  })

  //Verificamos que exista un rol que pide el usuario
  if(roles){
    const foundRoles = await roles.find({name: {$in:rol}})
    newUser.rol = foundRoles[0]._id
  }else{
    const rolFind = await roles.findOne({name: "User"})
    newUser.rol = rolFind[0]._id
  }

   
  const savedUser = await newUser.save()
  
  res.json('Usuario registrado')
}

export const signIn = async (req,res) =>{
  
  //Confirmamos si existe el usuario por medio de email o cedula

  const userFound = await user.findOne({"$or":[{email:req.body.email},{ci:req.body.ci}]}).populate("roles") 

  if(!userFound){
    return res.status(400).json('Usuario no encontrado')
  }

  //Comparamos contraseñas 
  const matchPassword = await user.comparePassword(req.body.password,userFound.password)
  
  if(!matchPassword){
    return res.status(401).json('Contraseña invalida')
  }

   //Generamos el token 
  const token = jwt.sign({id: userFound.id},secret,{
     expiresIn: 84600 //24 horas
  })

  console.log(userFound)

  res.json({message:`Hola ${userFound.firstName} ${userFound.lastName}!`,token})

}