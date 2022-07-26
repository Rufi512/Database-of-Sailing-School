import {Schema, model} from 'mongoose';
import dateFormat from "dateformat";
import { date } from "../libs/dateformat";
let now = new Date();
dateFormat.i18n = date;
const chestSchema = new Schema({
  student:{type:Schema.Types.ObjectId,required:true},
  data: {type: Array,required:false,default:[]},
  last_modify: {type: String, required:false,default:`${dateFormat(now, "yyyy")}`},
},{
  versionKey:false
})
export default model('chest', chestSchema)