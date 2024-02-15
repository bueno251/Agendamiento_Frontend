<template>
    <div class="contenido">

        <v-form ref="formPersonal" v-model="valid1" @submit.prevent="savePersonal">

            <div>
                <h2>Datos Personales</h2>
            </div>

            <v-divider class="my-5" />

            <v-row>
                <v-col cols="12" md="3">
                    <v-text-field v-model="nombre1" label="Primer Nombre" :rules="[rules.required]" outlined required>
                    </v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                    <v-text-field v-model="nombre2" label="Segundo Nombre" outlined>
                    </v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                    <v-text-field v-model="apellido1" label="Primer Apellido" :rules="[rules.required]" outlined required>
                    </v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                    <v-text-field v-model="apellido2" label="Segundo Apellido" outlined>
                    </v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field v-model="username" label="Username" :rules="[rules.required]" outlined required>
                    </v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field v-model="correo" label="Correo" :rules="[rules.required, rules.email]" outlined required>
                    </v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                    <v-select v-model="tipoDocumento" label="Tipo de documento" :items="tipoDocuments"
                        :rules="[rules.required]" no-data-text="Espere un momento..." item-text="tipo" item-value="id"
                        outlined required>
                    </v-select>
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field v-model="documento" label="Documento" :rules="[rules.required, rules.min]" outlined
                        required>
                    </v-text-field>
                </v-col>
            </v-row>

            <div class="buttons">
                <v-btn :disabled="!valid1" :loading="loading" type="submit" color="primary">
                    guardar
                </v-btn>
            </div>
        </v-form>

        <v-divider class="my-10" />

        <v-form ref="formContacto" v-model="valid2" @submit.prevent="saveContacto">
            <div>
                <h2>Datos De Contacto</h2>
            </div>

            <v-divider class="my-5" />

            <v-row>
                <v-col cols="12" md="4">
                    <v-text-field v-model="telefono" label="Teléfono" :rules="[rules.required]" outlined required>
                    </v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                    <v-text-field v-model="telefono2" label="Segundo Teléfono" outlined>
                    </v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                    <v-text-field v-model="direccion" label="Dirección" :rules="[rules.required]"
                        append-icon="mdi-map-marker" outlined required>
                    </v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                    <v-select v-model="pais" label="País" :items="countries" item-text="country_name"
                        item-value="country_name" @change="getStates" no-data-text="Espere un momento..." outlined>
                    </v-select>
                </v-col>

                <v-col cols="12" md="4">
                    <v-select v-model="departamento" label="Departamento" :items="states" item-text="state_name"
                        item-value="state_name" :loading="loadingState" @change="getCities"
                        no-data-text="No hay departamentos" outlined>
                    </v-select>
                </v-col>

                <v-col cols="12" md="4">
                    <v-select v-model="ciudad" label="Ciudad" :items="cities" item-text="city_name" item-value="city_name"
                        :loading="loadingCity" no-data-text="No hay ciudades" outlined>
                    </v-select>
                </v-col>
            </v-row>

            <div class="buttons">
                <v-btn :disabled="!valid2" :loading="loading" type="submit" color="primary">
                    guardar
                </v-btn>
            </div>
        </v-form>

        <v-divider class="my-5" />

        <v-form ref="formLegal" v-model="valid3" @submit.prevent="saveLegal">
            <div>
                <h2>Datos De Legales</h2>
            </div>

            <v-divider class="my-5" />

            <v-row>
                <v-col cols="12" md="4">
                    <v-select v-model="tipoPersona" label="Tipo de Persona" :items="tipoPeople" :rules="[rules.required]"
                        no-data-text="Espere un momento..." item-text="tipo" item-value="id" outlined required>
                    </v-select>
                </v-col>

                <v-col cols="12" md="4">
                    <v-select v-model="tipoObligacion" :items="tipoObligations" :rules="[rules.required]"
                        no-data-text="Espere un momento..." item-text="tipo" item-value="id" outlined required>
                        <template v-slot:label>
                            Tipo de Obligación<span class="red--text">*</span>
                        </template>
                    </v-select>
                </v-col>

                <v-col cols="12" md="4">
                    <v-select v-model="tipoRegimen" :items="tipoRegimens" :rules="[rules.required]"
                        no-data-text="Espere un momento..." item-text="tipo" item-value="id" outlined required>
                        <template v-slot:label>
                            Tipo de Régimen<span class="red--text">*</span>
                        </template>
                    </v-select>
                </v-col>
            </v-row>

            <div class="buttons">
                <v-btn :disabled="!valid3" :loading="loading" type="submit" color="primary">
                    guardar
                </v-btn>
            </div>
        </v-form>

        <v-divider class="my-5" />

    </div>
