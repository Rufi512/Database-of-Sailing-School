import React, { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../static/logos/logo.jpg";
import { ReactComponent as HomeIcon } from "../static/icons/home.svg"
import Cookies from 'js-cookie'
import { ReactComponent as CloseIcon } from "../static/icons/close.svg";
import { ReactComponent as BarsIcon } from "../static/icons/bars-solid.svg";
import {ReactComponent as UsersIcon} from '../static/icons/users.svg'
import {ReactComponent as LogoutIcon} from '../static/icons/logout.svg'
import {ReactComponent as FormStudentsIcon} from '../static/icons/form-students.svg'
import '../static/styles/nav.css'
const Navbar = (props) => {
  const [navActive, setNavActive] = useState(false)
  const [actualPage, setActualPage] = useState(0)
  useEffect((props)=>{
    console.log(props)
  },[props])
  let history = useNavigate()

  const showBar = (value) => {
      if(value) return setNavActive(true)
      setNavActive(false)
  };

  window.addEventListener("resize", () => {

    /*const sidebar = document.querySelector(".sidebar");
    if(sidebar){
    if (window.innerWidth > 768) {
      sidebar.style.transform = "translateX(0%)";
    } else {
      sidebar.style.transform = "translateX(-100%)";
    }
  }*/
  });

  return (
    <React.Fragment>
    <div className="button-nav" onClick={(e)=>{showBar(true)}}>
      <BarsIcon/>
    </div>
      <nav className={`nav-bar ${navActive ? 'nav-bar-active' : ''}`}>
      <div className="button-close" onClick={(e)=>{showBar(false)}}>
        <CloseIcon/>
      </div>
      <h2>Unidad Educactiva Colegio Juan Bosco</h2>
      <div className="links-container">
        <Link to="/home" className={`link ${props.actualPage === "home" ? 'link-active' : '' }`}><HomeIcon/>Inicio</Link>
      </div>
      <p className="indicator-text">Administrativo</p>
      <div className="links-container">
        <Link to="/home" className={`link`}><UsersIcon/>Gestion de usuarios</Link>
        <Link to="/home" className={`link`}><UsersIcon/>Gestion de representantes</Link>
      </div>
      <p className="indicator-text">Estudiantes y secciones</p>
      <div className="links-container">
        <Link to="/home" className={`link ${props.actualPage === "studentsList" ? 'link-active' : '' }`}><HomeIcon/>Lista de estudiantes</Link>
        <Link to="/home" className={`link`}><HomeIcon/>Lista de secciones</Link>
        <Link to="/register/students" className={`link ${props.actualPage === "register-students" ? 'link-active' : '' }`}><FormStudentsIcon/>Registrar estudiantes</Link>
      </div>
      <div className="links-container">
      <Link to="/logout" className={`link`}><LogoutIcon/>Salir de la seccion</Link>
      </div>
      </nav>
    </React.Fragment>
  );
};


export default Navbar