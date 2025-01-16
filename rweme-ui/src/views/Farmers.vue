<template>
    <div>
        <Table :data="farmers" :title="'Farmers'" :length="String(farmers.length)" :user-can-delete="!isVeternary"
            :loading="loading" :handleTableSearch="handleSearch" :handlePrimaryButtonClicks="handleCreateFarmer"
            :btn-name="'Add new farmer'" :columns="columns" :handleDeleteItem="deleteFarmer" />
        <Modal :isOpen="isToggleCreateFarmer" @modal-close="closeCreateFarmerModal" mainHeader="CREATE FARMER"
            subHeader="Fill the details to create a new farmer" :width="isSmallScreen ? '80%' : '550px'">
            <template #content>
                <create-farmer-form :onComplete="next" :cancelButton="closeCreateFarmerModal"></create-farmer-form>
            </template>
        </Modal>
        <Modal :isOpen="isToggleSignContract" @modal-close="closeCloseContractSignModal" mainHeader="SIGN CONTRACT"
            subHeader="click sign to sign the contract " :width="isSmallScreen ? '80%' : '550px'">
            <template #content>
                <farmer-contract :loading="loading" :cancelButton="closeCloseContractSignModal"
                    :sign="handleFarmerContract"></farmer-contract>
            </template>
        </Modal>
        <Modal :isOpen="isToggleComfirmFarmer" @modal-close="closeComfirmFarmerModal" mainHeader="" subHeader=""
            :width="isSmallScreen ? '80%' : '550px'">
            <template #content>
                <ComfirmOTP :next="next" :cancelButton="closeComfirmFarmerModal"></ComfirmOTP>
            </template>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import instance from '../api';
import { ref, computed } from 'vue';
import Table from '../components/Table.vue';
import { useEntitiesStore } from '../store/entities.store';
import { useAuthStore } from '../store/auth.store';
import { userRoles } from '../utils/enums';
import { useScreenSize } from '../utils/useScreenSize';

const { isSmallScreen } = useScreenSize()
const loading = ref<boolean>(false);
const entitiesStore = useEntitiesStore();
const authStore = useAuthStore();
const logedInUser = computed(() => authStore.user);
const isVeternary = computed(() => logedInUser.value?.role === userRoles.veternary);
const isToggleCreateFarmer = ref<boolean>(false);
const farmers = computed(() =>
    entitiesStore.farmers.map((item) => ({
        ...item,
        isFarmer: true,
        location: item.Village?.name,
        veternaryInCharge: item.Veternary.User.fullName,
        key: item.id,
    }))
);
const isToggleSignContract = ref<boolean>(false);
const closeCloseContractSignModal = () => {
    isToggleSignContract.value = false;
};


const columns = [
    { title: 'Name', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    { title: 'Category', dataIndex: 'typeOfChicken', key: 'typeOfChicken' },
    { title: 'Number of Chicken', dataIndex: 'numberOfChicken', key: 'numberOfChicken' },
    { title: 'Veternary In Charge', dataIndex: 'veternaryInCharge', key: 'veternaryInCharge' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Actions', dataIndex: 'actions', key: 'action' },
];

const closeCreateFarmerModal = () => {
    isToggleCreateFarmer.value = false;
};
const handleCreateFarmer = () => {
    isToggleCreateFarmer.value = true;
};
const next = () => {
    isToggleCreateFarmer.value = false;
    isToggleSignContract.value = true;
};
const deleteFarmer = async (farmerId: string) => {
    loading.value = true;
    try {
        await entitiesStore.deleteItem(`/farmers/${farmerId}`);
        entitiesStore.getFarmers();
    } catch (error) {
        console.log('err', error);
    } finally {
        loading.value = false;
    }
};
const handleSearch = (q: string) => {
    entitiesStore.getFarmers(q);
};
const isToggleComfirmFarmer = ref<boolean>(false);

const closeComfirmFarmerModal = () => {
    isToggleComfirmFarmer.value = false
}
const handleFarmerContract = async () => {

    isToggleComfirmFarmer.value = true
    const farmer = localStorage.getItem('newFarmer');
    const newFarmer = JSON.parse(farmer as string)
    try {
        loading.value = true;
        if (newFarmer) {
            await instance.post(`/farmers/sendotp/${newFarmer.id}`)
        } else {
            console.log('local-storage-error')
        }
    } catch (error) {
        console.log('error', error);
    } finally {
        loading.value = false;
        isToggleSignContract.value = false;
    }


}
entitiesStore.getFarmers();
</script>

<style scoped></style>
