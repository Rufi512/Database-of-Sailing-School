import React, { useState,useEffect,useRef,useCallback } from "react";
import { getLogs } from "../../API";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import TableList from "../../components/TableList";
import NavigationOptionsList from "../../components/NavigationOptionsList";

const Logs = () => {
	const timerRef = useRef(null);
	const [data, setData] = useState([
		{ ip: "192.123.32.1", user: "El loco ramirez", reason: "Loco", created_at:'dsfsd' },
	]);
	const [pageActual, setActualPage] = useState(1);
	const [avalaiblePages, setAvalaiblePages] = useState(0);
	const [limit, setLimit] = useState(15);

	const request = useCallback(async () => {
		const toastId = toast.loading("Cargando datos...", {
			closeOnClick: true,
		});
		try {
			const res = await getLogs({ limit: limit, page: pageActual });

			if (res.status >= 400) {
				return toast.update(toastId, {
					render: res.data.message,
					type: "error",
					isLoading: false,
					autoClose: 5000,
				});
			}

			const list = res.data.docs.map((el) => {
				let { user,ip,reason,created_at} = el;
				return Object({
					user,
					ip,
					reason,
					created_at
				});
			});

			setAvalaiblePages(res.data.totalPages);
			setData(list);

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

	useEffect(() => {
		request();
		return () => clearTimeout(timerRef.current)
	}, [pageActual, limit, request]);

	return (
		<>
			<Navbar actualPage={"logs"} />
			<div className="container-body container-list-rep">
				{/*Page return*/}
				<div className="card card-container">
					<div className="card-header">
						<h2>Lista de actividad de usuarios</h2>
					</div>
					<div className="container-content p-3">
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
						<div className="table-container table-container-logs">
							<TableList
								data={data}
								labels={[
									{ field: "ip", nameField: "Direccion ip" },
									{
										field: "user",
										nameField: "Usuario",
									},
									{
										field: "reason",
										nameField: "Actividad",
									},
									{
										field: "created_at",
										nameField: "Realizado",
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

export default Logs;