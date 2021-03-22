import {Schema, model} from 'mongoose';

const studentSchema = new Schema({
  ci: {type: Number,unique:true},
  firstName: {type: String,required:true},
  lastName: {type: String,required:true},
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
