import Dashboard from "../views/Dashboard.vue";
import LogedInLayout from "../views/LogedInLayout.vue";
import Transactions from "../views/Transactions.vue";
import FoodRequests from "../views/FoodRequests.vue";

const routes = [
	{
		path: "/supplier",
		component: LogedInLayout,
		children: [
			{
				path: "",
				name: "SupplierDashboard",
				component: Dashboard,
			},
			{
				path: "feedrequests",
				name: "SupplierFoodRequests",
				component: FoodRequests,
			},
			{
				path: "transactions",
				name: "SupplierTransactions",
				component: Transactions,
			},
		],
	},
];

export default routes;
