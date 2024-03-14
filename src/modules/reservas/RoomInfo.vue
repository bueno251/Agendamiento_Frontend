<template>
    <div class="contenido">
        <section class="room">

            <article class="room-info pa-5">
                <h1 class="mb-5">
                    {{ room.nombre }}
                </h1>
                <span>
                    {{ room.tipo }}
                </span>

                <v-carousel v-model="model" cycle show-arrows-on-hover hide-delimiter-background>
                    <v-carousel-item v-for="img in room.imgs" :key="img.id">
                        <v-sheet height="100%" tile>
                            <v-card class="portrait" :img="rootBackend + img.url" height="100%" width="auto"></v-card>
                        </v-sheet>
                    </v-carousel-item>
                </v-carousel>

                <p class="my-10">
                    {{ room.descripcion }}
                </p>
                <span>
                    Capacidad Maxima: {{ room.capacidad }} {{ room.capacidad > 1 ? 'Personas' : 'Persona' }}
                </span>

            </article>

            <v-simple-table>
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th>
                                Día
                            </th>
                            <th>
                                Precios
                            </th>
                            <th v-if="room.tieneIva">
                                Precio Con Iva
                            </th>
                            <th>
                                Previo A Festivo
                            </th>
                            <th v-if="room.tieneIva">
                                Previo A Festivo Con Iva
                            </th>
                            <th>
                                Jornada
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(day, i) in precios" :key="day.name">
                            <template v-if="i < 7">
                                <td>
                                    {{ day.name }}
                                </td>
                                <td>
                                    $ {{ comaEnMiles(precioToDolar(day.precio)) }} {{ divisa.codigo }}
                                </td>
                                <td v-if="room.tieneIva">
                                    $ {{ comaEnMiles(precioToDolar(day.precioConIva)) }} {{ divisa.codigo }}
                                </td>
                                <td>
                                    $ {{ comaEnMiles(precioToDolar(day.previoFestivo)) }} {{ divisa.codigo }}
                                </td>
                                <td v-if="room.tieneIva">
                                    $ {{ comaEnMiles(precioToDolar(day.previoFestivoConIva)) }} {{ divisa.codigo }}
                                </td>
                                <td>
                                    {{ day.jornada }}
                                </td>
                            </template>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>

            <article>
                <h2 class="text-center">
                    Caracteristicas De La Habitación
                </h2>

                <div class="caracteristics">

                    <template v-for="(item, index) in caracteristicas">
                        <div v-if="includeCaracteristic(item, room)" class="caracteristic"
                            :key="`room${room.index}caracteris${index}`">
                            <v-avatar color="blue">
                                <v-icon dark>
                                    mdi-{{ item.icon }}
                                </v-icon>
                            </v-avatar>
                            <div class="infoCaracteristic">
                                <h4>
                                    {{ item.nombre }}
                                </h4>
                                <p>
                                    {{ item.descripcion }}
                                </p>
                            </div>
                        </div>
                    </template>
                </div>
            </article>
        </section>

        <section class="calendar sticky py-5">
            <v-card class="pa-5" elevation="5">
                <v-form v-model="valid" ref="fechas">
                    <v-row>

                        <v-col cols="12" class="py-0">
                            <v-date-picker v-model="dates" :min="hoy" :max="maxDate" :events="festivos"
                                :allowed-dates="allowedDates" event-color="red lighten-1" locale="es" full-width range
                                no-title scrollable>
                            </v-date-picker>
                        </v-col>

                        <v-col cols="6" class="py-0">
                            <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false"
                                transition="scale-transition" offset-y min-width="auto">

                                <template v-slot:activator="{ on, attrs }">
                                    <label>Fecha De LLegada <span class="red--text">*</span></label>
                                    <v-text-field v-model="fechaLlegada" :rules="[rules.required, rules.date]"
                                        prepend-inner-icon="mdi-calendar" v-bind="attrs" v-on="on" readonly dense
                                        outlined required>
                                    </v-text-field>
                                </template>

                                <v-date-picker v-model="dates" :allowed-dates="allowedDates" :min="hoy"
                                    @change="save('menu1', dates)" event-color="red lighten-1" locale="es" range
                                    no-title scrollable>
                                </v-date-picker>
                            </v-menu>
                        </v-col>

                        <v-col cols="6" class="py-0">
                            <v-menu ref="menu2" v-model="menu2" :close-on-content-click="false"
                                transition="scale-transition" offset-y min-width="auto">

                                <template v-slot:activator="{ on, attrs }">
                                    <label>Fecha De Salida <span class="red--text">*</span></label>
                                    <v-text-field v-model="fechaSalida" :rules="[rules.required, rules.date]"
                                        prepend-inner-icon="mdi-calendar" v-bind="attrs" v-on="on" readonly dense
                                        outlined required>
                                    </v-text-field>
                                </template>

                                <v-date-picker v-model="dates" :allowed-dates="allowedDates" :min="hoy"
                                    @change="save('menu2', dates)" event-color="red lighten-1" locale="es" range
                                    no-title scrollable>
                                </v-date-picker>
                            </v-menu>
                        </v-col>

                        <v-col cols="12" md="6" sm="6" class="py-0" v-if="room.tieneDesayuno">
                            <label>Desayunos</label>
                            <v-select v-model="desayuno" :items="desayunos" no-data-text="No hay desayunos"
                                :item-text="item => `${item.nombre} ${!room.incluyeDesayuno && item.precioConIva > 0 ? '+ $' + comaEnMiles(precioToDolar(item.precioConIva)) : ''} ${item.impuesto ? 'IVA:(' + item.impuesto + '%)' : ''}`"
                                :readonly="room.incluyeDesayuno" return-object dense outlined>
                            </v-select>
                        </v-col>

                        <v-col cols="12" md="6" sm="6" class="py-0" v-if="room.tieneDecoracion">
                            <label>Decoraciones</label>
                            <v-select v-model="decoracion" :items="decoraciones" no-data-text="No hay decoraciones"
                                :item-text="item => `${item.nombre} ${item.precioConIva > 0 ? '+ $' + comaEnMiles(precioToDolar(item.precioConIva)) : ''} ${item.impuesto ? 'IVA:(' + item.impuesto + '%)' : ''}`"
                                return-object dense outlined>
                            </v-select>
                        </v-col>

                        <v-col cols="12" md="6" sm="6" class="py-0">
                            <label>Adultos</label>
                            <v-select v-model="adultos" :items="selectAdultos"
                                :item-text="item => `${item.cantidad} ${item.val > 0 ? '+ $' + comaEnMiles(precioToDolar(item.val)) : ''}`"
                                return-object dense outlined>
                            </v-select>
                        </v-col>

                        <v-col cols="12" md="6" sm="6" class="py-0">
                            <label>Niños ({{ edadNiños }} {{ edadNiños > 1 ? 'Años' : 'Año' }} en adelante)</label>
                            <v-select v-model="niños" :items="selectNiños"
                                :item-text="item => `${item.cantidad} ${item.val > 0 ? '+ $' + comaEnMiles(precioToDolar(item.val)) : ''}`"
                                return-object dense outlined>
                            </v-select>
                        </v-col>

                        <v-col cols="6" class="py-0">
                            <label>Valor Adultos</label>
                            <h4>
                                $ {{ comaEnMiles(precioAdultos) }} {{ divisa.codigo }}
                            </h4>
                        </v-col>

                        <v-col cols="6" class="py-0">
                            <label>Valor Niños</label>
                            <h4>
                                $ {{ comaEnMiles(precioNiños) }} {{ divisa.codigo }}
                            </h4>
                        </v-col>

                        <v-col v-if="room.tieneDecoracion" cols="6" class="py-0">
                            <label>Valor Decoración</label>
                            <h4>
                                $ {{ comaEnMiles(precioDecoracion) }} {{ divisa.codigo }}
                            </h4>
                        </v-col>

                        <v-col v-if="room.tieneDesayuno && !room.incluyeDesayuno" cols="6" class="py-0">
                            <label>Valor Desayuno</label>
                            <h4>
                                $ {{ comaEnMiles(precioDesayuno) }} {{ divisa.codigo }}
                            </h4>
                        </v-col>

                        <v-col cols="6" class="py-0">
                            <label>Precio Del Alojamiento</label>
                            <h4>
                                $ {{ comaEnMiles(precioAlojamiento) }} {{ divisa.codigo }}
                            </h4>
                        </v-col>

                        <v-col cols="6" class="py-0">
                            <label>Descuento</label>
                            <h4>
                                $ {{ comaEnMiles(valorDescuento) }} {{ divisa.codigo }}
                            </h4>
                        </v-col>

                        <v-col class="d-flex flex-column align-center flex-grow-0" cols="12">
                            <div class="d-flex flex-column">
                                <label v-for="item in descuentosActive" :key="item.id">
                                    {{ item.nombre }} :
                                    <span v-if="item.tipoId == 2">$</span>{{ comaEnMiles(item.descuento) }}<span
                                        v-if="item.tipoId == 1">%</span>
                                </label>
                            </div>
                        </v-col>

                        <v-col class="d-flex flex-column align-center flex-grow-0" cols="12">
                            <label>Valor Separación {{ porcentajeSeparacion }}%</label>
                            <h4>
                                $ {{ comaEnMiles(valorSeparacion) }} {{ divisa.codigo }}
                            </h4>
                        </v-col>

                        <v-col class="d-flex flex-column align-center flex-grow-0" cols="12">
                            <h3>Precio Total De La Reserva <span v-if="room.iva">IVA: ({{ room.iva }}%)</span></h3>
                            <h1>
                                $ {{ comaEnMiles(precioNeto) }} {{ divisa.codigo }}
                            </h1>
                        </v-col>
                    </v-row>

                    <div class="buttons mt-5">
                        <v-btn @click="$router.back()" color="blue">cancelar</v-btn>
                        <v-btn @click="datosCliente = true" :disabled="!valid" color="light-green">
                            siguiente
                        </v-btn>
                    </div>
                </v-form>
            </v-card>
        </section>

        <v-dialog :value="datosCliente" width="90%" max-width="500px" persistent>
            <v-card class="pa-5 sticky" elevation="5">
                <v-form v-model="validDatosCliente" ref="fechas" @submit.prevent="agendar">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="cedula" :rules="[rules.required]" label="Cedula" type="number"
                                hide-spin-buttons dense outlined required>
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <div class="buttons mt-5">
                        <v-btn @click="datosCliente = false" color="blue">cancelar</v-btn>
                        <v-btn :disabled="!validDatosCliente" :loading="loadingbtn" color="light-green" type="submit">
                            siguiente
                        </v-btn>
                    </div>
                </v-form>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

