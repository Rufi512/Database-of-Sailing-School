import { Button } from "bootstrap";
import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import "../../static/styles/form-student.css";
import "../../static/styles/student-info.css";
import { fieldTest } from "../../components/SomethingFunctions";
import { toast } from "react-toastify";
import Select from "react-select";
import { sectionList, codesPhones, repsList, registerStudent } from "../../API";
const StudentInfo = () => {
  const [activeForm, setActiveForm] = useState(false);
  const [showChest, setShowChest] = useState(false);
  const [OptStudent, setOptStudent] = useState(false);
  const [OptRep, setOptRep] = useState(false);
  const [loading, isLoading] = useState(true);
  const [idRep, setIdRep] = useState("none");
  const [avalaibleSections, setAvalaiblesSections] = useState([
    { label: "Sin Asignar", value: "" },
  ]);
  const [avalaibleReps, setAvalaiblesReps] = useState([
    { label: "Sin asignar", value: "" },
  ]);
  const [avalaibleCountries, setAvalaiblesCountries] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [subjects, setSubjects] = useState([
    { subject: "Matematica", score: [20, 14, 3] },
    { subject: "Fisica", score: [20, 14, 3] },
    { subject: "Quimica", score: [20, 14, 3] },
  ]);
  console.log(subjects)
  const [student, setStudent] = useState({
    ci: "8541235",
    firstname: "Perez Peroso",
    lastname: "Jimenez de la sierra",
    section: "Locotron-5D",
    status: true,
    subjects: [
      { subject: "Matematica", score: [20, 14, 3] },
      { subject: "Fisica", score: [20, 14, 3] },
      { subject: "Quimica", score: [20, 14, 3] },
    ],
    contact: {
      address_1: "Avenida pintosalina titoloco",
      address_2: "Frente de los tres platos",
      phone_numbers: [{ number: "3423424234", countryCode: "+58" }],
      emails: ["Esteesunfakeemail@email.com"],
    },
    rep_data: {
      id: "",
      ci: "8745645546",
      firstname: "Vicente del josue",
      lastname: "Naveda riverdiño",
      contact: {
        address_1: "Municipio colina del estado carirubana",
        address_2: "Cabo verde",
        phone_numbers: [{ number: "543543534", countryCode: "+58" }],
        emails: ["dsfsfs@mail.com"],
      },
    },
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (isSubmit) return;
    setIsSubmit(true);
    const { ci, firstname, lastname } = student;
    if (!ci) return toast.error("El campo cedula no puede quedar vacio!");
    if (!Number(ci) || !Number.isInteger(Number(ci)) || Number(ci) < 0)
      return toast.error("Parámetros en Cédula inválidos,solo números!");
    if (!firstname)
      return toast.error("El campo nombre no puede quedar vacio!");
    if (!lastname)
      return toast.error("El campo apellido no puede quedar vacio!");
    const data = Object.assign({}, student);
    if (!OptStudent) delete data.contact;
    if (!OptRep) delete data.rep_data;
    console.log(data);
    const toastId = toast.loading("Verificando datos...", {
      closeOnClick: true,
    });
    try {
      const res = null;
      setIsSubmit(false);
      if (res.status >= 400) {
        return toast.update(toastId, {
          render: res.data.message,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
      toast.update(toastId, {
        render: res.data.message,
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
    } catch (e) {
      setIsSubmit(false);
      toast.update(toastId, {
        render: "Error al enviar informacion",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      console.log(e);
    }

    console.log(data);
  }

  return (
    <>
      <Navbar />
      <div className="container-body container-detail">
        <div className="card card-container">
          <div className="card-header">
            <h2>Informacion del estudiante</h2>
          </div>
          <form
            className={`form-student-register ${
              !activeForm ? "form-student-register-readOnly" : ""
            }`}
          >
            <div className="student-information">
              <div className="form-check form-switch">
                <label
                  className="label-separator"
                  htmlFor="activator-edit"
                  style={{ fontSize: "1em" }}
                >
                  {" "}
                  Editar estudiante
                </label>{" "}
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="activator-edit"
                  onChange={(e) => {
                    setActiveForm(e.target.checked);
                  }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: "10px" }}>
                <label htmlFor="ci">Cedula del estudiante</label>
                {activeForm ? (
                  <input
                    type="text"
                    className="form-control"
                    id="ci"
                    placeholder="Introduce tu cedula"
                    autoComplete="off"
                    onInput={(e) => {
                      if (Number(e.target.value) || e.target.value === "")
                        setStudent({ ...student, ci: e.target.value });
                    }}
                    value={student.ci}
                  />
                ) : (
                  <p>{student.ci}</p>
                )}
              </div>
              <div className="row" style={{ marginBottom: "10px" }}>
                <div className="form-group col-md-6">
                  <label className="font-weight-bold" htmlFor="firstname">
                    Nombre del estudiante
                  </label>
                  {activeForm ? (
                    <input
                      type="text"
                      className="form-control"
                      id="firstname"
                      autoComplete="off"
                      placeholder="Introduce el nombre del estudiante"
                      onInput={(e) => {
                        if (
                          fieldTest("string", e.target.value) ||
                          e.target.value === ""
                        )
                          return setStudent({
                            ...student,
                            firstname: e.target.value,
                          });
                      }}
                      value={student.firstname}
                    />
                  ) : (
                    <p>Pepe Jaramillo Matias Fernandez</p>
                  )}
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="lastname">
                    Apellido del estudiante
                  </label>
                  {activeForm ? (
                    <input
                      type="text"
                      className="form-control"
                      id="lastname"
                      autoComplete="off"
                      placeholder="Introduce el apellido del estudiante"
                      onInput={(e) => {
                        if (
                          fieldTest("string", e.target.value) ||
                          e.target.value === ""
                        )
                          return setStudent({
                            ...student,
                            lastname: e.target.value,
                          });
                      }}
                      value={student.lastname}
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
                  <p>{student.section}</p>
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="inputPassword4">Estado del estudiante</label>
                  {activeForm ? (
                    <div className="row container-input-active">
                      <label
                        className="label-separator"
                        htmlFor="status"
                        style={{ fontSize: "1em" }}
                      >
                        Inactivo/Activo
                      </label>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="status-edit"
                        onChange={(e) => {
                          setStudent({ ...student, status: e.target.checked });
                        }}
                        checked={student.status || false}
                      />
                    </div>
                  ) : (
                    <p>{student.status ? "Activo" : "Inactivo"}</p>
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
                  {activeForm
                    ? subjects.map((el, i) => (
                        <tr key={i}>
                          <th scope="row">{el.subject}</th>
                          <td>
                            <input
                              type="number"
                              step={1}
                              min={1}
                              max={20}
                              onChange={(e)=>{
                                let items = [...subjects]
                                items[i].score[0] = Number(e.target.value)
                                setSubjects(items)
                              }}
                              value={subjects[i].score[0]}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step={1}
                              min={1}
                              max={20}
                              onChange={(e)=>{
                                let items = [...subjects]
                                items[i].score[1] = Number(e.target.value)
                                setSubjects(items)
                              }}
                              value={subjects[i].score[1]}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step={1}
                              min={1}
                              max={20}
                              onChange={(e)=>{
                                let items = [...subjects]
                                items[i].score[2] = Number(e.target.value)
                                setSubjects(items)
                              }}
                              value={subjects[i].score[2]}
                            />
                          </td>
                        </tr>
                      ))
                    : student.subjects.map((el, i) => (
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
                  Visualizar secciones cursadas
                </label>
                <input
                  className="form-check-input"
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
                showChest && activeForm === false
                  ? "container-chest-active"
                  : ""
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
                      onInput={(e) => {
                        let items = student;
                        items.contact.address_1 = e.target.value;
                        setStudent({ ...student, items });
                      }}
                      value={student.contact.address_1}
                    />
                  ) : (
                    <p>{student.contact.address_1}</p>
                  )}
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="address2-student">
                    Segunda direccion del estudiante
                  </label>
                  {activeForm ? (
                    <input
                      type="text"
                      className="form-control"
                      id="address2-student"
                      placeholder="Introduce direccion de referencia del estudiante"
                      onInput={(e) => {
                        let items = student;
                        items.contact.address_2 = e.target.value;
                        setStudent({ ...student, items });
                      }}
                      value={student.contact.address_2}
                    />
                  ) : (
                    <p style={{ marginBottom: "5px" }}>
                      {student.contact.address_2}
                    </p>
                  )}
                </div>
              </div>
              <div className="row" style={{ marginBottom: "10px" }}>
                <div className="form-group col-md-6">
                  <label className="font-weight-bold" htmlFor="inputEmail4">
                    Numero telefonico del estudiante
                  </label>
                  {activeForm ? (
                    <div className="phone-number-field">
                      <div className="container-select-auto">
                        <Select
                          options={avalaibleCountries}
                          isLoading={loading}
                          defaultValue={avalaibleCountries[0]}
                          onChange={(e) => {
                            let items = student;
                            items.contact.phone_numbers[0].countryCode =
                              e.value;
                            setStudent({ ...student, items });
                          }}
                        />
                      </div>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone-number-student"
                        placeholder="Numero telefonico del estudiante"
                        onInput={(e) => {
                          if (
                            fieldTest("number", e.target.value) ||
                            e.target.value === ""
                          ) {
                            let items = student;
                            items.contact.phone_numbers[0].number =
                              e.target.value;
                            setStudent({ ...student, items });
                          }
                        }}
                        value={student.contact.phone_numbers[0].number}
                      />
                    </div>
                  ) : (
                    <p>
                      {student.contact.phone_numbers[0]
                        ? `${student.contact.phone_numbers[0].countryCode} ${student.contact.phone_numbers[0].number}`
                        : ""}
                    </p>
                  )}
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="email-student">Correo del estudiante</label>
                  {activeForm ? (
                    <input
                      type="email"
                      className="form-control"
                      id="email-student"
                      autoComplete="off"
                      placeholder="Ejemplodedireccion@email.com"
                      onInput={(e) => {
                        let items = student;
                        items.contact.emails[0] = e.target.value;
                        return setStudent({ ...student, items });
                      }}
                      value={student.contact.emails[0]}
                    />
                  ) : (
                    <p style={{ marginBottom: "5px" }}>
                      {student.contact.emails[0]
                        ? student.contact.emails[0]
                        : ""}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div
              className={`student-contact ${
                !student.rep_data ? "student-contact-hidden" : ""
              }`}
            >
              <h4>Informacion del representante</h4>

              <div className="row" style={{ marginBottom: "10px" }}>
                <div className="form-group" style={{ marginBottom: "10px" }}>
                  <label htmlFor="ci-rep">Cedula del representante</label>
                  <p>{student.rep_data.ci || "Sin Informacion"}</p>
                </div>
                <div className="form-group col-md-6">
                  <label className="font-weight-bold" htmlFor="inputEmail4">
                    Nombre del representante
                  </label>

                  <p>{student.rep_data.firstname || "Sin Informacion"}</p>
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="inputPassword4">
                    Apellido del representante
                  </label>

                  <p style={{ marginBottom: "5px" }}>
                    {student.rep_data.lastname || "Sin Informacion"}
                  </p>
                </div>
              </div>

              <div className="row" style={{ marginBottom: "10px" }}>
                <div className="form-group col-md-6">
                  <label className="font-weight-bold" htmlFor="inputEmail4">
                    Direccion del representante
                  </label>

                  <p>
                    {student.rep_data.contact.address_1 || "Sin Informacion"}
                  </p>
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="inputPassword4">
                    Segunda direccion del representante
                  </label>

                  <p style={{ marginBottom: "5px" }}>
                    {student.rep_data.contact.address_2 || "Sin Informacion"}
                  </p>
                </div>
              </div>
              <div className="row" style={{ marginBottom: "10px" }}>
                <div className="form-group col-md-6">
                  <label className="font-weight-bold">
                    Numero telefonico del representante
                  </label>

                  <p>
                    {student.rep_data.contact.phone_numbers[0]
                      ? `${student.rep_data.contact.phone_numbers[0].countryCode} ${student.rep_data.contact.phone_numbers[0].number}`
                      : "Sin informacion"}
                  </p>
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="inputPassword4">
                    Correo del representante
                  </label>

                  <p style={{ marginBottom: "5px" }}>
                    {student.rep_data.contact.emails[0] || ""}
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default StudentInfo;