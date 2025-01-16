<template>
    <div>
        <p>AMAZERANO YO GUTANGA IBIRYO BY INKOKO</p>
        <p>Hagati ya NZANANA Ishimwe Diane n' umworozi <span class="famerInfo"> {{ newFarmer?.fullName }}</span></p>
        <p>Itariki ya <span class="famerInfo">{{ new Date().toLocaleDateString('fr-FR') }}</span> </p>
        <p>Abafatanyabikorwa</p>
        <p>1. NZANANA Ishimwe Diane ("Utanza ibiryo"), uherereye mu karere ka BUGESERA, Umurenge wa Ntarama akaba
            agamije gufasha aborozi b' inkoko kwiteza imbere no kongera umusaruro.</p>
        <p>2. Umworozi ("Uhawe ibiryo"), witwa <span class="famerInfo">{{ newFarmer?.fullName }}</span> ufite nimero y
            indangamuntu <span class="famerInfo">{{
                newFarmer?.nationalId }} </span> na telephone
            <span class="famerInfo">{{ newFarmer?.telephone }}</span> aherereye mu karere ka <span class="famerInfo">
                {{ farmerDistrict }}
            </span>
            umurenge wa
            <span class="famerInfo">{{ farmerSector }}</span>
            akagari
            ka
            <span class="famerInfo">{{ farmerCell }}</span> umudugudu <span class="famerInfo">{{ farmerVillage
                }}</span>
            Ufite
            inkoko <span class="famerInfo"> {{
                newFarmer?.numberOfChicken }} </span> z' ubwoko bwa
            <span class="famerInfo">
                {{ newFarmer?.typeOfChicken }}
            </span>

        </p>
        <p>1. IMIKORANIRE :</p>
        <p> NZANANAIshimwe Diane azagurira Uwemera inguzanyo y' ibiryo by'inkoko, Uwemera
            inguzanyo agomba kwishyura NZANANA Ishimwe Diane amafaranga angana n'igiciro cy'
            ibiryo byatanzwe hongeweho inyungu ya 10% kuri buri kirogarama (kg).
        </p>
        <p>2.Ibisobanuro by'Inguzanyo:</p>
        <p> Uburemere bw'Ibiryo: <span>{{ newFarmer.FarmStatus.amountOfFeedToBeDelivered }}</span> kg, Igiciro cya buri
            kg : <span class="famerInfo">{{ newFarmer.FarmStatus.priceOfFeedToBeDelivered }}</span>rwf ,
            Inyungu 10% : <span class="famerInfo">{{ Number(newFarmer.FarmStatus.totalAmountToBePaid) * 10 / 100
                }}</span> , Umubare wose
            uzishyurwa:<span class="famerInfo">
                {{ Number(newFarmer.FarmStatus.totalAmountToBePaid) * 10 / 100 +
                    Number(newFarmer.FarmStatus.totalAmountToBePaid) }}
            </span></p>
        <p v-if="newFarmer?.typeOfChicken.toUpperCase() == 'LAYER'"> Kwishyura inguzanyo buri byumweru bibiri bibiri
            icyakabiri cy' inguzanyo binyujijwe kuri
            MOMOcode…708926……Yanditse kuri Jacque.,
            Itariki y'ikiciro cya mbere: <span class="famerInfo">{{ new
                Date(firstInstallmentAt).toLocaleDateString('fr-FR') }}</span> , Itariki
            y'ikiciro cya kabiri: <span class="famerInfo"> {{ new Date(secondInstallmentAt).toLocaleDateString('fr-FR')
                }} </span> .</p>
        <p v-else>
            Kwishyura inguzanyo buri kwezi inguzanyo yose binyujijwe kuri MOMOcode…708926……Yanditse kuri Jacque.,
            Itariki ya mbere yo kwishyura ni: <span class="famerInfo">{{ new
                Date(firstInstallmentAt).toLocaleDateString('fr-FR') }}</span>
        </p>
        <p>1. Umwishingizi</p>
        <p>Amazina: <span class="famerInfo">{{ newFarmer?.nextOfKin.fullName }}</span>, Nimero y'indangamuntu:
            <span class="famerInfo">{{ newFarmer?.nextOfKin.nationalId }}</span>
            Isano bafitanye: <span class="famerInfo">{{ newFarmer?.nextOfKin.relation }}</span> Umukono:
            ______________________
        </p>
        <div class="signature">
            <div>
                <p>6. Gusinya:</p>
                <p>NZANANA Ishimwe Diane</p>
                <p>Umukono:</p>
            </div>
            <div>
                <p>Amazina y' Umworozi : <span class="famerInfo">{{ newFarmer?.fullName }}</span> </p>
                <p>Umukono:</p>
            </div>
        </div>
        <div class="double-form-btn g-flex">
            <a-button class="cancel-form-btn" danger html-type="button" @click="props.cancelButton">CANCEL</a-button>
            <a-button :loading="props.loading" class="btn-auth" @click="props.sign">SIGN </a-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const farmerVillage = ref('')
const farmerCell = ref('')
const farmerSector = ref('')
const farmerDistrict = ref('')
const today = new Date()
const farmer = localStorage.getItem('newFarmer');
const newFarmer = JSON.parse(farmer as string)
const firstInstallmentAt = newFarmer?.typeOfChicken.toUpperCase() == 'LAYER' ? new Date().setDate(today.getDate() + 14) : new Date().setDate(today.getDate() + 30)
const secondInstallmentAt = new Date().setDate(today.getDate() + 30)

const props = defineProps({
    cancelButton: {
        type: Function,
        default: () => { },
    },
    sign: {
        type: Function,
        default: () => { },
    },
    loading: {
        type: Boolean,
        default: false
    }
})



</script>

<style lang="scss" scoped>
.signature {
    display: flex;
    justify-content: space-between;
}

.famerInfo {
    font-weight: bold;
    text-transform: uppercase;
}

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