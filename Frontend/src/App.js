import React from 'react'
import Content from './pages/Content'
import FormStudent from './pages/FormStudent'
import Students from './pages/Students'
import StudentInfo from './pages/StudentInfo'
import {BrowserRouter as Router,Route} from 'react-router-dom'

const App = ()=>( 
  <Router>
  <Route exact path="/" component={Content}/>
  <Route exact path="/studentInfo/:id" component={StudentInfo}/>
  <Route exact path="/regStudents" component={FormStudent}/>
  <Route exact path="/Students" component={Students}/>
</Router>
    
)


export default App;
