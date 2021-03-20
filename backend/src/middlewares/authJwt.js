import jwt from 'jsonwebtoken'
import user from '../models/user'
import dotenv from 'dotenv'
import role from '../models/role'
dotenv.config()
const secret = process.env.SECRET ? process.env.SECRET : 'secretWord'

export const verifyToken = async (req,res,next) =>{
 try{ 
  const token = req.headers["x-access-token"]
  if(!token) return res.status(403).json('No token provide')
  //Verificamos el token con el secret
  const decoded = jwt.verify(token,secret)
  //Buscamos el usuario que se refiere el token
  
  req.userId = decoded.id
  
  const userFind = await user.findById(decoded.id,{password:0})

  if(!userFind) return res.status(404).json('Usuario no encontrado')

  console.log(decoded)
  next()
 }catch (err){
   return res.status(401).json({message: 'Token perdido o no autorizado'})
 }
 

}