<template>
    <v-card width="90%" class="my-5" elevation="5">
        <v-card-title>
            <v-row>
                <v-col cols="12" md="10" sm="8">
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                        hide-details></v-text-field>
                </v-col>
                <v-col cols="12" md="2" sm="4">
                    <v-btn class="mx-5" @click="dialogCreate = true" color="primary">
                        <v-icon>mdi-plus-circle</v-icon> agregar
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-title>
        <v-data-table :headers="headers" :items="descuentos" :search="search" :loading="loading"
            no-results-text="No hay ningún descuento que coincida" no-data-text="No hay descuentos"
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
                                <v-list-item link @click="discount = item, dialogUpdate = true">
                                    <v-list-item-title v-text="'Ajustes'"></v-list-item-title>
                                </v-list-item>
                                <v-list-item link @click="discount = item, dialogDelete = true">
                                    <v-list-item-title v-text="'Eliminar'"></v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </td>
                    <td>{{ item.nombre }}</td>
                    <td>{{ item.dias }}</td>
                    <td><span v-if="item.tipoId == 2">$</span>{{ comaEnMiles(item.descuento) }}<span
                            v-if="item.tipoId == 1">%</span></td>
                    <td>{{ listHabitaciones(item.habitaciones) }}</td>
                    <td>{{ item.activo ? 'Activo' : 'Desactivo' }}</td>
                    <td>{{ item.created_at }}</td>
                </tr>
            </template>
        </v-data-table>

        <v-dialog :value="dialogCreate" width="90%" max-width="600px" persistent>
            <v-card class="pa-5">
                <v-toolbar elevation="0">
                    <v-spacer />
                    <v-btn icon class="ml-3" @click="dialogCreate = false">
                        <v-icon>mdi-close-box</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-form ref="formCreate" v-model="validCreate" @submit.prevent="crear">
                    <v-row>

                        <v-col cols="12" md="6" sm="6">
                            <v-text-field v-model="nombre" :rules="[rules.required]" outlined required>

                                <template v-slot:label>
                                    Nombre <span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12" md="6" sm="6">
                            <v-text-field v-model="diasEstancia" :rules="[rules.required]" type="number"
                                hide-spin-buttons outlined required>

                                <template v-slot:label>
                                    Dias Minimos De La Estancia <span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12" md="6" sm="6">
                            <v-select v-model="tipo" :items="tipos" :rules="[rules.required]" item-text="tipo"
                                item-value="id" outlined required>

                                <template v-slot:label>
                                    Tipo <span class="red--text">*</span>
                                </template>
                            </v-select>
                        </v-col>

                        <v-col cols="12" md="6" sm="6">
                            <v-slider v-if="tipo == 1" v-model="descuento" max="100" min="0" label="Descuento"
                                thumb-label="always">
                                <template v-slot:thumb-label="{ value }">
                                    {{ value }}%
                                </template>
                            </v-slider>

                            <v-text-field v-if="tipo == 2" v-model="descuento" v-price :rules="[rules.required]"
                                @input="formatNumber('descuento', descuento)" outlined required>

                                <template v-slot:label>
                                    Descuento <span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12" md="6" sm="6">
                            <v-select v-model="habitacionesSelected" :items="habitaciones"
                                :rules="[rules.arrayRequired]" item-text="nombre" item-value="id" multiple outlined
                                required>

                                <template v-slot:label>
                                    Habitaciones afectadas <span class="red--text">*</span>
                                </template>

                                <template v-slot:selection="{ item, index }">

                                    <span v-if="index === 0">{{ item.nombre }}</span>

                                    <span v-if="index === 1" class="grey--text text-caption">
                                        (+{{ habitacionesSelected.length - 1 }})
                                    </span>
                                </template>

                                <template v-slot:prepend-item>
                                    <v-list-item ripple @mousedown.prevent @click="toggleSelect('create')">
                                        <v-list-item-action>
                                            <v-icon :color="habitacionesSelected.length > 0 ? 'indigo darken-4' : ''">
                                                {{ icon }}
                                            </v-icon>
                                        </v-list-item-action>

                                        <v-list-item-content>
                                            <v-list-item-title>
                                                Selecionar Todas
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-divider class="mt-2"></v-divider>
                                </template>
                            </v-select>
                        </v-col>

                    </v-row>

                    <div class="buttons">
                        <v-btn @click="dialogCreate = false" color="blue">
                            cancelar
                        </v-btn>
                        <v-btn :disabled="!validCreate" :loading="loadingbtn" type="submit" class="light-green black--text">
                            crear
                        </v-btn>
                    </div>

                </v-form>
            </v-card>
        </v-dialog>

        <v-dialog :value="dialogUpdate" width="90%" max-width="600px" persistent>
            <v-card class="pa-5">
                <v-toolbar elevation="0">
                    <v-spacer />
                    <v-btn icon class="ml-3" @click="dialogUpdate = false">
                        <v-icon>mdi-close-box</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-form ref="formUpdate" v-model="validUpdate" @submit.prevent="actualizar">
                    <v-row>

                        <v-col cols="12" md="6" sm="6">
                            <v-text-field v-model="nombreUpdate" :rules="[rules.required]" outlined required>

                                <template v-slot:label>
                                    Nombre <span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12" md="6" sm="6">
                            <v-text-field v-model="diasEstanciaUpdate" :rules="[rules.required]" type="number"
                                hide-spin-buttons outlined required>

                                <template v-slot:label>
                                    Dias Minimos De La Estancia <span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12" md="6" sm="6">
                            <v-select v-model="tipoUpdate" :items="tipos" :rules="[rules.required]" item-text="tipo"
                                item-value="id" outlined required>

                                <template v-slot:label>
                                    Tipo <span class="red--text">*</span>
                                </template>
                            </v-select>
                        </v-col>

                        <v-col cols="12" md="6" sm="6">

                            <v-slider v-if="tipoUpdate == 1" v-model="descuentoUpdate" max="100" min="0"
                                label="Descuento" thumb-label="always">
                                <template v-slot:thumb-label="{ value }">
                                    {{ value }}%
                                </template>
                            </v-slider>

                            <v-text-field v-if="tipoUpdate == 2" v-model="descuentoUpdate" v-price
                                :rules="[rules.required]" @input="formatNumber('descuentoUpdate', descuentoUpdate)"
                                outlined required>

                                <template v-slot:label>
                                    Descuento <span class="red--text">*</span>
                                </template>
                            </v-text-field>

                        </v-col>

                        <v-col cols="12" md="6" sm="6">
                            <v-select v-model="habitacionesSelectedUpdate" :items="habitaciones"
                                :rules="[rules.arrayRequired]" item-text="nombre" return-object multiple outlined
                                required>

                                <template v-slot:label>
                                    Habitaciones afectadas <span class="red--text">*</span>
                                </template>

                                <template v-slot:selection="{ item, index }">

                                    <span v-if="index === 0">{{ item.nombre }}</span>

                                    <span v-if="index === 1" class="grey--text text-caption">
                                        (+{{ habitacionesSelectedUpdate.length - 1 }})
                                    </span>
                                </template>

                                <template v-slot:prepend-item>
                                    <v-list-item ripple @mousedown.prevent @click="toggleSelect('update')">
                                        <v-list-item-action>
                                            <v-icon
                                                :color="habitacionesSelectedUpdate.length > 0 ? 'indigo darken-4' : ''">
                                                {{ iconUpdate }}
                                            </v-icon>
                                        </v-list-item-action>

                                        <v-list-item-content>
                                            <v-list-item-title>
                                                Selecionar Todas
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-divider class="mt-2"></v-divider>
                                </template>
                            </v-select>
                        </v-col>

                        <v-col cols="12" md="6" sm="6">
                            <div class="flex">
                                <p>
                                    Activo
                                </p>
                                <v-switch v-model="activo" :label="activo ? 'Si' : 'No'" inset></v-switch>
                            </div>
                        </v-col>

                    </v-row>

                    <div class="buttons">
                        <v-btn @click="dialogUpdate = false" color="blue">
                            cancelar
                        </v-btn>
                        <v-btn :disabled="!validUpdate" type="submit" :loading="loadingbtn" class="light-green black--text">
                            actualizar
                        </v-btn>
                    </div>

                </v-form>
            </v-card>
        </v-dialog>

        <v-dialog :value="dialogDelete" width="90%" max-width="600px" persistent>
            <v-card class="pb-5">
                <v-toolbar elevation="0">
                    <v-spacer />
                    <v-btn icon class="ml-3" @click="dialogDelete = false">
                        <v-icon>mdi-close-box</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-sheet class="d-flex justify-center align-center flex-column">
                    <h3 class="mb-5">
                        Eliminar el descuento {{ discount.nombre }}?
                    </h3>
                    <div class="buttons">
                        <v-btn @click="dialogDelete = false" color="error" class="white--text text--accent-4">
                            cancelar
                        </v-btn>
                        <v-btn @click="eliminar" :loading="loadingbtn" color="primary">
                            eliminar
                        </v-btn>
                    </div>
                </v-sheet>
            </v-card>
        </v-dialog>

    </v-card>
