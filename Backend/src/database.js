const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/schooldb',{ //Pasamos la direccion de la base de datos a conectar
	useNewUrlParse:true
})
/*
const URI = 'mongodb://localhost/schooldb'

mongoose.connect(URI,{ 
	useNewUrlParse:true,
	useCreateIndex:true
})
*/
.then(db=>console.log('DB is Connected!'))
.catch(err=>console.log(err))