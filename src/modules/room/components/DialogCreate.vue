<template>
    <v-dialog :value="show" width="90%" max-width="500px" persistent>
        <v-card class="pa-5">
            <v-form ref="form" v-model="valid" @submit.prevent="newRoom">
                <v-row>

                    <v-col cols="12" md="6">
                        <v-text-field v-model="nombre" :rules="[rules.required]" outlined required>
                            <template v-slot:label>
                                Nombre<span class="red--text">*</span>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-text-field v-model="capacidad" :rules="[rules.required]" outlined required>
                            <template v-slot:label>
                                Capacidad<span class="red--text">*</span>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-select v-model="tipo" :items="tipos" no-data-text="Espere un momento..."
                            :rules="[rules.required]" item-text="tipo" item-value="id" outlined>
                            <template v-slot:label>
                                Tipo<span class="red--text">*</span>
                            </template>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-select v-model="estado" :items="estados" no-data-text="Espere un momento..."
                            :rules="[rules.required]" item-text="estado" item-value="id" outlined>
                            <template v-slot:label>
                                Estado<span class="red--text">*</span>
                            </template>
                        </v-select>
                    </v-col>

                    <v-col cols="12">
                        <v-textarea :rules="[rules.required]" v-model="descripcion" auto-grow rows="5" dense outlined>
                            <template v-slot:label>
                                Descripción<span class="red--text">*</span>
                            </template>
                        </v-textarea>
                    </v-col>

                </v-row>

                <div class="buttons">
                    <v-btn @click="close" color="red">cancelar</v-btn>
                    <v-btn :disabled="!valid" type="submit" :loading="loading" color="light-green">crear</v-btn>
                </div>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>

import Swal from 'sweetalert2'
import roomService from '../service/roomService'

export default {
    name: 'DialogCreate',
    props: {
        show: Boolean,
    },
    data() {
        return {
            nombre: '',
            descripcion: '',
            tipo: '',
            capacidad: '',
            estado: '',
            valid: false,
            loading: false,
            tipos: [],
            estados: [],
            rules: {
                required: value => !!value || 'Campo requerido.',
            },
        }
    },
    methods: {
        newRoom() {
            this.loading = true

            let data = {
                nombre: this.nombre,
                descripcion: this.descripcion,
                roomTipo: this.tipo,
                capacidad: this.capacidad,
                estado: this.estado,
            }

            roomService.crearRoom(data)
                .then(res => {
                    this.loading = false
                    this.$emit('create')
                    Swal.fire({
                        icon: 'success',
                        text: res,
                    })
                })
                .catch(err => {
                    this.loading = false
                    console.log(err);
                })
        },
        getTypes() {
            roomService.obtenerRoomTipos()
                .then(res => {
                    this.tipos = res
                })
                .catch(err => {
                    console.log(err);
                })
        },
        getEstados() {
            roomService.obtenerRoomEstados()
                .then(res => {
                    this.estados = res
                })
                .catch(err => {
                    console.log(err);
                })
        },
        close() {
            this.$refs.form.reset()
            this.$emit('close')
        },
    },
    mounted() {
        this.getTypes()
        this.getEstados()
    },
}
</script>

<style scoped>
.buttons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 15px;
}
</style>