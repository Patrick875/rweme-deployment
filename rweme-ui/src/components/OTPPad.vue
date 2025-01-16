<template>
    <div ref="container" class="otp-container">
        <a-input class="otpBox" @keyup="(e) => handleEnter(e, n - 1)" v-for="n in length" :key="n"
            v-model:value="otpArray[n - 1]" maxlength="1" type="text" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
const otpProps = defineProps({
    length: {
        type: Number,
        default: 6
    }
})
const otpArray = ref<any[]>([])
const container = ref()
const otpEmit = defineEmits(['entered'])
const handleEnter = (e, i) => {
    const children = container.value.children;
    const keypressed = e.key
    if (i > 0 && keypressed === 'Backspace' || keypressed == 'Delete') {
        otpArray.value[i] = null
        setTimeout(() => {
            children[i - 1].focus()

        }, 100)
    } else {
        const matched = keypressed.match(/^[0-9]$/);
        if (!matched) {
            otpArray.value[i] = null
            return
        } else if (i < otpProps.length - 1) {
            setTimeout(() => {
                children[i + 1].focus()
            }, 100)
        }
        checkOTP()
    }
}
function checkOTP() {
    const children = container.value.children;
    let flag = true;
    for (let i = 0; i < otpProps.length - 1; i++) {
        if (otpArray.value[i] == null) {
            children[i].classList.add('empty-box')
            flag = false

        } else {
            children[i].classList.remove('empty-box')
        }
    }
    if (flag) {
        otpEmit('entered', otpArray.value.join(''))
    }
}
// function clearBorder() {
//     const children = container.value.children;
//     for (let i = 0; i < otpProps.length - 1; i++) {
//         if (otpArray.value[i] == null) {
//         }
//     }

// }
onMounted(() => {
    for (let i = 0; i < otpProps.length; i++) {
        otpArray.value[i] = null;
    }
})
</script>

<style scoped lang="scss">
.otpBox {
    border-radius: 8px;
    border-color: #e5e7eb;
    border-width: 2px;
    border-left-width: 2px;
    outline: none;
    width: 24px;
    height: 26px;
    padding: 4px;

    &:focus {
        border-color: #0369a1;
    }
}

.otp-container {
    display: flex;
    gap: 0.5em;
    align-items: center;
}

.empty-box {
    border-color: #ef4444;
}
</style>