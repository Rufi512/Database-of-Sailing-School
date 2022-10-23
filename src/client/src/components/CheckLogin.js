import React,{useState,useEffect} from 'react'
import {Navigate} from "react-router-dom"
import {verifyToken} from '../API'
const CheckLogin = ({children}) => {
   const [isLogin,setIsLogin] = useState(false)
   const [isLoad,setIsLoad] = useState(false)
   useEffect(() => {
      const request = async() =>{
         const res = await verifyToken(true)
         if(res.status < 400){
            setIsLogin(true)
         }
         setIsLoad(true)
      }
      request()
   }, [])
   if(isLoad){
      return isLogin ? <Navigate to="/home"/> : children 
   }
   return <div></div>
};

export default CheckLogin