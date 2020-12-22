import React, {useState, useEffect} from 'react'
import {studentsList, gradeStudent, deleteStudents} from '../API'
import arrow from '../components/resources/icons/arrow.svg'
import {Navbar} from '../components/Navbar'
import {Popup, displayPopup} from '../components/Alerts'
import {Pagination} from '../components/MaterialTablet'
import {Alert, displayAlert} from '../components/Alerts'



const Students = (props) => {

  const [students, setStudents] = useState([])
  const [selectStudents, setSelectStudents] = useState([])
  const [alert, setAlert] = useState("")
  const [error, setError] = useState("")
  const [popup, setPopup] = useState({})
  const [listStudent, setListStudent] = useState("")
  const [action, setAction] = useState("upgradeAndDegrade")
  const [confirm, setConfirm] = useState(false)
  const [active, setActive] = useState(false)

  async function request(value) {
    setError("Cargando...")
    setActive(false)
    const result = await studentsList(value)

    if (result === false) {
      setError('No se pudo establecer la conexion al servidor :(')
      return setStudents()
    }

    if (result === 'nothingActive') {
      setError('No se encontraron estudiantes activos')
      return setStudents()
    }

    if (result === 'nothingInactive') {
      setError('No se encontraron estudiantes inactivos')
      return setStudents()
    }

    if (result === 'nothingGradues') {
      setError('No se encontraron estudiantes graduados')
      return setStudents()
    }

    setStudents(result)


  }


  useEffect(() => {
    function loadStudentsActive() {
      request('studentsActive')
      setListStudent('studentsActive')
    }
    loadStudentsActive()
  }, [])




  const handleInfo = (id) => {

    props.history.push('/StudentInfo/' + id);
  }


  const showHiddenSelect = (value) => {
    const select = document.querySelector('.buttons-upgrade-degrade')
    if (value === false) {
      select.style.transition = 'all 0s'
      select.style.transform = 'translateX(100%)'
    }
    setTimeout(() => {
      select.style.transition = 'all 0.5s ease'
    }, 800)
  }

  const upgradeAndDegrade = async (upgrade) => {
    showHiddenSelect(false)
    displayAlert(false)
    displayPopup();
    setPopup({text: 'Enviando informacion', type: 'request'})
    let ids = []
    selectStudents.forEach(el => {
      ids.push(el._id)
    })

    if (upgrade === true && active === true) {
      const result = await gradeStudent('upgrade', ids)
      if (result === true) {
        request(listStudent)
        setPopup({text: 'Estudiantes Graduados!', type: 'pass'})
        displayPopup('received')
      } else {
        setPopup({text: 'Ah ocurrido un error al realizar la accion :(', type: 'error'})
        displayPopup('received')
      }

    }
    if (upgrade === false && active === true) {
      const result = await gradeStudent('degrade', ids)
      if (result === true) {
        request(listStudent)
        setPopup({text: 'Estudiantes Degradados!', type: 'error'})
        displayPopup('received')
        request(listStudent)
      } else {
        setPopup({text: 'Ah ocurrido un error al realizar la accion :(', type: 'error'})
        displayPopup('received')
      }
    }

  }

  async function deleteStudent(value) {
    let ids = []
    selectStudents.forEach(el => {
      ids.push(el._id)
    })
    if (value === true) {
      const result = await deleteStudents(ids)
      if(result === true){
       setPopup({text: 'Estudiantes Eliminados', type: 'pass'})
        displayPopup('received')
        request(listStudent)
      }else{
        setPopup({text: 'Ah ocurrido un error al realizar la accion :(', type: 'error'})
        displayPopup('received')
      }
    } 
      displayAlert(false)
    
  }

  const questionAction = async (value, nameAction) => {
    if (active === true) {
      displayAlert(true)
    }

    if (value === true && nameAction === 'upgradeAndDegrade') {
      setAlert("Estas seguro de graduar a los estudiantes seleccionados?")
      setAction("upgradeAndDegrade")
      setConfirm(true)
    }

    if (value === false && nameAction === 'upgradeAndDegrade') {
      setAlert("Estas seguro de degradar a los estudiantes seleccionados?")
      setAction("upgradeAndDegrade")
      setConfirm(false)
    }

    if (value === true && nameAction === 'delete') {
      setAlert("Estas seguro de eliminar a los estudiantes seleccionados?")
      setAction("delete")
      setConfirm(true)
    }

  }


  function selectedStudent(rows) {
    setSelectStudents(rows)
    if (rows.length === 0) {
      setActive(false)
      document.querySelector('.btn-floating').style.transform = 'translateX(100%)'
    } else {
      setActive(true)
      document.querySelector('.btn-floating').style.transform = 'translateX(0%)'
    }

  }


  return (
    <div>
      <Navbar active={2} />
      <Popup popup={popup} />
      <Alert alert={alert} upgradeAndDegrade={upgradeAndDegrade} deleteStudent={deleteStudent} nameActions={action} confirm={confirm} />
      <div className="btn-floating buttons-upgrade-degrade">
        <div style={{display: listStudent === "studentsGradues" ? 'none' : 'flex', flexDirection: 'row', alignItems: 'center'}} className={`btn ${active ? 'btn-confirm' : ''}`} onClick={e => {questionAction(true, 'upgradeAndDegrade')}}><p>Graduar</p> <img className="icons" style={{transform: 'rotate(-90deg)'}} src={arrow} alt="arrow" /></div>
        <div style={{display: listStudent === "studentsGradues" ? 'none' : 'flex', flexDirection: 'row', alignItems: 'center'}} className={`btn ${active ? 'btn-cancel' : ''}`} onClick={e => {questionAction(false, 'upgradeAndDegrade')}}><img className="icons " style={{transform: 'rotate(90deg)'}} src={arrow} alt="icons" /><p>Degradar</p></div>
        <button className="btn btn-secondary" onClick={e => {questionAction(true, "delete")}}>Eliminar Estudiantes</button>
      </div>

      <div className="options-student">
        <p>Estudiantes actualmente </p>
        <select style={{marginLeft: '5px'}} name="students" onChange={(e) => {
          request(e.target.value)
          showHiddenSelect(false)
          setListStudent(e.target.value)

        }}>
          <option value="studentsActive">Activos</option>
          <option value="studentsInactive">Inactivos</option>
          <option value="studentsGradues">Graduados</option>
        </select>
      </div>
      <section className="tableMaterial">
        <Pagination students={students} errors={error} selectedStudent={selectedStudent} view={handleInfo} />
      </section>
    </div>
  )

}

export default Students
