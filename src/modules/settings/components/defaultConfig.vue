<template>
    <v-card width="90%" elevation="5" min-height="100px">
        <v-card-title class="blue lighten-2 mb-5 white--text">
            Valores Por Defecto
        </v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="guardar">
                <v-row>

                    <v-col cols="12" md="3" sm="6">
                        <label>País</label>
                        <v-select v-model="pais" :items="paises" no-data-text="Espere un momento..."
                            @change="getDepartamentos" :rules="[rules.required]" item-text="nombre" return-object outlined
                            dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Departamento</label>
                        <v-select v-model="departamento" :items="departamentos" no-data-text="Seleccione pais"
                            @change="getMunicipios" :rules="[rules.required]" :loading="loadingDepartamentos"
                            item-text="nombre" return-object outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Municipio</label>
                        <v-select v-model="municipio" :items="municipios" no-data-text="Seleccione departamento"
                            :rules="[rules.required]" :loading="loadingMunicipios" item-text="nombre" return-object outlined
                            dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Divisa</label>
                        <v-select v-model="divisa" :items="divisas" no-data-text="No hay divisas"
                            :item-text="item => item.nombre + ' - ' + item.codigo" item-value="id" :disabled="priceInDolar" outlined dense>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Tipo Documento</label>
                        <v-select v-model="tipoDocumento" :items="documentos" no-data-text="Espere un momento..."
                            :rules="[rules.required]" item-text="tipo" item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Tipo Persona</label>
                        <v-select v-model="tipoPersona" :items="personas" no-data-text="Espere un momento..."
                            :rules="[rules.required]" item-text="tipo" item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Tipo Responsabilidad</label>
                        <v-select v-model="tipoResponsabilidad" :items="responsabilidades"
                            no-data-text="Espere un momento..." :rules="[rules.required]" item-text="tipo" item-value="id"
                            outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Tipo Regimen</label>
                        <v-select v-model="tipoRegimen" :items="regimenes" no-data-text="Espere un momento..."
                            :rules="[rules.required]" item-text="tipo" item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <div class="flex-switch">
                            <p>
                                Valores en dolares?
                            </p>
                            <v-switch v-model="priceInDolar" :label="priceInDolar ? 'Si' : 'No'" inset></v-switch>
                        </div>
                    </v-col>

                    <v-col v-if="priceInDolar" cols="12" md="3" sm="6">
                        <div class="flex-switch">
                            <p>
                                Valor del dolar por defecto?
                            </p>
                            <v-switch v-model="dolarPriceAuto" :label="dolarPriceAuto ? 'Si' : 'No'" inset></v-switch>
                        </div>
                    </v-col>

                    <v-col v-if="priceInDolar && !dolarPriceAuto" cols="12" md="3" sm="6">
                        <label>Valor de $1 dolar = ${{ comaEnMiles(dolarPrice) }}</label>
                        <v-text-field v-model="dolarPrice" type="number" min="0" hide-spin-buttons outlined dense required>
                        </v-text-field>
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
import service from '@/services/service'
import UbicacionService from '@/services/UbicacionService'

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
            dolarPrice: 0,
            priceInDolar: false,
            dolarPriceAuto: true,
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
                priceInDolar: this.priceInDolar,
                dolarPriceAuto: this.dolarPriceAuto,
                dolarPrice: Number(this.dolarPrice),
                divisa: this.divisa,
                tipoDocumento: this.tipoDocumento,
                tipoPersona: this.tipoPersona,
                tipoRegimen: this.tipoRegimen,
                tipoResponsabilidad: this.tipoResponsabilidad,
            }

            // Llama al servicio para establecer los valores predeterminados
            service.guardarValoresDefault(data)
                .then(res => {
                    this.loading = false
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    })
                })
                .catch(err => {
                    this.loading = false
                    console.error(err)
                })
        },
        /**
         * Obtiene los valores predeterminados existentes y actualiza los datos del formulario.
         */
        getDefault() {
            service.obtenerValoresDefault()
                .then(async res => {
                    if ('id' in res) {
                        // Asigna los valores predeterminados obtenidos a las variables del componente
                        this.divisa = res.divisa.id
                        this.tipoDocumento = res.tipo_documento
                        this.tipoPersona = res.tipo_persona
                        this.tipoRegimen = res.tipo_regimen
                        this.tipoResponsabilidad = res.tipo_obligacion
                        this.priceInDolar = res.priceInDolar
                        this.dolarPriceAuto = res.dolarPriceAuto
                        this.dolarPrice = res.dolarPrice
                        this.pais = this.paises.find((item) => item.nombre == res.pais)
                        await this.getDepartamentos()
                        this.departamento = this.departamentos.find((item) => item.nombre == res.departamento)
                        await this.getMunicipios()
                        this.municipio = this.municipios.find((item) => item.nombre == res.municipio)
                    }
                })
                .catch(err => {
                    console.error(err)
                })
        },
        /**
         * Obtiene los tipos de empresa desde el servicio.
         */
        getTipos() {
            service.obtenerTiposEmpresa()
                .then(res => {
                    // Asigna los tipos de documentos, organizaciones, regímenes y responsabilidades a las variables del componente
                    this.documentos = res.documentos
                    this.personas = res.organizaciones
                    this.regimenes = res.regimenes
                    this.responsabilidades = res.responsabilidades
                })
                .catch(err => {
                    console.error(err)
                })
        },
        getDivisas() {
            service.obtenerDivisas()
                .then(res => {
                    this.divisas = res
                })
                .catch(err => {
                    console.error(err)
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
                    console.error(err)
                })
        },
        /**
         * Obtiene la lista de departamentos para el país seleccionado.
         */
        async getDepartamentos() {
            this.loadingDepartamentos = true
            this.departamento = null
            this.municipio = ''
            this.municipios = []

            await UbicacionService.obtenerDepartamentos(this.pais.id)
                .then(res => {
                    this.departamentos = res
                    this.loadingDepartamentos = false
                })
                .catch(err => {
                    console.error(err)
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
                    console.error(err)
                    this.loadingMunicipios = false
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
    },
    mounted() {
        this.getPaises()
        this.getTipos()
        this.getDivisas()
        this.getDefault()
    },
}
</script>

<style scoped>
.flex-switch {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    gap: 10px;
}

p {
    padding: 0;
    margin: 0;
    text-wrap: balance;
}
</style>