import React from 'react'
import {BrowserRouter as Router,Route,Redirect} from 'react-router-dom'

export const PrivateRoute = ({isAuth: isAuth, component: Component, ...rest}){

	return(
      <Route {...rest} render={(props)=>{
      	return isAuthenticated === true ? 
      	<Component/> : 
      	<Redirect to={{pathName: '/', state:{from: props.location}}}/>
      }}>
	)
}