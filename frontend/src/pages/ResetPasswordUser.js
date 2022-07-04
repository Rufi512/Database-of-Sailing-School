import React,{useState} from "react";
import { useNavigate,useParams } from "react-router";
import {toast} from 'react-toastify'
import {resetPassword} from '../API'
import "../static/styles/form-reset.css";
const ResetPasswordUser = (props) =>{
	let params = useParams()
	const navigate = useNavigate()
	const [pass,setPass] = useState({password:'',cPassword:''})
	const [isSubmit,setIsSubmit] = useState(false)
	const handleSubmit = async(e) =>{
		e.preventDefault()
		if(isSubmit) return
		setIsSubmit(true)
		//navigate('/')
		if(pass.password !== pass.cPassword){
			setIsSubmit(false)
			return toast.error("La contraseña no coinciden con la confirmacion, verifique")
		}

		const toastId = toast.loading("Verificando datos...",{closeOnClick: true});
		try{
			console.log(params)
			const res = await resetPassword({id:params.id,token:params.token,password:pass.password})
			setIsSubmit(false)
			if(res.status >= 400){
        return toast.update(toastId, {
        render: res.data.message,
        type: "error",
        isLoading: false,
        closeOnClick: true,
        autoClose: 5000,
      });
      }

      toast.update(toastId, {
        render: "Cambio de contraseña satisfactorio!",
        type: "success",
        isLoading: false,
        closeOnClick: true,
        autoClose: 2000,
      });
      navigate("/")
		}catch(e){
			setIsSubmit(false)
			return toast.update(toastId, {
						render: "Error falta en el servidor :(",
						type: "error",
						isLoading: false,
						closeOnClick: true,
						autoClose: 5000,
					});
		}
	}
	return(	
			<div className="container-user-reset">
				<h1>Crea tu nueva contraseña</h1>
				<form className="form" onSubmit={handleSubmit}>
            <label className="field">
              <p>Nueva Contraseña</p>
              <div className="field-content">
              <input type="text" placeholder="Introduce tu nueva contraseña" onInput={(e)=>{setPass({...pass,password:e.target.value})}}/>
              </div>
            </label>
            <label className="field">
            <p>Confirme la contraseña</p>
            <div className="field-content">
              <input type="password" placeholder="Confirme la contraseña" onInput={(e)=>{setPass({...pass,cPassword:e.target.value})}}/>
              </div>
            </label>
            <button type="submit" className="button-submit">Cambiar Contraseña</button>
        </form>
			</div>
		)
}	


export default ResetPasswordUser;