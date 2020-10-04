import React, { useState, useEffect } from 'react'
import FormAcademic from '../components/FormAcademic'
import axios from 'axios'
import trashSvg from '../components/resources/icons/trash-solid.svg'

let val=false



const StudentInfo = (props) => {

        const [student, setStudent] = useState({})
        const [subjects, setSubjects] = useState([])
        const [commits,setCommits] = useState([])
        const [comment,setComment] = useState("")
       

        useEffect(() => {
            async function loadStudent() {
                const { id } = props.match.params
                await request(id)
            }
            loadStudent()
   }, [])

async function request(id) {
    const res = await axios.get('http://localhost:8080/studentInfo/' + id)
    if(res.status == 200){
    	setStudent(res.data)
    setSubjects(res.data.subjects)
    setCommits(res.data.commits)
}else{
	console.log('ha ocurrido un error al cargar la informacion')
}
    
}


function changeEdit(){
const container = document.querySelector('.container-student')
const container2 = document.querySelector('.container-student-2')
container.style.display = "none"
container2.style.display = "flex"
}

//Pregunta

function screen_comment(){
	const container = document.querySelector('.screen-back')
	const container_commit = document.querySelector('.screen-comment')
	if(val === false){
	container.style.visibility = 'visible'
	container.style.opacity = "100%"
	container_commit.style.visibility = 'visible'
	container_commit.style.opacity = "100%"
	val = true
}else{
	const textarea = document.querySelector('.input-comment')
	const container_commit = document.querySelector('.screen-comment')
	container.style.visibility = 'hidden'
	container.style.opacity = "0%"
	container_commit.style.visibility = 'hidden'
	container_commit.style.opacity = "0%"
	setComment("")
	textarea.value=""
	val = false
}

}

//Añade comentario
async function handleSubmit() {
	const res = await axios.post('http://localhost:8080/studentCommit/' + student._id, {comment})
    if(res.status == 200){
	screen_comment()
	request(student._id)
}else{
	console.log('Error')
}

     
 }

//Borra los comentarios
async function deleteComment(index){
const res = await axios.post('http://localhost:8080/studentDeleteCommit/' + student._id, {index})
if(res.status == 200){
	request(student._id)

}else{
	console.log('Error')
}

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

			 <h3>Comentarios</h3>
	<div className="box-comment">
	{commits.map((commits,i)=>
         <div className="commit" key={i}> 

         <div>
         <p style={{'whiteSpace': 'pre-line'}}>{commits.comment}</p>  
         <p>Comentado por: <span>{commits.author}</span></p> 
         <p>{commits.date_comment}</p>
         </div> 

         <div>
         <img className="icon" src={trashSvg} onClick={(e) =>deleteComment(i)} />
         <span className="tooltip">Eliminar</span>
         </div>
         </div>
		)}

	</div>

     <div className="screen-back" onClick={screen_comment}>
     </div>

     <div className="screen-comment">
     	<h3>Escribe tu comentario</h3>
     	<textarea className="input-comment" name="comment" onChange={e => setComment(e.target.value)}></textarea>
     	<div>
     	<button className="button-comment" type="button" onClick={handleSubmit}>Enviar Comentario</button>
     	<button className="button-comment" type="button" onClick={screen_comment}>Regresar</button>
     	</div>
     	</div>
     	
	<button className="button-comment" type="button" onClick={screen_comment}>Comentar</button>

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