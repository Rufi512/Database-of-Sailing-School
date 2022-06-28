import React from "react";
import Navbar from "../../components/Navbar";
import {Link} from "react-router-dom"
import "../../static/styles/form-user.css";
const CreateUser = () => {
	return (
		<>
			<Navbar />
			<div className="container-body container-create-user">
				<div className="card card-container">
					<div className="card-header">
						<h2>Creacion de nuevo usuario</h2>
					</div>
					<div className="card-body">
						<form>
							<div className="form-group field-container p-1">
								<label htmlFor="ci">Cedula</label>
								<input
									type="text"
									className="form-control"
									id="ci"
									placeholder="Cedula del usuario"
								/>
							</div>
							<div className="form-row field-container">
								<div className="form-group col-md-6 p-1">
									<label htmlFor="name">Nombre</label>
									<input
										type="text"
										className="form-control"
										id="name"
										placeholder="Introduzca el Nombre"
									/>
								</div>
								<div className="form-group col-md-6 p-1">
									<label htmlFor="lastname">Apellido</label>
									<input
										type="text"
										className="form-control"
										id="lastname"
										placeholder="Introduzca el apellido"
									/>
								</div>
							</div>
							<div className="form-row field-container">
								<div className="form-group field-container col-md-6 p-1">
									<label htmlFor="email">Email</label>
									<input
										type="email"
										className="form-control"
										id="email"
										placeholder="Introduzca el correo electronico"
									/>
								</div>
								<div className="form-group field-container col-md-6 p-1">
									<label htmlFor="rol">
										Seleccione el rol del usuario
									</label>
									<select
										className="form-control"
										name="rol"
										id="rol"
									>
										<option defaultValue={"teacher"}>
											Profesor/a
										</option>
										<option defaultValue={"moderator"}>
											Moderador/a
										</option>
										<option defaultValue={"admin"}>
											Administrador/a
										</option>
									</select>
								</div>
							</div>
							<div className="form-group field-container p-1">
								<label htmlFor="password">
									Contraseña del usuario
								</label>
								<input
									type="text"
									className="form-control"
									id="password"
									placeholder="Introduce la contraseña que el usuario usara"
								/>
							</div>
							<div className="form-group field-container p-1">
								<label htmlFor="password2">
									Confirmacion de contraseña
								</label>
								<input
									type="password"
									className="form-control"
									id="password2"
									placeholder="Introduce nuevamente la contraseña"
								/>
							</div>
							<div className="container-buttons p-1">
							<Link to="/users" className="btn btn-secondary">
								Regresar
							</Link>
								<button
									type="submit"
									className="btn btn-primary"
								>
									Registrar usuario
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default CreateUser;