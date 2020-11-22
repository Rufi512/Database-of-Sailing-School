import React, { useState, useEffect } from 'react'
import arrow from '../components/resources/icons/arrow.svg'
import axios from 'axios'
import { Pagination } from '../components/MaterialTablet'
import { Alert, displayAlert } from '../components/Alerts'



const Students = (props) => {

    const [students, setStudents] = useState([])
    const [selectStudents, setSelectStudents] = useState([])
    const [alert, setAlert] = useState("")
    const [error, setError] = useState("")
    const [confirm, setConfirm] = useState(false)
    const [active, setActive] = useState(false)

    async function request(value) {
        let connection = true
        setError("Cargando...")
        setActive(false)
        let students = value ? value : 'studentActive'
        if (students === "studentsActive") {
            const res = await axios.get('http://localhost:8080/students/Actives').catch((err) => {

                setError('Hubo un error al conectar con el servidor :( ');
                return connection = false
            })
            if (connection === false) {
                return 0
            }
            if (res.data.length === 0) {
                setError('No se encontraron estudiantes activos')
            }

            setStudents(res.data)

        }

        if (students === "studentsInactive") {

            const res = await axios.get('http://localhost:8080/students/Inactives').catch((err) => {
                setError('Hubo un error al conectar con el servidor :( ')
                return connection = false
            })
            if (connection === false) {
                return 0
            }
            if (res.data.length === 0) {
                setError('No se encontraron estudiantes inactivos')
            }

            setStudents(res.data)
        }

        if (students === "studentsGradues") {
            const res = await axios.get('http://localhost:8080/students/Gradues').catch((err) => {
                setError('Hubo un error al conectar con el servidor :( ')
                return connection = false
            })
            if (connection === false) {
                return 0
            }
            if (res.data.length === 0) {
                setError('No se encontraron estudiantes graduados')
            }
            setStudents(res.data)
        }

    }

    const handleInfo = (id) => {
        console.log(id, props)
        props.history.push('/StudentInfo/' + id);
    }

    const showHiddenSelect = (value) => {
        const select = document.querySelector('.buttons-upgrade-degrade')
        if (value === true) {
            select.style.visibility = 'visible'
        } else {
            select.style.visibility = 'collapse'
        }
    }

    const upgradeAndDegrade = async (upgrade) => {
        displayAlert(false)
        let ids = []
        selectStudents.forEach(el => {
            ids.push(el._id)
        })

        if (upgrade === true && active === true) {
            const res = await axios.put('http://localhost:8080/student/Upgrade', ids)
            if (res.status === 200) {
                await request('studentsActive')
                console.log('Compas Actualizados')
            }
        }
        if (upgrade === false && active === true) {
            const res = await axios.put('http://localhost:8080/student/Degrade', ids)
            if (res.status === 200) {
                await request('studentsActive')
                console.log('Compas Degradados')
            }
        }

    }

    const questionAction = async (value) => {
        if (active === true) {
            displayAlert(true)
        }
        if (value === true) {
            setAlert("Estas seguro de graduar a los estudiantes?")
            setConfirm(true)
        } else {
            setAlert("Estas seguro de degradar a los estudiantes?")
            setConfirm(false)
        }
    }

    useEffect(() => {
        async function loadStudentsActive() {
            await request('studentsActive')
        }
        loadStudentsActive()
    }, [])




    function selectedStudent(rows) {
        setSelectStudents(rows)
        if (rows.length === 0) {
            setActive(false)
        } else {
            setActive(true)
        }
        console.log(rows)
    }


    return (
        <div>
            <Alert alert={alert} actions={upgradeAndDegrade} confirm={confirm} />
            <h1 style={{ textAlign: 'center' }}>Lista de estudiantes</h1>
          <div className="buttons-upgrade-degrade"> <div style={{display: 'flex',flexDirection:'row',alignItems:'center'}} className={`btn ${active ? 'btn-cancel' : ''}`} onClick={e => { questionAction(false) }}><img className="icons " style={{ transform: 'rotate(90deg)' }} src={arrow} alt="icons" /><p>Degradar</p></div>
                <div style={{display: 'flex',flexDirection:'row',alignItems:'center'}} className={`btn ${active ? 'btn-confirm' : ''}`} onClick={e => { questionAction(true) }}><p>Graduar</p> <img className="icons" style={{ transform: 'rotate(-90deg)' }} src={arrow} alt="arrow" /></div></div>
            <section className="tableMaterial">
                <select name="students" onChange={(e) => {
                    request(e.target.value)
                    if (e.target.value === "studentsActive") {
                        showHiddenSelect(true)
                    } else {
                        showHiddenSelect(false)
                    }
                }}>
                    <option value="studentsActive">Activos</option>
                    <option value="studentsInactive">Inactivos</option>
                    <option value="studentsGradues">Graduados</option>
                </select>
                <Pagination students={students} errors={error} selectedStudent={selectedStudent} view={handleInfo} />
            </section>
        </div>
    )

}

export default Students
