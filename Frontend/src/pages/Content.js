import React from 'react'
import {Link} from 'react-router-dom'
import registerSvg from '../components/resources/icons/user-edit-solid.svg'
import notesSvg from '../components/resources/icons/archive-solid.svg'
import dvrSvg from '../components/resources/icons/dvr-24px.svg'
export default class Content extends React.Component {
  render() {
    return (
      <div>
        <h1 className="title">Unidad Educativa Colegio Juan Bosco</h1>
        <div>

          <section className="boxs">
            <Link className="a" to="/regStudents">
              <div className="box">
                <h3>Registro de Estudiantes</h3>
                <img src={registerSvg} alt="register" />
                <p>Ingrese aquí para registrar <br /> estudiantes</p>
              </div>
            </Link>

            <Link className="a" to="/students">
              <div className="box">
                <h3>Ver Notas</h3>
                <img src={notesSvg} alt="notes" />
                <p>Ingrese aquí para ver <br /> las notas de los estudiante</p>
              </div>
            </Link>

            <Link className="a" to="/">
              <div className="box">
                <h3>Administración de Usuarios</h3>
                <img src={dvrSvg} alt="admin" />
                <p>Ingrese aquí para registrar <br /> modificar o eliminar usuarios <br /> de la plataforma</p>
              </div>
            </Link>

          </section>

        </div>

      </div>
    )
  }
}
