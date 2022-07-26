import React, { useEffect,useState } from "react";

const NavigationOptionsList = (props) => {
	const [pageActual, setActualPage] = useState(1);
	const [avalaiblePages, setAvalaiblePages] = useState(props.avalaiblePages);
	const [limit, setLimit] = useState(15);
	useEffect(()=>{
		setAvalaiblePages(props.avalaiblePages)
		props.changeActualPage(pageActual)
		props.changeLimit(limit)
	},[props,pageActual,avalaiblePages,limit])
	return (
		<div className="container-options-list">
			<div className="navigation-button m-2">
				<button
					className="btn btn-secondary m-1"
					onClick={(e) => {
						pageActual > 1
							? setActualPage(pageActual - 1)
							: setActualPage(pageActual);
					}}
				>
					Anterior
				</button>
				<button
					className="btn btn-primary m-1"
					onClick={(e) => {
						avalaiblePages > pageActual
							? setActualPage(pageActual + 1)
							: setActualPage(pageActual);
					}}
				>
					Siguiente
				</button>
			</div>
			<div className="indicator-jump-page m-2">
				<span>Pagina </span>
				<select
					className="custom-select"
					value={pageActual}
					onChange={(e) => {
						setActualPage(e.target.value);
					}}
				>
					{[...Array(avalaiblePages)].map((_, i) => {
						if (i === 0) {
							return (
								<option defaultValue={i + 1} key={i + 1}>
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
						setActualPage(1)
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
	);
};

export default NavigationOptionsList;