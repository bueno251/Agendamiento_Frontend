<template>
    <v-dialog :value="show" width="90%" max-width="800px" persistent>
        <v-card class="pa-5">
            <v-toolbar elevation="0">
                <v-spacer />
                <v-btn icon class="ml-3" @click="$emit('close')">
                    <v-icon>mdi-close-box</v-icon>
                </v-btn>
            </v-toolbar>
            <v-form ref="form" v-model="valid" @submit.prevent="updateRoom">
                <v-row>

                    <v-col cols="12" md="6" sm="6">
                        <v-text-field v-model="nombre" :rules="[rules.required]" dense outlined required>
                            <template v-slot:label>
                                Nombre<span class="red--text">*</span>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="6">
                        <v-text-field v-model="capacidad" :rules="[rules.required]" dense outlined required>

                            <template v-slot:label>
                                Capacidad<span class="red--text">*</span>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="6">
                        <v-select v-model="tipo" :items="tipos" no-data-text="Espere un momento..."
                            :rules="[rules.required]" item-text="tipo" item-value="id" dense outlined>

                            <template v-slot:label>
                                Tipo<span class="red--text">*</span>
                            </template>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="6" sm="6">
                        <v-select v-model="estado" :items="estados" no-data-text="Espere un momento..."
                            :rules="[rules.required]" item-text="estado" item-value="id" dense outlined>

                            <template v-slot:label>
                                Estado<span class="red--text">*</span>
                            </template>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <v-text-field v-model="cantidad" :rules="[rules.required, rules.min]" dense outlined required>

                            <template v-slot:label>
                                Cantidad <span class="red--text">*</span>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <v-text-field v-model="cantidadOtas" :rules="[rules.required]" dense outlined required>

                            <template v-slot:label>
                                Cantidad OTAS<span class="red--text">*</span>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <v-select v-model="decoracion" :items="yesNo" item-text="text" item-value="value" dense
                            outlined>

                            <template v-slot:label>
                                Decoración <span class="red--text">*</span>
                            </template>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <v-select v-model="desayuno" :items="yesNo" item-text="text" item-value="value" dense outlined>

                            <template v-slot:label>
                                Desayuno <span class="red--text">*</span>
                            </template>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6" v-if="desayuno">
                        <v-select v-model="incluyeDesayuno" :items="yesNo" item-text="text" item-value="value" dense
                            outlined>

                            <template v-slot:label>
                                Incluir Desayuno <span class="red--text">*</span>
                            </template>
                        </v-select>
                    </v-col>

                    <v-col v-if="tieneIva" cols="12" md="6" sm="6">
                        <v-select v-model="impuesto" :items="impuestos" :rules="[rules.required]"
                            :item-text="item => `${item.codigo} (${item.tasa}%)`" item-value="id" dense outlined
                            required>

                            <template v-slot:label>
                                Impuesto <span class="red--text">*</span>
                            </template>

                            <template v-slot:prepend-item>
                                <v-list-item ripple @mousedown.prevent @click="createImpuestoDialog = true">
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            Añadir Impuesto
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-divider class="mt-2"></v-divider>
                            </template>
                        </v-select>
                    </v-col>

                    <v-col cols="12">
                        <div class="flex">
                            <p>
                                Tiene Un Impuesto?
                            </p>
                            <v-switch v-model="tieneIva" :label="tieneIva ? 'Si' : 'No'" inset></v-switch>
                        </div>
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
                    <v-btn @click="$emit('close')" color="blue">cancelar</v-btn>
                    <v-btn :disabled="!valid" type="submit" :loading="loading" class="light-green black--text">Actualizar</v-btn>
                </div>
            </v-form>
        </v-card>

        <CreateCaracteristicRoom :show="dialogCreate" @close="dialogCreate = false" @update="getCaracteristicas" />

        <createImpuesto :show="createImpuestoDialog" @close="createImpuestoDialog = false" @update="getImpuestos()" />

    </v-dialog>
</template>

<script>

import vuex from "@/store"
import Swal from 'sweetalert2'
import service from "@/services/service"
import CreateCaracteristicRoom from './CreateCaracteristicRoom.vue'
import createImpuesto from '@/modules/impuestos/components/createImpuesto.vue'

