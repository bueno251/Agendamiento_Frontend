<template>
    <v-dialog :value="show" width="90%" max-width="600px" persistent>
        <v-card class="pa-5">
            <v-form ref="form" v-model="valid" @submit.prevent="updateRoom">
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
                        <v-textarea v-model="descripcion" :rules="[rules.required]" auto-grow rows="5" dense outlined>
                            <template v-slot:label>
                                Descripción<span class="red--text">*</span>
                            </template>
                        </v-textarea>
                    </v-col>

                    <v-col cols="12">
                        <p>Seleccione las características de la habitación</p>
                        <v-item-group v-model="selectedCaracteristicas" multiple>
                            <div class="caracteristics">
                                <div v-for="(item, index) in caracteristicas" :key="`caracteris${index}`">
                                    <v-item v-slot="{ active, toggle }" :value="item.id">
                                        <v-card class="caracteristic" @click="toggle">
                                            <v-avatar :color="active ? 'blue' : 'grey lighten-1'">
                                                <v-icon dark>
                                                    mdi-{{ item.icon }}
                                                </v-icon>
                                            </v-avatar>
                                            <p>
                                                {{ item.nombre }}
                                            </p>
                                        </v-card>
                                    </v-item>
                                </div>
                                <v-card class="caracteristic" @click="dialogCreate = true">
                                    <v-avatar color="blue">
                                        <v-icon dark>
                                            mdi-plus-circle
                                        </v-icon>
                                    </v-avatar>
                                    <p>Añadir</p>
                                </v-card>
                            </div>
                        </v-item-group>
                    </v-col>

                </v-row>

                <div class="buttons pt-5">
                    <v-btn @click="close" color="blue">cancelar</v-btn>
                    <v-btn :disabled="!valid" type="submit" :loading="loading" color="light-green">Actualizar</v-btn>
                </div>
            </v-form>
        </v-card>
        <CreateCaracteristicRoom :show="dialogCreate" @close="dialogCreate = false"
            @create="getCaracteristicas(), dialogCreate = false">
        </CreateCaracteristicRoom>
    </v-dialog>
</template>

<script>

import vuex from "@/store"
import Swal from 'sweetalert2'
import roomService from '../service/roomService'
import CreateCaracteristicRoom from './CreateCaracteristicRoom.vue'

export default {
    name: 'DialogUpdate',
    props: {
        show: Boolean,
        room: Object,
    },
    components: {
        CreateCaracteristicRoom,
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
            dialogCreate: false,
            tipos: [],
            estados: [],
            caracteristicas: [],
            selectedCaracteristicas: [],
            rules: {
                required: value => !!value || 'Campo requerido.',
            },
        }
    },
    computed: {
        noSelectedCaracteristicas() {
            if ("id" in this.room) {
                return this.caracteristicas.filter(caracteristica => !this.selectedCaracteristicas.includes(caracteristica.id))
            } else {
                return false
            }
        }
    },
    watch: {
        room: {
            handler(newRoom) {
                if ("id" in newRoom) {
                    this.nombre = newRoom.nombre;
                    this.descripcion = newRoom.descripcion;
                    this.tipo = newRoom.tipoId;
                    this.capacidad = newRoom.capacidad;
                    this.estado = newRoom.estadoId;
                    this.selectedCaracteristicas = Array.from(newRoom.caracteristics)
                }
                this.getCaracteristicas()
            },
            immediate: true,
        }
    },
    methods: {
        updateRoom() {
            this.loading = true

            let noSelected = []

            if (this.noSelectedCaracteristicas.length) {
                this.noSelectedCaracteristicas.map(caracteristic => {
                    noSelected.push(caracteristic.id)
                })
            }

            let data = {
                user: vuex.state.user.id,
                nombre: this.nombre,
                descripcion: this.descripcion,
                roomTipo: this.tipo,
                capacidad: this.capacidad,
                estado: this.estado,
                estadoAntiguo: this.room.estadoId,
                activar: this.selectedCaracteristicas,
                desactivar: noSelected,
            }

            roomService.actualizarRoom(data, this.room.id)
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
        getDatos() {
            roomService.obtenerRoomTipos()
                .then(res => {
                    this.tipos = res
                })
                .catch(err => {
                    console.log(err)
                })

            roomService.obtenerRoomEstados()
                .then(res => {
                    this.estados = res
                })
                .catch(err => {
                    console.log(err)
                })
        },
        getCaracteristicas() {
            roomService.obtenerCaracteristicas()
                .then(res => {
                    this.caracteristicas = res
                })
                .catch(err => {
                    console.log(err)
                })
        },
        close() {
            this.$emit('close')
        },
    },
    mounted() {
        this.getDatos()
        this.getCaracteristicas()
    },
}
</script>

<style scoped>
.caracteristics {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
}

.caracteristic {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 10px;
    width: 100%;
    height: 100%;
}

.caracteristic p {
    margin: 0;
    text-align: center;
}
</style>