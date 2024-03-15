<template>
    <v-dialog :value="show" width="90%" persistent>

        <v-card elevation="5">
            <v-toolbar elevation="0">
                <v-toolbar-title>Tarifas Especiales</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon class="ml-3" @click="$emit('close')"><v-icon>mdi-close-box</v-icon></v-btn>
            </v-toolbar>

            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                    hide-details></v-text-field>
                <v-btn class="mx-5" @click="dialogCreate = true" color="primary">
                    <v-icon>mdi-plus-circle</v-icon> agregar
                </v-btn>
            </v-card-title>

            <v-data-table :headers="headers" :items="tarifas" :search="search" :loading="loading"
                no-results-text="No hay ningúna tarifa que coincida" no-data-text="No hay tarifas"
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
                                    <v-list-item link @click="tarifaEspecial = item, dialogUpdate = true">
                                        <v-list-item-title v-text="'Ajustes'"></v-list-item-title>
                                    </v-list-item>
                                    <v-list-item link @click="tarifaEspecial = item, dialogDelete = true">
                                        <v-list-item-title v-text="'Eliminar'"></v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                        <td>{{ item.fechaInicio }}</td>
                        <td>{{ item.fechaFin }}</td>
                        <td>${{ comaEnMiles(item.precio) }}</td>
                        <td>${{ comaEnMiles(item.precioConIva) }}</td>
                        <td>{{ item.descripcion }}</td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog :value="dialogCreate" width="90%" max-width="500px" persistent>
            <v-card class="pa-5">
                <v-form ref="formCreate" v-model="validCreate" @submit.prevent="create">
                    <v-row>

                        <v-col cols="12">
                            <v-text-field v-model="precio" :rules="[rules.required]"
                                @input="formatNumber('precio', precio)" v-price outlined required>

                                <template v-slot:label>
                                    Precio <span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>

                        <v-col cols="6">
                            <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false"
                                transition="scale-transition" offset-y min-width="auto">

                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-model="fechas[0]" :rules="[rules.required]"
                                        prepend-inner-icon="mdi-calendar" v-bind="attrs" v-on="on" readonly outlined
                                        required>
                                        <template v-slot:label>
                                            Fecha Inicio <span class="red--text">*</span>
                                        </template>
                                    </v-text-field>
                                </template>

                                <v-date-picker v-model="fechas" :min="hoy" @change="save('menu1', fechas)" locale="es"
                                    range no-title scrollable>
                                </v-date-picker>
                            </v-menu>
                        </v-col>

                        <v-col cols="6">
                            <v-menu ref="menu2" v-model="menu2" :close-on-content-click="false"
                                transition="scale-transition" offset-y min-width="auto">

                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-model="fechas[1]" :rules="[rules.required]"
                                        prepend-inner-icon="mdi-calendar" v-bind="attrs" v-on="on" readonly outlined
                                        required>
                                        <template v-slot:label>
                                            Fecha Fin <span class="red--text">*</span>
                                        </template>
                                    </v-text-field>
                                </template>

                                <v-date-picker v-model="fechas" :min="hoy" @change="save('menu2', fechas)" locale="es"
                                    range no-title scrollable>
                                </v-date-picker>
                            </v-menu>
                        </v-col>

                        <v-col cols="12">
                            <v-textarea :rules="[rules.required]" v-model="descripcion" auto-grow rows="5" dense
                                outlined>

                                <template v-slot:label>
                                    Descripción <span class="red--text">*</span>
                                </template>
                            </v-textarea>
                        </v-col>

                    </v-row>

                    <div class="buttons">
                        <v-btn @click="dialogCreate = false, $refs.formCreate.reset()" color="blue">cancelar</v-btn>
                        <v-btn :disabled="!validCreate" type="submit" :loading="loadingbtn"
                            color="light-green">crear</v-btn>
                    </div>
                </v-form>
            </v-card>
        </v-dialog>

        <v-dialog :value="dialogUpdate" width="90%" max-width="500px" persistent>
            <v-card class="pa-5">
                <v-form ref="formUpdate" v-model="validUpdate" @submit.prevent="update">
                    <v-row>

                        <v-col cols="12">
                            <v-text-field v-model="precioUpd" :rules="[rules.required]"
                                @input="formatNumber('precio', precio)" v-price outlined required>

                                <template v-slot:label>
                                    Precio <span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>

                        <v-col cols="6">
                            <v-menu ref="menu3" v-model="menu3" :close-on-content-click="false"
                                transition="scale-transition" offset-y min-width="auto">

                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-model="fechasUpd[0]" :rules="[rules.required]"
                                        prepend-inner-icon="mdi-calendar" v-bind="attrs" v-on="on" readonly outlined
                                        required>
                                        <template v-slot:label>
                                            Fecha Inicio <span class="red--text">*</span>
                                        </template>
                                    </v-text-field>
                                </template>

                                <v-date-picker v-model="fechasUpd" :min="hoy" @change="save('menu3', fechasUpd)"
                                    locale="es" range no-title scrollable>
                                </v-date-picker>
                            </v-menu>
                        </v-col>

                        <v-col cols="6">
                            <v-menu ref="menu4" v-model="menu4" :close-on-content-click="false"
                                transition="scale-transition" offset-y min-width="auto">

                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-model="fechasUpd[1]" :rules="[rules.required]"
                                        prepend-inner-icon="mdi-calendar" v-bind="attrs" v-on="on" readonly outlined
                                        required>
                                        <template v-slot:label>
                                            Fecha Fin <span class="red--text">*</span>
                                        </template>
                                    </v-text-field>
                                </template>

                                <v-date-picker v-model="fechasUpd" :min="hoy" @change="save('menu4', fechasUpd)"
                                    locale="es" range no-title scrollable>
                                </v-date-picker>
                            </v-menu>
                        </v-col>

                        <v-col cols="12">
                            <v-textarea :rules="[rules.required]" v-model="descripcionUpd" auto-grow rows="5" dense
                                outlined>

                                <template v-slot:label>
                                    Descripción <span class="red--text">*</span>
                                </template>
                            </v-textarea>
                        </v-col>

                    </v-row>

                    <div class="buttons">
                        <v-btn @click="dialogUpdate = false" color="blue">cancelar</v-btn>
                        <v-btn :disabled="!validUpdate" type="submit" :loading="loadingbtn"
                            color="light-green">actualizar</v-btn>
                    </div>
                </v-form>
            </v-card>
        </v-dialog>

        <v-dialog :value="dialogDelete" width="90%" max-width="500px" persistent>
            <v-card>
                <v-sheet class="d-flex justify-center align-center flex-column pa-5">
                    <h3>Eliminar la tarifa del {{ tarifaEspecial.fecha }}?</h3>
                    <div class="buttons">
                        <v-btn @click="dialogDelete = false" color="error"
                            class="white--text text--accent-4">cancelar</v-btn>
                        <v-btn @click="deleted" :loading="loadingbtn" color="primary">eliminar</v-btn>
                    </div>
                </v-sheet>
            </v-card>
        </v-dialog>

    </v-dialog>
