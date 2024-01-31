<template>
    <v-dialog :value="show" width="90%" max-width="500px" persistent>
        <v-card class="pa-5">
            <v-form ref="formCreate" v-model="validCreate" @submit.prevent="crear">
                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="nombre" :rules="[rules.required]" outlined required>
                            <template v-slot:label>
                                Nombre <span class="red--text">*</span>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12">
                        <v-text-field v-model="icon" :rules="[rules.required]" :append-icon="`mdi-${icon}`"
                            append-outer-icon="mdi-help-circle-outline" @click:append-outer="toIcons" outlined required>
                            <template v-slot:label>
                                Icono <span class="red--text">*</span>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12">
                        <v-select v-model="estado" :items="estados" no-data-text="Espere un momento..."
                            :rules="[rules.required]" item-text="estado" item-value="id" outlined>
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
                    <v-btn @click="close(), $refs.formCreate.reset()" color="blue">cancelar</v-btn>
                    <v-btn :disabled="!validCreate" :loading="loadingbtn" type="submit" color="light-green">crear</v-btn>
                </div>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>

import Swal from 'sweetalert2'
import roomService from '../service/roomService'

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
        crear() {
            this.loadingbtn = true

            let data = {
                nombre: this.nombre,
                descripcion: this.descripcion,
                icon: this.icon,
                estado: this.estado,
            }

            roomService.crearCaracteristica(data)
                .then(res => {
                    this.loadingbtn = false
                    this.$refs.formCreate.reset()
                    this.$emit('create')
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
                    console.log(err)
                })
        },
        toIcons() {
            window.open('https://pictogrammers.com/library/mdi/', '_blank');
        },
        close() {
            this.$refs.formCreate.reset()
            this.$emit('close')
        },
    },
    mounted() {
    },
}
</script>

<style scoped></style>