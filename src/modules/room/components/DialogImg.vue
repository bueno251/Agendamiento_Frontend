<template>
    <v-dialog :value="show" width="90%" persistent>
        <v-card class="pa-5">
            <v-form ref="form" v-model="valid" @submit.prevent="updateImgs">

                <div class="negativo">

                </div>

                <v-file-input v-model="imgsToUpload" :rules="[rules.file]" @change="handleFileChange" label="Imagenes"
                    accept="image/*" prepend-icon="mdi-plus-circle" truncate-length="15" multiple hide-input outlined
                    required></v-file-input>

                <span class="red--text">{{ error }}</span>

                <div class="grid my-5">
                    <template v-for="(img, index) in imgsToUpload">
                        <v-menu :key="index" offset-y style="max-width: 600px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-card class="portrait"
                                    :img="img.preview || 'https://cdn.vuetifyjs.com/images/cards/girl.jpg'" height="300"
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
                    <v-btn @click="close" color="blue">cancelar</v-btn>
                    <v-btn :disabled="!valid" type="submit" :loading="loading" color="blue">guardar</v-btn>
                </div>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>

import Swal from 'sweetalert2'
import roomService from '../service/roomService'

export default {
    name: 'DialogImg',
    props: {
        show: Boolean,
        room: Object,
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
            rootBackend: process.env.VUE_APP_URL_BASE.replace('/api', '/storage/'),
        }
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
    methods: {
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

            let imgsForUpload = this.imgsToUpload;
            if (imgsForUpload.length) {
                imgsForUpload.map(img => {
                    data.append('imgs[]', img);
                });
            }

            roomService.actualizarRoomImg(data, this.room.id)
                .then(res => {
                    this.loading = false
                    this.imgsToUpload = []
                    this.imgsToDelete = []
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
        deleteImg(index) {
            this.imgsToDelete.push(this.imgs[index])
            this.imgs.splice(index, 1)
        },
        handleFileChange() {
            this.imgsToUpload.forEach((file) => {
                // Actualizar la propiedad 'preview' con la URL de la vista previa
                file.preview = URL.createObjectURL(file)
            });
        },
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
    mounted() {
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