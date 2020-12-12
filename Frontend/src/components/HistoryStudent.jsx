import React, {useState, useEffect} from 'react'
import {InfoAcademic} from './InfoAcademic'
import {Comments} from './Comments'
import {viewHistory, switchYear,switchActive} from './SomethingFunctions'
export const HistoryStudent = (props) => {

  const [history, setHistory] = useState([])
  const [schoolYears, setSchoolYears] = useState([]) 
  const [commits, setCommits] = useState([])

  useEffect(() => {
    async function load() {
      let yearsAvalaible = []
      let history = []
      const records = props.record

      for(const record of records){
        if(record.subjects !== undefined){
          history.push(record.subjects)
        }
      }
      
       for(const record of records){
        if(record.school_year !== undefined){
          yearsAvalaible.push(record.school_year)
        }
       }
      setSchoolYears(yearsAvalaible)
      setHistory(history)
      setCommits(props.annualComments)
  }
  load()
}, [props])

  return (

    <div className="container-student view-history">

      <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', marginBottom: '15px'}}>
        <div><button className="btn" type="button" onClick={(e) => {viewHistory(false)}}>Regresar</button></div>
        <p>Secciones cursadas</p>
        <div className="buttons-container">
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

      <div className="slide-history">
        <div className="container-history">
          <InfoAcademic information={history[0]} />
          <br />
          <Comments comments={commits[0]} studentInfo={false} />
        </div>

        <div className="container-history">
          <InfoAcademic information={history[1]}  />
          <br />
          <Comments comments={commits[1]} studentInfo={false}/>
        </div>

        <div className="container-history">
          <InfoAcademic information={history[2]} />
          <br />
          <Comments comments={commits[2]}  studentInfo={false} />
        </div>

        <div className="container-history">
          <InfoAcademic information={history[3]} />
          <br />
          <Comments comments={commits[3]}  studentInfo={false} />
        </div>

        <div className="container-history">
          <InfoAcademic information={history[4]} />
          <br />
          <Comments comments={commits[4]}  studentInfo={false}/>
        </div>

      </div>

    </div>

  )

}
