<template>
    <div class="contenido">
        <section class="room">

            <article class="room-info pa-5">
                <h1 class="mb-5 text-center">
                    {{ room.nombre }} ({{ room.tipo }})
                </h1>

                <v-carousel cycle show-arrows-on-hover hide-delimiter-background>
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
                            <th>
                                Previo A Festivo
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
                                <td>
                                    $ {{ comaEnMiles(precioToDolar(tarifa.previoFestivo)) }} {{ divisa.codigo }}
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
                                :readonly="calendarioInhabilitado" :allowed-dates="allowedDates"
                                event-color="red lighten-1" locale="es" full-width range no-title scrollable>
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
                                    :readonly="calendarioInhabilitado" @change="save('menu1', dates)"
                                    event-color="red lighten-1" locale="es" range no-title scrollable>
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
                                    :readonly="calendarioInhabilitado" @change="save('menu2', dates)"
                                    event-color="red lighten-1" locale="es" range no-title scrollable>
                                </v-date-picker>
                            </v-menu>
                        </v-col>

                        <v-col cols="12" md="6" sm="6" class="py-0" v-if="room.tieneDesayuno">
                            <label>Desayunos</label>
                            <a v-if="desayuno.id != null" class="text-small" @click="dialogMediaDesayunos = true">Ver
                                Fotos/Videos</a>
                            <v-select v-model="desayuno" :items="desayunos" no-data-text="No hay desayunos"
                                :item-text="item => `${item.nombre} ${!room.incluyeDesayuno && item.precioConIva > 0 ? '+ $' + comaEnMiles(precioToDolar(item.precioConIva)) : ''} ${item.impuesto ? 'IVA:(' + item.impuesto + '%)' : ''}`"
                                :readonly="room.incluyeDesayuno" return-object dense outlined>
                            </v-select>
                        </v-col>

                        <v-col cols="12" md="6" sm="6" class="py-0" v-if="room.tieneDecoracion">
                            <label>Decoraciones</label>
                            <a v-if="decoracion.id != null" class="text-small"
                                @click="dialogMediaDecoraciones = true">Ver
                                Fotos/Videos</a>
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
                            <label>Valor Adulto Adicional</label>
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

                        <v-col class="d-flex flex-column align-center flex-grow-0" cols="12">

                            <strong v-if="descuentosActive.length">Descuentos:</strong>
                            <div class="d-flex flex-column">
                                <label v-for="item in descuentosActive" :key="item.id">
                                    {{ item.nombre }} :
                                    <span v-if="item.tipoId == 2">$</span>{{ comaEnMiles(item.descuento) }}<span
                                        v-if="item.tipoId == 1">%</span>
                                </label>
                            </div>

                            <strong v-if="descuentoEstadia.diasEstadia <= noches">Descuento por
                                larga estadia:</strong>
                            <div v-if="descuentoEstadia.diasEstadia <= noches" class="d-flex flex-column">
                                <label>
                                    {{ descuentoEstadia.nombre }} ({{ descuentoEstadia.diasEstadia }} dias):
                                    <span v-if="descuentoEstadia.tipoId == 2">$</span>
                                    {{ comaEnMiles(descuentoEstadia.descuento) }}
                                    <span v-if="descuentoEstadia.tipoId == 1">%</span>
                                    (Por dia)
                                </label>
                            </div>

                            <strong v-if="'nombre' in cupon">Cupón:</strong>
                            <div v-if="'nombre' in cupon" class="d-flex flex-column">
                                <label>
                                    {{ cupon.nombre }} :
                                    <span v-if="cupon.tipoId == 2">$</span>
                                    {{ comaEnMiles(cupon.descuento) }}
                                    <span v-if="cupon.tipoId == 1">%</span>
                                    en {{ cupon.precio }}
                                </label>
                                <p v-if="cupon.documento">Cupón valido para {{ cupon.cliente }} {{ cupon.documento }}
                                </p>
                                <sub v-if="!fechasValidasCupon()" class="red--text mb-5">Fecha del cupón no valida</sub>
                            </div>

                            <div v-if="fechasValidasEnCupones()" class="d-flex flex-column">
                                <label style="text-align: center;">Canjear Código Cupón</label>
                                <v-otp-input v-model="codigoCupon" :disabled="fechasValidasCupon()" @finish="checkCupon"
                                    @input="toUpperCase('codigoCupon')"></v-otp-input>
                            </div>
                        </v-col>

                        <v-col class="d-flex flex-column align-center flex-grow-0" cols="12">
                            <label>Valor Separación {{ porcentajeSeparacion }}%</label>
                            <h4>
                                $ {{ comaEnMiles(valorSeparacion) }} {{ divisa.codigo }}
                            </h4>
                        </v-col>

                        <v-col class="d-flex flex-column align-center flex-grow-0" cols="12">
                            <h3>Precio Total De La Reserva</h3>
                            <h1>
                                $ {{ comaEnMiles(precioTotal) }} {{ divisa.codigo }}
                            </h1>
                        </v-col>
                    </v-row>

                    <div class="buttons mt-5">
                        <v-btn @click="$router.back()" color="blue">cancelar</v-btn>
                        <v-btn @click="datosCliente = true" :disabled="!valid || !canReservar" class="light-green black--text">
                            reservar
                        </v-btn>
                    </div>
                </v-form>
            </v-card>
        </section>

        <v-dialog :value="datosCliente" width="90%" max-width="500px" persistent>
            <v-card class="pa-5 sticky" elevation="5">
                <v-toolbar elevation="0">
                    <v-spacer></v-spacer>
                    <v-btn icon class="ml-3" @click="datosCliente = false"><v-icon>mdi-close-box</v-icon></v-btn>
                </v-toolbar>
                <v-form v-model="validDatosCliente" @submit.prevent="agendar">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="documento" :rules="[rules.required]" @focusout="getUser()"
                                label="Documento" type="number" hide-spin-buttons dense outlined required>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-text-field v-model="telefono" :rules="[rules.required]" label="Telefono" type="number"
                                hide-spin-buttons dense outlined required>
                            </v-text-field>
                        </v-col>
                    </v-row>

                    <div class="buttons mt-5">
                        <v-btn @click="datosCliente = false" color="blue">cancelar</v-btn>
                        <v-btn :disabled="!validDatosCliente" class="light-green black--text" type="submit">
                            siguiente
                        </v-btn>
                    </div>
                </v-form>
            </v-card>
        </v-dialog>

        <v-dialog :value="dialogMediaDecoraciones" width="90%" persistent>
            <v-card class="pa-5">
                <v-toolbar elevation="0">
                    <v-spacer></v-spacer>
                    <v-btn icon class="ml-3"
                        @click="dialogMediaDecoraciones = false"><v-icon>mdi-close-box</v-icon></v-btn>
                </v-toolbar>
                <v-carousel show-arrows-on-hover hide-delimiter-background>
                    <v-carousel-item v-for="file in decoracion.media" :key="`decoracionFile${file.id}`">
                        <img v-if="esImagen(file.url)" class="imgCarousel" :src="rootBackend + file.url">
                        <video v-else class="videoCarousel" :src="rootBackend + file.url" autoplay muted loop></video>
                    </v-carousel-item>
                </v-carousel>
            </v-card>
        </v-dialog>

        <v-dialog :value="dialogMediaDesayunos" width="90%" persistent>
            <v-card class="pa-5">
                <v-toolbar elevation="0">
                    <v-spacer></v-spacer>
                    <v-btn icon class="ml-3"
                        @click="dialogMediaDesayunos = false"><v-icon>mdi-close-box</v-icon></v-btn>
                </v-toolbar>
                <v-carousel show-arrows-on-hover hide-delimiter-background>
                    <v-carousel-item v-for="file in desayuno.media" :key="`desayunoFile${file.id}`">
                        <img v-if="esImagen(file.url)" class="imgCarousel" :src="rootBackend + file.url">
                        <video v-else class="videoCarousel" :src="rootBackend + file.url" autoplay muted loop></video>
                    </v-carousel-item>
                </v-carousel>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

