<template>
    <back-button></back-button>
    <div class="actions-cont">
        <div>
            <p class="actions-label">Actions</p>
        </div>
        <div class="actions">
            <a-button>Update Details</a-button>
            <a-button>Deactivate</a-button>
            <a-button>Delete</a-button>
        </div>
    </div>
    <a-tabs v-model:activeKey="activeKey">

        <a-tab-pane key="1" tab="Farmer">
            <div>
                <p class="page-header">FARMER DETAILS</p>
                <div class='farmer'>
                    <div>
                        <p class='details-header'>Contact details</p>
                        <div class='details-group'>
                            <p v-if="farmer">Names: {{ farmer.fullName }}</p>
                            <p v-if="farmer">Telephone: {{ farmer.telephone }}</p>
                            <p v-if="farmer && farmer.email">Email : {{ farmer.email }}</p>
                        </div>
                    </div>
                    <div>
                        <p class='details-header'>Farm details</p>
                        <div class='details-group'>
                            <p v-if="farmer">Current Number of Chicken : {{ farmer.numberOfChicken }}</p>
                            <p v-if="farmer">Joined At :{{ new Date(farmer.createdAt).toLocaleDateString('fr-FR') }}</p>
                        </div>
                    </div>
                    <div>
                        <p class='details-header'>Address</p>
                        <div class='details-group'>
                            <p v-if="farmer">Address : {{ farmer.Village.name }}</p>
                            <p v-if="farmer">Cell:{{ farmer.Village.Cell.name }} </p>
                            <p v-if="farmer">Sector: {{ farmer.Village.sector.name }}</p>
                            <p v-if="farmer">District: {{ farmer.Village.District.name }}</p>
                            <p v-if="farmer">Province : {{ farmer.Village.Province.name }} </p>
                        </div>
                    </div>
                </div>

            </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="Farm status">
            <div class='farmstatuses'>
                <div class="farm-status-header">
                    <p class="actions-label">Farm Status</p>
                    <div class='actions-btns'>
                        <a-button class='add-record' @click="() => isToggleAddStatusModal = true">
                            <v-icon name="io-add-circle-outline"></v-icon>
                            Record farm status</a-button>

                    </div>

                </div>
                <div>
                    <Table :title="'Farm records'" :length="String(farmRecords.length)" :data="farmRecords"
                        :columns="columns" />
                </div>

            </div>
        </a-tab-pane>
        <a-tab-pane key="3" tab="Feed requests">
            <div class='farmstatuses'>
                <div class="farm-status-header">
                    <p class="actions-label">Food Requests</p>
                    <div class='actions-btns'>
                        <a-button class='add-record' @click="() => isToggleFoodRequestModal = true">
                            <v-icon name="io-add-circle-outline"></v-icon>
                            Request food</a-button>
                    </div>
                </div>
                <Table :data="feedRequests" :title="'Feed Requests'" :length="String(feedRequests.length)"
                    :handle-table-search="handleSearch" :handleViewDetails="openFoodRequest" :user-can-delete="false"
                    :columns="foodReqColumns" />
            </div>
        </a-tab-pane>
        <a-tab-pane key="4" tab="Contracts">
            <div v-if="farmerContracts.length > 0">
                <div v-for="(contract, i) in farmerContracts" :key="i + 1" class='contract-item'>
                    <div class='contract-list-item'>
                        <v-icon style='height:1.5em; width:1.5em' name="vi-file-type-pdf2"></v-icon>

                        <p> {{ `${farmer.fullName} _` + new Date(contract.createdAt).toString() }}</p>
                    </div>
                    <a :href="contract.contractLink" target="_blank">Download</a>
                </div>
            </div>
            <div v-else>
                <p style='text-align:center'>No data available</p>
            </div>
        </a-tab-pane>
    </a-tabs>
    <AddFarmStatusModel :isToggleAddStatusModal="isToggleAddStatusModal" :cancelButton="closeModal" :farmerId="farmerId"
        :chickenTypeId="chickenType" />
    <FoodRequestModal :cancelButton="() => isToggleFoodRequestModal = false"
        :isToggleFoodRequestModal="isToggleFoodRequestModal" :farmerId="farmerId" />
    <FoodRequestDetailsModal v-if='viewableFoodRequest' :cancelButton="() => isViewFoodRequest = false"
        :isToggleFoodRequestModal="isViewFoodRequest && viewableFoodRequest"
        :viewableFoodRequest="viewableFoodRequest.value" :viewableFoodRequestId="viewableItemId" :loading="loading"
        :foodRequest="viewableFoodRequest.value" />
</template>
<script setup lang='ts'>
import { onMounted, watch, watchEffect, ref, computed } from 'vue'
import { useRoute } from 'vue-router';
import { useEntitiesStore } from '../store/entities.store';
import FoodRequestModal from '../components/FoodRequestModal.vue';
import Table from '../components/Table.vue';
const entitiesStore = useEntitiesStore()
entitiesStore.getTypesOfChicken()
const farmer = computed(() => entitiesStore.farmer)
const farmRecords = computed(() => entitiesStore.farmer ? entitiesStore.farmer.FarmStatuses.map((el) => ({
    chickenType: el.TypeOfChicken?.name.toUpperCase(),
    numberOfChicken: el.numberOfChicken,
    chickenHealthCondition: el.chickenHealth,
    amountOfFeedOnDailyBasisPerChicken: el.amountOfFeedOnDailyBasisPerChicken,
    hasInsurance: el.hasInsurance ? 'YES' : 'NO',
    recordedBy: el.collectedBy ? el.collectedBy.fullName : 'N/A',
    recordedOn: new Date(el.recordedOn).toLocaleDateString('fr-FR')
})) : [])
const isViewFoodRequest = ref<boolean>(false)
const viewableFoodRequest: any = ref<null>
const loading = ref<boolean>(false)
const viewableItemId = computed(() => entitiesStore.viewableItemId)

