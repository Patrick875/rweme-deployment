<template>
    <div>
        <Modal :isOpen="props.isToggleAddStatusModal" @modal-close="props.cancelButton" mainHeader="RECORD FARM STATUS"
            subHeader="Please provide the following details to record current farm status"
            :width="isSmallScreen ? '80%' : '550px'">
            <template #content>
                <a-form :model="farmStatus" ref="formRef" name="basic" :label-col="{ span: 24 }"
                    :wrapper-col="{ span: 24 }" autocomplete="off">
                    <a-row :gutter="16">
                        <a-col :span="isSmallScreen ? 24 : 12">
                            <a-form-item v-if="props.byVeternary" class="label-input-height" label="Farmer"
                                name="farmerId" :rules="[{ message: 'Please select farmer' }]">
                                <a-select class="input" type="text" placeholder="Select farmer"
                                    v-model:value="farmStatus.farmerId">
                                    <a-select-option v-for="(farmer, index) in vetFarmers" :key="index"
                                        :value="farmer.key">
                                        {{ farmer.fullName }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="isSmallScreen ? 24 : 12">
                            <a-form-item class="label-input-height" label="Number of Chicken" name="numberOfChicken"
                                :rules="[{ message: 'Please input a valid number' }]">
                                <a-input class="input" type="number" placeholder="Enter the number of chicken"
                                    v-model:value="farmStatus.numberOfChicken" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="isSmallScreen ? 24 : 12">
                            <a-form-item class="label-input-height" label="Amount of feed on daily basis per chicken"
                                name="amountOfFeedOnDailyBasisPerChicken"
                                :rules="[{ message: 'Please fill in the amount of daily feed !' }]">
                                <a-input class="input" type="number" placeholder="Amount of feed/chicken/day"
                                    v-model:value="farmStatus.amountOfFeedOnDailyBasisPerChicken" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="isSmallScreen ? 24 : 12">
                            <a-form-item class="label-input-height" label="Has insurance for chicken"
                                name="hasInsurance" :rules="[{ message: 'Please input select !!' }]">
                                <a-select v-model:value="farmStatus.hasInsurance" :size="'middle'"
                                    placeholder="Please select !!">
                                    <a-select-option :value="'YES'">
                                        YES
                                    </a-select-option>
                                    <a-select-option :value="'NO'">
                                        NO
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="isSmallScreen ? 24 : 12">
                            <a-form-item class="label-input-height" label="Chicken health condition"
                                name="chickenHealthCondition" :rules="[{ message: 'Please select !!' }]">
                                <a-select v-model:value="farmStatus.chickenHealthCondition" :size="'middle'"
                                    placeholder="Please select">
                                    <a-select-option value="Healthy">Healthy</a-select-option>
                                    <a-select-option value="Sick">Sick</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <div class="double-form-btn">
                        <a-button class="cancel-form-btn model-action-btn" danger html-type="button"
                            @click="props.cancelButton">CANCEL</a-button>
                        <a-button :loading="loading" class="btn-auth model-action-btn" @click="addStatus">Record
                            status</a-button>
                    </div>
                </a-form>
            </template>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useEntitiesStore } from '../store/entities.store';
import { useScreenSize } from '../utils/useScreenSize';


interface farmStatus {
    farmerId: string | null
    numberOfChicken: string | null
    amountOfFeedOnDailyBasisPerChicken: string | null
    hasInsurance: string
    chickenHealthCondition: string | null
}

const entitiesStore = useEntitiesStore()

const vetFarmers = computed(() => entitiesStore.vetFarmers?.map(el => ({
    label: el.fullName,
    key: el.id,
    ...el,
})));
const loading = ref<boolean>(false)
const { isSmallScreen } = useScreenSize()
const farmStatus = {
    farmerId: null,
    numberOfChicken: null,
    amountOfFeedOnDailyBasisPerChicken: null,
    hasInsurance: '',
    chickenHealthCondition: ''
}
const props = defineProps({
    isToggleAddStatusModal: {
        type: Boolean,
        default: false
    },
    cancelButton: {
        type: Function,
        default: () => { }
    },
    byVeternary: {
        type: String || null,
        default: null
    },
    farmerId: {
        type: String,
    },
    chickenTypeId: {
        type: String,
    }
})
if (props.byVeternary) {
    entitiesStore.getFarmersAssignedToVet(props.byVeternary)
}
const addStatus = async () => {
    loading.value = true
    const submitData = { ...farmStatus, farmerId: props.farmerId ? props.farmerId : farmStatus.farmerId, chickenTypeId: props.chickenTypeId }
    try {
        await entitiesStore.addFarmStatus(submitData);
    } catch (error) {
        console.log('err', error);
    } finally {
        loading.value = false
    }

}


</script>

<style scoped lang="scss">
.model-action-btn {
    width: 50%;
    height: 3em;
}

.btn-auth {
    background-color: rgba(28, 130, 23, 0.68);
    color: white;
    outline: none;
    border: none;

    &:hover {
        background-color: rgba(28, 130, 23, 1);
        color: white;
    }
}

.cancel-form-btn:hover {
    background-color: rgb(255, 244, 242);
}

.double-form-btn {
    display: flex;
    justify-content: 1em;
    gap: 1em;
}
</style>