<template>
    <v-card width="90%" elevation="5" min-height="100px">
        <v-card-title class="blue lighten-2 mb-5 white--text">
            Valores Por Defecto
        </v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="guardar">
                <v-row>

                    <v-col cols="12" md="3" sm="6">
                        <label>Tipo Documento <span class="red--text">*</span></label>
                        <v-select v-model="tipoDocumento" :items="documentos" no-data-text="Espere un momento..."
                            :rules="[rules.required]" item-text="tipo" item-value="id"
                            outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>País De Residencia <span class="red--text">*</span></label>
                        <v-select v-model="paisResidencia" :items="paises" no-data-text="Espere un momento..."
                            @change="getDepartamentos" :rules="[rules.required]"
                            item-text="nombre" item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Departamento De Residencia <span class="red--text">*</span></label>
                        <v-select v-model="departamentoResidencia" :items="departamentos" no-data-text="Seleccione un pais"
                            @change="getCiudades" :rules="[rules.required]"
                            :loading="loadingDepartamentos" item-text="nombre" item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Ciudad De Residencia <span class="red--text">*</span></label>
                        <v-select v-model="ciudadResidencia" :items="ciudades" no-data-text="Seleccione un departamento"
                            :rules="[rules.required]" :loading="loadingCiudades"
                            item-text="nombre" item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>País <span class="red--text">*</span></label>
                        <v-select v-model="pais" :items="paises" no-data-text="Espere un momento..."
                            @change="getDepartamentos" :rules="[rules.required]"
                            item-text="nombre" item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Departamento <span class="red--text">*</span></label>
                        <v-select v-model="departamento" :items="departamentos" no-data-text="Seleccione un pais"
                            @change="getCiudades" :rules="[rules.required]"
                            :loading="loadingDepartamentos" item-text="nombre" item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Ciudad <span class="red--text">*</span></label>
                        <v-select v-model="ciudad" :items="ciudades" no-data-text="Seleccione un departamento"
                            :rules="[rules.required]" :loading="loadingCiudades"
                            item-text="nombre" item-value="id" outlined dense required>
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
import service from '@/services/service'

export default {
    name: 'defaultFormReservaConfig',
    data() {
        return {
            paisProcedencia: '',
            departamentoProcedencia: '',
            ciudadProcedencia: '',
            paisResidencia: '',
            departamentoResidencia: '',
            ciudadResidencia: '',
            tipoDocumento: '',
            valid: false,
            validCreate: false,
            validUpdate: false,
            loading: false,
            loadingbtn: false,
            loadingDepartamentosProcedencia: false,
            loadingCiudadesProcedencia: false,
            loadingDepartamentosResidencia: false,
            loadingCiudadesResidencia: false,
            paises: [],
            departamentos: [],
            ciudades: [],
            documentos: [],
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
                pais: this.pais,
                departamento: this.departamento,
                ciudad: this.ciudad,
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
                        this.pais = res.paisId
                        this.getDepartamentos()
                        this.departamento = res.departamentoId
                        this.getCiudades()
                        this.ciudad = res.ciudadId
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
            service.obtenerPaises()
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
            this.departamento = ''
            this.ciudad = ''
            this.ciudades = []

            await service.obtenerDepartamentos(this.pais)
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
         * Obtiene la lista de ciudades para el departamento seleccionado.
         */
        async getCiudades() {
            this.loadingCiudades = true
            this.ciudad = ''

            await service.obtenerCiudades(this.departamento)
                .then(res => {
                    this.ciudades = res
                    this.loadingCiudades = false
                })
                .catch(err => {
                    console.error(err)
                    this.loadingCiudades = false
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

<style scoped></style>