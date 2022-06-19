import React,{useState} from 'react';
import { useNavigate } from 'react-router';
import {ReactComponent as PersonIcon} from "../static/icons/person.svg";
import {ReactComponent as EmailIcon} from "../static/icons/email.svg";
import "../static/styles/form-forgot.css";
const ForgotPassword = ()=>{
	const [user,setUser] = useState({user:'',option:0})
	const [activeSubmit,setActiveSubmit] = useState(false)
	let navigate = useNavigate()
	const submit = (e)=>{
		e.preventDefault()
		setActiveSubmit(true)
		try{
			console.log(user)
		}catch(e){
			setActiveSubmit(false)
		}
	}

	const goLogin = (e)=>{
			navigate('/')
	}

	// If option is default

		return(
			<>
			{
				// If option is send email
				<div className={`email-confirm ${user.option === 1 && activeSubmit === true ? 'email-confirm-fade' : ''}`}> <h1>Correo de recuperacion enviado!</h1> <p>Hemos enviado un link en el que podras recuperar tu contraseña! ve y revisa tu correo por favor, tienes 15 minutos antes del que correo enviado sea invalido para la recuperacion </p></div> 
			}
		<div className={`container-forgot ${user.option === 1 && activeSubmit === true ? 'fade-container-form' : ''}`}  >
			<h1 className="title">Recuperacion de contraseña</h1>
			<p className="text">Para recuperar la contraseña sigue los pasos a continuacion</p>
			
			<form className="form form-forgot" onSubmit={submit}>
				<label className="field">
              <p className="label">1. Cedula o Correo electronico</p>
              <div className="field-content">
              <div className="icon">
                <PersonIcon fill={"#19429f"}/>
              </div>
              <input type="text" placeholder="Introduce tu cedula o correo" onInput={(e)=>{setUser({...user,user:e.target.value})}}/>
              </div>
            </label>

            <p className="label">2. Elige un metodo de recuperacion</p>
            
            <div className="container-options">
            
            <div className={`card-option ${user.option === 1 ? 'card-option-selected' : ''}`} onClick={(e)=>{setUser({...user,option:1})}}>
            	<EmailIcon fill={"#19429f"}/>
            	<div className="content">
            		<h2>Recuperar mediante correo electronico</h2>
            		<p>Se le enviara un correo electronico con un enlace para cambiar su contraseña</p>
            	</div>
            </div>

            <div className={`card-option ${user.option === 2 ? 'card-option-selected' : ''}`} onClick={(e)=>{setUser({...user,option:2})}}>
            	<EmailIcon fill={"#19429f"}/>
            	<div className="content">
            		<h2>Recuperar mediante preguntas de seguridad</h2>
            		<p>Si cuenta con preguntas de seguridad, puedes intentar recuperar la contraseña por este metodo</p>
            	</div>
            </div>
            
            </div>
            <div className='container-buttons'>
              <button className="button-submit" type="button" onClick={(e)=>{goLogin()}}>Regresar</button>
            	<button className="button-submit" type="submit">Continuar</button>
            </div>
            
			</form>

		</div>
		</>
		)


	
}


export default ForgotPassword