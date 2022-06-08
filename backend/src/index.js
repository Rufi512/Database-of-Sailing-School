import app from './app'

//Initialization server

import './database'
//import './mailer'

app.listen(app.get('port'),()=>{
  console.log('server on port: ' + app.get('port'));
})
