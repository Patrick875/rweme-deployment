<template>
    <div class="otp-confirm-container">
        <div class="otp-confirm-header">
            <p class="otp-header">Verification Code</p>
            <p class="otp-description">
                To confirm farmer agreement, input the verification code sent to the
                farmer's mobile number
            </p>
            <div class="otp-input-group">

                <OTPPad @entered="(v) => otpValue = v" />
            </div>
            <a-button class="submit-btn" @click="submitOtp" :loading="loading" :disabled="!isOtpComplete">
                SUBMIT
            </a-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import instance from "../api";
import { notify } from '../utils/notify';
import OTPPad from './OTPPad.vue';


const otpValue = ref('');
const props = defineProps({
    cancelButton: {
        type: Function,
        default: () => { }
    },
    next: {
        type: Function,
        default: () => { }
    }
})



const loading = ref<boolean>(false)




// Computed property to check if OTP is complete
const isOtpComplete = computed(() => {
    return otpValue.value.length === 6
})


const submitOtp = async () => {
    loading.value = true

    console.log('otp-value', otpValue.value);

    if (otpValue.value.length === 6 && /^\d{6}$/.test(otpValue.value)) {
        try {
            const response = await instance.post('/farmers/otpconfirm', { otp: otpValue.value })
            notify('success', 'Success', response.data.message)
            setTimeout(() => {
                props.cancelButton()
                props.next()
            }, 3500)

        } catch (error) {
            console.error('OTP Confirmation Failed:', error)
            notify('error', 'OTP Confirmation Failed', '')
            setTimeout(() => {
                props.cancelButton()
            }, 3500)
        } finally {

        }
    } else {
        console.error('Invalid OTP')
    }
    loading.value = false
}


</script>

<style lang="scss" scoped>
.otp-confirm-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 400px;
    margin: 0 auto;
}

.otp-confirm-header {
    text-align: center;
    width: 100%;

    .otp-header {
        font-weight: bold;
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
    }

    .otp-description {
        color: #666;
        margin-bottom: 1rem;
    }
}

.otp-input-group {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 1rem;
}

.otp-input {
    width: 32px;
    height: 32px;
    text-align: center;
    border: none;
    border-bottom: 1.5px solid #d2d2d2;
    font-size: 1rem;
    transition: border-color 0.3s ease;

    &:focus {
        outline: none;
        border-bottom-color: #007bff;
    }
}

.submit-btn {
    width: 100%;
    height: 34px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }

    &:hover:not(:disabled) {
        background-color: #0056b3;
        color: white;
    }
}
</style>