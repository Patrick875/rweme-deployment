<template>
    <div>
        <Modal :isOpen="props.isToggleFoodRequestModal" @modal-close="props.cancelButton" mainHeader="FOOD REQUEST"
            subHeader="Please provide the following details to submit a food request"
            :width="isSmallScreen ? '80%' : '550px'">
            <template #content>
                <a-form :model="foodRequest" ref="formRef" name="basic" :label-col="{ span: 24 }"
                    :wrapper-col="{ span: 24 }" autocomplete="off">
                    <a-row :gutter="16">
                        <a-col :span="isSmallScreen ? 24 : 12">
                            <a-form-item class="label-input-height" label="Farmer" name="farmerId"
                                :rules="[{ message: 'Please select !!' }]">
                                <a-select :disabled="props.farmerId" v-model:value="foodRequest.farmerId"
                                    :size="'middle'" placeholder="Please select">
                                    <a-select-option disabled value="">Select farmer</a-select-option>
                                    <a-select-option v-for="(farmer, i) in farmers" :value="farmer.key" :key="i">{{
                                        farmer.fullName + " / " + farmer.telephone }} </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="isSmallScreen ? 24 : 12">
                            <a-form-item class="label-input-height" label="Feed" name="typeOfFood"
                                :rules="[{ message: 'Please select !!' }]">
                                <a-select v-model:value="foodRequest.typeOfFeed" :size="'middle'"
                                    placeholder="Please select">
                                    <a-select-option disabled value="">Select food</a-select-option>
                                    <a-select-option v-for="(food) in typesOfFood" :value="food.key" :key="food.key">{{
                                        food.name }} </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="isSmallScreen ? 24 : 12">
                            <a-form-item class="label-input-height" label="Quantity" name="quantityOfFeed"
                                :rules="[{ message: 'Please input a valid number', required: true }]">
                                <a-input-number :min="1" :step="0.00" class="input" placeholder="Enter the quantity"
                                    v-model:value="foodRequest.quantityOfFeed" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="isSmallScreen ? 24 : 12">
                            <a-form-item class="label-input-height" label="Price" name="priceOfFeed"
                                :rules="[{ message: 'Please fill in the price !', required: true }]">
                                <a-input-number :min="1" class="input" placeholder="price"
                                    v-model:value="foodRequest.priceOfFeed" />
                            </a-form-item>
                        </a-col>

                        <a-col :span="isSmallScreen ? 24 : 12">
                            <a-form-item class="label-input-height" label="Supplier" name="supplierId"
                                :rules="[{ message: 'Please select !!' }]">
                                <a-select v-model:value="foodRequest.supplierId" :size="'middle'"
                                    placeholder="Please select">
                                    <a-select-option disabled value="">Select supplier</a-select-option>
                                    <a-select-option v-for="(supplier) in suppliers" :value="supplier.key"
                                        :key="supplier.key">{{
                                            supplier.label + ' / ' + supplier.telephone }} </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="isSmallScreen ? 24 : 12">
                            <p>Total to be paid: {{ Number(totalToBePaid).toLocaleString() + " RWF" }}</p>
                        </a-col>

                    </a-row>
                    <div class="double-form-btn">
                        <a-button class="cancel-form-btn model-action-btn" danger html-type="button"
                            @click="props.cancelButton">CANCEL</a-button>
                        <a-button :loading="loading" class="btn-auth model-action-btn" @click="submitRequest">Submit
                            request</a-button>
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


interface FoodRequest {
    farmerId: string | null
    supplierId: string | null
    quantityOfFeed: number | null
    priceOfFeed: number | null
    typeOfFeed: string | null
}
const { isSmallScreen } = useScreenSize()
const entitiesStore = useEntitiesStore()
entitiesStore.getFarmers()
entitiesStore.getSuppliers()
entitiesStore.getTypesOfFeed()

const farmers = computed(() => entitiesStore.farmers.map((el) => ({
    label: el.fullName,
    key: el.id,
    telephone: el.telephone,
    ...el
})))
const suppliers = computed(() => entitiesStore.suppliers.map((el) => ({
    label: el.User.fullName,
    key: el.id,
    telephone: el.User.telephone,
    ...el,
})))
const typesOfFood = computed(() => entitiesStore.typeoffeeds.map((el) => ({
    label: el.name,
    key: el.id,
    ...el,
})))
const loading = computed(() => entitiesStore.loading)
const totalToBePaid = computed(() => {
    const price = foodRequest.value.priceOfFeed || 0;
    const quantity = foodRequest.value.quantityOfFeed || 0;
    return price * quantity;
});
const props = defineProps({
    isToggleFoodRequestModal: {
        type: Boolean,
        default: false
    },
    cancelButton: {
        type: Function,
        default: () => { }
    },
    farmerId: {
        type: String || null,
    }
})

const foodRequest = ref<FoodRequest>({
    farmerId: props.farmerId ? props.farmerId : null,
    supplierId: null,
    quantityOfFeed: null,
    priceOfFeed: null,
    typeOfFeed: null
})

const submitRequest = async () => {
    const farmerDetailsId = props.farmerId ? props.farmerId : '';
    const submitData = { farmerId: foodRequest.value.farmerId, supplierId: foodRequest.value.supplierId, typeOfFeed: foodRequest.value.typeOfFeed, price: foodRequest.value.priceOfFeed, quantityOfFeed: foodRequest.value.quantityOfFeed, totalAmount: totalToBePaid.value };
    await entitiesStore.submitFoodRequest(submitData, farmerDetailsId)
    foodRequest.value = {
        farmerId: null,
        supplierId: null,
        quantityOfFeed: null,
        priceOfFeed: null,
        typeOfFeed: null
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

:deep .ant-input-number .ant-input-number-in-form-item {
    width: 100%;
    display: block !important
}

:where(.css-dev-only-do-not-override-17yhhjv).ant-input-number {
    width: 100%;
    display: block !important
}
</style>