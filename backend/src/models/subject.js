import {Schema,model} from 'mongoose'

const subjectSchema = new Schema({
  name:{type:String,unique:true,required:true},
  fromYears:[{type:Number,required:true}],
  score:{type:Array,required:false,default:[]}
},{
  versionKey:false
})

export default model("subject",subjectSchema)