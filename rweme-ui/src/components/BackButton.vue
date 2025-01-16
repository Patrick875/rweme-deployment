<template>
    <a-button class='back-btn' @click="router.back()">
        <v-icon  name="bi-arrow-left"></v-icon>
        <p>Back</p>
    </a-button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter()

</script>

<style scoped lang='scss'>
.back-btn {
    display: flex;
    align-items: center;
    gap: 1em;
    background-color: rgb(59, 130, 246);
    color: white;
    padding-inline:1.2em;
    margin-block:1.2em;
    &:hover{
        color:white;
        // background-color:rgb(59, 130, 246);
    }
}

</style>