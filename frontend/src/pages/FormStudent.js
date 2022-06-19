import React, { useState } from "react";
import { registerStudent, registerStudents } from "../API";
import Navbar from "../components/Navbar";
import { Popup, displayPopup } from "../components/Alerts";
import { checkInputs } from "../components/SomethingFunctions";
import "../static/styles/forms.css";
import "../static/styles/form-student.css";

const FormStudent = () => {
  const [OptStudent, setOptStudent] = useState(false);
  const [OptRep, setOptRep] = useState(false);
  const [csv, setCsv] = useState("");
  const [popup, setPopup] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();
  }

  /*Subida de estudiantes por CSV*/

  async function handleSubmitFile(e) {
    e.preventDefault();
    console.log(e);
  }

  return (
    <React.Fragment>
      <Navbar actualPage={"register-students"} />

      <div className="container-body container-form">
        <h2>Registro de estudiantes</h2>

        <form className="form-student-register" onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: "10px" }}>
            <label htmlFor="ci">Cedula del estudiante</label>
            <input
              type="text"
              className="form-control"
              id="ci"
              placeholder="Introduce tu cedula"
            />
          </div>
          <div className="row" style={{ marginBottom: "10px" }}>
            <div className="form-group col-md-6">
              <label className="font-weight-bold" htmlFor="firstname">
                Nombre del estudiante
              </label>
              <input
                type="text"
                className="form-control"
                id="firstname"
                placeholder="Introduce el nombre del estudiante"
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="lastname-student">Apellido del estudiante</label>
              <input
                type="text"
                className="form-control"
                id="lastname-student"
                placeholder="Introduce el apellido del estudiante"
              />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: "10px" }}>
            <label htmlFor="section-student">Seccion a cursar</label>
            <select id="section-student" className="form-control">
              <option selected>Sin asignar</option>
              <option>...</option>
            </select>
            <small id="section-help" className="form-text text-muted">
              Se puede dejar sin asignar si desea añadirlo despues
            </small>
          </div>
          <div className="form-check form-switch">
            <label className="label-separator" htmlFor="contact-student-check">
              {" "}
              Datos del Estudiante (Opcional)
            </label>{" "}
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="contact-student-check"
              onChange={(e) => {
                setOptStudent(e.target.checked);
              }}
            />
          </div>
          <div
            className={`optional-fields ${
              OptStudent ? "optional-fields-active" : ""
            }`}
          >
            <div className="row" style={{ marginBottom: "10px" }}>
              <div className="form-group col-md-6">
                <label className="font-weight-bold" htmlFor="address-student">
                  Direccion del estudiante
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="address-student"
                  placeholder="Introduce la direccion domiciliaria del estudiante"
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="address2-student">
                  Segunda direccion del estudiante
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="address2-student"
                  placeholder="Introduce direccion de referencia del estudiante"
                />
              </div>
            </div>
            <div className="row" style={{ marginBottom: "10px" }}>
              <div className="form-group col-md-6">
                <label htmlFor="phone-number-student">
                  Numero telefonico del estudiante
                </label>
                <div className="row phone-number-field">
                  <select id="inputState" className="form-control">
                    <option selected>Sin asignar</option>
                    <option>...</option>
                  </select>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone-number-student"
                    placeholder="Numero telefonico del estudiante"
                  />
                </div>
              </div>

              <div className="form-group col-md-6">
                <label htmlFor="email-student">
                  Correo electronico del estudiante
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email-student"
                  placeholder="Ejemplodedireccion@email.com"
                />
              </div>
            </div>
          </div>
          <div className="form-check form-switch">
            <label className="label-separator" htmlFor="rep-check">
              {" "}
              Informacion del representante (Opcional)
            </label>{" "}
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="rep-check"
              onChange={(e) => {
                setOptRep(e.target.checked);
              }}
            />
          </div>
          <div
            className={`optional-fields ${
              OptRep ? "optional-fields-active" : ""
            }`}
          >
            <div className="form-group col-md-12" style={{ marginBottom: "10px" }}>
              <label htmlFor="select-id-rep" style={{ marginBottom: "5px" }}>
                Elegir representante previamente registrado
              </label>
              <select id="select-id-rep" className="form-control">
                <option defaultValue="none" selected>
                  Sin asignar
                </option>
                <option>...</option>
              </select>
            </div>
            <div className="form-row container-rep-disabled">
              <div className="row" style={{ marginBottom: "10px" }}>
                <div className="form-group col-md-6">
                  <label className="font-weight-bold" htmlFor="firstname-rep">
                    Nombre del representante
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstname-rep"
                    placeholder="Introduce el nombre del representante"
                  />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="lastanme-rep">Apellido del representante</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastanme-rep"
                    placeholder="Introduce el apellido del estudiante"
                  />
                </div>
              </div>
              <div className="row" style={{ marginBottom: "10px" }}>
                <div className="form-group col-md-6">
                  <label className="font-weight-bold" htmlFor="ci-rep">
                    Cedula del representante
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="ci-rep"
                    placeholder="Introduce la cedula del representante"
                  />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="address-rep">Direccion del representante</label>
                  <input
                    type="text"
                    className="form-control"
                    id="address-rep"
                    placeholder="Introduce direccion domiciliaria del representante"
                  />
                </div>
              </div>
              <div className="row" style={{ marginBottom: "10px" }}>
                <div className="form-group col-md-6">
                  <label htmlFor="phone-number-rep">
                    Numero telefonico del representante
                  </label>
                  <div className="row phone-number-field">
                    <select id="inputState" className="form-control">
                      <option selected>Sin asignar</option>
                      <option>...</option>
                    </select>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone-number-rep"
                      placeholder="Numero telefonico del representante"
                    />
                  </div>
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="email-rep">
                    Correo electronico del representante
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email-rep"
                    placeholder="Corrreo electronico del representante"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row container-actions">
            <div className="container-input-file">
              <label htmlFor="formFileMultiple" className="form-label">
                Selecciona los archivo(s) de estudiantes a subir
              </label>
              <input
                className="form-control"
                type="file"
                id="formFileMultiple"
                multiple
              />
            </div>
            <div className="container-buttons">
              <button type="button" className="btn btn-warning">
                Subir archivos
              </button>
              <button type="submit" className="btn btn-primary">
                Añadir Estudiante
              </button>
            </div>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
};

export default FormStudent;