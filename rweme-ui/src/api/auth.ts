import instance from ".";
import { notify } from "../utils/notify";
import { useAuthStore } from "../store/auth.store";
import { entities, userRoles } from "../utils/enums";
import { useRouter } from "vue-router";
interface LoginI {
	login: string;
	password: string;
}
interface emailComfirmI {
	email: string;
	verificationCode: string;
}

export const login = async (login: LoginI) => {
	const router = useRouter();
	const { setUser } = useAuthStore();
	return await instance
		.post("/auth/login", login)
		.then((res) => {
			setUser(res.data.data);
			const userStringified= JSON.stringify(res.data.data)
			localStorage.setItem('auth_user',userStringified)
			notify("success", "Success !!!", res.data.message);
		})
		.catch((err) => {
			notify("error", "Error loging in !!!", err.response.data.message);
			throw err;
		});
};
export const logout = async () => {
	return await instance
		.post("/auth/logout")
		.then((res) => {
			notify("success", "Success !!!", res.data.message);
		})
		.catch((err) => {
			console.log("err", err);
			notify("error", "Error loging in !!!", err.response.data.message);
			throw err;
		});
};

export const comfirmAccount = async (data: emailComfirmI) => {
	return await instance
		.patch("/auth/confirm-account", data)
		.then((res) => {
			notify("success", "Success !!!!", res.data.message);
		})
		.catch((err) => {
			console.log("err", err);
			notify("error", "Error ", err.response.data.message);
		});
};
