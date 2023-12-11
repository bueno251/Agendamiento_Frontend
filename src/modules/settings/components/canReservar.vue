<template>
    <v-card width="90%">
        <v-card-title class="blue lighten-2">
            Reservas
        </v-card-title>
        <v-container fluid>
            <v-row>
                <v-col cols="auto">
                    <div class="flex">
                        Usuario puede reservar?
                        <v-switch v-model="canReservar" :label="canReservar ? 'Si' : 'No'" inset></v-switch>
                    </div>
                </v-col>
            </v-row>
            <div class="buttons">
                <v-btn @click="save" :loading="loading" color="primary">
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
        bolean: Boolean,
        id: Number,
    },
    data() {
        return {
            canReservar: true,
            loading: false,
        }
    },
    methods: {
        save() {
            this.loading = true

            let data = {
                configuracionId: this.id,
                reservar: this.canReservar
            }

            configService.reservar(data)
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
        }
    },
    watch: {
        bolean: {
            handler(newbolean) {
                this.canReservar = newbolean
            },
            immediate: true,
        }
    },
}
</script>

<style scoped>
.flex {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    gap: 10px;
}
</style>