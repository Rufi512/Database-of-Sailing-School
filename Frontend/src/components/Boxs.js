import React from 'react'
import {Link} from 'react-router-dom'
export default class Boxs extends React.Component {
	render() {
		return (
			<div>
				 <section className="boxs">


<Link className="a" to="/regStudents">
  <div className="boxe">
            <h3>Registro de Estudiantes</h3>
            <img src="src/icons/user-edit-solid.svg"/>
            <p>Ingrese aquí para registrar <br/> estudiantes</p>
        </div>
</Link>

<Link className="a" to="/students">
        <div className="boxe">
            <h3>Ver Notas</h3>

            <img src="src/icons/archive-solid.svg"/>
            <p>Ingrese aquí para ver <br/> las notas de los estudiante</p>
        </div>
</Link>
<Link className="a" to="/">
         <div className="boxe">
            <h3>Administración de Usuarios</h3>

            <img src="src/icons/dvr-24px.svg"/>
            <p>Ingrese aquí para registrar <br/> modificar o eliminar usuarios <br/> de la plataforma</p>
        </div>
</Link>
    </section>

			</div>
		)
	}
}