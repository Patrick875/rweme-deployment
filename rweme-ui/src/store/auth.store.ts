import { defineStore } from "pinia";
import { logout } from "../api/auth";

const storedUser = localStorage.getItem("auth_user");
const defaultState = {
	user: JSON.parse(storedUser as string) || null,
	userProfile: null as any,
};
export const useAuthStore = defineStore({
	id: "auth",
	getters: {
		loggedInUser: (state) => state.user,
	},
	state: () => ({
		...defaultState,
	}),
	actions: {
		setUser(user: any) {
			this.user = user;
		},
		async logoutUser() {
			try {
				await logout();
				localStorage.setItem("auth_user", "");
			} catch (error) {
				console.log("err", error);
			}
			this.user = null;
		},
	},
	// persist: {
	// 	enabled: true,
	// },
});
