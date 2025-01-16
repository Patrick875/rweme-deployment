import { ref, onMounted, onBeforeUnmount } from "vue";

export function useScreenSize() {
	const isSmallScreen = ref(window.innerWidth <= 800);
	const checkScreenSize = () => {
		isSmallScreen.value = window.innerWidth <= 800;
	};
	onMounted(() => {
		window.addEventListener("resize", checkScreenSize);
	});
	onBeforeUnmount(() => {
		window.removeEventListener("resize", checkScreenSize);
	});
	return {
		isSmallScreen,
	};
}
