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
            <v-form v-model="valid" @submit.prevent="agendar">
                <v-card class="pa-5 sticky" elevation="5">
                    <v-row>

                        <v-col cols="12">
                            <v-date-picker v-model="dates" :min="hoy" :max="maxDate" :events="festivos"
                                event-color="red lighten-1" locale="es" full-width range no-title scrollable>
                            </v-date-picker>
                        </v-col>

                        <v-col cols="6">
                            <label>Fecha De LLegada <span class="red--text">*</span></label>
                            <v-text-field v-model="fechaLlegada" :rules="[rules.required]" prepend-inner-icon="mdi-calendar"
                                readonly dense outlined required>
                            </v-text-field>
                        </v-col>

                        <v-col cols="6">
                            <label>Fecha De Salida <span class="red--text">*</span></label>
                            <v-text-field v-model="fechaSalida" :rules="[rules.required]" prepend-inner-icon="mdi-calendar"
                                readonly dense outlined required>
                            </v-text-field>
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
                                                    <v-btn icon @click="adultos--" :disabled="adultos <= 1">
                                                        <v-icon>
                                                            mdi-minus-circle
                                                        </v-icon>
                                                    </v-btn>
                                                    <span>
                                                        {{ adultos }}
                                                    </span>
                                                    <v-btn icon @click="adultos++" :disabled="huespedes == room.capacidad">
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
                                                    <v-btn icon @click="niños--" :disabled="niños <= 0">
                                                        <v-icon>
                                                            mdi-minus-circle
                                                        </v-icon>
                                                    </v-btn>
                                                    {{ niños }}
                                                    <v-btn icon @click="niños++" :disabled="huespedes == room.capacidad">
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

                        <v-btn :disabled="!valid" color="primary" type="submit">
                            reservar
                        </v-btn>
                    </div>
                </v-card>
            </v-form>
        </div>

        <v-dialog :value="showFormasPago" width="90%" max-width="500px">
            <v-card class="pa-5">
                <v-form v-model="validPagos">
                    <v-row>
                        <v-col cols="12">
                            <label>Selecciona un método de pago <span class="red--text">*</span></label>
                            <v-select v-model="metodoPago" :items="formasPago" no-data-text="Espere un momento..."
                                :rules="[rules.required]" item-text="tipo" item-value="id" outlined dense required>
                            </v-select>
                        </v-col>
                        
                        <v-col cols="12" v-if="metodoPago == '1'">
                            <label>Selecciona un método de pago <span class="red--text">*</span></label>
                            
                        </v-col>
                    </v-row>

                    <div class="buttons">
                        <v-btn :disabled="!validPagos" color="light-green" type="submit">
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
import calendarService from './service/calendarService'

export default {
    name: 'RoomInfo',
    data() {
        return {
            cedula: '',
            telefono: '',
            metodoPago: '',
            maxDate: '',
            adultos: 1,
            niños: 0,
            menu: false,
            valid: false,
            validPagos: false,
            showFormasPago: false,
            dates: [],
            formasPago: [],
            festivos: [],
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

            calendarService.obtenerRoom(id)
                .then(res => {
                    this.room = res[0]
                })
                .catch(err => {
                    console.log(err)
                    this.$router.push({ name: 'viewRooms' })
                })
        },
        agendar() {
            if (!vuex.state.token) {
                Swal.fire({
                    text: "Se necesita iniciar sesión",
                    icon: "warning"
                })
                return
            }

            this.showFormasPago = true
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
        getFormasPago() {
            calendarService.obtenerFormasPago()
                .then(res => {
                    this.formasPago = res
                })
                .catch(err => {
                    console.log(err)
                })
        },
    },
    mounted() {
        this.getRoom()
        this.getFestivos()
        this.getFormasPago()
    },
}
</script>

<style scoped>
.contenido {
    position: relative;
    display: flex;
    justify-content: center;
    gap: 100px;
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
    width: 30%;
    height: 100%;
    position: relative;
}

.sticky {
    position: sticky;
    top: 20px;
}
</style>