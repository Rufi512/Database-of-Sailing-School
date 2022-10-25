import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { fieldTest } from "../../components/SomethingFunctions";
import { createUser } from "../../API";
import "../../static/styles/form-user.css";
const CreateUser = () => {
	const [user, setUser] = useState({
		ci: "",
		firstname: "",
		lastname: "",
		email: "",
		password: "",
		password2: "",
		rol: "Teacher",
	});

	const [isSubmit, setIsSubmit] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { ci, firstname, lastname, email, password, password2 } = user;
		if (ci === "")
			return toast.error("El campo cedula no puede quedar vacio");
		if (firstname === "" || lastname === "")
			return toast.error(
				"Los campos de nombre y apellido no pueden quedar vacios"
			);
		if (email === "")
			return toast.error("El campo email no puede quedar vacio");
		if (password === "")
			return toast.error(
				"Tienes que proveer una contraseña para entrar al usuario"
			);
		if (password !== password2 || password2 === "")
			return toast.error("Las contraseñas no coinciden...");

		const toastId = toast.loading("Verificando datos...", {
			closeOnClick: true,
		});
		try {
			if (isSubmit) return;
			setIsSubmit(true);
			const res = await createUser(user);
			setIsSubmit(false);
			if (res.status >= 400) {
				return toast.update(toastId, {
					render: res.data.message,
					type: "error",
					isLoading: false,
					autoClose: 5000,
				});
			}

			toast.update(toastId, {
				render: res.data.message,
				type: "success",
				isLoading: false,
				autoClose: 5000,
			});
			setUser({ci: "",firstname: "",lastname: "",email: "",password: "",password2: "",rol: "Teacher"})
		} catch (e) {
			console.log(e);
			setIsSubmit(false);
			return toast.update(toastId, {
				render: "Error al enviar informacion, intente de nuevo",
				type: "error",
				isLoading: false,
				autoClose: 5000,
			});
		}
	};
	return (
		<>
			<Navbar />
			<div className="container-body container-create-user">
				<div className="card card-container">
					<div className="card-header">
						<h2>Creacion de nuevo usuario</h2>
					</div>
					<div className="card-body">
						<form onSubmit={handleSubmit}>
							<div className="form-group field-container p-1">
								<label htmlFor="ci">Cedula</label>
								<input
									type="text"
									className="form-control"
									id="ci"
									placeholder="Cedula del usuario"
									autoComplete="off"
									onInput={(e) => {
										if (
											fieldTest(
												"number",
												e.target.value
											) ||
											e.target.value === ""
										)
											return setUser({
												...user,
												ci: e.target.value,
											});
									}}
									value={user.ci}
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
										autoComplete="off"
										onInput={(e) => {
											if(e.target.value.length > 45) return
											if (
												fieldTest(
													"string",
													e.target.value
												) ||
												e.target.value === ""
											)
												return setUser({
													...user,
													firstname: e.target.value,
												});
										}}
										value={user.firstname}
									/>
								</div>
								<div className="form-group col-md-6 p-1">
									<label htmlFor="lastname">Apellido</label>
									<input
										type="text"
										className="form-control"
										id="lastname"
										placeholder="Introduzca el apellido"
										autoComplete="off"
										onInput={(e) => {
											if(e.target.value.length > 45) return
											if (
												fieldTest(
													"string",
													e.target.value
												) ||
												e.target.value === ""
											)
												return setUser({
													...user,
													lastname: e.target.value,
												});
										}}
										value={user.lastname}
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
										onInput={(e) => {
											return setUser({
												...user,
												email: e.target.value,
											});
										}}
										value={user.email}
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
										defaultValue={user.rol}
										onChange={(e) => {
											setUser({
												...user,
												rol: e.target.value,
											});
										}}
									>
										<option selected value={"Teacher"}>
											Maestro/a
										</option>
										<option value={"Moderator"}>
											Moderador/a
										</option>
										<option value={"Admin"}>
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
									autoComplete="off"
									onInput={(e) => {
										return setUser({
											...user,
											password: e.target.value,
										});
									}}
									value={user.password}
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
									autoComplete="off"
									onInput={(e) => {
										return setUser({
											...user,
											password2: e.target.value,
										});
									}}
									value={user.password2}
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