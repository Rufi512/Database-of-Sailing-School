import React from 'react'
import axios from 'axios'
import '../components/css/forms.css'
export default class FormStudent extends React.Component {

    constructor() {
        super();
        this.state = {
           ci:'',
           name:'',
           lastName:'',
           school_year:'1-A',
           fileCsv:null,
           pass:'none',
           error:'',
           vError:'none'



        }
    }


    async handleSubmit(e) {
     e.preventDefault();
     this.setState({ error: '', vError: 'none', pass: 'none' })
     const ci = this.state.ci
     const name = this.state.name
     const lastName = this.state.lastName
     const school_year = this.state.school_year
     const res = await axios.post('http://localhost:8080/regStudent', { ci, name, lastName, school_year })

        /*Se mostraran mensajes de error si los hay*/
     .catch((err) => {
         this.setState({ error: 'No se pudo establecer conexion al Servidor', vError: 'block' })
         console.log(err)

     });

     if (this.state.error !== '') {
         return
     }
     if (res.data) {
         this.setState({ error: res.data, vError: 'block' })
         console.log(this.state.error)
     }
     if (res.data === 'null' || null) {
         this.setState({ vError: 'none', pass: 'block' })
     }


 }

 /*Subida de estudiantes por CSV*/

 async handleSubmitFile(e) {
     e.preventDefault()
     const file = this.state.fileCsv
     let formData = new FormData();
     formData.append('students', file);
     await axios.post('http://localhost:8080/regStudents', formData)
 }

    render() {
        return (
            <div>
            <p className="error" style={{display:this.state.vError}}>{this.state.error ? this.state.error: ''}</p>
            <p className="pass" style={{display:this.state.pass}}>Estudiante Registrado con Exito</p>
                <div className="container-boxs">

    <div className="container">
        <h2>Registro de Estudiante</h2>
    
    <form onSubmit={this.handleSubmit.bind(this)}>

        <div className="form-input">
        <input  type="text" id="ci" name="ci" pattern="[VveE1234567890.-]{1,900}" autoComplete="off" onChange={ci => this.setState({ci: ci.target.value})} required/>
        <label className="label-name">Cedula del Estudiante</label>
        </div>

        <div className="form-input">
        <input  type="text" id="nombres" name="name" pattern="[A-Za-záéíóúñ'´ ]{1,900}" autoComplete="off" title="Solo Caracteres Alfabeticos!" 
                onChange={name => this.setState({name: name.target.value})} required/>
        <label className="label-name">Nombre del Estudiante</label>
        </div>

        <div className="form-input">
        <input  type="text" id="apellidos" name="lastName"  autoComplete="off" 
                onChange={lastName => this.setState({lastName: lastName.target.value})} required/>
        <label className="label-name">Apellido del Estudiante</label>
        </div>

        <div className="form-input-select">
          <label htmlFor="anio_actual">Curso Actual:</label>
                   <select name="school_year" id="anio_actual" onChange={school_year => this.setState({school_year: school_year.target.value})} value={this.state.school_year}>
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
      
        <div className="buttons">
                <button type="submit" id="boton-confirmar" onClick={e=>e.target.value}> Guardar Estudiante </button>
            </div>
       
    </form>
    </div>

    
        
    
    

            

<div className="container-csv">
        <form onSubmit={this.handleSubmitFile.bind(this)}>

            <h2 style={{textAlign:'center'}}>Enviar archivo CSV</h2>
            <div className="buttons">
                <label id="labelFile" htmlFor="file" className="btn btn-primary"> Subir CSV </label>
                <input style={{display: "none"}} type="file" id="file" accept=".csv" onChange={fileCsv => this.setState({fileCsv:fileCsv.target.files[0]})} name="students"/>
                <button id="boton-confirmar" onClick={e=>e.target.value}> Enviar </button>
            </div>


        </form>
   </div>



   </div>
            </div>
        )
    }
}

