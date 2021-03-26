import React, { useState, useEffect } from "react";
import { academicInformation } from "../API";
import { Formik, Form, Field, FieldArray } from "formik";
import { changeView } from "./SomethingFunctions";
import { Popup, displayPopup } from "../components/Alerts";

const FormAcademic = (props) => {
  //Pasamos la informacion como propiedad

  const [data, setData] = useState(props);
  const [statusStudent, setStatus] = useState(props);
  const [popup, setPopup] = useState({});

  useEffect(() => {
    function loadData() {
      setData(props);
      setStatus(props.status);
    }
    loadData();
  }, [props]);

  //Envia la informacion al servidor
  async function handleForm(values) {
    setPopup({ text: "Actualizando informacion...", type: "request" });
    displayPopup("", ".popupFormAcademic");
    const { request } = data;
    const status = statusStudent;
    const { ci, firstName, lastName, subjects } = values;
    const information = { ci, firstName, lastName, subjects, status };
    const result = await academicInformation(data.id, information);
    if (result.status === 200) {
      request(data.id);
      changeView("general");
      setPopup({ text: result.data, type: "pass" });
      displayPopup("received", ".popupFormAcademic");
    }

    if (result.status >= 400) {
      setPopup({ text: result.data, type: "error" });
      displayPopup("error", ".popupFormAcademic");
    }

    if (result.status >= 500) {
      setPopup({ text: "Error al conectar con el servidor :(", type: "error" });
      displayPopup("error", ".popupFormAcademic");
    }
  }

  function statusButton() {
    if (statusStudent === true) {
      setStatus(false);
    } else {
      setStatus(true);
    }
  }

  if (props.school_year === "Graduado") {
    return <div className="container-student edit-information"> </div>;
  } else {
    return (
      <React.Fragment>
        <Popup popup={popup} zone={"popupFormAcademic"} />
        <div className="container-student edit-information">
          <Formik
            //Iniciamos los valores que estan en el estado "data"
            enableReinitialize={true}
            initialValues={{
              ci: data.ci,
              firstName: data.firstName,
              lastName: data.lastName,
              subjects: data.subjects,
            }}
            onSubmit={(values) => {
              handleForm(values);
            }}
          >
            <Form style={{ margin: "auto", width: "100%" }}>
              <div
                className="buttons-container"
                style={{
                  width: "100%",
                  display: "inline-flex",
                  justifyContent: "space-around",
                  marginBottom: "15px",
                }}
              >
                <button
                  className="btn"
                  type="button"
                  onClick={(e) => {
                    changeView("general");
                  }}
                >
                  Regresar
                </button>
                <button className="btn btn-confirm" type="submit">
                  Actualizar
                </button>
              </div>

              <table className="student-general">
                <thead>
                  <tr>
                    <th>Cedula</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Curso</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Field style={{ width: "100px" }} type="text" name="ci" />
                    </td>
                    <td>
                      <Field
                        style={{ width: "110px" }}
                        type="text"
                        name="firstName"
                      />
                    </td>
                    <td>
                      <Field
                        style={{ width: "110px" }}
                        type="text"
                        name="lastName"
                      />
                    </td>
                    <td>{data.school_year}</td>
                    <td>
                      <button type="button" onClick={statusButton}>
                        {statusStudent ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className="student-notes">
                <thead>
                  <tr>
                    <th colSpan="5">Informacion Academica</th>
                  </tr>
                  <tr>
                    <th>Materias</th>
                    <th>Lapso 1</th>
                    <th>Lapso 2</th>
                    <th>Lapso 3</th>
                    <th rowSpan="1">Promedio</th>
                  </tr>
                </thead>
                <tbody>
                  <FieldArray
                    name="subjects"
                    render={(subjects) => (
                      <React.Fragment>
                        {data.subjects.map((subjects, i) => (
                          <tr key={i}>
                            <td>{subjects.name}</td>
                            <td>
                              {" "}
                              <Field
                                style={{ width: "35px" }}
                                type="number"
                                name={`subjects.${i}.score[0]`}
                                min="0"
                                max="20"
                              />{" "}
                            </td>
                            <td>
                              {" "}
                              <Field
                                style={{ width: "35px" }}
                                type="number"
                                name={`subjects.${i}.score[1]`}
                                min="0"
                                max="20"
                              />{" "}
                            </td>
                            <td>
                              {" "}
                              <Field
                                style={{ width: "35px" }}
                                type="number"
                                name={`subjects.${i}.score[2]`}
                                min="0"
                                max="20"
                              />{" "}
                            </td>
                            <td>
                              {Math.round(
                                (subjects.score[0] +
                                  subjects.score[1] +
                                  subjects.score[2]) /
                                  3
                              )}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    )}
                  />
                </tbody>
              </table>
            </Form>
          </Formik>
        </div>
      </React.Fragment>
    );
  }
};

export default FormAcademic;
