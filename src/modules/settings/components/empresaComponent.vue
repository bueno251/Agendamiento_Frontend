<template>
    <v-card width="90%" min-height="100px">
        <v-card-title class="blue lighten-2 mb-5 white--text">
            Empresa
        </v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="crear">
                <v-row>

                    <v-col cols="12" md="3">
                        <label>Tipo Documento <span v-if="empresa === null" class="red--text">*</span></label>
                        <v-select v-model="tipoDocumento" :items="documentos" no-data-text="Espere un momento..."
                            :rules="[rules.required]" :disabled="empresa !== null" item-text="tipo" item-value="id" outlined
                            dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3">
                        <label>N° Identificación <span v-if="empresa === null" class="red--text">*</span></label>
                        <v-text-field v-model="identificacion" :rules="[rules.required]" :disabled="empresa !== null"
                            type="number" hide-spin-buttons outlined dense required>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3">
                        <label>DV <span v-if="empresa === null" class="red--text">*</span></label>
                        <v-text-field v-model="dv" :rules="[rules.required]" :disabled="empresa !== null" outlined dense
                            required>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3">
                        <label>Nombre <span v-if="empresa === null" class="red--text">*</span></label>
                        <v-text-field v-model="nombre" :rules="[rules.required]" :disabled="empresa !== null" outlined dense
                            required>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3">
                        <label>Registro Mercantil <span v-if="empresa === null" class="red--text">*</span></label>
                        <v-text-field v-model="registro" :rules="[rules.required]" :disabled="empresa !== null" outlined
                            dense required>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3">
                        <label>Correo <span v-if="empresa === null" class="red--text">*</span></label>
                        <v-text-field v-model="correo" :rules="[rules.required, rules.email]" :disabled="empresa !== null"
                            type="email" outlined dense required>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3">
                        <label>Telefono <span v-if="empresa === null" class="red--text">*</span></label>
                        <v-text-field v-model="telefono" :rules="[rules.required, rules.phone]" :disabled="empresa !== null"
                            type="number" hide-spin-buttons outlined dense required>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3">
                        <label>Impuesto <span v-if="empresa === null" class="red--text">*</span></label>
                        <v-text-field v-model="impuesto" :rules="[rules.required]" :disabled="empresa !== null" outlined
                            dense required>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3">
                        <label>Dirección <span v-if="empresa === null" class="red--text">*</span></label>
                        <v-text-field v-model="direccion" :rules="[rules.required]" :disabled="empresa !== null"
                            prepend-inner-icon="mdi-map-marker" outlined dense required>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3">
                        <label>País <span v-if="empresa === null" class="red--text">*</span></label>
                        <v-select v-model="pais" :items="paises" no-data-text="Espere un momento..."
                            @change="getDepartamentos" :rules="[rules.required]" :disabled="empresa !== null"
                            item-text="country_name" item-value="country_name" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3">
                        <label>Departamento <span v-if="empresa === null" class="red--text">*</span></label>
                        <v-select v-model="departamento" :items="departamentos" no-data-text="No hay departamentos"
                            @change="getMunicipios" :rules="[rules.required]" :disabled="empresa !== null"
                            :loading="loadingDepartamentos" item-text="state_name" item-value="state_name" outlined dense
                            required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3">
                        <label>Municipio <span v-if="empresa === null" class="red--text">*</span></label>
                        <v-select v-model="municipio" :items="municipios" no-data-text="No hay municipios"
                            :rules="[rules.required]" :disabled="empresa !== null" :loading="loadingMunicipios"
                            item-text="city_name" item-value="city_name" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="4">
                        <label>Idioma <span v-if="empresa === null" class="red--text">*</span></label>
                        <v-select v-model="lenguaje" :items="idiomas" no-data-text="Espere un momento..."
                            :rules="[rules.required]" :disabled="empresa !== null" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="4">
                        <label>Tipo Operación <span v-if="empresa === null" class="red--text">*</span></label>
                        <v-select v-model="operacion" :items="operaciones" no-data-text="Espere un momento..."
                            :rules="[rules.required]" :disabled="empresa !== null" item-text="tipo" item-value="id" outlined
                            dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="4">
                        <label>Tipo Entorno <span v-if="empresa === null" class="red--text">*</span></label>
                        <v-select v-model="entorno" :items="entornos" no-data-text="Espere un momento..."
                            :rules="[rules.required]" :disabled="empresa !== null" item-text="tipo" item-value="id" outlined
                            dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="4">
                        <label>Tipo Organización <span v-if="empresa === null" class="red--text">*</span></label>
                        <v-select v-model="organizacion" :items="organizaciones" no-data-text="Espere un momento..."
                            :rules="[rules.required]" :disabled="empresa !== null" item-text="tipo" item-value="id" outlined
                            dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="4">
                        <label>Tipo Responsabilidad <span v-if="empresa === null" class="red--text">*</span></label>
                        <v-select v-model="responsabilidad" :items="responsabilidades" no-data-text="Espere un momento..."
                            :rules="[rules.required]" :disabled="empresa !== null" item-text="tipo" item-value="id" outlined
                            dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="4">
                        <label>Tipo Regimen <span v-if="empresa === null" class="red--text">*</span></label>
                        <v-select v-model="regimen" :items="regimenes" no-data-text="Espere un momento..."
                            :rules="[rules.required]" :disabled="empresa !== null" item-text="tipo" item-value="id" outlined
                            dense required>
                        </v-select>
                    </v-col>

                </v-row>

                <div class="buttons" v-if="empresa === null">
                    <v-btn :disabled="!valid" type="submit" :loading="loading" color="primary">guardar</v-btn>
                </div>

            </v-form>
        </v-card-text>
    </v-card>
