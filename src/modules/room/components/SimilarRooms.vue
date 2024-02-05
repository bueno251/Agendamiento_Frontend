<template>
    <v-dialog :value="show" width="90%" max-width="600px" persistent>
        <v-card class="pa-5">
            <v-form ref="form" v-model="valid" @submit.prevent="update">
                <v-row>
                    <template v-for="room in rooms">
                        <v-col cols="12" md="6" :key="`name-${room.id}`">
                            <v-text-field v-model="room.nombre" :rules="[rules.required]" outlined required>
                                <template v-slot:label>
                                    Nombre<span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12" md="6" :key="room.id">
                            <v-select v-model="room.estado_id" :items="estados" no-data-text="Espere un momento..."
                                :rules="[rules.required]" label="Estado" item-text="estado" item-value="id" outlined>
                                <template v-slot:label>
                                    Estado <span class="red--text">*</span>
                                </template>
                            </v-select>
                        </v-col>
                    </template>
                </v-row>
                <div class="buttons pt-5">
                    <v-btn @click="close" color="blue">cancelar</v-btn>
                    <v-btn :disabled="!valid" type="submit" :loading="loading" color="light-green">guardar</v-btn>
                </div>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>

import Swal from 'sweetalert2'
import roomService from '../service/roomService'

export default {
    name: 'SimilarRooms',
    props: {
        show: Boolean,
        room: Object,
    },
    watch: {
        room: {
            handler(newRoom) {
                if ("id" in newRoom) {
                    this.rooms = newRoom.rooms;
                }
            },
            immediate: true,
        }
    },
    data() {
        return {
            valid: false,
            loading: false,
            estados: [],
            rooms: [],
            rules: {
                required: value => !!value || 'Campo requerido.',
            },
        }
    },
    methods: {
        update() {
            this.loading = true

            let data = {
                rooms: this.rooms
            }

            roomService.actualizarRooms(data)
                .then(res => {
                    this.loading = false
                    this.$emit('update')
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })
                })
                .catch(err => {
                    this.loading = false
                    Swal.fire({
                        icon: 'error',
                        text: err.response.data.message,
                    })
                    console.log(err)
                })
        },
        getDatos() {
            roomService.obtenerRoomEstados()
                .then(res => {
                    this.estados = res
                })
                .catch(err => {
                    console.log(err)
                })
        },
        close() {
            this.$emit('close')
        },
    },
    mounted() {
        this.getDatos()
    },
}
</script>

<style scoped></style>