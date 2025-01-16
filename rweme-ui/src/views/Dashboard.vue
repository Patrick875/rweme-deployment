<template>
    <div>
        <div class='dashboard-header'>
            <p class='title'>
                Dashboard
            </p>
            <div class='dash-header-actions'>
                <a-button>Export</a-button>
            </div>
        </div>
        <!-- <div class='dash-statistics'>
            <div class='dash-card'>
                <p class='dash-card-header'>Total incomes</p>
                <p class='dash-card-body'>$2000</p>
                <p class='dash-card-footer'>Target $4800</p>
            </div>
            <div class='dash-card'>
                <p class='dash-card-header'>Total Expenses</p>
                <p class='dash-card-body'>$3000</p>
                <p class='dash-card-footer'>Target $2000</p>
            </div>
            <div class='dash-card'>
                <p class='dash-card-header'>Total Transactions</p>
                <p class='dash-card-body'>86</p>
                <p class='dash-card-footer'>Target $2000</p>
            </div>
            <div class='dash-card'>
                <p class='dash-card-header'>Farmers with Insurance</p>
                <p class='dash-card-body'>70%</p>
                <p class='dash-card-footer'>Target 80%</p>
            </div>
        </div> -->
        <div class='dash-statistics'>
            <div class='dash-card' v-show="!isVeternary">
                <p class='dash-card-header'>
                    <img src="./../assets/icon-1.svg" class="" alt="Veternaries" />
                </p>
                <p class='dash-card-footer'>Veternaries</p>
                <p class='dash-card-body'>{{ dashboardData?.veternaries }}</p>
            </div>
            <div class='dash-card'>
                <p class='dash-card-header'>
                    <img src="./../assets/icon-3.svg" class="" alt="Farmers" />
                </p>
                <p class='dash-card-footer'>All Farmers</p>
                <p class='dash-card-body'>{{ dashboardData?.farmers }}</p>
            </div>
            <div class='dash-card' v-show="isVeternary">
                <p class='dash-card-header'>
                    <img src="./../assets/icon-3.svg" class="" alt="Farmers" />
                </p>
                <p class='dash-card-footer'>All Farmers Assigned to</p>
                <p class='dash-card-body'>{{ farmersAssignedCount }}</p>
            </div>
            <div class='dash-card' v-show="!isVeternary">
                <p class='dash-card-header'>
                    <img src="./../assets/icon-2.svg" class="" alt="Suppliers" />

                </p>
                <p class='dash-card-footer'>Suppliers</p>
                <p class='dash-card-body'> {{ dashboardData?.suppliers }}</p>
            </div>
            <div class='dash-card' v-show="isVeternary">
                <p class='dash-card-header'>
                    <img src="./../assets/icon-4.svg" class="" alt="Appointments" />
                </p>
                <p class='dash-card-footer'>Appointments</p>
                <p class='dash-card-body'>{{ appointmentsCount }}</p>
            </div>
            <div class='dash-card' v-show="!isVeternary">
                <p class='dash-card-header'>
                    <img src="./../assets/icon-5.svg" class="" alt="onboarding" />
                </p>
                <p class='dash-card-footer'>Onboarding</p>
                <p class='dash-card-body'>46</p>
            </div>

        </div>
        <div class='dash-graphs' v-if="provinceCounts.length > 0">
            <div class="dash-pie" v-if="Object.values(typeOfFeedStats).length > 0">
                <dashboard-pie :data="typeOfFeedStats"></dashboard-pie>
            </div>
            <div class="dash-histogram">
                <dashboard-bar-chart :data="provinceCounts" :categories="chartCategories"></dashboard-bar-chart>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, watchEffect, ref } from 'vue';
import { useEntitiesStore } from '../store/entities.store';
import { useAuthStore } from '../store/auth.store'
import { userRoles } from '../utils/enums';

const authStore = useAuthStore()
const logedInUser = computed(() => authStore.user)
const isVeternary = logedInUser.value?.role === userRoles.veternary

const entitiesStore = useEntitiesStore();
const dashboardData = computed(() => entitiesStore.dashboardData)
const chartCategories = computed(() => {
    const uniqueProvinces = new Set<string>();
    entitiesStore.dashboardData?.farmersDemographics?.forEach((el) => {
        uniqueProvinces.add(el.Village.Province.name);
    });
    return Array.from(uniqueProvinces);
});
const provinceCounts = ref<number[]>([]);
const appointmentsCount = computed(() => entitiesStore.dashboardData?.appointmentsCount || 0);
const farmersAssignedCount = computed(() => entitiesStore.dashboardData?.farmersAssignedTo || 0);
const typeOfFeedStats = ref<Record<string, number>>({});
const getProvinceCounts = computed(() => {
    const provinceCountMap: Record<string, number> = {};
    entitiesStore.dashboardData?.farmersDemographics.forEach((el) => {
        const provinceName = el.Village.Province.name;
        if (!provinceCountMap[provinceName]) {
            provinceCountMap[provinceName] = 0;
        }
        provinceCountMap[provinceName] += Number(el.count);
    });
    return Object.values(provinceCountMap);
});
const getTypesOfFeedStats = computed(() => {
    const typeOfFeedMap: Record<string, number> = {};
    entitiesStore.dashboardData?.typeOfFeedData.forEach((el) => {
        const feedName = el.TypeOfFeed.name;
        if (!typeOfFeedMap[feedName]) {
            typeOfFeedMap[feedName] = 0;
        }
        typeOfFeedMap[feedName] += Number(el.requests);
    });
    return typeOfFeedMap;
});

watchEffect(() => {
    if (getProvinceCounts.value) {
        provinceCounts.value = getProvinceCounts.value;
        typeOfFeedStats.value = entitiesStore.dashboardData?.typeOfFeedData;
    }
    if (getTypesOfFeedStats.value) {
        typeOfFeedStats.value = getTypesOfFeedStats.value;
    }
})

entitiesStore.getDashbordData();


</script>

<style scoped lang="scss">
.dashboard-header {
    padding-block: 1em;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.title {
    font-size: 1.35em;
    font-weight: 600;

}

.dash-statistics {
    display: flex;
    flex-wrap: wrap;
    flex-grow: 1;
}

.dash-graphs {
    display: flex;

    @media(max-width:800px) {
        display: block;
    }
}

.dash-statistics,
.dash-graphs {
    width: 100%;
    gap: 1.45em;
    margin-bottom: 1.75em;
    font-size: 0.75rem;
}

.dash-card {
    flex-grow: 1;
    background: white;
    padding: 0.5em;
    border-radius: 0.5rem;
}

.dash-card-body {
    font-size: 1.5em;
    padding: 0em;
    margin: 0em;
    font-weight: 500;
    padding-block: 0.15em;
}

.dash-card-header,
.dash-card-footer {
    margin: 0em;
    font-size: 0.875rem;
    color: #2d2d2d
}

.dash-card-header {
    padding: 3px;
    border-radius: 50%;
}

.dash-card-footer {
    padding-block: 0.15em;
}

.dash-pie,
.dash-histogram {
    width: 50%;
    background-color: white;

    @media(max-width:800px) {
        width: 100%;
    }
}
</style>