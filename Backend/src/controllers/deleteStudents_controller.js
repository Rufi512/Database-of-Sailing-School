const students = require('../models/students')

module.exports = {

  deleteStudents: async function (req, res) {
   const ids = req.body 
    for (const id of ids) {
      await students.findByIdAndDelete(id)
    }
    res.json('Estudiante/s Eliminado/s')
  }
    


}
