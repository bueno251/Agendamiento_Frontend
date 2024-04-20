<template>
    <v-dialog :value="show" width="90%" max-width="500px" persistent>
        <v-card class="pa-5">
            <v-toolbar elevation="0">
                <v-spacer />
                <v-btn icon class="ml-3" @click="$emit('close')">
                    <v-icon>mdi-close-box</v-icon>
                </v-btn>
            </v-toolbar>
            <v-form v-model="valid" @submit.prevent="save()">
                <v-row>

                    <v-col cols="12">
                        <v-text-field v-model="Adicional" v-price :rules="[rules.required, rules.numerico]"
                            @input="formatNumber('Adicional', Adicional)" dense outlined required>

                            <template v-slot:label>
                                Tarifa Persona <span class="red--text">*</span>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12">
                        <v-text-field v-model="Niños" v-price :rules="[rules.required, rules.numerico]"
                            @input="formatNumber('Niños', Niños)" dense outlined required>

                            <template v-slot:label>
                                Tarifa Niños <span class="red--text">*</span>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="6">
                        <div class="flex">
                            <p>
                                Tienen Un Impuesto?
                            </p>
                            <v-switch v-model="tieneIva" :label="tieneIva ? 'Si' : 'No'" inset></v-switch>
                        </div>
                    </v-col>

                    <v-col v-if="tieneIva" cols="12" md="6" sm="6">
                        <v-select v-model="impuesto" :items="impuestos" :rules="[rules.required]"
                            :item-text="item => `${item.codigo} (${item.tasa}%)`" item-value="id" dense outlined
                            required>

                            <template v-slot:label>
                                Impuesto <span class="red--text">*</span>
                            </template>

                            <template v-slot:prepend-item>
                                <v-list-item ripple @mousedown.prevent @click="createImpuestoDialog = true">
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            Añadir Impuesto
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-divider class="mt-2"></v-divider>
                            </template>
                        </v-select>
                    </v-col>
                </v-row>

                <div class="buttons pt-5">
                    <v-btn @click="$emit('close')" color="blue">
                        cancelar
                    </v-btn>
                    <v-btn :disabled="!valid" type="submit" :loading="loading" class="light-green black--text">
                        guardar
                    </v-btn>
                </div>
            </v-form>
        </v-card>

        <createImpuesto :show="createImpuestoDialog" @close="createImpuestoDialog = false" @update="getImpuestos" />

    </v-dialog>
</template>

<script>

import Swal from 'sweetalert2'
import service from '@/services/service'
import createImpuesto from '@/modules/impuestos/components/createImpuesto.vue'

export default {
    name: 'PreciosExtra',
    props: {
        show: Boolean,
        room: Object,
    },
    components: {
        createImpuesto,
    },
    watch: {
        // Observa cambios en la propiedad 'room'
        room: {
            // Función que se ejecuta cuando hay cambios en 'room'
            handler(newItem) {
                // Verifica si 'precios' está presente en 'newItem'
                if ("precios" in newItem) {
                    this.tieneIva = false
                    this.impuesto = ''

                    // Itera sobre los precios y actualiza los valores si son 'Adicional' o 'Niños'
                    newItem.precios.map((tarifa) => {

                        if (tarifa.name == 'Adicional' || tarifa.name == 'Niños') {
                            this[tarifa.name] = this.comaEnMiles(tarifa.precio != 0 ? tarifa.precio : 60000)
                            if (tarifa.impuestoId) {
                                this.impuesto = tarifa.impuestoId
                                this.tieneIva = true
                            }
                        }
                    })

                }
            },
            // Indica que el 'handler' debe ejecutarse inmediatamente después de la vinculación del watch
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
            impuesto: '',
            edadNiños: '',
            tieneIva: false,
            valid: false,
            loading: false,
            createImpuestoDialog: false,
            impuestos: [],
            rules: {
                required: value => !!value || 'Campo requerido.',
                numerico: value => /^[0-9.]+$/.test(value) || "Solo se admiten números y puntos."
            },
        }
    },
    methods: {
        /**
         * Guarda los precios de la habitación.
         */
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
                impuesto: this.impuesto,
                tieneIva: this.tieneIva,
                tarifas: week
            }

            // Llamada al servicio para guardar los precios
            service.guardarTarifas(data, this.room.id)
                .then(res => {
                    this.loading = false
                    this.dialogTarifasExtra = false
                    this.$emit('close')
                    this.$emit('update')
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
         * Formatea el número de un día de la semana agregando comas para separar miles.
         * @param {object} precio - Objeto que representa un día de la semana con un precio.
         */
        formatNumber(value, precio) {
            let formattedNumber = precio.replace(/\D/g, '') // Elimina caracteres no numéricos del precio
            this[value] = this.comaEnMiles(formattedNumber) // Formatea el número con comas
        },
        getImpuestos() {
            service.obtenerImpuestos()
                .then(res => {
                    this.impuestos = res
                })
                .catch(err => {
                    console.error(err)
                })
        },
    },
    mounted() {
        this.getImpuestos()
    },

}
</script>

<style scoped>
.flex {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    gap: 10px;
}

.flex p {
    padding: 0;
    margin: 0;
    text-wrap: balance;
}
</style>