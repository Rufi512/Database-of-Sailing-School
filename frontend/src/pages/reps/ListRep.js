import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import TableList from "../../components/TableList";
const ListRep = () => {
	let navigate = useNavigate()
	return (
		<>
			<Navbar />
			<div className="container-body container-list-rep">
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
						<div className="container-options-list">
							<div className="navigation-button">
								<nav aria-label="...">
									<ul className="pagination">
										<li className="page-item disabled">
											<a
												className="page-link"
												href="#"
												tabIndex="-1"
											>
												Anterior
											</a>
										</li>
										<li className="page-item">
											<a className="page-link" href="#">
												1
											</a>
										</li>
										<li className="page-item active">
											<a className="page-link" href="#">
												2
											</a>
										</li>
										<li className="page-item">
											<a className="page-link" href="#">
												3
											</a>
										</li>
										<li className="page-item">
											<a className="page-link" href="#">
												Siguiente
											</a>
										</li>
									</ul>
								</nav>
							</div>
							<div className="indicator-jump-page">
								<span>Pagina </span>
								<select className="custom-select">
									<option defaultValue={2}>2</option>
								</select>
								<span>
									{" "}
									de{" "}
									<span style={{ color: "#005adf" }}>
										38
									</span>{" "}
								</span>
							</div>
							<div className="indicator-limit">
								<span>Cantidad de elementos a mostrar: </span>
								<select className="custom-select">
									<option defaultValue={15}>15</option>
									<option value={20}>20</option>
									<option value={30}>30</option>
									<option value={50}>50</option>
								</select>
							</div>
						</div>
						<div className="table-container">
							<TableList
								data={[
									{
										id: "tal",
										ci: "20135459",
										firstname: "Pedregal",
										lastname: "cgfdtal",
										phone: "+324235654",
										rol: "csdsfd",
									},
									{
										id: "sad",
										ci: "20879719",
										firstname: "Carbajal",
										lastname: "dfsewfwefeef",
										phone: "+67864342",
										rol: "toreert",
									},
									{
										id: "hfgh",
										ci: "09290019",
										firstname: "sadhuhqwuyeuqiw",
										lastname: "jhkhiuoiugf",
										phone: "+64983974937",
										rol: "ewrw3",
									},
								]}
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
											navigate(`/reps/detail/${id}`);
										},
									},
									{
										name: "delete",
										func: () => {
											console.log("delete");
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