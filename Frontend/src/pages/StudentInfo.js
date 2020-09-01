import React from 'react'
import axios from 'axios'

export default class StudentInfo extends React.Component {
state={
	id:'',
	ci:'',
	firstName:'',
	lastName:'',
	school_year:'',
	subjects:[],
}

		//Carga la informacion del estudiante con el id
		async UNSAFE_componentWillMount(){
			const studentid = this.props.match.params
			const res = await axios.get('http://localhost:8080/studentInfo/'+studentid.id)
			
			this.setState({id:res.data._id,ci:res.data.ci,firstName:res.data.firstName,lastName:res.data.lastName,school_year:res.data.school_year,subjects:res.data.subjects})
			console.log(this.state.subjects)
		}



	render() {
		
		return (
			<div>
			<div className="container-table">
				<table className="tabla_datos">
	<thead>
		<tr>
			<th colSpan="5" rowspan="4">Informacion Del Estudiante</th>
		</tr>
		
	</thead>

		<tbody>
			<td >Cedula</td>
			<td>Nombre</td>
			<td>Apellido</td>
			<td>Curso Actual</td>
			<td>ID</td>
			

			<tr>
			<td>{this.state.ci}</td>
			<td>{this.state.firstName}</td>
			<td>{this.state.lastName}</td>
			<td>{this.state.school_year}</td>
			<td>{this.state.id}</td>
				
</tr>

				
			

			<tr>
				<th colSpan="5">Informacion Academica</th>

			</tr>

			<tr>
				<th>Materias</th>
				<th>Lapso 1</th>
				<th>Lapso 2</th>
				<th>Lapso 3</th>
				<th rowspan="1">Promedio</th>
			</tr>
			{this.state.subjects.map((subjects,i)=>
				<tr key={i}>
					<td>{subjects.name}</td>
					<td>{subjects.score[0]}</td>
					<td>{subjects.score[1]}</td>
					<td>{subjects.score[2]}</td>
					<td>{Math.round((subjects.score[0]+subjects.score[1]+subjects.score[2])/3)}</td>
				</tr>
			)}
			
			

		</tbody>



</table>
			
	</div>

	
			</div>
		)
	}
}