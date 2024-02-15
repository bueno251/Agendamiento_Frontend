<template>
    <v-dialog :value="show" width="90%" max-width="500px" persistent>
        <v-card class="pa-5">
            <v-form v-model="valid" @submit.prevent="save()">
                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="Adicional" label="Tarifa Personal" :rules="[rules.required, rules.numerico]"
                            @input="formatNumber('Adicional', Adicional)" outlined required>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="Niños" label="Tarifa Niños" :rules="[rules.required, rules.numerico]"
                            @input="formatNumber('Niños', Niños)" outlined required>
                        </v-text-field>
                    </v-col>
                </v-row>
                <div class="buttons pt-5">
                    <v-btn @click="close" color="blue">cancelar</v-btn>
                    <v-btn :disabled="!valid" type="submit" :loading="loading" color="light-green">guardar</v-btn>
                </div>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>

import Swal from 'sweetalert2';
import roomService from '../service/roomService';

export default {
    name: 'PreciosExtra',
    props: {
        show: Boolean,
        room: Object,
    },
    watch: {
        room: {
            handler(newItem) {
                if ("precios" in newItem) {

                    this.Adicional = 0
                    this.Niños = 0

                    newItem.precios.map((day) => {
                        if (day.name == 'Adicional' || day.name == 'Niños') {
                            this[day.name] = this.comaEnMiles(day.precio)
                        }
                    })
                }
            },
            immediate: true
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
            valid: false,
            loading: false,
            rules: {
                required: value => !!value || 'Campo requerido.',
                numerico: value => /^[0-9.]+$/.test(value) || "Solo se admiten números y puntos."
            },
        }
    },
    methods: {
        save() {
            this.loading = true

            let week = [
                {
                    name: 'Adicional',
                    precio: parseInt(this.Adicional.replace(/\./g, '')),
                    jornada_id: null,
                },
                {
                    name: 'Niños',
                    precio: parseInt(this.Niños.replace(/\./g, '')),
                    jornada_id: null,
                },
            ]

            let data = {
                weekdays: week
            }

            roomService.savePrecios(data, this.room.id)
                .then(res => {
                    this.loading = false
                    this.dialogTarifasExtra = false
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
                    console.log(err)
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
        close() {
            this.$emit('close')
        },
    }

}
</script>

<style scoped></style>