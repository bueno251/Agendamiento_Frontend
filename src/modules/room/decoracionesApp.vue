<template>
    <div class="content">
        <h1>
            Decoraciones
        </h1>
        <v-card width="90%" class="my-5">
            <v-card-title>
                <v-row>
                    <v-col cols="12" md="10">
                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                            hide-details></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-btn class="mx-5" @click="dialogCreate = true" color="primary">
                            <v-icon>mdi-plus-circle</v-icon> agregar
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-data-table :headers="headers" :items="desserts" :search="search" :loading="loading"
                no-results-text="No hay ninguna decoración que coincida" no-data-text="No hay decoraciones"
                loading-text="Cargando... Por favor espera"
                :footer-props="{ itemsPerPageText: 'Número de filas', pageText: '{0}-{1} de {2}' }">
                <template v-slot:item="{ item }">
                    <tr>
                        <td>
                            <v-menu :offset-x="true" transition="scale-transition">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn icon v-bind="attrs" v-on="on">
                                        <v-icon>mdi-dots-vertical</v-icon>
                                    </v-btn>
                                </template>
                                <v-list>
                                    <v-list-item link @click="decoration = item, dialogUpdate = true">
                                        <v-list-item-title v-text="'Ajustes'"></v-list-item-title>
                                    </v-list-item>
                                    <v-list-item link @click="decoration = item, dialogDelete = true">
                                        <v-list-item-title v-text="'Eliminar'"></v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                        <td>{{ item.nombre }}</td>
                        <td>$ {{ comaEnMiles(item.precio) }}</td>
                        <td>{{ item.created_at }}</td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog :value="dialogCreate" width="90%" max-width="600px" persistent>
            <v-card class="pa-5">
                <v-form ref="formCreate" v-model="validCreate" @submit.prevent="crear">
                    <v-row>

                        <v-col cols="12">
                            <v-text-field v-model="nombre" :rules="[rules.required]" outlined required>
                                <template v-slot:label>
                                    Nombre <span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-text-field v-model="precio" v-price :rules="[rules.required]"
                                @input="formatNumber('precio', precio)" outlined required>
                                <template v-slot:label>
                                    Precio <span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-textarea v-model="descripcion" label="Descripción" auto-grow rows="5" dense outlined>
                            </v-textarea>
                        </v-col>

                        <v-col cols="12">

                            <v-file-input v-model="mediaFiles" :rules="[rules.file, rules.fileRequired]"
                                @change="handleFileChange('mediaFiles')" label="Imagenes" accept="image/*,video/*"
                                prepend-icon="mdi-plus-circle" truncate-length="15" multiple hide-input outlined
                                required></v-file-input>

                            <span class="red--text">{{ error }}</span>

                            <div class="grid my-5">
                                <template v-for="(file, index) in mediaFiles">
                                    <v-menu :key="index" offset-y style="width: 100%">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-card class="portrait"
                                                :style="{ 'background-image': `url('${isImg(file) ? file.preview : require('@/assets/file-video.png')}')`, 'background-size': isImg(file) ? 'cover' : 'contain', 'background-position': 'center' }"
                                                height="150" width="100%" v-bind="attrs" v-on="on">
                                            </v-card>
                                        </template>

                                        <v-list>
                                            <v-list-item link @click="mediaFiles.splice(index, 1)">
                                                <v-list-item-title>Eliminar</v-list-item-title>
                                            </v-list-item>
                                        </v-list>
                                    </v-menu>
                                </template>
                            </div>
                        </v-col>

                    </v-row>

                    <div class="buttons">
                        <v-btn @click="dialogCreate = false" color="blue">cancelar</v-btn>
                        <v-btn :disabled="!validCreate" :loading="loadingbtn" type="submit"
                            color="light-green">crear</v-btn>
                    </div>

                </v-form>
            </v-card>
        </v-dialog>

        <v-dialog :value="dialogUpdate" width="90%" max-width="600px" persistent>
            <v-card class="pa-5">
                <v-form ref="formUpdate" v-model="validUpdate" @submit.prevent="actualizar">
                    <v-row>

                        <v-col cols="12">
                            <v-text-field v-model="nombreUpdate" :rules="[rules.required]" outlined required>
                                <template v-slot:label>
                                    Nombre <span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-text-field v-model="precioUpdate" :rules="[rules.required]"
                                @input="formatNumber('precioUpdate', precioUpdate)" outlined required>
                                <template v-slot:label>
                                    Precio <span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-textarea v-model="descripcionUpdate" label="Descripción" auto-grow rows="5" dense outlined>
                            </v-textarea>
                        </v-col>

                        <v-col cols="12">

                            <v-file-input v-model="mediaFilesToUpload" :rules="[rules.file]"
                                @change="handleFileChange('mediaFilesToUpload')" label="Imagenes" accept="image/*,video/*"
                                prepend-icon="mdi-plus-circle" truncate-length="15" multiple hide-input outlined
                                required></v-file-input>

                            <div class="grid my-5">
                                <template v-for="(file, index) in mediaFilesToUpload">
                                    <v-menu :key="index" offset-y style="max-width: 600px">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-card class="portrait"
                                                :style="{ 'background-image': `url('${isImg(file) ? file.preview : require('@/assets/file-video.png')}')`, 'background-size': isImg(file) ? 'cover' : 'contain', 'background-position': 'center' }"
                                                v-bind="attrs" v-on="on"></v-card>
                                        </template>

                                        <v-list>
                                            <v-list-item link @click="mediaFilesToUpload.splice(index, 1)">
                                                <v-list-item-title>Eliminar</v-list-item-title>
                                            </v-list-item>
                                        </v-list>
                                    </v-menu>
                                </template>

                                <template v-for="(file, index) in mediaToSee">
                                    <v-menu :key="`${index} - ${file.id}`" offset-y style="max-width: 600px">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-card class="portrait" height="150" width="100%"
                                                :style="{ 'background-image': `url('${isImg(file) ? (rootBackend + file.url) : require('@/assets/file-video.png')}')`, 'background-size': isImg(file) ? 'cover' : 'contain', 'background-position': 'center' }"
                                                v-bind="attrs" v-on="on"></v-card>
                                        </template>

                                        <v-list>
                                            <v-list-item link @click="deleteMedia(index)">
                                                <v-list-item-title>Eliminar</v-list-item-title>
                                            </v-list-item>
                                        </v-list>
                                    </v-menu>
                                </template>

                            </div>

                        </v-col>

                    </v-row>

                    <div class="buttons">
                        <v-btn @click="dialogUpdate = false, closeUpdate()" color="blue">cancelar</v-btn>
                        <v-btn :disabled="!validUpdate" type="submit" :loading="loadingbtn"
                            color="light-green">actualizar</v-btn>
                    </div>

                </v-form>
            </v-card>
        </v-dialog>

        <v-dialog :value="dialogDelete" width="90%" max-width="600px" persistent>
            <v-card>
                <v-sheet class="d-flex justify-center align-center flex-column pa-5">
                    <h3>Eliminar la decoración {{ decoration.decoracion }}?</h3>
                    <div class="buttons">
                        <v-btn @click="dialogDelete = false" color="error"
                            class="white--text text--accent-4">cancelar</v-btn>
                        <v-btn @click="eliminar" :loading="loadingbtn" color="primary">eliminar</v-btn>
                    </div>
                </v-sheet>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

