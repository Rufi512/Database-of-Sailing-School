import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";
import { sectionList, codesPhones, repsList, registerStudent } from "../../API";
import "../../static/styles/forms.css";
import "../../static/styles/form-student.css";
import Select from "react-select";
import { fieldTest } from "../../components/SomethingFunctions";

const FormStudent = () => {
  const [OptStudent, setOptStudent] = useState(false);
  const [OptRep, setOptRep] = useState(false);
  const [loading, isLoading] = useState(true);
  const [idRep, setIdRep] = useState("none");
  const [avalaibleSections, setAvalaiblesSections] = useState([
    { label: "Sin Asignar", value: "" },
  ]);
  const [avalaibleReps, setAvalaiblesReps] = useState([
    { label: "Sin asignar", value: "" },
    { label: "Registrar representante", value: "custom" },
  ]);
  const [avalaibleCountries, setAvalaiblesCountries] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [student, setStudent] = useState({
    ci: "",
    firstname: "",
    lastname: "",
    section_id: "",
    contact: {
      address_1: "",
      address_2: "",
      phone_numbers: [{ number: "", countryCode: "" }],
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
        phone_numbers: [{ number: "", countryCode: "" }],
        emails: [""],
      },
    },
  });

  useEffect(() => {
    const request = async () => {
      isLoading(true);
      try {
        const sections = await sectionList();
        const codesList = await codesPhones();
        const reps = await repsList();
        let itemsSections = [{ label: "Sin Asignar", value: "" }];
        let itemReps = [
          { label: "Sin asignar", value: "" },
          { label: "Registrar representante", value: "custom" },
        ];
        itemsSections = itemsSections.concat(sections);
        setAvalaiblesSections(itemsSections);
        setAvalaiblesCountries(codesList);
        if (reps.message) {
          toast.error("No hay representantes registrados");
        } else {
          itemReps = itemReps.concat(reps);
        }
        setAvalaiblesReps(itemReps);
        isLoading(false);
        console.log(itemsSections);
      } catch (e) {
        setTimeout(() => {
          request();
        }, 3000);
        console.log(e);
      }
    };
    request();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (isSubmit) return;
    setIsSubmit(true);
    const { ci, firstname, lastname } = student;
    if (!ci) {
      setIsSubmit(false);
      return toast.error("El campo cedula no puede quedar vacio!");
    }
    if (!Number(ci) || !Number.isInteger(Number(ci)) || Number(ci) < 0) {
      setIsSubmit(false);
      return toast.error("Parámetros en Cédula inválidos,solo números!");
    }
    if (!firstname) {
      setIsSubmit(false);
      return toast.error("El campo nombre no puede quedar vacio!");
    }
    if (!lastname) {
      setIsSubmit(false);
      return toast.error("El campo apellido no puede quedar vacio!");
    }
    const data = Object.assign({}, student);
    if (!OptStudent) delete data.contact;
    if (!OptRep) delete data.rep_data;
    const toastId = toast.loading("Verificando datos...", {
      closeOnClick: true,
    });
    try {
      const res = await registerStudent(data);
      setIsSubmit(false);
      if (res.status >= 400) {
        return toast.update(toastId, {
          render: res.data.message,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
      setStudent({
        ci: "",
        firstname: "",
        lastname: "",
        section_id: "",
        contact: {
          address_1: "",
          address_2: "",
          phone_numbers: [{ number: "", countryCode: "" }],
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
            phone_numbers: [{ number: "", countryCode: "" }],
            emails: [""],
          },
        },
      });
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
    <React.Fragment>
      <Navbar actualPage={"register-students"} />

      <div className="container-body container-form">
        <div className="card card-container">
          <div className="card-header">
            <h2>Registro de estudiantes</h2>
          </div>

          <form className="form-student-register" onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: "10px" }}>
              <label htmlFor="ci">Cedula del estudiante</label>
              <input
                type="text"
                className="form-control"
                id="ci"
                placeholder="Introduce la cedula"
                autoComplete="off"
                onInput={(e) => {
                  if (Number(e.target.value) || e.target.value === "")
                    setStudent({ ...student, ci: e.target.value });
                }}
                value={student.ci}
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
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="lastname-student">
                  Apellido del estudiante
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastname-student"
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
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: "10px" }}>
              <label htmlFor="section-student">Seccion a cursar</label>
              <Select
                options={avalaibleSections}
                isLoading={loading}
                defaultValue={avalaibleSections[0]}
                onChange={(e) => {
                  setStudent({ ...student, section_id: e.value });
                }}
              />
              <small id="section-help" className="form-text text-muted">
                Se puede dejar sin asignar si desea añadirlo despues
              </small>
            </div>
            <div className="form-check form-switch">
              <label
                className="label-separator"
                htmlFor="contact-student-check"
              >
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
                    onInput={(e) => {
                      let items = student;
                      items.contact.address_1 = e.target.value;
                      setStudent({ ...student, items });
                    }}
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
                    onInput={(e) => {
                      let items = student;
                      items.contact.address_2 = e.target.value;
                      setStudent({ ...student, items });
                    }}
                  />
                </div>
              </div>
              <div className="row" style={{ marginBottom: "10px" }}>
                <div className="form-group col-md-6">
                  <label htmlFor="phone-number-student">
                    Numero telefonico
                  </label>
                  <div className="phone-number-field">
                    <div className="container-select-auto">
                      <Select
                        options={avalaibleCountries}
                        isLoading={loading}
                        defaultValue={avalaibleCountries[0]}
                        onChange={(e) => {
                          let items = student;
                          items.contact.phone_numbers[0].countryCode = e.value;
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
                </div>

                <div className="form-group col-md-6">
                  <label htmlFor="email-student">Correo electronico</label>
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
                autoComplete="off"
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
              <div
                className="form-group col-md-12"
                style={{ marginBottom: "10px" }}
              >
                <label htmlFor="select-id-rep" style={{ marginBottom: "5px" }}>
                  Elegir representante previamente registrado
                </label>
                <Select
                  options={avalaibleReps}
                  isLoading={loading}
                  defaultValue={avalaibleReps[0]}
                  onChange={(e) => {
                    setIdRep(e.value);
                  }}
                />
              </div>
              <div
                className={`form-row ${
                  idRep === "custom" ? "" : "container-rep-disabled"
                }`}
              >
                <div className="form-group col-md-12">
                  <label className="font-weight-bold" htmlFor="ci-rep">
                    Cedula del representante
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="ci-rep"
                    placeholder="Introduce la cedula del representante"
                    autoComplete="off"
                    onInput={(e) => {
                      return setStudent({
                        ...student,
                        rep_data: { ...student.rep_data, ci: e.target.value },
                      });
                    }}
                    value={student.rep_data.ci}
                  />
                </div>

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
                      autoComplete="off"
                      onInput={(e) => {
                        return setStudent({
                          ...student,
                          rep_data: {
                            ...student.rep_data,
                            firstname: e.target.value,
                          },
                        });
                      }}
                      value={student.rep_data.firstname}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="lastname-rep">
                      Apellido del representante
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastname-rep"
                      placeholder="Introduce el apellido del estudiante"
                      autoComplete="off"
                      onInput={(e) => {
                        return setStudent({
                          ...student,
                          rep_data: {
                            ...student.rep_data,
                            lastname: e.target.value,
                          },
                        });
                      }}
                      value={student.rep_data.lastname}
                    />
                  </div>
                </div>
                <div className="row" style={{ marginBottom: "10px" }}>
                  <div className="form-group col-md-6">
                    <label className="font-weight-bold" htmlFor="address-rep">
                      Direccion del representante
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="address-rep"
                      placeholder="Introduce la direccion domiciliaria del representante"
                      onInput={(e) => {
                        let items = student;
                        items.rep_data.contact.address_1 = e.target.value;
                        setStudent({ ...student, items });
                      }}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="address2-rep">
                      Segunda direccion del representante
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="address2-rep"
                      placeholder="Introduce direccion de referencia del representante"
                      onInput={(e) => {
                        let items = student;
                        items.rep_data.contact.address_2 = e.target.value;
                        setStudent({ ...student, items });
                      }}
                    />
                  </div>
                </div>
                <div className="row" style={{ marginBottom: "10px" }}>
                  <div className="form-group col-md-6">
                    <label htmlFor="phone-number-rep">
                      Numero telefonico del representante
                    </label>
                    <div className="phone-number-field">
                      <div className="container-select-auto">
                        <Select
                          options={avalaibleCountries}
                          isLoading={loading}
                          defaultValue={avalaibleCountries[0]}
                          onChange={(e) => {
                            let items = student;
                            items.rep_data.contact.phone_numbers[0].countryCode =
                              e.value;
                            setStudent({ ...student, items });
                          }}
                        />
                      </div>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone-number-rep"
                        placeholder="Numero telefonico del representante"
                        onInput={(e) => {
                          let items = student;
                          items.rep_data.contact.phone_numbers[0].number =
                            e.target.value;
                          setStudent({ ...student, items });
                        }}
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
                      autoComplete="off"
                      onInput={(e) => {
                        let items = student;
                        items.rep_data.contact.emails[0] = e.target.value;
                        setStudent({ ...student, items });
                      }}
                      value={student.rep_data.contact.emails[0]}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="container-massive-register">
              <h4>Registro de estudiante archivos</h4>
              <div className="row container-actions">
                <div className="container-input-file">
                  <label htmlFor="formFileMultiple" className="form-label">
                    Selecciona los archivo(s) a procesar
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    id="formFileMultiple"
                    multiple
                  />
                </div>
                <div className="container-buttons">
                  <button type="button" className="btn btn-warning" disabled>
                    Subir archivos
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Añadir Estudiante
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default FormStudent;