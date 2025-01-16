<template>
    <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="Types Of Feed">
            <Table :data="typesOfFood" :title="'Types of feed'" :length="typesOfFood.length.toString()"
                :columns="columns" :handle-table-search="searchFeed" :handle-delete-item="deleteFeed"
                :handlePrimaryButtonClicks="() => isCreateItem = true" :btn-name="'Create type of feed'" />
            <Modal :isOpen="isCreateItem" @modal-close="() => isCreateItem = false" mainHeader="CREATE FEED"
                subHeader="Please provide the following details" :width="isSmallScreen ? '80%' : '550px'">
                <template #content>
                    <a-form :model="createForm" ref="formRef" name="basic" :label-col="{ span: 24 }"
                        :wrapper-col="{ span: 24 }" autocomplete="off" @finish="createFood"
                        @finishFailed="onFinishFailed">
                        <a-row :gutter="16">
                            <a-col :span="24">
                                <a-form-item class="label-input-height" label="Name" name="name"
                                    :rules="[{ required: true, message: 'Please input the name!' }]">
                                    <a-input class="input" placeholder="Please enter the name"
                                        v-model:value="createForm.name" />
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <div class="double-form-btn g-flex">
                            <a-button class="cancel-form-btn" danger html-type="button"
                                @click="() => isCreateItem = false">CANCEL</a-button>
                            <a-button :loading="loading" class="btn-auth" html-type="submit">CREATE
                            </a-button>
                        </div>
                    </a-form>
                </template>
            </Modal>
        </a-tab-pane>
        <a-tab-pane key="2" tab="Veternary Specializations">
            <Table :data="specializations" :title="'Vet-Specializations'" :length="specializations.length.toString()"
                :columns="columns" :handle-table-search="searchSpecialization"
                :handle-delete-item="deleteSpecialization" :handlePrimaryButtonClicks="() => isCreateItem = true"
                :btn-name="'Create '" />
            <Modal :isOpen="isCreateItem" @modal-close="() => isCreateItem = false" mainHeader="CREATE SPECIALIZATION"
                subHeader="Please provide the following details to create a veternary specialization"
                :width="isSmallScreen ? '80%' : '550px'">
                <template #content>
                    <a-form :model="createForm" ref="formRef" name="basic" :label-col="{ span: 24 }"
                        :wrapper-col="{ span: 24 }" autocomplete="off" @finish="createSpecialization"
                        @finishFailed="onFinishFailed">
                        <a-row :gutter="16">
                            <a-col :span="24">
                                <a-form-item class="label-input-height" label="Name" name="name"
                                    :rules="[{ required: true, message: 'Please input the name!' }]">
                                    <a-input class="input" placeholder="Please enter the name"
                                        v-model:value="createForm.name" />
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <div class="double-form-btn g-flex">
                            <a-button class="cancel-form-btn" danger html-type="button"
                                @click="() => isCreateItem = false">CANCEL</a-button>
                            <a-button :loading="loading" class="btn-auth" html-type="submit">CREATE
                                SPECIALIZATION</a-button>
                        </div>
                    </a-form>
                </template>
            </Modal>
        </a-tab-pane>
        <a-tab-pane key="3" tab="Types Of Chicken">
            <Table :data="typesOfChicken" :title="'Types of chicken'" :length="typesOfChicken.length.toString()"
                :columns="columns" :handle-table-search="searchChicken" :handle-delete-item="deleteChickenType"
                :handlePrimaryButtonClicks="() => isCreateItem = true" :btn-name="'Create type'" />

            <Modal :isOpen="isCreateItem" @modal-close="() => isCreateItem = false" mainHeader="CREATE SPECIALIZATION"
                subHeader="Please provide the following details" :width="isSmallScreen ? '80%' : '550px'">
                <template #content>
                    <a-form :model="createForm" ref="formRef" name="basic" :label-col="{ span: 24 }"
                        :wrapper-col="{ span: 24 }" autocomplete="off" @finish="createChicken"
                        @finishFailed="onFinishFailed">
                        <a-row :gutter="16">
                            <a-col :span="24">
                                <a-form-item class="label-input-height" label="Name" name="name"
                                    :rules="[{ required: true, message: 'Please input the name!' }]">
                                    <a-input class="input" placeholder="Please enter the name"
                                        v-model:value="createForm.name" />
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <div class="double-form-btn g-flex">
                            <a-button class="cancel-form-btn" danger html-type="button"
                                @click="() => isCreateItem = false">CANCEL</a-button>
                            <a-button :loading="loading" class="btn-auth" html-type="submit">CREATE
                            </a-button>
                        </div>
                    </a-form>
                </template>
            </Modal>
        </a-tab-pane>
    </a-tabs>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useEntitiesStore } from '../store/entities.store';
