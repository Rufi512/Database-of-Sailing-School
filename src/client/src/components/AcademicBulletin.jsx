import React from "react";
import stampImg from "../static/logos/stamp.jpg";
import stamp2Img from "../static/logos/stamp2.jpg";
import stamp3Img from "../static/logos/jb.jpg"
import { InfoBasic } from "./InfoBasic";
import { InfoAcademic } from "./InfoAcademic";
export const AcademicBulletin = (props) => {  

    return (
    <div className="bulletin-container" id="to-pdf">
      <div className="bulletin">
        <h2>Ministerio del Poder Popular para la Educacion</h2>
        <h2>Unidad Educativa Colegio Juan Bosco</h2>
        <h3>Boletín Académico Estudiantil</h3>
        <img style={{width:'80px'}} src={stamp3Img} alt="stamp3Img"/>
        <div className="bulletin-body">
          {props.student.subjects ? '' : (<InfoBasic student={props.student} year={props.student.school_year} />)}
          {props.student.subjects ? (
            <>
            <h3 style={{ margin: "50px auto 10px auto" }}>
              Información Académica del Estudiante Actual
            </h3>
              <InfoBasic student={props.student} year={props.student.school_year} />
              <InfoAcademic information={props.student.subjects} />
              {props.comments.find(el => el.school_year === props.student.school_year ) ? 
                <h3>Comentarios sobre el estudiante</h3>
              : ''}

               {props.comments.map((comment, i) => {
                    if (props.student.school_year === comment.school_year) {
                      return (
                        <div className="comment" key={i}>
                          <p style={{ whiteSpace: "break-spaces", lineHeight:'25px'  }}>
                            {comment.comment}
                          </p>
                          <h4>
                           Comentario realizado por:
                          </h4>
                          <p style={{ margin: "10px 0" }}>
                            {comment.firstName} {comment.lastName}
                          </p>
                        </div>
                      );
                    }else{
                      return('')
                    }
                  })}
            </>) : (
            ""
          )}
        
          <h2 style={{ margin: "60px auto", display:props.student.record[0] ? 'block' : 'none'}}>Notas Anuales del estudiante</h2>
          {props.student.record.map((el, i) => { 
            if (el) {
              return (
                <section key={i}>
                  <h2 style={{ textAlign: "center" }}>
                    Notas Definitivas en {el.school_year}
                  </h2>
                  <InfoAcademic information={el.subjects} />

                  <h4>Comentarios sobre el estudiante</h4>

                  {props.comments.map((comment, i) => {
                    if (el.school_year === comment.school_year) {
                      return (
                        <div className="comment" key={i}>
                          <p style={{ whiteSpace: "break-spaces", lineHeight:'25px' }}>
                            {comment.comment}
                          </p>
                          <h4>
                            Comentario realizado por:
                          </h4>
                          <p style={{ margin: "10px 0" }}>
                            {comment.firstName} {comment.lastName}
                          </p>
                        </div>
                      );
                    }else{
                      return('')
                    }
                  })}
                </section>
              );
 
            }else{
              return('')
            }
          })}
        </div>
        <div className="bulletin-footer">
          <div>
            <h4>Sello del plantel</h4>
            <img style={{ height: "120px" }} src={stampImg} alt="stamp" />
          </div>
          <div>
            <h4>Firma del Director</h4>
            <img
              style={{ height: "120px" }}
              src={stampImg}
              alt="stampImg"
            />
          </div>
          <div>
            <h4>Firma de la Coordinadora</h4>
            <img style={{ height: "111px" }} src={stamp2Img} alt="stamp2" />
          </div>
        </div>
      </div>
    </div>
  );
};


