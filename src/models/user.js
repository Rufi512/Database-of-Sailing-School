import {Schema, model} from 'mongoose'
import bcrypt from 'bcrypt'
import mongoosePaginate  from 'mongoose-paginate-v2'
const userSchema = new Schema({
  ci:{
    type: String,
    unique: true
  },

  firstname:{
     type: String,
     required:true
  },

  lastname:{
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
  },
  block_count:{
    type:Number,
    required:true,
    default:0
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

userSchema.plugin(mongoosePaginate)

export default model('user',userSchema)