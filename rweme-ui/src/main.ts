import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "./style.css";
import App from "./App.vue";
import router from "./routes";
import VueApexCharts from "vue3-apexcharts";
import { OhVueIcon, addIcons } from "oh-vue-icons";

import {
	BiArrowLeft,
	GiStabbedNote,
	IoAddCircleOutline,
	BiPatchCheck,
	BiEye,
	BiEyeSlash,
	MdDashboardOutlined,
	IoCloseOutline,
	IoClose,
	RiDeleteBin7Line,
	CoCheckAlt,
	GiFarmTractor,
	FaUserMd,
	FaEdit,
	FaUserTie,
	LaEditSolid,
	SiCashapp,
	RiSettings5Line,
	HiSolidUserCircle,
	MdPersonpinRound,
	BiPersonBadgeFill,
	BiPersonLinesFill,
	RiNewspaperFill,
	MdStoreRound,
	ViFileTypePdf2,
	CoHamburgerMenu,
	BiLock,
	RiLogoutBoxLine,
	LaFilterSolid,
	HiDocumentDownload,
	MdRotateleftOutlined,
} from "oh-vue-icons/icons";

addIcons(
	BiArrowLeft,
	MdStoreRound,
	RiNewspaperFill,
	BiPersonLinesFill,
	MdPersonpinRound,
	BiPersonBadgeFill,
	BiEyeSlash,
	GiStabbedNote,
	FaEdit,
	IoAddCircleOutline,
	BiPatchCheck,
	BiEye,
	CoCheckAlt,
	MdDashboardOutlined,
	IoCloseOutline,
	IoClose,
	GiFarmTractor,
	FaUserMd,
	FaUserTie,
	LaEditSolid,
	SiCashapp,
	RiDeleteBin7Line,
	RiSettings5Line,
	HiSolidUserCircle,
	ViFileTypePdf2,
	CoHamburgerMenu,
	BiLock,
	RiLogoutBoxLine,
	LaFilterSolid,
	HiDocumentDownload,
	MdRotateleftOutlined,
	IoAddCircleOutline
);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

createApp(App).component("v-icon", OhVueIcon).use(VueApexCharts).use(pinia).use(router).mount("#app");
