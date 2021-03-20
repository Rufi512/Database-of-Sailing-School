import {Schema, model} from 'mongoose';

const studentSchema = new Schema({
  ci: {type: Number,unique:true},
  firstname: {type: String,required:true},
  lastname: {type: String,required:true},
  school_year: {type: String,required:true},
  subjects: {type: Array},
  last_modify: {type: String},
  comments: {type: Array},
  status: {type: Boolean, "default": true},
  record: {type: Array, "default": [null, null, null, null, null]},
  annual_comments: {type: Array, "default": [null, null, null, null, null]}
},{
  versionKey:false
})

export default model('student', studentSchema)
