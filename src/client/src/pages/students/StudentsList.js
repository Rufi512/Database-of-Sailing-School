import React, { useState, useEffect, useCallback, useRef } from "react";
import { listStudents, deleteStudentFromId } from "../../API";
import { toast } from "react-toastify";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import TableList from "../../components/TableList";
import NavigationOptionsList from "../../components/NavigationOptionsList";
import "../../static/styles/students/student-list.css";
const StudentsList = () => {
	const timerRef = useRef(null);
	let navigate = useNavigate();
	const [data, setData] = useState([]);
	const [pageActual, setActualPage] = useState(1);
	const [avalaiblePages, setAvalaiblePages] = useState(0);
	const [limit, setLimit] = useState(15);
	const [status,setStatus] = useState("")
	const [deleteModal, setDeleteModal] = useState(false);
	const [deleteStudent, setDeleteStudent] = useState({});
	const [password, setPassword] = useState("");
	const [searchBar, setSearchBar] = useState("");
	const [searchParams] = useSearchParams();
	const showModalDelete = (id) => {
		setDeleteModal(true);
		let user = data.filter((elm) => {
			return elm.id === id;
		});
		console.log(user[0]);
		setDeleteStudent(user[0]);
	};

	const queryStudent = (value) => {
		console.log(searchBar)
		navigate(`/students/list?status=${value}&search=${searchBar}`);
	};

	const searchBarSubmit = () => {
		console.log(searchBar)
		navigate(`/students/list?status=${status}&search=${searchBar}`);
	};

	const request = useCallback(async () => {
		const toastId = toast.loading("Cargando datos...", {
			closeOnClick: true,
		});
		try {
			console.log("status: ", searchParams.get("status"));
			console.log("search: ", searchParams.get("search"));
			const res = await listStudents({
				limit: limit,
				page: pageActual,
				queryStudent: searchParams.get("status"),
				search: searchParams.get("search"),
			});
			setSearchBar(searchParams.get("search") || "");
			setStatus(searchParams.get("status") || "activos")
			console.log(res);

			if (res.status >= 400) {
				return toast.update(toastId, {
					render: res.data.message,
					type: "error",
					isLoading: false,
					autoClose: 5000,
				});
			}
			const students = res.data.docs.map((el) => {
				let { _id, ci, firstname, lastname, section } = el;
				return Object({
					id: _id,
					ci,
					firstname,
					lastname,
					section: section ? section.name : "No asignado",
				});
			});
			setAvalaiblePages(res.data.totalPages);
			setData(students);

			console.log(students);

			toast.update(toastId, {
				render: "Lista Cargada",
				type: "success",
				isLoading: false,
				autoClose: 3000,
			});
		} catch (e) {
			console.log(e);

			toast.update(toastId, {
				render: "Error al enviar informacion, intentando de nuevo",
				type: "error",
				isLoading: false,
				autoClose: 3000,
			});

			timerRef.current = setTimeout(() => {
				request();
			}, 3000);
		}
	}, [limit, pageActual, searchParams]);

	const deleteStudentId = async () => {
		const toastId = toast.loading("Cargando datos...", {
			closeOnClick: true,
		});
		try {
			const res = await deleteStudentFromId({
				id: deleteStudent.id,
				password: password,
			});
			if (res.status >= 400) {
				return toast.update(toastId, {
					render: res.data.message,
					type: "error",
					isLoading: false,
					autoClose: 5000,
				});
			}
			console.log(`Delete user: ${deleteStudent.id}`);
			setDeleteModal(false);
			toast.update(toastId, {
				render: "Usuario eliminado",
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

	useEffect(() => {
		request();
		return () => clearTimeout(timerRef.current);
	}, [pageActual, limit, request, searchParams]);

	return (
		<>
			<Navbar />
			<div className="container-body container-list-rep container-list-students">
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
								Confirmacion de accion de adminitrador
							</h5>

							<div>
								<p className="card-text">
									Estas seguro de borrar al estudiante{" "}
								</p>
								<p className="card-text">
									<span style={{ fontWeight: "bold" }}>
										Cedula:
									</span>
									{deleteStudent.ci}
									<br />
									<span style={{ fontWeight: "bold" }}>
										Nombre y Apellido:
									</span>{" "}
									{`${deleteStudent.firstname} ${deleteStudent.lastname}`}
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
									onClick={deleteStudentId}
								>
									Confirmar Accion
								</button>
								<button
									className="btn btn-secondary"
									onClick={(e) => {
										setDeleteStudent({});
										setDeleteModal(false);
									}}
								>
									Regresar
								</button>
							</div>
						</div>
					</div>
				</div>
				{/*Page return*/}
				<div className="card card-container">
					<div className="card-header">
						<h2>Lista de estudiantes</h2>
					</div>
					<div className="container-content p-3">
						<div
							className="container-actions-body"
							style={{ justifyContent: "space-between" }}
						>
							<Link
								to="/register/students"
								className="btn btn-primary"
							>
								+ Añadir nuevo estudiante
							</Link>
							<div className="container-label-select">
								<label>Lista de estudiantes</label>
								<select
									className="form-select form-select-lg mb-3"
									aria-label=".form-select-lg example"
									onChange={(e) => {
										queryStudent(e.target.value);
									}}
									defaultValue={searchParams.get("status")}
								>
									<option value="activos">Activos</option>
									<option value="inactivos">Inactivos</option>
									<option value="graduados">Graduados</option>
								</select>
							</div>
						</div>
						<div className="container-search-bar">
							<label for="searchBar">
								Introduce nombre o apellido para buscar
							</label>
							<div>
								<input
									type="text"
									value={searchBar}
									onInput={(e) => {
										setSearchBar(e.target.value);
										if(e.target.value === "") searchBarSubmit()
									}}
									set
									className="form-control"
									id="searchBar"
									placeholder="Fulano y tal"
								/>
								<button
									type="button"
									class="btn btn-primary"
									onClick={(e) => searchBarSubmit()}
								>
									Buscar
								</button>
							</div>
						</div>
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
						<div className="table-container">
							<TableList
								data={data}
								labels={[
									{ field: "ci", nameField: "Cedula" },
									{
										field: "firstname",
										nameField: "Nombre",
										linked: true,
									},
									{
										field: "lastname",
										nameField: "Apellido",
									},
									{
										field: "section",
										nameField: "Seccion",
									},

									{ field: "actions", nameField: "Acciones" },
								]}
								actions={[
									{
										name: "edit",
										func: (id) => {
											navigate(`/student/detail/${id}`);
										},
									},
									{
										name: "delete",
										func: (id) => {
											showModalDelete(id);
										},
									},
								]}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default StudentsList;