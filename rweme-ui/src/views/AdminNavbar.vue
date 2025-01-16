<template>
    <div class="admin-navbar">
        <div class="admin-navbar--left">
            <v-icon v-if="isSmallScreen" @click="openMobileNav" class='menu-btn' name="co-hamburger-menu" />
            <p style="padding-left:0.75em">{{ route.name }}</p>
        </div>
        <a-dropdown v-if="!isSmallScreen">
            <template #overlay>
                <a-menu>
                    <a-menu-item key="1" @click="openUpdateProfileModel">Profile</a-menu-item>
                    <a-menu-item @click="() => openChangePassword = true" key="2">Change Password</a-menu-item>
                    <a-menu-item key="3" @click="logout">Logout</a-menu-item>
                </a-menu>
            </template>
            <a-button class="avatar-button">
                <v-icon name="hi-solid-user-circle" />
                {{ loggedInUser?.fullName ? loggedInUser?.fullName : 'Admin' }}
            </a-button>
        </a-dropdown>
        <div v-else>
            <a-button @click="openProfileNav" class="avatar-button">
                <v-icon name="hi-solid-user-circle" />
                {{ loggedInUser?.fullName ? loggedInUser?.fullName : 'Admin' }}
            </a-button>
        </div>
        <div v-if="showMobileNav" class="mobile-sidenav">
            <sidebar-nav :closeNav="closeMobileNav" />
        </div>
        <div v-if="showProfileNav" class="mobile-profile-nav">
            <profile-nav :closeNav="closeProfileNav" :logout="logout" :loggedInUser="loggedInUser"
                :openChangePasswordModel="openChangePasswordModel" />
        </div>
    </div>
    <Modal :width="isSmallScreen ? '80%' : '550px'" :isOpen="openChangePassword"
        @modal-close="() => openChangePassword = false" main-header="Change password"
        subheader="Fill the form to change the password">

        <template #content>
            <a-form :model="changePasswordForm" autocomplete="off" name="basic" :label-col="{ span: 24 }"
                :wrapper-col="{ span: 24 }">
                <a-form-item label="Old password" name="oldPassword">
                    <a-input-password class="input" v-model:value="changePasswordForm.oldPassword" />
                </a-form-item>
                <a-form-item label="New password" name="newPassword">
                    <a-input-password class="input" v-model:value="changePasswordForm.newPassword" />
                </a-form-item>
                <a-form-item label="Comfirm password" name="comfirmPassword" :rules="[
                    { required: true, message: 'Please confirm your password!' },
                    { validator: validateConfirmPassword }
                ]" validate-trigger="change">
                    <a-input-password class="input" v-model:value="changePasswordForm.comfirmPassword" />
                </a-form-item>
                <a-button class="auth-btn" @click="changePassword" :loading="changePasswordLoading">Change
                    Password</a-button>
            </a-form>
        </template>
    </Modal>
    <Modal :width="isSmallScreen ? '80%' : '550px'" :isOpen="openUpdateProfile" @modal-close="closeUpdateProfileModel"
        :main-header="'UPDATE PROFILE'" subHeader="Fill the form to update your profile.">
        <template #content>
            <update-user-profile :cancelButton="closeUpdateProfileModel" />
        </template>
    </Modal>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import { useAuthStore } from '../store/auth.store';
import instance from '../api';
import { notify } from '../utils/notify';
import { Form } from 'ant-design-vue';
import { useScreenSize } from '../utils/useScreenSize';

const { loggedInUser, logoutUser } = useAuthStore();
const { isSmallScreen } = useScreenSize()

const route = useRoute()
const router = useRouter()
const openChangePassword = ref<boolean>(false)
const openUpdateProfile = ref<boolean>(false)
const changePasswordLoading = ref<boolean>(false)
const openChangePasswordModel = () => {
    openChangePassword.value = true
}
const openUpdateProfileModel = () => {
    openUpdateProfile.value = true
}
const closeUpdateProfileModel = () => {
    openUpdateProfile.value = false
}
interface IchangePassword {
    oldPassword: string;
    newPassword: string;
    comfirmPassword: string;
}
const changePasswordForm = ref<IchangePassword>({
    oldPassword: '',
    newPassword: '',
    comfirmPassword: ''
})
const formRef = ref();

const logout = () => {
    logoutUser();
    router.replace('/auth/login')
}
const changePassword = async () => {
    changePasswordLoading.value = true
    await instance.patch('/auth/changePassword', { ...changePasswordForm.value }).then(() => {
        changePasswordLoading.value = false
        notify('success', 'Success', 'Password changed successfully!!!')
    }).catch((err) => {
        changePasswordLoading.value = false
        notify('error', "Error", err.response.data.message)
    })
    resetFields()
}
const validatePassword = () => {
    formRef.value.validateFields(['newPassword']);
};
const validateConfirmPassword = async (_rule: any, value: string) => {
    if (changePasswordForm.value.newPassword !== value) {
        return Promise.reject('The two passwords do not match!');
    }
    return Promise.resolve();
};

const { resetFields } = Form.useForm(changePasswordForm, {
    oldPassword: [
        { required: true, message: 'Please input your password!' },
        { pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, message: 'Password must be at least 8 characters long contain both letters,numbers and at least one special character.' }
    ],
    comfirmPassword: [
        { required: true, message: 'Please confirm your password!' },
        { validator: validateConfirmPassword }
    ]
});
const showMobileNav = ref(false)
const showProfileNav = ref(false);
const openProfileNav = () => {
    showProfileNav.value = true
}
const closeProfileNav = () => {
    showProfileNav.value = false
}
const closeMobileNav = () => {
    showMobileNav.value = false
}
const openMobileNav = () => {
    showMobileNav.value = true
    console.log('here-here-nav', showMobileNav.value);
}

const handleMenuClick = () => {
    console.log('menu clicked')
}


</script>

<style scoped lang="scss">
.admin-navbar {
    position: relative;
    height: 3.75em;
    background-color: rgba(28, 130, 23, 0.68);
    color: white;
    padding-block: .45em;
    padding-inline: 1em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    font-size: 0.875em;
}

.avatar-button {
    height: 2.5em;
    color: white;
    display: flex;
    align-items: center;
    gap: 1.2em;
    background-color: transparent;
    border: none;
    outline: none;

    &:hover {
        color: white;
    }
}

:deep .ant-form-item {
    margin-bottom: 4px
}

:deep .ant-form-item-label {
    font-weight: 600;
}

.auth-btn {
    margin-top: 1em;
    width: 100%;
    height: 3em;
    background-color: rgb(30, 144, 255, 0.68);
    color: white;
    outline: none;
    border: none;

    &:hover {
        background-color: rgb(30, 144, 255, 1);
        color: white;
    }
}

.menu-btn {
    width: 1.8em;
    height: 1.8em
}

.admin-navbar--left {
    display: flex;
    justify-content: center;
    align-items: center;
}

.mobile-sidenav,
.mobile-profile-nav {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10;
    width: 100vw;
    height: 100vh
}
</style>