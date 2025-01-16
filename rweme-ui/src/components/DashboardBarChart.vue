<template>
    <div class='container'>
        <apexchart type="bar" :height="'100%'" :width="'100%'" :options="chartOptions" :series="series">
        </apexchart>
    </div>
</template>
<script setup lang='ts'>
const props = defineProps({
    categories: {
        type: Array,
        default: []
    },
    data: {
        type: Array,
        default: []
    }
})

const chartOptions = {
    stroke: { width: 0 },
    dataLabels: {
        enabled: false,
        offset: 0,
        style: { fontSize: "12px", fontWeight: "normal" },
    },
    legend: {
        position: 'bottom',
        horizontalAlign: 'center',
    },
    plotOptions: {
        bar: {
            horizontal: false,
            distributed: true
        }
    },
    colors: ['#0369a1', '#dc2626', '#facc15', '#2e1065'],
    xaxis: {
        categories: props.categories
    },

};
const series = [{
    name: 'series-1',
    data: props.data
}]



</script>
<style scoped lang='scss'>
.container {
    width: 400px;

    @media (max-width:800px) {
        width: 300px;
        margin-inline: auto;
        min-height: 300px;
    }
}
</style>