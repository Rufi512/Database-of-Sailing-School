import React from 'react'
import Cookies from "js-cookie";
import {Navigate} from "react-router-dom"
const VerifyRoles = ({children,user}) => {
 const rol = Cookies.get("rol") || ''

 if(user.find((el)=> el === rol)){
   return children
 }
 
 return <Navigate to="/home"/>
};

export default VerifyRoles