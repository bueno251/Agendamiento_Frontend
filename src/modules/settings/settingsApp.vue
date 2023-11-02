<template>
    <div class="content">
        <tipoPagos :tipos="pagos" :id="settings.id" @update="getSettings"></tipoPagos>

        <canReservar></canReservar>
    </div>
</template>

<script>

import tipoPagos from './components/tipoPagos'
import canReservar from './components/canReservar'

export default {
    name: 'settingsApp',
    components: {
        tipoPagos,
        canReservar,
    },
    data() {
        return {
            pagos: [],
            settings: {}
        }
    },
    methods: {
        getSettings() {
            let url = 'settings/read'

            this.$axios.get(url)
                .then(res => {
                    this.pagos = res.data.pagos
                    this.settings = res.data.settings
                })
                .catch(err => {
                    console.log(err);
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
}
</style>