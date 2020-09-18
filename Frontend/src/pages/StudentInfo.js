import React, { useState, useEffect } from 'react'
import FormAcademic from '../components/FormAcademic'
import axios from 'axios'





const StudentInfo = (props) => {

        const [student, setStudent] = useState({})
        const [subjects, setSubjects] = useState([])

        useEffect(() => {
            async function loadStudent() {
                const { id } = props.match.params
                await request(id)
            }
            loadStudent()
   }, [])

async function request(id) {
    const res = await axios.get('http://localhost:8080/studentInfo/' + id)
    setStudent(res.data)
    setSubjects(res.data.subjects)
}


function changeEdit(){
const container = document.querySelector('.container-student')
const container2 = document.querySelector('.container-student-2')
container.style.display = "none"
container2.style.display = "block"
}



		return (
			<div>
			<h2 style={{textAlign: 'center'}}>Informacion del Estudiante</h2>
			
               <div className="container-student">
               <div className="buttons-form-edit">
				<button type="button" onClick={changeEdit}>Editar</button>
			</div>
		<table className="student-general">
			<thead>
				<tr>
					<th>Cedula</th> <th>Nombre</th> <th>Apellido</th> <th>Curso</th> <th>Estado</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>{student.ci}</td> <td>{student.firstName}</td> <td>{student.lastName}</td> <td>{student.school_year}</td> <td>{student.status ? 'Activo':'Inactivo'}</td>
				</tr>
			</tbody>
		</table>

		<table className="student-notes">
			<thead>
				<tr>
					<th colSpan="5">Informacion Academica</th>
				</tr>
				<tr>
				<th>Materias</th>
				<th>Lapso 1</th>
				<th>Lapso 2</th>
				<th>Lapso 3</th>
				<th rowSpan="1">Promedio</th>
			</tr>
			
			</thead>
			<tbody>
	           {subjects.map((subjects,i)=>
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
		<div className="time-edit">
			<p>Fecha de modificacion ultima vez: {student.last_modify}</p>
		</div>
	</div>
				
			
			<FormAcademic 
			id={student._id}
			ci={student.ci}
			firstName={student.firstName}
			 lastName={student.lastName}
			  status={student.status}
			   subjects={subjects}

			 school_year={student.school_year}
			 request={request}/>
			</div>
			

		)
	
}

export default StudentInfo