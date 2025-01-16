<template>
    <div>
        <Table :data="suppliers" :title="'Suppliers'" :length="String(suppliers.length)"
            :handle-table-search="handleSearch" :handleDeleteItem="deleteSupplier" :loading="loading"
            :handleUpdateItemStatus="updateSupplierStatus" :handle-update-action="handleUpdateSupplier"
            :handlePrimaryButtonClicks="handleCreateToggleSupplier" :btn-name="'Create Supplier'" :columns="columns" />
        <Modal :isOpen="isToggleUpdateVeternary" @modal-close="closeCreateSupplier" mainHeader="CREATE SUPPLIER"
            subHeader="Please provide the following details to create a supplier"
            :width="isSmallScreen ? '80%' : '550px'">
            <template #content>
                <create-supplier :cancelButton="closeCreateSupplier"></create-supplier>
            </template>
        </Modal>
        <Modal :isOpen="isToggleUpdateModal && supplier" @modal-close="() => isToggleUpdateModal = false"
            :mainHeader="'UPDATE SUPPLIER'" :subHeader="'Provide the following details to update the supplier'"
            :width="isSmallScreen ? '80%' : '550px'">
            <template #content>
                <update-supplier :vet="supplier" :cancelButton="() => isToggleUpdateModal = false"></update-supplier>
            </template>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Table from '../components/Table.vue'
import Modal from "../components/Modal.vue"
import { useEntitiesStore } from '../store/entities.store';
import { useScreenSize } from '../utils/useScreenSize';

const { isSmallScreen } = useScreenSize()
const loading = ref<boolean>(false);
const entitiesStore = useEntitiesStore()
const isToggleUpdateVeternary = ref<boolean>(false)
const isToggleUpdateModal = ref<boolean>(false)
const handleCreateToggleSupplier = () => {
    isToggleUpdateVeternary.value = !isToggleUpdateVeternary.value
}
const closeCreateSupplier = () => {
    isToggleUpdateVeternary.value = false
}
const suppliers = computed(() => entitiesStore.suppliers.map((item) => ({
    ...item,
    fullName: item.User.fullName,
    telephone: item.User.telephone,
    email: item.User.email,
    status: item.User.status,
    typeoffeeds: item.TypeOfFeed,
    momoPay: item.momoPay,
    location: item.User.Village.name,
    key: item.id
})))
const supplier = computed(() => entitiesStore.supplier)
const handleUpdateSupplier = async (supplierId: string) => {
    await entitiesStore.getSupplier(supplierId);
    isToggleUpdateModal.value = true
}
const deleteSupplier = async (supplierId: string) => {
    loading.value = true
    try {
        await entitiesStore.deleteItem(`/suppliers/${supplierId}`);
        entitiesStore.getSuppliers();
    } catch (error) {
        console.log('err', error);
    } finally {
        loading.value = false
    }
}
const updateSupplierStatus = async (data: any) => {
    loading.value = true
    try {
        await entitiesStore.updateStatus(`/suppliers/status-update`, { ...data, supplierId: data.itemId });
        entitiesStore.getSuppliers();
    } catch (error) {
        console.log('err', error);
    } finally {
        loading.value = false
    }
}
const handleSearch = (q: string) => {
    entitiesStore.getSuppliers(q)
}
const columns = [
    {
        title: 'Name',
        dataIndex: 'fullName',
        key: 'fullName'
    },
    {
        title: 'Location',
        dataIndex: 'location',
        key: 'location'
    },
    {
        title: 'Telephone',
        dataIndex: 'telephone',
        key: 'telephone'
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email'
    },
    {
        title: 'Types of feed',
        dataIndex: 'typeoffeeds',
        key: 'typeoffeeds'
    },
    {
        title: 'MOMO PAY',
        dataIndex: 'momoPay',
        key: 'momoPay'
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status'
    },
    {
        title: 'Action',
        dataIndex: 'action',
        key: 'action'
    },

]

entitiesStore.getSuppliers();
</script>

<style scoped lang="scss"></style>