<template>
    <v-dialog :value="show" width="90%" persistent>
        <v-card class="pa-5">
            <v-form ref="form" v-model="valid" @submit.prevent="updateClient">
                <v-row>

                    <v-col cols="12" md="4">
                        <v-select v-model="tipoDocumento" :items="tipoDocuments" :rules="[rules.required]"
                            no-data-text="Espere un momento..." item-text="tipo" item-value="id" outlined required>
                            <template v-slot:label>
                                Tipo de documento<span class="red--text">*</span>
                            </template>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-text-field v-model="documento" :rules="[rules.required, rules.min]"
                            @click:append="searchDocument" append-icon="mdi-magnify" type="number" outlined
                            hide-spin-buttons required>
                            <template v-slot:label>
                                Documento<span class="red--text">*</span>
                            </template>
                            <template v-slot:append-outer>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-icon v-on="on">
                                            mdi-help-circle-outline
                                        </v-icon>
                                    </template>
                                    Buscar documento
                                </v-tooltip>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3">
                        <v-text-field v-model="nombre1" :rules="[rules.required]" outlined required>
                            <template v-slot:label>
                                Primer Nombre<span class="red--text">*</span>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3">
                        <v-text-field v-model="nombre2" outlined>
                            <template v-slot:label>
                                Segundo Nombre
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3">
                        <v-text-field v-model="apellido1" :rules="[rules.required]" outlined required>
                            <template v-slot:label>
                                Primer Apellido<span class="red--text">*</span>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3">
                        <v-text-field v-model="apellido2" outlined>
                            <template v-slot:label>
                                Segundo Apellido
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-text-field v-model="direccion" :rules="[rules.required]" append-icon="mdi-map-marker" outlined
                            required>
                            <template v-slot:label>
                                Direccion<span class="red--text">*</span>
                            </template></v-text-field>
                    </v-col>

                    <v-col cols="12" md="3">
                        <v-text-field v-model="telefono" :rules="[rules.required, rules.phone]" type="number"
                            append-icon="mdi-cellphone" outlined required>
                            <template v-slot:label>
                                Teléfono Celular<span class="red--text">*</span>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3">
                        <v-text-field v-model="telefonoAlt" type="number" append-icon="mdi-phone" outlined>
                            <template v-slot:label>
                                Teléfono Alternativo
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-select v-model="pais" :items="countries" item-text="country_name" item-value="country_name"
                            :rules="[rules.required]" @change="getStates" no-data-text="Espere un momento..." outlined
                            required>
                            <template v-slot:label>
                                País<span class="red--text">*</span>
                            </template>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-select v-model="departamento" :items="states" item-text="state_name" item-value="state_name"
                            :loading="loadingState" @change="getCities" no-data-text="No hay departamentos" outlined>
                            <template v-slot:label>
                                Departamento<span class="red--text">*</span>
                            </template>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-select v-model="ciudad" :items="cities" item-text="city_name" item-value="city_name"
                            :loading="loadingCity" no-data-text="No hay ciudades" outlined>
                            <template v-slot:label>
                                Ciudad<span class="red--text">*</span>
                            </template>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-select v-model="tipoPersona" :items="tipoPeople" :rules="[rules.required]"
                            no-data-text="Espere un momento..." item-text="tipo" item-value="id" outlined>
                            <template v-slot:label>
                                Tipo de Persona<span class="red--text">*</span>
                            </template>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-select v-model="tipoObligacion" :items="tipoObligations" :rules="[rules.required]"
                            no-data-text="Espere un momento..." item-text="tipo" item-value="id" outlined>
                            <template v-slot:label>
                                Tipo de Obligación<span class="red--text">*</span>
                            </template>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-select v-model="tipoRegimen" :items="tipoRegimens" :rules="[rules.required]"
                            no-data-text="Espere un momento..." item-text="tipo" item-value="id" outlined>
                            <template v-slot:label>
                                Tipo de Régimen<span class="red--text">*</span>
                            </template>
                        </v-select>
                    </v-col>

                    <v-col cols="12">
                        <v-textarea v-model="observacion" auto-grow rows="5" dense label="Observaciones"
                            outlined></v-textarea>
                    </v-col>

                </v-row>

                <div class="buttons">
                    <v-btn @click="close" color="blue">cancelar</v-btn>
                    <v-btn :disabled="!valid" type="submit" :loading="loadingbtn" color="light-green">actualizar</v-btn>
                </div>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>

