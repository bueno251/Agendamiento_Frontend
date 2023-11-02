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
                {{ $refs.calendar.title }}
            </v-toolbar-title>
        </v-sheet>
        <v-sheet height="600" width="90%">
            <v-calendar ref="calendar" v-model="value" color="primary" :events="events" :locale="'es'"
                @click:date="openDialog"></v-calendar>
        </v-sheet>
        <v-dialog v-model="dialogOcupar" width="40%">
            <v-card>
                <v-sheet class="d-flex justify-center align-center flex-column pa-5">
                    <h2>Ocupar dia {{ value }}?</h2>
                    <v-btn color="primary" @click="ocupar">
                        Ocupar
                    </v-btn>
                </v-sheet>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDesocupar" width="40%">
            <v-card>
                <v-sheet class="d-flex justify-center align-center flex-column pa-5">
                    <h2>Desocupar dia {{ value }}?</h2>
                    <v-btn color="primary" @click="desocupar">
                        Desocupar
                    </v-btn>
                </v-sheet>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import Swal from 'sweetalert2'

export default {
    name: 'calendarApp',

    data: () => ({
        mode: 'stack',
        value: '',
        events: [],
        dates: [],
        dialogOcupar: false,
        dialogDesocupar: false,
    }),
    methods: {
        openDialog({ date }) {
            let open = true

            this.dates.forEach(obj => {
                if (obj.dia === date) {
                    open = false
                }
            });

            this.dialogOcupar = open
            this.dialogDesocupar = !open
        },
        ocupar() {
            let url = 'days/create'

            let data = {
                dia: this.value
            }

            this.$axios.post(url, data)
                .then(res => {
                    this.dialogOcupar = false
                    this.getOcupados()
                    Swal.fire({
                        icon: 'success',
                        text: res.data,
                    })
                })
                .catch(err => {
                    console.log(err)
                    Swal.fire({
                        icon: 'error',
                        text: 'A ocurrido un error',
                    })
                })
        },
        desocupar() {
            let url = `days/delete/${this.value}`

            this.$axios.delete(url)
                .then(res => {
                    console.log(res);
                    this.dialogDesocupar = false
                    this.getOcupados()
                    Swal.fire({
                        icon: 'success',
                        text: res.data,
                    })
                })
                .catch(err => {
                    console.log(err)
                    Swal.fire({
                        icon: 'error',
                        text: 'A ocurrido un error',
                    })
                })
        },
        getOcupados() {
            let url = 'days/read'

            this.events = []
            this.$axios.get(url)
                .then(res => {
                    res.data.forEach(obj => {
                        this.events.push({
                            name: 'Ocupado',
                            start: new Date(obj.dia + 'T12:00:00'),
                            color: 'red',
                        })
                        this.dates = res.data
                    });
                })
                .catch(err => {
                    console.log(err)
                })
        }
    },
    mounted() {
        this.getOcupados()
    },
};
</script>

<style scoped>
</style>