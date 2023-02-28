import React, { useState, useEffect, useCallback, useRef } from "react";
import { listUsers, deleteUserFromId } from "../../API";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import TableList from "../../components/TableList";
import NavigationOptionsList from "../../components/NavigationOptionsList";
import { saludateRol } from "../../components/SomethingFunctions";
const ListUser = () => {
	const timerRef = useRef(null);
	let navigate = useNavigate();
	const [data, setData] = useState([]);
	const [pageActual, setActualPage] = useState(1);
	const [avalaiblePages, setAvalaiblePages] = useState(0);
	const [limit, setLimit] = useState(15);
	const [deleteModal, setDeleteModal] = useState(false);
	const [deleteUser, setDeleteUser] = useState({});
	const [password, setPassword] = useState("");

	const showModalDelete = (id) => {
		setDeleteModal(true);
		let user = data.filter((elm) => {
			return elm.id === id;
		});
		setDeleteUser(user[0]);
	};

	const request = useCallback(async () => {
		const toastId = toast.loading("Cargando datos...", {
			closeOnClick: true,
		});
		try {
			const res = await listUsers({ limit: limit, page: pageActual });

			if (res.status >= 400) {
				return toast.update(toastId, {
					render: res.data.message,
					type: "error",
					isLoading: false,
					autoClose: 5000,
				});
			}
			const users = res.data.docs.map((el) => {
				let { _id, ci, firstname, lastname, rol } = el;
				return Object({
					id: _id,
					ci,
					firstname,
					lastname,
					rol: saludateRol(rol ? rol.name : "user"),
				});
			});
			setAvalaiblePages(res.data.totalPages);
			setData(users);

			toast.update(toastId, {
				render: "Cargado!",
				type: "success",
				isLoading: false,
				autoClose: 1,
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

	const deleteUserId = async () => {
		const toastId = toast.loading("Cargando datos...", {
			closeOnClick: true,
		});
		try {
			const res = await deleteUserFromId({
				id: deleteUser.id,
				password: password,
			});
			setPassword("")
			setDeleteModal(false);

			if (res.status >= 400) {
				return toast.update(toastId, {
					render: res.data.message,
					type: "error",
					isLoading: false,
					autoClose: 5000,
				});
			}

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
		return () => clearTimeout(timerRef.current)
	}, [pageActual, limit, request]);

	return (
		<>
			<Navbar actualPage={"users"}/>
			<div className="container-body container-list-rep">
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
									Estas seguro de borrar al usuario{" "}
								</p>
								<p className="card-text">
									<span style={{ fontWeight: "bold" }}>
										Cedula:
									</span>
									{deleteUser.ci}
									<br />
									<span style={{ fontWeight: "bold" }}>
										Nombre y Apellido:
									</span>{" "}
									{`${deleteUser.firstname} ${deleteUser.lastname}`}
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
									onClick={deleteUserId}
								>
									Confirmar Accion
								</button>
								<button
									className="btn btn-secondary"
									onClick={(e) => {
										setDeleteUser({});
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
						<h2>Lista de Usuarios</h2>
					</div>
					<div className="container-content p-3">
						<div className="container-actions-body">
							<Link to="/user/create" className="btn btn-primary">
								+ Añadir nuevo usuario
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
										field: "rol",
										nameField: "Rol",
									},
									{ field: "actions", nameField: "Acciones" },
								]}
								actions={[
									{
										name: "edit",
										type:"button",
										func: (id) => {
											navigate(`/user/detail/${id}`);
										},
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
			</div>
		</>
	);
};

export default ListUser;