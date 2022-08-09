import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  sectionDetail,
  subjectsForSection,
  assingSubjectsForSection,
} from "../../API";
import Navbar from "../../components/Navbar";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../static/styles/section.css";
import TableList from "../../components/TableList";
const Section = () => {
  const timerRef = useRef(null);
  const params = useParams();
  //Read only
  const [data, setData] = useState({
    name: "",
    year: 0,
    period_initial: "",
    completion_period: "",
    created_at: "",
    last_modify: "",
    students: [],
    subjects: [],
  });
  //for edit only
  const [section, setSection] = useState({
    name: "",
    year: 0,
    period_initial: "",
    completion_period: "",
    created_at: "",
    last_modify: "",
    students: [],
    subjects: [],
  });

  const [showSubjects, setShowSubjects] = useState(false);
  const [editSection, setEditSection] = useState(false);
  const [showAddSubjects, setShowAddSubjects] = useState(false);
  const [avalaibleSubjects, setAvalaibleSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [defaultSubjects, setDefaultSubjects] = useState(false);
  const [password, setPassword] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [selectedStudentsSection,setSelectedStudentsSection] = useState([])



  let navigate = useNavigate();
  let dt = new Date();
  console.log(data);
  const sendForm = async (e) => {
    e.preventDefault();
    console.log(section);
    console.log("send");
  };

  const selectCheck = (id,isAdded,place) =>{

    let items = [...selectedStudentsSection]
    if(place === "section"){
      items = [...selectedStudentsSection]
    }

    if(isAdded){
      items.push(id)
    }else{
      items = items.filter((el)=> el !== id)
    }
    
    setSelectedStudentsSection(items)    

  }

  console.log(selectedStudentsSection)

  const sendSubjectsChange = async () => {
    if (isSubmit) return;
    setIsSubmit(true);
    const subjects = selectedSubjects.map((el) => el.value);
    const toastId = toast.loading("Consultando datos...", {
      closeOnClick: true,
    });
    try {
      const res = await assingSubjectsForSection(
        params.id,
        subjects,
        defaultSubjects,
        password
      );
      setIsSubmit(false);
      if (res.status >= 400) {
        return toast.update(toastId, {
          render: res.data.message,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
      setModalConfirm(false);
      setDefaultSubjects(false);
      toast.update(toastId, {
        render: res.data.message,
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
      request();
    } catch (e) {
      setIsSubmit(false);
      console.log(e);
      return toast.update(toastId, {
        render: "Ah ocurrido un error al enviar información al servidor",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const listSelect = (props) => {
    console.log("props", props);
    return (
      <Select
        options={props.avalaibleSubjects}
        onChange={props.setSelectedSubjects}
        defaultValue={props.selectedSubjects}
        placeholder="Elige las materias a cursar"
        isMulti
      />
    );
  };

  const request = useCallback(async () => {
    const toastId = toast.loading("Cargando datos...", {
      closeOnClick: true,
    });
    try {
      console.log(params);
      const [sectionData, subjectsListAvalaibles] = await Promise.all([
        sectionDetail(params.id),
        subjectsForSection(params.id),
      ]);

      if (sectionData.status >= 400) {
        return toast.update(toastId, {
          render: sectionData.data.message,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }

      if (subjectsListAvalaibles.status >= 400) {
        return toast.update(toastId, {
          render: subjectsListAvalaibles.data.message,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
      setAvalaibleSubjects(subjectsListAvalaibles.data);

      //Selected all subjects already registered
      const subjectsFinds = subjectsListAvalaibles.data
        .map((elm) => {
          let findSubject = sectionData.subjects.filter(
            (el) => el._id === elm.value
          )[0];
          if (findSubject) return elm;
          return null;
        })
        .filter((el) => el !== null);

      setSelectedSubjects(subjectsFinds);

      setSection(sectionData);
      setData(sectionData);
      setDefaultSubjects(false);

      toast.update(toastId, {
        render: "Datos cargados",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
    } catch (e) {
      toast.update(toastId, {
        render: "Fallo al requerir datos, reintentando",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
     timerRef.current = setTimeout(() => {
        request();
      }, 3000);
      console.log(e);
    }
  }, [params]);

  useEffect(() => {
    request();
  }, [request]);

  return (
    <>
      <Navbar actualPage={"section"} />
      <div className="container-body container-section">
        {/*Confirm Action*/}
        <div
          className={`modal-request-admin ${
            modalConfirm ? "modal-request-admin-active" : ""
          }`}
        >
          <div className="container-modal card">
            <h5 className="card-header">Advertencia</h5>
            <div className="card-body">
              <h5 className="card-title">Confirmacion de accion</h5>

              <div>
                <p className="card-text">
                  Estas seguro de modificar las materias registradas{" "}
                  {defaultSubjects ? "por las materias por defecto" : ""}?{" "}
                </p>

                <p className="card-text">
                  De ser asi introduzca su contraseña y confirma la accion
                </p>
              </div>

              <input
                type="password"
                className="form-control"
                style={{ marginTop: "10px" }}
                id="password-admin"
                placeholder="Introduzca su contraseña"
                onInput={(e) => setPassword(e.target.value)}
                value={password}
                autoComplete="off"
              />
              <div className="container-buttons">
                <button
                  className="btn btn-primary"
                  onClick={(e) => {
                    sendSubjectsChange();
                  }}
                >
                  Confirmar Accion
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={(e) => {
                    setModalConfirm(false);
                    setDefaultSubjects(false);
                  }}
                >
                  Regresar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card card-container">
          <div className="card-header">
            <h2>
              Seccion:{" "}
              <span style={{ color: "#383838" }}>
                {data.name || "Sin información"}
              </span>
            </h2>
            <div className="container-header-data">
              <p>
                <strong>Periodo:</strong>{" "}
                {`${data.period_initial} - ${data.completion_period}`}
              </p>
              <p>
                <strong>Año actual:</strong> {data.year || "Sin información"}
              </p>
              <p>
                <strong>Materias registadas:</strong>{" "}
                {data.subjects.length || "0"}
              </p>
              <p>
                <strong>Fecha de creacion:</strong>{" "}
                {data.created_at || "Sin información"}
              </p>
              <p>
                <strong>Fecha de ultima modificacion:</strong>{" "}
                {data.last_modify || "Sin información"}
              </p>
            </div>
          </div>
          <div className="container-subjects">
            <div className="buttons-container">
              <div className="form-check form-switch">
                <label className="label-separator" htmlFor="subjects-check">
                  {" "}
                  Mostrar materias registradas
                </label>{" "}
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="subjects-check"
                  onChange={(e) => {
                    setShowSubjects(e.target.checked);
                  }}
                />
              </div>
              <div className="form-check form-switch">
                <label className="label-separator" htmlFor="edit-check">
                  {" "}
                  Editar seccion actual
                </label>{" "}
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="edit-check"
                  onChange={(e) => {
                    setEditSection(e.target.checked);
                  }}
                />
              </div>
              <div>
                <button
                  className="btn btn-primary"
                  onClick={(e) => {
                    setModalConfirm(true);
                    setDefaultSubjects(true);
                  }}
                >
                  Añadir materias correspondiente al año escolar
                </button>
              </div>
            </div>
          </div>
          <div
            className={`container-edit ${
              editSection ? "container-edit-show" : ""
            }`}
          >
            <form className="form-section" onSubmit={sendForm}>
              <h3>Datos de la seccion actual</h3>
              <div className="form-group">
                <label htmlFor="name">Nombre de la seccion</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Ingrese el nombre de la seccion"
                  onInput={(e) =>
                    setSection({ ...section, name: e.target.value })
                  }
                  value={section.name}
                />
                <small className="form-text text-muted">
                  Es necesario para identificar la seccion
                </small>
              </div>
              <div className="form-group">
                <label>
                  Indica la fecha de inicio y culminacion de la seccion
                </label>
                <div className="container-input-date">
                  <input
                    className="form-control"
                    type="number"
                    min={dt.getFullYear().toString()}
                    step={1}
                    onInput={(e) =>
                      setSection({ ...section, period_initial: e.target.value })
                    }
                    value={section.period_initial}
                  />
                  <input
                    className="form-control"
                    type="number"
                    min={dt.getFullYear().toString()}
                    step={1}
                    onInput={(e) =>
                      setSection({
                        ...section,
                        completion_period: e.target.value,
                      })
                    }
                    value={section.completion_period}
                  />
                </div>
                <small className="form-text text-muted">
                  Es necesario para llevar seguimiento de la seccion
                </small>
              </div>
              <div className="form-group">
                <label htmlFor="year">Año actual de la seccion</label>
                <input
                  type="number"
                  className="form-control"
                  id="year"
                  step={1}
                  min={1}
                  max={10}
                  placeholder="Especifica el año escolar de la seccion"
                  value={section.year}
                  onInput={(e) => {
                    setSection({
                      ...section,
                      year: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="form-group">
                <label>Materias actualmentes registradas</label>
                {editSection
                  ? listSelect({
                      avalaibleSubjects,
                      selectedSubjects,
                      setSelectedSubjects,
                    })
                  : ""}
                <button
                  style={{
                    marginTop: "10px",
                    marginLeft: "auto",
                    display: "flex",
                  }}
                  className="btn btn-danger"
                  onClick={(e) => {
                    setModalConfirm(true);
                  }}
                >
                  Actualizar lista de materias
                </button>
              </div>
              <button type="submit" className="btn btn-primary">
                Modificar
              </button>
            </form>
          </div>
          <div
            className={`container-subjects-list ${
              showSubjects ? "container-subjects-list-show" : ""
            }`}
          >
            {section.subjects.length > 0 ? (
              <>
                <h4>Materias registradas en esta seccion</h4>
                <TableList
                  data={data.subjects}
                  labels={[{ field: "name", nameField: "Materia" }]}
                />
              </>
            ) : (
              <h2>No hay materias actualmente registradas</h2>
            )}
          </div>
          {data.students.length > 0 ? (
            <div className="container-table table-students">
              <h4>Estudiantes actualmente registrados</h4>
              <TableList
                data={data.students}
                checks={selectedStudentsSection}
                labels={[
                  { field: "ci", nameField: "Cedula" },
                  { field: "firstname", nameField: "Nombre", linked: true },
                  { field: "lastname", nameField: "Apellido" },
                  { field: "status", nameField: "Estado" },
                  { field: "actions", nameField: "Seleccion" },
                ]}
                actions={[{type:"checkbox",name:"select",func:(id,isAdded)=>{selectCheck(id,isAdded,"section")}}]}
              />
            </div>
          ) : (
            <h3 style={{ padding: "20px" }}>
              Actualmente no hay estudiantes registrados en la seccion!
            </h3>
          )}
        </div>
      </div>
    </>
  );
};

export default Section;