import {Schema,model} from 'mongoose'
import mongoosePaginate  from 'mongoose-paginate-v2'

const subjectSchema = new Schema({
  name:{type:String,unique:true,required:true},
  fromYears:[{type:Number,required:true}]
},{
  versionKey:false
})

subjectSchema.index({name: "text"})
subjectSchema.plugin(mongoosePaginate)

export default model("subject",subjectSchema)