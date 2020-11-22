const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/schooldb', { //Pasamos la direccion de la base de datos a conectar
  useNewUrlParser: true,
  useUnifiedTopology: true
})


  .then(db => console.log('DB is Connected!'))
  .catch(err => console.log(err))
