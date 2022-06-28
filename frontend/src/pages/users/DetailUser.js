import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import "../../static/styles/form-user.css";
const DetailUser = () => {
	const [showEdit, setShowEdit] = useState(false);
	const [showChangePassword, setShowChangePassword] = useState(false);
	return (
		<>
			<Navbar />
			<div className="container-body container-create-user">
				<div className="card card-container">
					<div className="card-header">
						<h2>Informacion del usuario</h2>
					</div>
					<div className="actions-container">
						<div class="form-check form-switch">
							<input
								class="form-check-input"
								type="checkbox"
								id="flexSwitchCheckDefault"
								onChange={(e) => {
									setShowEdit(e.target.checked);
								}}
							/>
							<label
								class="form-check-label"
								for="flexSwitchCheckDefault"
							>
								Editar usuario
							</label>
						</div>
					</div>
					<div className="card-body">
						<form
							className={`${
								showEdit ? "" : "form-student-register-readOnly"
							}`}
						>
							<div className="form-group col-md-12 p-1">
								<label htmlFor="cedula">Cedula</label>
								{showEdit ? (
									<input
										type="text"
										className="form-control"
										id="cedula"
										placeholder="Introduzca la cedula"
									/>
								) : (
									<p>This is a Cedula</p>
								)}
							</div>

							<div className="form-row field-container">
								<div className="form-group col-md-6 p-1">
									<label htmlFor="name">Nombre</label>
									{showEdit ? (
										<input
											type="text"
											className="form-control"
											id="name"
											placeholder="Introduzca el Nombre"
										/>
									) : (
										<p>This is a firstname</p>
									)}
								</div>
								<div className="form-group col-md-6 p-1">
									<label htmlFor="lastname">Apellido</label>
									{showEdit ? (
										<input
											type="text"
											className="form-control"
											id="lastname"
											placeholder="Introduzca el apellido"
										/>
									) : (
										<p>This is a lastname</p>
									)}
								</div>
							</div>
							<div className="form-row field-container">
								<div className="form-group field-container col-md-6 p-1">
									<label htmlFor="email">Email</label>
									{showEdit ? (
										<input
											type="email"
											className="form-control"
											id="email"
											placeholder="Introduzca el correo electronico"
										/>
									) : (
										<p>This is a email</p>
									)}
								</div>
								<div className="form-group field-container col-md-6 p-1">
									<label htmlFor="rol">Rol del usuario</label>
									{showEdit ? (
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
									) : (
										<p>This is a rol</p>
									)}
								</div>
							</div>
							{showEdit ? (
								<div class="form-check form-switch" style={{padding:'0 2.8rem'}}>
									<input
										class="form-check-input"
										type="checkbox"
										id="passwordLabel"
										onChange={(e) => {
											setShowChangePassword(
												e.target.checked
											);
										}}
									/>
									<label
										class="form-check-label"
										for="passwordLabel"
										style={{
											background: "none",
											color: "#212529",
										}}
									>
										Cambiar contraseña
									</label>
								</div>
							) : (
								""
							)}
							{showEdit && showChangePassword ? (
								<div>
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
								</div>
							) : (
								""
							)}
							<div className="container-buttons p-1">
								<Link
									to={"/users"}
									className="btn btn-secondary"
								>
									Regresar
								</Link>
								{showEdit ? (
									<button
										type="submit"
										className="btn btn-primary submit"
									>
										Modificar usuario
									</button>
								) : (
									""
								)}
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default DetailUser;