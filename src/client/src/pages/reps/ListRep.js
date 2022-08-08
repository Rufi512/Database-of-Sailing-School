import React, { useState, useEffect, useCallback,useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavigationOptionsList from "../../components/NavigationOptionsList";
import { toast } from "react-toastify";
import { listReps,deleteRepFromId } from "../../API";
import Navbar from "../../components/Navbar";
import TableList from "../../components/TableList";
const ListRep = () => {
	const timerRef = useRef(null);
	let navigate = useNavigate();
	const [pageActual, setActualPage] = useState(1);
	const [avalaiblePages, setAvalaiblePages] = useState(0);
	const [limit, setLimit] = useState(15);
	const [data, setData] = useState([]);
	const [deleteModal, setDeleteModal] = useState(false);
	const [deleteRep, setDeleteRep] = useState({});
	const [password, setPassword] = useState("");
	const request = useCallback(async () => {
		const toastId = toast.loading("Cargando datos...", {
			closeOnClick: true,
		});
		try {
			const res = await listReps({ limit: limit, page: pageActual });
			setPassword("")
			setDeleteModal(false)
			if (res.status >= 400) {
				return toast.update(toastId, {
					render: res.data.message,
					type: "error",
					isLoading: false,
					autoClose: 5000,
				});
			}
			const reps = res.data.docs.map((el) => {
				let { _id, ci, firstname, lastname } = el;
				return Object({
					id: _id,
					ci,
					firstname,
					lastname,
					phone: el.contact.phone_numbers[0].formatted
						? el.contact.phone_numbers[0].formatted
						: "Sin información",
				});
			});
			setAvalaiblePages(res.data.totalPages);
			setData(reps);

			toast.update(toastId, {
				render: "Lista Cargada",
				type: "success",
				isLoading: false,
				autoClose: 3000,
			});
		} catch (e) {
			console.log(e);

			toast.update(toastId, {
				render: "Error al enviar informacion, intente de nuevo",
				type: "error",
				isLoading: false,
				autoClose: 5000,
			});

			timerRef.current = setTimeout(() => {
				request();
			}, 3000);
		}
	}, [limit, pageActual]);

	const deleteRepId = async () => {
		const toastId = toast.loading("Cargando datos...", {
			closeOnClick: true,
		});
		try {
			const res = await deleteRepFromId({
				id: deleteRep.id,
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
			console.log(`Delete user: ${deleteRep.id}`);
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

	const showModalDelete = (id) => {
		setDeleteModal(true);
		let rep = data.filter((elm) => {
			return elm.id === id;
		});
		console.log(rep[0]);
		setDeleteRep(rep[0]);
	};

	useEffect(() => {
		console.log(pageActual, limit);
		request();
		return () => clearTimeout(timerRef)
	}, [pageActual, limit, request]);

	return (
		<>
			<Navbar />
			<div className="container-body container-list-rep">
		{/*Delete rep modal*/}
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
									Estas seguro de borrar al representante{" "}
								</p>
								<p className="card-text">
									<span style={{ fontWeight: "bold" }}>
										Cedula:
									</span>
									{deleteRep.ci}
									<br />
									<span style={{ fontWeight: "bold" }}>
										Nombre y Apellido:
									</span>{" "}
									{`${deleteRep.firstname} ${deleteRep.lastname}`}
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
									onClick={deleteRepId}
								>
									Confirmar Accion
								</button>
								<button
									className="btn btn-secondary"
									onClick={(e) => {
										setDeleteRep({});
										setDeleteModal(false);
									}}
								>
									Regresar
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className="card card-container">
					<div className="card-header">
						<h2>Lista de representantes</h2>
					</div>
					<div className="container-content p-3">
						<div className="container-actions-body">
							<Link to="/reps/create" className="btn btn-primary">
								+ Añadir nuevo representante
							</Link>
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
										field: "phone",
										nameField: "Telefono",
									},
									{ field: "actions", nameField: "Acciones" },
								]}
								actions={[
									{
										name: "edit",
										func: (id) => {
											navigate(`/reps/detail/${id}`);
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

export default ListRep;