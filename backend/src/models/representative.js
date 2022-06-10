import {Schema, model} from 'mongoose';
const representativeSchema = new Schema({
  ci: {type: String,unique:true,required:true},
  firstname: {type: String,required:true},
  lastname: {type: String,required:true},
  contact:{type:Object,default:{phone_numbers:[],emails:[],address_1:'',address_2:''}}
},{
  versionKey:false
})

representativeSchema.index({ci: "text",firstname: "text", lastname: "text"})

export default model('representative', representativeSchema)
