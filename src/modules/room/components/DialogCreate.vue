<template>
    <v-dialog :value="show" width="90%" max-width="600px" persistent>
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

                    <v-col cols="12">

                        <v-file-input v-model="imgs" :rules="[rules.file]" @change="handleFileChange" label="Imagenes"
                            accept="image/*" prepend-icon="mdi-plus-circle" truncate-length="15" multiple hide-input
                            outlined required></v-file-input>

                        <span class="red--text">{{ error }}</span>

                        <div class="grid my-5">
                            <template v-for="(img, index) in imgs">
                                <v-menu :key="index" offset-y style="width: 100%">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-card class="portrait" :img="img.preview" height="150" width="100%" v-bind="attrs"
                                            v-on="on"></v-card>
                                    </template>

                                    <v-list>
                                        <v-list-item link @click="imgs.splice(index, 1)">
                                            <v-list-item-title>Eliminar</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </template>
                        </div>
                    </v-col>

                </v-row>

                <div class="buttons">
                    <v-btn @click="close" color="blue">cancelar</v-btn>
                    <v-btn :disabled="!valid" type="submit" :loading="loading" color="light-green">crear</v-btn>
                </div>
            </v-form>
        </v-card>
        <CreateCaracteristicRoom :show="dialogCreate" @close="dialogCreate = false"
            @create="getCaracteristicas(), dialogCreate = false">
        </CreateCaracteristicRoom>
    </v-dialog>
</template>

<script>

import Swal from 'sweetalert2'
import roomService from '../service/roomService'
import CreateCaracteristicRoom from './CreateCaracteristicRoom.vue'

export default {
    name: 'DialogCreate',
    props: {
        show: Boolean,
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
            error: '',
            imgs: [],
            valid: false,
            loading: false,
            dialogCreate: false,
            tipos: [],
            estados: [],
            caracteristicas: [],
            selectedCaracteristicas: [],
            rules: {
                required: value => !!value || 'Campo requerido.',
                file: imgs => {

                    const allowedFormats = ['image/jpeg', 'image/png', 'image/gif'];
                    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

                    if (!imgs.length) {
                        this.error = 'Se necesita una imagen.'
                        return false
                    }

                    for (let i = 0; i < imgs.length; i++) {
                        if (!allowedFormats.includes(imgs[i].type) && !allowedExtensions.includes(imgs[i].name.slice(-4).toLowerCase())) {
                            this.error = 'Los archivos deben ser imagenes (JPEG, PNG, GIF)'
                            return false
                        }
                    }

                    this.error = ''
                    return true;
                }
            },
        }
    },
    methods: {
        newRoom() {
            this.loading = true

            let data = new FormData()

            data.append('nombre', this.nombre)
            data.append('descripcion', this.descripcion)
            data.append('roomTipo', this.tipo)
            data.append('capacidad', this.capacidad)
            data.append('estado', this.estado)

            const imgsForUpload = this.imgs;
            if (imgsForUpload.length) {
                imgsForUpload.map(img => {
                    data.append('imgs[]', img);
                });
            }

            if (this.selectedCaracteristicas.length) {
                this.selectedCaracteristicas.map(caracteristic => {
                    data.append('caracteristic[]', caracteristic)
                })
            }

            roomService.crearRoom(data)
                .then(res => {
                    this.loading = false
                    this.$emit('create')
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
        handleFileChange() {
            this.imgs.forEach((file) => {
                // Actualizar la propiedad 'preview' con la URL de la vista previa
                file.preview = URL.createObjectURL(file)
            });
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
            this.$refs.form.reset()
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
.buttons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 15px;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
}

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