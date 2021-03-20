import {Schema,model} from 'mongoose'

export const ROLES = ["Admin","Moderator","Teacher"]

const rolesSchema = new Schema({
  name:String
},{
  versionKey:false
})

export default model("roles",rolesSchema)