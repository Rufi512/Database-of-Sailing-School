import React,{useState} from "react";
import { useNavigate } from 'react-router';
import '../static/styles/form-reset.css'
const Questions = (e) =>{
	let navigate = useNavigate()
	const [answers,setAnswers] = useState([])
	const handleSubmit = (e) =>{
		e.preventDefault()

	}
	return(
			<div className="container-user-reset">
				<h2>Contesta las preguntas para continuar</h2>
				<form className="form" onSubmit={handleSubmit}>
            <label className="field">
              <p>Pregunta 1: Cual es el nombre de tu bonito presidente</p>
              <div className="field-content">
              <input type="text" placeholder="Escribe tu respuesta" onInput={(e)=>{setAnswers({...answers,answers:e.target.value})}}/>
              </div>
            </label>
            <label className="field">
            <p>Pregunta 2: Cual es el nombre de tu lugar favorito</p>
            <div className="field-content">
              <input type="text" placeholder="Escribe tu respuesta" onInput={(e)=>{setAnswers({...answers,answers:e.target.value})}}/>
              </div>
            </label>
            <div className='container-buttons'>
            <button type="button" className="button-submit" onClick={(e)=>{navigate('/forgot-password')}}>Regresar</button>
            <button type="submit" className="button-submit">Confirmar</button>
            </div>
        </form>
			</div>
		)
}

export default Questions