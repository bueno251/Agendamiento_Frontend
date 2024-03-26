<template>
    <v-dialog :value="show" width="90%" persistent>
        <v-card class="pa-5">
            <v-form ref="form" v-model="valid" @submit.prevent="updateImgs">

                <v-file-input v-model="imgsToUpload" :rules="[rules.file]" @change="handleFileChange" label="Imagenes"
                    accept="image/*" prepend-icon="mdi-plus-circle" truncate-length="15" multiple hide-input outlined
                    required></v-file-input>

                <span class="red--text">{{ error }}</span>

                <div class="grid my-5">
                    <template v-for="(img, index) in imgsToUpload">
                        <v-menu :key="index" offset-y style="max-width: 600px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-card class="portrait"
                                    :img="img.preview" height="300"
                                    width="600" v-bind="attrs" v-on="on"></v-card>
                            </template>

                            <v-list>
                                <v-list-item link @click="imgsToUpload.splice(index, 1)">
                                    <v-list-item-title>Eliminar</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </template>

                    <template v-for="(img, index) in imgs">
                        <v-menu :key="`${index} - ${img.id}`" offset-y style="max-width: 600px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-card class="portrait" :img="rootBackend + img.url" height="300" width="600"
                                    v-bind="attrs" v-on="on"></v-card>
                            </template>

                            <v-list>
                                <v-list-item link @click="deleteImg(index)">
                                    <v-list-item-title>Eliminar</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </template>

                </div>

                <div class="buttons">
                    <v-btn @click="$emit('close')" color="blue">cancelar</v-btn>
                    <v-btn :disabled="!valid" type="submit" :loading="loading" color="light-green">guardar</v-btn>
                </div>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>

import Swal from 'sweetalert2'
import service from '@/services/service'

export default {
    name: 'DialogImg',
    props: {
        show: Boolean,
        room: Object,
    },
    computed: {
        imagenes() {
            return this.dates[0] || ''
        },
    },
    watch: {
        room: {
            handler(newRoom) {
                if (newRoom.imgs == null) {
                    this.imgs = []
                    return
                }

                this.imgs = Array.from(newRoom.imgs)
            },
            immediate: true,
        }
    },
    data() {
        return {
            error: '',
            imgs: [],
            imgsToUpload: [],
            imgsToDelete: [],
            valid: false,
            loading: false,
            showMenu: false,
            rules: {
                file: imgs => {

                    const allowedFormats = ['image/jpeg', 'image/png', 'image/gif'];
                    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

                    for (let i = 0; i < imgs.length; i++) {
                        if (!allowedFormats.includes(imgs[i].type) && !allowedExtensions.includes(imgs[i].name.slice(-4).toLowerCase())) {
                            this.error = 'Los archivos deben ser imagenes (JPEG, PNG, GIF)'
                            return this.error
                        }
                    }

                    return true;
                }
            },
            rootBackend: process.env.VUE_APP_URL_BASE + '/storage/',
        }
    },
    methods: {
        /**
        * Actualiza las imágenes de la habitación, eliminando las seleccionadas para eliminar y cargando las nuevas.
        * Muestra un mensaje de éxito o error después de la operación y emite un evento para actualizar la habitación.
        */
        updateImgs() {
            this.loading = true

            let data = new FormData()

            let imgsToDelete = this.imgsToDelete
            if (imgsToDelete.length) {
                imgsToDelete.map(img => {
                    data.append('urls[]', img.url)
                    data.append('toDelete[]', img.id)
                })
            }

            let imgsForUpload = this.imgsToUpload
            if (imgsForUpload.length) {
                imgsForUpload.map(img => {
                    data.append('imgs[]', img)
                })
            }

            service.actualizarRoomImg(data, this.room.id)
                .then(res => {
                    this.loading = false
                    this.imgsToUpload = []
                    this.imgsToDelete = []
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
         * Agrega la imagen a la lista de imágenes para eliminar y la elimina de la lista de imágenes actualmente mostradas.
         * @param {number} index - Índice de la imagen en la lista actual de imágenes.
         */
        deleteImg(index) {
            this.imgsToDelete.push(this.imgs[index])
            this.imgs.splice(index, 1)
        },
        /**
         * Actualiza la propiedad 'preview' de cada archivo de imagen con la URL de la vista previa.
         */
        handleFileChange() {
            this.imgsToUpload.forEach((file) => {
                // Actualizar la propiedad 'preview' con la URL de la vista previa
                file.preview = URL.createObjectURL(file)
            })
        },
        /**
         * Restablece el componente y emite un evento para cerrarlo.
         */
        close() {
            this.$emit('close')
            if (this.room.imgs == null) {
                this.imgs = []
            } else {
                this.imgs = Array.from(this.room.imgs)
            }

            this.imgsToUpload = []
            this.imgsToDelete = []
        },
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