</template>

<script>

import vuex from "@/store"
import Swal from 'sweetalert2'
import service from '@/services/service'

export default {
    name: 'DescuentoEstadiaApp',
    computed: {
        selectAllRooms() {
            return this.habitacionesSelected.length === this.habitaciones.length
        },
        selectSomeRooms() {
            return this.habitacionesSelected.length > 0 && !this.selectAllRooms
        },
        icon() {
            if (this.selectAllRooms) return 'mdi-close-box'
            if (this.selectSomeRooms) return 'mdi-minus-box'
            return 'mdi-checkbox-blank-outline'
        },
        selectAllRoomsUpdate() {
            return this.habitacionesSelectedUpdate.length === this.habitaciones.length
        },
        selectSomeRoomsUpdate() {
            return this.habitacionesSelectedUpdate.length > 0 && !this.selectAllRoomsUpdate
        },
        iconUpdate() {
            if (this.selectAllRoomsUpdate) return 'mdi-close-box'
            if (this.selectSomeRoomsUpdate) return 'mdi-minus-box'
            return 'mdi-checkbox-blank-outline'
        },
    },
    watch: {
        discount: {
            // Función que se ejecuta cuando hay cambios en descuento
            handler(newItem) {
                if ('id' in newItem) {
                    this.nombreUpdate = newItem.nombre
                    this.diasEstanciaUpdate = newItem.dias
                    this.tipoUpdate = newItem.tipoId
                    this.descuentoUpdate = this.comaEnMiles(newItem.descuento)
                    this.habitacionesSelectedUpdate = newItem.habitaciones
                    this.activo = newItem.activo
                }
            },
            // Immediate: true indica que se ejecutará el handler inmediatamente después de registrar el watcher
            immediate: true
        },
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
            nombre: '',
            diasEstancia: 1,
            descuento: '',
            tipo: 1,
            habitacionesSelected: '',
            nombreUpdate: '',
            diasEstanciaUpdate: '',
            descuentoUpdate: '',
            activo: '',
            habitacionesSelectedUpdate: '',
            tipoUpdate: '',
            loading: false,
            loadingbtn: false,
            dialogCreate: false,
            dialogUpdate: false,
            dialogDelete: false,
            validCreate: false,
            validUpdate: false,
            discount: {},
            descuentos: [],
            habitaciones: [],
            tipos: [],
            headers: [
                { text: '', key: 'actions', sortable: false },
                { text: 'Nombre', key: 'nombre', value: 'nombre' },
                { text: 'Dias De Estancia', key: 'fechaInicio', value: 'fechaInicio' },
                { text: 'Descuento', key: 'descuento', value: 'descuento' },
                { text: 'Habitaciones', key: 'habitaciones', value: 'habitaciones' },
                { text: 'Activo', key: 'activo', value: 'activo' },
                { text: 'Creado', key: 'created_at', value: 'created_at' },
            ],
            rules: {
                required: value => !!value || 'Campo requerido.',
                arrayRequired: value => !!value.length || 'Mínimo uno selecionado.',
            },
        }
    },
    methods: {
        crear() {
            this.loadingbtn = true

            if (typeof (this.descuento) == 'string') {
                this.descuento = parseInt(this.descuento.replace(/\./g, ''))
            }

            let data = {
                nombre: this.nombre,
                dias: this.diasEstancia,
                descuento: this.descuento,
                habitaciones: this.habitacionesSelected,
                tipo: this.tipo,
                user: vuex.state.user.id,
            }

            // Llama al servicio para crear un nuevo descuento
            service.crearDescuentoEstadia(data)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogCreate = false

                    this.getDescuentos() // Actualiza la lista de descuentos después de crear un nuevo

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
                    console.error(err)
                })
        },
        /**
         * Obtiene la lista de descuentos.
         */
        getDescuentos() {
            this.loading = true
            this.discount = {}

            // Llama al servicio para obtener la lista de descuentos
            service.obtenerDescuentosEstadia()
                .then(res => {
                    this.loading = false
                    this.descuentos = res
                })
                .catch(err => {
                    this.loading = false
                    console.error(err)
                })
        },
        /**
         * Actualiza un descuento existente.
         */
        actualizar() {
            this.loadingbtn = true

            if (typeof (this.descuentoUpdate) == 'string') {
                this.descuentoUpdate = parseInt(this.descuentoUpdate.replace(/\./g, ''))
            }

            // Prepara los datos para enviar al servidor
            let data = {
                nombre: this.nombreUpdate,
                dias: this.diasEstanciaUpdate,
                descuento: this.descuentoUpdate,
                activo: this.activo,
                habitaciones: this.habitacionesSelectedUpdate.map(item => item.id),
                tipo: this.tipoUpdate,
                user: vuex.state.user.id,
            }

            // Llama al servicio para actualizar un descuento existente
            service.actualizarDescuentoEstadia(data, this.discount.id)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogUpdate = false

                    this.getDescuentos() // Actualiza la lista de descuentos después de la actualización

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
                    console.error(err)
                })
        },
        /**
         * Elimina un descuento.
         */
        eliminar() {
            this.loadingbtn = true

            // Llama al servicio para eliminar un descuento
            service.eliminarDescuentoEstadia(this.discount.id)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogDelete = false

                    this.getDescuentos() // Actualiza la lista de descuentos después de la eliminación

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
                    console.error(err)
                })
        },
        /**
         * Formatea un número agregando comas para separar miles y acepta decimales.
         * @param {number} numero - Número que se formateará.
         * @returns {string} Número formateado con comas.
         */
        comaEnMiles(numero) {
            // Convertir el número a cadena y dividir la parte entera de la parte decimal
            let partes = numero.toString().split(',');

            // Expresión regular para agregar comas a la parte entera
            let expParteEntera = /(\d)(?=(\d{3})+(?!\d))/g;
            let repParteEntera = '$1.';

            // Formatear la parte entera y agregar la parte decimal si existe
            let parteEnteraFormateada = partes[0].replace(expParteEntera, repParteEntera);
            let resultado = partes.length === 2 ? parteEnteraFormateada + ',' + partes[1] : parteEnteraFormateada;

            return resultado;
        },
        /**
         * Formatea el número de un día de la semana agregando comas para separar miles.
         * @param {object} precio - Objeto que representa un día de la semana con un precio.
         */
        formatNumber(value, precio) {
            let formattedNumber = precio.replace(/\D/g, '') // Elimina caracteres no numéricos del precio
            this[value] = this.comaEnMiles(formattedNumber) // Formatea el número con comas
        },
        /**
         * Invoca el método 'save' del componente referenciado por 'menu'.
         * @param {string} menu - Nombre del menú referenciado.
         * @param {Date} date - Fecha que se pasa al método 'save'.
         */
        save(menu, date) {
            this.$refs[menu].save(date)
        },
        toggleSelect(metodo) {
            this.$nextTick(() => {
                if (metodo == 'create') {
                    if (this.selectAllRooms) {
                        this.habitacionesSelected = []
                    } else {
                        this.habitacionesSelected = this.habitaciones.map(habitacion => habitacion.id)
                    }
                } else if (metodo == 'update') {
                    if (this.selectAllRoomsUpdate) {
                        this.habitacionesSelectedUpdate = []
                    } else {
                        this.habitacionesSelectedUpdate = this.habitaciones
                    }
                }
            })
        },
        listHabitaciones(array) {
            return array.map(item => item.nombre).join(', ')
        },
        getDatos() {
            service.obtenerTiposDescuento()
                .then(res => {
                    this.tipos = res
                })
                .catch(err => {
                    console.error(err)
                })

            service.obtenerRoomsDescuento()
                .then(res => {
                    this.habitaciones = res
                })
                .catch(err => {
                    console.error(err)
                })
        },
    },
    mounted() {
        this.getDescuentos()
        this.getDatos()
    },
}
</script>

<style scoped>
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