import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { repDetail, updateRep, codesPhones } from "../../API";
import { fieldTest } from "../../components/SomethingFunctions";
import Select from "react-select";
import { toast } from "react-toastify";
const DetailRep = (props) => {
	const timerRef = useRef(null);
	const params = useParams();
	console.log(params);
	const [activeForm, setActiveForm] = useState(false);
	const [avalaibleCountries, setAvalaiblesCountries] = useState([]);
	const [loading, isLoading] = useState(true);
	const [isSubmit, setIsSubmit] = useState(false);

	const [rep, setRep] = useState({
		ci: "",
		firstname: "",
		lastname: "",
		contact: {
			address_1: "",
			address_2: "",
			phone_numbers: [{ number: "", countryCode: "" }],
			emails: [""],
		},
	});

	const index = avalaibleCountries.findIndex((object) => {
		return object.value === rep.contact.phone_numbers[0].countryCode;
	});

	const request = useCallback(async () => {
		try {
			isLoading(true);
			const res = await repDetail(params.id);
			setRep(res.data);
			if (res.status > 400) {
				toast.error("El representante no ha sido encontrado", {
					autoClose: false,
				});
			}
			const codesList = await codesPhones();
			let itemsCountries = [{ label: "Sin Asignar", value: "" }];
			itemsCountries = itemsCountries.concat(codesList);
			setAvalaiblesCountries(itemsCountries);
			isLoading(false);
			toast.success("Información cargada!");
		} catch (e) {
			toast.error("Error al cargar opciones, reitentando...");
			timerRef.current = setTimeout(() => {
				request();
			}, 3000);
			console.log(e);
		}
	}, [params]);

	useEffect(() => {
		request();
		return () => clearTimeout(timerRef);
	}, [params, request]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isSubmit) return;
		setIsSubmit(true);
		const { ci, firstname, lastname } = rep;
		if (!ci) {
			setIsSubmit(false);
			return toast.error("El campo cedula no puede quedar vacio!");
		}
		if (!Number(ci) || !Number.isInteger(Number(ci)) || Number(ci) < 0) {
			setIsSubmit(false);
			return toast.error("Parámetros en Cédula inválidos,solo números!");
		}
		if (!firstname) {
			setIsSubmit(false);
			return toast.error("El campo nombre no puede quedar vacio!");
		}
		if (!lastname) {
			setIsSubmit(false);
			return toast.error("El campo apellido no puede quedar vacio!");
		}
		if (!rep.contact.phone_numbers[0].number) {
			setIsSubmit(false);
			return toast.error("Es necesario un numero de contacto");
		}
		const toastId = toast.loading("Verificando datos...", {
			closeOnClick: true,
		});
		try {
			const res = await updateRep({ data: rep, id: params.id });
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
			setActiveForm(false);
			request();
		} catch (e) {
			setIsSubmit(false);
			toast.update(toastId, {
				render: "Error al enviar informacion",
				type: "error",
				isLoading: false,
				autoClose: 5000,
			});
			console.log(e);
		}
	};

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
									setActiveForm(e.target.checked);
								}}
								checked={activeForm}
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
							onSubmit={handleSubmit}
							className={`${
								!activeForm
									? "form-student-register-readOnly"
									: ""
							}`}
						>
							<div className="form-group col-md-12 p-1">
								<label htmlFor="cedula">Cedula</label>
								{activeForm ? (
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
												setRep({
													...rep,
													ci: e.target.value,
												});
										}}
										value={rep.ci}
									/>
								) : (
									<p>{rep.ci | "Sin informacion"}</p>
								)}
							</div>

							<div className="form-row field-container">
								<div className="form-group col-md-6 p-1">
									<label htmlFor="name">Nombre</label>
									{activeForm ? (
										<input
											type="text"
											className="form-control"
											id="name"
											placeholder="Introduzca el Nombre"
											autoComplete="off"
											onInput={(e) => {
												if (e.target.length > 45)
													return;
												if (
													fieldTest(
														"string",
														e.target.value
													) ||
													e.target.value === ""
												)
													return setRep({
														...rep,
														firstname:
															e.target.value,
													});
											}}
											value={rep.firstname}
										/>
									) : (
										<p>
											{rep.firstname || "Sin informacion"}
										</p>
									)}
								</div>
								<div className="form-group col-md-6 p-1">
									<label htmlFor="lastname">Apellido</label>
									{activeForm ? (
										<input
											type="text"
											className="form-control"
											id="lastname"
											placeholder="Introduzca el apellido"
											autoComplete="off"
											onInput={(e) => {
												if (e.target.length > 45)
													return;
												if (
													fieldTest(
														"string",
														e.target.value
													) ||
													e.target.value === ""
												)
													return setRep({
														...rep,
														lastname:
															e.target.value,
													});
											}}
											value={rep.lastname}
										/>
									) : (
										<p>
											{rep.lastname || "Sin informacion"}
										</p>
									)}
								</div>
							</div>

							<div className="form-row field-container">
								<div className="form-group field-container col-md-6 p-1">
									<label htmlFor="phone">
										Numero telefonico del representante
									</label>
									{activeForm ? (
										<div
											className="phone-number-field"
											style={{ width: "100%" }}
										>
											<div
												className="container-select-auto"
												style={{
													width: "95%",
													maxWidth: "120px",
												}}
											>
												<Select
													options={avalaibleCountries}
													isLoading={loading}
													defaultValue={
														avalaibleCountries[
															index
														]
													}
													onChange={(e) => {
														let items = rep;
														items.contact.phone_numbers[0].countryCode =
															e.value;
														setRep({
															...rep,
															contact:
																items.contact,
														});
													}}
												/>
											</div>
											<input
												type="tel"
												className="form-control"
												id="phone-number-student"
												placeholder="Numero telefonico del estudiante"
												onInput={(e) => {
													if (
														fieldTest(
															"number",
															e.target.value
														) ||
														e.target.value === ""
													) {
														let items = rep;
														items.contact.phone_numbers[0].number =
															e.target.value;
														setRep({
															...rep,
															contact:
																items.contact,
														});
													}
												}}
												value={
													rep.contact.phone_numbers[0]
														.number
												}
											/>
										</div>
									) : (
										<p>
											{rep.contact.phone_numbers[0]
												.formatted
												? `${rep.contact.phone_numbers[0].formatted}`
												: "Sin información"}
										</p>
									)}
								</div>
								<div className="form-group field-container col-md-6 p-1">
									<label htmlFor="email">Email</label>
									{activeForm ? (
										<input
											type="email"
											className="form-control"
											id="email"
											placeholder="Introduzca el correo electronico"
											onInput={(e) => {
												let items = rep;
												items.contact.emails[0] =
													e.target.value;
												setRep({
													...rep,
													contact: items.contact,
												});
											}}
											value={rep.contact.emails[0]}
										/>
									) : (
										<p>
											{rep.contact.emails[0] ||
												"Sin informacion"}
										</p>
									)}
								</div>
							</div>
							<div className="form-row field-container">
								<div className="form-group field-container col-md-6 p-1">
									<label htmlFor="address">
										Direccion del representante
									</label>
									{activeForm ? (
										<input
											type="text"
											className="form-control"
											id="address"
											placeholder="Introduzca la direccion del representante"
											autoComplete="off"
											onInput={(e) => {
												if(e.target.value > 150) return
												let items = rep;
												items.contact.address_1 =
													e.target.value;
												setRep({
													...rep,
													contact: {
														...rep.contact,
														address_1:
															e.target.value,
													},
												});
											}}
											value={rep.contact.address_1}
										/>
									) : (
										<p>
											{rep.contact.address_1 ||
												"Sin informacion"}
										</p>
									)}
								</div>
								<div className="form-group field-container col-md-6 p-1">
									<label htmlFor="address2">
										Segunda direccion del representante
									</label>
									{activeForm ? (
										<input
											type="text"
											className="form-control"
											id="address2"
											placeholder="Introduzca el correo electronico"
											autoComplete="off"
											onInput={(e) => {
												if(e.target.value > 150) return
												let items = rep;
												items.contact.address_2 =
													e.target.value;
												setRep({
													...rep,
													contact: {
														...rep.contact,
														address_2:
															e.target.value,
													},
												});
											}}
											value={rep.contact.address_2}
										/>
									) : (
										<p>
											{rep.contact.address_2 ||
												"Sin informacion"}
										</p>
									)}
								</div>
							</div>
							<div className="container-buttons p-1">
								<Link
									to="/reps"
									type="button"
									className="btn btn-secondary"
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									Regresar
								</Link>
								{activeForm ? (
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