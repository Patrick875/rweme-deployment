<template>
    <div class="modal" v-if="props.isOpen" @mousedown="onMouseDown" @click.self="onClickSelf">
        <div class="modal-shadow"></div>

        <div :class="`modal-container  ${customContainerClass}`"
            :style="{ width: props.width, paddingTop: isCustomWrapper ? '0px' : '', overflowY: disableVerticalOverFlow ? 'hidden' : 'auto' }">
            <div :class="customerWrapper ? 'modal-content-container-hiddenScroll' : ''">
                <div :class="`modal-header g-flex  ${customHeaderClass}`">
                    <div>
                        <div class="heading--1">
                            {{ props.mainHeader }}
                        </div>
                        <div :class="`heading--2 ${subheaderClass}`">
                            {{ props.subHeader }}
                        </div>
                    </div>
                    <div class='close-icon'>
                        <CloseOutlined style="cursor: pointer" @click="toogleModalHander" />
                    </div>
                </div>
                <div class="modal-body">
                    <slot name="content"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineEmits, ref } from "vue"
import { CloseOutlined } from "@ant-design/icons-vue"


const props = defineProps({
    isOpen: { type: Boolean, default: false },
    mainHeader: { type: String, default: "Default header" },
    subHeader: { type: String, default: "Please provide the following details" },
    width: { type: String, default: "450px" },
    subheaderClass: { type: String, default: "" },
    headerClass: { type: String, default: "" },
    isCustomWrapper: { type: Boolean, default: false },
    customContainerClass: { type: String, default: "" },
    customHeaderClass: { type: String, default: "" },
    disableVerticalOverFlow: { type: Boolean, default: false }
})

const emit = defineEmits(["modal-close"])

const clickInsideModal = ref(false)

const onMouseDown = (event) => {
    // Check if the click started inside the modal container
    const modalContainer = event.target.closest('.modal-container')
    clickInsideModal.value = !!modalContainer
}

const toogleModalHander = () => {
    emit("modal-close")
}


const onClickSelf = () => {
    if (!clickInsideModal.value) {
        emit('modal-close')
    }
}

</script>

<style lang="scss" scoped>
@import "../styles/_modal.scss";
@import "../styles/_table.scss";

.modal-container-hiddenScroll {
    overflow-y: scroll;
}

.modal-container-hiddenScroll::-webkit-scrollbar {
    display: none;
}

.g-flex {
    position: relative;

    // display: grid;
    // grid-template-columns: repeat(2, 1fr);
    // justify-items: flex-end;
    .close-icon {
        position: absolute;
        right: 0;
        top: 0;
    }
}

.modal-container-hiddenScroll {
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.modal-content-container-hiddenScroll {
    position: relative;
    margin: 0;
}

.modal-header-hiddenScroll {
    position: sticky;
    top: 0;
    background-color: white;
    padding-top: 30px;
}

.rejected,
.testing,
.pending,
.dispatched,
.ready,
.waiting-received {
    font-weight: 500;
    border-radius: 10px;
    padding: 0 14px;
    width: fit-content;
    text-transform: lowercase;
}

.waiting-received {
    color: #078ece;
    background-color: #f0f9ff;
}

.rejected {
    color: #d80027;
    background-color: #f3dee2;
}

.testing {
    color: #9747ffe6;
    background-color: #9747ff1a;
}

.pending {
    color: #475467;
    background-color: #edeef0;
}

.ready {
    color: #00a96c;
    background-color: #e6f7f1;
}
</style>
