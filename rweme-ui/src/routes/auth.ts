import AuthLayout from "../components/AuthLayout.vue";
import AccountConfirmation from "../views/AccountConfirmation.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import Login from "../views/Login.vue";
import ResetPassword from "../views/ResetPassword.vue";

const authRoutes = [
	{
		path: "/auth",
		component: AuthLayout,
		children: [
			{
				path: "login",
				name: "Login",
				component: Login,
			},
			{
				path: "forgot-password",
				name: "Forgot Password",
				component: ForgotPassword,
			},
			{
				path: "reset-password/:email/:token",
				name: "Reset Password",
				component: ResetPassword,
			},
			{
				path: "comfirm-account",
				name: "Confirm Account",
				component: AccountConfirmation,
			},
		],
	},
];

export default authRoutes;
