<template>
    <div class="content">
        <tipoPagos :tipos="pagos" :id="id" @update="getSettings"></tipoPagos>

        <canReservar :bolean="usuario_reserva" :id="id" @update="getSettings"></canReservar>

        <EmpresaComponent :empresa="empresa" :id="id" @update="getSettings"></EmpresaComponent>

        <defaultConfig :id="id"/>
    </div>
</template>

<script>

import tipoPagos from './components/tipoPagos'
import canReservar from './components/canReservar'
import EmpresaComponent from './components/empresaComponent'
import defaultConfig from './components/defaultConfig'
import configService from './services/configService'

export default {
    name: 'settingsApp',
    components: {
        tipoPagos,
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
        getSettings() {
            configService.obtener()
                .then(res => {
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