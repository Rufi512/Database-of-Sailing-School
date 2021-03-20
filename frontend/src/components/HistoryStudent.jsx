import React, {useState, useEffect} from 'react'
import {InfoBasic} from './InfoBasic'
import {InfoAcademic} from './InfoAcademic'
import {Comments} from './Comments'
import {changeView, switchYear,switchActive} from './SomethingFunctions'
export const HistoryStudent = (props) => {

  const [history, setHistory] = useState([])
  const [schoolYears, setSchoolYears] = useState([]) 
  const [commits, setCommits] = useState([])

  useEffect(() => {
    async function load() {
      let yearsAvalaible = []
      let history = []
      let commentsAnnual = []
      const records = props.record
      const comments = props.annualComments

      for(const record of records){
        if(record !== null){
          history.push(record.subjects)
          yearsAvalaible.push(record.school_year)
        } 
      }
        
      for (const comment of comments){
        if(comment !== null){
          commentsAnnual.push(comment)
        }
      }

      setSchoolYears(yearsAvalaible)
      setHistory(history)
      setCommits(commentsAnnual)
       }
  load()
}, [props])

  return (

    <div style={{display: props.gradue === "Graduado" ? 'flex': ''}} className="container-student view-history">

      <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', marginBottom: '15px'}}>
        <div style={{display: props.gradue === "Graduado" ? 'none': ''}}><button className="btn" type="button" onClick={(e) => {changeView('general')}}>Regresar</button></div>
        <p style={{display: props.gradue === "Graduado" ? 'none': ''}} >Secciones cursadas</p>
        <div className="buttons-container-history" style={{}}>
          {schoolYears.map((el, i) => { 
            if (el !== undefined) {
             
              return (<button className={`btn-history ${ i === 0 ? 'btn-active-history'  : ''}`} data-index={i} onClick={(e) => {switchYear(e.target.dataset.index);
              switchActive(e.target.dataset.index)
              }} key={i}>{el}</button>)
            } return ('')
          })
          }
        </div>

      </div>
     
      <div className="slide-history" >
        <div className="container-history">
          <InfoBasic student={props.student} zone={"HistoryStudent"} gradue={props.gradue}/>
          <InfoAcademic information={history[0]} />
          <br />
          <Comments comments={commits[0]} studentInfo={false} />
        </div>

        <div className="container-history">
          <InfoBasic student={props.student} zone={"HistoryStudent"} gradue={props.gradue}/>
          <InfoAcademic information={history[1]}  />
          <br />
          <Comments comments={commits[1]} studentInfo={false}/>
        </div>

        <div className="container-history">
          <InfoBasic student={props.student} zone={"HistoryStudent"} gradue={props.gradue}/>
          <InfoAcademic information={history[2]} />
          <br />
          <Comments comments={commits[2]}  studentInfo={false} />
        </div>

        <div className="container-history">
          <InfoBasic student={props.student} zone={"HistoryStudent"} gradue={props.gradue}/>
          <InfoAcademic information={history[3]} />
          <br />
          <Comments comments={commits[3]}  studentInfo={false} />
        </div>

        <div className="container-history">
          <InfoBasic student={props.student} zone={"HistoryStudent"} gradue={props.gradue}/>
          <InfoAcademic information={history[4]} />
          <br />
          <Comments comments={commits[4]}  studentInfo={false}/>
        </div>

      </div>

    </div>

  )

}
