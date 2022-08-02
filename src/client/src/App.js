import React from "react";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPasswordUser from "./pages/ResetPasswordUser";
import Questions from "./pages/Questions";
import Home from "./pages/Home";
import FormStudent from "./pages/students/FormStudent";
import StudentInfo from "./pages/students/StudentInfo";
import StudentsList from "./pages/students/StudentsList";
import Logout from './pages/Logout'
import NotFound from './pages/NotFound'
//Moderator level
import ListRep from "./pages/reps/ListRep";
import CreateRep from "./pages/reps/CreateRep";
import DetailRep from "./pages/reps/DetailRep";
import SectionList from "./pages/sections/SectionList";
import Section from "./pages/sections/Section";
//Admin level
import CreateUser from "./pages/users/CreateUser";
import DetailUser from "./pages/users/DetailUser";
import ListUser from "./pages/users/ListUser";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";


const App = () => (

  <>
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/forgot-password" element={<ForgotPassword />} />
        <Route
          exact
          path="/reset-password/:id/:token"
          element={<ResetPasswordUser />}
        />
        <Route
          exact
          path="/reset-password/questions/"
          element={<Questions />}
        />
        {/*Logout*/}

        <Route exact path="logout" element={<Logout />} />
        <Route path="/*" element={<NotFound />} />
        {/*Protected routes*/}
        <Route exact path="/*" element={<ProtectedRoute />}>
          <Route exact path="home" element={<Home />} />
          <Route exact path="sections" element={<SectionList />} />
          <Route exact path="students/list/" element={<StudentsList />} />
          <Route exact path="register/students" element={<FormStudent />} />
          <Route exact path="student/detail/:id" element={<StudentInfo />} />
          <Route exact path="section/detail/:id" element={<Section />} />
          <Route exact path="users" element={<ListUser />} />
          <Route exact path="user/create" element={<CreateUser />} />
          <Route exact path="user/detail/:id" element={<DetailUser />} />
          <Route exact path="reps" element={<ListRep />} />
          <Route exact path="reps/create" element={<CreateRep />} />
          <Route exact path="reps/detail/:id" element={<DetailRep />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </>
);

export default App;