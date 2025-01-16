<template>
    <div class='container'>
        <apexchart type="donut" :options="options" :series="Object.values(props.data)"></apexchart>
    </div>
</template>
<script setup lang='ts'>
const props = defineProps({
    data: {
        type: Object,
        default: {}
    }
})
const options = {
    chart: {
        width: '100px',
        height: '300px',
    },
    chartOptions: {
        labels: Object.keys(props.data),
    },
    labels: Object.keys(props.data),

};




</script>
<style scoped lang='scss'>
.container {
    width: 400px;

    @media(max-width:800px) {
        width: 80%;
        margin-inline: auto
    }
}
</style>