<template>
    <div class="contenido">
        <div class="room pa-5">

            <article class="room-info pa-5">
                <h1 class="mb-5">
                    {{ room.nombre }}
                </h1>
                <span>
                    {{ room.tipo }}
                </span>
                <p class="my-10">
                    {{ room.descripcion }}
                </p>
                <span>
                    {{ room.capacidad }} {{ room.capacidad > 1 ? 'Personas' : 'Persona' }}
                </span>

                <h2>
                    $ {{ comaEnMiles(precio) }} COP
                </h2>
            </article>

            <v-divider></v-divider>

            <v-simple-table>
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th>
                                Día
                            </th>
                            <th>
                                Normal
                            </th>
                            <th>
                                Festivos <v-icon class="red--text text-caption">mdi-circle</v-icon>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="day in room.precios" :key="day.name">
                            <td>{{ day.name }}</td>
                            <td>$ {{ comaEnMiles(day.normal) }} COP</td>
                            <td>$ {{ comaEnMiles(day.festivo) }} COP</td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>

        </div>
        <div class="calendar pa-5">
            <v-form v-model="valid" ref="formReservar" @submit.prevent="agendar">
                <v-card class="pa-5 sticky" elevation="5">
                    <v-row>

                        <v-col cols="12">
                            <v-date-picker v-model="dates" :min="hoy" :max="maxDate" :events="festivos"
                                :allowed-dates="allowedDates" :readonly="needPayment || verificacion_pago"
                                event-color="red lighten-1" locale="es" full-width range no-title scrollable>
                            </v-date-picker>
                        </v-col>

                        <v-col cols="6">
                            <label>Fecha De LLegada <span class="red--text">*</span></label>
                            <v-text-field v-model="fechaLlegada" :rules="[rules.required, rules.date]"
                                prepend-inner-icon="mdi-calendar" readonly dense outlined required>
                            </v-text-field>
                        </v-col>

                        <v-col cols="6">
                            <label>Fecha De Salida <span class="red--text">*</span></label>
                            <v-text-field v-model="fechaSalida" :rules="[rules.required, rules.date]"
                                prepend-inner-icon="mdi-calendar" readonly dense outlined required>
                            </v-text-field>
                        </v-col>

                        <v-col cols="6">
                            <label>Desayunos<span class="red--text">*</span></label>
                            <v-select v-model="desayuno" :items="desayunos" no-data-text="No hay desayunos"
                                :rules="[rules.required]" :readonly="needPayment" item-text="desayuno" item-value="id" dense
                                outlined>
                            </v-select>
                        </v-col>

                        <v-col cols="6">
                            <label>Decoraciones<span class="red--text">*</span></label>
                            <v-select v-model="decoracion" :items="decoraciones" no-data-text="No hay decoraciones"
                                :rules="[rules.required]" :readonly="needPayment" item-text="decoracion" item-value="id"
                                dense outlined>
                            </v-select>
                        </v-col>

                    </v-row>

                    <div class="buttons mt-5">

                        <v-menu v-model="menu" :close-on-content-click="false" transition="fade-transition" left offset-y
                            min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn color="primary" v-bind="attrs" v-on="on">
                                    Huespedes
                                </v-btn>
                            </template>
                            <v-card class="pa-5">
                                <v-form ref="form" v-model="valid" @submit.prevent="crear">
                                    <v-row>

                                        <v-col cols="12">
                                            <div class="d-flex justify-space-between align-center">
                                                <label>Adultos</label>
                                                <div>
                                                    <v-btn icon @click="adultos--"
                                                        :disabled="adultos <= 1 || needPayment || verificacion_pago">
                                                        <v-icon>
                                                            mdi-minus-circle
                                                        </v-icon>
                                                    </v-btn>
                                                    <span>
                                                        {{ adultos }}
                                                    </span>
                                                    <v-btn icon @click="adultos++"
                                                        :disabled="huespedes == room.capacidad || needPayment || verificacion_pago">
                                                        <v-icon>
                                                            mdi-plus-circle
                                                        </v-icon>
                                                    </v-btn>
                                                </div>
                                            </div>
                                        </v-col>

                                        <v-col cols="12">
                                            <div class="d-flex justify-space-between align-center">
                                                <label>Niños</label>
                                                <div>
                                                    <v-btn icon @click="niños--"
                                                        :disabled="niños <= 0 || needPayment || verificacion_pago">
                                                        <v-icon>
                                                            mdi-minus-circle
                                                        </v-icon>
                                                    </v-btn>
                                                    {{ niños }}
                                                    <v-btn icon @click="niños++"
                                                        :disabled="huespedes == room.capacidad || needPayment || verificacion_pago">
                                                        <v-icon>
                                                            mdi-plus-circle
                                                        </v-icon>
                                                    </v-btn>
                                                </div>
                                            </div>
                                        </v-col>

                                    </v-row>
                                </v-form>
                            </v-card>
                        </v-menu>

                        <v-btn v-if="!verificacion_pago" :disabled="!valid" :color="needPayment ? 'light-green' : 'primary'"
                            type="submit">
                            {{ needPayment ? 'Pagar' : 'Reservar' }}
                        </v-btn>
                    </div>
                </v-card>
            </v-form>
        </div>

        <v-dialog :value="showFormasPago" width="90%" max-width="500px" persistent>
            <v-card class="pa-5">
                <v-form ref="formPagos" v-model="validPagos" @submit.prevent="pagar()">
                    <v-row>
                        <v-col cols="12">
                            <label>Selecciona un método de pago <span class="red--text">*</span></label>
                            <v-select v-model="metodoPago" :items="formasPago" no-data-text="No hay formas de pago validas"
                                :rules="[rules.required]" item-text="tipo" item-value="id" outlined dense required>
                            </v-select>
                        </v-col>

                        <template v-if="metodoPago == '1'">
                            <v-col cols="12">
                                <label>Número para transacciones: 123456789</label>

                            </v-col>

                            <v-col cols="12">
                                <label>Comprobante de pago <span class="red--text">*</span></label>
                                <v-file-input v-model="file" :rules="[rules.file]" :clearable="false" accept="image/*,.pdf"
                                    truncate-length="15" chips outlined dense required></v-file-input>
                            </v-col>
                        </template>
                    </v-row>

                    <div class="buttons">
                        <v-btn @click="showFormasPago = false" color="red">cancelar</v-btn>
                        <v-btn :disabled="!validPagos" :loading="loading" color="light-green" type="submit">
                            pagar
                        </v-btn>
                    </div>
                </v-form>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

