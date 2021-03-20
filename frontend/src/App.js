import React from 'react'
import Login from './pages/Login'
import Content from './pages/Content'
import FormStudent from './pages/FormStudent'
import Students from './pages/Students'
import StudentInfo from './pages/StudentInfo'
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom'
//import PrivateRoute from './components/PrivateRoute'

const App = ()=>( 
  <Router>
  <Switch>
  <Route exact path="/" component={Login}/>
  <Route exact path="/home" component={Content} />
  <Route exact path="/student/info/:id" component={StudentInfo} />
  <Route exact path="/register/student" component={FormStudent} />
  <Route exact path="/students" component={Students} />
  </Switch>
</Router>
    
)


export default App;
