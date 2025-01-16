import { entities } from "./../utils/enums";
import { NotificationPlacement } from "ant-design-vue";
import { defineStore } from "pinia";
import instance from "../api";
import { notify } from "../utils/notify";
import { useRouter } from "vue-router";
import { Axios, AxiosError } from "axios";

const defaultState = {
	singleUser: null as any,
	farmers: [] as any,
	foodrequests: [] as any,
	farmer: null as any,
	veternaries: [] as any,
	veternary: null as any,
	specializations: [] as any,
	appointments: [] as any,
	farmerAppointments: [] as any,
	vetFarmers: [] as any,
	veternaryvisits: [] as any,
	suppliers: [] as any,
	supplier: null as any,
	selectedFarmerId: "",
	typeofchicken: [] as any,
	typeoffeeds: [] as any,
	provinces: [] as any,
	districts: [] as any,
	sectors: [] as any,
	cells: [] as any,
	villages: [] as any,
	dashboardData: null as any,
	viewableItemId: null as any,
	detailsItem: null as any,
	transactions: [] as any,
	success: false,
	successMessage: "",
	failure: false,
	failureMessage: "",
	loading: false,
};

export const useEntitiesStore = defineStore({
	id: "farmers",
	state: () => ({
		...defaultState,
	}),
	actions: {
		async getDashbordData(q: string = "") {
			this.resetStatuses();
			const router = useRouter();
			try {
				const response = await instance.get(`/dashboard?q=${q}`);
				this.dashboardData = response.data.data;
			} catch (err: any) {
				if (err.response.status === 401 || err.response.status === 403) {
					router.replace("/auth/login");
				}
			}
		},
		async getFarmers(q: string = "") {
			this.resetStatuses();
			const router = useRouter();
			try {
				const response = await instance.get(`/farmers?q=${q}`);
				this.farmers = response.data.data;
			} catch (err: any) {
				if (err.response.status === 401 || err.response.status === 403) {
					router.replace("/auth/login");
				}
			}
		},
		async getFarmersAssignedToVet(vetId: string) {
			this.resetStatuses();
			try {
				const response = await instance.get(`/farmers/veternary/${vetId}`);
				this.vetFarmers = response.data.data;
			} catch (error) {
				console.log("err", error);
			}
		},
		async getFarmer(farmerId: string) {
			this.resetStatuses();
			try {
				const response = await instance.get(`/farmers/${farmerId}`);
				console.log("the response", response);
				this.farmer = response.data.data;
			} catch (err: any) {
				console.log("err", err);
				notify("error", "error fetching farmer", err?.response?.data.message as string);
			}
		},
		async getVeternaries(q: string = "") {
			this.resetStatuses();

			try {
				const response = await instance.get(`/veterinaries?q=${q}`);
				this.veternaries = response.data.data;
			} catch (err) {
				console.log("err", err);
			}
		},
		async getVeternary(id: string) {
			this.resetStatuses();
			try {
				this.loading = true;
				const response = await instance.get(`/veterinaries/${id}`);
				this.veternary = response.data.data;
			} catch (error) {
				console.log("err", error);
				notify("error", "Error", "Error fetching veternary");
			} finally {
				this.loading = false;
			}
		},
		async getSuppliers(q: string = "") {
			this.resetStatuses();

			try {
				const response = await instance.get(`/suppliers?q=${q}`);
				this.suppliers = response.data.data;
			} catch (err) {
				console.log("err", err);
			}
		},
		async getAppointments(q: string = "") {
			this.resetStatuses();
			try {
				const response = await instance.get(`/appointments?q=${q}`);
				this.appointments = response.data.data;
			} catch (error) {
				console.log("err", error);
			}
		},
		async getAppointmentsByVet(vetId: string) {
			this.resetStatuses();
			try {
				const response = await instance.get(`/appointments/veternary/${vetId}`);
				this.appointments = response.data.data;
			} catch (error) {
				console.log("err", error);
			}
		},
		async getAppointmentsByFarmer(farmerId: string) {
			this.resetStatuses();
			try {
				const response = await instance.get(`/appointments/farmer/${farmerId}`);
				this.farmerAppointments = response.data.data;
			} catch (error) {
				console.log("err", error);
			}
		},
		async getSupplier(id: string) {
			this.resetStatuses();
			try {
				this.loading = true;
				const response = await instance.get(`/suppliers/${id}`);
				this.supplier = response.data.data;
			} catch (error) {
				console.log("err", error);
				notify("error", "Error", "Error fetching veternary");
			} finally {
				this.loading = false;
			}
		},
		async getTypesOfChicken(q: string = "") {
			this.resetStatuses();

			try {
				const response = await instance.get(`/typeofchicken?q=${q}`);
				this.typeofchicken = response.data.data;
			} catch (err) {
				console.log("err", err);
			}
		},
		async getTypesOfFeed(q: string = "") {
			this.resetStatuses();

			try {
				const response = await instance.get(`/typeoffeeds?q=${q}`);
				this.typeoffeeds = response.data.data;
			} catch (err) {
				console.log("err", err);
			}
		},
		async getSpecializations(q: string = "") {
			this.resetStatuses();
			try {
				const response = await instance.get(`/specializations?q=${q}`);
				this.specializations = response.data.data;
			} catch (err) {
				console.log("err", err);
			}
		},
		async getSingleUser(id: string) {
			this.resetStatuses();
			try {
				this.loading = true;
				const response = await instance.get(`/users/${id}`);
				this.singleUser = response.data.data;
			} catch (err) {
				console.log("err", err);
			} finally {
				this.loading = false;
			}
		},
		async createVeternary(data: any) {
			this.resetStatuses();

			try {
				const response = await instance.post("/veterinaries", data);
				this.getVeternaries();
				notify("success", "Success !!!", response.data.message);
			} catch (err: any) {
				console.log("err", err);
				notify("error", "Error loging in !!!", err.response.data.message);
			}
		},
		async createSupplier(data: any) {
			this.resetStatuses();

			try {
				const response = await instance.post("/suppliers", data);
				this.getSuppliers();
				notify("success", "Success !!!", response.data.message);
			} catch (err: any) {
				console.log("err", err);
				notify("error", "Error loging in !!!", err.response.data.message);
			}
		},
		async createFarmer(data: any) {
			this.resetStatuses();

			try {
				const response = await instance.post("/farmers", data);

				if (response) {
					console.log("res", response);
					localStorage.setItem("newFarmer", JSON.stringify(response.data.data));
					this.success = true;
				}

				this.getFarmers();
				notify("success", "Success !!!", response.data.message);
			} catch (err: any) {
				console.log("err", err);
				notify("error", "Error Creating Farmer!!!", err.response.data.message);
			}
		},
		async addFarmStatus(data: any) {
			this.resetStatuses();

			try {
				const response = await instance.post("/farmstatus", data);
				if (response) {
					this.getFarmer(data.farmerId);
				}
				notify("success", "Status Recorded", "", "top");
			} catch (err: any) {
				console.log("err", err);
				notify("error", "Error", err.response.data.message, "top");
			}
		},
		async getLocations() {
			this.resetStatuses();

			try {
				const provinces = await instance.get("/locations/provinces");
				const districts = await instance.get("/locations/districts");
				const sectors = await instance.get("/locations/sectors");
				const cells = await instance.get("/locations/cells");
				const villages = await instance.get("/locations/villages");
				if (provinces) {
					this.$patch((state) => {
						state.provinces = provinces.data.data;
					});
				}
				if (districts) {
					this.$patch((state) => {
						state.districts = districts.data.data;
					});
				}
				if (sectors) {
					this.$patch((state) => {
						state.sectors = sectors.data.data;
					});
				}
				if (cells) {
					this.$patch((state) => {
						state.cells = cells.data.data;
					});
				}
				if (villages) {
					this.$patch((state) => {
						state.villages = villages.data.data;
					});
				}
			} catch (err: any) {
				console.log("err", err);
				notify("error", "Error loging in !!!", err.response.data.message);
			}
		},
		async submitFoodRequest(data: any, farmerId: string = "") {
			this.loading = true;
			try {
				const response = await instance.post("/foodrequests", data);
				if (response) {
					notify("success", "Success", "Request submited !!!");
				}
				if (farmerId !== "") {
					this.getRequestsByFarmer(farmerId);
				} else {
					this.getFoodRequests();
				}
				this.loading = false;
			} catch (error) {
				this.loading = false;
				notify("error", "Failure", "Error submitting request");
				console.log("err", error);
			}
		},
		async getFoodRequests(q: string = "") {
			this.resetStatuses();
			try {
				const response = await instance.get(`/foodrequests?q=${q}`);
				this.foodrequests = response.data.data;
			} catch (error) {
				console.log("err", error);
			}
		},
		async getFoodRequest(reqId: string) {
			this.resetStatuses();
			try {
				const response = await instance.get(`/foodrequests/${reqId}`);
				this.detailsItem = response.data.data;
			} catch (error) {
				console.log("err", error);
			}
		},
		async getRequestsByFarmer(farmerId: string, q: string = "") {
			this.resetStatuses();
			try {
				const response = await instance.get(`/foodrequests/farmer/${farmerId}?q=${q}`);
				this.foodrequests = response.data.data;
			} catch (error) {
				console.log("err", error);
			}
		},
		async getRequestsBySupplier(supplierId: string, q: string = "") {
			this.resetStatuses();
			try {
				const response = await instance.get(`/foodrequests/supplier/${supplierId}?q=${q}`);
				this.foodrequests = response.data.data;
			} catch (error) {
				console.log("err", error);
			}
		},
		async getAllVeternaryVisits() {
			this.resetStatuses();
			try {
				const response = await instance.get("/farmstatus");
				this.veternaryvisits = response.data.data;
			} catch (error) {
				console.log("err", error);
			}
		},
		async getVeternaryVisitsByVet(vetId: string) {
			this.resetStatuses();
			try {
				const response = await instance.get(`/farmstatus/veternary/${vetId}`);
				this.veternaryvisits = response.data.data;
			} catch (error) {
				console.log("err", error);
			}
		},
		async getAllTransactions(q: string = "") {
			this.resetStatuses();
			try {
				const response = await instance.get(`/transactions?q=${q}`);
				this.transactions = response.data.data;
			} catch (error) {
				console.log("err", error);
			}
		},
		async getAllTransactionsByFarmer(farmerId: string) {
			this.resetStatuses();
			try {
				const response = await instance.get(`/transactions/farmer/${farmerId}`);
				this.transactions = response.data.data;
			} catch (error) {
				console.log("err", error);
			}
		},
		async getAllTransactionsBySupplier(supplierId: string) {
			this.resetStatuses();
			try {
				const response = await instance.get(`/transactions/supplier/${supplierId}`);
				this.transactions = response.data.data;
			} catch (error) {
				console.log("err", error);
			}
		},
		async deleteItem(deleteUrl: string) {
			this.resetStatuses();

			try {
				await instance.delete(deleteUrl);
				notify;
			} catch (error) {
				console.log("err", error);
			}
		},
		async updateStatus(updateUrl: string, data: any) {
			this.resetStatuses();
			try {
				this.loading = true;
				const response = await instance.patch(updateUrl, data);
				notify("success", "Status updated", response.data.message);
			} catch (error: any) {
				console.log("err", error);
				notify("error", "Failed", error.response.data.message);
			} finally {
				this.loading = false;
			}
		},
		async updateEntity(updateUrl: string, data) {
			this.resetStatuses();
			try {
				this.loading = true;
				const response = await instance.patch(updateUrl, data);
				notify("success", "Success !!!", response.data.message);
			} catch (error) {
				notify("error", "Error", "error updating item");
			} finally {
				this.loading = false;
			}
		},
		setViewableItem(itemId: string | null) {
			console.log("running here");

			this.viewableItemId = itemId;
		},
		resetStatuses() {
			this.success = false;
			this.failure = false;
			this.loading = false;
		},
	},
});
