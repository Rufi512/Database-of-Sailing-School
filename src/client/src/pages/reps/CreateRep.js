import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { registerRep, codesPhones } from "../../API";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { fieldTest } from "../../components/SomethingFunctions";
import Select from "react-select";
import "../../static/styles/reps/form-reps.css";
const CreateRep = () => {
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
	const [isSubmit, setIsSubmit] = useState(false);
	const [avalaibleCountries, setAvalaiblesCountries] = useState([]);
	const [loading, isLoading] = useState(true);

	useEffect(() => {
		const request = async () => {
			try {
				const codesList = await codesPhones();
				setAvalaiblesCountries(codesList);
				isLoading(false);
			} catch (e) {
				toast.error("Error al cargar listas, reitentando...");
				setTimeout(() => {
					request();
				}, 3000);
				console.log(e);
			}
		};
		request();
	}, []);

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
			const res = await registerRep(rep);
			setIsSubmit(false);
			console.log(res);
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
		//When all finish without error reset form
		setRep({
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
	};
	return (
		<>
			<Navbar />
			<div className="container-body container-list-rep">
				<div className="card card-container">
					<div className="card-header">
						<h2>Crear nuevo representante</h2>
					</div>
					<div className="card-body">
						<form onSubmit={handleSubmit}>
							<div className="student-contact">
								<div
									className="row"
									style={{ marginBottom: "10px" }}
								>
									<div
										className="form-group"
										style={{ marginBottom: "10px" }}
									>
										<label htmlFor="ci">
											Cedula del representante
										</label>

										<input
											type="text"
											className="form-control"
											id="ci"
											placeholder="Introduce la cedula del representante"
											autoComplete="off"
											onInput={(e) => {
												if(e.target.value.length > 18) return
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
											autoComplete="off"
											onInput={(e) => {
												if(e.target.length > 45) return
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
											autoComplete="off"
											onInput={(e) => {
												if(e.target.length > 45) return
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
											placeholder="Direccion domiciliaria del representante"
											autoComplete="off"
											onInput={(e) => {
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
											placeholder="Direccion de referencia"
											autoComplete="off"
											onInput={(e) => {
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
											htmlFor="tel"
										>
											Numero telefonico del representante
										</label>

										<div className="phone-number-field">
											<div
												className="container-select-auto"
												style={{ width: "130px" }}
											>
												<Select
													options={avalaibleCountries}
													isLoading={loading}
													defaultValue={
														avalaibleCountries[0]
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
												id="phone-number-rep"
												placeholder="Numero telefonico del representante"
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