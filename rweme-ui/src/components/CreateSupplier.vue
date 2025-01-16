<template>
    <div class="auth">
        <a-form :model="supplierForm" ref="formRef" name="basic" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }"
            autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
            <a-row :gutter="16">
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Full Name" name="fullName"
                        :rules="[{ required: true, message: 'Please input supplier full name!' }]">
                        <a-input class="input" placeholder="Please enter supplier full name"
                            v-model:value="supplierForm.fullName" />
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
                        <a-input class="input" placeholder="07-- --- ---" v-model:value="supplierForm.telephone" />
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Email Address" name="email"
                        :rules="[{ required: true, message: 'Please input an email !' }]">
                        <a-input class="input" placeholder="Enter a valid email" v-model:value="supplierForm.email" />
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="National Id" name="nationalId"
                        :rules="[{ required: true, pattern: /^(1|2)\d{15}$/, message: 'Please input a valid national id !' }]">
                        <a-input class="input" placeholder="Enter a valid national Id"
                            v-model:value="supplierForm.nationalId" />
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item name="typeOfFeedIds" label="Select type of feeds" has-feedback
                        :rules="[{ required: true, message: 'Please select type of feeds!' }]">
                        <a-select v-model:value="supplierForm.typeOfFeedIds" :options="typesOfFeed" mode="multiple"
                            :size="'middle'" placeholder="Please select types of feed" @popupScroll="popupScroll">

                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="MOMO Pay Code" name="momoPay"
                        :rules="[{ required: true, pattern: /^[1-9]\d{5}(\d{3})?$/, message: 'Please input a valid MOMO Pay Code !' }]">
                        <a-input class="input" placeholder="Enter a valid momoPay"
                            v-model:value="supplierForm.momoPay" />
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Province" name="provinceId"
                        :rules="[{ required: true, message: 'Please input select !!' }]">
                        <a-select v-model:value="supplierForm.provinceId" :size="'middle'"
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
                        <a-select :disabled="!supplierForm.provinceId" v-model:value="supplierForm.districtId"
                            :size="'middle'" placeholder="Please select !!" @popupScroll="popupScroll">
                            <a-select-option
                                v-for="district in districts.filter((distr) => distr.provinceId === supplierForm.provinceId)"
                                :key="district.id" :value="district.key">
                                {{ district.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Sector" name="sectorId"
                        :rules="[{ required: true, message: 'Please input select !!' }]">
                        <a-select :disabled="!supplierForm.districtId" v-model:value="supplierForm.sectorId"
                            :size="'middle'" placeholder="Please select !!" @popupScroll="popupScroll">
                            <a-select-option
                                v-for="sector in sectors.filter((sect) => sect.districtId === supplierForm.districtId)"
                                :key="sector.id" :value="sector.key">
                                {{ sector.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Cell" name="cellId"
                        :rules="[{ required: true, message: 'Please input select !!' }]">
                        <a-select :disabled="!supplierForm.sectorId" v-model:value="supplierForm.cellId"
                            :size="'middle'" placeholder="Please select !!" @popupScroll="popupScroll">
                            <a-select-option
                                v-for="cell in cells.filter((cell) => cell.sectorId === supplierForm.sectorId)"
                                :key="cell.id" :value="cell.key">
                                {{ cell.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Village" name="addressId"
                        :rules="[{ required: true, message: 'Please input select !!' }]">
                        <a-select :disabled="!supplierForm.cellId" v-model:value="supplierForm.addressId"
                            :size="'middle'" placeholder="Please select !!" @popupScroll="popupScroll">
                            <a-select-option
                                v-for="village in villages.filter((vill) => vill.cellId === supplierForm.cellId)"
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
                    <a-button :loading="loading" class="btn-auth" html-type="submit">CREATE SUPPLIER</a-button>
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
interface supplierForm {
    fullName: string
    email: string
    telephone: string
    nationalId: string
    momoPay: string
    typeOfFeedIds: string[]
    provinceId: string | null
    districtId: string | null
    sectorId: string | null
    cellId: string | null
    addressId: string | null
}
const { isSmallScreen } = useScreenSize()
const popupScroll = () => {
    console.log('popupScroll');
};
const formRef = ref<InstanceType<any> | null>(null)
const visible = ref<boolean>(true)
const entitiesStore = useEntitiesStore()

const typesOfFeed = computed(() => entitiesStore.typeoffeeds?.map((el) => ({
    label: el.name,
    value: el.id
})));
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
const supplierForm = ref<supplierForm>({
    fullName: "",
    email: "",
    telephone: "",
    nationalId: "",
    momoPay: '',
    typeOfFeedIds: [],
    provinceId: null,
    districtId: null,
    sectorId: null,
    cellId: null,
    addressId: null,
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

        await entitiesStore.createSupplier({
            fullName: values.fullName,
            email: values.email,
            telephone: values.telephone,
            nationalId: values.nationalId,
            momoPay: values.momoPay,
            role: userRoles.supplier,
            addressId: values.addressId,
            typeOfFeedIds: values.typeOfFeedIds
        })

    } catch (error: any) {
        console.error('Error in onFinish:', error)
    } finally {
        loading.value = false;
        supplierForm.value = {
            fullName: "",
            email: "",
            telephone: "",
            nationalId: "",
            momoPay: "",
            provinceId: null,
            typeOfFeedIds: [],
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

entitiesStore.getLocations()
entitiesStore.getTypesOfFeed()

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
