<template>
    <p class="auth-text">Please Enter your Email or Telephone </p>
    <div>
        <a-form :model="formState" @finish="submit" layout="vertical" :label-col="{ span: 24 }"
            :wrapper-col="{ span: 24 }" autocomplete="off">
            <a-form-item label="Email/Tel" name="auth"
                :rules="[{ required: true, message: 'Please input your email/telephone!' }]">
                <a-input v-model:value="formState.auth" />
            </a-form-item>
            <a href="/auth/login" class="forgot-password-text">Login</a>

            <a-button class='auth-btn' :loading="loading" @click="submit">SUBMIT</a-button>
        </a-form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import instance from '../api';
import { notify } from '../utils/notify';
interface formState {
    auth: string;
}
const loading = ref<boolean>(false);
const router = useRouter()
const formState = ref<formState>({
    auth: "",
})
const submit = async () => {
    loading.value = true;
    try {
        await instance.post('/auth/initiateForgotPassword', { login: formState.value.auth }).then((res) => {
            notify('success', 'Success !!!', res.data.message)
            setTimeout(() => {
                router.replace('/auth/login')
            }, 4000);
        })
    } catch (error: any) {
        notify('error', 'Error !!!', error.response.data.message)

    } finally {
        loading.value = false
        formState.value.auth = ''
    }
}

</script>

<style lang="scss" scoped>
@import "../styles/auth"
</style>