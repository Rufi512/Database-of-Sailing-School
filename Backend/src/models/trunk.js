const {Schema, model} = require('mongoose');

const trunkSchema = new Schema({
  ci: {type: Number},
  firstName: {type: String},
  lastName: {type: String},
  record: {type: Array, "default": [null, null, null, null, null]},
  comments: {type: Array, "default": [null, null, null, null, null]}
})

module.exports = model('trunk', trunkSchema)
