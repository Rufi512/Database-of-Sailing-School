import React, { useEffect } from "react";
import { ConfirmUnblockedUser } from "../API";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const ConfirmUnblocked = (props) => {
	const params = useParams();
	const navigate = useNavigate();
	useEffect(() => {
		const request = async () => {
			const toastId = toast.loading("Verificando datos...", {
				closeOnClick: true,
			});

			const res = await ConfirmUnblockedUser(params);
			console.log(res);
			if (res.status >= 400) {
				toast.update(toastId, {
					render: res.data.message,
					type: "error",
					isLoading: false,
					closeOnClick: true,
					autoClose: 5000,
				});
				navigate("/");
			}

			toast.update(toastId, {
				render: "Usuario desbloqueado satisfactorio!",
				type: "success",
				isLoading: false,
				closeOnClick: true,
				autoClose: 2000,
			});
			navigate("/");
		};
		request();
	}, [params,navigate]);
	return <div></div>;
};

export default ConfirmUnblocked;