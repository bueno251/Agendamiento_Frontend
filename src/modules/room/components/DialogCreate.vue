<template>
    <v-dialog :value="show" width="90%" persistent>
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
                        <v-file-input v-model="imgs" :rules="[rules.file]" @change="handleFileChange" label="Imagenes"
                            accept="image/*" prepend-icon="mdi-plus-circle" truncate-length="15" multiple hide-input
                            outlined required></v-file-input>

                        <span class="red--text">{{ error }}</span>

                        <div class="grid my-5">
                            <template v-for="(img, index) in imgs">
                                <v-menu :key="index" offset-y style="max-width: 600px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-card class="portrait" :img="img.preview" height="300" width="600" v-bind="attrs"
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
            error: '',
            imgs: [],
            valid: false,
            loading: false,
            tipos: [],
            estados: [],
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
        getTypes() {
            roomService.obtenerRoomTipos()
                .then(res => {
                    this.tipos = res
                })
                .catch(err => {
                    console.log(err)
                })
        },
        getEstados() {
            roomService.obtenerRoomEstados()
                .then(res => {
                    this.estados = res
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

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 10px;
}
</style>