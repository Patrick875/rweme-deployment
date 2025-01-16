<template>
    <div class='logo-container logo-center'>
        <img src="./../assets/Rweme Logo.svg" class="logo" alt="rweme-platform-logo" />
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.logo-center {
    display: flex;
    justify-content: center;
}

.logo-container {
    height: 200px;
    width: 100px;
    margin: 0;

    img {
        object-fit: cover;
        margin: 0;
    }

}
</style>