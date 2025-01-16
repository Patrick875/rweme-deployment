<template>
    <div>
        <div>
            <Table :data="foodRequests" :title="'Feed Requests'" :length="String(foodRequests.length)"
                :handle-table-search="handleSearch" :handleViewDetails="openFoodRequest"
                :handlePrimaryButtonClicks="() => isCreateFoodRequest = true" :user-can-delete="false"
                :btn-name="isSupplier ? '' : 'Submit food Request'" :columns="!isSupplier ? columns : supplierColums" />
            <FoodRequestModal :cancelButton="() => isCreateFoodRequest = false"
                :isToggleFoodRequestModal="isCreateFoodRequest"></FoodRequestModal>
            <FoodRequestDetailsModal v-if='viewableFoodRequest' :cancelButton="() => isViewFoodRequest = false"
                :isToggleFoodRequestModal="isViewFoodRequest && viewableFoodRequest"
                :viewableFoodRequest="viewableFoodRequest.value" :viewableFoodRequestId="viewableItemId"
                :loading="loading" :openComfirmationModal="() => isComfirmRequestReception = true"
                :foodRequest="viewableFoodRequest.value">
            </FoodRequestDetailsModal>

            <Modal :isOpen="isComfirmRequestReception" @modal-close="() => isComfirmRequestReception = false"
                mainHeader="COMFIRM FOOD RECEPTION" subHeader="" :width="isSmallScreen ? '80%' : '550px'">
                <template #content>
                    <div class="otp-confirm-container">
                        <div class="otp-confirm-header">
                            <p class="otp-description">
                                To confirm farmer agreement, input the verification code sent to the
                                farmer's mobile number
                            </p>
                            <div class="otp-input-group">
                                <OTPPad @entered="(v) => otpValue = v" />
                            </div>
                            <a-button class="submit-btn" @click="submitOtp" :loading="loading"
                                :disabled="!isOtpComplete">
                                SUBMIT
                            </a-button>
                        </div>
                    </div>
                </template>
            </Modal>
        </div>
    </div>
</template>
<script setup lang='ts'>
import { computed, reactive, ref, watch } from 'vue';
import { useEntitiesStore } from '../store/entities.store';
import { useAuthStore } from '../store/auth.store';
import { userRoles } from '../utils/enums';
import instance from '../api';
import { notify } from '../utils/notify';
import { useScreenSize } from '../utils/useScreenSize';

const { isSmallScreen } = useScreenSize()
const entitiesStore = useEntitiesStore();
const authStore = useAuthStore();
const logedInUser = computed(() => authStore.user)
const isSupplier = computed(() => logedInUser.value?.role === userRoles.supplier)
const viewableItemId = computed(() => entitiesStore.viewableItemId)
const viewableFoodRequest: any = ref<null>
const loading = ref<boolean>(false)
const otpValue = ref('');

if (isSupplier.value) {
    entitiesStore.getRequestsBySupplier(logedInUser.value.Supplier.id)
} else {
    entitiesStore.getFoodRequests()
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
const handleSearch = (q: string) => {
    if (logedInUser.value?.role === userRoles.supplier) {
        entitiesStore.getRequestsBySupplier(logedInUser.value?.Supplier.id, q)
    } else {
        entitiesStore.getFoodRequests(q)
    }
}
const isCreateFoodRequest = ref<boolean>(false)
const isViewFoodRequest = ref<boolean>(false)
const isComfirmRequestReception = ref<boolean>(false);

const columns = [
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
const supplierColums = columns.filter((el) => el.key !== 'supplierName')
const openFoodRequest = (record: any) => {
    viewableFoodRequest.value = record
    isViewFoodRequest.value = true
}


const props = defineProps({
    cancelButton: {
        type: Function,
        default: () => { }
    },
    next: {
        type: Function,
        default: () => { }
    },
})

const isOtpComplete = computed(() => {
    return otpValue.value.length === 6
})


const submitOtp = async () => {
    loading.value = true

    if (otpValue.value.length === 6 && /^\d{6}$/.test(otpValue.value)) {
        try {
            const response = await instance.post('/foodrequests/comfirmdelivery', { otp: otpValue.value, requestId: viewableFoodRequest.value.id })
            notify('success', 'Success', response.data.message)
            setTimeout(() => {
                props.cancelButton()
                props.next()
            }, 3500)

        } catch (error) {
            console.error('Confirmation Failed:', error)
            notify('error', 'Confirmation Failed', '')
            setTimeout(() => {
                props.cancelButton()
            }, 3500)
        } finally {
            entitiesStore.getFoodRequests()
            otpValue.value = ''
        }
    } else {
        console.error('Invalid OTP')
    }
    loading.value = false
}

</script>
<style scoped lang="scss">
.otp-input-group {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 1rem;
}

.otp-input {
    width: 32px;
    height: 32px;
    text-align: center;
    border: none;
    border-bottom: 1.5px solid #d2d2d2;
    font-size: 1rem;
    transition: border-color 0.3s ease;

    &:focus {
        outline: none;
        border-bottom-color: #007bff;
    }
}

.submit-btn {
    width: 100%;
    height: 34px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }

    &:hover:not(:disabled) {
        background-color: #0056b3;
        color: white;
    }
}
</style>