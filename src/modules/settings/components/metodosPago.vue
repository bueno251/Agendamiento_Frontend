<template>
    <v-card width="90%" elevation="5" min-height="100px">
        <v-card-title class="blue lighten-2 white--text">
            <div class="flex">
                <p>
                    Metodos De Pagos Que Recibe La Empresa
                </p>

                <v-btn @click="dialogCreate = true">
                    agregar
                </v-btn>
            </div>
        </v-card-title>
        <template v-if="loadingcard">
            <div class="text-center my-5 w-100">
                <v-progress-circular class="text-center" color="primary" indeterminate></v-progress-circular>
            </div>
        </template>
        <v-container fluid v-else>
            <v-row>
                <v-col cols="auto" v-for="metodo in metodosPago" :key="metodo.id">
                    <v-checkbox v-model="metodosPagoActive" :label="metodo.nombre" :value="metodo"></v-checkbox>
                </v-col>
            </v-row>
            <div class="buttons">
                <v-btn @click="save" color="primary" :loading="loading">
                    guardar
                </v-btn>
            </div>
        </v-container>

        <v-dialog :value="dialogCreate" width="90%" max-width="600px" persistent>
            <v-card class="pa-5">
                <v-toolbar elevation="0">
                    <v-spacer />
                    <v-btn icon class="ml-3" @click="dialogCreate = false">
                        <v-icon>mdi-close-box</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-form ref="form" v-model="valid" @submit.prevent="crear()">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="nombre" :rules="[rules.required]" outlined required>
                                <template v-slot:label>
                                    Nombre <span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>
                    </v-row>

                    <div class="buttons">
                        <v-btn @click="dialogCreate = false" color="blue">cancelar</v-btn>
                        <v-btn :disabled="!valid" type="submit" :loading="loadingbtn" class="light-green black--text">crear</v-btn>
                    </div>
                </v-form>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>

import Swal from 'sweetalert2'
import service from '@/services/service'

export default {
    name: 'metodosPago',
    props: {
        metodosPago: Array,
        id: Number,
    },
    watch: {
        metodosPago: {
            handler(newItem) {
                if (newItem) {
                    this.metodosPagoActive = []
                    newItem.forEach(metodo => {
                        if (metodo.estado === 1) {
                            this.metodosPagoActive.push(metodo)
                        }
                    })
                    if (newItem.length) {
                        this.loadingcard = false
                    }
                }
            },
            immediate: true,
        }
    },
    data() {
        return {
            nombre: '',
            valid: false,
            loading: false,
            loadingbtn: false,
            dialogCreate: false,
            loadingcard: true,
            metodosPagoActive: [],
            rules: {
                required: value => !!value || 'Campo requerido.',
            },
        }
    },
    methods: {
        /**
         * Guarda la configuración de los pagos.
         */
        save() {
            this.loading = true

            // Objeto de datos que se enviará al servicio para guardar la configuración de pagos
            let data = {
                configuracionId: this.id,
                metodosPago: this.pagos(),
            }

            // Llama al servicio para guardar la configuración de pagos
            service.guardarMetodosPago(data)
                .then(res => {
                    this.loading = false
                    this.$emit('close')
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
                    console.error(err)
                })
        },
        /**
         * Obtiene la configuración de pagos del componente y la devuelve como un array.
         * @returns {Array} - Array con la configuración de pagos.
         */
        pagos() {
            let pagos = []

            // Itera sobre los metodos de pagos y crea un objeto con el id, tipo y estado para cada uno
            this.metodosPago.forEach(metodo => {
                let newMetodo = {
                    id: metodo.id,
                    nombre: metodo.nombre,
                    estado: 0,
                }

                // Si el tipo de pago está incluido en el array metodosPagoActive, establece el estado como 1
                if (this.metodosPagoActive.includes(metodo)) {
                    newMetodo.estado = 1
                }

                pagos.push(newMetodo)
            });

            return pagos
        },
        /**
         * Crear Método de Pago
         *
         * Este método se encarga de crear un nuevo método de pago en el sistema. La información del método de pago se envía al servidor a través de una solicitud HTTP, y se realiza la inserción en la base de datos correspondiente.
         * Se manejan los casos de éxito y error, mostrando mensajes al usuario y actualizando la interfaz en consecuencia.
         */
        crear() {
            // Habilitar indicador de carga
            this.loadingbtn = true

            // Datos del nuevo método de pago
            let data = {
                nombre: this.nombre
            }

            // Llamar al servicio para crear el método de pago
            service.crearMetodoPago(data)
                .then(res => {
                    // Deshabilitar indicador de carga
                    this.loadingbtn = false

                    // Emitir evento de actualización
                    this.$emit('update')

                    // Mostrar mensaje de éxito al usuario
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })
                })
                .catch(err => {
                    // Deshabilitar indicador de carga en caso de error
                    this.loadingbtn = false

                    // Mostrar mensaje de error al usuario
                    Swal.fire({
                        icon: 'error',
                        text: err.response.data.message,
                    })

                    // Registrar el error en la consola
                    console.error(err)
                })
        },
    },
}
</script>

<style scoped>
.flex {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
</style>