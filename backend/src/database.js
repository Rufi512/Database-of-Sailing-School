import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
var URI = process.env.MONGOCLOUD ? process.env.MONGOCLOUD : 'mongodb://localhost/schooldb' 

mongoose.connect((URI), { 
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useFindAndModify:true,
   useCreateIndex:true
})


  .then(db => console.log('DB is connected on:',db.connection.host))
  .catch(err => console.log(err))
