import React, { useState, useEffect, useCallback, useRef } from "react";
import { sections, registerSection, deleteSectionFromId } from "../../API";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import TableList from "../../components/TableList";
import NavigationOptionsList from "../../components/NavigationOptionsList";
import "../../static/styles/sections-list.css";
const SectionList = () => {
	const timerRef = useRef(null);
	let dt = new Date();
	let navigate = useNavigate();
	const [showCreator, setShowCreator] = useState(false);
	const [pageActual, setActualPage] = useState(1);
	const [avalaiblePages, setAvalaiblePages] = useState(1);
	const [limit, setLimit] = useState(15);
	const [list, setList] = useState([]);
	const [isSubmit, setIsSubmit] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [deleteSection, setDeleteSection] = useState({});
	const [password, setPassword] = useState("");
	const [newSection, setNewSection] = useState({
		name: "",
		year: 1,
		period_initial: dt.getFullYear().toString(),
		completion_period: dt.getFullYear().toString(),
	});

	const showModalDelete = (id) => {
		setDeleteModal(true);
		let secc = list.filter((elm) => {
			return elm.id === id;
		});
		setDeleteSection(secc[0]);
	};

	//Request list section
	const request = useCallback(async () => {
		const toastId = toast.loading("Consultando datos...", {
			closeOnClick: true,
		});
		try {
			const res = await sections({ limit: limit, page: pageActual });
			if (res.status >= 400) {
				return toast.update(toastId, {
					render: res.data.message,
					type: "error",
					isLoading: false,
					autoClose: 5000,
				});
			}

			const sectionsList = res.docs.map((el) => {
				let {
					_id,
					name,
					year,
					period_initial,
					completion_period,
					students,
				} = el;
				return Object({
					id: _id,
					name,
					year,
					period_initial,
					completion_period: "- " + completion_period,
					students_indicator: students.length || "0",
				});
			});

			setAvalaiblePages(res.totalPages);
			toast.update(toastId, {
				render: "Lista cargada",
				type: "success",
				isLoading: false,
				autoClose: 800,
			});

			setList(sectionsList);
		} catch (e) {
			console.log(e);
			toast.update(toastId, {
				render: "Fallo al requerir datos al servidor, reintentando...",
				type: "error",
				isLoading: false,
				autoClose: 3000,
			});
			timerRef.current = setTimeout(() => {
				request();
			}, 3000);
		}
	}, [limit, pageActual]);

	const deleteSectionId = async () => {
		const toastId = toast.loading("Cargando datos...", {
			closeOnClick: true,
		});
		try {
			const res = await deleteSectionFromId({
				id: deleteSection.id,
				password: password,
			});
			setPassword("")
			if (res.status >= 400) {
				return toast.update(toastId, {
					render: res.data.message,
					type: "error",
					isLoading: false,
					autoClose: 5000,
				});
			}
			console.log(`Delete section: ${deleteSection.id}`);
			setDeleteModal(false);
			toast.update(toastId, {
				render: "Seccion eliminada",
				type: "success",
				isLoading: false,
				autoClose: 3000,
			});
			request();
		} catch (e) {
			console.log(e);
			return toast.update(toastId, {
				render: "Error al enviar la peticion",
				type: "error",
				isLoading: false,
				autoClose: 5000,
			});
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isSubmit) return;
		setIsSubmit(true);

		const toastId = toast.loading("Enviando datos...", {
			closeOnClick: true,
		});

		const res = await registerSection(newSection);
		setIsSubmit(false);
		setShowCreator(false);
		setNewSection({
			name: "",
			year: 1,
			period_initial: dt.getFullYear().toString(),
			completion_period: dt.getFullYear().toString(),
		});

		if (res.status >= 400) {
			return toast.update(toastId, {
				render: res.data.message,
				type: "error",
				isLoading: false,
				autoClose: 5000,
			});
		}

		toast.update(toastId, {
			render: "Seccion registrada",
			type: "success",
			isLoading: false,
			autoClose: 5000,
		});

		return request();
	};

	useEffect(() => {
		request();
		console.log("pass");
	}, [request, limit, pageActual]);
	return (
		<>
			<Navbar actualPage={"sections"} />
			<div className="container-body container-sections-list">
				{/*Delete User modal*/}
				<div
					className={`modal-request-admin ${
						deleteModal ? "modal-request-admin-active" : ""
					}`}
				>
					<div className="container-modal card">
						<h5 className="card-header">Advertencia</h5>
						<div className="card-body">
							<h5 className="card-title">
								Confirmacion de accion de moderador
							</h5>

							<div>
								<p className="card-text">
									Estas seguro de borrar la sección?{" "}
								</p>
								<p className="card-text">
									<span style={{ fontWeight: "bold" }}>
										Nombre: 
									</span>
									{` ${deleteSection.name}`}
									<br />
									<span style={{ fontWeight: "bold" }}>
										Periodo:
									</span>{" "}
									{`${deleteSection.period_initial} - ${deleteSection.completion_period}`}
								</p>
								<p className="card-text">
									De ser asi introduzca su contraseña y
									confirma la accion
								</p>
							</div>

							<input
								type="password"
								className="form-control"
								style={{ marginTop: "10px" }}
								id="password-admin"
								placeholder="Introduzca su contraseña"
								onInput={(e) => setPassword(e.target.value)}
								value={password}
							/>
							<div className="container-buttons">
								<button
									className="btn btn-primary"
									onClick={deleteSectionId}
								>
									Confirmar Accion
								</button>
								<button
									className="btn btn-secondary"
									onClick={(e) => {
										setDeleteSection({});
										setDeleteModal(false);
									}}
								>
									Regresar
								</button>
							</div>
						</div>
					</div>
				</div>

				{
					//Modal to show form create section
					<div
						className={`modal-form-container ${
							showCreator ? "modal-form-container-show" : ""
						}`}
					>
						<form
							action=""
							className="form-container"
							onSubmit={handleSubmit}
						>
							<h3>Registro de seccion</h3>
							<div className="form-group">
								<label htmlFor="section-name">
									Nombre de la seccion
								</label>
								<input
									id="section-name"
									type="text"
									className="form-control"
									placeholder="Introduce el nombre de la seccion"
									value={newSection.name}
									onInput={(e) => {
										setNewSection({
											...newSection,
											name: e.target.value,
										});
									}}
									autoComplete="off"
								/>
								<small className="form-text text-muted">
									Es necesario para indentificar la seccion
								</small>
							</div>
							<div className="form-group">
								<label htmlFor="year-school">
									Año escolar de la seccion
								</label>
								<input
									type="number"
									className="form-control"
									id="year-school"
									step={1}
									min={1}
									max={10}
									placeholder="Especifica el año escolar de la seccion"
									value={newSection.year}
									onInput={(e) => {
										setNewSection({
											...newSection,
											year: e.target.value,
										});
									}}
								/>
							</div>
							<div className="form-group">
								<label>
									Indica el periodo escolar de la seccion
								</label>
								<div className="container-input-date">
									<input
										className="form-control"
										type="number"
										min={dt.getFullYear().toString()}
										step="1"
										placeholder="ej:2022"
										onInput={(e) => {
											setNewSection({
												...newSection,
												period_initial: e.target.value,
											});
										}}
										value={newSection.period_initial}
									/>
									<input
										className="form-control"
										type="number"
										min={dt.getFullYear().toString()}
										step="1"
										placeholder="ej:2023"
										onInput={(e) => {
											setNewSection({
												...newSection,
												completion_period:
													e.target.value,
											});
										}}
										value={newSection.completion_period}
									/>
								</div>
								<small className="form-text text-muted">
									Es necesario para llevar seguimiento de la
									seccion
								</small>
							</div>
							<div className="form-group container-buttons">
								<button
									className="btn btn-warning"
									type="button"
									onClick={(e) => {
										setShowCreator(false);
									}}
								>
									Cerrar Ventana
								</button>
								<button className="btn btn-primary">
									Añadir seccion
								</button>
							</div>
						</form>
					</div>
				}
				<div className="card card-container">
					<div className="card-header">
						<h2>Lista de secciones disponibles</h2>
					</div>
					<div className="container-actions-body actions-section-list">
						<button
							type="button"
							className="btn btn-primary"
							onClick={(e) => {
								setShowCreator(true);
							}}
						>
							+ Agregar Seccion
						</button>
					</div>
					<div className="list p-3">
						<NavigationOptionsList
							changeActualPage={(e) => {
								setActualPage(e);
							}}
							avalaiblePages={avalaiblePages}
							pageActual={pageActual}
							limit={limit}
							changeLimit={(e) => {
								setLimit(e);
							}}
						/>
						<TableList
							data={list}
							labels={[
								{ field: "name", nameField: "Seccion" },
								{ field: "year", nameField: "Año" },
								{
									field: "period_initial",
									nameField: "Periodo inicial",
									linked: true,
								},
								{
									field: "completion_period",
									nameField: "Culminacion",
								},
								{
									field: "students_indicator",
									nameField: "Estudiantes registrados",
								},
								{ field: "actions", nameField: "Acciones" },
							]}
							actions={[
								{
									name: "edit",
									type: "button",
									func: (id) =>
										navigate(`/section/detail/${id}`),
								},
								{
									name: "delete",
									type:"button",
									func: (id) => {
										showModalDelete(id);
									},
								},
							]}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default SectionList;