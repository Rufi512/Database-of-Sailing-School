import React,{useEffect} from 'react'
import Cookies from "js-cookie";
import {Navigate, Outlet} from "react-router-dom"
import {verifyToken} from '../API'
const ProtectedRoute = () => {
 useEffect(()=>{
    //verifyToken()
 },[])
 const auth = Cookies.get("token") || true
 return auth ? <Outlet/> : <Navigate to="/"/>
};

export default ProtectedRoute