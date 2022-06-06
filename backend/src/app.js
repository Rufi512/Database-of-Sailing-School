import express  from 'express';
import path  from 'path';
import morgan  from 'morgan';
import cors  from 'cors';
import multer  from 'multer';
import students from './routes/students'
import auth from './routes/auth'
import user from './routes/user'
import section from './routes/sections'
import subjects from './routes/subjects'
import representative from './routes/representative'
import chest from './routes/chest'
import {initialSetup} from './libs/initialSetup'
const app = express();


//Settings
app.set('port',(process.env.PORT || 8080))
initialSetup()
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
    if (!file.originalname.match(/\.(csv|xlsx)$/)) {
        return cb('Only csv and xlsx file!');
    }
    cb(null, true);
  },

  storage:storage}).single('students'))


//Routes
app.use('/api/students',students)
app.use('/api/auth',auth)
app.use('/api/user',user)
app.use('/api/section',section)
app.use('/api/subject',subjects)
app.use('/api/rep',representative)
app.use('/api/chest',chest)
app.use(express.static(path.join(__dirname, 'public')))


export default app
