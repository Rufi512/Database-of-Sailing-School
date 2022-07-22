import React, { useState,useEffect,useCallback } from "react";
import Navbar from "../../components/Navbar";
import {saludateRol} from '../../components/SomethingFunctions'
import { toast } from "react-toastify";
import { Link,useParams } from "react-router-dom";
import { fieldTest } from "../../components/SomethingFunctions";
import { updateUser,detailUser } from "../../API";
import "../../static/styles/form-user.css";
const DetailUser = () => {
	const [showEdit, setShowEdit] = useState(false);
	const [showChangePassword, setShowChangePassword] = useState(false);
	const [user, setUser] = useState({
		ci: "",
		firstname: "",
		lastname: "",
		email: "",
		password: "",
		password2: "",
		allowPassword:showChangePassword,
		rol: "teacher",
	});

	const [isSubmit, setIsSubmit] = useState(false);

	const params = useParams()

	const request = useCallback(async () =>{
		
		try{
			const res = await detailUser(params.id)
			console.log(res)
			const {ci,firstname,lastname,email,rol} = res.data
			if(res.status >= 400) return toast.error(res.data.message,{autoClose:false})
			setUser(user => {setUser({...user,ci,firstname,lastname,email,rol:rol ? rol.name : 'teacher'})})

		}catch(e){
			console.log(e)
			toast.error('Error al requerir información, reitentando...',{autoClose:3000})
			setTimeout(()=>{
				request()
			},3000)
		}

	},[params])

	useEffect(()=>{
		request()
	},[request])

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

		if (password !== ""  && password !== password2 && password2 === "")
			return toast.error("Las contraseñas no coinciden...");

		const toastId = toast.loading("Verificando datos...", {
			closeOnClick: true,
		});
		try {
			if (isSubmit) return;
			setIsSubmit(true);
			const res = await updateUser({data:user,id:params.id});
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
			request()
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
						<h2>Información del usuario</h2>
					</div>
					<div className="actions-container">
						<div className="form-check form-switch">
							<input
								className="form-check-input"
								type="checkbox"
								id="flexSwitchCheckDefault"
								onChange={(e) => {
									setShowEdit(e.target.checked);
								}}
							/>
							<label
								className="form-check-label"
								htmlFor="flexSwitchCheckDefault"
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
							onSubmit={handleSubmit}
						>
							<div className="form-group col-md-12 p-1">
								<label htmlFor="cedula">Cedula</label>
								{showEdit ? (
									<input
										type="text"
										className="form-control"
										id="cedula"
										placeholder="Introduzca la cedula"
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
								) : (
									<p>{user.ci || "Sin información"}</p>
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
											autoComplete="off"
											onInput={(e) => {
												if (
													fieldTest(
														"string",
														e.target.value
													) ||
													e.target.value === ""
												)
													return setUser({
														...user,
														firstname:
															e.target.value,
													});
											}}
											value={user.firstname}
										/>
									) : (
										<p>
											{user.firstname ||
												"Sin información"}
										</p>
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
											onInput={(e) => {
												if (
													fieldTest(
														"string",
														e.target.value
													) ||
													e.target.value === ""
												)
													return setUser({
														...user,
														lastname:
															e.target.value,
													});
											}}
											value={user.lastname}
										/>
									) : (
										<p>{user.lastname || 'Sin información'}</p>
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
											onInput={(e) => {
												return setUser({
													...user,
													email: e.target.value,
												});
											}}
											value={user.email}
										/>
									) : (
										<p>{user.email || 'Sin Información'}</p>
									)}
								</div>
								<div className="form-group field-container col-md-6 p-1">
									<label htmlFor="rol">Rol del usuario</label>
									{showEdit ? (
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
											<option value={"Teacher"}>
												Profesor/a
											</option>
											<option value={"Moderator"}>
												Moderador/a
											</option>
											<option value={"Admin"}>
												Administrador/a
											</option>
										</select>
									) : (
										<p>{saludateRol(user.rol) || 'Sin información'}</p>
									)}
								</div>
							</div>
							{showEdit ? (
								<div
									className="form-check form-switch"
									style={{ padding: "0 2.8rem" }}
								>
									<input
										className="form-check-input"
										type="checkbox"
										id="passwordLabel"
										onChange={(e) => {
											setShowChangePassword(
												e.target.checked
											);
										}}
									/>
									<label
										className="form-check-label"
										htmlFor="passwordLabel"
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