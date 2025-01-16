<template>
  <div class="table-container">
    <div class="table">
      <div class='table-header' v-if="!isSmallScreen">
        <a-row>
          <a-col v-if="!isReportsTable" class="title-table" :span="4">
            <div class="margin-text">
              {{ title }} <span class="number-style">{{ length }}</span>
            </div>
          </a-col>
          <a-col v-if="!isReportsTable" :span="8">
            <a-input v-model:value="search" :placeholder="props.placeholder">
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
          </a-col>
          <p v-if="isReportsTable" class="margin-text" style="text-align: center;font-weight:bold">{{ title }} </p>
          <a-col v-if="!isReportsTable" :span="12">
            <div class="filter-section">
              <a-button class="btn-export" v-if="isShowFilter">Filter List</a-button>
              <a-button class="btn-export" @click="() => props.resetFilter()">Reset</a-button>
              <a-dropdown>
                <template #overlay>
                  <a-menu @click="handleExport">
                    <a-menu-item @click="() => props.exportPDF()" key="1"> Excel </a-menu-item>
                  </a-menu>
                </template>
                <a-button class="btn-export export-margin">
                  Export List
                  <CaretDownOutlined />
                </a-button>
              </a-dropdown>
              <span>
                <span v-if="props.btnName">
                  <a-button :disabled="isDisabled" :class="!isDisabled ? 'btn-create' : 'btn-disabled'"
                    @click="() => props.handlePrimaryButtonClicks()">{{ btnName }}
                  </a-button>
                </span>
              </span>
            </div>
          </a-col>
        </a-row>
      </div>
      <div v-else>
        <div class="margin-text">
          {{ title }} <span class="number-style">{{ length }}</span>
        </div>
        <a-row :gutter="[20, 20]">
          <a-col v-if="!isReportsTable" :span="16">
            <a-input v-model:value="search" :placeholder="props.placeholder">
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
          </a-col>
          <a-col v-if="!isReportsTable" :span="8">
            <div class="filter-section">
              <a-dropdown>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="1" v-if="isShowFilter">
                      Filter
                    </a-menu-item>
                    <a-menu-item key="2" @click="() => props.resetFilter()">
                      Reset
                    </a-menu-item>
                    <a-menu-item key="3" @click="() => props.exportPDF()">
                      Export
                    </a-menu-item>
                    <a-menu-item key="4" v-if="props.btnName" @click="() => props.handlePrimaryButtonClicks()">
                      Create
                    </a-menu-item>
                  </a-menu>
                </template>
                <a-button class="btn-export export-margin">
                  More actions
                </a-button>
              </a-dropdown>
            </div>
          </a-col>
        </a-row>
      </div>
      <a-table :columns="props.columns" :data-source="props.data">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            {{ record.name }}
          </template>
          <template v-else-if="column.key === 'typeOfChicken' && column.title === 'Category'">
            {{ record.typeOfChicken?.toUpperCase() || 'N/A' }}
          </template>
          <template v-else-if="column.key === 'specializations'">
            <span>
              <a-tag v-for="tag in record.specializations" :key="tag" color="geekblue">
                {{ tag.name.toUpperCase() }}
              </a-tag>
            </span>
          </template>
          <template v-else-if="column.key === 'typeoffeeds'">
            <span>
              <a-tag v-for="tag in record.typeoffeeds" :key="tag" color="geekblue">
                {{ tag.name.toUpperCase() }}
              </a-tag>
            </span>
          </template>
          <template v-else-if="column.key === 'status'">
            <span>
              <a-tag
                :color="[accountStatus.active, 'Completed'].includes(record.status) ? 'success' : [accountStatus.blocked, accountStatus.deleted, accountStatus.inactive].includes(record.status) ? 'error' : 'default'">
                {{ record.status.toUpperCase() }}
              </a-tag>
            </span>
          </template>
          <template v-else-if="column.key === 'action'">
            <div class="actions-column">
              <v-icon v-if="record.isFarmer || record.isFoodRequest" @click="onView(record)" class='view-icon-style'
                name="bi-eye" />
              <div @click="props.handleUpdateAction(record.id)" class="action-icon" data-caption='Edit'>
                <v-icon v-if="record.status == accountStatus.active" class='edit-icon-style ' name="fa-edit" />
              </div>
              <div class='action-icon' data-caption='Activate'>
                <v-icon @click="() => triggerUpdateStatus(record, 'Active')"
                  v-if="['Inactive', 'Blocked'].includes(record.status)"
                  class='active-style  active-icon-style action-icon' name="co-check-alt" />
              </div>
              <div class='action-icon' data-caption='Deactivate'>
                <v-icon @click="() => triggerUpdateStatus(record, 'Inactive')"
                  v-if="record.status == accountStatus.active" class='deactivate-icon-style action-icon'
                  name="bi-eye-slash" />
              </div>
              <div v-if='props.userCanDelete' class='action-icon' data-caption='Delete'>
                <v-icon @click="() => triggerDelete(record.id)" v-if="record.status !== accountStatus.deleted"
                  class='deactivate-icon-style action-icon' name="ri-delete-bin-7-line" />
              </div>
            </div>
          </template>
        </template>
      </a-table>
      <Modal :isOpen="isToggleStatusUpdateModal" @modal-close="() => isToggleStatusUpdateModal = false"
        mainHeader="UPDATE STATUS"
        :subHeader="`Are you sure you want to ${newStatus == 'Active' ? 'Activate' : 'Deactivate'} this ${currentEntity}`"
        :width="isSmallScreen ? '80%' : '550px'">
        <template #content>
          <div class='delete-btns'>
            <a-button class="cancel-form-btn" danger html-type="button"
              @click="() => isToggleStatusUpdateModal = false">CANCEL</a-button>

            <a-button :loading="props.loading" class="btn-auth"
              @click="updateItemStatus(updateInfo.itemId, updateInfo.userId, updateInfo.status)">{{ newStatus ==
                'Active'
                ? 'Activate' : 'Deactivate' }}</a-button>
          </div>
        </template>
      </Modal>
      <Modal :isOpen="isToggleDeleteModal" @modal-close="closeModal" mainHeader="DELETE"
        :subHeader="`Are you sure you want to delete this ${currentEntity}`" :width="isSmallScreen ? '80%' : '550px'">
        <template #content>
          <div class='delete-btns'>
            <a-button class="cancel-form-btn" danger html-type="button" @click="closeModal">CANCEL</a-button>
            <a-button :loading="props.loading" class="btn-auth" @click="deleteItem">Delete</a-button>
          </div>
        </template>
      </Modal>
    </div>
  </div>

