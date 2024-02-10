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
                        <label>Correo <span class="red--text">*</span></label>
                        <v-text-field v-model="correo" :rules="[rules.required, rules.email]" type="email" dense outlined
                            required>
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
                    {{ reserva.room.nombre }} (x{{ reserva.cantidadRooms }})
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
                    $ {{ comaEnMiles(reserva.precio) }} COP
                </strong>
            </h2>
        </v-card>

        <v-card class="pa-5 column2" elevation="5">
            <v-form ref="formPagos" v-model="validPagos" @submit.prevent="reservar()">
                <v-row>
                    <v-col cols="12" v-if="formasPago.length > 1">
                        <label>Selecciona un método de pago <span class="red--text">*</span></label>
                        <v-select v-model="metodoPago" :items="formasPago" no-data-text="No hay formas de pago validas"
                            :rules="[rules.required]" item-text="tipo" item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                    <template v-if="metodoPago == '1'">
                        <v-col cols="12">
                            <label>Número para transacciones: 123456789</label>
                        </v-col>

                        <v-col cols="12" md="6">
                            <label>Monto <span class="red--text">*</span></label>
                            <v-text-field v-model="monto" :rules="[rules.required]" v-price dense outlined required>
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

export default {
    name: 'DialogUpdate',
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
            file: null,
            formasPago: [],
            rules: {
                required: value => !!value || 'Campo requerido.',
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Correo inválido.'
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

                    return true;
                },
            },
        }
    },
    methods: {
        reservar() {

            this.loading = true

            let data = {
                cedula: this.cedula,
                nombre: this.nombre,
                apellido: this.apellido,
                correo: this.correo,
                telefono: this.telefono,
                verificacion_pago: this.metodoPago == 1 ? 0 : 1,
            }

            data = { ...this.reserva, ...data }

            data.room = data.room.id

            reservaService.reservar(data)
                .then(res => {
                    this.loading = false
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })
                        .then(this.$router.back())
                })
                .catch(err => {
                    console.log(err)
                    this.loading = false
                })
        },
        comaEnMiles(numero) {
            let exp = /(\d)(?=(\d{3})+(?!\d))/g //* expresion regular que busca tres digitos
            let rep = '$1.' //parametro especial para splice porque los numeros no son menores a 100
            return numero.toString().replace(exp, rep)
        },
        getMetodosPago() {
            reservaService.obtenerFormasPago()
                .then(res => {
                    this.formasPago = res
                })
                .catch(err => {
                    console.log(err)
                })
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
    mounted() {
        this.getMetodosPago()
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