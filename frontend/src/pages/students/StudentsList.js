import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import TableList from "../../components/TableList";
const StudentsList = () => {
	let navigate = useNavigate();
	return (
		<>
			<Navbar />
			<div className="container-body container-list-rep">
				<div className="card card-container">
					<div className="card-header">
						<h2>Lista de estudiantes</h2>
					</div>
					<div className="container-content p-3">
						<div className="container-actions-body">
							<Link to="/register/student" className="btn btn-primary">
								+ Añadir nuevo estudiante
							</Link>
						</div>
						<div className="container-options-list">
							<div className="navigation-button">
								<nav aria-label="...">
									<ul className="pagination">
										<li className="page-item disabled">
											<button
												className="page-link"
												href="#"
												tabIndex="-1"
											>
												Anterior
											</button>
										</li>
										<li className="page-item">
											<button
												className="page-link"
												href="#"
											>
												1
											</button>
										</li>
										<li className="page-item active">
											<button
												className="page-link"
												href="#"
											>
												2
											</button>
										</li>
										<li className="page-item">
											<button
												className="page-link"
												href="#"
											>
												3
											</button>
										</li>
										<li className="page-item">
											<button
												className="page-link"
												href="#"
											>
												Siguiente
											</button>
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
										firstname: "seccion1",
										lastname: "cgfdtal",
										rol: "csdsfd",
									},
									{
										id: "sad",
										ci: "20879719",
										firstname: "dsioufouoeufds",
										lastname: "dfsewfwefeef",
										rol: "toreert",
									},
									{
										id: "hfgh",
										ci: "09290019",
										firstname: "sadhuhqwuyeuqiw",
										lastname: "jhkhiuoiugf",
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
										field: "rol",
										nameField: "Rol",
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

export default StudentsList;