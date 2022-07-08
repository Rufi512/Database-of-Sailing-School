import React from 'react';
import studentImg from '../static/img/student.png'
import studentGradueImg from '../static/img/student_gradue.png'
import studentMistakeImg from '../static/img/student_mistake.png'
import seccImg from '../static/img/secc.png'
import repImg from '../static/img/rep.png'
import Navbar from '../components/Navbar'
import '../static/styles/home.css'
const Home = () =>{
	const saluted = () =>{
		const d = new Date();
		let hour = d.getHours();
		if(hour > 18){
			return 'Buenas noches rol'
		}

		if(hour > 11){
			return 'Buenas tardes rol'
		}

		if(hour > 6){
			return 'Buenos dias rol'
		}

		if(hour > 0){
			return 'Buenas madrugadas rol'
		}


	}
	return(
		<>
		<Navbar actualPage={'home'}/>
			<div className='container-body container-home'>
			<div className='container-welcome'>
				<h2>{saluted()} <br/> Pedro Sanchez!</h2>
			</div>

			<div className='container-stats'>
				<div className='stats'>
					<h2>Estudiantes Registrados</h2>
					<p>28</p>
					<img src={studentImg} alt="student"/>
				</div>
				<div className='stats'>
					<h2>Estudiantes Graduados</h2>
					<p>20</p>
					<img src={studentGradueImg} alt="student"/>
				</div>
				<div className='stats'>
					<h2>Estudiantes Congelados</h2>
					<p>20</p>
					<img src={studentMistakeImg} alt="student"/>
				</div>
				<div className='stats'>
					<h2>Representantes Registrados</h2>
					<p>20</p>
					<img src={repImg} alt="student"/>
				</div>
				<div className='stats'>
					<h2>Secciones Registradas</h2>
					<p>20</p>
					<img src={seccImg} alt="student"/>
				</div>
			</div>

			</div>
			</>
		)
}

export default Home