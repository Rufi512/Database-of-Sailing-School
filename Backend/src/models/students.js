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
  record: {type: Array, "default": [[], [], [], [], []]},
  annualComments: {type: Array, "default": [[], [], [], [], []]}
})

module.exports = model('student', studentSchema)
