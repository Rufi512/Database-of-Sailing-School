import React,{useState,useEffect} from 'react'
import { Formik, Form, Field , FieldArray} from 'formik';
import axios from 'axios';
import {changeEdit} from './SomethingFunctions';
import { Popup, displayPopup } from '../components/Alerts'



const FormAcademic = (props) =>{

//Pasamos la informacion como propiedad

const [data,setData] = useState(props)
const [statusStudent,setStatus] = useState(props)
const [popup,setPopup] = useState({})

useEffect(() => {
	function loadData() {
	setData(props);
	setStatus(props.status);
	}
       loadData()
   }, [props])

//Envia la informacion al servidor
async function handleForm(values){
  setPopup({text:'Actualizando informacion...',type:'request'})
  displayPopup()
	const {request} = data 
	const status = statusStudent
	const {ci,firstName,lastName,subjects} = values
	const res = await axios.put('http://localhost:8080/student/Form/' + data.id,{ci,firstName,lastName,subjects,status})
	if(res.status === 200){
		request(data.id)
		changeEdit(false)
    setPopup({text:'Informacion actualizada',type:'pass'})
    displayPopup('received')
	}else{
		console.log('ha ocurrido un fucking error!')
	}

    
}

function statusButton(){
	if(statusStudent === true){
		setStatus(false)
		
	}else{
		setStatus(true)
	}
}

	return (
			<React.Fragment>
       <Popup popup={popup}/>
      <div className="container-student edit-information">

                

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
        <Form style={{margin:'auto',width:'100%'}}>
        <div className="buttons-container" style={{width:'100%',display:'inline-flex',justifyContent:'space-around',marginBottom:'15px'}}>
                    <button className="btn" type="button" onClick={(e) => { changeEdit(false) }}>Regresar</button>
                    <button className="btn btn-confirm" type="submit">Actualizar</button>
                </div>
 
         

		<table className="student-general">
			<thead>
				<tr>
					<th>Cedula</th> <th>Nombre</th> <th>Apellido</th> <th>Curso</th> <th>Estado</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>
					<Field style={{width: '100px'}} name="ci" />
					</td> 

					<td>
            <Field style={{width:'110px'}} name="firstName" />
					</td>

					 <td>
             <Field style={{width:'110px'}} name="lastName" />
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
                     <td> <Field style={{width:'35px'}} type="number" name={`subjects.${i}.score[0]`}  min="0" max="20"/> </td> 
                       <td> <Field style={{width:'35px'}} type="number" name={`subjects.${i}.score[1]`} min="0" max="20"/> </td>
                        <td> <Field style={{width:'35px'}} type="number" name={`subjects.${i}.score[2]`} min="0" max="20"/> </td>
                        <td>{Math.round((subjects.score[0]+subjects.score[1]+subjects.score[2])/3)}</td>
                    </tr>
                ))}
               
            </React.Fragment>
        )}
    />                                                                                                                                                                                    

			</tbody>
		</table>
		
		
       </Form>
     </Formik>
		
	</div>
				
			
			
			</React.Fragment>
			

		)
}

export default FormAcademic
