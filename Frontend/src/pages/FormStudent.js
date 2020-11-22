import React, {useState} from 'react'
import axios from 'axios'
import {Popup, displayPopup} from '../components/Alerts'
import '../components/resources/css/forms.css'

const FormStudent = () => {

  const [ci, setCi] = useState(null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [school_year, setSchool_year] = useState("1-A")
  const [csv, setCsv] = useState('')
  const [popup, setPopup] = useState({})
  const [alertCsv, setAlertCsv] = useState("")



  async function handleSubmit(e) {
    let result = null
    e.preventDefault();
    displayPopup();
    setPopup({text: 'Enviando informacion', type: 'request'})
    const res = await axios.post('http://localhost:8080/regStudent', {ci, firstName, lastName, school_year})
      .catch((err) => {
        result = err;
      });

    if (result) {
      displayPopup();
      setPopup({text: 'Error al conectar al servidor', type: 'error'})
    } else {
      if (res.data === 'null') {
        setPopup({text: 'Estudiante registrado correctamente', type: 'pass'})
        displayPopup('received')
      } else {
        setPopup({text: 'El estudiante ya se encuentra registrado', type: 'error'})
      }
    }


  }



  /*Subida de estudiantes por CSV*/

  async function handleSubmitFile(e) {
    e.preventDefault()
    const file = csv
    let formData = new FormData();
    formData.append('students', file);
    console.log(csv)
    const res = await axios.post('http://localhost:8080/regStudents', formData)
    if (res.status === 200) {
      setPopup({text: 'Estudiantes registrados correctamente', type: 'pass'})
      displayPopup('received')
    } else {
      setPopup({text: 'Ah ocurrido un error al procesar el archivo', type: 'error'})
      displayPopup()
    }
  }




  return (
    <div>

      <Popup popup={popup} />

      <div className="container-boxs">

        <div className="container">
          <h2>Registro de Estudiante</h2>

          <form onSubmit={handleSubmit}>

            <div className="form-input">
              <input type="text" id="ci" name="ci" pattern="[VveE1234567890.-]{1,900}" autoComplete="off" onChange={e => setCi(e.target.value)} required />
              <label className="label-name">Cedula del Estudiante</label>
            </div>

            <div className="form-input">
              <input type="text" id="nombres" name="firstName" pattern="[A-Za-záéíóúñ'´ ]{1,900}" autoComplete="off" title="Solo Caracteres Alfabeticos!"
                onChange={e => setFirstName(e.target.value)} required />
              <label className="label-name">Nombre del Estudiante</label>
            </div>

            <div className="form-input">
              <input type="text" id="apellidos" name="lastName" autoComplete="off"
                onChange={e => setLastName(e.target.value)} required />
              <label className="label-name">Apellido del Estudiante</label>
            </div>

            <div className="form-input-select">
              <label htmlFor="anio_actual">Curso Actual:</label>
              <select name="school_year" id="anio_actual" onChange={e => setSchool_year(e.target.value)} value={school_year}>
                <option value="1-A">1-A</option>
                <option value="1-B">1-B</option>
                <option value="2-A">2-A</option>
                <option value="2-B">2-B</option>
                <option value="3-A">3-A</option>
                <option value="3-B">3-B</option>
                <option value="4-A">4-A</option>
                <option value="4-B">4-B</option>
                <option value="5-A">5-A</option>
                <option value="5-B">5-B</option>
              </select>
            </div>

            <div className="buttons-container">
              <button type="submit" className="btn btn-confirm"> Guardar Estudiante </button>
            </div>

          </form>
        </div>








        <div className="container-csv">
          <form onSubmit={handleSubmitFile}>

            <h2 style={{textAlign: 'center'}}>Enviar archivo CSV</h2>
            <p style={{textAlign: 'center'}}>{alertCsv ? alertCsv : ''}</p>
            <div className="buttons-container">
              <label id="labelFile" htmlFor="file" className="btn btn-secondary"> Subir CSV </label>

              <input style={{display: "none"}} type="file" id="file" accept=".csv" onChange={(e) => {
                setCsv(e.target.files[0])
                setAlertCsv('Archivo cargado')
              }} name="students" />
              <button className="btn btn-confirm"> Enviar </button>
            </div>


          </form>
        </div>



      </div>
    </div>
  )



}

export default FormStudent