import service from '@/services/service'
import colombiaHolidays from 'colombia-holidays'

export default {
    name: 'RoomInfo',
    computed: {
        /**
         * Devuelve la fecha de llegada seleccionada.
         */
        fechaLlegada() {
            return this.dates[0] || ''
        },
        /**
         * Devuelve la fecha de salida seleccionada.
         */
        fechaSalida() {
            return this.dates[1] || ''
        },
        /**
         * Calcula el total de huéspedes sumando adultos y niños.
         */
        huespedes() {
            return this.adultos.cantidad + this.niños.cantidad
        },
        /**
         * Calcula el precio total de la reserva, teniendo en cuenta las fechas de entrada y salida, así como el número de adultos y niños.
         */
        precioAlojamiento() {
            let precio = 0

            if (this.dates.length === 2) {
                let fechaInicio = new Date(this.dates[0].replace(/-/g, '/'))
                let fechaFinal = new Date(this.dates[1].replace(/-/g, '/'))

                // Calcula el precio acumulado por cada día de alojamiento
                while (fechaInicio < fechaFinal) {
                    let precioNormal = this.precioToDolar(this.precios[fechaInicio.getDay()].precioConIva)

                    let precioFestivo = this.precioToDolar(this.precios[fechaInicio.getDay()].previoFestivoConIva)

                    fechaInicio.setDate(fechaInicio.getDate() + 1)

                    if (this.festivos.includes(fechaInicio.toISOString().split('T')[0])) {
                        precio += precioFestivo
                    } else {
                        precio += precioNormal
                    }
                }
            }

            return Number(precio.toFixed(2))
        },
        precioAdultos() {
            return Number(this.precioToDolar(this.adultos.val))
        },
        precioNiños() {
            return Number(this.precioToDolar(this.niños.val))
        },
        precioDecoracion() {
            return Number(this.precioToDolar(this.decoracion.precioConIva))
        },
        precioDesayuno() {
            return !this.room.incluyeDesayuno ? Number(this.precioToDolar(this.desayuno.precioConIva * this.huespedes)) : 0
        },
        valorSeparacion() {
            return this.precioAlojamiento ? (this.precioNeto * (this.porcentajeSeparacion / 100)).toFixed(2) : 0.00
        },
        valorDescuento() {
            let descuento = 0

            this.descuentos.forEach(discount => {
                if (this.fechaLlegada <= discount.fechaInicio && discount.fechaFin <= this.fechaSalida) {
                    if (discount.tipo == 'Porcentaje') {
                        descuento += (this.precioTotal * discount.descuento / 100)
                    } else {
                        descuento += discount.descuento
                    }
                }
            });

            return descuento
        },
        precioTotal() {
            let precio = 0

            precio += this.precioAlojamiento
            precio += this.precioAdultos
            precio += this.precioNiños
            precio += this.precioDecoracion
            precio += this.precioDesayuno
            return precio
        },
        precioNeto() {
            let precio = 0

            precio += this.precioTotal
            precio -= this.valorDescuento
            return precio
        },
        /**
         * Genera un array con opciones para seleccionar el número de adultos adicionales, considerando la capacidad máxima de la habitación.
         */
        selectAdultos() {
            let adultos = []

            // Límite de adultos adicionales según la capacidad máxima de la habitación y el número actual de adultos seleccionados
            let limit = this.room.capacidad - this.huespedes + this.adultos.cantidad

            for (let i = 0; i < limit; i++) {
                let value = 0

                // Asigna el valor del precio de adultos adicionales si está disponible
                if (this.precios.length > 7) {
                    let precio = this.useGenerales ? this.room.tarifasGenerales[0].precioConIva : this.precios[7].precioConIva
                    value = i > 1 ? precio : 0
                }

                let cantidad = i + 1

                adultos.push({
                    cantidad: cantidad,
                    val: value * (cantidad - 2),
                })
            }

            return adultos
        },
        /**
         * Genera un array con opciones para seleccionar el número de niños adicionales, considerando la capacidad máxima de la habitación.
         */
        selectNiños() {
            let niños = [
                {
                    cantidad: 0,
                    val: 0
                }
            ]

            // Límite de niños adicionales según la capacidad máxima de la habitación y el número actual de niños seleccionados
            let limit = this.room.capacidad - this.huespedes + this.niños.cantidad

            for (let i = 0; i < limit; i++) {
                let value = 0

                // Asigna el valor del precio de niños adicionales si está disponible
                if (this.precios.length > 7) {
                    let precio = this.useGenerales ? this.room.tarifasGenerales[1].precioConIva : this.precios[8].precioConIva
                    value = precio
                }

                let cantidad = i + 1

                niños.push({
                    cantidad: cantidad,
                    val: value * (cantidad),
                })
            }

            return niños
        },
        descuentosActive() {
            let array = []

            this.descuentos.map(discount => {
                if (this.fechaLlegada <= discount.fechaInicio && discount.fechaFin <= this.fechaSalida) {
                    array.push(discount)
                }
            });

            return array
        }
    },
    watch: {
        /**
         * Observa cambios en la fecha de salida y ajusta las fechas si es necesario.
         */
        fechaSalida: function () {
            if (this.dates.length > 1) {
                let fecha1 = new Date(this.dates[0])
                let fecha2 = new Date(this.dates[1])

                // Ajusta la fecha de salida si es igual a la fecha de llegada
                if (fecha1.toISOString().slice(0, 10) === fecha2.toISOString().slice(0, 10)) {
                    fecha2.setDate(fecha2.getDate() + 1)
                    this.dates[1] = fecha2.toISOString().slice(0, 10)
                }

                // Ordena las fechas de llegada y salida
                let sortDates = this.dates.toSorted()
                this.dates = sortDates
            }
        },
    },
    data() {
        return {
            cedula: '',
            desayuno: {
                id: null,
                nombre: 'Ninguno',
                precioConIva: 0,
            },
            decoracion: {
                id: null,
                nombre: 'Ninguna',
                precioConIva: 0,
            },
            maxDate: '',
            cantidadRooms: 1,
            model: 0,
            porcentajeSeparacion: 0,
            dolarPrice: 0,
            edadNiños: 1,
            priceInDolar: false,
            dolarPriceAuto: true,
            valid: false,
            validDatosCliente: false,
            loading: false,
            loadingbtn: false,
            datosCliente: false,
            useGenerales: false,
            menu1: false,
            menu2: false,
            dates: [],
            datesInvalid: [],
            festivos: [],
            caracteristicas: [],
            precios: [],
            descuentos: [],
            adultos: {
                cantidad: 2,
                val: 0
            },
            niños: {
                cantidad: 0,
                val: 0
            },
            divisa: {
                codigo: '',
            },
            desayunos: [
                {
                    id: null,
                    nombre: 'Ninguno',
                    precioConIva: 0,
                }
            ],
            decoraciones: [
                {
                    id: null,
                    nombre: 'Ninguna',
                    precioConIva: 0,
                }
            ],
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
            },
            rootBackend: process.env.VUE_APP_URL_BASE + '/storage/',
        }
    },
    methods: {
        /**
         * Obtiene la información de una habitación según su ID de la ruta.
         * Si la obtención es exitosa, actualiza la variable 'room' con la información de la habitación.
         * En caso de error, redirige al usuario a la vista de habitaciones ('viewRooms').
         */
        async getRoom() {
            let id = this.$route.params.id

            await service.obtenerRoom(id)
                .then(res => {
                    let week = [
                        { name: 'Domingo' },
                        { name: 'Lunes' },
                        { name: 'Martes' },
                        { name: 'Miércoles' },
                        { name: 'Jueves' },
                        { name: 'Viernes' },
                        { name: 'Sábado' },
                        { name: 'Adicional' },
                        { name: 'Niños' },
                    ]

                    res.precios.map((day) => {
                        const index = week.findIndex((weekDay) => weekDay.name === day.name)

                        if (index !== -1) {
                            week[index].precio = day.precio
                            week[index].precioConIva = day.precioConIva
                            week[index].previoFestivo = day.previoFestivo
                            week[index].previoFestivoConIva = day.previoFestivoConIva
                            week[index].jornada = day.jornada
                        }
                    })

                    this.room = res
                    this.precios = week

                    if (res.incluyeDesayuno) {
                        this.desayunos[0].nombre = 'Incluido'
                        this.desayuno = {
                            id: null,
                            nombre: 'Incluido',
                            precioConIva: 0,
                        }
                    }
                })
                .catch(err => {
                    console.error(err)
                    this.$router.push({ name: 'viewRooms' })
                })
        },
        /**
         * Inicia el proceso de agendamiento.
         * Prepara la información necesaria (fechas, habitación, cantidad de personas, etc.) y la almacena en el estado global.
         * Luego, redirige al usuario a la vista de pago ('pagar').
         */
        agendar() {
            this.loadingbtn = true

            let data = {
                dateIn: this.fechaLlegada,
                dateOut: this.fechaSalida,
                room: this.room,
                adultos: this.adultos.cantidad,
                niños: this.niños.cantidad,
                precioAlojamiento: this.precioAlojamiento,
                precioAdultos: this.precioAdultos,
                precioNiños: this.precioNiños,
                precioDecoracion: this.precioDecoracion,
                precioDesayuno: this.precioDesayuno,
                valorSeparacion: this.valorSeparacion,
                precioTotal: this.precioNeto,
                cedula: this.cedula,
                cantidad_rooms: this.cantidadRooms,
            }

            if (this.desayuno) {
                data.desayuno = this.desayuno
            }

            if (this.decoracion) {
                data.decoracion = this.decoracion
            }

            this.$store.dispatch('setReserva', data)

            this.$router.push({ name: 'pagar' })
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
        precioToDolar(numero) {
            if (!this.priceInDolar) {
                return numero
            }

            return parseFloat((numero / this.dolarPrice).toFixed(2))
        },
        /**
         * Obtiene los días festivos en Colombia.
         * Prepara un rango de fechas desde hoy hasta un año después y obtiene los festivos de ambos años.
         * Actualiza la variable 'festivos' con la lista de días festivos.
         */
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
        /**
         * Verifica si una fecha está permitida según las fechas invalidas obtenidas previamente.
         * @param {string} value - Fecha a verificar.
         * @returns {boolean} - Indica si la fecha está permitida.
         */
        allowedDates(value) {
            for (let dates of this.datesInvalid) {
                if (value >= dates.fecha_entrada && value <= dates.fecha_salida) {
                    return false
                }
            }

            return true
        },
        /**
         * Obtiene las fechas invalidas para la habitación actual y actualiza la variable 'datesInvalid'.
         */
        getDates() {
            let id = this.$route.params.id

            service.getFechasRoom(id)
                .then(res => {
                    this.datesInvalid = res
                })
                .catch(err => {
                    console.error(err)
                })
        },
        /**
         * Verifica si una característica está incluida en las características de una habitación.
         * @param {object} caracteris - Característica a verificar.
         * @param {object} room - Habitación a la que se le verificará la característica.
         * @returns {boolean} - Indica si la característica está incluida en la habitación.
         */
        includeCaracteristic(caracteris, room) {
            return room.caracteristicas.includes(caracteris.id)
        },
        /**
         * Obtiene la información de desayunos, decoraciones y características para ser utilizada en el agendamiento.
         * Actualiza las variables 'desayunos', 'decoraciones' y 'caracteristicas'.
         */
        getDatos() {
            service.obtenerDesayunos()
                .then(res => {
                    this.desayunos = [...this.desayunos, ...res]
                })
                .catch(err => {
                    console.error(err)
                })

            service.obtenerDecoraciones()
                .then(res => {
                    this.decoraciones = [...this.decoraciones, ...res]
                })
                .catch(err => {
                    console.error(err)
                })

            service.obtenerCaracteristicas()
                .then(res => {
                    this.caracteristicas = res
                })
                .catch(err => {
                    console.error(err)
                })

            service.obtenerDescuentos(this.room.id)
                .then(res => {
                    this.descuentos = res
                })
                .catch(err => {
                    console.error(err)
                })
        },
        async getDefault() {

            service.obtenerConfigReserva()
                .then(res => {
                    this.porcentajeSeparacion = res.porcentajeSeparacion
                    this.useGenerales = res.tarifasGenerales
                    this.edadNiños = res.edadTarifaNiños
                })
                .catch(err => {
                    console.error(err)
                })

            try {
                let res = await service.obtenerValoresDefault()
                this.divisa = res.divisa
                this.priceInDolar = res.priceInDolar
                this.dolarPriceAuto = res.dolarPriceAuto
                this.dolarPrice = res.dolarPrice

                if (this.dolarPriceAuto) {
                    res = await service.valorDolar()
                    this.dolarPrice = res.valor
                }
            } catch (err) {
                this.priceInDolar = false
                console.error(err)
            }

        },
        save(menu, date) {
            this.$refs[menu].save(date)
        },
    },
    async mounted() {
        await this.getRoom()
        await this.getDefault()
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
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
    width: 100%;
    justify-content: center;
    gap: 1%;
}

.room {
    width: min(100%, 800px);
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.room h1 {
    font-size: 2rem;
}

h1,
h2 {
    text-wrap: balance;

}

.room p {
    text-wrap: pretty;
}

.portrait {
    width: 100%;
    aspect-ratio: 3/2;
}

.calendar {
    width: min(95%, 500px);
    height: fit-content;
}

.sticky {
    position: sticky;
    top: 0px;
}

.caracteristics {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 15px;
}

.caracteristic {
    display: flex;
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

@media only screen and (max-width: 800px) {
    .contenido {
        flex-direction: column;
        align-items: center;
    }
}
</style>