import { Button } from "bootstrap";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../static/styles/form-student.css";
import "../static/styles/student-info.css";
const StudentInfo = () => {
  const [activeForm, setActiveForm] = useState(false);
  const [showChest, setShowChest] = useState(false);
  const [student, setStudent] = useState({
    subjects: [
      { subject: "Matematica", score: [20, 14, 3] },
      { subject: "Fisica", score: [20, 14, 3] },
      { subject: "Quimica", score: [20, 14, 3] },
    ],
  });

  return (
    <>
      <Navbar />
      <div className="container-body container-student">
        <h2>Informacion del estudiante</h2>
        <form className={`form-student-register ${!activeForm ? 'form-student-register-readOnly' : '' }`}>
          <div className="student-information">
            <div className="form-check form-switch">
              <label className="label-separator" htmlFor="activator-edit" style={{ fontSize: "1em" }}>
                {" "}
                Editar estudiante
              </label>{" "}
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="activator-edit"
                onChange={(e) => {
                  setActiveForm(e.target.checked);
                }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: "10px" }}>
              <label for="ci">Cedula del estudiante</label>
              {activeForm ? (
                <input
                  type="text"
                  className="form-control"
                  id="ci"
                  placeholder="Introduce tu cedula"
                />
              ) : (
                <p>24.666.444</p>
              )}
            </div>
            <div className="row" style={{ marginBottom: "10px" }}>
              <div className="form-group col-md-6">
                <label className="font-weight-bold" for="inputEmail4">
                  Nombre del estudiante
                </label>
                {activeForm ? (
                  <input
                    type="text"
                    className="form-control"
                    id="firstname"
                    placeholder="firstname"
                  />
                ) : (
                  <p>Pepe Jaramillo Matias Fernandez</p>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputPassword4">Apellido del estudiante</label>
                {activeForm ? (
                  <input
                    type="text"
                    className="form-control"
                    id="lastname"
                    placeholder="lastname"
                  />
                ) : (
                  <p style={{ marginBottom: "5px" }}>Matias Fernandez</p>
                )}
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-6">
                <label className="font-weight-bold" htmlFor="inputEmail4">
                  Seccion Actual
                </label>
                {activeForm ? (
                  <input
                    type="text"
                    className="form-control"
                    id="firstname"
                    placeholder="firstname"
                  />
                ) : (
                  <p>Quinto-B</p>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputPassword4">Estado del estudiante</label>
                {activeForm ? (
                  <input
                    type="text"
                    className="form-control"
                    id="lastname"
                    placeholder="lastname"
                  />
                ) : (
                  <p>Activo</p>
                )}
              </div>
            </div>
          </div>
          <div className="student-record-actual">
            <h4>Informacion academica de la seccion actual</h4>
            <table className="table">
              <thead className="thead">
                <tr>
                  <th scope="col">Materia</th>
                  <th scope="col">Lapso 1</th>
                  <th scope="col">Lapso 2</th>
                  <th scope="col">Lapso 3</th>
                </tr>
              </thead>
              <tbody>
                {student.subjects.map((el, i) => (
                  <tr key={i}>
                    <th scope="row">{el.subject}</th>
                    <td>{el.score[0]}</td>
                    <td>{el.score[1]}</td>
                    <td>{el.score[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {activeForm ? (
            ""
          ) : (
            <div className="form-check form-switch">
              <label className="label-separator" style={{ fontSize: "1em" }}>
                {" "}
                Visualizar secciones cursadas
              </label>{" "}
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                onChange={(e) => {
                  setShowChest(e.target.checked);
                }}
              />
            </div>
          )}
          <div
            className={`container-chest ${
              showChest && activeForm === false ? "container-chest-active" : ""
            }`}
          >
            <div className="container-section">
              <h4>Seccion 5-B - periodo: 2021-2022</h4>
              <table className="table">
                <thead className="thead">
                  <tr>
                    <th scope="col">Materia</th>
                    <th scope="col">Lapso 1</th>
                    <th scope="col">Lapso 2</th>
                    <th scope="col">Lapso 3</th>
                  </tr>
                </thead>
                <tbody>
                  {student.subjects.map((el, i) => (
                    <tr key={i}>
                      <th scope="row">{el.subject}</th>
                      <td>{el.score[0]}</td>
                      <td>{el.score[1]}</td>
                      <td>{el.score[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="student-contact">
            <h4>Datos de contacto de estudiante</h4>

            <div className="row" style={{ marginBottom: "10px" }}>
              <div className="form-group col-md-6">
                <label className="font-weight-bold" htmlFor="inputEmail4">
                  Direccion del estudiante
                </label>
                {activeForm ? (
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    placeholder="Introduce la direccion del estudiante"
                  />
                ) : (
                  <p>
                    Avenida Ampies por la calle monzon del edificio marinubana
                  </p>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputPassword4">
                  Segunda direccion del estudiante
                </label>
                {activeForm ? (
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    placeholder="Introduce el correo del estudiante"
                  />
                ) : (
                  <p style={{ marginBottom: "5px" }}>
                    Edificio metro marinubana
                  </p>
                )}
              </div>
            </div>
            <div className="row" style={{ marginBottom: "10px" }}>
              <div className="form-group col-md-6">
                <label className="font-weight-bold" for="inputEmail4">
                  Numero telefonico del estudiante
                </label>
                {activeForm ? (
                  <input
                    type="text"
                    className="form-control"
                    id="phone-number"
                    placeholder="Introduce el numero telefonico"
                  />
                ) : (
                  <p>0212-4567890</p>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputPassword4">Correo del estudiante</label>
                {activeForm ? (
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    placeholder="Introduce el correo del estudiante"
                  />
                ) : (
                  <p style={{ marginBottom: "5px" }}>Email@email.com</p>
                )}
              </div>
            </div>
          </div>

          <div className="student-contact">
            <h4>Informacion del representante</h4>

            <div className="row" style={{ marginBottom: "10px" }}>
              <div className="form-group" style={{ marginBottom: "10px" }}>
                <label for="ci">Cedula del estudiante</label>

                <p>24.666.444</p>
              </div>
              <div className="form-group col-md-6">
                <label className="font-weight-bold" htmlFor="inputEmail4">
                  Nombre del representante
                </label>

                <p>Suoiusoiasakbndsada</p>
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputPassword4">
                  Apellido del representante
                </label>

                <p style={{ marginBottom: "5px" }}>
                  {" "}
                  loremsadashduiwquidhuihsdakjhskjadhjkashkjd{" "}
                </p>
              </div>
            </div>

            <div className="row" style={{ marginBottom: "10px" }}>
              <div className="form-group col-md-6">
                <label className="font-weight-bold" htmlFor="inputEmail4">
                  Direccion del representante
                </label>

                <p>
                  Avenida Ampies por la calle monzon del edificio marinubana
                </p>
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputPassword4">
                  Segunda direccion del representante
                </label>

                <p style={{ marginBottom: "5px" }}>Edificio metro marinubana</p>
              </div>
            </div>
            <div className="row" style={{ marginBottom: "10px" }}>
              <div className="form-group col-md-6">
                <label className="font-weight-bold" for="inputEmail4">
                  Numero telefonico del representante
                </label>

                <p>0212-4567890</p>
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputPassword4">Correo del representante</label>

                <p style={{ marginBottom: "5px" }}>Email@email.com</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default StudentInfo;