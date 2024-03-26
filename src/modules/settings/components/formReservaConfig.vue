<template>
    <v-card width="90%" elevation="5" min-height="100px">
        <v-card-title class="blue lighten-2 mb-5 white--text">
            Valores Por Defecto Formulario Cliente Reserva
        </v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="guardar">
                <v-row>

                    <v-col cols="12" md="3" sm="6">
                        <label>Tipo Documento <span class="red--text">*</span></label>
                        <v-select v-model="tipoDocumento" :items="documentos" no-data-text="Espere un momento..."
                            :rules="[rules.required]" item-text="tipo" item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>País De Residencia <span class="red--text">*</span></label>
                        <v-select v-model="paisResidencia" :items="paises" no-data-text="Espere un momento..."
                            @change="getDepartamentos('Residencia')" :rules="[rules.required]" item-text="nombre"
                            item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Departamento De Residencia <span class="red--text">*</span></label>
                        <v-select v-model="departamentoResidencia" :items="departamentosResidencia"
                            no-data-text="Seleccione un pais" @change="getCiudades('Residencia')"
                            :rules="[rules.required]" :loading="loadingDepartamentosResidencia" item-text="nombre"
                            item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Ciudad De Residencia <span class="red--text">*</span></label>
                        <v-select v-model="ciudadResidencia" :items="ciudadesResidencia"
                            no-data-text="Seleccione un departamento" :rules="[rules.required]"
                            :loading="loadingCiudadesResidencia" item-text="nombre" item-value="id" outlined dense
                            required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>País Procedencia <span class="red--text">*</span></label>
                        <v-select v-model="paisProcedencia" :items="paises" no-data-text="Espere un momento..."
                            @change="getDepartamentos('Procedencia')" :rules="[rules.required]" item-text="nombre"
                            item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Departamento Procedencia<span class="red--text">*</span></label>
                        <v-select v-model="departamentoProcedencia" :items="departamentosProcedencia"
                            no-data-text="Seleccione un pais" @change="getCiudades('Procedencia')"
                            :rules="[rules.required]" :loading="loadingDepartamentosProcedencia" item-text="nombre"
                            item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Ciudad Procedencia<span class="red--text">*</span></label>
                        <v-select v-model="ciudadProcedencia" :items="ciudadesProcedencia"
                            no-data-text="Seleccione un departamento" :rules="[rules.required]"
                            :loading="loadingCiudadesProcedencia" item-text="nombre" item-value="id" outlined dense
                            required>
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
            loading: false,
            loadingbtn: false,
            loadingDepartamentosProcedencia: false,
            loadingCiudadesProcedencia: false,
            loadingDepartamentosResidencia: false,
            loadingCiudadesResidencia: false,
            documentos: [],
            paises: [],
            departamentosResidencia: [],
            departamentosProcedencia: [],
            ciudadesResidencia: [],
            ciudadesProcedencia: [],
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
                paisProcedencia: this.paisProcedencia,
                departamentoProcedencia: this.departamentoProcedencia,
                ciudadProcedencia: this.ciudadProcedencia,
                paisResidencia: this.paisResidencia,
                departamentoResidencia: this.departamentoResidencia,
                ciudadResidencia: this.ciudadResidencia,
                tipoDocumento: this.tipoDocumento,
            }

            // Llama al servicio para establecer los valores predeterminados
            service.guardarConfigFormReserva(data)
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
            service.obtenerConfigFormReserva()
                .then(async res => {
                    if ('id' in res) {
                        // Asigna los valores predeterminados obtenidos a las variables del componente
                        this.tipoDocumento = res.tipoDocumento
                        this.paisResidencia = res.paisResidencia
                        this.getDepartamentos('Residencia')
                        this.paisProcedencia = res.paisProcedencia
                        this.getDepartamentos('Procedencia')
                        this.departamentoResidencia = res.departamentoResidencia
                        this.getCiudades('Residencia')
                        this.departamentoProcedencia = res.departamentoProcedencia
                        this.getCiudades('Procedencia')
                        this.ciudadResidencia = res.ciudadResidencia
                        this.ciudadProcedencia = res.ciudadProcedencia
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
            service.obtenerTiposDocumentoCliente()
                .then(res => {
                    // Asigna los tipos de documentos, organizaciones, regímenes y responsabilidades a las variables del componente
                    this.documentos = res
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
        async getDepartamentos(tipo = '') {
            const tipoMap = {
                'Residencia': {
                    pais: this.paisResidencia,
                    loading: 'loadingDepartamentosResidencia',
                    departamento: 'departamentoResidencia',
                    departamentos: 'departamentosResidencia',
                    ciudad: 'ciudadResidencia',
                    ciudades: 'ciudadesResidencia'
                },
                'Procedencia': {
                    pais: this.paisProcedencia,
                    loading: 'loadingDepartamentosProcedencia',
                    departamento: 'departamentoProcedencia',
                    departamentos: 'departamentosProcedencia',
                    ciudad: 'ciudadProcedencia',
                    ciudades: 'ciudadesProcedencia'
                }
            };

            const { pais, loading, departamento, departamentos, ciudad, ciudades } = tipoMap[tipo]

            this[loading] = true
            this[departamento] = ''
            this[departamentos] = []
            this[ciudad] = ''
            this[ciudades] = []

            try {
                const res = await service.obtenerDepartamentos(pais)
                this[departamentos] = res
                this[loading] = false
            } catch (err) {
                console.error(err)
            }
        },
        /**
         * Obtiene la lista de ciudades para el departamento seleccionado.
         */
        async getCiudades(tipo = '') {
            const tipoMap = {
                'Residencia': {
                    departamento: this.departamentoResidencia,
                    loading: 'loadingCiudadesResidencia',
                    ciudad: 'ciudadResidencia',
                    ciudades: 'ciudadesResidencia'
                },
                'Procedencia': {
                    departamento: this.departamentoProcedencia,
                    loading: 'loadingCiudadesProcedencia',
                    ciudad: 'ciudadProcedencia',
                    ciudades: 'ciudadesProcedencia'
                }
            }

            const { departamento, loading, ciudad, ciudades } = tipoMap[tipo]

            this[loading] = true
            this[ciudad] = ''

            try {
                const res = await service.obtenerCiudades(departamento)
                this[ciudades] = res
                this[loading] = false
            } catch (err) {
                console.error(err)
                this[loading] = false
            }
        },
    },
    mounted() {
        this.getPaises()
        this.getTipos()
        this.getDefault()
    },
}
</script>

<style scoped></style>