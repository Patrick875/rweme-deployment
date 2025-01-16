<template>
    <a-form v-if="!contentLoading" :model="formState" name="basic" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }"
        autocomplete="off">
        <a-row :gutter="16">
            <a-col :span="isSmallScreen ? 24 : 12">
                <a-form-item class="label-input-height" label="Full Name" name="fullName"
                    :rules="[{ required: true, message: 'Please input farmer full name!' }]">
                    <a-input class="input" placeholder="Please enter farmer full name"
                        v-model:value="formState.fullName" />
                </a-form-item>
            </a-col>
            <a-col :span="isSmallScreen ? 24 : 12">
                <a-form-item class="label-input-height" label="Phone Number" name="telephone" :rules="[
                    {
                        required: true,
                        pattern: /^07\d{8}$/,
                        message: 'Phone number should start with 07 and be 10 digits long',
                    },
                ]">
                    <a-input class="input" placeholder="07-- --- ---" v-model:value="formState.telephone" />
                </a-form-item>
            </a-col>
            <a-col :span="isSmallScreen ? 24 : 12">
                <a-form-item class="label-input-height" label="Email Address" name="email"
                    :rules="[{ message: 'Please input an email !' }]">
                    <a-input class="input" type="email" placeholder="Enter a valid email"
                        v-model:value="formState.email" />
                </a-form-item>
            </a-col>
            <a-col :span="isSmallScreen ? 24 : 12">
                <a-form-item class="label-input-height" label="National Id" name="nationalId"
                    :rules="[{ required: true, pattern: /^(1|2)\d{15}$/, message: 'Please input a valid national id !' }]">
                    <a-input class="input" placeholder="Enter a valid national Id"
                        v-model:value="formState.nationalId" />
                </a-form-item>
            </a-col>
            <a-col :span="isSmallScreen ? 24 : 12">
                <a-form-item class="label-input-height" label="Province" name="provinceId"
                    :rules="[{ required: true, message: 'Please input select !!' }]">
                    <a-select v-model:value="formState.provinceId" :size="'middle'" placeholder="Please select !!">
                        <a-select-option v-for="province in provinces" :key="province.id" :value="province.key">
                            {{ province.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :span="isSmallScreen ? 24 : 12">
                <a-form-item class="label-input-height" label="District" name="districtId"
                    :rules="[{ required: true, message: 'Please input select !!' }]">
                    <a-select :disabled="!formState.provinceId" v-model:value="formState.districtId" :size="'middle'"
                        placeholder="Please select !!">
                        <a-select-option
                            v-for="district in districts.filter((distr) => distr.provinceId === formState.provinceId)"
                            :key="district.id" :value="district.key">
                            {{ district.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :span="isSmallScreen ? 24 : 12">
                <a-form-item class="label-input-height" label="Sector" name="sectorId"
                    :rules="[{ required: true, message: 'Please input select !!' }]">
                    <a-select :disabled="!formState.districtId" v-model:value="formState.sectorId" :size="'middle'"
                        placeholder="Please select !!">
                        <a-select-option
                            v-for="sector in sectors.filter((sect) => sect.districtId === formState.districtId)"
                            :key="sector.id" :value="sector.key">
                            {{ sector.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :span="isSmallScreen ? 24 : 12">
                <a-form-item class="label-input-height" label="Cell" name="cellId"
                    :rules="[{ required: true, message: 'Please input select !!' }]">
                    <a-select :disabled="!formState.sectorId" v-model:value="formState.cellId" :size="'middle'"
                        placeholder="Please select !!">
                        <a-select-option v-for="cell in cells.filter((cell) => cell.sectorId === formState.sectorId)"
                            :key="cell.id" :value="cell.key">
                            {{ cell.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :span="isSmallScreen ? 24 : 12">
                <a-form-item class="label-input-height" label="Village" name="addressId"
                    :rules="[{ required: true, message: 'Please input select !!' }]">
                    <a-select :disabled="!formState.cellId" v-model:value="formState.addressId" :size="'middle'"
                        placeholder="Please select !!">
                        <a-select-option v-for="village in villages.filter((vill) => vill.cellId === formState.cellId)"
                            :key="village.id" :value="village.key">
                            {{ village.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>

        </a-row>
        <div class="double-form-btn g-flex">
            <a-button class="cancel-form-btn" danger html-type="button" @click="props.cancelButton">CANCEL</a-button>
            <a-button :loading="loading" class="btn-auth" @click="updateMe">UPDATE</a-button>
        </div>
    </a-form>
    <div v-else class='loading-screen'>
        <p>Loading ...</p>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, toRaw, watch } from 'vue'
import { useScreenSize } from "../utils/useScreenSize";
import { useEntitiesStore } from '../store/entities.store';
import instance from '../api';
import { notify } from '../utils/notify';
import { useAuthStore } from '../store/auth.store';

interface formState {
    email: string;
    fullName: string;
    telephone: string;
    provinceId: string | null;
    districtId: string | null;
    sectorId: string | null;
    cellId: string | null;
    addressId: string | null;
    nationalId: string
}
const props = defineProps({
    cancelButton: {
        type: Function,
        default: () => { }
    },
    loggedInUser: Object,
    default: {}
})
const { isSmallScreen } = useScreenSize()
const { loggedInUser } = useAuthStore();




const entitiesStore = useEntitiesStore()
const loading = ref(false)
const contentLoading = computed(() => entitiesStore.loading)
const provinces = computed(() => entitiesStore.provinces?.map((prov) => ({
    ...prov,
    label: prov.name,
    key: prov.id,
})))

const districts = computed(() => entitiesStore.districts?.map((distr) => ({
    ...distr,
    label: distr.name,
    key: distr.id
})))
const sectors = computed(() => entitiesStore.sectors?.map((sect) => ({
    ...sect,
    label: sect.name,
    key: sect.id
})))
const cells = computed(() => entitiesStore.cells?.map((cll) => ({
    ...cll,
    label: cll.name,
    key: cll.id
})))
const villages = computed(() => entitiesStore.villages?.map((vl) => ({
    ...vl,
    label: vl.name,
    key: vl.id
})))
const singleUserInfo = computed(() => entitiesStore.singleUser)


const formState = ref<formState>({
    email: singleUserInfo.value?.email,
    fullName: singleUserInfo.value?.fullName,
    telephone: singleUserInfo.value?.telephone,
    provinceId: singleUserInfo.value?.Village.provinceId,
    districtId: singleUserInfo.value?.Village.districtId,
    sectorId: singleUserInfo.value?.Village.sectorId,
    cellId: singleUserInfo.value?.Village.cellId,
    addressId: singleUserInfo.value?.addressId,
    nationalId: singleUserInfo.value?.nationalId
})

const updateMe = async () => {
    loading.value = true
    try {
        await instance.patch('/auth/updateme', {
            fullName: formState.value.fullName,
            email: formState.value.email,
            telephone: formState.value.telephone,
            natinalId: formState.value.nationalId,
            addressId: formState.value.addressId,
        })
        notify('success', 'Success', 'Profile details updated successfuly')
    } catch (err: any) {
        notify('error', 'Failed', err.response.data.message)
    } finally {
        loading.value = false
    }
}

watch(
    () => formState.value.provinceId,
    (provinceId) => {
        if (provinceId) {
            formState.value.districtId = null
            formState.value.sectorId = null
            formState.value.cellId = null
            formState.value.addressId = null
        }
    }
)

watch(
    () => formState.value.districtId,
    (districtId) => {
        if (districtId) {
            formState.value.sectorId = null
            formState.value.cellId = null
            formState.value.addressId = null
        }
    }
)
watch(
    () => formState.value.sectorId,
    (sectorId) => {
        if (sectorId) {
            formState.value.cellId = null
            formState.value.addressId = null
        }
    }
)
watch(
    () => formState.value.cellId,
    (cellId) => {
        if (cellId) {
            formState.value.addressId = null
        }
    }
)
onMounted(() => {
    entitiesStore.getLocations()
    if (loggedInUser) {
        const userObj = toRaw(loggedInUser)
        entitiesStore.getSingleUser(userObj.id)
    }
})

</script>

<style scoped lang="scss">
.loading-screen {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>