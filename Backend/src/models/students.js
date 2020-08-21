const {Schema, model} = require('mongoose');

const studentSchema=new Schema({
	ci: {type:Number},
	firstName: {type:String},
	lastName: {type:String},
	school_year:{type:String},
	subjects: {type:Array},
	created_at: {type:String}, 
})

module.exports=model('student',studentSchema)