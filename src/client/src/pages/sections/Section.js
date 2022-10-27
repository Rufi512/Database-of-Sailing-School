import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  sectionDetail,
  subjectsForSection,
  assingSubjectsForSection,
  listStudents,
  updateSection,
  graduateStudentsSection,
  deleteStudentsInSection,
} from "../../API";
import Navbar from "../../components/Navbar";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../static/styles/section.css";
import TableList from "../../components/TableList";
import NavigationOptionsList from "../../components/NavigationOptionsList";
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

  const [modalConfirm, setModalConfirm] = useState(false);
  const [defaultSubjects, setDefaultSubjects] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [newStudentsList, setNewStudentsList] = useState(false);

  const [studentsList, setStudentsList] = useState([]);
  const [newStudents, setNewStudents] = useState([]);
  const [avalaibleSubjects, setAvalaibleSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedStudentsSection, setSelectedStudentsSection] = useState([]);

  //For pagination new students
  const [pageActual, setActualPage] = useState(1);
  const [avalaiblePages, setAvalaiblePages] = useState(0);
  const [limit, setLimit] = useState(15);
  const [searchBar, setSearchBar] = useState("");
  const [queryStudent, setQueryStudent] = useState("activos");

  // Confirmation
  const [addStudents, setAddStudents] = useState(false);
  const [deleteStudents, setDeleteStudents] = useState(false);
  const [customSubjects, setCustomSubjects] = useState(false);
  const [graduateSection, setGraduateSection] = useState(false);
  const [studentsPreview, setStudentsPreview] = useState({
    status: false,
    studentsApproves: [],
    studentsRejects: [],
  });
  const [password, setPassword] = useState("");

  let navigate = useNavigate();

  let dt = new Date();
  const sendForm = async (e) => {
    e.preventDefault();
    if (isSubmit) return;
    setIsSubmit(true);
    const toastId = toast.loading("Enviando datos...", {
      closeOnClick: true,
    });
    try {
      const res = await updateSection({
        id: params.id,
        section: {
          name: section.name,
          year: section.year,
          period_initial: section.period_initial,
          completion_period: section.completion_period,
        },
      });
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
      setAddStudents(false);
      setNewStudents([]);
      toast.update(toastId, {
        render: res.data.message,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      request();
      requestList();
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

  const selectCheck = (student, isAdded, place) => {
    let items;
    if (place === "section") {
      items = [...selectedStudentsSection];
    } else {
      items = [...newStudents];
    }

    if (isAdded) {
      items.push(student);
    } else {
      items = items.filter((el) => el !== student);
    }

    if (place === "section") {
      setSelectedStudentsSection(items);
    } else {
      setNewStudents(items);
    }
  };

  // for graduate students resgistered
  const graduateStudentsRegistered = async (isTest) => {
    const toastId = toast.loading("Consultando datos...", {
      closeOnClick: true,
    });
    try {
      const res = await graduateStudentsSection({
        id: params.id,
        isTest,
        password,
      });

      setIsSubmit(false);

      if (res.status >= 400) {
        return toast.update(toastId, {
          render: res.data.message || "No se ha podido hacer la consulta",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }

      if (isTest === false) {
        toast.update(toastId, {
          render: "Seccion graduada y eliminada",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        return navigate("/sections");
      }


      setStudentsPreview({
        status: true,
        studentsApproves: res.data.studentsApproves,
        studentsRejects: res.data.studentsRejects,
      });
      toast.update(toastId, {
        render: "Lista previa obtenida",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
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

  //Update data general section
  const updateSectionStudents = async () => {
    if (isSubmit) return;
    setIsSubmit(true);
    const toastId = toast.loading("Enviando datos...", {
      closeOnClick: true,
    });
    try {
      const res = await updateSection({
        id: params.id,
        section: { students: newStudents.map((el)=> {return el.id}) },
      });
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
      setAddStudents(false);
      setNewStudents([]);
      toast.update(toastId, {
        render: res.data.message || "Datos actualizados",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      request();
      requestList();
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

  //Delete Students selected from section

  const deleteStudentsSelected = async () => {
    if (isSubmit) return;
    setIsSubmit(true);
    const toastId = toast.loading("Enviando datos...", {
      closeOnClick: true,
    });
    try {
      const res = await deleteStudentsInSection({
        id: params.id,
        students: selectedStudentsSection.map((el)=>{return el._id}),
        password:password
      });
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
      setDeleteStudents(false);
      toast.update(toastId, {
        render: res.data.message || "Datos actualizados",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
      request();
      requestList();
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
    setPassword("");
    const toastId = toast.loading("Cargando datos...", {
      closeOnClick: true,
    });
    try {
      const [sectionData, subjectsListAvalaibles] = await Promise.all([
        sectionDetail(params.id),
        subjectsForSection(params.id),
      ]);

      if (sectionData.status === 404) {
        toast.update(toastId, {
          render: "Seccion no encontrada",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });

        return navigate("/sections");
      }

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
      if (sectionData.data.subjects) {
        const subjectsFinds = subjectsListAvalaibles.data
          .map((elm) => {
            let findSubject = sectionData.data.subjects.filter(
              (el) => el._id === elm.value
            )[0];
            if (findSubject) return elm;
            return null;
          })
          .filter((el) => el !== null);

        setSelectedSubjects(subjectsFinds);
      }

      setSection({
        name: sectionData.data.name || "",
        year: sectionData.data.year || 0,
        period_initial: sectionData.data.period_initial || "",
        completion_period: sectionData.data.completion_period || "",
        created_at: sectionData.data.created_at || "",
        last_modify: sectionData.data.last_modify || "",
        students: sectionData.data.students || [],
        subjects: sectionData.data.subjects || [],
      });

      setData({
        name: sectionData.data.name || "",
        year: sectionData.data.year || 0,
        period_initial: sectionData.data.period_initial || "",
        completion_period: sectionData.data.completion_period || "",
        created_at: sectionData.data.created_at || "",
        last_modify: sectionData.data.last_modify || "",
        students: sectionData.data.students || [],
        subjects: sectionData.data.subjects || [],
      });

      setDefaultSubjects(false);

      toast.update(toastId, {
        render: "Datos cargados",
        type: "success",
        isLoading: false,
        autoClose: 800,
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
  }, [params, navigate]);

  const requestList = useCallback(
    async (search = "") => {
      const toastId = toast.loading("Cargando datos...", {
        closeOnClick: true,
      });
      try {
        const res = await listStudents({
          limit: limit,
          page: pageActual,
          queryStudent: queryStudent,
          search: search,
          section: false,
          add: true,
        });
        //setSearchBar(searchParams.get("search") || "");
        //setStatus(searchParams.get("status") || "activos")
        //console.log(res);

        if (res.status >= 400) {
          return toast.update(toastId, {
            render: res.data.message,
            type: "error",
            isLoading: false,
            autoClose: 5000,
          });
        }
        const students = res.data.docs.map((el) => {
          let { _id, ci, firstname, lastname, status } = el;
          return Object({
            id: _id,
            ci,
            firstname,
            lastname,
            status,
          });
        });
        setAvalaiblePages(res.data.totalPages);
        setStudentsList(students);

        toast.update(toastId, {
          render: "Lista Cargada",
          type: "success",
          isLoading: false,
          autoClose: 800,
        });
      } catch (e) {
        console.log(e);

        toast.update(toastId, {
          render: "Error al enviar informacion, intentando de nuevo",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });

        timerRef.current = setTimeout(() => {
          requestList();
        }, 3000);
      }
    },
    [queryStudent, limit, pageActual]
  );

  useEffect(() => {
    request();
    requestList();
  }, [request, requestList]);

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
                  {addStudents
                    ? "Estas seguro de agregar a los estudiantes seleccionados?"
                    : ""}
                  {deleteStudents
                    ? "Estas seguro de eliminar a los estudiantes selecionados?"
                    : ""}
                  {defaultSubjects
                    ? "Estas seguro de modificar las materias registradas por las materias por defecto"
                    : ""}{" "}
                  {customSubjects
                    ? "Estas seguro de modificar las materias registradas?"
                    : ""}{" "}
                  {graduateSection
                    ? "Estas seguro de graduar a la seccion? aqui hay una lista previa de los que podran graduarse y los que son rechazados"
                    : ""}
                </p>

                {addStudents && newStudents.length > 0 ? (
                  <>
                    <div
                      style={{
                        overflow: "auto",
                        maxHeight: "250px",
                        marginBottom: "20px",
                      }}
                    >
                      {" "}
                      {newStudents.map((el, i) => {
                        return (
                          <div
                            className="student card card-body border-primary"
                            style={{ marginTop: "10px" }}
                            key={i}
                          >
                            <p style={{ margin: "5px 0" }}>
                              <span style={{ fontWeight: "700" }}>
                                Cedula:{" "}
                              </span>
                              {`${el.ci}`}
                            </p>
                            <p style={{ margin: "5px 0" }}>
                              <span style={{ fontWeight: "700" }}>
                                Nombre y apellido:{" "}
                              </span>
                              {`${el.firstname} ${el.lastname}`}
                            </p>
                          </div>
                        );
                      })}{" "}
                    </div>
                  </>
                ) : (
                  ""
                )}

                {deleteStudents && selectedStudentsSection.length > 0 ? (
                  <>
                    <div
                      style={{
                        overflow: "auto",
                        maxHeight: "250px",
                        marginBottom: "20px",
                      }}
                    >
                      {" "}
                      {selectedStudentsSection.map((el, i) => {
                        return (
                          <div
                            className="student card card-body border-danger"
                            style={{ marginTop: "10px" }}
                            key={i}
                          >
                            <p style={{ margin: "5px 0" }}>
                              <span style={{ fontWeight: "700" }}>
                                Cedula:{" "}
                              </span>
                              {`${el.ci}`}
                            </p>
                            <p style={{ margin: "5px 0" }}>
                              <span style={{ fontWeight: "700" }}>
                                Nombre y apellido:{" "}
                              </span>
                              {`${el.firstname} ${el.lastname}`}
                            </p>
                          </div>
                        );
                      })}{" "}
                    </div>
                  </>
                ) : (
                  ""
                )}

                {graduateSection ? (
                  <div className="list-previews">
                    {studentsPreview.status ? (
                      <>
                        <div className="list-students-previous">
                          <h5 style={{ fontWeight: "bold" }}>
                            {studentsPreview.studentsApproves.length === 0
                              ? "Ningun estudiante aprueba el curso"
                              : `Estudiantes aprobados a graduarse (${studentsPreview.studentsApproves.length})`}
                          </h5>
                          <div
                            style={{
                              overflow: "auto",
                              maxHeight: "300px",
                              marginBottom: "20px",
                            }}
                          >
                            {studentsPreview.studentsApproves.map((el, i) => {
                              return (
                                <div
                                  className="student card card-body border-primary"
                                  style={{ marginTop: "10px" }}
                                  key={i}
                                >
                                  <p style={{ margin: "5px 0" }}>
                                    <span style={{ fontWeight: "700" }}>
                                      Cedula:{" "}
                                    </span>
                                    {`${el.ci}`}
                                  </p>
                                  <p style={{ margin: "5px 0" }}>
                                    <span style={{ fontWeight: "700" }}>
                                      Nombre y apellido:{" "}
                                    </span>
                                    {`${el.firstname} ${el.lastname}`}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="list-students-previous">
                          <h5 style={{ fontWeight: "600" }}>
                            Estudiantes Rechazados a graduarse (
                            {studentsPreview.studentsRejects.length})
                          </h5>
                          <div style={{ overflow: "auto", maxHeight: "300px" }}>
                            {studentsPreview.studentsRejects.map((el, i) => {
                              return (
                                <div
                                  className="student card card-body border-danger"
                                  key={i}
                                  style={{ marginTop: "10px" }}
                                >
                                  <p style={{ margin: "5px 0" }}>
                                    <span style={{ fontWeight: "700" }}>
                                      Cedula:{" "}
                                    </span>
                                    {`${el.ci}`}
                                  </p>
                                  <p style={{ margin: "5px 0" }}>
                                    <span style={{ fontWeight: "700" }}>
                                      Nombre y apellido:{" "}
                                    </span>
                                    {`${el.firstname} ${el.lastname}`}
                                  </p>
                                  <p style={{ margin: "5px 0" }}>
                                    <span style={{ fontWeight: "700" }}>
                                      Razón:{" "}
                                    </span>
                                    {`${el.reason}`}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                )}

                <p className="card-text" style={{ marginTop: "20px" }}>
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
                    if (addStudents) {
                      return updateSectionStudents();
                    }

                    if (deleteStudents) {
                      return deleteStudentsSelected();
                    }

                    if (customSubjects) {
                      return sendSubjectsChange();
                    }

                    if (studentsPreview.status) {
                      return graduateStudentsRegistered(false);
                    }

                    if (defaultSubjects) {
                      return sendSubjectsChange();
                    }
                  }}
                >
                  Confirmar Accion
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={(e) => {
                    setModalConfirm(false);
                    setDefaultSubjects(false);
                    setDeleteStudents(false);
                    setAddStudents(false);
                    setGraduateSection(false);
                    setCustomSubjects(false);
                    setPassword("");
                  }}
                >
                  Cerrar
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
                <button
                  className="btn btn-success"
                  onClick={(e) => {
                    setModalConfirm(true);
                    setGraduateSection(true);
                    graduateStudentsRegistered(true);
                  }}
                >
                  Graduar estudiantes de la seccion
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
              <div className="form-group" style={{ height: "230px" }}>
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
                  type="button"
                  onClick={(e) => {
                    setModalConfirm(true);
                    setCustomSubjects(true);
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
            {section.subjects && section.subjects.length > 0 ? (
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
              <div className="container-buttons-action-table" style={{display: 'flex',justifyContent: 'space-between',width:'100%', alignItems: 'center', height:'65px'}}>
              <h4>Estudiantes actualmente registrados</h4>

                {selectedStudentsSection.length > 0 ? (
                  <button
                    style={{ margin: "5px 20px" }}
                    className="btn btn-danger"
                    onClick={(e) => {
                      setModalConfirm(true);
                      setDeleteStudents(true);
                    }}
                  >
                    Eliminar estudiantes
                  </button>
                ) : (
                  ""
                )}
              </div>
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
                actions={[
                  {
                    type: "button",
                    name: "edit",
                    func: (id) => {
                      navigate(`/student/detail/${id}`);
                    },
                  },
                  {
                    type: "checkbox",
                    name: "select",
                    func: (student, isAdded) => {
                      selectCheck(student, isAdded, "section");
                    },
                  },
                ]}
              />
            </div>
          ) : (
            <h3 style={{ padding: "20px" }}>
              Actualmente no hay estudiantes registrados en la seccion!
            </h3>
          )}
        </div>
        <div className="students-new">
          <div className="switch">
            <div className="form-check form-switch">
              <label className="label-separator" htmlFor="new-students" style={{fontWeight:'600'}}>
                {" "}
                Registrar nuevos estudiantes
              </label>{" "}
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="new-students"
                onChange={(e) => {
                  setNewStudentsList(e.target.checked);
                }}
              />
            </div>
          </div>
          {newStudentsList ? (
            <div className="container-table table-students">
              <h4>Lista de estudiantes</h4>
              <div
                className="container-actions-body"
                style={{ justifyContent: "space-between" }}
              >
                <div className="container-label-select">
                  <label>Lista de estudiantes</label>
                  <select
                    className="form-select form-select-lg mb-3"
                    aria-label=".form-select-lg example"
                    onChange={(e) => {
                      setQueryStudent(e.target.value);
                    }}
                  >
                    <option value="activos">Activos</option>
                    <option value="inactivos">Inactivos</option>
                  </select>
                </div>
              </div>
              <div className="container-search-bar">
                <label htmlFor="searchBar">
                  Introduce nombre o apellido para buscar
                </label>
                <div>
                  <input
                    type="text"
                    onInput={(e) => {
                      setSearchBar(e.target.value);
                    }}
                    value={searchBar}
                    className="form-control"
                    id="searchBar"
                    placeholder="Fulano y tal"
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={(e) => requestList(searchBar)}
                  >
                    Buscar
                  </button>
                </div>
              </div>

              <NavigationOptionsList
                changeActualPage={(e) => {
                  setActualPage(e);
                }}
                avalaiblePages={avalaiblePages}
                pageActual={pageActual}
                limit={limit}
                changeLimit={(e) => {
                  setLimit(e);
                }}
              />

              <div className="container-btn-add" style={{height:'38px'}}>
              {newStudents.length > 0 ? (
                <button
                  style={{ margin: "5px 15px" }}
                  className="btn btn-primary"
                  onClick={(e) => {
                    setAddStudents(true);
                    updateSectionStudents()
                  }}
                >
                  Agregar nuevos estudiantes
                </button>
              ) : (
                ""
              )}
              </div>
              <TableList
                data={studentsList}
                checks={newStudents}
                labels={[
                  { field: "ci", nameField: "Cedula" },
                  { field: "firstname", nameField: "Nombre", linked: true },
                  { field: "lastname", nameField: "Apellido" },
                  { field: "status", nameField: "Estado" },
                  { field: "actions", nameField: "Seleccion" },
                ]}
                actions={[
                  {
                    type: "checkbox",
                    name: "select",
                    func: (student, isAdded) => {
                      selectCheck(student, isAdded, "new");
                    },
                  },
                ]}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default Section;