</template>

<script>

import vuex from "@/store";
import Swal from "sweetalert2";
import UserService from './service/UserService'
import UbicacionService from "../client/services/UbicacionService";

export default {
    name: 'ProfileInfo',
    data() {
        return {
            username: '',
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
            correo: '',
            telefono: '',
            telefono2: '',
            tipoPersona: '',
            tipoObligacion: '',
            tipoRegimen: '',
            observacion: '',
            valid1: false,
            valid2: false,
            valid3: false,
            loading: false,
            loadingState: false,
            loadingCity: false,
            tipoDocuments: [],
            tipoObligations: [],
            tipoPeople: [],
            tipoRegimens: [],
            countries: [],
            cities: [],
            states: [],
            cliente: {},
            user: vuex.state.user,
            rules: {
                required: value => !!value || 'Campo requerido.',
                min: value => (!value || value.length >= 5) || 'Minimo 5 caracteres',
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Correo invalido.'
                },
            },
        }
    },
    watch: {
        cliente: {
            handler(newclient) {
                this.username = this.user.nombre
                this.tipoDocumento = newclient.tipo_documento_id
                this.documento = newclient.documento
                this.nombre1 = newclient.nombre1
                this.nombre2 = newclient.nombre2
                this.apellido1 = newclient.apellido1
                this.apellido2 = newclient.apellido2
                this.direccion = newclient.direccion
                this.pais = newclient.pais
                this.correo = this.user.correo
                this.telefono = newclient.telefono
                this.telefono2 = newclient.telefono_alt
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
                if (newclient.id) {
                    this.$refs.formPersonal.resetValidation()
                    this.$refs.formContacto.resetValidation()
                    this.$refs.formLegal.resetValidation()
                }
            },
            immediate: true,
        }
    },
    methods: {
        savePersonal() {
            this.loading = true

            let data = {
                nombre1: this.nombre1,
                nombre2: this.nombre2,
                apellido1: this.apellido1,
                apellido2: this.apellido2,
                username: this.username,
                correo: this.correo,
                tipoDocumento: this.tipoDocumento,
                documento: this.documento,
            }

            UserService.savePersonal(data, this.cliente.id)
                .then(res => {
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })

                    this.loading = false
                })
                .catch(err => {
                    console.log(err)
                    this.loading = false
                })
        },
        saveContacto() {
            this.loading = true
            let data = {
                telefono: this.telefono,
                telefonoAlt: this.telefono2,
                direccion: this.direccion,
                pais: this.pais,
                departamento: this.departamento,
                ciudad: this.ciudad,
            }

            UserService.saveContacto(data, this.cliente.id)
                .then(res => {
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })

                    this.loading = false
                })
                .catch(err => {
                    console.log(err)
                    this.loading = false
                })
        },
        saveLegal() {
            this.loading = true

            let data = {
                tipoPersona: this.tipoPersona,
                tipoObligacion: this.tipoObligacion,
                tipoRegimen: this.tipoRegimen,
            }

            UserService.saveLegal(data, this.cliente.id)
                .then(res => {
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })

                    this.loading = false
                })
                .catch(err => {
                    console.log(err)
                    this.loading = false
                })
        },
        getClienteInfo() {
            UserService.getClienteInfo(this.user.cliente_id)
                .then(res => {
                    if (res.length > 0) {
                        this.cliente = res[0]
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        getTypes() {
            UserService.obtenerTipos()
                .then(res => {
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
    },
    mounted() {
        if (this.user.cliente_id) {
            this.getClienteInfo()
        }
        this.getTypes()
        this.getCountries()
    },
}
</script>

<style scoped>
.contenido {
    width: max(70%, 300px);
    margin-top: 50px;
}

h3 {
    margin-bottom: 10px;
}
</style>