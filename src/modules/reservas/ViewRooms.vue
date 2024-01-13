<template>
    <v-row class="pt-5 ma-0 w-100">
        <v-col cols="12" lg="4" md="6" v-for="room in rooms" :key="room.id">
            <v-card height="100%" max-height="300px" elevation="5" outlined>
                <v-card-title>{{ room.nombre }}</v-card-title>
                <v-card-text>
                    <p class="text-truncate">
                        {{ room.descripcion }}
                    </p>
                    <p class="my-5">
                        {{ room.capacidad }} {{ room.capacidad > 1 ? 'Personas' : 'Persona' }}
                    </p>
                    <p>
                        {{ room.tipo }} {{ room.estado !== 'Activo' ? room.estado : '' }}
                    </p>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="goToRoom(room.id)" outlined>
                        reservar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>

// import Swal from 'sweetalert2'
import reservaService from './service/reservaService'

export default {
    name: 'ReservasInterno',
    components: {
    },
    data: () => ({
        value: '',
        rooms: [],
        dialog: false,
        dialogAgendar: false,
    }),
    methods: {
        getRooms() {
            reservaService.obtenerRooms()
                .then(res => {
                    this.rooms = res
                })
                .catch(err => {
                    console.log(err)
                })
        },
        goToRoom(id) {
            this.$router.push({ name: 'room', params: { id: id } })
        },
    },
    mounted() {
        this.getRooms()
    },
};
</script>

<style scoped>
.w-100 {
    width: 100%;
}
</style>