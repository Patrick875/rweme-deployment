<template>
    <div class='complete-stage'>
        <div>
            <v-icon class="complete-icon" name="bi-patch-check"></v-icon>
            <p class='success-content'>SUCCESS !!!</p>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.complete-stage{
    display:flex;
    justify-content:center
}
.complete-icon{
width:300px;
height:300px;
color:rgba(28, 130, 23, 0.68);
}
.success-content{
color:rgba(28, 130, 23, 0.68);
text-align:center;

}
</style>