</template>

<script>

import Swal from 'sweetalert2'
import service from '@/services/service'

export default {
    name: 'tarifasEspeciales',
    props: {
        show: Boolean,
        room: Object,
    },
    computed: {
        fechaInicio() {
            return this.fechas[0] || ''
        },
        fechaFinal() {
            return this.fechas[1] || ''
        },
        fechaInicioUpd() {
            return this.fechasUpd[0] || ''
        },
        fechaFinalUpd() {
            return this.fechasUpd[1] || ''
        },
    },
    watch: {
        tarifaEspecial: {
            handler(newItem) {
                if ('id' in newItem) {
                    this.precioUpd = this.comaEnMiles(newItem.precio)
                    this.fechasUpd[0] = newItem.fechaInicio
                    this.fechasUpd[1] = newItem.fechaFin
                    this.descripcionUpd = newItem.descripcion
                }
            },
            immediate: true,
        },
        room: {
            handler(newItem) {
                if ('id' in newItem) {
                    this.get()
                }
            },
            immediate: true,
        },
        fechaFinal: function () {
            if (this.fechas.length > 1) {
                let fecha1 = new Date(this.fechas[0])
                let fecha2 = new Date(this.fechas[1])

                // Ajusta la fecha de salida si es igual a la fecha de llegada
                if (fecha1.toISOString().slice(0, 10) === fecha2.toISOString().slice(0, 10)) {
                    fecha2.setDate(fecha2.getDate() + 1)
                    this.fechas[1] = fecha2.toISOString().slice(0, 10)
                }

                // Ordena las fechas de llegada y salida
                let sortfechas = this.fechas.toSorted()
                this.fechas = sortfechas
            }
        },
        fechaFinalUpd: function () {
            if (this.fechasUpd.length > 1) {
                let fecha1 = new Date(this.fechasUpd[0])
                let fecha2 = new Date(this.fechasUpd[1])

                // Ajusta la fecha de salida si es igual a la fecha de llegada
                if (fecha1.toISOString().slice(0, 10) === fecha2.toISOString().slice(0, 10)) {
                    fecha2.setDate(fecha2.getDate() + 1)
                    this.fechasUpd[1] = fecha2.toISOString().slice(0, 10)
                }

                // Ordena las fechasUpd de llegada y salida
                let sortfechasUpd = this.fechasUpd.toSorted()
                this.fechasUpd = sortfechasUpd
            }
        },
    },
    directives: {
        'price': {
            // Se ejecuta al momento de vincular la directiva al elemento del DOM
            bind(el) {
                // Agrega un evento de escucha para el evento de entrada ('input')
                el.addEventListener('input', (event) => {
                    // Obtiene el nuevo valor después de eliminar no dígitos del evento
                    const newValue = event.target.value.replace(/\D/g, '')

                    // Define la expresión regular y el patrón de reemplazo para formatear el número con comas
                    let exp = /(\d)(?=(\d{3})+(?!\d))/g
                    let rep = '$1.'

                    // Aplica el formato al nuevo valor y actualiza el valor del elemento del DOM
                    event.target.value = newValue.toString().replace(exp, rep)
                })
            }
        },
    },
    data() {
        return {
            search: '',
            hoy: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            fechas: [],
            precio: '',
            descripcion: '',
            fechasUpd: [],
            precioUpd: '',
            descripcionUpd: '',
            loading: false,
            loadingbtn: false,
            menu1: false,
            menu2: false,
            menu3: false,
            menu4: false,
            validCreate: false,
            validUpdate: false,
            dialogCreate: false,
            dialogUpdate: false,
            dialogDelete: false,
            tarifas: [],
            tarifaEspecial: {},
            rules: {
                required: value => !!value || 'Campo requerido.',
            },
            headers: [
                { text: '', key: 'actions', sortable: false },
                { text: 'Fecha Inicio', key: 'fechaInicio', value: 'fechaInicio' },
                { text: 'Fecha Final', key: 'fechaFin', value: 'fechaFin' },
                { text: 'Precio', key: 'precio', value: 'precio' },
                { text: 'Precio Con IVA', key: 'precioConIva', value: 'precioConIva' },
                { text: 'Descripción', key: 'descripcion', value: 'descripcion' },
            ],
        }
    },
    methods: {
        create() {
            this.loadingbtn = true

            let data = {
                fechaInicio: this.fechaInicio,
                fechaFin: this.fechaFinal,
                precio: parseInt(this.precio.replace(/\./g, '')),
                descripcion: this.descripcion,
                room: this.room.id,
                impuesto: this.room.impuestoId,
                tieneIva: this.room.tieneIva,
            }

            service.crearTarifaEspecial(data)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogCreate = false
                    this.get()
                    this.$refs.formCreate.reset()
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
        get() {
            this.loading = true

            service.obtenerTarifasEspeciales(this.room.id)
                .then(res => {
                    this.loading = false
                    this.tarifas = res
                })
                .catch(err => {
                    console.error(err)
                    this.loading = false
                })
        },
        update() {
            this.loadingbtn = true

            let data = {
                fechaInicio: this.fechaInicioUpd,
                fechaFin: this.fechasUpd[1],
                precio: parseInt(this.precioUpd.replace(/\./g, '')),
                descripcion: this.descripcionUpd,
            }

            service.actualizarTarifaEspecial(data, this.tarifaEspecial.id)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogUpdate = false
                    this.get()
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
        deleted() {
            this.loadingbtn = true

            service.eliminarTarifaEspecial(this.tarifaEspecial.id)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogDelete = false
                    this.get()
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
            if (precio) {
                let formattedNumber = precio.replace(/\D/g, '') // Elimina caracteres no numéricos del precio
                this[value] = this.comaEnMiles(formattedNumber) // Formatea el número con comas
            }
        },
        /**
         * Invoca el método 'save' del componente referenciado por 'menu'.
         * @param {string} menu - Nombre del menú referenciado.
         * @param {Date} date - Fecha que se pasa al método 'save'.
         */
        save(menu, date) {
            this.$refs[menu].save(date)
        },
    },
}
</script>

<style scoped></style>