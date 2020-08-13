const express = require('express');
const path = require('path')
const morgan = require('morgan')
const cors = require('cors')
const multer = require('multer')
const app = express();

//initialization
require('./database')

//Settings
app.set('port',8080)

//middlewares
app.use(morgan('dev'))
app.use(cors())
app.use(express.urlencoded({extended:false}));
app.use(express.json());
const storage = multer.diskStorage({
	destination:'public/csv',
	filename: (req,file,cb,filename)=>{
		cb(null,file.originalname)
	}
})


app.use(multer({fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(csv)$/)) {
        return cb('Only csv files!');
    }
    cb(null, true);
  },

  storage:storage}).single('students'))


//Routes
app.use(require('./routes'))
app.use(express.static(path.join(__dirname, 'public')))

//Initialization server

app.listen(app.get('port'),()=>{
	console.log('servidor iniciado en puerto: ' + app.get('port'));
})
