import Cookies from "js-cookie";
export default function useAuth(){
	const auth = Cookies.get("token")
	return auth
}