<template>
    <p class="auth-text">Provide these details to comfirm your account</p>
    <div>
        <a-form :model="formState" @finish="accountComfirm" layout="vertical" autocomplete="off">
            <a-form-item label="Email" name="email" :rules="[{ required: true, message: 'Please enter your email' }]">
                <a-input v-model:value="formState.email" />
            </a-form-item>
            <a-form-item label="Verification code" name="verificationCode"
                :rules="[{ required: true, message: 'Please enter the verification code' }]">
                <a-input type="text" v-model:value="formState.verificationCode" />
            </a-form-item>
            <a-form-item>
                <a-button :loading="loading" htmlType="submit" class="auth-btn">
                    SUBMIT
                </a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { comfirmAccount } from '../api/auth';
import { useRoute, useRouter } from 'vue-router';

interface FormState {
    email: string;
    verificationCode: string;
}

const router = useRouter();
const route = useRoute()


const loading = ref<boolean>(false);

const formState = reactive<FormState>({
    email: "",
    verificationCode: ""
});

const accountComfirm = async (values: FormState) => {
    loading.value = true;
    try {
        await comfirmAccount(values).then(() => {
            setTimeout(() => {
                router.replace('/auth/login')
            }, 4000);
        })
    } catch (error) {

    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    formState.email = route.query.email as string
})


</script>

<style lang="scss" scoped>
@import "../styles/auth";
</style>
