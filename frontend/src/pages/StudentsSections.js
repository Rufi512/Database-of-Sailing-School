import React,{useState,useEffect} from 'react'
import { studentsSection, gradeStudent, deleteStudents } from "../API";
import arrow from "../static/icons/arrow.svg";
import { Navbar } from "../components/Navbar";
import { Popup, displayPopup } from "../components/Alerts";
import { Pagination } from "../components/MaterialTablet";
import { Alert, displayAlert } from "../components/Alerts";
import { useNavigate } from "react-router-dom";

const StudentsSections = (props) =>{

	const [students, setStudents] = useState([]);
	const [selectStudents, setSelectStudents] = useState([]);
  const [alert, setAlert] = useState("");
  const [error, setError] = useState("");
  const [popup, setPopup] = useState({});
  const [listStudent, setListStudent] = useState("");
  const [action, setAction] = useState("upgradeAndDegrade");
  const [confirm, setConfirm] = useState(false);
  const [active, setActive] = useState(false);
  let history = useNavigate()
      
    async function request(value) {
    setError("Cargando...");
    setActive(false);
    const result = await studentsSection(value);

    if (result.status >= 400 && result.status <= 499) {
      setError(result.data);
      return setStudents();
    }

    if (result.status >= 500) {
      setError("No se pudo establecer la conexión al servidor :(");
      return setStudents();
    }

    setStudents(result.data);
  }

  useEffect(() => {
    function loadSection() {
      //request(props.match.params.section);
      //setListStudent(props.match.params.section);
    }
    loadSection();
  }, [props]);

  const handleInfo = (id) => {
    history.push("/student/info/" + id);
  };

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

  const upgradeAndDegrade = async (upgrade) => {
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
  };

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
      <Navbar />
      <Popup popup={popup} />
      <Alert
        alert={alert}
        upgradeAndDegrade={upgradeAndDegrade}
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

    </div>
  );

}




export default StudentsSections
