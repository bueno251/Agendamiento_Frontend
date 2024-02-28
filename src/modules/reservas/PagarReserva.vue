<template>
    <div class="main">
        <v-card class="pa-5 column2" elevation="5">
            <h2>Información de contacto</h2>
            <v-form v-model="validInfo">
                <v-row>
                    <v-col cols="12" md="6">
                        <label>Cedula <span class="red--text">*</span></label>
                        <v-text-field v-model="cedula" :rules="[rules.required]" dense outlined required>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                        <label>Nombre <span class="red--text">*</span></label>
                        <v-text-field v-model="nombre" :rules="[rules.required]" dense outlined required>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                        <label>Apellido <span class="red--text">*</span></label>
                        <v-text-field v-model="apellido" :rules="[rules.required]" dense outlined required>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                        <label>Correo <span v-if="correoRequired" class="red--text">*</span></label>
                        <v-text-field v-model="correo" :rules="[rules.email]" type="email" :required="correoRequired" dense
                            outlined>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                        <label>Telefono <span class="red--text">*</span></label>
                        <v-text-field v-model="telefono" :rules="[rules.required, rules.phone]" dense outlined required>
                        </v-text-field>
                    </v-col>
                </v-row>
            </v-form>
        </v-card>

        <v-card class="pa-5 d-flex flex-column justify-space-between" elevation="5">
            <div>
                <h3>Información De La Reserva</h3>
                <p>
                    <strong>
                        Habitacion:
                    </strong>
                    {{ reserva.room.nombre }} (x{{ reserva.cantidad_rooms }})
                </p>
                <p>
                    <strong>
                        Llegada:
                    </strong>
                    {{ reserva.dateIn }}
                </p>
                <p>
                    <strong>
                        Salida:
                    </strong>
                    {{ reserva.dateOut }}
                </p>
                <p>
                    <strong>
                        Adultos:
                    </strong>
                    {{ reserva.adultos }}
                </p>
                <p v-if="reserva.niños > 0">
                    <strong>
                        Niños:
                    </strong>
                    {{ reserva.niños }}
                </p>
            </div>
            <h2>
                <strong>
                    $ {{ comaEnMiles(reserva.precio) }} {{ divisa.codigo }}
                </strong>
            </h2>
        </v-card>

        <v-card class="pa-5 column2" elevation="5">
            <v-form ref="formPagos" v-model="validPagos" @submit.prevent="reservar()">
                <v-row>
                    <v-col cols="12" v-if="metodosPago.length > 1">
                        <label>Selecciona un método de pago <span class="red--text">*</span></label>
                        <v-select v-model="metodoPago" :items="metodosPago" no-data-text="No hay metodos de pago validas"
                            :rules="[rules.required]" item-text="nombre" item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                    <template v-if="metodoPago == '1'">
                        <v-col cols="12">
                            <label>Número para transacciones: 123456789</label>
                        </v-col>

                        <v-col cols="12" md="6">
                            <label>Monto <span class="red--text">*</span></label>
                            <v-text-field v-model="monto" :rules="[rules.required]" v-price readonly dense outlined
                                required>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                            <label>Comprobante de pago <span class="red--text">*</span></label>
                            <v-file-input v-model="file" :rules="[rules.file]" :clearable="false" accept="image/*,.pdf"
                                truncate-length="15" chips outlined dense required></v-file-input>
                        </v-col>
                    </template>
                </v-row>

                <div class="buttons">
                    <v-btn @click="$router.back()" color="blue">cancelar</v-btn>
                    <v-btn :disabled="!validPagos || !validInfo" :loading="loading" color="light-green" type="submit">
                        pagar
                    </v-btn>
                </div>
            </v-form>
        </v-card>

        <v-dialog :value="modalTransferencia" width="90%" max-width="500px" persistent>

        </v-dialog>
    </div>
</template>

<script>

import vuex from "@/store"
import Swal from "sweetalert2"
import reservaService from './service/reservaService'
import DivisasService from '@/services/DivisasService'