const handleSearch = (q: string) => {
    entitiesStore.getRequestsByFarmer(farmerId, q)
}

const openFoodRequest = (record: any) => {
    viewableFoodRequest.value = record
    isViewFoodRequest.value = true
}

const foodRequests = computed(() => entitiesStore.foodrequests.map((el) => ({
    ...el,
    farmerName: el.Farmer.fullName,
    typeoffeed: el.TypeOfFeed.name,
    quantity: el.quantityOfFeed,
    price: el.price,
    supplierName: el.Supplier.User.fullName,
    deliveryStatus: el.deliveryStatus,
    submittedOn: new Date(el.createdAt).toLocaleDateString('fr-FR'),
    isFoodRequest: true,
    id: el.id,
})))


const typeOfChicken = computed(() => entitiesStore.typeofchicken)


const activeKey = ref('1');
const route = useRoute()
const farmerId = route.params.farmerId as string;
const isToggleAddStatusModal = ref<boolean>(false)
const isToggleFoodRequestModal = ref<boolean>(false)
const closeModal = () => {
    isToggleAddStatusModal.value = false
}
entitiesStore.getRequestsByFarmer(farmerId)

const foodReqColumns = [
    {
        title: 'Farmer',
        dataIndex: 'farmerName',
        key: 'farmerName'
    },
    {
        title: 'Type of feed',
        dataIndex: 'typeoffeed',
        key: 'typeoffeed'
    },
    {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantityOfFeed'
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'priceOfFeed'
    },
    {
        title: 'Supplier',
        dataIndex: 'supplierName',
        key: 'supplierName'
    },
    {
        title: 'Submitted On',
        dataIndex: 'submittedOn',
        key: 'submittedOn'
    },
    {
        title: 'Submitted By',
        dataIndex: 'submittedBy',
        key: 'submittedBy'
    },
    {
        title: 'Status',
        dataIndex: 'deliveryStatus',
        key: 'deliveryStatus'
    },
    {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'action'
    }
]

const columns = [
    {
        title: 'Type Of Chicken',
        dataIndex: 'chickenType',
        key: 'chickenType'
    },
    {
        title: 'Number Of Chicken',
        dataIndex: 'numberOfChicken',
        key: 'numberOfChicken'
    },
    {
        title: 'Chicken health condition',
        dataIndex: 'chickenHealthCondition',
        key: 'chickenHealthCondition'
    },
    {
        title: 'Has Insurance',
        dataIndex: 'hasInsurance',
        key: 'hasInsurance'
    },
    {
        title: 'Amount of feed/chicken/day',
        dataIndex: 'amountOfFeedOnDailyBasisPerChicken',
        key: 'amountOfFeedOnDailyBasisPerChicken'
    },
    {
        title: 'Recorded By',
        dataIndex: 'recordedBy',
        key: 'recordedBy'
    },
    {
        title: 'Recorded on',
        dataIndex: 'recordedOn',
        key: 'recordedOn'
    }

]
const chickenType = ref<string | null>('')
const feedRequests = ref<any[]>([])
const farmerContracts = ref<any[]>([])
watchEffect(() => {
    if (farmer.value && typeOfChicken.value) {
        chickenType.value = typeOfChicken.value.find((el) => el.id === farmer.value.TypeOfChickenId)?.id
        feedRequests.value = foodRequests.value
        farmerContracts.value = farmer.value.FarmerContracts
    }
})

watch([farmerId], () => {
    entitiesStore.getFarmer(farmerId)
})
onMounted(() => {
    entitiesStore.getFarmer(farmerId)
})

</script>
<style scoped lang='scss'>
.page-header {
    padding-block: 1em;
    font-weight: bold;
    text-align: center;
}

.farmer {
    // display: flex;
    // justify-content: space-between;
    padding-block: 1em;
    background-color: white;
}

.actions-label {
    font-weight: bold;
    padding-left: 1em;
}

.actions-cont,
.actions {
    margin-block: 1em;
    //padding-block: 1em;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.actions-btns {
    display: flex;
    gap: 1em;
    align-items: center;

}

.actions {
    justify-content: normal;
    gap: 1em;
}

.details-group {
    padding: 1em;
    padding-block: 0.5em;
    border-radius: 0.75em;
}

.details-header {
    padding: 1em;
    font-weight: bold;
    background-color: rgb(253, 253, 253);

}

.farm-status-header {
    margin-block: 0.5em;
    padding-block: 0.5em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;


}

.add-record {
    display: flex;
    align-items: center;
    gap: 1em;
    font-weight: 600
}

p {
    margin-block: 0.15em;
}

.contract-item {
    width: 100%;
    // padding:8px;
    // padding-inline:16px;
    border-radius: 4px;
    background-color: white;
    display: flex;
    padding-block: 0.75em;
    justify-content: space-between;

    a {
        display: block;
        text-decoration: none;
        color: black;
        margin-right: 1em;

    }

    .contract-list-item {
        display: flex;
        gap: 1em;
    }
}
</style>