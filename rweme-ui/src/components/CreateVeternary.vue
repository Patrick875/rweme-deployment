<template>
    <div class="auth">
        <a-form :model="veternaryForm" ref="formRef" name="basic" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }"
            autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
            <a-row :gutter="16">
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Full Name" name="fullName"
                        :rules="[{ required: true, message: 'Please input veternary full name!' }]">
                        <a-input class="input" placeholder="Please enter veternary full name"
                            v-model:value="veternaryForm.fullName" />
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
                        <a-input class="input" placeholder="07-- --- ---" v-model:value="veternaryForm.telephone" />
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Email Address" name="email"
                        :rules="[{ required: true, message: 'Please input an email !' }]">
                        <a-input class="input" placeholder="Enter a valid email" v-model:value="veternaryForm.email" />
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="National Id" name="nationalId"
                        :rules="[{ required: true, pattern: /^(1|2)\d{15}$/, message: 'Please input a valid national id !' }]">
                        <a-input class="input" placeholder="Enter a valid national Id"
                            v-model:value="veternaryForm.nationalId" />
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item name="specializationIds" label="Select specializations" has-feedback
                        :rules="[{ required: true, message: 'Please select veternary specializations!' }]">
                        <a-select v-model:value="veternaryForm.specializationIds" :options="specializations"
                            mode="multiple" :size="'middle'" placeholder="Please select specializations"
                            @popupScroll="popupScroll"></a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Province" name="provinceId"
                        :rules="[{ required: true, message: 'Please input select !!' }]">
                        <a-select v-model:value="veternaryForm.provinceId" :size="'middle'"
                            placeholder="Please select !!" @popupScroll="popupScroll">
                            <a-select-option v-for="province in provinces" :key="province.id" :value="province.key">
                                {{ province.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="District" name="districtId"
                        :rules="[{ required: true, message: 'Please input select !!' }]">
                        <a-select :disabled="!veternaryForm.provinceId" v-model:value="veternaryForm.districtId"
                            :size="'middle'" placeholder="Please select !!" @popupScroll="popupScroll">
                            <a-select-option
                                v-for="district in districts.filter((distr) => distr.provinceId === veternaryForm.provinceId)"
                                :key="district.id" :value="district.key">
                                {{ district.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Sector" name="sectorId"
                        :rules="[{ required: true, message: 'Please input select !!' }]">
                        <a-select :disabled="!veternaryForm.districtId" v-model:value="veternaryForm.sectorId"
                            :size="'middle'" placeholder="Please select !!" @popupScroll="popupScroll">
                            <a-select-option
                                v-for="sector in sectors.filter((sect) => sect.districtId === veternaryForm.districtId)"
                                :key="sector.id" :value="sector.key">
                                {{ sector.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Cell" name="cellId"
                        :rules="[{ required: true, message: 'Please input select !!' }]">
                        <a-select :disabled="!veternaryForm.sectorId" v-model:value="veternaryForm.cellId"
                            :size="'middle'" placeholder="Please select !!" @popupScroll="popupScroll">
                            <a-select-option
                                v-for="cell in cells.filter((cell) => cell.sectorId === veternaryForm.sectorId)"
                                :key="cell.id" :value="cell.key">
                                {{ cell.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Village" name="addressId"
                        :rules="[{ required: true, message: 'Please input select !!' }]">
                        <a-select :disabled="!veternaryForm.cellId" v-model:value="veternaryForm.addressId"
                            :size="'middle'" placeholder="Please select !!" @popupScroll="popupScroll">
                            <a-select-option
                                v-for="village in villages.filter((vill) => vill.cellId === veternaryForm.cellId)"
                                :key="village.id" :value="village.key">
                                {{ village.name }}
                            </a-select-option>

                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-form-item>
                <div class="double-form-btn g-flex">
                    <a-button class="cancel-form-btn" danger html-type="button"
                        @click="() => props.cancelButton()">CANCEL</a-button>
                    <a-button :loading="loading" class="btn-auth" html-type="submit">CREATE VETERNARY</a-button>
                </div>
            </a-form-item>
        </a-form>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue"
import { useEntitiesStore } from '../store/entities.store'
import { userRoles } from "../utils/enums";
import { useScreenSize } from "../utils/useScreenSize";
interface VeternaryForm {
    fullName: string
    email: string
    telephone: string
    specializationIds: string[]
    nationalId: string
    provinceId: string | null
    districtId: string | null
    sectorId: string | null
    cellId: string | null
    addressId: string | null
}

const popupScroll = () => {
    console.log('popupScroll');
};
const { isSmallScreen } = useScreenSize()
const formRef = ref<InstanceType<any> | null>(null)
const visible = ref<boolean>(true)
const entitiesStore = useEntitiesStore()

const specializations = computed(() => entitiesStore.specializations.map((el) => ({
    label: el.name,
    value: el.id
})))
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

const handleClose = () => {
    visible.value = false
}
const loading = ref<boolean>(false);
const veternaryForm = ref<VeternaryForm>({
    fullName: "",
    email: "",
    telephone: "",
    specializationIds: [],
    nationalId: "",
    provinceId: null,
    districtId: null,
    sectorId: null,
    cellId: null,
    addressId: null
})

const props = defineProps({
    cancelButton: {
        type: Function,
        default: () => { },
    },
})
const onFinish = async (values: any) => {
    loading.value = true;
    try {

        await entitiesStore.createVeternary({
            fullName: values.fullName,
            email: values.email,
            telephone: values.telephone,
            nationalId: values.nationalId,
            specializationIds: values.specializationIds,
            role: userRoles.veternary,
            addressId: values.addressId
        })

    } catch (error: any) {
        console.error('Error in onFinish:', error)
    } finally {
        loading.value = false;
        veternaryForm.value = {
            fullName: "",
            email: "",
            telephone: "",
            specializationIds: [],
            nationalId: "",
            provinceId: null,
            districtId: null,
            sectorId: null,
            cellId: null,
            addressId: null,
        }
        props.cancelButton()
    }
    console.log('values', values);

}
const onFinishFailed = (errorInfo: unknown) => {
    console.log("Failed:", errorInfo)
}
entitiesStore.getSpecializations()
entitiesStore.getLocations()

</script>

<style scoped lang="scss">
@import "../styles/_auth.scss";

.auth {
    :where(.css-dev-only-do-not-override-185kyl0).ant-form-item {
        margin-bottom: 16px !important;
    }

    .btn-auth {
        margin-left: 4px;
    }

    .select-input {
        width: 100%;
    }

}

.double-form-btn {
    display: flex;
    justify-content: space-between;

    .btn-auth,
    .cancel-form-btn {
        width: 100%;
        height: 44px
    }

    .btn-auth {
        background-color: rgba(28, 130, 23, 0.68);
        color: white;
        outline: none;
        border: none;

        &:hover {
            background-color: rgba(28, 130, 23, 1);
        }
    }

    @media(max-width:800px) {

        .btn-auth,
        .cancel-form-btn {
            padding: 0.4em;

        }
    }
}
</style>
