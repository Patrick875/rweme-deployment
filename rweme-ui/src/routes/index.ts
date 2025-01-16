import { createRouter, createWebHistory } from "vue-router";
import authRoutes from "./auth";
import adminRoutes from "./admin";
import supplierRoutes from "./supplier";
import veternaryRoutes from "./veternary";

const routes = [...authRoutes, ...adminRoutes, ...supplierRoutes, ...veternaryRoutes];
const router = createRouter({
	history: createWebHistory(),
	routes,
});

// router.beforeEach((to,from,next)=>{
// 	if(to='')
// })

export default router;
