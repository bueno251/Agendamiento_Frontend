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
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(tarifa, i) in precios" :key="tarifa.name">
                            <template v-if="i < 7">
                                <td>
                                    {{ tarifa.name }}
                                </td>
                                <td>
                                    $ {{ comaEnMiles(precioToDolar(tarifa.precio)) }} {{ divisa.codigo }}
                                </td>
                                <td v-if="room.tieneIva">
                                    $ {{ comaEnMiles(precioToDolar(tarifa.precioConIva)) }} {{ divisa.codigo }}
                                </td>
                                <td>
                                    $ {{ comaEnMiles(precioToDolar(tarifa.previoFestivo)) }} {{ divisa.codigo }}
                                </td>
                                <td v-if="room.tieneIva">
                                    $ {{ comaEnMiles(precioToDolar(tarifa.previoFestivoConIva)) }} {{ divisa.codigo }}
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
         * Calcula el precio total de la reserva, teniendo en cuenta las fechas de entrada y salida.
         */
        precioAlojamiento() {
            // Inicializa el precio total
            let precio = 0

            // Verifica si se han proporcionado fechas de entrada y salida
            if (this.dates.length === 2) {
                // Convierte las fechas de entrada y salida en objetos Date
                let fechaInicio = new Date(this.dates[0].replace(/-/g, '/'))
                let fechaFinal = new Date(this.dates[1].replace(/-/g, '/'))

                // Calcula el precio acumulado por cada día de alojamiento
                while (fechaInicio < fechaFinal) {
                    // Obtiene el precio normal y el precio festivo del día actual
                    let precioNormal = this.precioToDolar(this.precios[fechaInicio.getDay()].precioConIva)
                    let precioFestivo = this.precioToDolar(this.precios[fechaInicio.getDay()].previoFestivoConIva)

                    // Avanza al siguiente día
                    fechaInicio.setDate(fechaInicio.getDate() + 1)

                    // Verifica si el día actual es festivo
                    if (this.festivos.includes(fechaInicio.toISOString().split('T')[0])) {
                        // Si es festivo, suma el precio festivo al total
                        precio += precioFestivo
                    } else {
                        // Si no es festivo, suma el precio normal al total
                        precio += precioNormal
                    }
                }
            }

            // Devuelve el precio total, redondeado a 2 decimales
            return Number(precio.toFixed(2))
        },
        /**
         * Calcula el precio de los adultos.
         */
        precioAdultos() {
            // Convierte el precio de los adultos a dólares y lo devuelve
            return Number(this.precioToDolar(this.adultos.val))
        },
        /**
         * Calcula el precio de los niños.
         */
        precioNiños() {
            // Convierte el precio de los niños a dólares y lo devuelve
            return Number(this.precioToDolar(this.niños.val))
        },
        /**
         * Calcula el precio de la decoración.
         */
        precioDecoracion() {
            // Convierte el precio de la decoración a dólares y lo devuelve
            return Number(this.precioToDolar(this.decoracion.precioConIva))
        },
        /**
         * Calcula el precio del desayuno.
         */
        precioDesayuno() {
            // Verifica si el desayuno está incluido en la habitación
            // Si no está incluido, calcula el precio en dólares del desayuno por el número de huéspedes y lo devuelve
            // Si está incluido, devuelve 0
            return !this.room.incluyeDesayuno ? Number(this.precioToDolar(this.desayuno.precioConIva * this.huespedes)) : 0
        },
        /**
         * Calcula el valor de la separación basado en el precio neto y el porcentaje de separación.
         */
        valorSeparacion() {
            // Verifica si hay un precio neto
            // Si hay un precio neto, calcula y devuelve el valor de la separación en dólares, redondeado a 2 decimales
            // Si no hay precio neto, devuelve 0
            return this.precioNeto ? (this.precioNeto * (this.porcentajeSeparacion / 100)).toFixed(2) : 0.00
        },
        /**
         * Calcula el valor total de descuento aplicado a la reserva.
         */
        valorDescuento() {
            // Inicializa el descuento total en 0
            let descuento = 0

            // Itera sobre cada descuento
            this.descuentos.forEach(discount => {
                // Verifica si las fechas de llegada y salida están dentro del rango de fechas del descuento
                if (this.fechaLlegada <= discount.fechaInicio && this.fechaSalida >= discount.fechaFin) {
                    // Aplica el descuento según el tipo (Porcentaje o Valor Fijo)
                    if (discount.tipo == 'Porcentaje') {
                        // Si el descuento es de tipo porcentaje, calcula el descuento en base al precio total y lo agrega al descuento total
                        descuento += (this.precioTotal * discount.descuento / 100)
                    } else {
                        // Si el descuento es de valor fijo, simplemente lo agrega al descuento total
                        descuento += discount.descuento
                    }
                }
            });

            // Devuelve el descuento total
            return descuento
        },
        /**
         * Calcula el precio total de la reserva sumando los precios individuales de alojamiento, adultos, niños, decoración y desayuno.
         */
        precioTotal() {
            // Inicializa el precio total en 0
            let precio = 0

            // Suma los precios individuales de alojamiento, adultos, niños, decoración y desayuno al precio total
            precio += this.precioAlojamiento
            precio += this.precioAdultos
            precio += this.precioNiños
            precio += this.precioDecoracion
            precio += this.precioDesayuno

            // Devuelve el precio total de la reserva
            return precio
        },
        /**
         * Calcula el precio neto de la reserva restando el valor total de descuento del precio total.
         */
        precioNeto() {
            // Inicializa el precio neto en 0
            let precio = 0

            // Calcula el precio neto restando el valor total de descuento del precio total
            precio += this.precioTotal
            precio -= this.valorDescuento

            // Devuelve el precio neto de la reserva
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
        /**
         * Filtra los descuentos activos que están dentro del rango de fechas de la reserva.
         */
        descuentosActive() {
            // Inicializa un array vacío para almacenar los descuentos activos
            let array = []

            // Filtra los descuentos activos que están dentro del rango de fechas de la reserva
            this.descuentos.map(discount => {
                if (this.fechaLlegada <= discount.fechaInicio && discount.fechaFin <= this.fechaSalida) {
                    array.push(discount)
                }
            });

            // Devuelve el array de descuentos activos
            return array
        },
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
            // Obtiene el ID de la habitación de los parámetros de la ruta
            let id = this.$route.params.id

            try {
                // Obtiene los detalles de la habitación del servicio
                let res = await service.obtenerRoom(id)

                // Define una lista de días de la semana con valores predeterminados
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

                // Mapea los precios de la habitación y los asigna a los días correspondientes en la lista de la semana
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

                // Asigna los detalles de la habitación y los precios actualizados a las propiedades correspondientes
                this.room = res
                this.precios = week

                // Verifica si la habitación incluye desayuno y actualiza la información del desayuno si es necesario
                if (res.incluyeDesayuno) {
                    this.desayunos[0].nombre = 'Incluido'
                    this.desayuno = {
                        id: null,
                        nombre: 'Incluido',
                        precioConIva: 0,
                    }
                }
            } catch (err) {
                // Maneja el error y redirige a la vista de habitaciones en caso de fallo
                console.error(err)
                this.$router.push({ name: 'viewRooms' })
            }
        },
        /**
         * Inicia el proceso de agendamiento y redirige a la página de pago.
         */
        agendar() {
            // Establece la variable de carga como verdadera para mostrar el estado de carga
            this.loadingbtn = true

            // Prepara los datos de la reserva
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
                precioTotal: this.precioTotal,
                precioNeto: this.precioNeto,
                cedula: this.cedula,
                cantidad_rooms: this.cantidadRooms,
            }

            // Verifica si se ha seleccionado un desayuno y lo agrega a los datos de la reserva si es necesario
            if (this.desayuno) {
                data.desayuno = this.desayuno
            }

            // Verifica si se ha seleccionado una decoración y la agrega a los datos de la reserva si es necesario
            if (this.decoracion) {
                data.decoracion = this.decoracion
            }

            // Despacha la acción para establecer los datos de la reserva en el almacenamiento global
            this.$store.dispatch('setReserva', data)

            // Redirige a la página de pago
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
        /**
         * Convierte un precio de la moneda local a dólares si está habilitada la opción de mostrar en dólares.
         * @param {number} numero - El precio en la moneda local.
         * @returns {number} - El precio convertido a dólares, si está habilitada la opción; de lo contrario, devuelve el precio original.
         */
        precioToDolar(numero) {
            // Verifica si la opción de mostrar en dólares está habilitada
            if (!this.priceInDolar) {
                // Si no está habilitada, devuelve el precio original
                return numero;
            }

            // Calcula el precio en dólares y redondea a 2 decimales
            return parseFloat((numero / this.dolarPrice).toFixed(2));
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
        /**
         * Obtiene los valores predeterminados, como la configuración de reserva, la divisa, y los valores relacionados con los precios en dólares.
         */
        async getDefault() {
            try {
                // Obtiene la configuración de reserva
                await service.obtenerConfigReserva()
                    .then(res => {
                        // Asigna los valores de la configuración de reserva a las propiedades correspondientes
                        this.porcentajeSeparacion = res.porcentajeSeparacion
                        this.useGenerales = res.tarifasGenerales
                        this.edadNiños = res.edadTarifaNiños
                    })
                    .catch(err => {
                        console.error(err)
                    })

                // Obtiene los valores predeterminados del servicio
                let res = await service.obtenerValoresDefault()

                // Asigna los valores obtenidos a las propiedades correspondientes
                this.divisa = res.divisa
                this.priceInDolar = res.priceInDolar
                this.dolarPriceAuto = res.dolarPriceAuto
                this.dolarPrice = res.dolarPrice

                // Verifica si la opción de mostrar en dólares y el precio automático del dólar están habilitados
                if (this.priceInDolar && this.dolarPriceAuto) {
                    // Si están habilitados, obtiene el precio actual del dólar
                    res = await service.valorDolar()
                    this.dolarPrice = res.valor
                }
            } catch (err) {
                // Maneja el error estableciendo la opción de mostrar en dólares como falsa y registrando el error
                this.priceInDolar = false
                console.error(err)
            }
        },
        /**
         * Invoca el método de guardado de la fecha de un componente referenciado.
         * @param {string} menu - La referencia del componente al que se desea acceder.
         * @param {Date} date - La fecha que se pasa al método de guardado.
         * @returns {void}
         */
        save(menu, date) {
            // Utiliza la referencia proporcionada para acceder al componente y llamar a su método save con la fecha proporcionada
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