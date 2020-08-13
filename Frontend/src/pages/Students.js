import React from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
export default class Students extends React.Component {
	handleSubmit(e){
			console.log(e)
		}


		
		state={
			students: []
		}
		
		async componentWillMount(){
			const res = await axios.get('http://localhost:8080/students')
			this.setState({students:res.data})
		}


				

			/*
				<div className="bar-search">
    <input type="search" name="search_box" id="search_box"  
    placeholder="Buscar Estudiante"
    onChange={e=>this.handleSubmit(e.target.value)}
    />

</div>
 
*/
 
 /*Funcion que dirige hacia la informacion del estudiante*/
handleInfo(id){
	console.log(id)
	this.props.history.push('/StudentInfo/' + id);
}
/*
	<Link className="a" to={"/StudentInfo/" + students._id}>	 
 </Link>*/
	render() {

		return (
			<div>
				<h1 style={{textAlign:'center'}}>Lista de estudiantes</h1>
	

			<div className="row" style={{marginTop: '40px'}}>

			<table className="tabla_datos">
			<thead>
				<tr>
					<td> Cedula </td>
					<td> Nombre </td>
					<td> Apellido </td>
					<td>Curso Actual</td>
					</tr>
			</thead>
			
					
{this.state.students.map(students=>
			

		
 <tbody key={students._id} onClick={(id)=> id = this.handleInfo(students._id)} >	
 
			<tr>
					<td>{students.ci}</td>
					<td>{students.firstName}</td>
					<td>{students.lastName}</td>
					<td>{students.school_year}</td>
					
					</tr>
					 

		
			
			</tbody>
			
			
					)}
				
	</table>
					
							
					

			</div>



			</div>
		)
	}
}