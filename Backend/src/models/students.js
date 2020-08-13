const {Schema, model} = require('mongoose');

const studentSchema=new Schema({
	ci: {type:Number},
	firstName: {type:String},
	lastName: {type:String},
	school_year:{type:String},
	subjects: {},
	created_at: {type:String}, 
	changeTime:{type:String,default:undefined}

})

module.exports=model('student',studentSchema)