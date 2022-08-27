import React, { useState, useEffect } from "react";
import stampImg from "../static/logos/stamp.jpg";
import stamp2Img from "../static/logos/stamp2.jpg";
import "../static/styles/bulletin/bulletin.css";
const AcademicBulletin = (props) => {
  const [activeForm] = useState(false);
  const [chest, setChest] = useState({ data: [] });
  const [student, setStudent] = useState({
    ci: "",
    firstname: "",
    lastname: "",
    subjects: [],
    last_modify: "",
    status: true,
    graduate: false,
    contact: {
      address_1: "",
      address_2: "",
      phone_numbers: [
        {
          countryCode: "",
          number: "",
        },
      ],
      emails: [""],
    },
    section: {
      name: "",
    },
  });

  useEffect(() => {
    setStudent(props.student);
    setChest(props.chest);
  }, [props]);

  return (
    <div
      className="card bulletin"
      style={{ margin: "auto", width: "90%" }}
      id="to-pdf"
    >
      <div className="card-header">
        <h2 className="card-title">
          Ministerio del Poder Popular para la Educacion
        </h2>
        <h3 className="card-text">Unidad Educativa Colegio Juan Bosco</h3>
        <h3 className="card-text">Boletín Académico Estudiantil</h3>

        <div className="form-container">
          <div className="row" style={{ marginBottom: "10px" }}>
            <div className="form-group col-md-6">
              <label
                className="font-weight-bold text-light bg-dark w-100 rounded p-l-5 p-r-5"
                htmlFor="firstname"
              >
                Nombre del estudiante
              </label>
              <p>{student.firstname || "Sin información"}</p>
            </div>

            <div className="form-group col-md-6">
              <label
                className="font-weight-bold text-light bg-dark w-100 rounded p-l-5 p-r-5"
                htmlFor="lastname"
              >
                Apellido del estudiante
              </label>

              <p style={{ marginBottom: "5px" }}>
                {student.lastname || "Sin Información"}
              </p>
            </div>
          </div>

          <div className="row" style={{ marginBottom: "10px" }}>
            <div className="form-group col-md-6">
              <label
                className="font-weight-bold text-light bg-dark w-100 rounded p-l-5 p-r-5"
                htmlFor="firstname"
              >
                Seccion actualmente cursando
              </label>
              <p>{student.section.name || "Sin información"}</p>
            </div>

            <div className="form-group col-md-6">
              <label
                className="font-weight-bold text-light bg-dark w-100 rounded p-l-5 p-r-5"
                htmlFor="lastname"
              >
                Estado del estudiante
              </label>

              <p style={{ marginBottom: "5px" }}>
                {student.graduate
                  ? "Graduado"
                  : student.status
                  ? "Activo"
                  : "Inactivo"}
              </p>
            </div>
          </div>
        </div>

        {student.section && student.subjects.length > 0 ? (
          <div className="student-record-actual" style={{ margin: "30px 0px" }}>
            <h4 className="card-text center" style={{ textAlign: "center" }}>
              Informacion academica de la seccion actual
            </h4>
            <table className="table">
              <thead className="thead">
                <tr>
                  <th className="bg-primary text-white border" scope="col">
                    Materia
                  </th>
                  <th className="bg-primary text-white border" scope="col">
                    Lapso 1
                  </th>
                  <th className="bg-primary text-white border" scope="col">
                    Lapso 2
                  </th>
                  <th className="bg-primary text-white border" scope="col">
                    Lapso 3
                  </th>
                </tr>
              </thead>
              <tbody style={{ border: "none" }}>
                {activeForm === false ? (
                  student.subjects.map((el, i) => {
                    return (
                      <tr key={i}>
                        <th scope="row" className="border">
                          <p
                            style={{
                              margin: 0,
                              textAlign: "left",
                              textTransform: "capitalize",
                            }}
                          >
                            {el.subject}
                          </p>
                        </th>
                        <td className="border">
                          <p style={{ margin: 0, padding: 0 }}>
                            {el.scores[0] || "No registrado"}
                          </p>
                        </td>
                        <td className="border">
                          <p style={{ margin: 0, padding: 0 }}>
                            {el.scores[1] || "No registrado"}
                          </p>
                        </td>
                        <td className="border">
                          <p style={{ margin: 0, padding: 0 }}>
                            {el.scores[2] || "No registrado"}
                          </p>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <></>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          ""
        )}

        <div
          className={`container-chest container-chest-active`}
          style={{ marginTop: "30px" }}
        >
          {chest.data.length > 0 ? (
            <>
              <h3 className="card-text">Secciones del estudiante cursadas</h3>
              {chest.data.map((el, i) => {
                return (
                  <div
                    className={`container-section border rounded ${
                      el.approved ? "border-primary" : "border-danger"
                    }`}
                    key={i}
                  >
                    <h4
                      className="bg-primary text-white border"
                      style={{ padding: "5px" }}
                    >
                      {el.section.name || "Sin información"}
                    </h4>
                    <div
                      className="container-info-header-chest"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "5px",
                      }}
                    >
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
                            <td>
                              {Math.round(
                                (el.scores[0] + el.scores[1] + el.scores[2]) / 3
                              ) || "0"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </>
          ) : (
            <></>
          )}
        </div>

        <div className="d-flex justify-content-between">
          <div className="d-flex flex-column justify-content-center align-items-center">
            <h4>Sello del plantel</h4>
            <img style={{ height: "120px" }} src={stampImg} alt="stamp" />
          </div>

          <div className="d-flex flex-column justify-content-center align-items-center">
            <h4>Firma del Director</h4>
            <img style={{ height: "120px" }} src={stampImg} alt="stampImg" />
          </div>

          <div className="d-flex flex-column justify-content-center align-items-center">
            <h4>Firma de la Coordinadora</h4>
            <img style={{ height: "111px" }} src={stamp2Img} alt="stamp2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicBulletin;