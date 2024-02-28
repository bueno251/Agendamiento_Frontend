<template>
    <v-card width="90%" min-height="100px">
        <v-card-title class="blue lighten-2 mb-5 white--text">
            Valores Por Defecto
        </v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="guardar">
                <v-row>

                    <v-col cols="12" md="3">
                        <label>País</label>
                        <v-select v-model="pais" :items="paises" no-data-text="Espere un momento..."
                            @change="getDepartamentos" :rules="[rules.required]" item-text="nombre" return-object outlined
                            dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3">
                        <label>Departamento</label>
                        <v-select v-model="departamento" :items="departamentos" no-data-text="Seleccione pais"
                            @change="getMunicipios" :rules="[rules.required]" :loading="loadingDepartamentos"
                            item-text="nombre" return-object outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3">
                        <label>Municipio</label>
                        <v-select v-model="municipio" :items="municipios" no-data-text="Seleccione departamento"
                            :rules="[rules.required]" :loading="loadingMunicipios" item-text="nombre" return-object outlined
                            dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3">
                        <label>Divisa</label>
                        <v-select v-model="divisa" :items="divisas" no-data-text="No hay divisas" :rules="[rules.required]"
                            :item-text="item => item.nombre + ' - ' + item.codigo" item-value="id" outlined dense required>
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

import Swal from 'sweetalert2'
import configService from '@/services/ConfigService'
import UbicacionService from '@/services/UbicacionService'
import DivisasService from '@/services/DivisasService'

export default {
    name: 'defaultConfig',
    props: {
        id: Number,
        updateDivisas: Boolean,
    },
    watch: {
        updateDivisas: {
            handler(newItem) {
                if (newItem) {
                    this.getDivisas()
                }
            },
            immediate: true,
        },
    },
    data() {
        return {
            pais: '',
            departamento: null,
            municipio: '',
            divisa: '',
            tipoDocumento: '',
            tipoPersona: '',
            tipoRegimen: '',
            tipoResponsabilidad: '',
            nombre: '',
            codigo: '',
            valid: false,
            validCreate: false,
            validUpdate: false,
            loading: false,
            loadingbtn: false,
            loadingDepartamentos: false,
            loadingMunicipios: false,
            dialogCreateDivisa: false,
            dialogUpdateDivisa: false,
            dialogDeleteDivisa: false,
            paises: [],
            departamentos: [],
            municipios: [],
            divisas: [],
            documentos: [],
            personas: [],
            regimenes: [],
            responsabilidades: [],
            divisaSelected: {},
            rules: {
                required: value => !!value || 'Campo requerido.'
            },
        }
    },
    methods: {
        /**
         * guarda los valores predeterminados de la configuración.
         */
        guardar() {
            this.loading = true

            // Objeto de datos que se enviará al servicio para establecer los valores predeterminados
            let data = {
                configuracionId: this.id,
                pais: this.pais.nombre,
                departamento: this.departamento.nombre,
                municipio: this.municipio.nombre,
                divisa: this.divisa,
                tipoDocumento: this.tipoDocumento,
                tipoPersona: this.tipoPersona,
                tipoRegimen: this.tipoRegimen,
                tipoResponsabilidad: this.tipoResponsabilidad,
            }

            // Llama al servicio para establecer los valores predeterminados
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
        /**
         * Obtiene los valores predeterminados existentes y actualiza los datos del formulario.
         */
        getDefault() {
            configService.obtenerValoresDefault()
                .then(async res => {
                    if ('id' in res) {
                        // Asigna los valores predeterminados obtenidos a las variables del componente
                        this.divisa = this.divisas.find((item) => item.id == res.divisa.id)
                        this.tipoDocumento = res.tipo_documento
                        this.tipoPersona = res.tipo_persona
                        this.tipoRegimen = res.tipo_regimen
                        this.tipoResponsabilidad = res.tipo_obligacion
                        this.pais = this.paises.find((item) => item.nombre == res.pais)
                        await this.getDepartamentos()
                        this.departamento = this.departamentos.find((item) => item.nombre == res.departamento)
                        await this.getMunicipios()
                        this.municipio = this.municipios.find((item) => item.nombre == res.municipio)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        /**
         * Obtiene los tipos de empresa desde el servicio.
         */
        getTipos() {
            configService.obtenerEmpresaTipos()
                .then(res => {
                    // Asigna los tipos de documentos, organizaciones, regímenes y responsabilidades a las variables del componente
                    this.documentos = res.documentos
                    this.personas = res.organizaciones
                    this.regimenes = res.regimenes
                    this.responsabilidades = res.responsabilidades
                })
                .catch(err => {
                    console.log(err)
                })
        },
        getDivisas() {
            DivisasService.obtenerDivisas()
                .then(res => {
                    this.divisas = res
                })
                .catch(err => {
                    console.log(err)
                })
        },
        /**
         * Obtiene la lista de países desde el servicio.
         */
        getPaises() {
            UbicacionService.obtenerPaises()
                .then(res => {
                    this.paises = res
                })
                .catch(err => {
                    console.log(err)
                })
        },
        /**
         * Obtiene la lista de departamentos para el país seleccionado.
         */
        async getDepartamentos() {
            this.loadingDepartamentos = true
            this.departamento = ''
            this.municipio = ''
            this.municipios = []

            await UbicacionService.obtenerDepartamentos(this.pais.id)
                .then(res => {
                    this.departamentos = res
                    this.loadingDepartamentos = false
                })
                .catch(err => {
                    console.log(err)
                    this.loadingDepartamentos = false
                })
        },
        /**
         * Obtiene la lista de municipios para el departamento seleccionado.
         */
        async getMunicipios() {
            this.loadingMunicipios = true
            this.municipio = ''

            await UbicacionService.obtenerMunicipios(this.departamento.id)
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
        this.getPaises()
        this.getTipos()
        this.getDivisas()
        this.getDefault()
    },
}
</script>

<style scoped></style>