import React, {useState, useEffect} from 'react'
import FormAcademic from '../components/FormAcademic'
import axios from 'axios'
import {InfoBasic} from '../components/InfoBasic'
import {InfoAcademic} from '../components/InfoAcademic'
import {HistoryStudent} from '../components/HistoryStudent'
import {Comments} from '../components/Comments'
import {Alert} from '../components/Alerts'
import {screenComment, changeEdit, viewHistory} from '../components/SomethingFunctions'
import {displayAlert} from '../components/Alerts'
import {Popup, displayPopup} from '../components/Alerts'


const StudentInfo = (props) => {

  const [student, setStudent] = useState({})
  const [subjects, setSubjects] = useState([])
  const [record, setRecord] = useState([])
  const [annualComments, setAnnualComments] = useState([])
  const [commits, setCommits] = useState([])
  const [comment, setComment] = useState("")
  const [alert, setAlert] = useState("")
  const [action, setAction] = useState("upgradeAndDegrade")
  const [confirm, setConfirm] = useState(false)
  const [popup, setPopup] = useState({})

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
      setCommits(res.data.comments)
      setRecord(res.data.record)
      setAnnualComments(res.data.annualComments)
    }

  }


  useEffect(() => {
    function loadStudent() {
      const {id} = props.match.params
      request(id)
    }
    loadStudent()
  }, [props])



  //Añade comentario
  async function sendComment(e) {
    e.preventDefault()
    await axios.post('http://localhost:8080/student/Commit/' + student._id, {comment}).catch((err) => {console.log(err)})
    screenComment(false)
    setComment("")
    request(student._id)
  }

  const questionAction = async (value, action) => {
    displayAlert(true)
    if (value === true && action === 'upgradeAndDegrade') {
      setAlert("Estas seguro de graduar a al estudiante?")
      setAction("upgradeAndDegrade")
      setConfirm(true)
    }

    if (value === false && action === 'upgradeAndDegrade') {
      setAlert("Estas seguro de degradar a al estudiante?")
      setAction("upgradeAndDegrade")
      setConfirm(false)
    }

    if (value === true && action === 'delete') {
      setAlert("Estas seguro de eliminar a este estudiante?")
      setAction("delete")
      setConfirm(true)
    }
  }

  //Gradua o degrada al estudiante
  async function upgradeAndDegrade(value) {
    displayAlert(false)
    let gradue = null
    let res = null
    if (value === true) {
      res = await axios.put('http://localhost:8080/student/Upgrade', [student._id])
      gradue = true
    } else {
      res = await axios.put('http://localhost:8080/student/Degrade', [student._id])
      gradue = false
    }
    if (res.status === 200 && gradue === true) {
      setPopup({text: 'Estudiante Graduado', type: 'pass'})
      displayPopup('received', '.popupStudentInfo')
      console.log('compa graduado')
      request(student._id)
    }

    if (res.status === 200 && gradue === false) {
      setPopup({text: 'Estudiante Degradado', type: 'error'})
      displayPopup('received', '.popupStudentInfo')
      console.log('compa degradado')
      request(student._id)
    }
  }

  //Borra al estudiante
  async function deleteStudent(value) {
    if (value === true) {
      const res = await axios.post('http://localhost:8080/student/Delete', [student._id])
      if (res.status === 200) {
        displayAlert(false)
        props.history.push('/Students/')
      }
    } else {
      displayAlert(false)
    }
  }

  return (
    <div>
      <Popup popup={popup} zone={'popupStudentInfo'} />
      <Alert alert={alert} upgradeAndDegrade={upgradeAndDegrade} deleteStudent={deleteStudent} nameActions={action} confirm={confirm} />
      <h2 style={{textAlign: 'center'}}>Informacion del Estudiante</h2>

      <div className="container-student view-information">
        <div className="buttons-container" style={{width: '100%', display: 'inline-flex', justifyContent: 'space-around', flexFlow:'wrap',marginBottom: '15px'}}>
          <button className="btn" type="button" onClick={(e) => {questionAction(false, 'upgradeAndDegrade'); setAction("upgradeAndDegrade")}}>Degradar</button>
          <button className="btn" type="button" onClick={(e) => {changeEdit(true)}}>Editar</button>
          <button className="btn" type="button" onClick={(e) => {questionAction(true, 'delete'); setAction("delete")}}>Eliminar</button>
          <button className="btn" type="button" onClick={(e) => {viewHistory(true)}}>Historial</button>
          <button className="btn" type="button" onClick={(e) => {questionAction(true, 'upgradeAndDegrade'); setAction("upgradeAndDegrade")}}>Graduar</button>
        </div>

        <InfoBasic student={student} />
        <InfoAcademic information={subjects} />

        <div className="time-edit">
          <p>Fecha de modificacion ultima vez: {student.last_modify}</p>
        </div>


        <Comments comments={commits} actions={request} studentInfo={true} id={student._id} />

        <div className="screen-back" onClick={(e) => {screenComment(false)}}>
        </div>
        <form onSubmit={sendComment}>
          <div className="screen-comment">

            <h3>Escribe tu comentario</h3>
            <textarea className="input-comment" onChange={(e) => {setComment(e.target.value)}} value={comment}></textarea>
            <div>
              <button className="button-comment" type="submit">Enviar Comentario</button>
              <button className="button-comment" type="button" onClick={(e) => {screenComment(false)}}>Regresar</button>
            </div>

          </div>
        </form>
        <button className="button-comment" type="button" onClick={(e) => {screenComment(true)}}>Comentar</button>



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

      <HistoryStudent record={record} annualComments={annualComments} />

    </div>


  )

}

export default StudentInfo
