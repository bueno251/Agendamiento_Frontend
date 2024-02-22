<template>
    <div class="content">
        <ReservasAprovadas :canUpdate="updateAprovadas" />
        <ReservasPendientes @update="updateAprovadas = true" />
    </div>
</template>

<script>

import ReservasAprovadas from './components/ReservasAprovadas'
import ReservasPendientes from './components/ReservasPendientes'

export default {
    name: 'roomApp',
    components: {
        ReservasAprovadas,
        ReservasPendientes,
    },
    // Observa cambios en 'updateAprovadas' y lo devuelve a false.
    watch: {
        updateAprovadas(val) {
            val && setTimeout(() => (this.updateAprovadas = false))
        },
    },
    data() {
        return {
            updateAprovadas: false,
        }
    },
}
</script>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-bottom: 20px;
}
</style>