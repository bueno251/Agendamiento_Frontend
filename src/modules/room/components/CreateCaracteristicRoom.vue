<template>
    <v-dialog :value="show" width="90%" max-width="500px" persistent>
        <v-card class="pa-5">
            <v-toolbar elevation="0">
                <v-spacer />
                <v-btn icon class="ml-3" @click="$emit('close')">
                    <v-icon>mdi-close-box</v-icon>
                </v-btn>
            </v-toolbar>
            <v-form ref="formCreate" v-model="validCreate" @submit.prevent="crear">
                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="nombre" :rules="[rules.required]" dense outlined required>
                            <template v-slot:label>
                                Nombre <span class="red--text">*</span>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12">
                        <v-text-field v-model="icon" :rules="[rules.required]" :append-icon="`mdi-${icon}`" dense
                            outlined required>
                            <template v-slot:label>
                                Icono <span class="red--text">*</span>
                            </template>

                            <template v-slot:append-outer>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon color="primary" dark v-bind="attrs" v-on="on" @click="toIcons">
                                            mdi-help-circle-outline
                                        </v-icon>
                                    </template>
                                    <span>Buscar icono y copiar nombre en el input</span>
                                </v-tooltip>
                            </template>
                        </v-text-field>

                    </v-col>

                    <v-col cols="12">
                        <v-select v-model="estado" :items="estados" no-data-text="Espere un momento..."
                            :rules="[rules.required]" item-text="estado" item-value="id" dense outlined>
                            <template v-slot:label>
                                Estado <span class="red--text">*</span>
                            </template>
                        </v-select>
                    </v-col>

                    <v-col cols="12">
                        <v-textarea v-model="descripcion" :rules="[rules.required]" auto-grow rows="5" dense outlined
                            required>
                            <template v-slot:label>
                                Descripción <span class="red--text">*</span>
                            </template>
                        </v-textarea>
                    </v-col>
                </v-row>

                <div class="buttons">
                    <v-btn @click="$emit('close'), $refs.formCreate.reset()" color="blue">
                        cancelar
                    </v-btn>
                    <v-btn :disabled="!validCreate" :loading="loadingbtn" type="submit" class="light-green black--text">
                        crear
                    </v-btn>
                </div>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>

import Swal from 'sweetalert2'
import service from '@/services/service'

export default {
    name: 'CreateCaracteristicRoom',
    props: {
        show: Boolean,
    },
    data() {
        return {
            search: '',
            nombre: '',
            descripcion: '',
            icon: '',
            estado: '',
            loading: false,
            loadingbtn: false,
            validCreate: false,
            estados: [
                {
                    id: 1,
                    estado: 'Activo',
                },
                {
                    id: 2,
                    estado: 'Inactivo',
                },
            ],
            rules: {
                required: value => !!value || 'Campo requerido.',
            },
        }
    },
    methods: {
        /**
         * Crea una nueva característica de habitación.
         * Utiliza los datos proporcionados en el formulario para enviar la solicitud al servicio correspondiente.
         * Actualiza el estado de 'loadingbtn' durante la operación.
         * 
         */
        crear() {
            this.loadingbtn = true

            let data = {
                nombre: this.nombre,
                descripcion: this.descripcion,
                icon: this.icon,
                estado: this.estado,
            }

            service.crearCaracteristica(data)
                .then(res => {
                    this.loadingbtn = false
                    this.$refs.formCreate.reset()
                    this.$emit('close')
                    this.$emit('update')
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })
                })
                .catch(err => {
                    this.loadingbtn = false
                    Swal.fire({
                        icon: 'error',
                        text: err.response.data.message,
                    })
                    console.error(err)
                })
        },
        /**
         * Abre una nueva pestaña del navegador con la URL que contiene iconos disponibles.
         */
        toIcons() {
            window.open('https://pictogrammers.com/library/mdi/', '_blank')
        },
    },
}
</script>

<style scoped></style>