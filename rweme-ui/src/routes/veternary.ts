import CreateFarmer from "../components/CreateFarmer.vue";
import Dashboard from "../views/Dashboard.vue";
import Farmers from "../views/Farmers.vue";
import LogedInLayout from "../views/LogedInLayout.vue";
import FarmerDetails from "../views/FarmerDetails.vue";

const routes = [
	{
		path: "/veternary",
		component: LogedInLayout,
		children: [
			{
				path: "",
				name: "VeternaryDashboard",
				component: Dashboard,
			},
			{
				path: "farmers",
				name: "VeternaryFarmers",
				component: Farmers,
			},
			{
				path: "farmers/:farmerId",
				name: "VeternaryFarmer",
				component: FarmerDetails,
			},
			{
				path: "/farmers/newfarmer",
				name: "VeternaryAddNewFarmer",
				component: CreateFarmer,
			},
		],
	},
];

export default routes;
