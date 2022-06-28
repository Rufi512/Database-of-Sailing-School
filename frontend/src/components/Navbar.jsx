import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as HomeIcon } from "../static/icons/navbar/home.svg";
import { ReactComponent as CloseIcon } from "../static/icons/navbar/close.svg";
import { ReactComponent as BarsIcon } from "../static/icons/navbar/bars-solid.svg";
import { ReactComponent as UsersIcon } from "../static/icons/navbar/users.svg";
import { ReactComponent as LogoutIcon } from "../static/icons/navbar/logout.svg";
import { ReactComponent as FormStudentsIcon } from "../static/icons/navbar/form-students.svg";
import { ReactComponent as RepIcon } from "../static/icons/navbar/rep.svg";
import { ReactComponent as ListIcon } from "../static/icons/navbar/table-list-solid.svg";
import { ReactComponent as SectionIcon } from "../static/icons/navbar/section.svg";
import "../static/styles/nav.css";
const Navbar = (props) => {
  const [navActive, setNavActive] = useState(false);
  const showBar = (value) => {
    if (value) return setNavActive(true);
    setNavActive(false);
  };

  return (
    <React.Fragment>
      <div
        className="button-nav"
        onClick={(e) => {
          showBar(true);
        }}
      >
        <BarsIcon />
      </div>
      <nav className={`nav-bar ${navActive ? "nav-bar-active" : ""}`}>
        <div
          className="button-close"
          onClick={(e) => {
            showBar(false);
          }}
        >
          <CloseIcon />
        </div>
        <h2>Unidad Educactiva Colegio Juan Bosco</h2>
        <div className="links-container">
          <Link
            to="/home"
            className={`link ${
              props.actualPage === "home" ? "link-active" : ""
            }`}
          >
            <HomeIcon />
            Inicio
          </Link>
        </div>
        <p className="indicator-text">Administrativo</p>
        <div className="links-container">
          <Link to="/users" className={`link`}>
            <UsersIcon />
            Gestion de usuarios
          </Link>
          <Link to="/reps" className={`link`}>
            <RepIcon style={{ width: "47px" }} />
            Gestion de representantes
          </Link>
        </div>
        <p className="indicator-text">Estudiantes y secciones</p>
        <div className="links-container">
          <Link
            to="/students"
            className={`link ${
              props.actualPage === "studentsList" ? "link-active" : ""
            }`}
          >
            <ListIcon style={{ width: "48px", height: "35px" }} />
            Lista de estudiantes
          </Link>
          <Link to="/sections" className={`link`}>
            <SectionIcon style={{ width: "48px", height: "32px" }} />
            Lista de secciones
          </Link>
          <Link
            to="/register/students"
            className={`link ${
              props.actualPage === "register-students" ? "link-active" : ""
            }`}
          >
            <FormStudentsIcon />
            Registrar estudiantes
          </Link>
        </div>
        <div className="links-container">
          <Link to="/logout" className={`link`}>
            <LogoutIcon />
            Salir de la seccion
          </Link>
        </div>
      </nav>
    </React.Fragment>
  );
};

export default Navbar;