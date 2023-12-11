<template>
    <v-card width="90%" min-height="100px">
        <v-card-title class="blue lighten-2">
            Tipo De Pagos Que Recibe La Empresa
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
    data() {
        return {
            loading: false,
            loadingcard: true,
            tipoPago: [],
        }
    },
    methods: {
        save() {
            this.loading = true

            let data = {
                configuracionId: this.id,
                pagos: this.pagos(),
            }

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
        pagos() {
            let pagos = []

            this.tipos.forEach(t => {
                let newT = {
                    id: t.id,
                    tipo: t.tipo,
                    estado: 0,
                }

                if (this.tipoPago.includes(t)) {
                    newT.estado = 1
                }

                pagos.push(newT)
            });

            return pagos
        },
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
}
</script>

<style scoped></style>