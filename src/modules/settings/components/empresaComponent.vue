<template>
    <v-card width="90%" elevation="5" min-height="100px">
        <v-card-title class="blue lighten-2 mb-5 white--text">
            Empresa
        </v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="crear">
                <v-row>

                    <v-col cols="12" md="3" sm="6">
                        <label>Tipo Documento <span class="red--text">*</span></label>
                        <v-select v-model="tipoDocumento" :items="documentos" no-data-text="Espere un momento..."
                            :rules="[rules.required]" item-text="tipo" item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>N° Identificación <span v-if="empresa === null" class="red--text">*</span></label>
                        <v-text-field v-model="identificacion" :rules="[rules.required]" :disabled="empresa !== null"
                            type="number" hide-spin-buttons outlined dense required>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Código RNT <span class="red--text">*</span></label>
                        <v-text-field v-model="codeRNT" :rules="[rules.required]" type="number" hide-spin-buttons
                            outlined dense required>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Código CIIU de actividad económica <span class="red--text">*</span></label>
                        <v-text-field v-model="codeCIIU" :rules="[rules.required]" type="number" hide-spin-buttons
                            outlined dense required>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>DV <span class="red--text">*</span></label>
                        <v-text-field v-model="dv" :rules="[rules.required]" outlined dense required>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Nombre <span class="red--text">*</span></label>
                        <v-text-field v-model="nombre" :rules="[rules.required]" outlined dense required>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Registro Mercantil <span class="red--text">*</span></label>
                        <v-text-field v-model="registro" :rules="[rules.required]" outlined dense required>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Correo <span class="red--text">*</span></label>
                        <v-text-field v-model="correo" :rules="[rules.required, rules.email]" type="email" outlined
                            dense required>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Telefono <span class="red--text">*</span></label>
                        <v-text-field v-model="telefono" :rules="[rules.required, rules.phone]" type="number"
                            hide-spin-buttons outlined dense required>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Impuesto <span class="red--text">*</span></label>
                        <v-text-field v-model="impuesto" :rules="[rules.required]" outlined dense required>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Dirección <span class="red--text">*</span></label>
                        <v-text-field v-model="direccion" :rules="[rules.required]" prepend-inner-icon="mdi-map-marker"
                            outlined dense required>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>País <span class="red--text">*</span></label>
                        <v-select v-model="pais" :items="paises" no-data-text="Espere un momento..."
                            @focusout="getDepartamentos" :rules="[rules.required]" item-text="nombre" item-value="id"
                            outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Departamento <span class="red--text">*</span></label>
                        <v-select v-model="departamento" :items="departamentos" no-data-text="Seleccione un pais"
                            @focusout="getCiudades" :rules="[rules.required]" :loading="loadingDepartamentos"
                            item-text="nombre" item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Ciudad <span class="red--text">*</span></label>
                        <v-select v-model="ciudad" :items="ciudades" no-data-text="Seleccione un departamento"
                            :rules="[rules.required]" :loading="loadingCiudades" item-text="nombre" item-value="id"
                            outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Idioma <span class="red--text">*</span></label>
                        <v-select v-model="lenguaje" :items="idiomas" no-data-text="Espere un momento..."
                            :rules="[rules.required]" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Tipo Operación <span class="red--text">*</span></label>
                        <v-select v-model="operacion" :items="operaciones" no-data-text="Espere un momento..."
                            :rules="[rules.required]" item-text="tipo" item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Tipo Entorno <span class="red--text">*</span></label>
                        <v-select v-model="entorno" :items="entornos" no-data-text="Espere un momento..."
                            :rules="[rules.required]" item-text="tipo" item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Tipo Organización <span class="red--text">*</span></label>
                        <v-select v-model="organizacion" :items="organizaciones" no-data-text="Espere un momento..."
                            :rules="[rules.required]" item-text="tipo" item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Tipo Responsabilidad <span class="red--text">*</span></label>
                        <v-select v-model="responsabilidad" :items="responsabilidades"
                            no-data-text="Espere un momento..." :rules="[rules.required]" item-text="tipo"
                            item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="3" sm="6">
                        <label>Tipo Regimen <span class="red--text">*</span></label>
                        <v-select v-model="regimen" :items="regimenes" no-data-text="Espere un momento..."
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
import service from '@/services/service'

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
                    this.codeRNT = newitem.codigoRNT
                    this.codeCIIU = newitem.codigoCIIU
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
                    if (this.pais != newitem.paisId) {
                        this.pais = newitem.paisId
                        this.getDepartamentos()
                    }
                    if (this.departamento != newitem.departamentoId) {
                        this.departamento = newitem.departamentoId
                        this.getCiudades()
                    }
                    this.ciudad = newitem.ciudadId
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
            codeRNT: '',
            codeCIIU: '',
            pais: '',
            departamento: '',
            ciudad: '',
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
            loadingCiudades: false,
            paises: [],
            departamentos: [],
            ciudades: [],
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
                codigoRNT: this.codeRNT,
                codigoCIIU: this.codeCIIU,
                dv: this.dv,
                registro: this.registro,
                pais: this.pais,
                departamento: this.departamento,
                ciudad: this.ciudad,
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
            service.guardarEmpresa(data)
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
                    console.error(err)
                })
        },
        /**
         * Obtiene los tipos de empresa desde el servicio.
         */
        getTipos() {
            service.obtenerTiposEmpresa()
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
        getDepartamentos() {
            this.loadingDepartamentos = true
            this.departamento = ''
            this.ciudad = ''
            this.ciudades = []

            service.obtenerDepartamentos(this.pais)
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
        getCiudades() {
            this.loadingCiudades = true
            this.ciudad = ''

            service.obtenerCiudades(this.departamento)
                .then(res => {
                    this.ciudades = res
                    this.loadingCiudades = false
                })
                .catch(err => {
                    console.error(err)
                    this.loadingCiudades = false
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