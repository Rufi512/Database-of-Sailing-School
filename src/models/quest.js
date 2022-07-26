import {Schema, model} from 'mongoose';
import bcrypt from 'bcrypt'
const questSchema = new Schema({
  user:{type:Schema.Types.ObjectId,required:true},
  question: {type:String,required:true},
  answer:{type:String,required:true}
},{
  versionKey:false
})

questSchema.statics.encryptAnswer = async (answer) =>{
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(answer,salt)
}

questSchema.statics.compareAnswer = async (answer,receivedAnswer) =>{
  return await bcrypt.compare(answer,receivedAnswer)
}

export default model('quest', questSchema)