export default {
    name: 'DialogUpdate',
    directives: {
        'price': {
            // Se ejecuta cuando la directiva es vinculada al elemento
            bind(el) {
                // Agrega un event listener al evento 'input'
                el.addEventListener('input', (event) => {
                    // Obtiene el nuevo valor eliminando cualquier caracter que no sea un dígito
                    const newValue = event.target.value.replace(/\D/g, '')

                    // Expresión regular para agregar puntos como separadores de miles
                    let exp = /(\d)(?=(\d{3})+(?!\d))/g
                    let rep = '$1.'

                    // Asigna el nuevo valor formateado al campo de entrada
                    event.target.value = newValue.toString().replace(exp, rep)
                })
            }
        },
    },
    data() {
        return {
            reserva: vuex.state.reserva,
            cedula: vuex.state.reserva.cedula,
            roomid: vuex.state.reserva.room.id,
            nombre: '',
            apellido: '',
            correo: '',
            telefono: vuex.state.reserva.telefono,
            monto: this.comaEnMiles(vuex.state.reserva.precio),
            metodoPago: 1,
            validPagos: false,
            validInfo: false,
            modalTransferencia: false,
            loading: false,
            correoRequired: true,
            file: null,
            metodosPago: [],
            divisa: {
                codigo: 'COP',
            },
            rules: {
                required: value => !!value || 'Campo requerido.',
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

                    if (this.correoRequired) {
                        return !!value || 'Campo requerido.'
                    }

                    return (pattern.test(value) || !value) || 'Correo inválido.'
                },
                phone: value => {
                    const pattern = /^(\+?[0-9]{1,3}[-.\s]?)?(\([0-9]{1,4}\)|[0-9]{1,4})[-.\s]?[0-9]{1,10}$/
                    return pattern.test(value) || 'Número de teléfono inválido.'
                },
                file: file => {
                    const allowedFormats = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
                    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf'];

                    if (!file) {
                        return 'Campo requerido.'
                    }

                    if (!allowedFormats.includes(file.type) && !allowedExtensions.includes(file.name.slice(-4).toLowerCase())) {
                        return 'El archivo debe ser una imagen (JPEG, PNG, GIF) o un archivo PDF';
                    }

                    return true
                },
            },
        }
    },
    methods: {
        /**
        * Realiza la reserva de una habitación.
        * Se encarga de enviar la información de la reserva al servidor y gestionar la respuesta.
        */
        reservar() {
            this.loading = true

            // Construye el objeto de datos para la reserva
            let data = {
                cedula: this.cedula,
                nombre: this.nombre,
                apellido: this.apellido,
                correo: this.correo,
                telefono: this.telefono,
                verificacion_pago: this.metodoPago == 1 ? 0 : 1,
            }

            // Combina los datos de la reserva con la información del formulario
            data = { ...this.reserva, ...data }

            // Asigna el ID de la habitación seleccionada
            data.room = data.room.id

            // Realiza la llamada al servicio para reservar
            reservaService.reservar(data)
                .then(res => {
                    this.loading = false
                    // Muestra un mensaje de éxito y regresa a la página anterior
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    }).then(this.$router.back())
                })
                .catch(err => {
                    console.log(err)
                    this.loading = false
                })
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
         * Obtiene los métodos de pago disponibles.
         * Realiza una llamada al servicio para obtener las formas de pago y las asigna a la variable metodosPago.
         */
        getMetodosPago() {
            reservaService.obtenerMetodosPago()
                .then(res => {
                    this.metodosPago = res
                })
                .catch(err => {
                    console.log(err)
                })
        },
        getDatos() {
            reservaService.obtenerConfigReserva()
                .then(res => {
                    this.correoRequired = res.correoObligatorio
                })
                .catch(err => {
                    console.log(err)
                })
        },
        getDivisaDefault() {
            DivisasService.obtenerDivisaDefault()
                .then(res => {
                    this.divisa = res
                })
                .catch(err => {
                    console.error(err)
                })
        },
    },
    mounted() {
        this.getDatos()
        this.getMetodosPago()
        this.getDivisaDefault()
    },
}
</script>

<style scoped>
.main {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 15px;
}

.column2 {
    grid-column: span 2;
}

.main .v-card {
    justify-self: center;
    width: 90%;
}

@media only screen and (max-width: 900px) {
    .column2 {
        grid-column: auto;
    }

    .main {
        grid-template-columns: repeat(auto-fill, minmax(90%, 1fr));
    }
}
</style>