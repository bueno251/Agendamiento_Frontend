<template>
    <v-dialog :value="show" width="90%" max-width="800px" persistent>
        <v-card class="pa-5">
            <v-toolbar elevation="0">
                <v-spacer />
                <v-btn icon class="ml-3" @click="$emit('close')">
                    <v-icon>mdi-close-box</v-icon>
                </v-btn>
            </v-toolbar>
            <v-form ref="form" v-model="valid" @submit.prevent="newRoom">
                <v-row>

                    <v-col cols="12" md="6" sm="6" class="py-0">
                        <v-text-field v-model="nombre" :rules="[rules.required]" dense outlined required>
                            <template v-slot:label>
                                Nombre <span class="red--text">*</span>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="6" class="py-0">
                        <v-text-field v-model="capacidad" :rules="[rules.required]" dense outlined required>

                            <template v-slot:label>
                                Capacidad <span class="red--text">*</span>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="6" class="py-0">
                        <v-select v-model="tipo" :items="tipos" no-data-text="Espere un momento..."
                            :rules="[rules.required]" item-text="tipo" item-value="id" dense outlined>

                            <template v-slot:label>
                                Tipo <span class="red--text">*</span>
                            </template>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="6" sm="6" class="py-0">
                        <v-select v-model="estado" :items="estados" no-data-text="Espere un momento..."
                            :rules="[rules.required]" item-text="estado" item-value="id" dense outlined>

                            <template v-slot:label>
                                Estado <span class="red--text">*</span>
                            </template>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6" class="py-0">
                        <v-text-field v-model="cantidad" :rules="[rules.required]" dense outlined required>

                            <template v-slot:label>
                                Cantidad <span class="red--text">*</span>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3" sm="6" class="py-0">
                        <v-text-field v-model="cantidadOtas" :rules="[rules.required]" dense outlined required>

                            <template v-slot:label>
                                Cantidad OTAS <span class="red--text">*</span>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3" sm="6" class="py-0">
                        <v-select v-model="decoracion" :items="yesNo" item-text="text" item-value="value" dense
                            outlined>

                            <template v-slot:label>
                                Decoración <span class="red--text">*</span>
                            </template>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6" class="py-0">
                        <v-select v-model="desayuno" :items="yesNo" item-text="text" item-value="value" dense outlined>

                            <template v-slot:label>
                                Desayuno <span class="red--text">*</span>
                            </template>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6" v-if="desayuno" class="py-0">
                        <v-select v-model="incluyeDesayuno" :items="yesNo" item-text="text" item-value="value" dense
                            outlined>

                            <template v-slot:label>
                                Incluir Desayuno <span class="red--text">*</span>
                            </template>
                        </v-select>
                    </v-col>

                    <v-col v-if="tieneIva" cols="12" md="6" sm="6" class="py-0">
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

                    <v-col cols="12" class="py-0">
                        <div class="flex">
                            <p>
                                Tiene Un Impuesto?
                            </p>
                            <v-switch v-model="tieneIva" :label="tieneIva ? 'Si' : 'No'" inset></v-switch>
                        </div>
                    </v-col>

                    <v-col cols="12">
                        <v-textarea :rules="[rules.required]" v-model="descripcion" auto-grow rows="5" dense outlined>

                            <template v-slot:label>
                                Descripción <span class="red--text">*</span>
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
                            dense outlined required></v-file-input>

                        <span class="red--text">{{ error }}</span>

                        <div class="grid my-5">

                            <template v-for="(img, index) in imgs">
                                <v-menu :key="index" offset-y style="width: 100%">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-card class="portrait" :img="img.preview" height="150" width="100%"
                                            v-bind="attrs" v-on="on"></v-card>
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
                    <v-btn @click="$emit('close')" color="blue">
                        cancelar
                    </v-btn>
                    <v-btn :disabled="!valid" type="submit" :loading="loading" class="light-green black--text">
                        crear
                    </v-btn>
                </div>
            </v-form>
        </v-card>

        <CreateCaracteristicRoom :show="dialogCreate" @close="dialogCreate = false" @update="getCaracteristicas()" />

        <createImpuesto :show="createImpuestoDialog" @close="createImpuestoDialog = false" @update="getImpuestos()" />

    </v-dialog>
</template>

<script>

import Swal from 'sweetalert2'
import service from '@/services/service'
import CreateCaracteristicRoom from './CreateCaracteristicRoom.vue'
import createImpuesto from '@/modules/impuestos/components/createImpuesto.vue'

export default {
    name: 'DialogCreate',
    props: {
        show: Boolean,
    },
    components: {
        CreateCaracteristicRoom,
        createImpuesto,
    },
    watch: {
        desayuno: {
            handler(newItem) {
                if (!newItem) {
                    this.incluyeDesayuno = 0
                }
            }
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
            error: '',
            imgs: [],
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
                file: imgs => {
                    const allowedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
                    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
                    const maxSizeInBytes = 64 * 1024 * 1024 // 64 MB

                    if (!imgs.length) {
                        this.error = 'Se necesita una imagen.'
                        return false
                    }

                    for (let i = 0; i < imgs.length; i++) {
                        if (!allowedFormats.includes(imgs[i].type) && !allowedExtensions.includes(imgs[i].name.slice(-4).toLowerCase())) {
                            this.error = 'Los archivos deben ser imágenes (JPEG, PNG, GIF).'
                            return false
                        }

                        if (imgs[i].size > maxSizeInBytes) {
                            this.error = 'El tamaño máximo permitido por archivo es de 64 MB.'
                            return false
                        }
                    }

                    this.error = ''
                    return true
                }
            },
        }
    },
    methods: {
        /**
         * Crea una nueva habitación utilizando los datos proporcionados en el formulario.
         * Los datos incluyen nombre, descripción, tipo de habitación, capacidad, estado, cantidad, desayuno, decoración e imágenes.
         * También permite adjuntar características seleccionadas a la habitación.
         * Muestra un mensaje de éxito o error después de la operación y emite un evento para cerrar el componente.
         */
        newRoom() {
            this.loading = true

            let data = new FormData()

            data.append('nombre', this.nombre)
            data.append('descripcion', this.descripcion)
            data.append('tieneIva', this.tieneIva ? 1 : 0)
            data.append('impuesto', this.impuesto)
            data.append('tipo', this.tipo)
            data.append('capacidad', this.capacidad)
            data.append('estado', this.estado)
            data.append('cantidad', this.cantidad)
            data.append('cantidadOtas', this.cantidadOtas)
            data.append('desayuno', this.desayuno)
            data.append('incluyeDesayuno', this.incluyeDesayuno)
            data.append('decoracion', this.decoracion)

            const imgsForUpload = this.imgs
            if (imgsForUpload.length) {
                imgsForUpload.map(img => {
                    data.append('imgs[]', img)
                })
            }

            if (this.selectedCaracteristicas.length) {
                this.selectedCaracteristicas.map(caracteristic => {
                    data.append('caracteristic[]', caracteristic)
                })
            }

            service.crearRoom(data)
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
         * Actualiza la propiedad 'preview' de cada archivo de imagen con la URL de la vista previa.
         */
        handleFileChange() {
            this.imgs.forEach((file) => {
                // Actualizar la propiedad 'preview' con la URL de la vista previa
                file.preview = URL.createObjectURL(file)
            })
        },
        /**
         * Obtiene datos necesarios como tipos de habitación, estados y características de habitaciones.
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
    },
    mounted() {
        this.getDatos()
        this.getImpuestos()
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