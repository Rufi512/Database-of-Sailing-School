import React,{useState,useEffect} from "react";
import {getSectionMax} from '../API'
import { Navbar } from "../components/Navbar";


const Sections = (props) => {
  const [students,setStudents] = useState(null)

  const viewSection = (section) => {
    console.log(section);
    props.history.push("/sections/list/" + section);
  };

  useEffect(() => {
    async function loadSection() {
      const result = await getSectionMax()
      
      if (result.status >= 400 && result.status <= 499) {

      return setStudents();
    }

    if (result.status >= 500) {
      return setStudents();
    }
    setStudents(result.data)
     
    }
    loadSection();
  }, [props]);



  return (
    <>
      <Navbar active={5} />
      <div className="container-sections">
        <h2>Lista de Secciones</h2>
        <div className="container-sections-card">
          <div className="card" style={{width: '18rem'}} onClick={(e)=>{viewSection("1-A")}}>
            <div className="card-body">
              <h3 className="card-title">Seccion 1-A</h3> 
              <p className="card-text">
                Estudiantes cursando actualmente: {students ? students.section1.studentsTotalA : 'Consultando...'}
              </p> 
            </div>
          </div>
           <div className="card" style={{width: '18rem'}} onClick={(e)=>{viewSection("1-B")}}>
            <div className="card-body">
              <h3 className="card-title">Seccion 1-B</h3> 
              <p className="card-text">
               Estudiantes cursando actualmente: {students ? students.section1.studentsTotalB : 'Consultando...'} 
              </p> 
            </div>
          </div>
           <div className="card" style={{width: '18rem'}} onClick={(e)=>{viewSection("2-A")}}>
            <div className="card-body">
              <h3 className="card-title">Seccion 2-A</h3> 
              <p className="card-text">
                Estudiantes cursando actualmente: {students ? students.section2.studentsTotalA : 'Consultando...'}
              </p> 
            </div>
          </div>
           <div className="card" style={{width: '18rem'}} onClick={(e)=>{viewSection("2-B")}}>
            <div className="card-body">
              <h3 className="card-title">Seccion 2-B</h3> 
              <p className="card-text">
                 Estudiantes cursando actualmente: {students ? students.section2.studentsTotalB : 'Consultando...'} 
              </p> 
            </div>
          </div>
           <div className="card" style={{width: '18rem'}} onClick={(e)=>{viewSection("3-A")}}>
            <div className="card-body">
              <h3 className="card-title">Seccion 3-A</h3> 
              <p className="card-text">
               Estudiantes cursando actualmente: {students ? students.section3.studentsTotalA : 'Consultando...'}  
              </p> 
            </div>
          </div>
           <div className="card" style={{width: '18rem'}} onClick={(e)=>{viewSection("3-B")}}>
            <div className="card-body">
              <h3 className="card-title">Seccion 3-B</h3> 
              <p className="card-text">
              Estudiantes cursando actualmente: {students ? students.section3.studentsTotalB : 'Consultando...'} 
              </p> 
            </div>
          </div>
           <div className="card" style={{width: '18rem'}} onClick={(e)=>{viewSection("4-A")}}>
            <div className="card-body">
              <h3 className="card-title">Seccion 4-A</h3> 
              <p className="card-text">
               Estudiantes cursando actualmente: {students ? students.section4.studentsTotalA : 'Consultando...'} 
              </p> 
            </div>
          </div>
           <div className="card" style={{width: '18rem'}} onClick={(e)=>{viewSection("4-B")}}>
            <div className="card-body">
              <h3 className="card-title">Seccion 4-B</h3> 
              <p className="card-text">
                Estudiantes cursando actualmente: {students ? students.section4.studentsTotalB : 'Consultando...'} 
              </p> 
            </div>
          </div>
           <div className="card" style={{width: '18rem'}} onClick={(e)=>{viewSection("5-A")}}>
            <div className="card-body">
              <h3 className="card-title">Seccion 5-A</h3> 
              <p className="card-text">
                Estudiantes cursando actualmente: {students ? students.section5.studentsTotalA : 'Consultando...'} 
              </p> 
            </div>
          </div>
           <div className="card" style={{width: '18rem'}} onClick={(e)=>{viewSection("5-B")}}>
            <div className="card-body">
              <h3 className="card-title">Seccion 5-B</h3> 
              <p className="card-text">
                Estudiantes cursando actualmente: {students ? students.section5.studentsTotalB : 'Consultando...'} 
              </p> 
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sections;
