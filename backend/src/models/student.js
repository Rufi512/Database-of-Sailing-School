import {Schema, model} from 'mongoose';
import mongoosePaginate  from 'mongoose-paginate-v2'
const studentSchema = new Schema({
  ci: {type: Number,unique:true,required:true},
  firstname: {type: String,required:true},
  lastname: {type: String,required:true},
  section:{ref:"section",type:Schema.Types.ObjectId,required:false},
  subjects: [{ref:"subject",type:Schema.Types.ObjectId, required:false,default:[]}],
  last_modify: {type: String},
  status: {type: Boolean, "default": true},
  record: {ref:"chest",type: Schema.Types.ObjectId,required:false},
  contact:{type:Object,required:false,default:{phone_numbers:[],emails:[],address_1:'',address_2:''}},
  representative:{ref:"representative",type:Schema.Types.ObjectId,required:false}
},{
  versionKey:false
})

studentSchema.index({ci:"number",firstname: "text", lastname: "text"})
studentSchema.plugin(mongoosePaginate)

export default model('student', studentSchema)
