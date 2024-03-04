<template>
    <v-dialog :value="show" width="90%" persistent>
        <v-card class="pa-5">
            <v-form ref="form" v-model="valid" @submit.prevent="newClient">
                <v-row>

                    <v-col cols="12" md="4" sm="6">
                        <v-select v-model="tipoDocumento" :items="tipoDocuments" :rules="[rules.required]"
                            no-data-text="Espere un momento..." item-text="tipo" item-value="id" outlined required>
                            <template v-slot:label>
                                Tipo de documento <span class="red--text">*</span>
                            </template>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="6" sm="6">
                        <v-text-field v-model="documento" :rules="[rules.required, rules.min]"
                            @click:append="searchDocument" type="number" append-icon="mdi-magnify" hide-spin-buttons
                            outlined required>
                            <template v-slot:label>
                                Documento <span class="red--text">*</span>
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

                    <v-col cols="12" md="3" sm="6">
                        <v-text-field v-model="nombre1" :rules="[rules.required, rules.textOnly]" outlined required>
                            <template v-slot:label>
                                Primer Nombre <span class="red--text">*</span>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <v-text-field v-model="nombre2" :rules="[rules.textOnly]" outlined>
                            <template v-slot:label>
                                Segundo Nombre
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <v-text-field v-model="apellido1" :rules="[rules.required, rules.textOnly]" outlined required>
                            <template v-slot:label>
                                Primer Apellido <span class="red--text">*</span>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <v-text-field v-model="apellido2" :rules="[rules.textOnly]" outlined>
                            <template v-slot:label>
                                Segundo Apellido
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="6">
                        <v-text-field v-model="direccion" :rules="[rules.required]" append-icon="mdi-map-marker" outlined
                            required>
                            <template v-slot:label>
                                Direccion <span class="red--text">*</span>
                            </template></v-text-field>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <v-text-field v-model="telefono" :rules="[rules.required, rules.phone]" type="number"
                            append-icon="mdi-cellphone" hide-spin-buttons outlined required>
                            <template v-slot:label>
                                Teléfono Celular <span class="red--text">*</span>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <v-text-field v-model="telefonoAlt" type="number" append-icon="mdi-phone" hide-spin-buttons
                            outlined>
                            <template v-slot:label>
                                Teléfono Alternativo
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="4" sm="6">
                        <v-select v-model="pais" :items="countries" item-text="country_name" item-value="country_name"
                            :rules="[rules.required]" @change="getDepartamentos" no-data-text="Espere un momento..." outlined
                            required>
                            <template v-slot:label>
                                País <span class="red--text">*</span>
                            </template>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="4" sm="6">
                        <v-select v-model="departamento" :items="states" item-text="state_name" item-value="state_name"
                            :loading="loadingState" @change="getMunicipios" no-data-text="No hay departamentos" outlined>
                            <template v-slot:label>
                                Departamento <span class="red--text">*</span>
                            </template>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="4" sm="6">
                        <v-select v-model="municipio" :items="municipios" item-text="city_name" item-value="city_name"
                            :loading="loadingMunicipio" no-data-text="No hay municipios" outlined>
                            <template v-slot:label>
                                Municipio <span class="red--text">*</span>
                            </template>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="4" sm="4">
                        <v-select v-model="tipoPersona" :items="tipoPeople" :rules="[rules.required]"
                            no-data-text="Espere un momento..." item-text="tipo" item-value="id" outlined required>
                            <template v-slot:label>
                                Tipo de Persona <span class="red--text">*</span>
                            </template>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="4" sm="4">
                        <v-select v-model="tipoObligacion" :items="tipoObligations" :rules="[rules.required]"
                            no-data-text="Espere un momento..." item-text="tipo" item-value="id" outlined required>
                            <template v-slot:label>
                                Tipo de Obligación <span class="red--text">*</span>
                            </template>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="4" sm="4">
                        <v-select v-model="tipoRegimen" :items="tipoRegimens" :rules="[rules.required]"
                            no-data-text="Espere un momento..." item-text="tipo" item-value="id" outlined required>
                            <template v-slot:label>
                                Tipo de Régimen <span class="red--text">*</span>
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
                    <v-btn :disabled="!valid" type="submit" :loading="loadingbtn" color="light-green">crear</v-btn>
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
    name: 'DialogCreate',
    props: {
        show: Boolean,
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
            municipio: '',
            telefono: '',
            telefonoAlt: '',
            tipoPersona: '',
            tipoObligacion: '',
            tipoRegimen: '',
            observacion: '',
            valid: false,
            loadingbtn: false,
            loadingState: false,
            loadingMunicipio: false,
            tipoDocuments: [],
            tipoObligations: [],
            tipoPeople: [],
            tipoRegimens: [],
            countries: [],
            municipios: [],
            states: [],
            default: {},
            rules: {
                required: value => !!value || 'Campo requerido.',
                max: value => (value && value.length <= 20) || 'Maximo 20 caracteres',
                min: value => (value && value.length >= 5) || 'Minimo 5 caracteres',
                phone: value => {
                    const pattern = /^(\+?[0-9]{1,3}[-.\s]?)?(\([0-9]{1,4}\)|[0-9]{1,4})[-.\s]?[0-9]{1,10}$/
                    return pattern.test(value) || 'Número de teléfono inválido.'
                },
                textOnly: value => {
                    const pattern = /^[a-zA-Z]*$/;
                    return pattern.test(value) || 'Ingrese solo texto, sin números, sin espacios.';
                },
            },
        }
    },
    methods: {
        /**
        * Crea un nuevo cliente con la información proporcionada.
        */
        newClient() {
            // Habilitar la animación de carga del botón
            this.loadingbtn = true

            // Crear un objeto con los datos del nuevo cliente
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
                ciudad: this.municipio,
                telefono: this.telefono,
                telefonoAlt: this.telefonoAlt,
                tipoPersona: this.tipoPersona,
                tipoObligacion: this.tipoObligacion,
                tipoRegimen: this.tipoRegimen,
                observacion: this.observacion,
            }

            // Llamar al servicio para crear un nuevo cliente
            clienteService.crear(data)
                .then(res => {
                    // Desactivar la animación de carga del botón
                    this.loadingbtn = false

                    // Reiniciar el formulario después de la creación exitosa
                    this.$refs.form.reset()

                    // Emitir un evento para informar que se ha creado un nuevo cliente
                    this.$emit('create')

                    // Mostrar mensaje de éxito utilizando SweetAlert
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })
                })
                .catch(err => {
                    // Desactivar la animación de carga del botón
                    this.loadingbtn = false

                    // Mostrar mensaje de error utilizando SweetAlert
                    Swal.fire({
                        icon: 'error',
                        text: err.response.data.message,
                    })
                })
        },
        /**
        * Obtiene tipos de documentos, obligaciones, personas y regímenes
        * desde el servicio de cliente y los asigna a las variables correspondientes.
        */
        getDatos() {
            // Obtener tipos de documentos, obligaciones, personas y regímenes
            clienteService.obtenerTipos()
                .then(res => {
                    // Asignar resultados a las variables correspondientes
                    this.tipoDocuments = res.documents
                    this.tipoObligations = res.obligations
                    this.tipoPeople = res.people
                    this.tipoRegimens = res.regimens
                })
                .catch(err => {
                    console.error(err)
                })

            // Obtener valores predeterminados desde el servicio de cliente
            clienteService.obtenerValoresDefault()
                .then(res => {
                    // Asignar valores predeterminados a las variables correspondientes
                    this.default = res
                    this.pais = res.pais
                    this.getDepartamentos()
                    this.departamento = res.departamento
                    this.getMunicipios()
                    this.municipio = res.municipio
                    this.tipoDocumento = res.tipo_documento
                    this.tipoPersona = res.tipo_persona
                    this.tipoRegimen = res.tipo_regimen
                    this.tipoObligacion = res.tipo_obligacion
                })
                .catch(err => {
                    console.error(err)
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
                    console.error(err)
                })
        },
        /**
         * Obtiene la lista de estados para el país seleccionado
         * desde el servicio de ubicación y la asigna a la variable 'states'.
         */
        getDepartamentos() {
            // Habilitar la animación de carga y restablecer las variables relacionadas con el departamento
            this.loadingState = true
            this.departamento = ''
            this.municipio = ''
            this.municipios = []

            // Obtener la lista de estados para el país seleccionado
            UbicacionService.departamentos(this.pais)
                .then(res => {
                    // Asignar la lista de estados a la variable 'states' y desactivar la animación de carga
                    this.states = res
                    this.loadingState = false
                })
                .catch(err => {
                    console.error(err)
                    this.loadingState = false
                })
        },
        /**
        * Obtiene la lista de municipios para el departamento seleccionado
        * desde el servicio de ubicación y la asigna a la variable 'municipios'.
        */
        getMunicipios() {
            // Habilitar la animación de carga y restablecer la variable relacionada con la municipio
            this.loadingMunicipio = true
            this.municipio = ''

            // Obtener la lista de municipios para el departamento seleccionado
            UbicacionService.ciudades(this.departamento)
                .then(res => {
                    // Asignar la lista de municipios a la variable 'municipios' y desactivar la animación de carga
                    this.municipios = res
                    this.loadingMunicipio = false
                })
                .catch(err => {
                    console.error(err)
                    this.loadingMunicipio = false
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
                    console.error(err)
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
    mounted() {
        this.getCountries()
        this.getDatos()
    },
}
</script>

<style scoped></style>