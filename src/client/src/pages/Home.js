import React, { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { stats } from "../API";
import studentImg from "../static/img/student.png";
import studentGradueImg from "../static/img/student_gradue.png";
import studentMistakeImg from "../static/img/student_mistake.png";
import seccImg from "../static/img/secc.png";
import repImg from "../static/img/rep.png";
import Navbar from "../components/Navbar";
import Cookies from "js-cookie";
import { saludateRol } from "../components/SomethingFunctions";
import "../static/styles/home.css";
const Home = (props) => {
	const [data, setData] = useState({});
	console.log(data)
	const timerRef = useRef(null);
	const saluted = () => {
		const d = new Date();
		let hour = d.getHours();
		if (hour > 18) {
			return `Buenas noches ${saludateRol(Cookies.get("rol"))}`;
		}

		if (hour > 11) {
			return `Buenas tardes ${saludateRol(Cookies.get("rol"))}`;
		}

		if (hour > 6) {
			return `Buenos dias ${saludateRol(Cookies.get("rol"))}`;
		}

		if (hour > 0) {
			return `Buenas madrugadas ${Cookies.get("rol")}`;
		}
	};

	const request = useCallback(async ()=>{
		const toastId = toast.loading("Cargando datos...", {
			closeOnClick: true,
		});
		try {
			const res = await stats();
			console.log(res)
			if (res.status >= 400) {
				return toast.update(toastId, {
					render: "No se pudieron obtener los estados actuales",
					type: "error",
					isLoading: false,
					autoClose: 5000,
				});
			}
			setData(res);

			toast.update(toastId, {
				render: "Estados cargados",
				type: "success",
				isLoading: false,
				autoClose: 5000,
			});
		} catch (e) {
			timerRef.current = setTimeout(() => {
				request();
				return toast.update(toastId, {
					render: "Error al consultar los estados actuales, reitentando...",
					type: "error",
					isLoading: false,
					autoClose: 3000,
				});
			}, 3000);
			console.log(e);
		}
	},[])

	useEffect(() => {
		request();
		return () => clearTimeout(timerRef.current);
	}, [props,request]);
	return (
		<>
			<Navbar actualPage={"home"} />
			<div className="container-body container-home">
				<div className="container-welcome">
					<h2>
						{saluted()} <br /> Pedro Sanchez!
					</h2>
				</div>

				<div className="container-stats">
					<div className="stats">
						<h2>Estudiantes Registrados</h2>
						<p>{data.registered_students || 'N/A'}</p>
						<img src={studentImg} alt="student" />
					</div>
					<div className="stats">
						<h2>Estudiantes Graduados</h2>
						<p>{data.graduate_students || 'N/A'}</p>
						<img src={studentGradueImg} alt="student" />
					</div>
					<div className="stats">
						<h2>Estudiantes Congelados</h2>
						<p>{data.frozen_students || 'N/A'}</p>
						<img src={studentMistakeImg} alt="student" />
					</div>
					<div className="stats">
						<h2>Representantes Registrados</h2>
						<p>{data.registered_representatives || 'N/A'}</p>
						<img src={repImg} alt="student" />
					</div>
					<div className="stats">
						<h2>Secciones Registradas</h2>
						<p>{data.registered_sections || 'N/A'}</p>
						<img src={seccImg} alt="student" />
					</div>
				</div>
			</div>
		</>
	);
};

export default Home;