import React,{useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const NotFound = (props) => {
	let navigate = useNavigate()
	
	useEffect(()=>{
	if(Cookies.get("token")){
		return navigate('/home')
	}
	navigate('/')
	},[navigate])
	return (
		<div>
			
		</div>
	)
}

export default NotFound