export default {
    name: 'DialogUpdate',
    props: {
        show: Boolean,
        room: Object,
    },
    components: {
        CreateCaracteristicRoom,
        createImpuesto,
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
                    this.nombre = newRoom.nombre
                    this.tieneIva = newRoom.tieneIva
                    this.impuesto = newRoom.impuestoId
                    this.descripcion = newRoom.descripcion
                    this.tipo = newRoom.tipoId
                    this.capacidad = newRoom.capacidad
                    this.cantidad = newRoom.countRooms
                    this.cantidadOtas = newRoom.cantidadOtas
                    this.estado = newRoom.estadoId
                    this.selectedCaracteristicas = Array.from(newRoom.caracteristicas)
                    this.desayuno = newRoom.tieneDesayuno ? 1 : 0
                    this.decoracion = newRoom.tieneDecoracion ? 1 : 0
                    this.incluyeDesayuno = newRoom.incluyeDesayuno ? 1 : 0
                    this.getCaracteristicas()
                }
            },
            immediate: true,
        }
    },
    data() {
        return {
            nombre: '',
            descripcion: '',
            tipo: '',
            capacidad: '',
            estado: '',
            cantidad: '',
            cantidadOtas: '',
            impuesto: '',
            desayuno: 0,
            decoracion: 0,
            incluyeDesayuno: 0,
            tieneIva: 0,
            valid: false,
            loading: false,
            dialogCreate: false,
            createImpuestoDialog: false,
            tipos: [],
            estados: [],
            caracteristicas: [],
            selectedCaracteristicas: [],
            impuestos: [],
            yesNo: [
                {
                    value: 1,
                    text: 'Si',
                },
                {
                    value: 0,
                    text: 'No',
                }
            ],
            rules: {
                required: value => !!value || 'Campo requerido.',
                min: value => value >= this.room.countRooms || 'No puede ser menor a la cantidad anterior.',
            },
        }
    },
    methods: {
        /**
         * Actualiza la habitación con la información proporcionada en el formulario.
         * Los datos incluyen nombre, descripción, tipo de habitación, capacidad, estado, características seleccionadas,
         * características desactivadas, desayuno y decoración.
         * Muestra un mensaje de éxito o error después de la operación y emite un evento para cerrar el componente.
         */
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
                tieneIva: this.tieneIva ? 1 : 0,
                impuesto: this.impuesto,
                tipo: this.tipo,
                capacidad: this.capacidad,
                cantidad: this.cantidad,
                cantidadOtas: this.cantidadOtas,
                estado: this.estado,
                estadoAntiguo: this.room.estadoId,
                activar: this.selectedCaracteristicas,
                desactivar: noSelected,
                desayuno: this.desayuno,
                incluyeDesayuno: this.incluyeDesayuno,
                decoracion: this.decoracion,
            }

            service.actualizarRoom(data, this.room.id)
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
         * Obtiene datos necesarios como tipos de habitación y estados de habitación.
         */
        getDatos() {
            service.obtenerTiposRoom()
                .then(res => {
                    this.tipos = res
                })
                .catch(err => {
                    console.error(err)
                })

            service.obtenerEstadosRoom()
                .then(res => {
                    this.estados = res
                })
                .catch(err => {
                    console.error(err)
                })
        },
        /**
         * Obtiene las características de habitaciones disponibles.
         */
        getCaracteristicas() {
            service.obtenerCaracteristicas()
                .then(res => {
                    this.caracteristicas = res
                })
                .catch(err => {
                    console.error(err)
                })
        },
        getImpuestos() {
            service.obtenerImpuestos()
                .then(res => {
                    this.impuestos = res
                })
                .catch(err => {
                    console.error(err)
                })
        },
        /**
          * Cierra el componente emitiento un evento 'close'.
          */
        close() {
            // Emitir evento 'close'
            this.$emit('close')
        },
    },
    mounted() {
        this.getDatos()
        this.getImpuestos()
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

.flex {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    gap: 10px;
}

.flex p {
    padding: 0;
    margin: 0;
    text-wrap: balance;
}
</style>