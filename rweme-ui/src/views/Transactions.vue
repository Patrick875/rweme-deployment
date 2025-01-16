<template>
    <div>
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" tab="RWEME Transactions">
                <div class="transactions">
                    <div class="transactions-body">
                        <Table :data="transactions" :title="'Transactions'" :length="String(transactions.length)"
                            :user-can-delete="false" :loading="loading" :handleTableSearch="handleSearch"
                            :columns="columns" />
                        <a-table :columns="columns" :dataSource="transactions" rowKey="id" />
                    </div>
                </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="MOMO Transactions">
                <div class="transactions">

                    <div class="transactions-body">
                        <a-table :columns="columns" :dataSource="transactions" rowKey="id" />
                    </div>
                </div>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useEntitiesStore } from '../store/entities.store';

const activeKey = ref('1');

const entitiesStore = useEntitiesStore();
const loading = computed(() => entitiesStore.loading)
entitiesStore.getAllTransactions()

const transactions = computed(() => entitiesStore.transactions.map((el) => ({
    id: el.transactionId,
    date: new Date(el.createdAt).toLocaleString('fr-FR'),
    feedRequestId: el.foodRequestId,
    farmerName: el?.Farmer?.fullName,
    supplierName: el?.Supplier?.User?.fullName,
    amount: el.amount,
    status: el.status

})))

const handleSearch = (q: string) => {
    entitiesStore.getAllTransactions(q);
};
const columns = [
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date'
    },
    {
        title: 'Transaction ID',
        dataIndex: 'id',
        key: 'id'
    },
    {
        title: 'Feed request ID',
        dataIndex: 'feedRequestId',
        key: 'feedRequestId'
    },
    {
        title: 'Farmer',
        dataIndex: 'farmerName',
        key: 'farmerName'
    },
    {
        title: 'Supplier',
        dataIndex: 'supplierName',
        key: 'supplierName'
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount'
    },

    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status'
    },
    {
        title: 'Action',
        key: 'action',
        slots: { customRender: 'action' }
    }
]

// const transactions = [
//     {
//         id: 1,
//         date: '2023-12-19',
//         feedRequestId: 1,
//         farmerName: 'John Doe',
//         supplierName: 'Jane Doe',
//         amount: 1000,
//         status: 'Pending'
//     },
//     {
//         id: 2,
//         date: '2023-12-20',
//         feedRequestId: 2,
//         farmerName: 'John Doe',
//         supplierName: 'Jane Doe',
//         amount: 2000,
//         status: 'Completed'
//     },
//     {
//         id: 3,
//         date: '2023-12-21',
//         feedRequestId: 3,
//         farmerName: 'John Doe',
//         supplierName: 'Jane Doe',
//         amount: 3000,
//         status: 'Pending'
//     }
// ]

</script>

<style scoped></style>