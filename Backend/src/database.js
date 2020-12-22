require('dotenv').config();
var URI = process.env.MONGOCLOUD || 'mongodb://localhost/schooldb' 
const mongoose = require('mongoose');
mongoose.connect((URI), { //Pasamos la direccion de la base de datos a conectar
  useNewUrlParser: true,
  useUnifiedTopology: true
})


  .then(db => console.log('DB is connected on:',db.connection.host))
  .catch(err => console.log(err))