import Table from '../components/Table.vue';
import instance from '../api';
import { notify } from '../utils/notify';
import { useScreenSize } from '../utils/useScreenSize';


const { isSmallScreen } = useScreenSize();
const activeKey = ref('1');
const entitiesStore = useEntitiesStore();
entitiesStore.getTypesOfFeed();
entitiesStore.getSpecializations();
entitiesStore.getTypesOfChicken();

const isCreateItem = ref<boolean>(false)
const typesOfFood = computed(() => entitiesStore.typeoffeeds.map((el) => ({ ...el, createdAt: new Date(el.createdAt).toLocaleString('fr-FR') })))
const specializations = computed(() => entitiesStore.specializations.map((el) => ({ ...el, createdAt: new Date(el.createdAt).toLocaleString('fr-FR') })))
const typesOfChicken = computed(() => entitiesStore.typeofchicken.map((el) => ({ ...el, createdAt: new Date(el.createdAt).toLocaleString('fr-FR') })))
const loading = ref(false)

const createForm = ref({
    name: ''
})

const createFood = async () => {
    loading.value = true
    try {
        await instance.post('/typeoffeeds', createForm.value)
        entitiesStore.getTypesOfFeed()
    } catch (error) {
        console.log('errr', error)
    } finally {
        loading.value = false
        createForm.value.name = ''
    }
}
const createSpecialization = async () => {
    loading.value = true
    try {
        await instance.post('/specializations', createForm.value)
        entitiesStore.getSpecializations()
    } catch (error) {
        console.log('errr', error)
    } finally {
        loading.value = false
        createForm.value.name = ''
    }
}

const createChicken = async () => {
    loading.value = true
    try {
        await instance.post('/typeofchicken', createForm.value)
        entitiesStore.getTypesOfChicken()
    } catch (error) {
        console.log('errr', error)
    } finally {
        loading.value = false
        createForm.value.name = ''
    }
}
const searchChicken = (q: string) => {
    entitiesStore.getTypesOfChicken(q)
}
const searchFeed = (q: string) => {
    entitiesStore.getTypesOfFeed(q)
}
const searchSpecialization = (q: string) => {
    entitiesStore.getSpecializations(q)
}
const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: 'createdAt',
        dataIndex: 'createdAt',
        key: 'createdAt',
        format: (val) => new Date(val).toLocaleDateString()
    },
    {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'action'
    }
]
const deleteFeed = async (feedId: string) => {
    loading.value = true
    try {
        await entitiesStore.deleteItem(`/typeoffeeds/${feedId}`);
        notify('success', 'Success', '')
        entitiesStore.getTypesOfFeed();
    } catch (error) {
        notify('error', 'Error', '')
        console.log('err', error);
    } finally {
        loading.value = false
    }
}
const deleteChickenType = async (chickenTypeId: string) => {
    loading.value = true
    try {
        await entitiesStore.deleteItem(`/typeofchicken/${chickenTypeId}`);
        notify('success', 'Success', '')
        entitiesStore.getTypesOfChicken();
    } catch (error) {
        notify('error', 'Error', '')
        console.log('err', error);
    } finally {
        loading.value = false
    }
}
const deleteSpecialization = async (specId: string) => {
    loading.value = true
    try {
        await entitiesStore.deleteItem(`/specializations/${specId}`);
        notify('success', 'Success', '')
        entitiesStore.getSpecializations();
    } catch (error) {
        notify('error', "Error", '')
        console.log('err', error);
    } finally {
        loading.value = false

    }
}

const onFinishFailed = (errorInfo: unknown) => {
    console.log("Failed:", errorInfo)
}

</script>

<style scoped lang="scss">
.double-form-btn {
    display: flex;
    justify-content: space-between;
    gap: 1em;

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
