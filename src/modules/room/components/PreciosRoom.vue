<template>
    <v-dialog :value="show" width="95%" persistent>
        <v-card class="pa-5">
            <v-toolbar elevation="0">
                <v-spacer />
                <v-btn icon class="ml-3" @click="$emit('close')">
                    <v-icon>mdi-close-box</v-icon>
                </v-btn>
            </v-toolbar>
            <v-form ref="form" v-model="valid" @submit.prevent="save()">
                <div class="grid">

                    <template v-for="(weekday, i) in week">
                        <div v-if="i < 7" class="day" v-bind:key="weekday.nombre">
                            <v-col cols="12">
                                <div class="flex">
                                    <label>{{ weekday.name }}</label>
                                    <v-select class="ma-0" v-model="weekday.jornada_id" :items="jornadas"
                                        no-data-text="Espere un momento..." :rules="[rules.required]" label="Jornada"
                                        item-text="nombre" item-value="id" :style="{ transform: 'scale(0.6, 0.6)' }"
                                        dense outlined>
                                    </v-select>
                                </div>
                            </v-col>

                            <v-col cols="12">
                                <v-text-field v-model="weekday.precio" :rules="[rules.required, rules.numerico]"
                                    label="Precio" v-price @input="formatNumber(weekday.precio)" hide-spin-buttons dense
                                    outlined required>
                                </v-text-field>
                            </v-col>

                            <v-col cols="12">
                                <v-text-field v-model="weekday.previoFestivo" :rules="[rules.required, rules.numerico]"
                                    label="Precio Previo A Festivo" v-price @input="formatNumber(weekday.previoFestivo)"
                                    hide-spin-buttons dense outlined required>
                                </v-text-field>
                            </v-col>
                        </div>
                    </template>

                </div>

                <div class="buttons">
                    <v-btn @click="$emit('close')" color="blue">cancelar</v-btn>
                    <v-btn :disabled="!valid" type="submit" :loading="loading" class="light-green black--text">guardar</v-btn>
                </div>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>

import Swal from 'sweetalert2'
import service from '@/services/service'

export default {
    name: 'PreciosRoom',
    props: {
        show: Boolean,
        room: Object,
    },
    watch: {
        room: {
            // Función que se ejecuta cuando hay cambios en 'room'
            handler(newItem) {
                // Verifica si 'newItem' tiene un valor y si la propiedad 'show' es verdadera
                if (this.show && 'id' in newItem) {
                    // Llama al método 'getPrecios' para obtener información relacionada con el nuevo 'room'
                    this.obtenerPrecios()
                }
            },
            // Indica que el 'handler' debe ejecutarse inmediatamente después de la vinculación del watch
            immediate: true,
        }
    },
    // Directiva personalizada llamada 'price'
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
            valid: false,
            loading: false,
            week: [
                { name: 'Domingo', precio: '250.000', previoFestivo: '330.000', jornada_id: 1 },
                { name: 'Lunes', precio: '250.000', previoFestivo: '330.000', jornada_id: 1 },
                { name: 'Martes', precio: '250.000', previoFestivo: '330.000', jornada_id: 1 },
                { name: 'Miércoles', precio: '250.000', previoFestivo: '330.000', jornada_id: 1 },
                { name: 'Jueves', precio: '250.000', previoFestivo: '330.000', jornada_id: 1 },
                { name: 'Viernes', precio: '330.000', previoFestivo: '330.000', jornada_id: 2 },
                { name: 'Sábado', precio: '330.000', previoFestivo: '330.000', jornada_id: 2 },
            ],
            jornadas: [],
            rules: {
                required: value => !!value || 'Campo requerido.',
                numerico: value => /^[0-9.]+$/.test(value) || "Solo se admiten números y puntos."
            },
        }
    },
    methods: {
        /**
         * Guarda los precios para cada día de la semana.
         */
        save() {
            this.loading = true

            // Mapea los datos de la semana para prepararlos para ser enviados al servidor
            let week = []

            this.week.map(({ name, precio, previoFestivo, jornada_id }) => {
                let dia = {
                    name: name,
                    precio: parseInt(precio.replace(/\./g, '')), // Convierte el precio a entero eliminando puntos de separación de miles
                    previoFestivo: parseInt(previoFestivo.replace(/\./g, '')), // Convierte el precio a entero eliminando puntos de separación de miles
                    jornada_id: jornada_id
                }
                week.push(dia);
            })

            let data = {
                impuesto: this.room.impuestoId,
                tieneIva: this.room.tieneIva,
                tarifas: week,
            }

            // Llama al servicio para guardar los precios en el servidor
            service.guardarTarifas(data, this.room.id)
                .then(res => {
                    this.loading = false
                    this.$emit('close')
                    this.$emit('update') // Emite un evento para indicar que se han actualizado los precios
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
         * Formatea un número agregando comas para separar miles.
         * @param {number} numero - Número que se formateará.
         * @returns {string} Número formateado con comas.
         */
        comaEnMiles(numero) {
            let exp = /(\d)(?=(\d{3})+(?!\d))/g //* expresión regular que busca tres dígitos
            let rep = '$1.' // parámetro especial para splice porque los números no son menores a 100
            return numero.toString().replace(exp, rep)
        },
        /**
         * Formatea el número de un día de la semana agregando comas para separar miles.
         * @param {object} day - Objeto que representa un día de la semana con un precio.
         */
        formatNumber(precio) {
            let formattedNumber = precio.replace(/\D/g, '') // Elimina caracteres no numéricos del precio
            precio = this.comaEnMiles(formattedNumber) // Formatea el número con comas
        },
        /**
         * Obtiene los precios guardados para la habitación y los muestra en la interfaz de usuario.
         */
        obtenerPrecios() {
            service.obtenerTarifas(this.room.id)
                .then(res => {
                    this.week = [
                        { name: 'Domingo', precio: '330.000', previoFestivo: '330.000', jornada_id: 2 },
                        { name: 'Lunes', precio: '250.000', previoFestivo: '330.000', jornada_id: 1 },
                        { name: 'Martes', precio: '250.000', previoFestivo: '330.000', jornada_id: 1 },
                        { name: 'Miércoles', precio: '250.000', previoFestivo: '330.000', jornada_id: 1 },
                        { name: 'Jueves', precio: '250.000', previoFestivo: '330.000', jornada_id: 1 },
                        { name: 'Viernes', precio: '250.000', previoFestivo: '330.000', jornada_id: 1 },
                        { name: 'Sábado', precio: '330.000', previoFestivo: '330.000', jornada_id: 2 },
                    ]

                    this.$refs.form.resetValidation()

                    if (res.length) {
                        res.map((day) => {
                            const index = this.week.findIndex((weekDay) => weekDay.name === day.name)

                            if (index !== -1) {
                                this.week[index].precio = this.comaEnMiles(day.precio)
                                this.week[index].previoFestivo = this.comaEnMiles(day.previoFestivo)
                                this.week[index].jornada_id = day.jornada_id
                            }
                        });
                    }
                })
                .catch(err => {
                    console.error(err)
                })
        },
        /**
         * Obtiene las jornadas disponibles.
         */
        getJornadas() {
            service.obtenerJornadas()
                .then(res => {
                    this.jornadas = res
                })
                .catch(err => {
                    console.error(err)
                })
        },
        /**
         * Cierra el formulario de precios.
         */
        close() {
            this.$refs.form.resetValidation()
            this.$emit('close') // Emite un evento para indicar que se ha cerrado el formulario
        },
    },
    mounted() {
        this.getJornadas()
    },
}
</script>

<style scoped>
.flex {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 70%;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.buttons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 15px;
}
</style>