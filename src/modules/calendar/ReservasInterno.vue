<template>
    <div class="content">
        <v-sheet tile height="54" class="d-flex">
            <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
                <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon class="ma-2" @click="$refs.calendar.next()">
                <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
                {{ $refs.calendar.title }} Interno
            </v-toolbar-title>
        </v-sheet>
        <v-sheet height="600" width="90%">
            <v-calendar ref="calendar" v-model="value" color="primary" :locale="'es'"
                @click:date="dialog = true"></v-calendar>
        </v-sheet>
        <v-dialog v-model="dialog" width="90%">
            <v-card class="pa-5"  elevation="10">
                <v-row>
                    <v-col cols="12" md="6" v-for="room in rooms" :key="room.id">
                        <v-card height="100%" outlined>
                            <v-card-title>{{ room.nombre }}</v-card-title>
                            <v-card-text>
                                <div>
                                    {{ room.descripcion }}
                                </div>
                                <div class="my-5">
                                    Capacidad: {{ room.capacidad }}
                                </div>
                                <div>
                                    Tipo: {{ room.tipo }}{{ room.estado !== 'Activo' ? ` - ${room.estado}` : '' }}
                                </div>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn outlined>
                                    reservar
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

// import Swal from 'sweetalert2'

export default {
    name: 'ReservasInterno',

    data: () => ({
        mode: 'stack',
        value: '',
        rooms: [],
        dialog: false,
    }),
    methods: {
        getRooms() {
            let url = 'room/read'

            this.events = []
            this.$axios.get(url)
                .then(res => {
                    this.rooms = res.data
                })
                .catch(err => {
                    console.log(err)
                })
        },
    },
    mounted() {
        this.getRooms()
    },
};
</script>

<style scoped></style>