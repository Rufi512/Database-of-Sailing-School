import React,{useState,useEffect} from 'react'
import axios from 'axios'

const HistoryStudent = () =>{
const [history,setHistory] = useState([])

function request (id){
	const res = await axios.get('http://localhost:8080/studentInfoHistory/' + id)
	setHistory(res)
}

useEffect(() => {
	function load(){
         request(props)
	}
	load()
}, [props])
}

export default HistoryStudent