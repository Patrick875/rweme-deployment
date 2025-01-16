<template>
    <p class="auth-text">Provide these details to reset your password</p>
    <div>
        <a-form :model="resetPasswordForm" autocomplete="off" name="basic" :label-col="{ span: 24 }"
            :wrapper-col="{ span: 24 }">
            <a-form-item label="New password" name="newPassword">
                <a-input-password class="input" v-model:value="resetPasswordForm.newPassword" />
            </a-form-item>
            <a-form-item label="Comfirm password" name="comfirmPassword" :rules="[
                { required: true, message: 'Please confirm your password!' },
                { validator: validateConfirmPassword }
            ]" validate-trigger="change">
                <a-input-password class="input" v-model:value="resetPasswordForm.comfirmPassword" />
            </a-form-item>
            <a-button class="auth-btn" @click="resetPassword" :loading="resetPasswordLoading">Change
                Password</a-button>
        </a-form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import instance from '../api'
import { notify } from '../utils/notify'
const resetPasswordLoading = ref<boolean>(false)
const route = useRoute()
const router = useRouter()
interface IresetPasswordForm {
    newPassword: string,
    comfirmPassword: string
}
const resetPasswordForm = ref<IresetPasswordForm>({
    newPassword: '',
    comfirmPassword: ''
})
const validateConfirmPassword = async (_rule: any, value: string) => {
    if (resetPasswordForm.value.newPassword != value) {
        return Promise.reject('The two passwords must much')
    }
    return Promise.resolve()
}
const resetPassword = async () => {
    resetPasswordLoading.value = true
    await instance.post(`/auth/forgotPassword/${route.params.email}/${route.params.token}`, { newPassword: resetPasswordForm.value.newPassword })
        .then(() => {
            notify('success', 'Success', 'Password reset succesfuly.Please procede to the login page.')
            resetPasswordLoading.value = false
            setTimeout(() => {
                router.replace('/auth/login')
            }, 4000);
        }).catch((err) => {
            console.log('err', err);
            notify('error', 'Failed', 'Password reset failed')
            resetPasswordLoading.value = false
        })
}
</script>

<style scoped lang='scss'>
@import "../styles/auth"
</style>