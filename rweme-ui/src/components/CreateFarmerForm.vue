<template>
    <div class="auth">
        <p>Farmer details</p>
        <a-form :model="farmerForm" ref="formRef" name="basic" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }"
            autocomplete="off">
            <a-row :gutter="16">
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Full Name" name="fullName"
                        :rules="[{ required: true, message: 'Please input farmer full name!' }]">
                        <a-input class="input" placeholder="Please enter farmer full name"
                            v-model:value="farmerForm.fullName" />
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
                        <a-input class="input" placeholder="07-- --- ---" v-model:value="farmerForm.telephone" />
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Email Address" name="email"
                        :rules="[{ message: 'Please input an email !' }]">
                        <a-input class="input" type="email" placeholder="Enter a valid email"
                            v-model:value="farmerForm.email" />
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="National Id" name="nationalId"
                        :rules="[{ required: true, pattern: /^(1|2)\d{15}$/, message: 'Please input a valid national id !' }]">
                        <a-input class="input" placeholder="Enter a valid national Id"
                            v-model:value="farmerForm.nationalId" />
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Province" name="provinceId"
                        :rules="[{ required: true, message: 'Please input select !!' }]">
                        <a-select v-model:value="farmerForm.provinceId" :size="'middle'" placeholder="Please select !!"
                            @popupScroll="popupScroll">
                            <a-select-option v-for="province in provinces" :key="province.id" :value="province.key">
                                {{ province.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="District" name="districtId"
                        :rules="[{ required: true, message: 'Please input select !!' }]">
                        <a-select :disabled="!farmerForm.provinceId" v-model:value="farmerForm.districtId"
                            :size="'middle'" placeholder="Please select !!" @popupScroll="popupScroll">
                            <a-select-option
                                v-for="district in districts.filter((distr) => distr.provinceId === farmerForm.provinceId)"
                                :key="district.id" :value="district.key">
                                {{ district.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Sector" name="sectorId"
                        :rules="[{ required: true, message: 'Please input select !!' }]">
                        <a-select :disabled="!farmerForm.districtId" v-model:value="farmerForm.sectorId"
                            :size="'middle'" placeholder="Please select !!" @popupScroll="popupScroll">
                            <a-select-option
                                v-for="sector in sectors.filter((sect) => sect.districtId === farmerForm.districtId)"
                                :key="sector.id" :value="sector.key">
                                {{ sector.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Cell" name="cellId"
                        :rules="[{ required: true, message: 'Please input select !!' }]">
                        <a-select :disabled="!farmerForm.sectorId" v-model:value="farmerForm.cellId" :size="'middle'"
                            placeholder="Please select !!" @popupScroll="popupScroll">
                            <a-select-option
                                v-for="cell in cells.filter((cell) => cell.sectorId === farmerForm.sectorId)"
                                :key="cell.id" :value="cell.key">
                                {{ cell.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Village" name="addressId"
                        :rules="[{ required: true, message: 'Please input select !!' }]">
                        <a-select :disabled="!farmerForm.cellId" v-model:value="farmerForm.addressId" :size="'middle'"
                            placeholder="Please select !!" @popupScroll="popupScroll">
                            <a-select-option
                                v-for="village in villages.filter((vill) => vill.cellId === farmerForm.cellId)"
                                :key="village.id" :value="village.key">
                                {{ village.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Type of Chicken" name="chickenTypeId"
                        :rules="[{ required: true, min: 1, message: 'Please input select !!' }]">
                        <a-select v-model:value="farmerForm.chickenTypeId" :options="typeofchicken" :size="'middle'"
                            placeholder="Please select !!" @popupScroll="popupScroll"></a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Number of Chicken" name="numberOfChicken"
                        :rules="[{ message: 'Please input a valid number', required: true, }]">
                        <a-input-number :min="1" class="input" placeholder="Enter a valid number"
                            v-model:value="farmerForm.numberOfChicken" />
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Chicken health condition"
                        name="chickenHealthCondition"
                        :rules="[{ required: true, min: 1, message: 'Please input select !!' }]">
                        <a-select v-model:value="farmerForm.chickenHealthCondition" :size="'middle'"
                            placeholder="Please select" @popupScroll="popupScroll">
                            <a-option value="Healthy">Healthy</a-option>
                            <a-option value="Sick">Sick</a-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item name="hasInsurance" label="Has insurance for his/her chicken" has-feedback
                        :rules="[{ required: true, message: 'Please select !' }]">
                        <a-select v-model:value="farmerForm.hasInsurance" :size="'middle'"
                            placeholder="Please select type of Feeds" @popupScroll="popupScroll">
                            <a-option value="yes">YES</a-option>
                            <a-option value="no">NO</a-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Assigned Veternary" name="assignedTo"
                        :rules="[{ message: 'Please select !!' }]">
                        <a-select v-model:value="farmerForm.assignedTo" :size="'middle'" placeholder="Please select">
                            <a-select-option disabled value="">Select veternary</a-select-option>
                            <a-select-option v-for="(vet) in veternaries" :value="vet.key" :key="vet.key">{{
                                vet.fullName + ' / ' + vet.telephone }} </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <p>Initial food request details</p>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item name="typeOfFeed" label="Select type of Feed" has-feedback
                        :rules="[{ required: true, message: 'Please select type of feeds!' }]">
                        <a-select v-model:value="farmerForm.typeOfFeed" :options="typeoffeeds" :size="'middle'"
                            placeholder="Please select type of Feeds" @popupScroll="popupScroll"></a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Amount of feed on a daily basis /chicken"
                        name="amountOfFeedOnDailyBasisPerChicken"
                        :rules="[{ required: true, message: 'Please input a valid number' }]">
                        <a-input-number class="input" placeholder="Enter a valid number 0.00" :step="0.01" :min="1"
                            v-model:value="farmerForm.amountOfFeedOnDailyBasisPerChicken" />
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Price of feed" name="priceOfFeedToBeDelivered"
                        :rules="[{ required: true, type: 'number', message: 'Please input a valid number' },]"
                        validate-trigger="onBlur">
                        <a-input-number :min="1" class="input" type="number" placeholder="Enter a valid number 0.00"
                            @blur="validateAmount" v-model:value="farmerForm.priceOfFeedToBeDelivered" :step="0.01" />
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Amount Of Feed To Be Delivered"
                        name="amountOfFeedToBeDelivered"
                        :rules="[{ required: true, message: 'Please input a valid number' }]" validate-trigger="onBlur">
                        <a-input-number class="input" :min="0.01" :step="0.01" placeholder="Enter a valid number 0.00"
                            @blur="validateAmount" v-model:value="farmerForm.amountOfFeedToBeDelivered" />
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Supplier" name="supplierId"
                        :rules="[{ message: 'Please select !!' }]">
                        <a-select v-model:value="farmerForm.supplierId" :size="'middle'" placeholder="Please select">
                            <a-select-option disabled value="">Select supplier</a-select-option>
                            <a-select-option v-for="(supplier) in suppliers" :value="supplier.key"
                                :key="supplier.key">{{
                                    supplier.label + ' / ' + supplier.telephone }} </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <a-divider />
        <p>Next of Kin details</p>
        <a-form :model="nextOfKinForm" ref="nextOfKinformRef" name="nextOfKin" :label-col="{ span: 24 }"
            :wrapper-col="{ span: 24 }" autocomplete="off">
            <a-row :gutter="16">
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Full Name" name="fullName"
                        :rules="[{ required: true, message: 'Please input full name!' }]">
                        <a-input class="input" placeholder="Please enter  full name"
                            v-model:value="nextOfKinForm.fullName" />
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
                        <a-input class="input" placeholder="07-- --- ---" v-model:value="nextOfKinForm.telephone" />
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="National Id" name="nationalId"
                        :rules="[{ required: true, pattern: /^(1|2)\d{15}$/, message: 'Please input a valid national id !' }]">
                        <a-input class="input" placeholder="Enter a valid national Id"
                            v-model:value="nextOfKinForm.nationalId" />
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item name="relation" label="Relation" has-feedback
                        :rules="[{ required: true, message: 'Please select !' }]">
                        <a-select v-model:value="nextOfKinForm.relation" :size="'middle'"
                            placeholder="Please select type of Feeds" placement="topLeft">
                            <a-option value="Spouse">Spouse</a-option>
                            <a-option value="Parent">Parent</a-option>
                            <a-option value="Relative">Relative</a-option>
                            <a-option value="Child">Child</a-option>
                            <a-option value="Business Partner">Business Partner</a-option>
                            <a-option value="Other">Other</a-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <div class="double-form-btn g-flex">
            <a-button class="cancel-form-btn" danger html-type="button" @click="props.cancelButton">CANCEL</a-button>
            <a-button :loading="loading" class="btn-auth" @click="createFarmer">CREATE FARMER</a-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue"
import { useEntitiesStore } from '../store/entities.store'
import { useRouter } from "vue-router";
import { useScreenSize } from "../utils/useScreenSize";

interface farmerForm {
    fullName: string
    email: string
    telephone: string
    nationalId: string
    chickenTypeId: string
    numberOfChicken: number | null
    amountOfFeedOnDailyBasisPerChicken: number | null
    amountOfFeedToBeDelivered: number | null
    priceOfFeedToBeDelivered: number | null
    typeOfFeed: string
    hasInsurance: string
    chickenHealthCondition: string | null,
    provinceId: string | null,
    districtId: string | null,
    sectorId: string | null,
    cellId: string | null,
    addressId: string | null,
    supplierId: string | null,
    assignedTo: string | null
}

interface NextOfKinForm {
    fullName: string
    nationalId: string
    relation: string
    telephone: string
}
const popupScroll = () => {
    console.log('popupScroll');
};
const { isSmallScreen } = useScreenSize()
const nextOfKinformRef = ref<InstanceType<any> | null>(null)
const entitiesStore = useEntitiesStore()
const isActionSuccess = computed(() => entitiesStore.success)

const typeofchicken = computed(() => entitiesStore.typeofchicken.map((el: any) => ({
    label: el.name.toUpperCase(),
    value: el.id
})))
const typeoffeeds = computed(() => entitiesStore.typeoffeeds.map((el: any) => ({
    label: el.name.toUpperCase(),
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

const veternaries = computed(() => entitiesStore.veternaries.map((item) => ({
    ...item,
    fullName: item.User.fullName,
    telephone: item.User.telephone,
    email: item.User.email,
    specializations: item.specializations,
    status: item.User.status,
    key: item.id,
    location: item.User.Village.name,

})))
const suppliers = computed(() => entitiesStore.suppliers.map((el) => ({
    label: el.User.fullName,
    key: el.id,
    telephone: el.User.telephone,
    ...el,
})))


const loading = ref<boolean>(false);
const formRef = ref<InstanceType<any> | null>(null)

const farmerForm = ref<farmerForm>({
    fullName: "",
    email: "",
    telephone: "",
    nationalId: "",
    chickenTypeId: '',
    numberOfChicken: null,
    amountOfFeedOnDailyBasisPerChicken: null,
    amountOfFeedToBeDelivered: null,
    priceOfFeedToBeDelivered: null,
    typeOfFeed: '',
    hasInsurance: '',
    chickenHealthCondition: null,
    provinceId: null,
    districtId: null,
    sectorId: null,
    cellId: null,
    addressId: null,
    supplierId: null,
    assignedTo: null
})

const nextOfKinForm = ref<NextOfKinForm>({
    fullName: '',
    nationalId: '',
    telephone: '',
    relation: '',
})

const props = defineProps({
    cancelButton: {
        type: Function,
        default: () => { },
    },
    onComplete: {
        type: Function,
        default: () => { },
    }
})

const validateAmount = () => {
    formRef.value.validateFields(['amountOfFeedToBeDelivered', "priceOfFeedToBeDelivered"]);

};
const createFarmer = async () => {
    loading.value = true;
    const submitObject = { ...farmerForm.value, typeOfChicken: farmerForm.value.chickenTypeId, nextOfKin: nextOfKinForm.value }
    try {
        await entitiesStore.createFarmer(submitObject)
    }
    catch (error: any) {
        console.error('Error in onFinish:', error)

    } finally {
        loading.value = false;
        farmerForm.value = {
            fullName: "",
            email: "",
            telephone: "",
            nationalId: "",
            chickenTypeId: '',
            numberOfChicken: null,
            amountOfFeedOnDailyBasisPerChicken: null,
            amountOfFeedToBeDelivered: null,
            priceOfFeedToBeDelivered: null,
            typeOfFeed: '',
            hasInsurance: '',
            chickenHealthCondition: null,
            provinceId: null,
            districtId: null,
            sectorId: null,
            cellId: null,
            supplierId: null,
            addressId: null,
            assignedTo: null

        };
        nextOfKinForm.value = {
            fullName: '',
            relation: '',
            nationalId: '',
            telephone: ''
        }
        if (isActionSuccess) {
            props.onComplete();
        }
    }

}
watch(
    () => [farmerForm.value.amountOfFeedOnDailyBasisPerChicken, farmerForm.value.numberOfChicken],
    ([newPrice, newNumber]) => {

        farmerForm.value.amountOfFeedToBeDelivered =
            (newPrice || 0) * (newNumber || 0);

    }
);

entitiesStore.getTypesOfChicken()
entitiesStore.getTypesOfFeed()
entitiesStore.getLocations()
entitiesStore.getVeternaries()
entitiesStore.getSuppliers()
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

:deep(input[type='number']) {

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    &[type='number'] {
        -moz-appearance: textfield;
    }
}

:deep {
    .ant-input-number {
        width: 100%;
        display: block
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
            color: white
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
