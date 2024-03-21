<template>
    <div class="content">
        <metodosPago :metodosPago="pagos" :id="id" @update="getSettings" />

        <reservaConfig :config="config" @update="getSettings" />

        <formReservaConfig />

        <defaultConfig :id="id" :updateDivisas="updateDivisas" />

        <divisasConfig @updateDivisas="updateDivisas = true" />

        <EmpresaComponent :empresa="empresa" :id="id" @update="getSettings" />

    </div>
</template>

<script>

import service from '@/services/service'
import metodosPago from './components/metodosPago'
import reservaConfig from './components/reservaConfig'
import defaultConfig from './components/defaultConfig'
import divisasConfig from './components/divisasConfig'
import EmpresaComponent from './components/empresaComponent'
import formReservaConfig from './components/formReservaConfig'

export default {
    name: 'settingsApp',
    components: {
        metodosPago,
        reservaConfig,
        defaultConfig,
        divisasConfig,
        EmpresaComponent,
        formReservaConfig,
    },
    watch: {
        updateDivisas: {
            handler(newItem) {
                if (newItem) {
                    setTimeout(() => { this.updateDivisas = false }, 100)
                }
            },
            immediate: true,
        },
    },
    data() {
        return {
            id: 0,
            config: {},
            pagos: [],
            empresa: null,
            updateDivisas: false,
        }
    },
    methods: {
        /**
         * Obtiene la configuración general del sistema.
         */
        getSettings() {
            service.obtenerConfig()
                .then(res => {
                    // Asigna los valores obtenidos a las variables del componente
                    this.id = res.id
                    this.config = res
                    this.pagos = res.pagos
                    this.empresa = res.empresa
                })
                .catch(err => {
                    console.error(err)
                })
        }
    },
    mounted() {
        this.getSettings()
    },
}
</script>

<style scoped>
.content {
    gap: 10px;
    padding-bottom: 20px;
}
</style>