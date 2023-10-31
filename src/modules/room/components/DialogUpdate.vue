<template>
    <v-dialog :value="show" width="90%" max-width="500px" persistent>
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
                            :rules="[rules.state]" item-text="estado" item-value="value" outlined>
                            <template v-slot:label>
                                Estado<span class="red--text">*</span>
                            </template>
                        </v-select>
                    </v-col>
                    <v-col cols="12">
                        <v-textarea v-model="descripcion" auto-grow rows="5" dense label="Descripcion"
                            outlined></v-textarea>
                    </v-col>
                </v-row>
                <div class="buttons">
                    <v-btn @click="close" color="red">cancelar</v-btn>
                    <v-btn :disabled="!valid" type="submit" :loading="loading" color="light-green">Actualizar</v-btn>
                </div>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>

import Swal from 'sweetalert2'

export default {
    name: 'DialogUpdate',
    props: {
        show: Boolean,
        room: Object,
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
            estados: [
                {
                    value: 0,
                    estado: 'Activo'
                },
                {
                    value: 1,
                    estado: 'Inactivo'
                }
            ],
            rules: {
                required: value => !!value || 'Campo requerido.',
                state: value => value !== '' || 'Campo requerido.',
            },
        }
    },
    methods: {
        updateRoom() {
            this.loading = true

            let url = `room/update/${this.room.id}`

            let data = {
                nombre: this.nombre,
                descripcion: this.descripcion,
                roomTipo: this.tipo,
                capacidad: this.capacidad,
                estado: this.estado,
            }

            this.$axios.patch(url, data)
                .then(res => {
                    this.loading = false
                    this.$emit('update')
                    Swal.fire({
                        icon: 'success',
                        text: res.data,
                    })
                })
                .catch(err => {
                    this.loading = false
                    console.log(err);
                })
        },
        getTypes() {
            let url = 'room/type'

            this.$axios.get(url)
                .then(res => {
                    this.tipos = res.data
                })
                .catch(err => {
                    console.log(err);
                })
        },
        close() {
            this.$emit('close', false)
        },
    },
    watch: {
        room: {
            handler(newRoom) {
                this.nombre = newRoom.nombre;
                this.descripcion = newRoom.descripcion;
                this.tipo = newRoom.tipoId;
                this.capacidad = newRoom.capacidad;
                this.estado = newRoom.estado;
            },
            immediate: true,
        }
    },
    mounted() {
        this.getTypes()
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