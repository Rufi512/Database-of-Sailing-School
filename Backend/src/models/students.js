const {Schema, model} = require('mongoose');

const studentSchema = new Schema({
  ci: {type: Number},
  firstName: {type: String},
  lastName: {type: String},
  school_year: {type: String},
  subjects: {type: Array},
  last_modify: {type: String},
  comments: {type: Array},
  status: {type: Boolean, "default": true},
  record: {type: Array, "default": [null, null, null, null, null]},
  annualComments: {type: Array, "default": [null, null, null, null, null]}
})

module.exports = model('student', studentSchema)
