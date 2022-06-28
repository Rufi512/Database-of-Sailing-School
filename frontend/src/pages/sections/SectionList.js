import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import TableList from "../../components/TableList";
import "../../static/styles/sections-list.css";
const SectionList = () => {
	let dt = new Date();
	const [showCreator, setShowCreator] = useState(false);
	return (
		<>
			<Navbar actualPage={"sections"} />
			<div className="container-body container-sections-list">
				{
					//Modal to show form create section
					<div
						className={`modal-form-container ${
							showCreator ? "modal-form-container-show" : ""
						}`}
					>
						<form action="" className="form-container">
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
									max={5}
									placeholder="Especifica el año escolar de la seccion"
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
									/>
									<input
										className="form-control"
										type="number"
										min={dt.getFullYear().toString()}
										step="1"
										placeholder="ej:2023"
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
											<button className="page-link" href="#">
												1
											</button>
										</li>
										<li className="page-item active">
											<button className="page-link" href="#">
												2
											</button>
										</li>
										<li className="page-item">
											<button className="page-link" href="#">
												3
											</button>
										</li>
										<li className="page-item">
											<button className="page-link" href="#">
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
						<TableList
							data={[
								{
									id: "tal",
									name: "seccion1",
									year: 2,
									period_initial: "2019",
									period_last: "2020",
								},
								{
									id: "tal",
									name: "secc2",
									year: 4,
									period_initial: "2019",
									period_last: "2020",
								},
								{
									id: "tal",
									name: "secc3",
									year: 5,
									period_initial: "2019",
									period_last: "2020",
								},
							]}
							labels={[
								{ field: "name", nameField: "Seccion" },
								{ field: "year", nameField: "Año" },
								{
									field: "period_initial",
									nameField: "Periodo inicial",
								},
								{
									field: "period_last",
									nameField: "Culminacion",
								},
								{ field: "actions", nameField: "Acciones" },
							]}
							actions={[
								{ name: "edit", func: console.log("Modify") },
								{
									name: "delete",
									func: console.log("Deleted"),
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