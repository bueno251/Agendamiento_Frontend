<template>
    <v-dialog :value="show" width="90%" max-width="800px" persistent>
        <v-card class="pa-5">
            <v-form ref="form" v-model="valid" @submit.prevent="update">
                <v-row>
                    <template v-for="room in rooms">
                        <v-col cols="12" md="5" sm="4" :key="`name-${room.id}`">
                            <v-text-field v-model="room.nombre" :rules="[rules.required]" dense outlined required>
                                <template v-slot:label>
                                    Nombre<span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12" md="5" sm="4" :key="room.id">
                            <v-select v-model="room.estado_id" :items="estados" no-data-text="Espere un momento..."
                                :rules="[rules.required]" label="Estado" item-text="estado" item-value="id" dense outlined>

                                <template v-slot:label>
                                    Estado <span class="red--text">*</span>
                                </template>
                            </v-select>
                        </v-col>

                        <v-col cols="12" md="2" sm="4" :key="`btn-${room.id}`">
                            <div class="d-flex c-100 align-center">
                                <v-btn color="error" @click="habitacion = room, dialogDelete = true">
                                    Eliminar
                                </v-btn>
                            </div>
                        </v-col>
                    </template>
                </v-row>
                <div class="buttons pt-5">
                    <v-btn @click="$emit('close')" color="blue">cancelar</v-btn>
                    <v-btn :disabled="!valid" type="submit" :loading="loading" color="light-green">guardar</v-btn>
                </div>
            </v-form>
        </v-card>

        <v-dialog :value="dialogDelete" width="90%" max-width="600px" persistent>
            <v-card>
                <v-sheet class="d-flex justify-center align-center flex-column pa-5">
                    <h3>Eliminar la habitación {{ habitacion.nombre }}?</h3>
                    <div class="buttons">
                        <v-btn @click="dialogDelete = false" color="error"
                            class="white--text text--accent-4">cancelar</v-btn>
                        <v-btn @click="eliminar" :loading="loadingbtn" color="primary">eliminar</v-btn>
                    </div>
                </v-sheet>
            </v-card>
        </v-dialog>
    </v-dialog>
</template>

<script>

import Swal from 'sweetalert2'
import service from '@/services/service'

export default {
    name: 'SimilarRooms',
    props: {
        show: Boolean,
        room: Object,
    },
    watch: {
        // Observa cambios en la propiedad 'room'
        room: {
            // Función que se ejecuta cuando hay cambios en 'room'
            handler(newRoom) {
                // Verifica si 'id' está presente en 'newRoom'
                if ("id" in newRoom) {
                    // Actualiza la propiedad 'rooms' con el valor de 'newRoom.rooms'
                    this.rooms = newRoom.rooms
                }
            },
            // Indica que el 'handler' debe ejecutarse inmediatamente después de la vinculación del watch
            immediate: true
        }
    },
    data() {
        return {
            valid: false,
            loading: false,
            loadingbtn: false,
            dialogDelete: false,
            habitacion: {
                nombre: ''
            },
            estados: [],
            rooms: [],
            rules: {
                required: value => !!value || 'Campo requerido.',
            },
        }
    },
    methods: {
        /**
         * Actualiza la información de las habitaciones en el servidor.
         * Emite un evento 'update' después de la actualización y muestra un mensaje de éxito o error.
         */
        update() {
            // Indica que la operación está en curso
            this.loading = true

            // Prepara los datos a enviar al servicio
            let data = {
                rooms: this.rooms
            }

            // Llama al servicio para actualizar la información de las habitaciones
            service.actualizarRooms(data)
                .then(res => {
                    // La operación fue exitosa, indica que ya no está en curso
                    this.loading = false

                    // Emite el evento 'update' para notificar a otros componentes sobre la actualización
                    this.$emit('update')

                    // Muestra un mensaje de éxito
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })
                })
                .catch(err => {
                    // La operación falló, indica que ya no está en curso
                    this.loading = false

                    // Muestra un mensaje de error con detalles del error proporcionados por el servidor
                    Swal.fire({
                        icon: 'error',
                        text: err.response.data.message,
                    })

                    // Registra el error en la consola para análisis adicional
                    console.error(err)
                })
        },
        /**
         * Obtiene los datos necesarios, como los estados de las habitaciones, desde el servidor.
         * Almacena los estados obtenidos en la propiedad 'estados' del componente.
         */
        getDatos() {
            // Llama al servicio para obtener los estados de las habitaciones
            service.obtenerEstadosRoom()
                .then(res => {
                    // Almacena los estados obtenidos en la propiedad 'estados' del componente
                    this.estados = res
                })
                .catch(err => {
                    // Maneja cualquier error que pueda ocurrir al obtener los datos
                    console.error(err)
                })
        },
        eliminar() {
            this.loadingbtn = true

            service.eliminarRoomHija(this.habitacion.id)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogDelete = false

                    // Emite el evento 'update' para notificar a otros componentes sobre la actualización
                    this.$emit('update')

                    // Muestra un mensaje de éxito
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })
                })
                .catch(err => {
                    // Maneja cualquier error que pueda ocurrir al obtener los datos
                    this.loadingbtn = false

                    Swal.fire({
                        icon: 'error',
                        text: err.response.data.message,
                    })

                    console.error(err)
                })
        },
        /**
         * Cierra el componente emitiento un evento 'close'.
         */
        close() {
            // Emitir evento 'close'
            this.$emit('close')
        },
    },
    mounted() {
        this.getDatos()
    },
}
</script>

<style scoped>
.c-100 {
    width: 100%;
    height: 60%;
}
</style>