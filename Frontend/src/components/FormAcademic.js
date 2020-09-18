import React,{useState,useEffect} from 'react'
import { Formik, Form, Field , FieldArray} from 'formik';
import axios from 'axios'



const FormAcademic = (props) =>{

//Pasamos la informacion como propiedad

const [data,setData] = useState(props)
const [statusStudent,setStatus] = useState(props)


useEffect(() => {
	async function loadData() {
	await setData(props);
	await setStatus(props.status);
	}
       loadData()
   }, [props])


function changeEdit(){
const container = document.querySelector('.container-student')
const container2 = document.querySelector('.container-student-2')
container.style.display = "block"
container2.style.display = "none"
}

//Envia la informacion al servidor
async function handleForm(values){
	const {request} = data
	const status = statusStudent
	console.log(status)
	const {ci,firstName,lastName,subjects} = values
	//Solo para probar (Cambiar esto ya que se rompe)
	setTimeout(()=>{
		request(data.id)
		changeEdit()
	},1000)
	await axios.put('http://localhost:8080/studentUpdateForm/' + data.id,{ci,firstName,lastName,subjects,status})

    
}

function statusButton(){
	if(statusStudent === true){
		setStatus(false)
		
	}else{
		setStatus(true)
	}
}

	return (
			<div>

               <div className="container-student-2">
                <div className="buttons-form-edit">
				<button type="button" onClick={changeEdit}>Regresar</button>
			</div>

		  <Formik
		  //Iniciamos los valores que estan en el estado "data"
	enableReinitialize = {true} 
       initialValues={{
       	 ci:data.ci,
       	 firstName:data.firstName,
       	 lastName:data.lastName,
       	 subjects:data.subjects
       }}
   
       onSubmit={ (values) => {
         handleForm(values)
       }}
     >
       <Form>
         
         

		<table className="student-general">
			<thead>
				<tr>
					<th>Cedula</th> <th>Nombre</th> <th>Apellido</th> <th>Curso</th> <th>Estado</th>
				</tr>
			</thead>
			<tbody>
				<tr>

					<td>
					<Field name="ci" />
					</td> 

					<td>
					<Field name="firstName" />
					</td>

					 <td>
					<Field name="lastName" />
					 </td> 

					 <td>{data.school_year}</td>

					  <td>
					  <button type="button" onClick={statusButton}>{statusStudent ? 'Activo' : 'Inactivo' }</button>
					 </td>
					 
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


                 <FieldArray
        name="subjects"
        render={subjects => (
            <React.Fragment>
                {data.subjects.map((subjects, i) => (
                   <tr key={i}>
                   <td>{subjects.name}</td>
                      <td> <Field type="number" name={`subjects.${i}.score[0]`}  min="0" max="20"/> </td> 
                       <td> <Field type="number" name={`subjects.${i}.score[1]`} min="0" max="20"/> </td>
                        <td> <Field type="number" name={`subjects.${i}.score[2]`} min="0" max="20"/> </td>
                        <td>{Math.round((subjects.score[0]+subjects.score[1]+subjects.score[2])/3)}</td>
                    </tr>
                ))}
               
            </React.Fragment>
        )}
    />                                                                                                                                                                                    

			</tbody>
		</table>
		<div>
			<button type="submit">Actualizar</button>
		</div>
		
       </Form>
     </Formik>
		
	</div>
				
			
			
			</div>
			

		)
}

export default FormAcademic