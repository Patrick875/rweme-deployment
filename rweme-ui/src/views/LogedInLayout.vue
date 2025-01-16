<!-- MainLayout.vue -->
<template>
    <div class="layout">
        <div class='sidenavbar'>
            <sidebar-nav v-if="!isSmallScreen" />
        </div>
        <main class="main-content">
            <AdminNavbar />
            <div class='page-container'>
                <router-view />
            </div>
        </main>
    </div>
</template>
<script setup lang='ts'>
import AdminNavbar from './AdminNavbar.vue';
import { useScreenSize } from '../utils/useScreenSize';
const { isSmallScreen } = useScreenSize()
</script>
<style scoped lang="scss">
@import "./../styles/layout"
</style>
