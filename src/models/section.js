import {Schema, model} from 'mongoose';
import mongoosePaginate  from 'mongoose-paginate-v2'
import dateFormat from "dateformat";
import { date } from "../libs/dateformat";
let now = new Date();
dateFormat.i18n = date;
const sectionSchema = new Schema({
  name: {type: String,required:true},
  year: {type: Number,required:true},
  students: [{ref:'student',type: Schema.Types.ObjectId,required:false,default:[]}],
  created_at:{type: String,default:dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT")},
  last_modify:{type: String,default:dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT")},
  period_initial:{type:Number,default:`${dateFormat(now, "yyyy")}`},
  completion_period:{type:Number,default:`${dateFormat(now.setFullYear(now.getFullYear() + 1),"yyyy")}`},
  subjects:[{ref:"subject",type:Schema.Types.ObjectId,default:[],required:false}]
},{
  versionKey:false
})

sectionSchema.index({name: "text"})
sectionSchema.plugin(mongoosePaginate)

export default model('section', sectionSchema)
