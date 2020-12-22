import React from 'react'
import {Link} from 'react-router-dom'
import logo from './resources/img/logo.jpg' 

export const Navbar = (props) =>{
  return(
    <React.Fragment>
      <nav className="sidebar">
        <div>
         <ul>
           <Link className="a" to="/"><li>Inicio</li></Link>
           <Link className="a" to="/regStudents"> <li className={`${props.active === 1 ? 'sidebar-tag-active' : ''}`}>Registrar</li> </Link>
           <Link className="a" to="/Students"><li className={`${props.active === 2 ? 'sidebar-tag-active' : ''}`}>Lista de estudiantes</li> </Link>
           <li className={`${props.active === 3 ? 'sidebar-tag-active' : ''}`}>Administracion</li>
         </ul>
        </div>
        <div><h2>Colegio Juan Bosco</h2> <img src={logo} alt="logo"/> </div>
      </nav>
      </React.Fragment>
  )
}
