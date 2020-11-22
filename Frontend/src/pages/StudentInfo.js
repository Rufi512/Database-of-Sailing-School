import React, { useState, useEffect } from 'react'
import FormAcademic from '../components/FormAcademic'
import axios from 'axios'
import { screenComment, changeEdit } from '../components/SomethingFunctions'
import trashSvg from '../components/resources/icons/trash-solid.svg'


const StudentInfo = (props) => {

    const [student, setStudent] = useState({})
    const [subjects, setSubjects] = useState([])
    const [commits, setCommits] = useState([])
    const [comment, setComment] = useState("")
    

    useEffect(() => {
        async function loadStudent() {
            const { id } = props.match.params
            await request(id)
        }
        loadStudent()
    }, [props])

    async function request(id) {
        let connection = true
        const res = await axios.get('http://localhost:8080/student/Info/' + id).catch((err) => {
            connection = false
            console.log(err)
        })
        if (connection === false) { 
          return 0
        }
        if (res.data) {
            setStudent(res.data)
            setSubjects(res.data.subjects)
            setCommits(res.data.commits)
        }
    }


    //Añade comentario
    async function handleSubmit() {
      let connection = true
      const res = await axios.post('http://localhost:8080/student/Commit/' + student._id, { comment }).catch((err)=>{connection = false})
      if(connection === false){
      return 0  
      }
        if (res.status === 200) {
            screenComment(false)
            request(student._id)
        } else {
            console.log('Error')
        }


    }

    //Borra los comentarios
    async function deleteComment(index) {
        const res = await axios.post('http://localhost:8080/student/deleteCommit/' + student._id, { index })
        if (res.status === 200) {
            request(student._id)
        } else {
            console.log('Error')
        }

    }


    return (
        <div>

            <h2 style={{ textAlign: 'center' }}>Informacion del Estudiante</h2>

            <div className="container-student view-information">
              <div className="buttons-container" style={{width:'100%',display:'inline-flex',justifyContent:'space-around',marginBottom:'15px'}}>
                    <button className="btn" type="button" onClick={(e) => { changeEdit(true) }}>Editar</button>
                    <button className="btn" type="button">Historial</button>
                    <button className="btn" type="button">Graduar</button>
                </div>

                <table className="student-general">

                    <thead>
                        <tr>
                            <th>Cedula</th> <th>Nombre</th> <th>Apellido</th> <th>Curso</th> <th>Estado</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>{student.ci}</td> <td>{student.firstName}</td> <td>{student.lastName}</td> <td>{student.school_year}</td> <td>{student.status ? 'Activo' : 'Inactivo'}</td>
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
                        {subjects.map((subjects, i) =>
                            <tr key={i}>
                                <td>{subjects.name}</td>
                                <td>{subjects.score[0]}</td>
                                <td>{subjects.score[1]}</td>
                                <td>{subjects.score[2]}</td>
                                <td>{Math.round((subjects.score[0] + subjects.score[1] + subjects.score[2]) / 3)}</td>
                            </tr>
                        )}

                    </tbody>
                </table>

               
                <div className="time-edit">
                    <p>Fecha de modificacion ultima vez: {student.last_modify}</p>
                </div>

                <h3>Comentarios</h3>
                <div className="box-comment">
                    {commits.map((commits, i) =>
                        <div className="commit" key={i}>

                            <div>
                                <p style={{ 'whiteSpace': 'pre-line' }}>{commits.comment}</p>
                                <p>Comentado por: <span>{commits.author}</span></p>
                                <p>{commits.date_comment}</p>
                            </div>

                            <div>
                                <img className="icon" src={trashSvg} alt="trash" onClick={(e) => deleteComment(i)} />
                                <span className="tooltip">Eliminar</span>
                            </div>
                        </div>
                    )}

                </div>

                <div className="screen-back" onClick={(e) => { screenComment(false) }}>
                </div>

                <div className="screen-comment">
                    <h3>Escribe tu comentario</h3>
                    <textarea className="input-comment" name="comment" onChange={e => setComment(e.target.value)}></textarea>
                    <div>
                        <button className="button-comment" type="button" onClick={handleSubmit}>Enviar Comentario</button>
                        <button className="button-comment" type="button" onClick={(e) => { screenComment(false) }}>Regresar</button>
                    </div>
                </div>

                <button className="button-comment" type="button" onClick={(e) => { screenComment(true) }}>Comentar</button>

            </div>


       <FormAcademic
                    id={student._id}
                    ci={student.ci}
                    firstName={student.firstName}
                    lastName={student.lastName}
                    status={student.status}
                    subjects={subjects}
                    school_year={student.school_year}
                    request={request} />

        </div>


    )

}

export default StudentInfo
