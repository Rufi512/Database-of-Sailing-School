import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ModalActionList from "../components/ModalActionList";
import { useNavigate } from "react-router-dom";
import "../static/styles/section.css";
const Section = (props) => {
  const [section, setSection] = useState({
    students: [{ ci: "dsfsdf", firstname: "sfsdfs", lastname: "dsfsdfsd" }],
    subjects: [
      { name: "dsfdsf", id: "dfsfds" },
      { name: "retrueuudisdf", id: "dfsfds" },
      { name: "iuowiuoirwoyh", id: "dfsfds" },
    ],
  });
  const [showSubjects, setShowSubjects] = useState(false);
  const [editSection, setEditSection] = useState(false);
  const [showAddSubjects, setShowAddSubjects] = useState(false);
  let navigate = useNavigate();
  let dt = new Date();
  const sendForm = async (e) => {
    e.preventDefault();
    console.log("send");
  };

  useEffect(
    (props) => {
      console.log(props);
    },
    [props]
  );

  return (
    <>
      <Navbar actualPage={"sections"} />
      <div className="container-body container-section">
        <ModalActionList show={showAddSubjects} list={section.subjects}/>
        <div className="card card-container">
          <div className="card-header">
            <h2>Nombre de la seccion</h2>
            <p>
              <strong>Periodo:</strong> 2019-2020
            </p>
            <p>
              <strong>Año actual:</strong> 3
            </p>
            <p>
              <strong>Materias registadas:</strong> 3
            </p>
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
              <button className="btn btn-primary">
                Añadir materias correspondiente al año escolar
              </button>
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
                    step="1"
                  />
                  <input
                    className="form-control"
                    type="number"
                    min={dt.getFullYear().toString()}
                    step="1"
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
                  min={1}
                  max={5}
                  className="form-control"
                  id="year"
                  placeholder="Introducir el año escolar de la seccion"
                />
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
                <table className="table">
                  <thead className="thead">
                    <tr>
                      <th scope="col">Materia</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="table-body-select">
                    {section.subjects.map((el, i) => (
                      <tr key={i}>
                        <td>{el.name}</td>
                        <td>
                          <button className="btn btn-danger">Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="container-buttons-section">
                  <button
                    className="btn btn-primary"
                    style={{ margin: "5px 0" }}
                    onClick={(e) => {
                      setShowAddSubjects(true);
                    }}
                  >
                    Añadir materia a la seccion
                  </button>
                  <button
                    className="btn btn-warning"
                    style={{ margin: "5px 0" }}
                  >
                    Aplicar materias
                  </button>
                </div>

                <small className="form-text text-muted">
                  Para modificar las materias es necesario ir al panel
                  administrativo
                </small>
              </>
            ) : (
              <h2>No hay materias actualmente registradas</h2>
            )}
          </div>
          {section.students.length > 0 ? (
            <div className="container-table table-students">
              <h4>Informacion academica de la seccion actual</h4>
              <table className="table">
                <thead className="thead">
                  <tr>
                    <th scope="col">Cedula</th>
                    <th scope="col">Nombre y Apellido</th>
                    <th scope="col">Estado</th>
                  </tr>
                </thead>
                <tbody className="table-body-select">
                  {section.students.map((el, i) => (
                    <tr
                      key={i}
                      onClick={(e) => {
                        navigate("/student/info/dsfsfsfwe");
                      }}
                    >
                      <th scope="row">{el.ci}</th>
                      <td>{`${el.firstname} ${el.lastname}`}</td>
                      <td>{`${el.status ? "Activo" : "Inactivo"}`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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