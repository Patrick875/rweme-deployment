<template>
    <div class="auth-container">
        <div class="auth-backg">
            <img src="./../assets/chicken-farm-backg.jpg" alt="auth-img" />
        </div>
        <div class="auth-form-container">
            <div class="auth-form">
                <div class="auth-form-header">
                    <div class="logo-container" @click="toLoginPage">
                        <logo></logo>
                    </div>
                    <p class="auth-form-header--text">{{ routeName.toUpperCase() }}</p>
                </div>
                <router-view />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter()
const routeName = ref<string>(route.name as string)

const toLoginPage = () => {
    router.replace('/auth/login')
}
</script>

<style scoped>
@import './../styles/_auth.scss'
</style>