</template>

<script>

import Swal from 'sweetalert2'
import configService from '@/services/ConfigService'
import UbicacionService from '@/modules/client/services/UbicacionService'

export default {
    name: 'EmpresaComponent',
    props: {
        id: Number,
        empresa: Object,
    },
    watch: {
        empresa: {
            handler(newitem) {
                if (newitem !== null) {
                    this.tipoDocumento = newitem.idDocumento
                    this.identificacion = newitem.identificacion
                    this.nombre = newitem.nombre
                    this.dv = newitem.dv
                    this.registro = newitem.registro
                    this.direccion = newitem.direccion
                    this.correo = newitem.correo
                    this.telefono = newitem.telefono
                    this.lenguaje = newitem.lenguaje
                    this.impuesto = newitem.impuesto
                    this.operacion = newitem.idOperacion
                    this.entorno = newitem.idEntorno
                    this.organizacion = newitem.idOrganizacion
                    this.responsabilidad = newitem.idResponsabilidad
                    this.regimen = newitem.idRegimen
                    if (this.pais != newitem.pais) {
                        this.pais = newitem.pais
                        this.getDepartamentos()
                    }
                    if (this.departamento != newitem.departamento) {
                        this.departamento = newitem.departamento
                        this.getMunicipios()
                    }
                    this.municipio = newitem.municipio
                }
            },
            immediate: true,
        }
    },
    data() {
        return {
            tipoDocumento: '',
            nombre: '',
            identificacion: '',
            pais: '',
            departamento: '',
            municipio: '',
            dv: '',
            registro: '',
            direccion: '',
            correo: '',
            telefono: '',
            impuesto: '',
            lenguaje: '',
            operacion: '',
            entorno: '',
            organizacion: '',
            responsabilidad: '',
            regimen: '',
            valid: false,
            loading: false,
            loadingDepartamentos: false,
            loadingMunicipios: false,
            paises: [],
            departamentos: [],
            municipios: [],
            impuestos: [],
            operaciones: [],
            documentos: [],
            entornos: [],
            organizaciones: [],
            responsabilidades: [],
            regimenes: [],
            idiomas: [
                'Español',
                'Ingles',
            ],
            rules: {
                required: value => !!value || 'Campo requerido.',
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Correo inválido.'
                },
                phone: value => {
                    const pattern = /^(\+?[0-9]{1,3}[-.\s]?)?(\([0-9]{1,4}\)|[0-9]{1,4})[-.\s]?[0-9]{1,10}$/
                    return pattern.test(value) || 'Número de teléfono inválido.'
                },
            },
        }
    },
    methods: {
        /**
         * Crea o actualiza los datos de la empresa.
         */
        crear() {
            this.loading = true

            // Objeto de datos que se enviará al servicio para crear o actualizar la empresa
            let data = {
                configuracionId: this.id,
                nombre: this.nombre,
                tipoDocumento: this.tipoDocumento,
                identificacion: this.identificacion,
                dv: this.dv,
                registro: this.registro,
                pais: this.pais,
                departamento: this.departamento,
                municipio: this.municipio,
                direccion: this.direccion,
                correo: this.correo,
                telefono: this.telefono,
                lenguaje: this.lenguaje,
                impuesto: this.impuesto,
                tipoOperacion: this.operacion,
                tipoEntorno: this.entorno,
                tipoOrganizacion: this.organizacion,
                tipoResponsabilidad: this.responsabilidad,
                tipoRegimen: this.regimen,
            }

            // Llama al servicio para crear o actualizar la empresa
            configService.empresa(data)
                .then(res => {
                    this.loading = false
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
                    console.log(err)
                })
        },
        /**
         * Obtiene los tipos de empresa desde el servicio.
         */
        getTipos() {
            configService.obtenerEmpresaTipos()
                .then(res => {
                    // Asigna los tipos de documentos, entornos, operaciones, organizaciones, regímenes y responsabilidades a las variables del componente
                    this.documentos = res.documentos
                    this.entornos = res.entornos
                    this.operaciones = res.operaciones
                    this.organizaciones = res.organizaciones
                    this.regimenes = res.regimenes
                    this.responsabilidades = res.responsabilidades
                })
                .catch(err => {
                    console.log(err)
                })
        },
        /**
         * Obtiene la lista de países desde el servicio.
         */
        getPaises() {
            UbicacionService.paises()
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
        /**
         * Obtiene la lista de municipios para el departamento seleccionado.
         */
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
        this.getTipos()
        this.getPaises()
    },
}
</script>

<style scoped></style>