</template>
<script lang="ts" setup>
import { PropType, ref, watch } from 'vue';
import { accountStatus } from '../utils/enums';
import Modal from './Modal.vue'
import { useRouter, useRoute } from 'vue-router'
import { useEntitiesStore } from '../store/entities.store';
import { useScreenSize } from '../utils/useScreenSize';
interface Column {
  title: string
  dataIndex: string
  key: string
}
interface updateData {
  itemId: string | null
  status: string | null
  userId: string | null
}

// const { isSmallScreen } = useScreenSize()
const router = useRouter();
const route = useRoute()
const currentEntity = route.fullPath.substring(1, route.fullPath.length - 1)
const entitiesStore = useEntitiesStore()
const onView = (record: any) => {
  if (record.isFarmer) {
    router.push(`/farmers/${record.id}`)
  } else {
    props.handleViewDetails(record)
    // entitiesStore.setViewableItem(record.id)
  }
}
const deleteTargetItemId = ref<string>('')
const updateInfo = ref<updateData>({
  itemId: null,
  userId: null,
  status: null
})
const newStatus = ref<string>('Deactivate');
const isToggleDeleteModal = ref<boolean>(false);
const isToggleStatusUpdateModal = ref<boolean>(false);
const isToggleUpdateModal = ref<boolean>(false);

const { isSmallScreen } = useScreenSize()
const closeModal = () => {
  isToggleDeleteModal.value = false

}
const triggerDelete = (recordId: string) => {
  isToggleDeleteModal.value = true
  deleteTargetItemId.value = recordId as string
}
const triggerUpdateStatus = (record: any, status: string) => {
  newStatus.value = status
  isToggleStatusUpdateModal.value = true
  updateInfo.value = {
    userId: record.User.id,
    itemId: record.id,
    status
  }
}
const deleteItem = () => {
  props.handleDeleteItem(deleteTargetItemId.value)
}
const updateItemStatus = (itemId: string | null, userId: string | null = '', status: string | null = '') => {
  props.handleUpdateItemStatus({ itemId, userId, status })
}
watch([isToggleDeleteModal], ([newVal]) => {
  if (newVal === false) {
    deleteTargetItemId.value = ''
  }
})

const search = ref<string>('')

watch(search, (newSearch) => {
  props.handleTableSearch(newSearch)
})

const props = defineProps({
  columns: {
    type: Array as PropType<Column[]>,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  length: {
    type: String,
    default: "",
  },
  btnName: {
    type: String,
    default: "",
    required: false,
  },
  isShowFilter: {
    type: Boolean,
    default: true,
    required: false,
  },
  userCanDelete: {
    type: Boolean,
    default: true
  },
  placeholder: {
    type: String,
    default: "Search for a user",
  },
  buttonComponent: {
    type: Object as PropType<any>,
    required: false,
    default: null,
  },
  handlePrimaryButtonClicks: {
    type: Function,
    default: () => { },
  },
  handleUpdateAction: {
    type: Function,
    default: () => { },
  },
  handleTableSearch: {
    type: Function,
    default: () => { }
  },
  exportPDF: {
    type: Function,
    default: () => { },
  },
  handleUpdateItemStatus: {
    type: Function,
    default: () => { },
  },
  handleUpdateVet: {
    type: Function,
    default: () => { },
  },
  handleDeleteItem: {
    type: Function,
    default: () => { },
  },
  handleViewDetails: {
    type: Function,
    default: () => { }
  },
  handleExport: {
    type: Function,
    default: () => { },
  },

  resetFilter: {
    type: Function,
    default: () => { },
  },

  redirectToConfirmation: {
    type: Function,
    default: () => { },
  },
  isTableBorder: {
    type: Boolean,
    default: false,
  },
  isReportsTable: {
    type: Boolean,
    default: false,
  },
  isPaginated: {
    type: Boolean,
    default: true,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  isApiPagination: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  apiCurrentPage: {
    type: Number,
    default: 1
  }
})



</script>

<style lang="scss" scoped>
@import "./../styles/table";

.actions-column {
  display: flex;
  gap: 0.10em;
  align-items: center;
}

.table-header {
  margin-bottom: 1em;
}

.delete-btns {
  width: 100%;
  display: flex;
  gap: 1em;
  text-transform: capitalize;

  :deep {
    .ant-btn {
      width: 50%;
      display: block
    }
  }
}
</style>
