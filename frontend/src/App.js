import React from 'react'
import Login from './pages/Login'
import Content from './pages/Content'
import Sections from './pages/Sections'
import FormStudent from './pages/FormStudent'
import Students from './pages/Students'
import StudentInfo from './pages/StudentInfo'
import StudentsSections from './pages/StudentsSections'
import ControlUsers from './pages/ControlUsers'
import ProtectedRoute from './components/ProtectedRoute'
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";


const App = ()=>( 
  <BrowserRouter>
  <Routes>
  <Route exact path="/" element={<Login/>}/>
  <Route exact path="/*" element={<ProtectedRoute/>}>
    <Route exact path="sections/list/:section" element={<StudentsSections/>}/>
    <Route exact path="home" element={<Content/>} />
    <Route exact path="student/info/:id" element={<StudentInfo/>} />
    <Route exact path="register/student" element={<FormStudent/>} />
    <Route exact path="students" element={<Students/>} />
    <Route exact path="control" element={<ControlUsers/>} />
    <Route exact path="sections" element={<Sections/>} />
   </Route>
  </Routes>
</BrowserRouter>
    
)


export default App;
