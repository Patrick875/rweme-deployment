<template>
    <div>
        <Modal :isOpen="props.isToggleFoodRequestModal" @modal-close="props.cancelButton" mainHeader="FOOD REQUEST"
            subHeader="Please provide the following details to submit a food request"
            :width="isSmallScreen ? '80%' : '550px'">
            <template #content>
                <div v-if="!props.loading && props.viewableFoodRequest">
                    <div class="fd-req-detail">
                        <p>Farmer Name :</p>
                        <p>{{ props.viewableFoodRequest?.Farmer?.fullName }}</p>
                    </div>
                    <div class="fd-req-detail">
                        <p>Farmer Telephone:</p>
                        <p>{{ viewableFoodRequest?.Farmer?.telephone }}</p>
                    </div>
                    <div class="fd-req-detail">
                        <p>Type of Feed: </p>
                        <p>{{ viewableFoodRequest ?
                            viewableFoodRequest?.TypeOfFeed?.name : '' }}</p>
                    </div>
                    <div class="fd-req-detail">
                        <p>Quantity of Feed</p>
                        <p>{{ viewableFoodRequest ?
                            viewableFoodRequest?.quantityOfFeed : '' }}</p>
                    </div>
                    <div class="fd-req-detail">
                        <p>Price of Feed:</p>
                        <p>{{ viewableFoodRequest ?
                            viewableFoodRequest?.price : '' }}</p>
                    </div>
                    <div class="fd-req-detail">
                        <p>Submitted on:</p>
                        <p>{{ new Date(viewableFoodRequest?.createdAt).toLocaleString('fr-FR') }}</p>
                    </div>
                    <a-button v-if="viewableFoodRequest.deliveryStatus !== 'DELIVERED' && userRole !== 'Admin'"
                        class="process-button" @click="initiateRequestDelivery">{{ loading ? '...loading' :
                            `INITIATE
                        DELIVERY`}}</a-button>
                </div>
                <div v-else>
                    ...Loading
                </div>
            </template>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useEntitiesStore } from '../store/entities.store';
import instance from '../api';
import { useAuthStore } from '../store/auth.store';
import { useScreenSize } from '../utils/useScreenSize';

const authStore = useAuthStore();
const logedInUser = computed(() => authStore.user)
const userRole = logedInUser.value?.role

const { isSmallScreen } = useScreenSize()


const loading = ref<boolean>(false)
// const fetchedRequest = computed(() => entitiesStore.detailsItem)

// const getFoodRequest = async (id: string) => {
//     loading.value = true
//     await instance.get(`/foodrequests/${id}`).then((res) => {
//         fetchedRequest.value = res.data.data
//     }).catch((err) => {
//         console.log('err', err);
//     })
//     loading.value = false

// }

const initiateRequestDelivery = async () => {
    loading.value = true
    await instance.patch(`/foodrequests/${props.viewableFoodRequest.id}/initiatedelivery`, {
        farmerId: props.viewableFoodRequest?.farmerId
    }).then((res) => {
        console.log('res-res-res', res);
        props.openComfirmationModal()
        loading.value = false
        props.cancelButton()
    }).catch((err) => {
        console.log('err-err-err', err);
        loading.value = false
    })
}
const props = defineProps({
    isToggleFoodRequestModal: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false
    },
    viewableFoodRequestId: {
        type: String,
        default: ''
    },
    viewableFoodRequest: {
        type: Object,
        default: {}
    },
    cancelButton: {
        type: Function,
        default: () => { }
    },
    foodRequest: {
        type: Object,
        default: {}
    },
    farmerId: {
        type: String || null,
    },
    openComfirmationModal: {
        type: Function,
        default: () => { }
    }
})

console.log('viewable', props.foodRequest)
console.log('viewable-2', props.viewableFoodRequest)
// onMounted(() => {
// })


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

.fd-req-detail {
    display: flex;
    justify-content: space-between;

    p {
        margin-block: 0.5em;
    }
}

.process-button {
    width: 100%;
    height: 3em;
    background-color: rgba(0, 0, 0, 0.68);
    color: white;
    outline: none;
    border: none;
    margin-top: 0.75em;

    &:hover {
        background-color: rgba(0, 0, 0, 0.775);
        color: white
    }
}

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

:deep .ant-input-number .ant-input-number-in-form-item {
    width: 100%;
    display: block
}
</style>