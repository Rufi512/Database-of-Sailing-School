import useAuth from './auth'
import {Navigate, Outlet} from "react-router-dom"
const ProtectedRoute = ({ children }) => {
 const auth = true
 console.log(children)
 return auth ? <Outlet/> : <Navigate to="/"/>
};

export default ProtectedRoute