import Swal from 'sweetalert2'
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
        precioAlojamientoSinDescuento() {
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
                    let precioNormal = this.precioToDolar(this.precios[fechaInicio.getDay()].precio)
                    let precioFestivo = this.precioToDolar(this.precios[fechaInicio.getDay()].previoFestivo)
                    let descuentoEstadia = 0

                    let tarifaEspecial = this.getTarifaEspecial(fechaInicio.toISOString().split('T')[0])

                    if (tarifaEspecial) {
                        precioNormal = this.precioToDolar(tarifaEspecial.precio)
                    }

                    // Avanza al siguiente día
                    fechaInicio.setDate(fechaInicio.getDate() + 1)

                    // Aplica descuentos por estancia si corresponde
                    if (this.descuentoEstadia.diasEstadia <= this.noches) {
                        if (this.festivos.includes(fechaInicio.toISOString().split('T')[0])) {
                            descuentoEstadia = this.descuentoEstadia.tipo === 'Porcentaje' ?
                                (precioFestivo * this.descuentoEstadia.descuento / 100) :
                                this.descuentoEstadia.descuento
                        } else {
                            descuentoEstadia = this.descuentoEstadia.tipo === 'Porcentaje' ?
                                (precioNormal * this.descuentoEstadia.descuento / 100) :
                                this.descuentoEstadia.descuento
                        }
                    }

                    // Aplica el descuento al precio correspondiente
                    if (this.festivos.includes(fechaInicio.toISOString().split('T')[0])) {
                        precioFestivo -= descuentoEstadia
                        precio += precioFestivo
                    } else {
                        precioNormal -= descuentoEstadia
                        precio += precioNormal
                    }
                }
            }

            // Redondea el precio a 2 decimales
            precio = Number(precio.toFixed(2))

            // Devuelve el precio total, asegurándose de que no sea negativo
            return precio >= 0 ? precio : 0
        },
        /**
         * Calcula el precio total del alojamiento, teniendo en cuenta las fechas de entrada y salida, los precios por día,
         * los días festivos, los descuentos por estancia y los cupones.
         */
        precioAlojamiento() {

            let precio = this.precioAlojamientoSinDescuento

            // Aplica descuentos de cupón si corresponde
            let descuentoCupon = 0
            if (this.cupon.precio === 'Alojamiento' || this.cupon.precio === 'Todo') {
                descuentoCupon = this.valorDescuentoCupon(precio)
            }

            // Aplica el valor total de los descuentos y el descuento del cupón al precio final
            precio -= this.valorDescuento(precio)
            precio -= descuentoCupon

            // Devuelve el precio total, asegurándose de que no sea negativo
            return precio >= 0 ? precio : 0
        },
        /**
         * Calcula la cantidad de noches de estancia entre dos fechas.
         */
        noches() {
            // Definir las dos fechas
            let fechaInicio = new Date(this.fechaLlegada)
            let fechaFin = new Date(this.fechaSalida)

            // Calcular la diferencia en milisegundos
            let diferenciaEnMs = fechaFin - fechaInicio

            // Convertir la diferencia de milisegundos a días
            let nochesDeEstancia = diferenciaEnMs / (1000 * 60 * 60 * 24)

            return nochesDeEstancia
        },
        precioAdultosSinDescuento() {
            let precio = Number(this.precioToDolar(this.adultos.val))

            return precio >= 0 ? precio : 0
        },
        /**
         * Calcula el precio de los adultos.
         */
        precioAdultos() {
            let precio = this.precioAdultosSinDescuento

            let descuentoCupon = 0
            if (this.cupon.precio == 'Adulto Adicional' || this.cupon.precio == 'Todo') {
                descuentoCupon = this.valorDescuentoCupon(precio)
            }

            precio -= descuentoCupon
            return precio >= 0 ? precio : 0
        },
        precioNiñosSinDescuento() {
            let precio = Number(this.precioToDolar(this.niños.val))

            return precio >= 0 ? precio : 0
        },
        /**
         * Calcula el precio de los niños.
         */
        precioNiños() {
            let precio = this.precioNiñosSinDescuento

            let descuentoCupon = 0
            if (this.cupon.precio == 'Niño Adicional' || this.cupon.precio == 'Todo') {
                descuentoCupon = this.valorDescuentoCupon(precio)
            }

            precio -= descuentoCupon
            return precio >= 0 ? precio : 0
        },
        precioDecoracionSinDescuento() {
            // Convierte el precio de la decoración a dólares
            let precio = Number(this.precioToDolar(this.decoracion.precioConIva))

            return precio >= 0 ? precio : 0
        },
        /**
         * Calcula el precio de la decoración.
         */
        precioDecoracion() {
            // Convierte el precio de la decoración a dólares
            let precio = this.precioDecoracionSinDescuento

            let descuentoCupon = 0
            if (this.cupon.precio == 'Decoración' || this.cupon.precio == 'Todo') {
                descuentoCupon = this.valorDescuentoCupon(precio)
            }

            precio -= descuentoCupon
            return precio >= 0 ? precio : 0
        },
        precioDesayunoSinDescuento() {
            // Verifica si el desayuno está incluido en la habitación
            // Si está incluido, devuelve 0
            if (this.room.incluyeDesayuno) {
                return 0
            }

            // Si no está incluido, calcula el precio en dólares del desayuno por el número de huéspedes
            let precio = Number(this.precioToDolar(this.desayuno.precioConIva * this.huespedes))

            return precio >= 0 ? precio : 0
        },
        /**
         * Calcula el precio del desayuno.
         */
        precioDesayuno() {
            let precio = this.precioDesayunoSinDescuento

            let descuentoCupon = 0
            if (this.cupon.precio == 'Desayuno' || this.cupon.precio == 'Todo') {
                descuentoCupon = this.valorDescuentoCupon(precio)
            }

            precio -= descuentoCupon
            return precio >= 0 ? precio : 0
        },
        /**
         * Calcula el valor de la separación basado en el precio total y el porcentaje de separación.
         */
        valorSeparacion() {
            // Verifica si hay un precio total
            // Si hay un precio total, calcula y devuelve el valor de la separación en dólares, redondeado a 2 decimales
            // Si no hay precio total, devuelve 0
            return this.precioTotal ? Number((this.precioTotal * (this.porcentajeSeparacion / 100)).toFixed(2)) : 0.00
        },
        precioTotalSinDescuento() {
            // Inicializa el precio total en 0
            let precio = 0

            // Suma los precios individuales de alojamiento, adultos, niños, decoración y desayuno al precio total
            precio += this.precioAdultosSinDescuento
            precio += this.precioNiñosSinDescuento
            precio += this.precioDecoracionSinDescuento
            precio += this.precioDesayunoSinDescuento
            precio += this.precioAlojamientoSinDescuento

            // Devuelve el precio total de la reserva sin descuento
            return precio
        },
        /**
         * Calcula el precio total de la reserva sumando los precios individuales de alojamiento, adultos, niños, decoración y desayuno.
         */
        precioTotal() {
            // Inicializa el precio total en 0
            let precio = 0

            // Suma los precios individuales de alojamiento, adultos, niños, decoración y desayuno al precio total
            precio += this.precioAdultos
            precio += this.precioNiños
            precio += this.precioDecoracion
            precio += this.precioDesayuno
            precio += this.precioAlojamiento

            // Devuelve el precio total de la reserva
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
        useTarifasEspeciales() {
            if (this.dates.length === 2) {
                // Convierte las fechas de entrada y salida en objetos Date
                let fechaInicio = new Date(this.dates[0].replace(/-/g, '/'))
                let fechaFinal = new Date(this.dates[1].replace(/-/g, '/'))
                let tarifaEspecial

                while (fechaInicio < fechaFinal) {

                    tarifaEspecial = this.getTarifaEspecial(fechaInicio.toISOString().split('T')[0])

                    if (tarifaEspecial) {
                        return true
                    }

                    // Avanza al siguiente día
                    fechaInicio.setDate(fechaInicio.getDate() + 1)
                }
            }

            return false
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
            documento: '',
            telefono: '',
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
            porcentajeSeparacion: 0,
            dolarPrice: 0,
            edadNiños: 1,
            codigoCupon: '',
            canReservar: true,
            calendarioInhabilitado: false,
            dialogMediaDecoraciones: false,
            dialogMediaDesayunos: false,
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
            descuentoEstadia: [],
            cupones: [],
            cupon: {},
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
                documento: this.documento,
                telefono: this.telefono,
                noches: this.noches,
                cantidad_rooms: this.cantidadRooms,
                useTarifasEspeciales: this.useTarifasEspeciales,
            }

            // Verifica si se ha seleccionado un desayuno y lo agrega a los datos de la reserva si es necesario
            if (this.desayuno) {
                data.desayuno = this.desayuno
            }

            // Verifica si se ha seleccionado una decoración y la agrega a los datos de la reserva si es necesario
            if (this.decoracion) {
                data.decoracion = this.decoracion
            }

            if (this.descuentosActive.length) {
                let descuentos = this.descuentosActive.map(item => {
                    return {
                        id: item.id,
                        nombre: item.nombre,
                        esPorcentaje: item.tipo == 'Porcentaje',
                        porcentaje: item.tipo == 'Porcentaje' ? item.descuento : null,
                        descuento: item.tipo == 'Precio' ? item.descuento : (this.precioAlojamientoSinDescuento * item.descuento / 100),
                    }
                })

                data.descuentos = descuentos
            }

            if ('id' in this.cupon && this.cupon.documento == this.documento) {

                let descuentoCupon = {
                    Alojamiento: this.valorDescuentoCupon(this.precioAlojamientoSinDescuento),
                    'Adulto Adicional': this.valorDescuentoCupon(this.precioAdultosSinDescuento),
                    Decoracion: this.valorDescuentoCupon(this.precioDecoracionSinDescuento),
                    Desayuno: this.valorDescuentoCupon(this.precioDesayunoSinDescuento),
                    'Niño Adicional': this.valorDescuentoCupon(this.precioNiñosSinDescuento),
                    Todo: this.precioTotalSinDescuento,
                }

                data.cupon = {
                    id: this.cupon.id,
                    codigo: this.cupon.codigo,
                    nombre: this.cupon.nombre,
                    esPorcentaje: this.cupon.tipo == 'Porcentaje',
                    porcentaje: this.cupon.tipo == 'Porcentaje' ? this.cupon.descuento : null,
                    descuento: this.cupon.tipo == 'Precio' ? this.cupon.descuento : descuentoCupon[this.cupon.precio],
                }
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
         * Verifica si una URL corresponde a una imagen basándose en su extensión.
         * @param {string} url - La URL de la imagen.
         * @returns {boolean} True si la URL corresponde a una imagen, False en caso contrario.
         */
        esImagen(url) {
            // Extraer la extensión del archivo de la URL
            const extension = url.split('.').pop().toLowerCase()

            // Lista de extensiones de archivos de imagen
            const extensionesImagen = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg']

            // Verificar si la extensión está en la lista de extensiones de imagen
            return extensionesImagen.includes(extension)
        },
        getTarifaEspecial(date) {
            if(this.room.tarifasEspeciales == null) return false
            return this.room.tarifasEspeciales.find(tarifa => date == tarifa.fecha)
        },
        /**
         * Obtiene la información de desayunos, decoraciones y características para ser utilizada en el agendamiento.
         * Actualiza las variables 'desayunos', 'decoraciones' y 'caracteristicas'.
         */
        getDatos() {

            if (this.room.tieneDesayuno) {
                service.obtenerDesayunos()
                    .then(res => {
                        this.desayunos = [...this.desayunos, ...res]
                    })
                    .catch(err => {
                        console.error(err)
                    })
            }

            if (this.room.tieneDecoracion) {
                service.obtenerDecoraciones()
                    .then(res => {
                        this.decoraciones = [...this.decoraciones, ...res]
                    })
                    .catch(err => {
                        console.error(err)
                    })
            }

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

            service.obtenerDescuentosEstadia(this.room.id)
                .then(res => {
                    this.descuentoEstadia = res.reduce((menorDescuento, descuento) => {
                        return descuento.diasEstadia < menorDescuento.diasEstadia ? descuento : menorDescuento
                    })
                })
                .catch(err => {
                    console.error(err)
                })

            service.obtenerCupones(this.room.id)
                .then(res => {
                    this.cupones = res
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
                        this.canReservar = res.usuarioReserva
                        this.calendarioInhabilitado = res.calendarioInhabilitado
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
        /**
         * Calcula el valor de descuento aplicado a un precio especifico.
         */
        valorDescuento(precio) {
            // Inicializa el descuento en 0
            let descuento = 0

            // Itera sobre cada descuento
            this.descuentos.forEach(discount => {
                // Verifica si las fechas de llegada y salida están dentro del rango de fechas del descuento
                if (this.fechaLlegada <= discount.fechaInicio && this.fechaSalida >= discount.fechaFin) {
                    // Aplica el descuento según el tipo (Porcentaje o Valor Fijo)
                    if (discount.tipo == 'Porcentaje') {
                        // Si el descuento es de tipo porcentaje, calcula el descuento en base al precio y lo agrega al descuento
                        descuento += (precio * discount.descuento / 100)
                    } else {
                        // Si el descuento es de valor fijo, simplemente lo agrega al descuento
                        descuento += discount.descuento
                    }
                }
            });

            // Devuelve el descuento total
            return descuento
        },
        /**
         * Calcula el valor del descuento aplicable al precio del alojamiento según el cupón.
         * @param {number} precio - El precio del alojamiento antes de aplicar el descuento del cupón.
         * @returns {number} El valor del descuento del cupón.
         */
        valorDescuentoCupon(precio) {
            // Inicializa el descuento en 0
            let descuentoCupon = 0

            // Verifica si las fechas del cupón son válidas
            if (!this.fechasValidasCupon()) {
                return 0
            }

            if (this.cupon.documento != null && this.cupon.documento != this.documento) {
                return 0
            }

            // Aplica el descuento según el tipo de cupón
            if (this.cupon.tipo === 'Porcentaje') {
                descuentoCupon += precio * (this.cupon.descuento / 100)
            }

            if (this.cupon.tipo === 'Precio') {
                descuentoCupon += this.cupon.descuento
            }

            return descuentoCupon
        },
        /**
         * Verifica si las fechas de llegada y salida están dentro del período de validez de al menos uno de los cupones.
         * @returns {boolean} True si las fechas están dentro del período de validez de al menos un cupón, False en caso contrario.
         */
        fechasValidasEnCupones() {
            // Itera sobre los cupones disponibles
            for (let i = 0; i < this.cupones.length; i++) {
                const cupon = this.cupones[i]

                // Verifica si las fechas de llegada y salida están dentro del período de validez del cupón actual
                if (this.dates.length === 2 && cupon.fechaInicio <= this.fechaLlegada && this.fechaSalida <= cupon.fechaFin) {
                    return true
                }
            }

            return false
        },
        /**
         * Verifica si las fechas de llegada y salida están dentro del período de validez del cupón actual.
         * @returns {boolean} True si las fechas están dentro del período de validez del cupón, False en caso contrario.
         */
        fechasValidasCupon() {
            return this.dates.length === 2 && this.cupon.fechaInicio <= this.fechaLlegada && this.fechaSalida <= this.cupon.fechaFin;
        },
        /**
         * Verifica el cupón ingresado y actualiza el cupón actual en base a la respuesta del servicio.
         */
        checkCupon() {
            // Llama al servicio para obtener información sobre el cupón
            service.obtenerCupon(this.codigoCupon, this.room.id)
                .then(res => {
                    // Actualiza el cupón actual con la respuesta del servicio
                    this.cupon = res
                })
                .catch(err => {
                    // Muestra un mensaje de error si ocurre algún problema al obtener el cupón
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: err.response.data.message,
                    })
                })
        },
        /**
         * Convierte el valor de una variable a mayúsculas.
         * @param {string} variable - El nombre de la variable cuyo valor se convertirá a mayúsculas.
         */
        toUpperCase(variable) {
            try {
                // Convierte el valor de la variable a mayúsculas
                this[variable] = this[variable].toUpperCase()
            } catch (err) {
                // Maneja cualquier error que pueda ocurrir durante la conversión
                console.error('Error al convertir a mayúsculas:', err)
            }
        },
        /**
         * Obtiene la información del usuario mediante su número de cédula y actualiza el teléfono del usuario actual.
         */
        getUser() {
            // Busca al cliente usando su número de cédula
            service.encontrarClienteDocumento(this.documento)
                .then(res => {
                    // Verifica si se encontró al cliente y actualiza el teléfono si está disponible
                    if ('id' in res) {
                        this.telefono = res.telefono
                    }
                })
                .catch(err => {
                    // Maneja cualquier error que pueda ocurrir durante la búsqueda del cliente
                    console.error(err)
                })
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

.imgCarousel {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.videoCarousel {
    width: 100%;
    height: 100%;
}

.text-small {
    font-size: 65%;
    padding-inline: 10px;
}

@media only screen and (max-width: 800px) {
    .contenido {
        flex-direction: column;
        align-items: center;
    }
}
</style>