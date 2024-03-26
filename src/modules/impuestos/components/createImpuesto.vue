<template>
    <v-dialog :value="show" width="90%" max-width="500px" persistent>
        <v-card class="pa-5">
            <v-form ref="formCreate" v-model="validCreate" @submit.prevent="create">
                <v-row>

                    <v-col cols="12" md="6" sm="6">
                        <v-text-field v-model="nombre" :rules="[rules.required]" dense outlined>

                            <template v-slot:label>
                                Nombre <span class="red--text">*</span>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="6">
                        <v-text-field v-model="codigo" :rules="[rules.required]" dense outlined>

                            <template v-slot:label>
                                Código <span class="red--text">*</span>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="6">
                        <v-text-field v-model="tasa" type="number" min="0" :rules="[rules.required]" hide-spin-buttons
                            dense outlined>

                            <template v-slot:label>
                                Tasa <span class="red--text">*</span>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="6">
                        <v-select v-model="tipo" :items="tiposImpuesto" :rules="[rules.required]"
                            no-data-text="Espere un momento..." item-text="tipo" item-value="id" dense outlined
                            required>

                            <template v-slot:label>
                                Tipo De Impuesto <span class="red--text">*</span>
                            </template>
                        </v-select>
                    </v-col>

                </v-row>

                <div class="buttons">
                    <v-btn @click="$emit('close'), $refs.formCreate.reset()" color="blue">cancelar</v-btn>
                    <v-btn :disabled="!validCreate" type="submit" :loading="loading" color="light-green">crear</v-btn>
                </div>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>

import Swal from 'sweetalert2'
import service from '@/services/service'

export default {
    name: 'createImpuesto',
    props: {
        show: Boolean,
    },
    data() {
        return {
            nombre: '',
            codigo: '',
            tipo: '',
            tasa: 0,
            loading: false,
            validCreate: false,
            tiposImpuesto: [],
            rules: {
                required: value => !!value || 'Campo requerido.',
            },
        }
    },
    methods: {
        create() {
            this.loading = true

            let data = {
                nombre: this.nombre,
                codigo: this.codigo.toUpperCase(),
                tasa: this.tasa,
                tipo: this.tipo,
            }

            service.crearImpuesto(data)
                .then(res => {
                    this.dialogCreate = false
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
        getDatos() {
            service.obtenerTiposImpuesto()
                .then(res => {
                    this.tiposImpuesto = res
                })
                .catch(err => {
                    console.error(err)
                })
        },
    },
    mounted() {
        this.getDatos()
    },
}
</script>

<style scoped></style>