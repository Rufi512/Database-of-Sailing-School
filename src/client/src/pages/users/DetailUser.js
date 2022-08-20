import React, { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "../../components/Navbar";
import { saludateRol } from "../../components/SomethingFunctions";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import { fieldTest } from "../../components/SomethingFunctions";
import {
	updateUser,
	detailUser,
	getQuestionsOnLogin,
	registerQuests,
	deleteQuestionFromUser
} from "../../API";
import "../../static/styles/form-user.css";
const DetailUser = () => {
	const timerRef = useRef(null);
	const [showEdit, setShowEdit] = useState(false);
	const [showChangePassword, setShowChangePassword] = useState(false);
	const [showQuestionsModal, setShowQuestionsModal] = useState(false);
	const [user, setUser] = useState({
		ci: "",
		firstname: "",
		lastname: "",
		email: "",
		password: "",
		password2: "",
		allowPassword: showChangePassword,
		rol: "teacher",
	});

	const [listQuestions, setListQuestions] = useState([]);

	const [registerQuestions, setRegisterQuestions] = useState([
		{ question: "", answer: "", confirm: "" },
	]);

	const [isSubmit, setIsSubmit] = useState(false);

	const params = useParams();

	const request = useCallback(async () => {
		setShowChangePassword(false)
		try {
			const res = await detailUser(params.id);
			const questions = await getQuestionsOnLogin(params.id);
			const { ci, firstname, lastname, email, rol } = res.data;
			if (res.status >= 400)
				return toast.error(res.data.message, { autoClose: false });
			setUser({
				ci,
				firstname,
				lastname,
				email,
				rol: rol ? rol.name : "teacher",
			});

			if (questions.status >= 400){
				setListQuestions([])
				return toast.error(res.data.message, { autoClose: false });
			}
			
			if (questions.data && questions.status < 400)
				setListQuestions(questions.data);
		} catch (e) {
			console.log(e);
			toast.error("Error al requeridr información, reitentando...", {
				autoClose: 3000,
			});
			timerRef.current = setTimeout(() => {
				request();
			}, 3000);
		}
	}, [params]);

	useEffect(() => {
		request();
		return () => clearTimeout(timerRef.current)
	}, [request]);

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

		if (password !== "" && password !== password2 && password2 === "")
			return toast.error("Las contraseñas no coinciden...");

		const toastId = toast.loading("Verificando datos...", {
			closeOnClick: true,
		});
		try {
			if (isSubmit) return;
			setIsSubmit(true);
			const res = await updateUser({ data: user, id: params.id });
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
			setShowEdit(false);
			request();
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

	const handleSubmitQuestions = async (e) => {
		e.preventDefault();
		if (isSubmit) return;
		setIsSubmit(true);
		const toastId = toast.loading("Verificando datos...", {
			closeOnClick: true,
		});
		if(registerQuestions[0].answer !== registerQuestions[0].confirm){
			setIsSubmit(false);
			return toast.update(toastId, {
				render: "La respuesta de confirmacion de la pregunta no coincide",
				type: "error",
				isLoading: false,
				autoClose: 5000,
			});
		}
		try {
			const res = await registerQuests({
				id: params.id,
				questions: registerQuestions,
			});
			if (res.status >= 400) {
				setIsSubmit(false);
				return toast.update(toastId, {
					render: res.data.message,
					type: "error",
					isLoading: false,
					autoClose: 5000,
				});
			}
			setShowQuestionsModal(false);
			setIsSubmit(false);
			toast.update(toastId, {
				render: res.data.message,
				type: "success",
				isLoading: false,
				autoClose: 5000,
			});

			setRegisterQuestions([{ question: "", answer: "", confirm: "" }]);
			request()
		} catch (e) {
			setIsSubmit(false);
			console.log(e);
			return toast.update(toastId, {
				render: "Error al enviar informacion, intente de nuevo",
				type: "error",
				isLoading: false,
				autoClose: 5000,
			});
		}
	};

	const deleteQuestion = async (id) =>{
		const toastId = toast.loading("Verificando datos...", {
			closeOnClick: true,
		});
		if (isSubmit) return;
		setIsSubmit(true);
		try{
			const res = await deleteQuestionFromUser(id)
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
			setRegisterQuestions([{ question: "", answer: "", confirm: "" }]);
			request()
		}catch(e){
			setIsSubmit(false);
			console.log(e);
			return toast.update(toastId, {
				render: "Error al enviar informacion, intente de nuevo",
				type: "error",
				isLoading: false,
				autoClose: 5000,
			});
		}
	}


	return (
		<>
			<Navbar actualPage={'profile'}/>
			<div
				className={`questions-creator-user-modal ${
					showQuestionsModal ? "show-creator-questions" : ""
				}`}
			>
				<form
					className="questions-creator-container card"
					onSubmit={handleSubmitQuestions}
				>
					<h5 className="card-header">Preguntas de seguridad</h5>
					<div className="card-body">
						<h5 className="card-title">
							Creacion de preguntas de seguridad
						</h5>
						<div className="form-group">
							<label htmlFor="quest">
								Escribe la pregunta de seguridad
							</label>
							<input
								type="text"
								className="form-control"
								id="quest"
								placeholder="Escribe la pregunta de seguridad"
								autoComplete="off"
								onInput={(e) => {
									let items = [...registerQuestions];
									items[0].question = e.target.value;
									setRegisterQuestions([...items]);
								}}
								value={registerQuestions[0].question}
							/>
							<small className="form-text text-muted">
								Ejemplo:Cual era el nombre de chavez?
							</small>
						</div>

						<div
							className="form-group"
							style={{ marginTop: "15px" }}
						>
							<label htmlFor="quest-answer">
								Escribe la respuesta
							</label>
							<input
								type="text"
								className="form-control"
								id="quest-answer"
								autoComplete="off"
								placeholder="Escribe la respuesta"
								onInput={(e) => {
									let items = [...registerQuestions];
									items[0].answer = e.target.value;
									setRegisterQuestions([...items]);
								}}
								value={registerQuestions[0].answer}
							/>
						</div>

						<div
							className="form-group"
							style={{ marginTop: "15px" }}
						>
							<label htmlFor="answer-confirm">
								Confirma la respuesta
							</label>
							<input
								type="password"
								className="form-control"
								id="answer-confirm"
								autoComplete="off"
								placeholder="Confirma la respuesta"
								onInput={(e) => {
									let items = [...registerQuestions];
									items[0].confirm = e.target.value;
									setRegisterQuestions([...items]);
								}}
								value={registerQuestions[0].confirm}
							/>
						</div>

						<div
							className="container-buttons"
							style={{ marginTop: "15px" }}
						>
							<button
								className="btn btn-secondary m-1"
								type="button"
								onClick={(e) => {
									setShowQuestionsModal(false);
									setRegisterQuestions([
										{
											question: "",
											answer: "",
											confirm: "",
										},
									]);
								}}
							>
								Regresar
							</button>
							<button
								className="btn btn-primary m-1"
								type="submit"
							>
								Añadir pregunta de seguridad
							</button>
						</div>
					</div>
				</form>
			</div>

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
								checked={showEdit}
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
										<p>
											{user.lastname || "Sin información"}
										</p>
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
										<p>{user.email || "Sin Información"}</p>
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
										<p>
											{saludateRol(user.rol) ||
												"Sin información"}
										</p>
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
											setUser({...user,allowPassword:e.target.checked})
										}}
										checked={showChangePassword}
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

							{showEdit ? (
								<div
									className="questions-update-user"
									style={{ marginTop: "15px" }}
								>
									<div className="card">
										<h5 className="card-header">
											Preguntas de seguridad
										</h5>
										<div className="card-body">
											<p className="card-text">
												{listQuestions.length > 0
													? `Actualmente posee ${listQuestions.length} preguntas
												de seguridad`
													: "No posee preguntas de seguridad "}
											</p>
											<ul className="list-group">
												{listQuestions.map((el, i) => {
													console.log(i)
													return(
														<li key={i} className="list-group-item d-flex justify-content-between align-items-center">
														<p style={{width:'250px'}}>{el.question}</p>
														<span style={{zIndex: 1,color: '#2800e8',fontSize:'16px'}}className="badge badge-primary badge-pill">
															{i+1}
														</span>
														<button type="button" className="btn btn-danger" style={{height:'32px'}} onClick={(e)=>{deleteQuestion(el._id)}}>
															Borrar pregunta
														</button>
													</li>
													);
												})}
											</ul>
											<button
												style={{
													marginTop:'20px',
													display: "flex",
													marginLeft: "auto",
												}}
												className="btn btn-primary"
												type="button"
												onClick={(e) => {
													setShowQuestionsModal(true);
												}}
											>
												Añadir nuevas pregunta de
												seguridad
											</button>
										</div>
									</div>
								</div>
							) : (
								""
							)}
							<div className="container-buttons p-1">
								<Link
									to={"/users"}
									className="btn btn-secondary"
									style={{display:'flex',justifyContent:'center',alignItems:'center'}}
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