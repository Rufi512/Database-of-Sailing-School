import {Schema, model} from 'mongoose'
import bcrypt from 'bcrypt'
const userSchema = new Schema({
  ci:{
    type: String,
    unique: true
  },

  firstName:{
     type: String,
     required:true
  },

  lastName:{
    type: String,
    required:true
  },
  email:{
    type: String,
    unique: true
  },
  password:{
    type: String,
    required:true
  },
  //Creamos relacion entre rol y usuario (pasamos el nombre del modelo a referir y el tipo)
  rol:{
    ref: "roles",
    type: Schema.Types.ObjectId
  }
},{
  versionKey:false
})

//Ciframos la contraseña
userSchema.statics.encryptPassword = async (password) =>{
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password,salt)
}

//Comparamos contraseñas
userSchema.statics.comparePassword = async (password,receivedPassword) =>{
  return await bcrypt.compare(password,receivedPassword)
}

export default model('user',userSchema)