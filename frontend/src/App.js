import React from 'react'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import Content from './pages/Content'
import Sections from './pages/Sections'
import FormStudent from './pages/FormStudent'
import Students from './pages/Students'
import StudentInfo from './pages/StudentInfo'
import StudentsSections from './pages/StudentsSections'
import ControlUsers from './pages/ControlUsers'
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom'


const App = ()=>( 
  <Router>
  <Switch>
  <Route exact path="/" component={Login}/>
  <Route exact path="/sections" component={Sections}/>
  <Route exact path="/sections/list/:section" component={StudentsSections}/>
  <Route exact path="/reset/password" component={ResetPassword}/>
  <Route exact path="/home" component={Content} />
  <Route exact path="/student/info/:id" component={StudentInfo} />
  <Route exact path="/register/student" component={FormStudent} />
  <Route exact path="/students" component={Students} />
  <Route exact path="/control" component={ControlUsers} />
  </Switch>
</Router>
    
)


export default App;
