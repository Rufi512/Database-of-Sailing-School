const {Schema, model} = require('mongoose');

const trunkSchema=new Schema({
	ci: {type:Number},
	firstName: {type:String},
	lastName: {type:String},
	notes1:{type:Object},
	notes2:{type:Object},
	notes3:{type:Object},
	notes4:{type:Object},
	notes5:{type:Object}
})

module.exports=model('trunk',trunkSchema)