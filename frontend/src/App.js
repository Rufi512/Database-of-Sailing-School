import React from 'react'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPasswordUser from './pages/ResetPasswordUser'
import Questions from './pages/Questions'
import Home from './pages/Home'
import FormStudent from './pages/FormStudent'
import StudentInfo from './pages/StudentInfo'
import StudentsList from './pages/StudentsList'
import Section from './pages/Section'
import ProtectedRoute from './components/ProtectedRoute'
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'

const App = ()=>( 
  <BrowserRouter>
  <Routes>
  <Route exact path="/" element={<Login/>}/>
  <Route exact path="/forgot-password" element={<ForgotPassword/>}/>
  <Route exact path="/reset-password/:id/:token" element={<ResetPasswordUser/>}/>
  <Route exact path="/reset-password/questions/" element={<Questions/>}/>
  <Route exact path="/*" element={<ProtectedRoute/>}>
    <Route exact path="home" element={<Home/>} />
    <Route exact path="register/students" element={<FormStudent/>} />
    <Route exact path="student/info/:id" element={<StudentInfo/>} />
    <Route exact path="section/info/:id" element={<Section/>} />
   </Route>
  </Routes>
</BrowserRouter>
    
)


export default App;