import Swal from 'sweetalert2'
import roomService from "./service/roomService"

export default {
    name: 'DecoracionesApp',
    watch: {
        decoration: {
            // Función que se ejecuta cuando hay cambios en decoration
            handler(newItem) {
                if ('id' in newItem) {
                    this.nombreUpdate = newItem.nombre
                    this.precioUpdate = this.comaEnMiles(newItem.precio)
                    this.descripcionUpdate = newItem.descripcion
                    this.mediaToSee = !newItem.media ? [] : Array.from(newItem.media)
                }
            },
            // Immediate: true indica que se ejecutará el handler inmediatamente después de registrar el watcher
            immediate: true
        }
    },
    directives: {
        'price': {
            bind(el) {
                el.addEventListener('input', (event) => {
                    const newValue = event.target.value.replace(/\D/g, '')

                    let exp = /(\d)(?=(\d{3})+(?!\d))/g
                    let rep = '$1.'

                    event.target.value = newValue.toString().replace(exp, rep)
                })
            }
        },
    },
    data() {
        return {
            search: '',
            error: '',
            nombre: '',
            precio: '',
            descripcion: '',
            nombreUpdate: '',
            precioUpdate: '',
            descripcionUpdate: '',
            loading: false,
            loadingbtn: false,
            dialogCreate: false,
            dialogUpdate: false,
            dialogDelete: false,
            validCreate: false,
            validUpdate: false,
            decoration: {},
            desserts: [],
            mediaFiles: [],
            mediaToSee: [],
            mediaFilesToUpload: [],
            mediaFilesToDelete: [],
            headers: [
                { text: '', key: 'actions', sortable: false },
                { text: 'Nombre', key: 'nombre', value: 'nombre' },
                { text: 'Precio', key: 'precio', value: 'precio' },
                { text: 'Creado', key: 'created_at', value: 'created_at' },
            ],
            rules: {
                required: value => !!value || 'Campo requerido.',
                fileRequired: file => {

                    if (!file.length) {
                        this.error = 'Se necesita un archivo.'
                        return false
                    }

                    this.error = ''
                    return true;
                },
                file: file => {
                    const allowedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mov', 'video/wmv', 'video/avi', 'video/mkv', 'video/webm'];
                    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.mov', '.wmv', '.avi', '.mkv', '.webm'];

                    for (let i = 0; i < file.length; i++) {
                        if (!allowedFormats.includes(file[i].type) && !allowedExtensions.includes(file[i].name.slice(-4).toLowerCase())) {
                            this.error = 'Los archivos deben ser imagenes (JPEG, PNG, GIF) o videos (MP4, MOV, WMV, AVI, MKV, WebM)'
                            return this.error
                        }
                    }

                    this.error = ''
                    return true;
                },
            },
            rootBackend: process.env.VUE_APP_URL_BASE + '/storage/',
        }
    },
    methods: {
        /**
         * Crea una nueva decoración de habitación.
         */
        crear() {
            this.loadingbtn = true

            // Prepara los datos para enviar al servidor
            let data = new FormData()

            data.append('nombre', this.nombre)
            data.append('precio', parseInt(this.precio.replace(".", "")))
            data.append('descripcion', this.descripcion)

            const mediaForUpload = this.mediaFiles
            if (mediaForUpload.length) {
                mediaForUpload.map(file => {
                    data.append('media[]', file)
                })
            }

            // Llama al servicio para crear una nueva decoración de habitación
            roomService.crearDecoracion(data)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogCreate = false
                    this.getDecoraciones() // Actualiza la lista de decoraciones después de crear una nueva
                    this.nombre = ''
                    this.precio = ''
                    this.descripcion = ''
                    this.mediaFiles = []
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })
                })
                .catch(err => {
                    this.loadingbtn = false
                    Swal.fire({
                        icon: 'error',
                        text: err.response.data.message,
                    })
                    console.log(err)
                })
        },
        /**
         * Obtiene la lista de decoraciones de habitación.
         */
        getDecoraciones() {
            this.loading = true
            this.decoration = {}

            // Llama al servicio para obtener la lista de decoraciones de habitación
            roomService.obtenerDecoraciones()
                .then(res => {
                    this.loading = false
                    this.desserts = res
                })
                .catch(err => {
                    this.loading = false
                    console.log(err)
                })
        },
        /**
         * Actualiza una decoración de habitación existente.
         */
        actualizar() {
            this.loadingbtn = true

            // Prepara los datos para enviar al servidor
            let data = new FormData()

            data.append('nombre', this.nombreUpdate)
            data.append('precio', parseInt(this.precioUpdate.replace(".", "")))
            data.append('descripcion', this.descripcionUpdate)

            let mediaFilesToDelete = this.mediaFilesToDelete
            if (mediaFilesToDelete.length) {
                mediaFilesToDelete.map(file => {
                    data.append('urls[]', file.url)
                    data.append('toDelete[]', file.id)
                })
            }

            let mediaFilesToUpload = this.mediaFilesToUpload
            if (mediaFilesToUpload.length) {
                mediaFilesToUpload.map(file => {
                    data.append('media[]', file)
                })
            }

            // Llama al servicio para actualizar una decoración de habitación existente
            roomService.actualizarDecoracion(data, this.decoration.id)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogUpdate = false
                    this.mediaFilesToUpload = []
                    this.mediaFilesToDelete = []
                    this.getDecoraciones() // Actualiza la lista de decoraciones después de la actualización
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })
                })
                .catch(err => {
                    this.loadingbtn = false
                    Swal.fire({
                        icon: 'error',
                        text: err.response.data.message,
                    })
                    console.log(err)
                })
        },
        /**
         * Elimina una decoración de habitación.
         */
        eliminar() {
            this.loadingbtn = true

            // Llama al servicio para eliminar una decoración de habitación
            roomService.eliminarDecoracion(this.decoration.id)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogDelete = false
                    this.getDecoraciones() // Actualiza la lista de decoraciones después de la eliminación
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })
                })
                .catch(err => {
                    this.loadingbtn = false
                    Swal.fire({
                        icon: 'error',
                        text: err.response.data.message,
                    })
                    console.log(err)
                })
        },
        /**
         * Actualiza la propiedad 'preview' de cada archivo de imagen con la URL de la vista previa.
         */
        handleFileChange(value) {
            this[value].forEach((file) => {
                // Actualizar la propiedad 'preview' con la URL de la vista previa
                file.preview = URL.createObjectURL(file)
            })
        },
        /**
         * Agrega el medio audivisual a la lista de archivos para eliminar y la elimina de la lista de medios actualmente mostradas.
         * @param {number} index - Índice del archivo en la lista actual de medios audivisuales.
         */
        deleteMedia(index) {
            this.mediaFilesToDelete.push(this.mediaToSee[index])
            this.mediaToSee.splice(index, 1)
        },
        /**
         * Formatea un número agregando comas para separar miles.
         * @param {number} numero - Número que se formateará.
         * @returns {string} Número formateado con comas.
         */
        comaEnMiles(numero) {
            let exp = /(\d)(?=(\d{3})+(?!\d))/g //* expresión regular que busca tres dígitos
            let rep = '$1.' //parámetro especial para splice porque los números no son menores a 100
            return numero.toString().replace(exp, rep)
        },
        /**
         * Formatea el número de un día de la semana agregando comas para separar miles.
         * @param {object} precio - Objeto que representa un día de la semana con un precio.
         */
        formatNumber(value, precio) {
            let formattedNumber = precio.replace(/\D/g, '') // Elimina caracteres no numéricos del precio
            this[value] = this.comaEnMiles(formattedNumber) // Formatea el número con comas
        },
        closeUpdate() {
            if (this.decoration.media == null) {
                this.mediaToSee = []
            } else {
                this.mediaToSee = Array.from(this.decoration.media)
            }

            this.mediaFilesToUpload = []
            this.mediaFilesToDelete = []
        },
        isImg(file) {
            if (!file) {
                return false
            }

            // Verificar por extensión en la URL
            const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
            const fileUrl = file.url || file.name // Puedes ajustar la propiedad URL según tus necesidades

            if (fileUrl) {
                const fileExtension = fileUrl.slice(((fileUrl.lastIndexOf(".") - 2) >>> 0) + 2).toLowerCase()
                if (allowedExtensions.includes(fileExtension)) {
                    return true
                }
            }

            // Verificar por tipo
            return file.type && file.type.startsWith('image/')
        },
    },
    mounted() {
        this.getDecoraciones()
    },
}
</script>

<style scoped>
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
}
</style>