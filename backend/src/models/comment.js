import {Schema, model} from 'mongoose';
import {date} from "../libs/dateformat";
import dateFormat from "dateformat";
let now = new Date();
dateFormat.i18n = date;
const commentSchema = new Schema({
  user: {type:Schema.Types.ObjectId,required:true},
  student:{type:Schema.Types.ObjectId,required:true},
  comment:{type:String,required:true},
  create_at: {type:String,default:`${dateFormat(now, "yyyy")}`}
},{
  versionKey:false
})

export default model('comment', commentSchema)