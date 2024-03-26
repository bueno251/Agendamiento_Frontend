<template>
    <v-card width="90%" elevation="5">
        <v-card-title class="blue lighten-2 white--text">
            Reservas
        </v-card-title>
        <template v-if="loadingcard">
            <div class="text-center my-5 w-100">
                <v-progress-circular class="text-center" color="primary" indeterminate></v-progress-circular>
            </div>
        </template>
        <v-container fluid v-else>
            <v-row class="ma-0">

                <v-col cols="12" md="3" sm="6">
                    <label>Edad de los Niños para pagar <span class="red--text">*</span></label>
                    <v-text-field v-model="edadNiños" :rules="[rules.required]" type="number" hide-spin-buttons dense
                        outlined required>
                    </v-text-field>
                </v-col>

                <v-col cols="12" md="3" sm="6">
                    <div class="flex">
                        <p>
                            Usuario puede reservar?
                        </p>
                        <v-switch v-model="canReservar" :label="canReservar ? 'Si' : 'No'" inset></v-switch>
                    </div>
                </v-col>

                <v-col cols="12" md="3" sm="6">
                    <div class="flex">
                        <p>
                            Correo obligatorio para el pago?
                        </p>
                        <v-switch v-model="correoRequired" :label="correoRequired ? 'Si' : 'No'" inset></v-switch>
                    </div>
                </v-col>

                <v-col cols="12" md="3" sm="6">
                    <div class="flex">
                        <p>
                            Usar tarifas generales?
                        </p>
                        <v-switch v-model="tarifasGenerales" :label="tarifasGenerales ? 'Si' : 'No'" inset></v-switch>
                    </div>
                </v-col>

                <v-col cols="12" md="3" sm="6">
                    <div class="flex">
                        <p class="px-2">
                            Porcentaje de separación de la reserva: {{ porcentSeparacion }} %
                        </p>
                        <v-text-field v-model="porcentSeparacion" type="number" min="0" max="100" hide-spin-buttons
                            outlined hide-details dense required>
                        </v-text-field>
                    </div>
                    <v-slider v-model="porcentSeparacion" max="100" min="0" thumb-label dense hide-details></v-slider>
                </v-col>

                <v-col v-if="tarifasGenerales" cols="12" md="3" sm="6">
                    <div class="d-flex c-100 align-center">
                        <v-btn color="primary" @click="tarifasGeneralesDialog = true">
                            Tarifas Generales
                        </v-btn>
                    </div>
                </v-col>
            </v-row>

            <div class="buttons mt-5">
                <v-btn @click="save" :loading="loading" color="primary">
                    guardar
                </v-btn>
            </div>
        </v-container>

        <v-dialog :value="tarifasGeneralesDialog" width="90%" max-width="500px" persistent>
            <v-card class="pa-5">
                <v-form v-model="valid" @submit.prevent="saveTarifas()">
                    <v-row>

                        <v-col cols="12">
                            <v-text-field v-model="Adicional" v-price :rules="[rules.required, rules.numerico]"
                                @input="formatNumber('Adicional', Adicional)" outlined required>

                                <template v-slot:label>
                                    Tarifa Persona <span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-text-field v-model="Niños" v-price :rules="[rules.required, rules.numerico]"
                                @input="formatNumber('Niños', Niños)" outlined required>

                                <template v-slot:label>
                                    Tarifa Niños <span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12" md="6" sm="6">
                            <div class="flex">
                                <p>
                                    Tienen Un Impuesto?
                                </p>
                                <v-switch v-model="tieneIva" :label="tieneIva ? 'Si' : 'No'" inset></v-switch>
                            </div>
                        </v-col>

                        <v-col v-if="tieneIva" cols="12" md="6" sm="6">
                            <v-select v-model="impuesto" :items="impuestos" :rules="[rules.required]"
                                :item-text="item => `${item.codigo} (${item.tasa}%)`" item-value="id" outlined required>

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
                    </v-row>

                    <div class="buttons pt-5">
                        <v-btn @click="tarifasGeneralesDialog = false" color="blue">cancelar</v-btn>
                        <v-btn :disabled="!valid" type="submit" :loading="loadingbtn"
                            color="light-green">guardar</v-btn>
                    </div>
                </v-form>
            </v-card>
        </v-dialog>

        <createImpuesto :show="createImpuestoDialog" @close="createImpuestoDialog = false" @update="getImpuestos" />

    </v-card>
</template>

<script>

import Swal from 'sweetalert2'
import service from '@/services/service'
import createImpuesto from '@/modules/impuestos/components/createImpuesto'

