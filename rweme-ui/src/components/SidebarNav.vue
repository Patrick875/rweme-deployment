<template>
    <aside class="sidebar">
        <div class='sidelogo-container'>
            <img src="./../assets/Rweme Logo.svg" class="logo" alt="rweme-platform-logo" />
            <v-icon v-if="isSmallScreen" name="io-close-outline" @click="props.closeNav" />
        </div>
        <a-menu mode="inline" :selectedKeys="[selectedKey]" @click="handleMenuClick">
            <a-menu-item key="Dashboard">
                <template #icon>
                    <v-icon name="md-dashboard-outlined" />
                </template>
                <router-link to="/"><span>Dashboard</span></router-link>
            </a-menu-item>
            <a-menu-item key="Feed Requests" v-if="!isVeternary">
                <template #icon>
                    <v-icon name="gi-stabbed-note" />
                </template>
                <router-link to="/feedrequests"><span>Feed Requests</span></router-link>
            </a-menu-item>
            <a-menu-item key="Appointments" v-if="!isSupplier">
                <template #icon>
                    <v-icon name="gi-stabbed-note" />
                </template>
                <router-link to="/appointments"><span>Appointments</span></router-link>
            </a-menu-item>
            <a-menu-item key="Farmers" v-if="!isSupplier">
                <template #icon>
                    <v-icon name="gi-farm-tractor" />
                </template>
                <router-link to="/farmers"><span>All Farmers</span></router-link>
            </a-menu-item>
            <a-menu-item key="Veterinaries" v-if="!isVeternary && !isSupplier">
                <template #icon>
                    <v-icon name="fa-user-md" />
                </template>
                <router-link to="/veterinaries">All Veterinaries</router-link>
            </a-menu-item>
            <a-menu-item key="Suppliers" v-if="!isSupplier && !isVeternary">
                <template #icon>
                    <v-icon name="fa-user-tie" />
                </template>
                <router-link to="/suppliers">All Suppliers</router-link>
            </a-menu-item>
            <a-menu-item key="Transactions" v-if="!isVeternary">
                <template #icon>
                    <v-icon name="si-cashapp" />
                </template>
                <router-link to="/transactions">Transactions</router-link>
            </a-menu-item>
            <a-menu-item key="Settings" v-if="!isVeternary && !isSupplier">
                <template #icon>
                    <v-icon name="ri-settings-5-line" />
                </template>
                <router-link to="/settings">Settings</router-link>
            </a-menu-item>
        </a-menu>
    </aside>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../store/auth.store';
import { userRoles } from '../utils/enums';
import { useScreenSize } from '../utils/useScreenSize';

const route = useRoute();
const authStore = useAuthStore()
const logedInUser = computed(() => authStore.user)
const selectedKey = ref("Dashboard");
const isSupplier = logedInUser.value?.role === userRoles.supplier;
const isVeternary = logedInUser.value?.role === userRoles.veternary
const { isSmallScreen } = useScreenSize()
const props = defineProps({
    closeNav: {
        type: Function,
        default: () => { }
    }
})

const updateSelectedKey = () => {
    const path = route.path;
    if (path.startsWith('/farmers')) {
        selectedKey.value = "Farmers";
    } else if (path.startsWith('/feedrequests')) {
        selectedKey.value = "Feed Requests";
    }
    else if (path.startsWith('/veterinaries')) {
        selectedKey.value = "Veterinaries";
    } else if (path.startsWith('/suppliers')) {
        selectedKey.value = "Suppliers";
    } else if (path.startsWith('/transactions')) {
        selectedKey.value = "Transactions";
    }
    else if (path.startsWith('/appointments')) {
        selectedKey.value = "Appointments";
    }
    else if (path.startsWith('/settings')) {
        selectedKey.value = "Settings";
    }
    else if (path === '/') {
        selectedKey.value = "Dashboard";
    }
    else {
        selectedKey.value = "Dashboard";
    }
};

// Watch for changes in the route and update the selected key
watch(
    () => route.path,
    () => {
        updateSelectedKey();
    }
);
onMounted(() => {
    // Initialize on mount
    updateSelectedKey();
})


const handleMenuClick = (e) => {
    selectedKey.value = e.key;
    props.closeNav()

};
</script>

<style scoped lang="scss">
@import "./../styles/layout"
</style>