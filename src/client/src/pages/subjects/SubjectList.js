import React, { useState, useEffect, useCallback, useRef } from "react";
import {
	subjectQueryList,
	registerSubject,
	modifySubject,
	deleteSubjectFromId,
} from "../../API";
import TableList from "../../components/TableList";
import NavigationOptionsList from "../../components/NavigationOptionsList";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import Select from "react-select";
import "../../static/styles/subjects/subject-list.css";
const listSelect = (props) => {
	return (
		<Select
			options={props.avalaibleYears}
			onChange={props.setSelectedOptions}
			defaultValue={props.selectedOptions}
			placeholder="Elige los años escolares: Primer Año, Segundo Año..."
			isMulti
		/>
	);
};

const SubjectList = () => {
	const timerRef = useRef(null);
	const [showCreator, setShowCreator] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [pageActual, setActualPage] = useState(1);
	const [avalaiblePages, setAvalaiblePages] = useState(1);
	const [limit, setLimit] = useState(15);
	const [list, setList] = useState([]);
	const [isSubmit, setIsSubmit] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [deleteSubject, setDeleteSubject] = useState({});
	const [password, setPassword] = useState("");
	const [subject, setNewSubject] = useState({ name: "" });
	const [selectedOptions, setSelectedOptions] = useState([]);

	const [avalaibleYears] = useState([
		{ value: 1, label: "Primer Año" },
		{ value: 2, label: "Segundo Año" },
		{ value: 3, label: "Tercer Año" },
		{ value: 4, label: "Cuarto Año" },
		{ value: 5, label: "Quinto Año" },
		{ value: 6, label: "Sexto Año" },
		{ value: 7, label: "Septimo Año" },
		{ value: 8, label: "Octavo Año" },
		{ value: 9, label: "Noveno Año" },
		{ value: 10, label: "Decimo Año" },
	]);

	const showModalDelete = (id) => {
		setDeleteModal(true);
		let subj = list.filter((elm) => {
			return elm.id === id;
		});
		setDeleteSubject(subj[0]);
	};

	const editSubject = (el) => {
		let subj = list.filter((elm) => {
			return elm.id === el;
		});

		setNewSubject({ id:subj[0].id, name:subj[0].name });

		const subjectsFinds = avalaibleYears.filter((elm) => {
			return subj[0].fromYears
				.map((el) => {
					return Number(el.trim());
				})
				.includes(Number(elm.value));
		});

		setSelectedOptions(subjectsFinds);
		setIsEdit(true);
		setShowCreator(true);
	};

	const request = useCallback(async () => {
		const toastId = toast.loading("Consultando datos...", {
			closeOnClick: true,
		});
		try {
			const res = await subjectQueryList({
				limit: limit,
				page: pageActual,
			});
			if (res.status >= 400) {
				return toast.update(toastId, {
					render: res.data.message,
					type: "error",
					isLoading: false,
					autoClose: 5000,
				});
			}
			setList(
				res.data.docs.map((el) => {
					return {
						id: el._id,
						name: el.name,
						fromYears: el.fromYears.map((el) => {
							return `${el} `;
						}),
					};
				})
			);
			setAvalaiblePages(res.data.totalPages);
			toast.update(toastId, {
				render: "Lista cargada!",
				type: "success",
				isLoading: false,
				autoClose: 800,
			});
		} catch (e) {
			console.log(e);
			toast.update(toastId, {
				render: "Error al enviar la peticion, reitentando!",
				type: "error",
				isLoading: false,
				autoClose: 3000,
			});
			timerRef.current = setTimeout(() => {
				request();
			}, 3000);
		}
	}, [limit, pageActual]);

	const deleteSubjectId = async () => {
		const toastId = toast.loading("Cargando datos...", {
			closeOnClick: true,
		});
		try {
			const res = await deleteSubjectFromId({
				id: deleteSubject.id,
				password: password,
			});
			setPassword("");
			if (res.status >= 400) {
				return toast.update(toastId, {
					render: res.data.message,
					type: "error",
					isLoading: false,
					autoClose: 5000,
				});
			}
			setDeleteModal(false);
			toast.update(toastId, {
				render: res.data.message,
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
		let res;
		if (isSubmit) return;
		setIsSubmit(true);

		const toastId = toast.loading("Enviando datos...", {
			closeOnClick: true,
		});
		try {
			let yearsSelected = selectedOptions.map((el) => {
				return el.value;
			});
			let subjectToSubmit = {
				id: subject.id,
				name: subject.name,
				fromYears: yearsSelected,
			};

			setIsSubmit(false);

			console.log(subject)
			if (!isEdit) {
				res = await registerSubject(subjectToSubmit);
			} else {
				res = await modifySubject(subjectToSubmit.id, subjectToSubmit);
			}

			if (res.status >= 400) {
				return toast.update(toastId, {
					render: res.data.message || 'Error al procesar peticion',
					type: "error",
					isLoading: false,
					autoClose: 5000,
				});
			}

			toast.update(toastId, {
				render: "Materia registrada",
				type: "success",
				isLoading: false,
				autoClose: 5000,
			});

			setIsSubmit(false);
			setShowCreator(false);
			setIsEdit(false);
			setSelectedOptions([]);
			setNewSubject({ name: "" });

			return request();
		} catch (e) {
			console.log(e);
			toast.update(toastId, {
				render: "Error al enviar la informacion",
				type: "error",
				isLoading: false,
				autoClose: 5000,
			});
			setIsSubmit(false);
		}
	};

	useEffect(() => {
		request();
	}, [request, limit, pageActual]);

	return (
		<>
			<Navbar actualPage={"subject-list"} />
			<div className="container-body container-subject-list">
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
									Estas seguro de borrar la materia?{" "}
								</p>
								<p className="card-text">
									<span style={{ fontWeight: "bold" }}>
										Nombre:
									</span>
									<span
										style={{ textTransform: "capitalize" }}
									>{` ${deleteSubject.name}`}</span>
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
								autoComplete="off"
							/>
							<div className="container-buttons">
								<button
									className="btn btn-primary"
									onClick={deleteSubjectId}
								>
									Confirmar Accion
								</button>
								<button
									className="btn btn-secondary"
									onClick={(e) => {
										setDeleteSubject({});
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
							style={{ overflow: "unset" }}
						>
							<h3>Datos de la materia</h3>
							<div className="form-group">
								<label htmlFor="subject-name">
									Nombre de la materia
								</label>
								<input
									type="text"
									className="form-control"
									id="subject-name"
									placeholder="Matematicas..."
									value={subject.name}
									autoComplete="off"
									onInput={(e) => {
										if(e.target.value.length > 40) return
										setNewSubject({
											...subject,
											name: e.target.value,
										});
									}}
								/>
								<small className="form-text text-muted">
									Es necesario
								</small>
							</div>
							<div className="form-group">
								<label htmlFor="year-school">
									Años escolares que la materia estara
									disponibles
								</label>
								{showCreator
									? listSelect({
											avalaibleYears,
											setSelectedOptions,
											selectedOptions,
									  })
									: ""}
							</div>
							<div className="form-group container-buttons">
								<button
									className="btn btn-warning"
									type="button"
									onClick={(e) => {
										setIsSubmit(false);
										setShowCreator(false);
										setIsEdit(false);
										setSelectedOptions([]);
										setNewSubject({ name: "" });
									}}
								>
									Cerrar Ventana
								</button>
								<button className="btn btn-primary">
									Enviar
								</button>
							</div>
						</form>
					</div>
				}
				<div className="card card-container">
					<div className="card-header">
						<h2>Lista de materias disponibles</h2>
					</div>
					<div className="container-actions-body actions-section-list">
						<button
							type="button"
							className="btn btn-primary"
							onClick={(e) => {
								setSelectedOptions([]);
								setShowCreator(true);
							}}
						>
							+ Agregar materia
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
								{ field: "name", nameField: "Materia" },
								{
									field: "fromYears",
									nameField: "Disponible en año",
								},
								{ field: "actions", nameField: "Acciones" },
							]}
							actions={[
								{
									name: "edit",
									type:"button",
									func: (el) => editSubject(el),
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
export default SubjectList;