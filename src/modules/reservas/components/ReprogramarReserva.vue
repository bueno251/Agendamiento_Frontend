<template>
    <v-dialog :value="show" width="90%" max-width="500px" persistent>
        <v-card class="pa-5">
            <v-form ref="formReprogramar" v-model="validReprogramar" @submit.prevent="reprogramar">
                <v-row>
                    <v-col cols="12" md="6" sm="6">
                        <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false"
                            transition="scale-transition" offset-y min-width="auto">

                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="fechas[0]" :rules="[rules.required]"
                                    prepend-inner-icon="mdi-calendar" v-bind="attrs" v-on="on" readonly outlined
                                    required>
                                    <template v-slot:label>
                                        Fecha Entrada <span class="red--text">*</span>
                                    </template>
                                </v-text-field>
                            </template>

                            <v-date-picker v-model="fechas" :min="hoy" @change="save('menu1', fechas)" locale="es" range
                                no-title scrollable>
                            </v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-col cols="12" md="6" sm="6">
                        <v-menu ref="menu2" v-model="menu2" :close-on-content-click="false"
                            transition="scale-transition" offset-y min-width="auto">

                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="fechas[1]" :rules="[rules.required]"
                                    prepend-inner-icon="mdi-calendar" v-bind="attrs" v-on="on" readonly outlined
                                    required>
                                    <template v-slot:label>
                                        Fecha Salida <span class="red--text">*</span>
                                    </template>
                                </v-text-field>
                            </template>

                            <v-date-picker v-model="fechas" :min="hoy" @change="save('menu2', fechas)" locale="es" range
                                no-title scrollable>
                            </v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-col cols="12">
                        <v-select v-model="motivo" :items="motivos" :rules="[rules.required]"
                            no-data-text="Espere un momento..." item-text="nombre" item-value="id" outlined required>
                            <template v-slot:label>
                                Motivo <span class="red--text">*</span>
                            </template>
                        </v-select>
                    </v-col>
                </v-row>

                <div class="buttons">
                    <v-btn @click="$emit('close')" color="error"
                        class="white--text text--accent-4">cancelar</v-btn>
                    <v-btn type="submit" :loading="loadingbtn" color="primary">reprogramar</v-btn>
                </div>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>

import Swal from 'sweetalert2'
import service from '@/services/service'

export default {
    name: 'ReprogramarReserva',
    props: {
        show: Boolean,
        reserva: Object,
    },
    computed: {
        fechaEntrada() {
            return this.fechas[0] || ''
        },
        fechaSalida() {
            return this.fechas[1] || ''
        },
    },
    watch: {
        fechaSalida: function () {
            if (this.fechas.length > 1) {
                let fecha1 = new Date(this.fechas[0])
                let fecha2 = new Date(this.fechas[1])

                // Ajusta la fecha de salida si es igual a la fecha de llegada
                if (fecha1.toISOString().slice(0, 10) === fecha2.toISOString().slice(0, 10)) {
                    fecha2.setDate(fecha2.getDate() + 1)
                    this.fechas[1] = fecha2.toISOString().slice(0, 10)
                }

                // Ordena las fechas de Inicio y Fin
                let sortfechas = this.fechas.toSorted()
                this.fechas = sortfechas
            }
        },
    },
    data() {
        return {
            motivo: '',
            loadingbtn: false,
            validReprogramar: false,
            menu1: false,
            menu2: false,
            hoy: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            fechas: [],
            motivos: [],
            rules: {
                required: value => !!value || 'Campo requerido.',
            },
        }
    },
    methods: {
        reprogramar() {
            this.loadingbtn = true

            let data = {
                reserva: this.reserva.id,
                motivo: this.motivo,
                nuevaFechaEntrada: this.fechaEntrada,
                nuevaFechaSalida: this.fechaSalida,
                antiguaFechaEntrada: this.reserva.fechaEntrada,
                antiguaFechaSalida: this.reserva.fechaSalida,
            }

            service.reprogramarReserva(data)
                .then(res => {
                    this.loadingbtn = false
                    this.$emit('close')
                    this.$emit('update')
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
         * Invoca el método 'save' del componente referenciado por 'menu'.
         * @param {string} menu - Nombre del menú referenciado.
         * @param {Date} date - Fecha que se pasa al método 'save'.
         */
        save(menu, date) {
            this.$refs[menu].save(date)
        },
        getDatos() {
            service.obtenerMotivosReprogramar()
                .then(res => {
                    this.motivos = res
                })
                .catch(err => {
                    console.error(err)
                })
        },
    },
    mounted() {
        this.getDatos()
    },
}
</script>

<style scoped></style>