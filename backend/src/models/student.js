import {Schema, model} from 'mongoose';
import mongoosePaginate  from 'mongoose-paginate-v2'
const studentSchema = new Schema({
  ci: {type: Number,unique:true},
  firstname: {type: String,required:true},
  lastname: {type: String,required:true},
  section:{ref:"section",type:Schema.Types.ObjectId,required:false,default:''},
  subjects: [{ref:"subject",type:Schema.Types.ObjectId, required:false,default:[]}],
  last_modify: {type: String},
  status: {type: Boolean, "default": true},
  record: {ref:"chest",type: Schema.Types.ObjectId}
},{
  versionKey:false
})

studentSchema.index({firstname: "text", lastname: "text"})
studentSchema.plugin(mongoosePaginate)

export default model('student', studentSchema)
