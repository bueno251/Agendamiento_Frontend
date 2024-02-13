<template>
    <v-card width="90%" min-height="100px">
        <v-card-title class="blue lighten-2 mb-5">
            Valores Por Defecto
        </v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="crear">
                <v-row>

                    <v-col cols="12" md="4">
                        <label>País</label>
                        <v-select v-model="pais" :items="paises" no-data-text="Espere un momento..."
                            @change="getDepartamentos" :rules="[rules.required]" item-text="country_name"
                            item-value="country_name" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="4">
                        <label>Departamento</label>
                        <v-select v-model="departamento" :items="departamentos" no-data-text="No hay departamentos"
                            @change="getMunicipios" :rules="[rules.required]" :loading="loadingDepartamentos"
                            item-text="state_name" item-value="state_name" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="4">
                        <label>Municipio</label>
                        <v-select v-model="municipio" :items="municipios" no-data-text="No hay municipios"
                            :rules="[rules.required]" :loading="loadingMunicipios" item-text="city_name"
                            item-value="city_name" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3">
                        <label>Tipo Documento</label>
                        <v-select v-model="tipoDocumento" :items="documentos" no-data-text="Espere un momento..."
                            :rules="[rules.required]" item-text="tipo" item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3">
                        <label>Tipo Persona</label>
                        <v-select v-model="tipoPersona" :items="personas" no-data-text="Espere un momento..."
                            :rules="[rules.required]" item-text="tipo" item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3">
                        <label>Tipo Responsabilidad</label>
                        <v-select v-model="tipoResponsabilidad" :items="responsabilidades"
                            no-data-text="Espere un momento..." :rules="[rules.required]" item-text="tipo" item-value="id"
                            outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3">
                        <label>Tipo Regimen</label>
                        <v-select v-model="tipoRegimen" :items="regimenes" no-data-text="Espere un momento..."
                            :rules="[rules.required]" item-text="tipo" item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                </v-row>

                <div class="buttons">
                    <v-btn :disabled="!valid" type="submit" :loading="loading" color="primary">guardar</v-btn>
                </div>

            </v-form>
        </v-card-text>
    </v-card>
</template>

<script>

import Swal from 'sweetalert2';
import configService from '../services/configService';
import UbicacionService from '@/modules/client/services/UbicacionService';

export default {
    name: 'defaultConfig',
    props: {
        id: Number,
    },
    data() {
        return {
            pais: '',
            departamento: '',
            municipio: '',
            tipoDocumento: '',
            tipoPersona: '',
            tipoRegimen: '',
            tipoResponsabilidad: '',
            valid: false,
            loading: false,
            loadingDepartamentos: false,
            loadingMunicipios: false,
            paises: [],
            departamentos: [],
            municipios: [],
            documentos: [],
            personas: [],
            regimenes: [],
            responsabilidades: [],
            rules: {
                required: value => !!value || 'Campo requerido.'
            },
        }
    },
    methods: {
        crear() {
            this.loading = true

            let data = {
                configuracionId: this.id,
                pais: this.pais,
                departamento: this.departamento,
                municipio: this.municipio,
                tipoDocumento: this.tipoDocumento,
                tipoPersona: this.tipoPersona,
                tipoRegimen: this.tipoRegimen,
                tipoResponsabilidad: this.tipoResponsabilidad,
            }

            configService.valoresDefault(data)
                .then(res => {
                    this.loading = false
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })
                })
                .catch(err => {
                    this.loading = false
                    console.log(err)
                })
        },
        getDefault() {
            configService.obtenerValoresDefault()
                .then(res => {
                    this.pais = res.pais
                    this.getDepartamentos()
                    this.departamento = res.departamento
                    this.getMunicipios()
                    this.municipio = res.ciudad
                    this.tipoDocumento = res.tipo_documento
                    this.tipoPersona = res.tipo_persona
                    this.tipoRegimen = res.tipo_regimen
                    this.tipoResponsabilidad = res.tipo_obligacion
                })
                .catch(err => {
                    console.log(err)
                })
        },
        getTipos() {
            configService.obtenerEmpresaTipos()
                .then(res => {
                    this.documentos = res.documentos
                    this.personas = res.organizaciones
                    this.regimenes = res.regimenes
                    this.responsabilidades = res.responsabilidades
                })
                .catch(err => {
                    console.log(err)
                })
        },
        getPaises() {
            UbicacionService.paises()
                .then(res => {
                    this.paises = res
                })
                .catch(err => {
                    console.log(err)
                })
        },
        getDepartamentos() {
            this.loadingDepartamentos = true
            this.departamento = ''
            this.municipio = ''
            this.municipios = []

            UbicacionService.departamentos(this.pais)
                .then(res => {
                    this.departamentos = res
                    this.loadingDepartamentos = false
                })
                .catch(err => {
                    console.log(err)
                    this.loadingDepartamentos = false
                })
        },
        getMunicipios() {
            this.loadingMunicipios = true
            this.municipio = ''

            UbicacionService.ciudades(this.departamento)
                .then(res => {
                    this.municipios = res
                    this.loadingMunicipios = false
                })
                .catch(err => {
                    console.log(err)
                    this.loadingMunicipios = false
                })
        },
    },
    mounted() {
        this.getDefault()
        this.getTipos()
        this.getPaises()
    },
}
</script>

<style scoped></style>