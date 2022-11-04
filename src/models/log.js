import {Schema, model} from 'mongoose';
import {date} from "../libs/dateformat";
import dateFormat from "dateformat";
import mongoosePaginate  from 'mongoose-paginate-v2'
let now = new Date();
dateFormat.i18n = date;
const logSchema = new Schema({
  user: {type:String,required:true},
  user_id:{type:Schema.Types.ObjectId,required:true},
  ip:{type:String,required:true},
  reason:{type:String,required:true},
  created_at: {type:String,default:`${dateFormat(now, "yyyy")}`,required:true}
},{
  versionKey:false
})

logSchema.plugin(mongoosePaginate)

export default model('log', logSchema)