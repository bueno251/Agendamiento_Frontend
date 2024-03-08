<template>
    <v-dialog :value="show" width="90%" max-width="600px" persistent>
        <v-card class="pa-5">
            <v-form ref="form" v-model="valid" @submit.prevent="cancelar">

                <h3>
                    Desea cancelar la reserva?
                </h3>

                <v-row>

                    <v-col cols="12">
                        <v-select v-model="tipo" :items="tipos" no-data-text="No hay tipos" :rules="[rules.required]"
                            item-text="tipo" item-value="id" dense outlined>
                            <template v-slot:label>
                                Tipo <span class="red--text">*</span>
                            </template>

                            <template v-slot:prepend-item>
                                <v-list-item ripple @mousedown.prevent @click="dialogCreate = true">
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            Crear Tipo
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-divider class="mt-2"></v-divider>
                            </template>

                            <template v-slot:item="{ item, on, attrs }">
                                <v-list-item v-bind="attrs" v-on="on">

                                    <v-list-item-content>
                                        <v-list-item-title>{{ item.tipo }}</v-list-item-title>
                                    </v-list-item-content>

                                    <v-list-item-action>
                                        <v-btn @click="dialogUpdate = true, nombre = item.tipo, opcion = item"
                                            icon><v-icon>mdi-pencil-circle</v-icon></v-btn>
                                    </v-list-item-action>

                                    <v-list-item-action>
                                        <v-btn @click="dialogDelete = true, opcion = item"
                                            icon><v-icon>mdi-delete</v-icon></v-btn>
                                    </v-list-item-action>

                                </v-list-item>
                            </template>

                        </v-select>
                    </v-col>

                    <v-col cols="12">
                        <v-textarea :rules="[rules.required]" v-model="motivo" auto-grow rows="5" dense outlined>
                            <template v-slot:label>
                                Motivo <span class="red--text">*</span>
                            </template>
                        </v-textarea>
                    </v-col>

                </v-row>

                <div class="buttons">
                    <v-btn @click="$emit('close')" color="blue">cancelar</v-btn>
                    <v-btn :disabled="!valid" type="submit" :loading="loading" color="light-green">confirmar</v-btn>
                </div>
            </v-form>
        </v-card>

        <v-dialog :value="dialogCreate" width="90%" max-width="500px" persistent>
            <v-card class="pa-5">
                <v-form ref="formCreate" v-model="validCreate" @submit.prevent="crear">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="nombre" :rules="[rules.required]" dense outlined required>
                                <template v-slot:label>
                                    Nombre <span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <div class="buttons">
                        <v-btn @click="dialogCreate = false, $refs.formCreate.reset()" color="blue">cancelar</v-btn>
                        <v-btn :disabled="!validCreate" :loading="loadingbtn" type="submit"
                            color="light-green">crear</v-btn>
                    </div>
                </v-form>
            </v-card>
        </v-dialog>

        <v-dialog :value="dialogUpdate" width="90%" max-width="500px" persistent>
            <v-card class="pa-5">
                <v-form ref="formUpdate" v-model="validCreate" @submit.prevent="actualizar">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="nombre" :rules="[rules.required]" dense outlined required>
                                <template v-slot:label>
                                    Nombre <span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <div class="buttons">
                        <v-btn @click="dialogUpdate = false, $refs.formUpdate.reset()" color="blue">cancelar</v-btn>
                        <v-btn :disabled="!validCreate" :loading="loadingbtn" type="submit"
                            color="light-green">actualizar</v-btn>
                    </div>
                </v-form>
            </v-card>
        </v-dialog>

        <v-dialog :value="dialogDelete" width="90%" max-width="500px" persistent>
            <v-card>
                <v-sheet class="d-flex justify-center align-center flex-column pa-5">
                    <h3>Eliminar el tipo {{ opcion.tipo }}?</h3>
                    <div class="buttons">
                        <v-btn @click="dialogDelete = false" color="error" class="white--text text--accent-4">
                            cancelar
                        </v-btn>

                        <v-btn @click="eliminar" :loading="loadingbtn" color="primary">
                            eliminar
                        </v-btn>
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
    name: 'CancelacionReserva',
    props: {
        show: Boolean,
        reserva: Object,
    },
    data() {
        return {
            nombre: '',
            tipo: '',
            motivo: '',
            valid: false,
            validCreate: false,
            loading: false,
            loadingbtn: false,
            dialogCreate: false,
            dialogUpdate: false,
            dialogDelete: false,
            tipos: [],
            opcion: {},
            rules: {
                required: value => !!value || 'Campo requerido.',
            },
        }
    },
    methods: {
        cancelar() {
            this.loading = true

            let data = {
                tipo: this.tipo,
                user: this.$store.state.user.id,
                motivo: this.motivo,
            }

            service.cancelarReserva(data, this.reserva.id)
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
        crear() {
            this.loadingbtn = true

            let data = {
                tipo: this.nombre
            }

            service.crearTipoCancelacion(data)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogCreate = false
                    this.getTipos()
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })
                })
                .catch(err => {
                    this.loadingbtn = false
                    this.dialogCreate = false
                    Swal.fire({
                        icon: 'error',
                        text: err.response.data.message,
                    })
                    console.error(err)
                })
        },
        getTipos() {
            service.obtenerTiposCancelacion()
                .then(res => {
                    this.tipos = res
                })
                .catch(err => {
                    console.error(err)
                })
        },
        actualizar() {
            this.loadingbtn = true

            let data = {
                tipo: this.nombre
            }

            service.actualizarTipoCancelacion(data, this.opcion.id)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogUpdate = false
                    this.getTipos()
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })
                })
                .catch(err => {
                    this.loadingbtn = false
                    this.dialogUpdate = false
                    Swal.fire({
                        icon: 'error',
                        text: err.response.data.message,
                    })
                    console.error(err)
                })
        },
        eliminar() {
            this.loadingbtn = true

            service.eliminarTipoCancelacion(this.opcion.id)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogDelete = false
                    this.getTipos()
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
    },
    mounted() {
        this.getTipos()
    },
}
</script>

<style scoped></style>