import Swal from 'sweetalert2'
import clienteService from '../services/clienteService'
import UbicacionService from '../services/UbicacionService'

export default {
    name: 'DialogUpdate',
    props: {
        show: Boolean,
        client: Object,
    },
    data() {
        return {
            tipoDocumento: '',
            documento: '',
            nombre1: '',
            nombre2: '',
            apellido1: '',
            apellido2: '',
            direccion: '',
            pais: '',
            departamento: '',
            ciudad: '',
            telefono: '',
            telefonoAlt: '',
            tipoPersona: '',
            tipoObligacion: '',
            tipoRegimen: '',
            observacion: '',
            valid: false,
            loadingbtn: false,
            loadingState: false,
            loadingCity: false,
            tipoDocuments: [],
            tipoObligations: [],
            tipoPeople: [],
            tipoRegimens: [],
            countries: [],
            cities: [],
            states: [],
            rules: {
                required: value => !!value || 'Campo requerido.',
                max: value => (value && value.length <= 20) || 'Maximo 20 caracteres',
                min: value => (value && value.length >= 5) || 'Minimo 5 caracteres',
                phone: value => {
                    const pattern = /^(\+?[0-9]{1,3}[-.\s]?)?(\([0-9]{1,4}\)|[0-9]{1,4})[-.\s]?[0-9]{1,10}$/
                    return pattern.test(value) || 'Número de teléfono inválido.'
                },
            },
        }
    },
    methods: {
        /**
        * Actualiza la información de un cliente existente en la base de datos.
        * Muestra un mensaje de éxito o error y emite un evento 'update'.
        */
        updateClient() {
            // Habilitar la animación de carga
            this.loadingbtn = true

            // Construir objeto con los datos del cliente a actualizar
            let data = {
                nombre1: this.nombre1,
                nombre2: this.nombre2,
                apellido1: this.apellido1,
                apellido2: this.apellido2,
                tipoDocumento: this.tipoDocumento,
                documento: this.documento,
                direccion: this.direccion,
                pais: this.pais,
                departamento: this.departamento,
                ciudad: this.ciudad,
                telefono: this.telefono,
                telefonoAlt: this.telefonoAlt,
                tipoPersona: this.tipoPersona,
                tipoObligacion: this.tipoObligacion,
                tipoRegimen: this.tipoRegimen,
                observacion: this.observacion,
            }

            // Llamar al servicio para actualizar el cliente en la base de datos
            clienteService.actualizar(data, this.client.id)
                .then(res => {
                    // Desactivar la animación de carga, emitir evento 'update' y mostrar mensaje de éxito
                    this.loadingbtn = false
                    this.$emit('update')
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })
                })
                .catch(err => {
                    // Desactivar la animación de carga y mostrar mensaje de error
                    this.loadingbtn = false
                    Swal.fire({
                        icon: 'error',
                        text: err.response.data.message,
                    })
                    console.log(err)
                })
        },
        /**
         * Obtiene los tipos de documentos, obligaciones, personas y regímenes
         * desde el servicio de cliente y los asigna a las variables correspondientes.
         */
        getTypes() {
            // Llamar al servicio para obtener los tipos desde la base de datos
            clienteService.obtenerTipos()
                .then(res => {
                    // Asignar los tipos a las variables correspondientes
                    this.tipoDocuments = res.documents
                    this.tipoObligations = res.obligations
                    this.tipoPeople = res.people
                    this.tipoRegimens = res.regimens
                })
                .catch(err => {
                    console.log(err)
                })
        },
        /**
         * Obtiene la lista de países desde el servicio de ubicación
         * y la asigna a la variable 'countries'.
         */
        getCountries() {
            // Obtener la lista de países
            UbicacionService.paises()
                .then(res => {
                    // Asignar la lista de países a la variable 'countries'
                    this.countries = res
                })
                .catch(err => {
                    console.log(err)
                })
        },
        /**
         * Obtiene la lista de estados para el país seleccionado
         * desde el servicio de ubicación y la asigna a la variable 'states'.
         */
        getStates() {
            // Habilitar la animación de carga y restablecer las variables relacionadas con el departamento
            this.loadingState = true
            this.departamento = ''
            this.ciudad = ''
            this.cities = []

            // Obtener la lista de estados para el país seleccionado
            UbicacionService.departamentos(this.pais)
                .then(res => {
                    // Asignar la lista de estados a la variable 'states' y desactivar la animación de carga
                    this.states = res
                    this.loadingState = false
                })
                .catch(err => {
                    console.log(err)
                    this.loadingState = false
                })
        },
        /**
        * Obtiene la lista de ciudades para el departamento seleccionado
        * desde el servicio de ubicación y la asigna a la variable 'cities'.
        */
        getCities() {
            // Habilitar la animación de carga y restablecer la variable relacionada con la ciudad
            this.loadingCity = true
            this.ciudad = ''

            // Obtener la lista de ciudades para el departamento seleccionado
            UbicacionService.ciudades(this.departamento)
                .then(res => {
                    // Asignar la lista de ciudades a la variable 'cities' y desactivar la animación de carga
                    this.cities = res
                    this.loadingCity = false
                })
                .catch(err => {
                    console.log(err)
                    this.loadingCity = false
                })
        },
        /**
         * Busca un documento en la base de datos y muestra un mensaje
         * indicando si el documento ya está registrado o está disponible.
         */
        searchDocument() {
            // Verificar si hay un documento para buscar
            if (!this.documento) {
                Swal.fire({
                    icon: 'error',
                    text: 'No hay documento a buscar',
                })
                return
            }

            // Buscar el documento en la base de datos
            clienteService.encontrarDocumento(this.documento)
                .then(res => {
                    // Mostrar mensaje según el resultado de la búsqueda
                    if (res.length) {
                        Swal.fire({
                            icon: 'error',
                            text: 'Ya se encuentra registrado ese número de documento',
                        })
                    } else {
                        Swal.fire({
                            icon: 'success',
                            text: 'Documento disponible',
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        /**
         * Cierra el componente emitiento un evento 'close'.
         */
        close() {
            // Emitir evento 'close'
            this.$emit('close')
        },
    },
    watch: {
        client: {
            handler(newclient) {
                this.nombre = newclient.nombre
                this.tipoDocumento = newclient.tipo_documento_id
                this.documento = newclient.documento
                this.nombre1 = newclient.nombre1
                this.nombre2 = newclient.nombre2
                this.apellido1 = newclient.apellido1
                this.apellido2 = newclient.apellido2
                this.direccion = newclient.direccion
                this.pais = newclient.pais
                this.telefono = newclient.telefono
                this.telefonoAlt = newclient.telefono_alt
                this.tipoPersona = newclient.tipo_persona_id
                this.tipoObligacion = newclient.tipo_obligacion_id
                this.tipoRegimen = newclient.tipo_regimen_id
                this.observacion = newclient.observacion
                if (newclient.pais) {
                    this.getStates()
                    this.departamento = newclient.departamento
                    this.getCities()
                    this.ciudad = newclient.ciudad
                }
            },
            immediate: true,
        }
    },
    mounted() {
        this.getTypes()
        this.getCountries()
    },
}
</script>

<style scoped>
.buttons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 15px;
}
</style>