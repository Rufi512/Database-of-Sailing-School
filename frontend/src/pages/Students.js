import React, { useState, useEffect } from "react";
import { studentsList, gradeStudent, deleteStudents } from "../API";
import arrow from "../static/icons/arrow.svg";
import { Navbar } from "../components/Navbar";
import { Popup, displayPopup } from "../components/Alerts";
import { Alert, displayAlert } from "../components/Alerts";
import { useNavigate, useLocation } from "react-router-dom";
import '../static/styles/table.css'
const Students = (props) => {
  const [students, setStudents] = useState({docs:[],totalPages:0});
  const [selectStudents, setSelectStudents] = useState([]);
  const [alert, setAlert] = useState("");
  const [error, setError] = useState("");
  const [popup, setPopup] = useState({});
  const [searchParams,setSearchParams] = useState({})
  const [listStudent, setListStudent] = useState("");
  const [action, setAction] = useState("upgradeAndDegrade");
  const [confirm, setConfirm] = useState(false);
  const [active, setActive] = useState(false);
  const [pageActual,setPageActual] = useState(1)
  let historyeNavigate()
  let params = useLocation()

  async function request(value) {
    setError("Cargando...");
    setActive(false);
    console.log(params)
    console.log(searchParams)
    //const page = params.search.slice(0,params.search.length - 1) += pageActual
    const result = await studentsList(value,searchParams.limit || searchParams.page ? searchParams : params.search);
    console.log(result)
    if (result.status >= 400 && result.status <= 499) {
      setError(result.data);
      return setStudents({docs:[],hasNextPage:false,hasPrevPage:false})
    }

    if (result.status >= 500) {
      setError("No se pudo establecer la conexión al servidor :(");
      setStudents({docs:[],hasNextPage:false,hasPrevPage:false})
    }

    setStudents(result.data);
  }

  useEffect(() => {
    function loadStudentsActive() {
      request("studentsActive");
      setListStudent("studentsActive");
    }
    loadStudentsActive();
  }, [searchParams]);

  const handleInfo = (id) => {
    history("/student/info/" + id);
  };

  const requestPage = (page) =>{
    if (page){
      setSearchParams({...searchParams, page:pageActual + 1})
      setPageActual(pageActual + 1)
    }else{
      setSearchParams({...searchParams, page:pageActual - 1})
      setPageActual(pageActual - 1)
    }
  }

  const showHiddenSelect = (value) => {
    const select = document.querySelector(".buttons-upgrade-degrade");
    if (value === false) {
      select.style.transition = "all 0s";
      select.style.transform = "translateX(100%)";
    }
    setTimeout(() => {
      select.style.transition = "all 0.5s ease";
    }, 800);
  };

  /*const upgradeAndDegrade = async (upgrade) => {
    showHiddenSelect(false);
    displayAlert(false);
    displayPopup();
    setPopup({ text: "Enviando informacion", type: "request" });
    let ids = [];
    selectStudents.forEach((el) => {
      ids.push(el._id);
    });

    if (upgrade === true && active === true) {
      const result = await gradeStudent("upgrade", ids);

      if(result.status === 200){
        request(listStudent);
        setPopup({ text: result.data, type: "pass" });
      }

      if (result.status >= 400) {
        request(listStudent);
        setPopup({ text: result.data, type: "error" });
      }

      if (result.status >= 500) {
        request(listStudent);
        setPopup({
          text: "Ah ocurrido un error al realizar la acción :(",
          type: "error",
        });
        
      }
      displayPopup("received");

        
    }

    if (upgrade === false && active === true) {
      const result = await gradeStudent("degrade", ids);

      if(result.status === 200){
        request(listStudent);
        setPopup({ text: result.data, type: "pass" });
      }

      if (result.status >= 400) {
        request(listStudent);
        setPopup({ text: result.data, type: "error" });
      }

      if (result.status >= 500) {
        request(listStudent);
        setPopup({
          text: "Ah ocurrido un error al realizar la acción :(",
          type: "error",
        });
      
      }

        displayPopup("received");
      
    }
  };*/

  async function deleteStudent(value) {
    let ids = [];
    selectStudents.forEach((el) => {
      ids.push(el._id);
    });

    if (value === true) {
      const result = await deleteStudents(ids);
      if (result.status === 200) {
        setPopup({ text: "Estudiantes Eliminados", type: "pass" });
        request(listStudent);
      } 

       if (result.status >= 400) {
        setPopup({ text: result.data, type: "error" });
        request(listStudent);
      } 

       if (result.status >= 500) {
        setPopup({ text: "Ah ocurrido un error al realizar la acción :(", type: "error" });
        request(listStudent);
      } 

    }
    displayAlert(false);
    showHiddenSelect(false);
    displayPopup("received");
  }

  const questionAction = async (value, nameAction) => {
    if (active === true) {
      displayAlert(true);
    }

    if (value === true && nameAction === "upgradeAndDegrade") {
      setAlert("Estas seguro de aprobar a los estudiantes seleccionados?");
      setAction("upgradeAndDegrade");
      setConfirm(true);
    }

    if (value === false && nameAction === "upgradeAndDegrade") {
      setAlert("Estas seguro de reprobar a los estudiantes seleccionados?");
      setAction("upgradeAndDegrade");
      setConfirm(false);
    }

    if (value === true && nameAction === "delete") {
      setAlert("Estas seguro de eliminar a los estudiantes seleccionados?");
      setAction("delete");
      setConfirm(true);
    }
  };

  function selectedStudent(rows) {
    setSelectStudents(rows);
    if (rows.length === 0) {
      setActive(false);
      document.querySelector(".btn-floating").style.transform = "translateX(100%)";
    } else {
      setActive(true);
      document.querySelector(".btn-floating").style.transform = "translateX(0%)";
    }
  }

  return (
    <div>
      <Navbar active={2} />
      <Popup popup={popup} />
      <Alert
        alert={alert}
        deleteStudent={deleteStudent}
        nameActions={action}
        confirm={confirm}
      />
      <div className="btn-floating buttons-upgrade-degrade">
        <div
          style={{
            display: listStudent === "studentsGradues" ? "none" : "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
          className={`btn ${active ? "btn-confirm" : ""}`}
          onClick={(e) => {
            questionAction(true, "upgradeAndDegrade");
          }}
        >
          <p>Aprobar</p>{" "}
          <img
            className="icons"
            style={{ transform: "rotate(-90deg)" }}
            src={arrow}
            alt="arrow"
          />
        </div>
        <div
          style={{
            display: listStudent === "studentsGradues" ? "none" : "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
          className={`btn ${active ? "btn-cancel" : ""}`}
          onClick={(e) => {
            questionAction(false, "upgradeAndDegrade");
          }}
        >
          <img
            className="icons "
            style={{ transform: "rotate(90deg)" }}
            src={arrow}
            alt="icons"
          />
          <p>Reprobar</p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={(e) => {
            questionAction(true, "delete");
          }}
        >
          Eliminar Estudiantes
        </button>
      </div>

      <div className="options-student">
        <p>Estudiantes actualmente </p>
        <select
          style={{ marginLeft: "5px" }}
          name="students"
          onChange={(e) => {
            request(e.target.value);
            showHiddenSelect(false);
            setListStudent(e.target.value);
          }}
        >
          <option value="studentsActive">Activos</option>
          <option value="studentsInactive">Inactivos</option>
          <option value="studentsGradues">Graduados</option>
        </select>

      </div>
      <div className="search">
        <input type="text" placeholder="Buscar a estudiante por nombre o cedula"/>
      </div>
      <section className={students.docs.length > 0 ? 'table show' : 'table hidden'}>
      {students.docs.length < 1 ? <div className="warning"><p>No hay estudiantes que mostrar</p></div> : ''}
      <div className="header">
        <p><span>Total de estudiantes:</span> {students.totalDocs}</p> 
        <p><span>Fecha de ultima actualizacion:</span> 22 de enero del 2022</p>
        <div>
        <label htmlFor="elements">Elementos a mostrar:</label>
        <select id="elements" onChange={(e)=>{setSearchParams({...searchParams,limit:e.target.value})}}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
          <option value="25">25</option>
          <option value="30">30</option>
          <option value="50">50</option>
        </select></div>
        <div>
        <label htmlFor="page">Ir a pagina:</label>
        <select id="page" onChange={(e)=>{setSearchParams({...searchParams,page:e.target.value})}}>
      
             {Array.from(Array(students.totalPages),(i)=>{
               return <option value={i}>{i}</option>
             })}
           
        </select></div>
      </div>
      <div className="labels">
        <p>Nombre y Apellidos</p>
        <p>Seccion</p>
        <p>Año</p>
        <p>Estado</p>
      </div>
      {students.docs.map((el)=>{
        return(
            <div className="container-list" onClick={(e)=>{history.push(`/student/info/${el._id}`)}} key={el._id}>
              <div className="names">
              <div><span>Nombre y apellido:</span> <p>{el.firstname} {el.lastname}</p></div>
              </div>
              <div className="data"><p><span>Seccion:</span>dfgdfg</p> <p><span>Año:</span>{el.school_year}</p> <p><span>Estado:</span>{el.status ? 'Activo' : 'Inactivo'}</p></div>
               
            </div>
          )
      })}
           <div className="pagination-info">
             <button onClick={(e)=>{ if(students.hasPrevPage) requestPage(false)}} className={`button ${students.hasPrevPage ? 'active' : ''}`}>Pagina Anterior</button>
             <p><span>Pagina:</span> {students.page} {students.totalPages > 1 ? `de ${students.totalPages}` : ''}</p>
              <button onClick={(e)=>{ if(students.hasNextPage) requestPage(true)}}className={`button ${students.hasNextPage ? 'active' : ''}`}>Pagina Siguiente</button> 
           </div> 
      </section>
    </div>
  );
};

export default Students;
