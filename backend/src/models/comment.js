import {Schema, model} from 'mongoose';

const commentSchema = new Schema({
  user: {type:Schema.Types.ObjectId,required:true},
  student:{type:Schema.Types.ObjectId,required:true},
  comment:{type:String,required:true},
  school_year:{type:String,required:false},
  create_at: {type:String}
},{
  versionKey:false
})

export default model('comment', commentSchema)