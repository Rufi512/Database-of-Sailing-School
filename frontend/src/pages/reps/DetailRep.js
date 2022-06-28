import React, { useState } from "react";
import Navbar from "../../components/Navbar";
const DetailRep = () => {
	const [showEdit, setShowEdit] = useState(false);
	return (
		<>
			<Navbar />
			<div className="container-body container-create-user">
				<div className="card card-container">
					<div className="card-header">
						<h2>Detalle del representante</h2>
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
								Editar representante
							</label>
						</div>
					</div>
					<div className="card-body">
						<form
							className={`${
								!showEdit
									? "form-student-register-readOnly"
									: ""
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
									<label htmlFor="phone">
										Numero de telefono
									</label>
									{showEdit ? (
										<div className="row phone-number-field">
											<select
												id="inputState"
												className="form-control"
											>
												<option selected>
													Sin asignar
												</option>
												<option>...</option>
											</select>
											<input
												type="tel"
												className="form-control"
												id="phone-number-student"
												placeholder="Numero telefonico del estudiante"
											/>
										</div>
									) : (
										<p>This is a phone</p>
									)}
								</div>
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
							</div>
							<div className="form-row field-container">
								<div className="form-group field-container col-md-6 p-1">
									<label htmlFor="address">
										Direccion del representante
									</label>
									{showEdit ? (
										<input
											type="text"
											className="form-control"
											id="address"
											placeholder="Introduzca el numero telefonico"
										/>
									) : (
										<p>This is a address</p>
									)}
								</div>
								<div className="form-group field-container col-md-6 p-1">
									<label htmlFor="address2">
										Segunda direccion del representante
									</label>
									{showEdit ? (
										<input
											type="text"
											className="form-control"
											id="address2"
											placeholder="Introduzca el correo electronico"
										/>
									) : (
										<p>This is a address2</p>
									)}
								</div>
							</div>
							<div className="container-buttons p-1">
								<button
									type="button"
									className="btn btn-secondary"
								>
									Regresar
								</button>
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

export default DetailRep;