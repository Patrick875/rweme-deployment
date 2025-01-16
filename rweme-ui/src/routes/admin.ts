import CreateFarmer from "../components/CreateFarmer.vue";
import Dashboard from "../views/Dashboard.vue";
import Farmers from "../views/Farmers.vue";
import LogedInLayout from "../views/LogedInLayout.vue";
import Settings from "../views/Settings.vue";
import Suppliers from "../views/Suppliers.vue";
import Transactions from "../views/Transactions.vue";
import Veterinaries from "../views/Veterinaries.vue";
import FarmerDetails from "../views/FarmerDetails.vue";
import FoodRequests from "../views/FoodRequests.vue";
import AppointmentsCalendar from "../components/AppointmentsCalendar.vue";

const routes = [
	{
		path: "/",
		component: LogedInLayout,
		children: [
			{
				path: "",
				name: "Dashboard",
				component: Dashboard,
			},
			{
				path: "feedrequests",
				name: "Feed Requests",
				component: FoodRequests,
			},
			{
				path: "appointments",
				name: "Appointments",
				component: AppointmentsCalendar,
			},
			{
				path: "farmers",
				name: "Farmers",
				component: Farmers,
			},
			{
				path: "farmers/:farmerId",
				name: "Farmer",
				component: FarmerDetails,
			},
			{
				path: "/farmers/newfarmer",
				name: "AddNewFarmer",
				component: CreateFarmer,
			},
			{
				path: "veterinaries",
				name: "Veterinaries",
				component: Veterinaries,
			},
			{
				path: "suppliers",
				name: "Suppliers",
				component: Suppliers,
			},
			{
				path: "transactions",
				name: "Transactions",
				component: Transactions,
			},
			{
				path: "settings",
				name: "Settings",
				component: Settings,
			},
		],
	},
];

export default routes;
