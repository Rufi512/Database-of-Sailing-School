import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../../static/styles/form-student.css";
import "../../static/styles/student-info.css";
import { fieldTest } from "../../components/SomethingFunctions";
import { toast } from "react-toastify";
import Select from "react-select";
import AcademicBulletin from "../../components/AcademicBulletin";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  codesPhones,
  repsList,
  detailStudent,
  repDetail,
  updateStudent,
  chestStudent,
  updateScore,
} from "../../API";

const StudentInfo = () => {
  const timerRef = useRef(null);
  let navigate = useNavigate();
  const [activeForm, setActiveForm] = useState(false);
  const [showChest, setShowChest] = useState(false);
  const [chest, setChest] = useState({ data: [] });
  const [loading, isLoading] = useState(true);
  const [avalaibleReps, setAvalaiblesReps] = useState([
    { label: "Sin asignar", value: "" },
  ]);

  const [avalaibleCountries, setAvalaiblesCountries] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);

  const [student, setStudent] = useState({
    ci: "",
    firstname: "",
    lastname: "",
    section: "",
    deleteSection: false,
    graduate: false,
    status: true,
    subjects: [],
    contact: {
      address_1: "",
      address_2: "",
      phone_numbers: [{ number: "", countryCode: "", formatted: "" }],
      emails: [""],
    },
    rep_data: {
      id: "",
      ci: "",
      firstname: "",
      lastname: "",
      contact: {
        address_1: "",
        address_2: "",
        phone_numbers: [{ number: "", countryCode: "", formatted: "" }],
        emails: [""],
      },
    },
  });

  const [data, setData] = useState({
    // For only read
    ci: "",
    firstname: "",
    lastname: "",
    section: "",
    graduate: false,
    status: true,
    subjects: [],
    contact: {
      address_1: "",
      address_2: "",
      phone_numbers: [{ number: "", countryCode: "", formatted: "" }],
      emails: [""],
    },
    rep_data: {
      id: "",
      ci: "",
      firstname: "",
      lastname: "",
      contact: {
        address_1: "",
        address_2: "",
        phone_numbers: [{ number: "", countryCode: "", formatted: "" }],
        emails: [""],
      },
    },
  });

  const [rep, setRep] = useState({
    id: "",
    ci: "",
    firstname: "",
    lastname: "",
    contact: {
      address_1: "",
      address_2: "",
      phone_numbers: [{ number: "", countryCode: "", formatted: "" }],
      emails: [""],
    },
  });

  const params = useParams();

  const generatePDF = async () => {
    const pdf = new jsPDF("portrait", "pt", "a4");
    const data = await html2canvas(document.getElementById("to-pdf"),{allowTaint: true,useCORS: false})
    const img = data.toDataURL("image/png");  
    const imgProperties = pdf.getImageProperties(img);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
    pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Boleta informativa - ${student.ci} - ${student.firstname} ${student.lastname}.pdf`);
  };

  const index = avalaibleCountries.findIndex((object) => {
    if (student.contact.phone_numbers[0]) {
      return object.value === student.contact.phone_numbers[0].countryCode;
    }
    return "";
  });

  const indexRep = avalaibleReps.findIndex((object) => {
    return object.value === rep.id;
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
    const toastId = toast.loading("Verificando datos...", {
      closeOnClick: true,
    });

    try {
      const res = await updateStudent(params.id, student);
      if (res.status >= 400) {
        setIsSubmit(false);
        return toast.update(toastId, {
          render: res.data.message,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }

      toast.update(toastId, {
        render: "Estudiante Actualizado!",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
      setStudent({ ...student, deleteSection: false });
      setDeleteModal(false);
      setActiveForm(false);
      setIsSubmit(false);
      request();
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
  }

  //Obtain detail rep when is changed in select
  const repGetData = async (id) => {
    if (id === "") {
      return setRep({
        id: "",
        ci: "",
        firstname: "",
        lastname: "",
        contact: {
          address_1: "",
          address_2: "",
          phone_numbers: [{ number: "", countryCode: "" }],
          emails: [""],
        },
      });
    }
    const toastId = toast.loading("Verificando datos...", {
      closeOnClick: true,
    });

    try {
      const res = await repDetail(id);
      if (res.status >= 400) {
        return toast.update(toastId, {
          render: res.data.message,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
      toast.update(toastId, {
        render: "Representante cargado",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      console.log(res.data)
      setStudent({ ...student, rep_data: res.data });
      setRep({ ...res.data, id: res.data._id });
    } catch (e) {
      toast.update(toastId, {
        render: "Error al enviar informacion",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      console.log(e);
    }
  };
  // Request All data student
  const request = useCallback(async () => {
    try {
      isLoading(true);
      //Call all api request
      const [res, reps, codesList, chestInfo] = await Promise.all([
        await detailStudent(params.id),
        await repsList(),
        await codesPhones(),
        await chestStudent(params.id),
      ]);
      //Set default state
      let itemReps = [{ label: "Sin asignar", value: "" }];
      let itemsCountries = [{ label: "Sin Asignar", value: "" }];

      //Assign info codePhones,rep_data, student and chest
      itemsCountries = itemsCountries.concat(codesList);
      setAvalaiblesCountries(itemsCountries);

      if (res.data.student) {
        res.data.student.subjects = res.data.student.subjects.map((el) => {
          return {
            scores: [el.scores[0] || 0, el.scores[1] || 0, el.scores[2] || 0],
            subject: el.subject[0].name || "",
          };
        });
        setSubjects(res.data.student.subjects);
      }

      if (reps.message) {
        toast.error(reps.message);
      } else {
        itemReps = itemReps.concat(reps);
      }
      const rep = res.data.student.representative;
      if (rep) {
        setRep({
          id: rep._id || "",
          ci: rep.ci || "",
          firstname: rep.firstname || "",
          lastname: rep.lastname || "",
          contact: {
            address_1: rep.contact.address_1 || "",
            address_2: rep.contact.address_2 || "",
            phone_numbers: rep.contact.phone_numbers || [
              { number: "", countryCode: "", formatted: "" },
            ],
            emails: rep.contact.emails || [""],
          },
        });
      }
      setAvalaiblesReps(itemReps);
      if (chestInfo.status < 400) {
        setChest(chestInfo.data);
      }

      console.log(res.data.student.representative)

      setStudent({
        ci: res.data.student.ci || "",
        firstname: res.data.student.firstname || "",
        lastname: res.data.student.lastname || "",
        graduate: res.data.student.graduate || false,
        section: res.data.student.section ? res.data.student.section.name : "",
        status: res.data.student.status,
        subjects: res.data.student.subjects || [],
        contact: {
          address_1:
            res.data.student.contact &&
            (res.data.student.contact.address_1 || ""),
          address_2:
            res.data.student.contact &&
            (res.data.student.contact.address_2 || ""),
          phone_numbers:
            res.data.student.contact.phone_numbers.length > 0
              ? res.data.student.contact.phone_numbers
              : [{ number: "", countryCode: "", formatted: "" }],
          emails:
            res.data.student.contact &&
            (res.data.student.contact.emails || [""]),
        },
        rep_data: {
          id:
            res.data.student.representative && res.data.student.representative._id
              ? res.data.student.representative._id
              : "",
          ci: res.data.student.representative && (res.data.student.representative.ci || ""),
          firstname:
            res.data.student.representative &&
            (res.data.student.representative.firstname || ""),
          lastname:
            res.data.student.representative &&
            (res.data.student.representative.lastname || ""),
          contact: {
            address_1:
              res.data.student.representative &&
              (res.data.student.representative.contact.address_1 || ""),
            address_2:
              res.data.student.representative &&
              (res.data.student.representative.contact.address_2 || ""),
            phone_numbers:
              res.data.student.representative &&
              (res.data.student.representative.contact.phone_numbers || [
                { number: "", countryCode: "", formatted: "" },
              ]),
            emails:
              res.data.student.representative &&
              (res.data.student.representative.contact.emails || [""]),
          },
        },
      });
      // Set Data for only read
      setData({
        ci: res.data.student.ci || "",
        firstname: res.data.student.firstname || "",
        lastname: res.data.student.lastname || "",
        graduate: res.data.student.graduate || false,
        section: res.data.student.section ? res.data.student.section.name : "",
        status: res.data.student.status,
        subjects: res.data.student.subjects || [],
        contact: {
          address_1:
            res.data.student.contact &&
            (res.data.student.contact.address_1 || ""),
          address_2:
            res.data.student.contact &&
            (res.data.student.contact.address_2 || ""),
          phone_numbers:
            res.data.student.contact.phone_numbers.length > 0
              ? res.data.student.contact.phone_numbers
              : [{ number: "", countryCode: "", formatted: "" }],
          emails:
            res.data.student.contact &&
            (res.data.student.contact.emails || [""]),
        },
        rep_data: {
          id:
            res.data.student.rep_data && res.data.student.rep_data._id
              ? res.data.student.rep_data._id
              : "",
          ci:
            res.data.student.rep_data && res.data.student.rep_data.ci
              ? res.data.student.rep_data.ci
              : "",
          firstname:
            res.data.student.rep_data && res.data.student.rep_data.firstname
              ? res.data.student.rep_data.firstname
              : "",
          lastname:
            res.data.student.rep_data && res.data.student.rep_data.lastname
              ? res.data.student.rep_data.lastname
              : "",
          contact: {
            address_1:
              res.data.student.rep_data &&
              res.data.student.rep_data.contact &&
              res.data.student.rep_data.contact.address_1
                ? res.data.student.rep_data.contact.address_1
                : "",
            address_2:
              res.data.student.rep_data &&
              res.data.student.rep_data.contact &&
              res.data.student.rep_data.contact.address_2
                ? res.data.student.rep_data.contact.address_2
                : "",
            phone_numbers:
              res.data.student.rep_data &&
              res.data.student.rep_data.contact &&
              res.data.student.rep_data.contact.phone_numbers
                ? res.data.student.rep_data.contact.phone_numbers
                : [{ number: "", countryCode: "", formatted: "" }],
            emails:
              res.data.student.rep_data &&
              res.data.student.rep_data.contact &&
              res.data.student.rep_data.contact.emails
                ? res.data.student.rep_data.contact.emails
                : [""],
          },
        },
      });

      isLoading(false);
      if (res.status >= 400)
        return toast.error(res.data.message, { autoClose: false });
    } catch (e) {
      console.log(e);
      toast.error("Error al requeridr información, reitentando...", {
        autoClose: 3000,
      });
      timerRef.current = setTimeout(() => {
        request();
      }, 3000);
    }
  }, [params]);
  //Update score from student
  const updateStudentScore = async () => {
    const toastId = toast.loading("Verificando datos...", {
      closeOnClick: true,
    });
    try {
      const scoreFormatted = subjects.map((el) => {
        return el.scores;
      });

      const res = await updateScore({ id: params.id, scores: scoreFormatted });
      if (res.status >= 400) {
        return toast.update(toastId, {
          render: res.data.message,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
      toast.update(toastId, {
        render: "Informacion academica actualizada",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setActiveForm(false);
    } catch (e) {
      toast.error("Algo ha salido mal al enviar la información", {
        autoClose: 3000,
      });
      console.log(e);
    }
  };

  useEffect(() => {
    request();
    return () => clearTimeout(timerRef.current);
  }, [request]);

  return (
    <>
      <Navbar />
      <div
        style={{
          position: "absolute",
          zIndex: -10000000,
          width: "100%",
        }}
      >
        <AcademicBulletin student={data} chest={chest} />
      </div>

      <div
        className="container-body container-detail"
        style={{ overflow: "hidden" }}
      >
        <div
          className={`modal-request-admin ${
            deleteModal ? "modal-request-admin-active" : ""
          }`}
        >
          <div className="container-modal card">
            <h5 className="card-header">Advertencia</h5>
            <div className="card-body">
              <h5 className="card-title">Confirmacion de accion</h5>

              <div>
                <p className="card-text">
                  Estas seguro de borrar al estudiante de la seccion actual?{" "}
                </p>
                <p className="card-text">
                  <span style={{ fontWeight: "bold" }}>Cedula:</span>
                  {data.ci}
                  <br />
                  <span style={{ fontWeight: "bold" }}>
                    Nombre y Apellido:
                  </span>{" "}
                  {`${data.firstname} ${data.lastname}`}
                </p>
                <p className="card-text">
                  De ser asi haga click en confirmar accion
                </p>
              </div>

              <div className="container-buttons">
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Confirmar Accion
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={(e) => {
                    setStudent({ ...student, deleteSection: false });
                    setDeleteModal(false);
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
            <h2>Informacion del estudiante</h2>
          </div>
          <form
            className={`form-student-register ${
              !activeForm ? "form-student-register-readOnly" : ""
            }`}
            onSubmit={handleSubmit}
          >
            <div className="student-information">
              <div className="form-container-switchs">
                {activeForm ? (
                  <div
                    className="form-check form-switch"
                    style={{
                      justifyContent: "flex-end",
                      flexDirection: "row-reverse",
                    }}
                  >
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="graduate-activator"
                      onChange={(e) =>
                        setStudent({ ...student, graduate: e.target.checked })
                      }
                      checked={student.graduate}
                    />
                    <label
                      className="form-check-label label-separator"
                      style={{ fontSize: "1em" }}
                      htmlFor="graduate-activator"
                    >
                      Graduar estudiante
                    </label>
                  </div>
                ) : (
                  <div
                    className="form-check form-switch"
                    style={{
                      justifyContent: "flex-end",
                      flexDirection: "row-reverse",
                    }}
                  >
                    <label
                      className="form-check-label label-separator"
                      style={{ fontSize: "1em", fontWeight: "400" }}
                      htmlFor="graduate-activator"
                    >
                      Actualmente el estudiante esta:{" "}
                      {data.graduate ? <b>graduado</b> : <b>cursando</b>}
                    </label>
                  </div>
                )}

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
                    checked={activeForm}
                  />
                </div>
              </div>

              <div
                className="form-container-switchs"
                style={{
                  justifyContent: "space-between",
                  marginBottom: "25px",
                }}
              >
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={(e) => {
                    generatePDF();
                  }}
                >
                  Descargar información academica
                </button>
                {data.section && activeForm ? (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={(e) => {
                      setStudent({ ...student, deleteSection: true });
                      setDeleteModal(true);
                    }}
                  >
                    Eliminar de la seccion
                  </button>
                ) : (
                  ""
                )}
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
                  <p>{data.ci || "Sin información"}</p>
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
                    <p>{data.firstname || "Sin información"}</p>
                  )}
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="lastname">Apellido del estudiante</label>
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
                    <p style={{ marginBottom: "5px" }}>
                      {data.lastname || "Sin Información"}
                    </p>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="form-group col-md-6">
                  <label className="font-weight-bold" htmlFor="inputEmail4">
                    Seccion Actual
                  </label>
                  <p>{data.section || "No asignado"}</p>
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
                    <p>{data.status ? "Activo" : "Inactivo"}</p>
                  )}
                </div>
              </div>
            </div>
            {student.section && student.subjects.length > 0 ? (
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
                    {subjects.length > 0 ? (
                      subjects.map((el, i) => {
                        if (activeForm) {
                          return (
                            <tr key={i}>
                              <th scope="row">{el.subject}</th>
                              <td>
                                <input
                                  type="number"
                                  step={1}
                                  min={0}
                                  max={20}
                                  onChange={(e) => {
                                    let items = [...subjects];
                                    items[i].scores[0] = Number(e.target.value);
                                    setSubjects(items);
                                  }}
                                  value={subjects[i].scores[0] || 0}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  step={1}
                                  min={0}
                                  max={20}
                                  onChange={(e) => {
                                    let items = [...subjects];
                                    items[i].scores[1] = Number(e.target.value);
                                    setSubjects(items);
                                  }}
                                  value={subjects[i].scores[1] || 0}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  step={1}
                                  min={0}
                                  max={20}
                                  onChange={(e) => {
                                    let items = [...subjects];
                                    items[i].scores[2] = Number(e.target.value);
                                    setSubjects(items);
                                  }}
                                  value={subjects[i].scores[2] || 0}
                                />
                              </td>
                            </tr>
                          );
                        }

                        return <tr key={i}></tr>;
                      })
                    ) : (
                      <></>
                    )}

                    {activeForm === false ? (
                      student.subjects.map((el, i) => {
                        return (
                          <tr key={i}>
                            <th scope="row">{el.subject}</th>
                            <td>{el.scores[0] || "No registrado"}</td>
                            <td>{el.scores[1] || "No registrado"}</td>
                            <td>{el.scores[2] || "No registrado"}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </tbody>
                </table>
                {activeForm && student.subjects.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      padding: "10px 0",
                    }}
                  >
                    <button
                      className="btn btn-primary"
                      onClick={(e) => {
                        updateStudentScore();
                      }}
                      type="button"
                    >
                      Actualizar
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <div
                className="message-missings"
                style={{ display: activeForm ? "none" : "flex" }}
              >
                <h4>Actualmente el estudiante no tiene materias cursando</h4>
              </div>
            )}

            {activeForm ? (
              ""
            ) : (
              <div className="form-check form-switch">
                <label
                  htmlFor="check-chest"
                  className="label-separator"
                  style={{ fontSize: "1em" }}
                >
                  Visualizar secciones cursadas
                </label>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="check-chest"
                  role="switch"
                  onChange={(e) => {
                    setShowChest(e.target.checked);
                  }}
                  checked={showChest}
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
              {chest.data.length > 0 ? (
                chest.data.map((el, i) => {
                  return (
                    <div
                      className={`container-section border rounded ${
                        el.approved ? "border-primary" : "border-danger"
                      }`}
                      key={i}
                    >
                      <h4>{el.section.name || "Sin información"}</h4>
                      <div className="container-info-header-chest">
                        <p>
                          Año: <b>{el.section.year || "N/A"}</b>
                        </p>{" "}
                        <p>
                          Periodo:{" "}
                          <b>{`${el.period_initial} - ${el.completion_period}`}</b>
                        </p>{" "}
                        <p>
                          Seccion cursada:{" "}
                          <b>{`${el.approved ? "Aprobada" : "Reprobada"}`}</b>
                        </p>
                      </div>
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
                          {el.subjects.map((el, i) => (
                            <tr key={i}>
                              <th scope="row">{el.subject[0].name}</th>
                              <td>{el.scores[0] || "No registrado"}</td>
                              <td>{el.scores[1] || "No registrado"}</td>
                              <td>{el.scores[2] || "No registrado"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })
              ) : (
                <div
                  className="container-section"
                  style={{ padding: 0, border: "none" }}
                >
                  {" "}
                  <h4>No hay infomacion registrada</h4>
                </div>
              )}
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
                      autoComplete="off"
                      placeholder="Introduce la direccion del estudiante"
                      onInput={(e) => {
                        let items = student;
                        items.contact.address_1 = e.target.value;
                        setStudent({ ...student, items });
                      }}
                      value={student.contact.address_1}
                    />
                  ) : (
                    <p>{data.contact.address_1 || "Sin información"}</p>
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
                      autoComplete="off"
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
                      {data.contact.address_2 || "Sin información"}
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
                          defaultValue={avalaibleCountries[index]}
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
                      {data.contact.phone_numbers[0]
                        ? `${
                            data.contact.phone_numbers[0].formatted
                              ? data.contact.phone_numbers[0].formatted
                              : "Sin información"
                          }`
                        : "Sin información"}
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
                      {data.contact.emails[0]
                        ? data.contact.emails[0]
                        : "Sin información"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {student.rep_data ? (
              <div
                className={`student-contact ${
                  !student.rep_data ? "student-contact-hidden" : ""
                }`}
              >
                <h4>Informacion del representante</h4>
                {activeForm ? (
                  <div
                    className="form-group col-md-12"
                    style={{ marginBottom: "10px" }}
                  >
                    <label
                      htmlFor="select-id-rep"
                      style={{ marginBottom: "5px" }}
                    >
                      Elegir representante previamente registrado
                    </label>
                    <Select
                      options={avalaibleReps}
                      isLoading={loading}
                      defaultValue={avalaibleReps[indexRep]}
                      onChange={(e) => {
                        repGetData(e.value);
                      }}
                    />
                  </div>
                ) : (
                  ""
                )}
                <div className="row" style={{ marginBottom: "10px" }}>
                  <div className="form-group" style={{ marginBottom: "10px" }}>
                    <label htmlFor="ci-rep">Cedula del representante</label>
                    <p>{rep.ci || "Sin Informacion"}</p>
                  </div>
                  <div className="form-group col-md-6">
                    <label className="font-weight-bold" htmlFor="inputEmail4">
                      Nombre del representante
                    </label>

                    <p>{rep.firstname || "Sin Informacion"}</p>
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="inputPassword4">
                      Apellido del representante
                    </label>

                    <p style={{ marginBottom: "5px" }}>
                      {rep.lastname || "Sin Informacion"}
                    </p>
                  </div>
                </div>

                <div className="row" style={{ marginBottom: "10px" }}>
                  <div className="form-group col-md-6">
                    <label className="font-weight-bold" htmlFor="inputEmail4">
                      Direccion del representante
                    </label>

                    <p>{rep.contact.address_1 || "Sin Informacion"}</p>
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="inputPassword4">
                      Segunda direccion del representante
                    </label>

                    <p style={{ marginBottom: "5px" }}>
                      {rep.contact.address_2 || "Sin Informacion"}
                    </p>
                  </div>
                </div>
                <div className="row" style={{ marginBottom: "10px" }}>
                  <div className="form-group col-md-6">
                    <label className="font-weight-bold">
                      Numero telefonico del representante
                    </label>

                    <p>
                      {data.rep_data
                        ? `${
                            data.rep_data.contact.phone_numbers[0].formatted
                              ? data.rep_data.contact.phone_numbers[0].formatted
                              : "Sin información"
                          }`
                        : "Sin información"}
                    </p>
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="inputPassword4">
                      Correo del representante
                    </label>

                    <p style={{ marginBottom: "5px" }}>
                      {rep.contact.emails[0] || "Sin información"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <h4>Informacion del representante no registrada</h4>
            )}
            <div className="container-buttons p-1" style={{ width: "100%" }}>
              <button
                onClick={(e) => {
                  navigate(-1);
                }}
                type="button"
                className="btn btn-secondary"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Regresar
              </button>
              {activeForm ? (
                <button type="submit" className="btn btn-primary submit">
                  Modificar Estudiante
                </button>
              ) : (
                ""
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default StudentInfo;