import vuex from "@/store";
import Swal from "sweetalert2"
import colombiaHolidays from 'colombia-holidays'
import reservaService from './service/reservaService'

export default {
    name: 'RoomInfo',
    data() {
        return {
            cedula: '',
            telefono: '',
            metodoPago: '',
            desayuno: '',
            decoracion: '',
            maxDate: '',
            adultos: 1,
            niños: 0,
            abono: 0,
            menu: false,
            valid: false,
            validPagos: false,
            showFormasPago: false,
            verificacion_pago: false,
            loading: false,
            needPayment: false,
            file: null,
            reservaId: null,
            dates: [],
            datesInvalid: [],
            formasPago: [],
            festivos: [],
            desayunos: [],
            decoraciones: [],
            reservaTemporal: null,
            hoy: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            room: {
                nombre: '',
                estado: '',
                capacidad: '',
                descripcion: '',
                tipo: '',
            },
            rules: {
                required: value => !!value || 'Campo requerido.',
                date: () => {
                    for (let dates of this.datesInvalid) {
                        if (
                            (this.dates[0] >= dates.fecha_entrada && this.dates[0] <= dates.fecha_salida) ||
                            (this.dates[1] >= dates.fecha_entrada && this.dates[1] <= dates.fecha_salida) ||
                            (this.dates[0] <= dates.fecha_entrada && this.dates[1] >= dates.fecha_salida)
                        ) {
                            return 'Fecha No Valida'
                        }
                    }

                    return true
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
                }
            },
        }
    },
    computed: {
        fechaLlegada() {
            return this.dates[0] || ''
        },
        fechaSalida() {
            return this.dates[1] || ''
        },
        huespedes() {
            return this.adultos + this.niños
        },
        precio() {
            let precio = 0

            if (this.dates.length == 2) {
                let fechaActual = new Date(this.dates[0].replace(/-/g, '/'));

                while (fechaActual <= new Date(this.dates[1].replace(/-/g, '/'))) {
                    if (this.festivos.includes(fechaActual.toISOString().slice(0, 10))) {
                        precio += this.room.precios[fechaActual.getDay()].festivo
                    } else {
                        precio += this.room.precios[fechaActual.getDay()].normal
                    }

                    fechaActual.setDate(fechaActual.getDate() + 1);
                }
            }

            return precio
        }
    },
    watch: {
        fechaSalida: function () {
            if (this.dates.length > 1) {
                let fecha1 = new Date(this.dates[0]);
                let fecha2 = new Date(this.dates[1]);

                if (fecha1.toISOString().slice(0, 10) === fecha2.toISOString().slice(0, 10)) {
                    fecha2.setDate(fecha2.getDate() + 1);
                    this.dates[1] = fecha2.toISOString().slice(0, 10);
                }

                let sortDates = this.dates.toSorted()
                this.dates = sortDates
            }
        },
    },
    methods: {
        getRoom() {
            let id = this.$route.params.id

            reservaService.obtenerRoom(id)
                .then(res => {
                    this.room = res[0]
                })
                .catch(err => {
                    console.log(err)
                    this.$router.push({ name: 'viewRooms' })
                })
        },
        agendar() {

            if (this.needPayment) {
                this.showFormasPago = true
                return
            }

            if (!vuex.state.token) {
                Swal.fire({
                    text: "Se necesita iniciar sesión",
                    icon: "warning"
                })
                return
            }

            let data = {
                dateIn: this.fechaLlegada,
                dateOut: this.fechaSalida,
                room: this.room.id,
                user: vuex.state.user.id,
                desayuno: this.desayuno,
                decoracion: this.decoracion,
                huespedes: this.huespedes,
                adultos: this.adultos,
                niños: this.niños,
                precio: this.precio,
                verificacion_pago: this.verificacion_pago ? 1 : 0,
            }

            reservaService.reservar(data)
                .then(res => {
                    this.reservaId = res.reserva
                    this.needPayment = true
                    Swal.fire({
                        text: res.message,
                        icon: "success"
                    })
                        .then(this.showFormasPago = true)
                })
                .catch(err => {
                    Swal.fire({
                        text: err.response.data.message,
                        icon: "error"
                    })
                })

        },
        pagar() {
            this.loading = true

            if (this.metodoPago == 1) {
                this.verificacion_pago = true
            }

            let data = new FormData()

            data.append('reserva', this.reservaId)
            data.append('abono', this.abono)
            data.append('comprobante', this.file)
            data.append('verificacion_pago', this.verificacion_pago ? 1 : 0)

            reservaService.pagar(data)
                .then(res => {
                    this.loading = false
                    this.showFormasPago = false
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })
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
        getFestivos() {
            let hoy = new Date(Date.now())

            let festivos = colombiaHolidays.getColombiaHolidaysByYear(hoy.getFullYear())

            hoy.setFullYear(hoy.getFullYear() + 1)
            this.maxDate = hoy.toISOString().substr(0, 10)

            let festivos2 = colombiaHolidays.getColombiaHolidaysByYear(hoy.getFullYear())

            festivos = festivos.map((date) => {
                return date.holiday
            })

            festivos2 = festivos2.map((date) => {
                return date.holiday
            })

            this.festivos = festivos.concat(festivos2)
        },
        allowedDates(value) {
            for (let dates of this.datesInvalid) {
                if (value >= dates.fecha_entrada && value <= dates.fecha_salida) {
                    return false
                }
            }

            return true
        },
        getDates() {
            let id = this.$route.params.id

            reservaService.getFechasRoom(id)
                .then(res => {
                    this.datesInvalid = res
                })
                .catch(err => {
                    console.log(err)
                })
        },
        getReserva() {
            if (!vuex.state.token) {
                return
            }

            let room = this.$route.params.id
            let user = vuex.state.user.id

            reservaService.getReservaTemporal(room, user)
                .then(res => {
                    if (res.length != 0) {
                        let array = [
                            res[0].fecha_entrada,
                            res[0].fecha_salida
                        ]
                        this.dates = array
                        this.desayuno = res[0].desayuno_id
                        this.decoracion = res[0].decoracion_id
                        this.adultos = res[0].adultos
                        this.niños = res[0].niños
                        this.reservaId = res[0].id
                        this.verificacion_pago = res[0].verificacion_pago
                        if (!this.verificacion_pago) {
                            this.needPayment = true
                        }
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        getDatos() {
            reservaService.obtenerFormasPago()
                .then(res => {
                    this.formasPago = res
                })
                .catch(err => {
                    console.log(err)
                })

            reservaService.obtenerDesayunos()
                .then(res => {
                    this.desayunos = res
                })
                .catch(err => {
                    console.log(err)
                })

            reservaService.obtenerDecoraciones()
                .then(res => {
                    this.decoraciones = res
                })
                .catch(err => {
                    console.log(err)
                })
        },
    },
    mounted() {
        this.getRoom()
        this.getReserva()
        this.getDates()
        this.getDatos()
        this.getFestivos()
    },
}
</script>

<style scoped>
.contenido {
    position: relative;
    display: flex;
    justify-content: center;
    gap: 1%;
    height: 100%;
}

.room {
    width: 60%;
    max-width: 850px;
    display: flex;
    flex-direction: column;
}

.room p {
    text-wrap: pretty;
}

.calendar {
    width: max(30%, 500px);
    height: 100%;
    position: relative;
}

.sticky {
    position: sticky;
    top: 20px;
}
</style>