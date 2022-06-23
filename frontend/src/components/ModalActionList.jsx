import React, { useState, useEffect } from "react";
const ModalActionList = (props) => {
	const [showModal, setShowModal] = useState(false);
	const [list,setList] = useState([])
	useEffect(()=>{
		setShowModal(props.show)
		setList(props.list)
		console.log(props)
	},[props])
	return (
		<div
			className={`container-add-list ${
				showModal ? "container-add-list-show" : ""
			}`}
		>
			<div className="list-avalaibles">
				<h3>Lista de materias disponibles</h3>
				<div className="table-subjects">
					<table className="table table-subjects-availables">
						<thead className="thead">
							<tr>
								<th scope="col">Materia</th>
								<th scope="col">Acciones</th>
							</tr>
						</thead>
						<tbody>
							{list.map((el, i) => (
								<tr key={i}>
									<td>{el.name}</td>
									<td>
										<button
											className="btn btn-primary"
											disabled
										>
											Añadir
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<button
						className="btn btn-primary"
						style={{ display: "flex", marginLeft: "auto" }}
						onClick={(e) => {
							setShowModal(false);
						}}
					>
						Cerrar ventana
					</button>
				</div>
			</div>
		</div>
	);
};

export default ModalActionList;