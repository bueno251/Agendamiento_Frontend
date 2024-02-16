<template>
    <v-card width="90%" min-height="100px">
        <v-card-title class="blue lighten-2">
            <div class="flex">
                <p>
                    Tipo De Pagos Que Recibe La Empresa
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
                <v-col cols="auto" v-for="tipo in tipos" :key="tipo.id">
                    <v-checkbox v-model="tipoPago" :label="tipo.tipo" :value="tipo"></v-checkbox>
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
                <v-form ref="form" v-model="valid" @submit.prevent="newRoom">
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
                        <v-btn :disabled="!valid" type="submit" :loading="loadingbtn" color="light-green">crear</v-btn>
                    </div>
                </v-form>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>

import Swal from 'sweetalert2'
import configService from '../services/configService'

export default {
    props: {
        tipos: Array,
        id: Number,
    },
    watch: {
        tipos: {
            handler(newtipos) {
                this.tipoPago = []
                newtipos.forEach(t => {
                    if (t.estado === 1) {
                        this.tipoPago.push(t)
                    }
                });
                if (newtipos.length) {
                    this.loadingcard = false
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
            tipoPago: [],
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
                pagos: this.pagos(),
            }

            // Llama al servicio para guardar la configuración de pagos
            configService.pagos(data)
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
        /**
         * Obtiene la configuración de pagos del componente y la devuelve como un array.
         * @returns {Array} - Array con la configuración de pagos.
         */
        pagos() {
            let pagos = []

            // Itera sobre los tipos de pagos y crea un objeto con el id, tipo y estado para cada uno
            this.tipos.forEach(t => {
                let newT = {
                    id: t.id,
                    tipo: t.tipo,
                    estado: 0,
                }

                // Si el tipo de pago está incluido en el array tipoPago, establece el estado como 1
                if (this.tipoPago.includes(t)) {
                    newT.estado = 1
                }

                pagos.push(newT)
            });

            return pagos
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