import React, { useState } from "react";
import { registerStudent, registerStudents } from "../API";
import { Navbar } from "../components/Navbar";
import { Popup, displayPopup } from "../components/Alerts";
import { checkInputs } from "../components/SomethingFunctions";
import "../static/styles/forms.css";

const FormStudent = () => {
  const [ci, setCi] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [school_year, setSchool_year] = useState("1-A");
  const [csv, setCsv] = useState("");
  const [popup, setPopup] = useState({});
  const [alertCsv, setAlertCsv] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    displayPopup();
    setPopup({ text: "Enviando información", type: "request" });
    const student = { ci, firstName, lastName, school_year };
    const result = await registerStudent(student);

    if (result.status === 200) {
      setPopup({ text: result.data, type: "pass" });
      displayPopup("received");
    }

    if (result.status >= 400) {
      setPopup({ text: result.data, type: "error" });
      displayPopup("error");
    }

    if (result.status >= 500) {
      setPopup({ text: "Error al conectar con servidor", type: "error" });
      displayPopup("error");
    }
  }

  /*Subida de estudiantes por CSV*/

  async function handleSubmitFile(e) {
    e.preventDefault();
    displayPopup();
    setPopup({ text: "Enviando informacion", type: "request" });
    const file = csv;
    let formData = new FormData();
    formData.append("students", file);

    const result = await registerStudents(formData);
     
     console.log(result)

    if (result.status === 200) {
      setPopup({ text: result.data.message, type: "pass" });
      displayPopup("received");
    }

    if (result.status === 400) {
      let text = "Error en el archivo CSV\n"
      for(const el of result.data.errors){
        text += el + "\n"
      }
      alert(text)
      setPopup({ text: result.data.message, type: "error" });
      displayPopup("error");
    }

    if (result.status >= 500) {
      setPopup({ text: "Error al conectar con servidor", type: "error" });
      displayPopup("error");
    }
  }

  return (
    <React.Fragment>
      <Navbar active={1} />
      <Popup popup={popup} />

      <div className="container-boxs">
        <div className="container">
          <h2>Registro de Estudiante</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-input">
              <input
                type="text"
                id="ci"
                name="ci"
                pattern="[1234567890.-]{1,900}"
                autoComplete="off"
                onChange={(e) => {
                  setCi(e.target.value);
                  checkInputs(e.target.id, e.target.value);
                }}
                required
              />
              <label id="label-ci" className="label-name">
                Cedula del Estudiante
              </label>
            </div>

            <div className="form-input">
              <input
                type="text"
                id="firstName"
                name="firstName"
                pattern="[A-Za-záéíóúñ'´ ]{1,900}"
                autoComplete="off"
                title="Solo Caracteres Alfabéticos!"
                onChange={(e) => {
                  setFirstName(e.target.value);
                  checkInputs(e.target.id, e.target.value);
                }}
                required
              />
              <label id="label-firstName" className="label-name">
                Nombres del Estudiante
              </label>
            </div>

            <div className="form-input">
              <input
                type="text"
                id="lastName"
                name="lastName"
                autoComplete="off"
                pattern="[A-Za-záéíóúñ'´ ]{1,900}"
                title="Solo Caracteres Alfabéticos!"
                onChange={(e) => {
                  setLastName(e.target.value);
                  checkInputs(e.target.id, e.target.value);
                }}
                required
              />
              <label id="label-lastName" className="label-name">
                Apellidos del Estudiante
              </label>
            </div>

            <div className="form-input-select">
              <label htmlFor="anio_actual">Curso Actual:</label>
              <select
                name="school_year"
                id="anio_actual"
                onChange={(e) => setSchool_year(e.target.value)}
                value={school_year}
              >
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

            <div className="buttons-container">
              <button type="submit" className="btn btn-confirm">
                {" "}
                Guardar Estudiante{" "}
              </button>
            </div>
          </form>
        </div>

        <div className="container-csv">
          <form onSubmit={handleSubmitFile}>
            <h2 style={{ textAlign: "center" }}>Enviar archivo CSV</h2>
            <p style={{ textAlign: "center" }}>{alertCsv ? alertCsv : ""}</p>
            <div className="buttons-container">
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                id="labelFile"
                htmlFor="file"
                className="btn btn-secondary"
              >
                {" "}
                Subir CSV{" "}
              </label>

              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".csv"
                onChange={(e) => {
                  setCsv(e.target.files[0]);
                  setAlertCsv("Archivo cargado");
                }}
                name="students"
              />
              <button className="btn btn-confirm"> Enviar </button>
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default FormStudent;
