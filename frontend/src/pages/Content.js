import React from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import registerSvg from '../static/icons/user-edit-solid.svg'
import notesSvg from '../static/icons/archive-solid.svg'
import dvrSvg from '../static/icons/dvr-24px.svg'
import doorSvg from '../static/icons/door.svg'
import courseSvg from '../static/icons/student-course.svg'
export default class Content extends React.Component {
  render() {
    return (
      <div>
        <h1 className="title">Unidad Educativa Colegio Juan Bosco</h1>
        <div>

          <section className="boxs">
            <Link className="a" to="/register/student">
              <div className="box">
                <h3>Registro de Estudiantes</h3>
                <img src={registerSvg} alt="register" />
                <p>Ingrese aquí para registrar <br /> estudiantes</p>
              </div>
            </Link>

            <Link className="a" to="/students">
              <div className="box">
                <h3>Lista de Estudiantes</h3>
                <img src={notesSvg} alt="notes" />
                <p>Ingrese aquí para ver <br /> la lista de estudiantes</p>
              </div>
            </Link>

            <Link className="a" to="/sections">
              <div className="box">
                <h3>Cursos</h3>
                <img src={courseSvg} alt="course" />
                <p>Ingrese aquí para ver <br /> la lista de cursos</p>
              </div>
            </Link>

            <Link className="a" to="/control">
              <div className="box">
                <h3>Administración</h3>
                <img src={dvrSvg} alt="admin" />
                <p>Ingrese aquí para administrar usuarios</p>
              </div>
            </Link>

            <Link className="a" to="/" onClick={(e)=>{Cookies.remove('token');Cookies.remove('rol')}}>
              <div className="box">
                <h3>Abandonar la Sesión</h3>
                <img src={doorSvg} alt="notes" />
              </div>
            </Link>

          </section>

        </div>

      </div>
    )
  }
}
