<template>
    <v-card width="90%" elevation="5">
        <v-card-title class="blue lighten-2 white--text">
            Reservas
        </v-card-title>
        <v-container fluid>
            <v-row class="ma-0">
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
                                <v-switch v-model="hasIva" :label="hasIva ? 'Si' : 'No'" inset></v-switch>
                            </div>
                        </v-col>

                        <v-col v-if="hasIva" cols="12" md="6" sm="6">
                            <v-select v-model="impuesto" :items="impuestos" :rules="[rules.required]"
                                :item-text="item => `${item.codigo} (${item.tasa}%)`" item-value="id" outlined required>

                                <template v-slot:label>
                                    Impuesto <span class="red--text">*</span>
                                </template>

                                <template v-slot:append-outer>
                                    <v-btn icon @click="createImpuestoDialog = true">
                                        <v-icon>
                                            mdi-plus-circle
                                        </v-icon>
                                    </v-btn>
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
            canReservar: true,
            correoRequired: true,
            tarifasGenerales: false,
            loading: false,
            tarifasGeneralesDialog: false,
            createImpuestoDialog: false,
            hasIva: false,
            valid: false,
            loadingbtn: false,
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
        saveTarifas() {
            this.loadingbtn = true

            let tarifas = this.tarifas.map(nombre => ({ nombre: nombre, precio: parseInt(this[nombre].replace(/\./g, '')) }));

            let data = {
                hasIva: this.hasIva,
                impuesto: this.impuesto,
                tarifas: tarifas,
            }

            service.guardarTarifasGenerales(data)
                .then(res => {
                    this.tarifasGeneralesDialog = false
                    this.loadingbtn = false
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
        getImpuestos() {
            service.obtenerImpuestos()
                .then(res => {
                    this.impuestos = res
                })
                .catch(err => {
                    console.error(err)
                })
        },
        getTarifasGenerales() {
            service.obtenerTarifasGenerales()
                .then(res => {
                    res.map((day) => {
                        if (day.nombre == 'Adicional' || day.nombre == 'Niños') {
                            this[day.nombre] = this.comaEnMiles(day.precio)
                            if (day.impuestoId) {
                                this.impuesto = day.impuestoId
                                this.hasIva = true
                            }
                        }
                    })
                })
                .catch(err => {
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