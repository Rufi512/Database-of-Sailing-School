import React from "react";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import '../../static/styles/reps/form-reps.css'
const CreateRep = () => {
	return (
		<>
			<Navbar />
			<div className="container-body container-list-rep">
				<div className="card card-container">
					<div className="card-header">
						<h2>Crear nuevo representante</h2>
					</div>
					<div className="card-body">
						<form>
							<div className="student-contact">
								<div
									className="row"
									style={{ marginBottom: "10px" }}
								>
									<div
										className="form-group"
										style={{ marginBottom: "10px" }}
									>
										<label for="ci">
											Cedula del representante
										</label>

										<input
											type="text"
											className="form-control"
											id="ci"
											placeholder="Introduce la cedula del representante"
										/>
									</div>
									<div className="form-group col-md-6">
										<label
											className="font-weight-bold"
											htmlFor="name"
										>
											Nombre del representante
										</label>

										<input
											type="text"
											className="form-control"
											id="name"
											placeholder="Introduce el nombre del representante"
										/>
									</div>
									<div className="form-group col-md-6">
										<label htmlFor="lastname">
											Apellido del representante
										</label>

										<input
											type="text"
											className="form-control"
											id="lastname"
											placeholder="Introduce el apellido del representante"
										/>
									</div>
								</div>

								<div
									className="row"
									style={{ marginBottom: "10px" }}
								>
									<div className="form-group col-md-6">
										<label
											className="font-weight-bold"
											htmlFor="address"
										>
											Direccion del representante
										</label>

										<input
											type="text"
											className="form-control"
											id="address"
											placeholder="Introduce la direccion"
										/>
									</div>
									<div className="form-group col-md-6">
										<label htmlFor="address2">
											Segunda direccion del representante
										</label>

										<input
											type="text"
											className="form-control"
											id="address2"
											placeholder="Introduce la cedula del representante"
										/>
									</div>
								</div>
								<div
									className="row"
									style={{ marginBottom: "10px" }}
								>
									<div className="form-group col-md-6">
										<label
											className="font-weight-bold"
											for="tel"
										>
											Numero telefonico del representante
										</label>

										<input
											type="text"
											className="form-control"
											id="tel"
											placeholder="Introduce el numero telefonico"
										/>
									</div>
									<div className="form-group col-md-6">
										<label htmlFor="email">
											Correo del representante
										</label>

										<input
											type="email"
											className="form-control"
											id="email"
											placeholder="Introduce el correo electronico"
										/>
									</div>
								</div>
							</div>
							<div className="container-buttons">
								<Link to="/reps" className="btn btn-secondary">
									Regresar
								</Link>
								<button
									type="submit"
									className="btn btn-primary"
								>
									Registrar nuevo representante
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default CreateRep;