export default {
    name: 'reservaConfig',
    components: {
        createImpuesto,
    },
    props: {
        config: Object,
    },
    watch: {
        config: {
            handler(newItem) {
                if ('id' in newItem) {
                    this.canReservar = newItem.usuarioReserva
                    this.correoRequired = newItem.correoObligatorio
                    this.porcentSeparacion = newItem.porcentajeSeparacion
                    this.tarifasGenerales = newItem.tarifasGenerales
                    this.edadNiños = newItem.edadTarifaNiños
                    this.loadingcard = false
                }
            },
            immediate: true,
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
            Adicional: '',
            Niños: '',
            impuesto: '',
            porcentSeparacion: 0,
            edadNiños: 2,
            canReservar: true,
            correoRequired: true,
            tarifasGenerales: false,
            loading: false,
            loadingcard: true,
            loadingbtn: false,
            tarifasGeneralesDialog: false,
            createImpuestoDialog: false,
            tieneIva: false,
            valid: false,
            impuestos: [],
            tarifas: [
                'Adicional',
                'Niños',
            ],
            rules: {
                required: value => !!value || 'Campo requerido.',
                numerico: value => /^[0-9.]+$/.test(value) || "Solo se admiten números y puntos."
            },
        }
    },
    methods: {
        /**
         * Guarda la configuración de reserva, indicando si los usuarios pueden o no realizar reservas.
         */
        save() {
            this.loading = true

            // Objeto de datos que se enviará al servicio para actualizar la configuración de reserva
            let data = {
                configuracionId: this.config.id,
                reservar: this.canReservar,
                correo: this.correoRequired,
                tarifasGenerales: this.tarifasGenerales,
                porcentaje: this.porcentSeparacion,
                edadTarifaNiños: this.edadNiños,
            }

            // Llama al servicio para actualizar la configuración de reserva
            service.guardarConfigReserva(data)
                .then(res => {
                    this.loading = false
                    this.$emit('update') // Emite un evento para informar a componentes padre sobre la actualización
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
         * Guarda las tarifas generales y muestra un mensaje de éxito o error.
         */
        saveTarifas() {
            // Establece la variable de carga como verdadera para mostrar el estado de carga
            this.loadingbtn = true

            // Crea un nuevo array de tarifas con los nombres y precios correspondientes
            let tarifas = this.tarifas.map(nombre => ({ nombre: nombre, precio: parseInt(this[nombre].replace(/\./g, '')) }));

            // Prepara los datos para guardar las tarifas generales
            let data = {
                tieneIva: this.tieneIva,
                impuesto: this.impuesto,
                tarifas: tarifas,
            }

            // Llama al servicio para guardar las tarifas generales
            service.guardarTarifasGenerales(data)
                .then(res => {
                    // Oculta el diálogo de tarifas generales y establece la variable de carga como falsa
                    this.tarifasGeneralesDialog = false
                    this.loadingbtn = false

                    // Muestra un mensaje de éxito
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })
                })
                .catch(err => {
                    // Establece la variable de carga como falsa
                    this.loadingbtn = false

                    // Muestra un mensaje de error con el mensaje proporcionado por el servidor
                    Swal.fire({
                        icon: 'error',
                        text: err.response.data.message,
                    })

                    // Registra el error en la consola
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
         * Obtiene la lista de impuestos del servicio y asigna los resultados a la propiedad 'impuestos'.
         */
        getImpuestos() {
            // Llama al servicio para obtener la lista de impuestos
            service.obtenerImpuestos()
                .then(res => {
                    // Asigna los impuestos obtenidos a la propiedad 'impuestos'
                    this.impuestos = res
                })
                .catch(err => {
                    // Maneja el error imprimiendo un mensaje en la consola
                    console.error(err)
                })
        },
        /**
         * Obtiene las tarifas generales del servicio y asigna los resultados a las propiedades correspondientes.
         * @function getTarifasGenerales
         * @memberof NombreDeLaClase
         * @returns {void}
         */
        getTarifasGenerales() {
            // Llama al servicio para obtener las tarifas generales
            service.obtenerTarifasGenerales()
                .then(res => {
                    // Mapea las tarifas obtenidas para procesarlas
                    res.map((day) => {
                        // Verifica si la tarifa es 'Adicional' o 'Niños'
                        if (day.nombre == 'Adicional' || day.nombre == 'Niños') {
                            // Asigna el precio formateado a la propiedad correspondiente, utilizando comaEnMiles para formatear el número
                            this[day.nombre] = this.comaEnMiles(day.precio)

                            // Verifica si la tarifa tiene un impuesto asociado
                            if (day.impuestoId) {
                                // Asigna el ID del impuesto y establece la propiedad 'tieneIva' como verdadera
                                this.impuesto = day.impuestoId
                                this.tieneIva = true
                            }
                        }
                    })
                })
                .catch(err => {
                    // Maneja el error imprimiendo un mensaje en la consola
                    console.error(err)
                })
        },
    },
    mounted() {
        this.getImpuestos()
        this.getTarifasGenerales()
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

p {
    padding: 0;
    margin: 0;
    text-wrap: balance;
}
</style>