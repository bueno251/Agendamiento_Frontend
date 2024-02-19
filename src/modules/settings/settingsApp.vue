<template>
    <div class="content">
        <metodosPago :metodosPago="pagos" :id="id" @update="getSettings" />

        <canReservar :bolean="usuario_reserva" :id="id" @update="getSettings" />

        <EmpresaComponent :empresa="empresa" :id="id" @update="getSettings" />

        <defaultConfig :id="id" />
    </div>
</template>

<script>

import metodosPago from './components/metodosPago'
import canReservar from './components/canReservar'
import EmpresaComponent from './components/empresaComponent'
import defaultConfig from './components/defaultConfig'
import configService from './services/configService'

export default {
    name: 'settingsApp',
    components: {
        metodosPago,
        canReservar,
        EmpresaComponent,
        defaultConfig,
    },
    data() {
        return {
            id: 0,
            usuario_reserva: true,
            pagos: [],
            empresa: null,
        }
    },
    methods: {
        /**
         * Obtiene la configuración general del sistema.
         */
        getSettings() {
            configService.obtener()
                .then(res => {
                    // Asigna los valores obtenidos a las variables del componente
                    this.pagos = res.pagos
                    this.empresa = res.empresa
                    this.usuario_reserva = res.usuario_reserva
                    this.id = res.id
                })
                .catch(err => {
                    console.log(err)
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