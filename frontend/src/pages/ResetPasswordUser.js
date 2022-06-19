import React,{useState,useEffect} from "react";
import { useNavigate,useParams } from "react-router";
import "../static/styles/form-reset.css";
const ResetPasswordUser = (props) =>{
	let navigate = useNavigate()
	const [password,setPassword] = useState({password:'',cPassword:''})
	const handleSubmit = (e) =>{
		e.preventDefault()
		//navigate('/')
		console.log(password)
	}
	let params = useParams()
	console.log(params)
	return(	
			<div className="container-user-reset">
				<h1>Crea tu nueva contraseña</h1>
				<form className="form" onSubmit={handleSubmit}>
            <label className="field">
              <p>Nueva Contraseña</p>
              <div className="field-content">
              <input type="text" placeholder="Introduce tu nueva contraseña" onInput={(e)=>{setPassword({...password,password:e.target.value})}}/>
              </div>
            </label>
            <label className="field">
            <p>Confirme la contraseña</p>
            <div className="field-content">
              <input type="text" placeholder="Confirme la contraseña" onInput={(e)=>{setPassword({...password,cPassword:e.target.value})}}/>
              </div>
            </label>
            <button type="submit" className="button-submit">Cambiar Contraseña</button>
        </form>
			</div>
		)
}	


export default ResetPasswordUser;