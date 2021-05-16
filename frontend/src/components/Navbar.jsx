import React from "react";
import { Link } from "react-router-dom";
import logo from "../static/logos/logo.jpg";
import Cookies from 'js-cookie'
import { ReactComponent as CloseIcon } from "../static/icons/close.svg";
import { ReactComponent as BarsIcon } from "../static/icons/bars-solid.svg";
export const Navbar = (props) => {
  const openBar = (value) => {
    const sidebar = document.querySelector(".sidebar");
    const backgroundSidebar = document.querySelector(".background-sidebar");
    if (value === true) {
      sidebar.style.transform = "translateX(0%)";
      backgroundSidebar.style.visibility = "visible";
      backgroundSidebar.style.zIndex = "99";
      backgroundSidebar.style.opacity = "1";
      document.getElementsByTagName("body")[0].style.overflowY = "hidden";
    } else {
      sidebar.style.transform = "translateX(-100%)";
      backgroundSidebar.style.visibility = "hidden";
      backgroundSidebar.style.zIndex = "-1";
      backgroundSidebar.style.opacity = "0";
      document.getElementsByTagName("body")[0].style.overflowY = "unset";
    }
  };

  window.addEventListener("resize", () => {

    const sidebar = document.querySelector(".sidebar");
    if(sidebar){
    if (window.innerWidth > 768) {
      sidebar.style.transform = "translateX(0%)";
    } else {
      sidebar.style.transform = "translateX(-100%)";
    }
  }
  });

  return (
    <React.Fragment>
      <nav className="bar-top">
        <BarsIcon
          onClick={(e) => {
            openBar(true);
          }}
        />
        <div>
          <h2 style={{ margin: "0 10px" }}>Colegio Juan Bosco</h2>{" "}
          <img src={logo} alt="logo" />{" "}
        </div>
      </nav>
      <div
        className="background-sidebar"
        onClick={(e) => {
          openBar(false);
        }}
      ></div>
      <nav className="sidebar">
        <CloseIcon
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            openBar(false);
          }}
        />
        <div>
          <ul>
            <Link className="a" to="/home" onClick={(e)=>{document.getElementsByTagName("body")[0].style.overflowY = "unset";}}>
              <li>Inicio</li>
            </Link>
            <Link className="a" to="/register/student" onClick={(e)=>{document.getElementsByTagName("body")[0].style.overflowY = "unset";}}>
              {" "}
              <li className={`${props.active === 1 ? "sidebar-tag-active" : ""}`}>
                Registrar
              </li>{" "}
            </Link>
            <Link className="a" to="/students" onClick={(e)=>{document.getElementsByTagName("body")[0].style.overflowY = "unset";}}>
              <li className={`${props.active === 2 ? "sidebar-tag-active" : ""}`}>
                Lista de estudiantes
              </li>{" "}
            </Link>
            
            <Link className="a" to="/sections" onClick={(e)=>{document.getElementsByTagName("body")[0].style.overflowY = "unset";}}>
            <li className={`${props.active === 5 ? "sidebar-tag-active" : ""}`}>
              Secciones
            </li>
            </Link>

            <Link className="a" to="/control" onClick={(e)=>{document.getElementsByTagName("body")[0].style.overflowY = "unset";}}>
            <li className={`${props.active === 3 ? "sidebar-tag-active" : ""}`}>
              Administración
            </li>
            </Link>

            <Link className="a" to="/" onClick={(e)=>{document.getElementsByTagName("body")[0].style.overflowY = "unset"; Cookies.remove('token'); Cookies.remove('rol')}}>
            <li className={`${props.active === 4 ? "sidebar-tag-active" : ""}`}>
              Salir de la sesión
            </li>
            </Link>

          </ul>
        </div>
        <div>
          <h2>Colegio Juan Bosco</h2> <img src={logo} alt="logo" />{" "}
        </div>
      </nav>
    </React.Fragment>
  );
};
