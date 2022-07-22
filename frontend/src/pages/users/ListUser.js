import React, { useState, useEffect, useCallback } from "react";
import { listUsers, deleteUserFromId } from "../../API";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import TableList from "../../components/TableList";
import { saludateRol } from "../../components/SomethingFunctions";
const ListUser = () => {
	let navigate = useNavigate();
	const [data, setData] = useState([]);
	const [pageActual, setActualPage] = useState(1);
	const [avalaiblePages, setAvalaiblePages] = useState(0);
	const [limit, setLimit] = useState(15);
	const [deleteModal, setDeleteModal] = useState(false);
	const [deleteUser, setDeleteUser] = useState({});
	const [password,setPassword] = useState('')

	const showModalDelete = (id) => {
		setDeleteModal(true);
		let user = data.filter((elm) => {
			return elm.id === id;
		});
		console.log(user[0]);
		setDeleteUser(user[0]);
	};

	const request = useCallback(async () => {
		const toastId = toast.loading("Cargando datos...", {
			closeOnClick: true,
		});
		try {
			const res = await listUsers({ limit: limit, page: pageActual });
			console.log(res);

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
					rol: saludateRol(rol ? rol.name : 'user'),
				});
			});
			setAvalaiblePages(res.data.totalPages);
			setData(users);

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

			setTimeout(() => {
				request();
			}, 3000);
		}
	},[limit,pageActual]);

	const deleteUserId = async () => {
		const toastId = toast.loading("Cargando datos...", {
			closeOnClick: true,
		});
		try {
			const res = await deleteUserFromId({id:deleteUser.id,password:password});
			if (res.status >= 400) {
				return toast.update(toastId, {
					render: res.data.message,
					type: "error",
					isLoading: false,
					autoClose: 5000,
				});
			}
			console.log(`Delete user: ${deleteUser.id}`);
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
		console.log(pageActual, limit);
		request();
	}, [pageActual, limit,request]);

	return (
		<>
			<Navbar />
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
									<p className="card-text">Estas seguro de borrar al usuario{" "}</p>
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
									<p className="card-text">De ser asi introduzca su contraseña y
									confirma la accion</p>
								</div>
							
							<input
								type="password"
								className="form-control"
								style={{marginTop:'10px'}}
								id="password-admin"
								placeholder="Introduzca su contraseña"
								onInput={(e)=> setPassword(e.target.value)}
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
						<div className="container-options-list">
							<div className="navigation-button m-2">
								<button className="btn btn-secondary m-1" onClick={(e)=>{pageActual > 1 ? setActualPage(pageActual - 1) : setActualPage(pageActual)}}  >Anterior</button>
								<button className="btn btn-primary m-1" onClick={(e)=>{avalaiblePages > pageActual ? setActualPage(pageActual + 1) : setActualPage(pageActual)}}>Siguiente</button>
							</div>
							<div className="indicator-jump-page m-2">
								<span>Pagina </span>
								<select className="custom-select" value={pageActual} onChange={(e)=>{setActualPage(e.target.value)}}>
									{[...Array(avalaiblePages)].map((el, i) => {
										if (i === 0) {
											return (
												<option
													defaultValue={i + 1}
													key={i + 1}
												>
													{i + 1}
												</option>
											);
										}
										return (
											<option value={i + 1} key={i + 1}>
												{i + 1}
											</option>
										);
									})}
								</select>
								<span>
									{" "}
									de{" "}
									<span style={{ color: "#005adf" }}>
										{avalaiblePages}
									</span>{" "}
								</span>
							</div>
							<div className="indicator-limit m-2">
								<span>Cantidad de elementos a mostrar: </span>
								<select
									onChange={(e) => {
										setLimit(e.target.value);
									}}
									className="custom-select"
								>
									<option defaultValue={15}>15</option>
									<option value={20}>20</option>
									<option value={30}>30</option>
									<option value={50}>50</option>
								</select>
							</div>
						</div>
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
										func: (id) => {
											navigate(`/user/detail/${id}`);
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

export default ListUser;