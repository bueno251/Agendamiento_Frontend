<template>
    <div class="main">
        <v-card class="pa-5 column2" elevation="5">
            <h2>Información de contacto</h2>
            <v-form ref="form" v-model="validInfo">
                <v-row>

                    <v-col cols="12" md="6" sm="6">
                        <label>
                            Tipo de documento <span class="red--text">*</span>
                        </label>
                        <v-select v-model="tipoDocumento" :items="tipoDocuments" :rules="[rules.required]"
                            no-data-text="Espere un momento..." item-text="tipo" item-value="id" dense outlined
                            required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="6" sm="6">
                        <label>Número Documento <span class="red--text">*</span></label>
                        <v-text-field v-model="cedula" :rules="[rules.required]" type="number" hide-spin-buttons dense
                            outlined required>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="6">
                        <label>Nombre <span class="red--text">*</span></label>
                        <v-text-field v-model="nombre" :rules="[rules.required]" dense outlined required>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="6">
                        <label>Apellido <span class="red--text">*</span></label>
                        <v-text-field v-model="apellido" :rules="[rules.required]" dense outlined required>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="6">
                        <label>Correo <span v-if="correoRequired" class="red--text">*</span></label>
                        <v-text-field v-model="correo" :rules="[rules.email]" type="email" :required="correoRequired"
                            dense outlined>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="6">
                        <label>Telefono <span class="red--text">*</span></label>
                        <v-text-field v-model="telefono" :rules="[rules.required, rules.phone]" type="number"
                            hide-spin-buttons dense outlined required>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="4" sm="6">
                        <label>País De Residencia <span class="red--text">*</span></label>
                        <v-select v-model="paisResidencia" :items="paises" no-data-text="Espere un momento..."
                            @change="getDepartamentos('Residencia')" :rules="[rules.required]" item-text="nombre"
                            item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="4" sm="6">
                        <label>Departamento De Residencia <span class="red--text">*</span></label>
                        <v-select v-model="departamentoResidencia" :items="departamentosResidencia"
                            no-data-text="Seleccione un pais" @change="getCiudades('Residencia')"
                            :rules="[rules.required]" :loading="loadingDepartamentosResidencia" item-text="nombre"
                            item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="4" sm="6">
                        <label>Ciudad De Residencia <span class="red--text">*</span></label>
                        <v-select v-model="ciudadResidencia" :items="ciudadesResidencia"
                            no-data-text="Seleccione un departamento" :rules="[rules.required]"
                            :loading="loadingCiudadesResidencia" item-text="nombre" item-value="id" outlined dense
                            required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="4" sm="6">
                        <label>País De Procedencia <span class="red--text">*</span></label>
                        <v-select v-model="paisProcedencia" :items="paises" no-data-text="Espere un momento..."
                            @change="getDepartamentos('Procedencia')" :rules="[rules.required]" item-text="nombre"
                            item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="4" sm="6">
                        <label>Departamento De Procedencia<span class="red--text">*</span></label>
                        <v-select v-model="departamentoProcedencia" :items="departamentosProcedencia"
                            no-data-text="Seleccione un pais" @change="getCiudades('Procedencia')"
                            :rules="[rules.required]" :loading="loadingDepartamentosProcedencia" item-text="nombre"
                            item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="4" sm="6">
                        <label>Ciudad De Procedencia<span class="red--text">*</span></label>
                        <v-select v-model="ciudadProcedencia" :items="ciudadesProcedencia"
                            no-data-text="Seleccione un departamento" :rules="[rules.required]"
                            :loading="loadingCiudadesProcedencia" item-text="nombre" item-value="id" outlined dense
                            required>
                        </v-select>
                    </v-col>

                    <v-col cols="12" md="6" sm="6">
                        <label>Motivo De Viaje <span class="red--text">*</span></label>
                        <v-select v-model="motivo" :items="motivos" no-data-text="No hay motivos"
                            :rules="[rules.required]" item-text="nombre" item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                </v-row>
            </v-form>
        </v-card>

        <v-card class="pa-5 d-flex flex-column justify-space-between" elevation="5">
            <div>
                <h3>Información De La Reserva</h3>
                <p>
                    <strong>
                        Habitacion:
                    </strong>
                    {{ reserva.room.nombre }} (x{{ reserva.cantidad_rooms }})
                </p>
                <p>
                    <strong>
                        Llegada:
                    </strong>
                    {{ reserva.dateIn }}
                </p>
                <p>
                    <strong>
                        Salida:
                    </strong>
                    {{ reserva.dateOut }}
                </p>
                <p>
                    <strong>
                        Adultos:
                    </strong>
                    {{ reserva.adultos }}
                </p>
                <p v-if="reserva.niños > 0">
                    <strong>
                        Niños:
                    </strong>
                    {{ reserva.niños }}
                </p>
            </div>
            <div class="d-flex flex-column">
                <span v-if="reserva.precioAdultos">
                    Adultos Extra: ${{ comaEnMiles(reserva.precioAdultos) }} {{ divisa.codigo }} <span></span>
                </span>
                <span v-if="reserva.precioNiños">
                    Niños: ${{ comaEnMiles(reserva.precioNiños) }} {{ divisa.codigo }}
                </span>
                <span v-if="reserva.precioDecoracion">
                    Decoración: ${{ comaEnMiles(reserva.precioDecoracion) }} {{ divisa.codigo }}
                </span>
                <span v-if="reserva.precioDesayuno">
                    Desayuno: ${{ comaEnMiles(reserva.precioDesayuno) }} {{ divisa.codigo }}
                </span>
                <span>
                    Alojamiento: ${{ comaEnMiles(reserva.precioAlojamiento) }} {{ divisa.codigo }}
                </span>
                <span>
                    Valor Separación ({{ porcentajeSeparacion }}%): ${{ comaEnMiles(reserva.valorSeparacion) }} {{
                divisa.codigo }}
                </span>
                <h2 style="text-wrap: balance;">
                    <strong>
                        TOTAL: ${{ comaEnMiles(reserva.precioTotal) }} {{ divisa.codigo }} <span
                            v-if="reserva.room.tieneIva">IVA: ({{ reserva.room.iva }}%)</span>
                    </strong>
                </h2>
            </div>
        </v-card>

        <v-card class="pa-5 column2" elevation="5">
            <v-form ref="formPagos" v-model="validPagos" @submit.prevent="reservar()">
                <v-row>
                    <v-col cols="12" v-if="metodosPago.length > 1">
                        <label>Selecciona un método de pago <span class="red--text">*</span></label>
                        <v-select v-model="metodoPago" :items="metodosPago"
                            no-data-text="No hay metodos de pago validas" :rules="[rules.required]" item-text="nombre"
                            item-value="id" outlined dense required>
                        </v-select>
                    </v-col>

                    <template v-if="metodoPago == '1'">
                        <v-col cols="12">
                            <label>Número para transacciones: 123456789</label>
                        </v-col>

                        <v-col cols="12" md="6" sm="6">
                            <label>Monto <span class="red--text">*</span></label>
                            <v-text-field v-model="monto" :rules="[rules.required]" readonly dense outlined required>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12" md="6" sm="6">
                            <label>Comprobante de pago <span class="red--text">*</span></label>
                            <v-file-input v-model="file" :rules="[rules.file]" :clearable="false" accept="image/*,.pdf"
                                truncate-length="15" chips outlined dense required></v-file-input>
                        </v-col>
                    </template>
                </v-row>

                <div class="buttons">
                    <v-btn @click="$router.back()" color="blue">cancelar</v-btn>
                    <v-btn :disabled="!validPagos || !validInfo" :loading="loading" color="light-green" type="submit">
                        pagar
                    </v-btn>
                </div>
            </v-form>
        </v-card>

        <v-dialog :value="modalTransferencia" width="90%" max-width="500px" persistent>

        </v-dialog>
    </div>
</template>

<script>

import vuex from "@/store"
import Swal from "sweetalert2"
import service from "@/services/service"

export default {
    name: 'PagarReserva',
    data() {
        return {
            reserva: vuex.state.reserva,
            cedula: vuex.state.reserva.cedula,
            roomid: vuex.state.reserva.room.id,
            tipoDocumento: '',
            nombre: '',
            apellido: '',
            correo: '',
            telefono: vuex.state.reserva.telefono,
            monto: this.comaEnMiles(vuex.state.reserva.precioTotal),
            motivo: 1,
            metodoPago: 1,
            porcentajeSeparacion: 0,
            validPagos: false,
            validInfo: false,
            modalTransferencia: false,
            loading: false,
            correoRequired: true,
            loadingDepartamentosProcedencia: false,
            loadingCiudadesProcedencia: false,
            loadingDepartamentosResidencia: false,
            loadingCiudadesResidencia: false,
            file: null,
            paisProcedencia: '',
            departamentoProcedencia: '',
            ciudadProcedencia: '',
            paisResidencia: '',
            departamentoResidencia: '',
            ciudadResidencia: '',
            metodosPago: [],
            tipoDocuments: [],
            paises: [],
            departamentosResidencia: [],
            departamentosProcedencia: [],
            ciudadesResidencia: [],
            ciudadesProcedencia: [],
            motivos: [],
            divisa: {
                codigo: '',
            },
            rules: {
                required: value => !!value || 'Campo requerido.',
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

                    if (this.correoRequired) {
                        return !!value || 'Campo requerido.'
                    }

                    return (pattern.test(value) || !value) || 'Correo inválido.'
                },
                phone: value => {
                    const pattern = /^(\+?[0-9]{1,3}[-.\s]?)?(\([0-9]{1,4}\)|[0-9]{1,4})[-.\s]?[0-9]{1,10}$/
                    return pattern.test(value) || 'Número de teléfono inválido.'
                },
                file: file => {
                    const allowedFormats = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
                    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf'];

                    if (!file) {
                        return 'Campo requerido.'
                    }

                    if (!allowedFormats.includes(file.type) && !allowedExtensions.includes(file.name.slice(-4).toLowerCase())) {
                        return 'El archivo debe ser una imagen (JPEG, PNG, GIF) o un archivo PDF';
                    }

                    return true
                },
            },
        }
    },
    methods: {
        /**
        * Realiza la reserva de una habitación.
        * Se encarga de enviar la información de la reserva al servidor y gestionar la respuesta.
        */
        reservar() {
            this.loading = true

            // Construye el objeto de datos para la reserva
            let data = {
                tipoDocumento: this.tipoDocumento,
                cedula: this.cedula,
                nombre: this.nombre,
                apellido: this.apellido,
                correo: this.correo,
                telefono: this.telefono,
                dateIn: this.reserva.dateIn,
                dateOut: this.reserva.dateOut,
                room: this.reserva.room.id,
                adultos: this.reserva.adultos,
                niños: this.reserva.niños,
                precio: this.reserva.precioTotal,
                motivo: this.motivo,
                ciudadResidencia: this.ciudadResidencia,
                ciudadProcedencia: this.ciudadProcedencia,
                verificacion_pago: this.metodoPago == 1 ? 0 : 1,
            }

            // Realiza la llamada al servicio para reservar
            service.reservar(data)
                .then(res => {
                    this.loading = false
                    // Muestra un mensaje de éxito y regresa a la página anterior
                    Swal.fire({
                        icon: 'success',
                        text: res.message,
                    }).then(this.$router.back())
                })
                .catch(err => {
                    console.error(err)
                    this.loading = false
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
        async getDatos() {
            service.obtenerMetodosPago()
                .then(res => {
                    this.metodosPago = res
                })
                .catch(err => {
                    console.error(err)
                })

            service.obtenerConfigReserva()
                .then(res => {
                    this.correoRequired = res.correoObligatorio
                    this.porcentajeSeparacion = res.porcentajeSeparacion
                    this.$refs.form.resetValidation()
                })
                .catch(err => {
                    console.error(err)
                })

            service.obtenerTiposDocumentoCliente()
                .then(res => {
                    this.tipoDocuments = res
                })
                .catch(err => {
                    console.error(err)
                })

            service.obtenerMotivosReserva()
                .then(res => {
                    this.motivos = res
                })
                .catch(err => {
                    console.error(err)
                })

            service.obtenerPaises()
                .then(res => {
                    this.paises = res
                })
                .catch(err => {
                    console.error(err)
                })

            service.obtenerValoresDefault()
                .then(res => {
                    this.divisa = res.divisa
                })
                .catch(err => {
                    console.error(err)
                })

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

            await service.encontrarClienteDocumento(this.cedula)
                .then(res => {
                    if ('id' in res) {
                        this.tipoDocumento = res.tipo_documento_id
                        this.nombre = res.nombre1 + (res.nombre2 ? ' ' + res.nombre2 : '')
                        this.apellido = res.apellido1 + (res.apellido2 ? ' ' + res.apellido2 : '')
                        this.telefono = res.telefono
                        this.paisResidencia = res.paisId
                        this.departamentoResidencia = res.departamentoId
                        this.ciudadResidencia = res.ciudadId
                    }
                })
                .catch(err => {
                    console.error(err)
                })
        },
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
        this.getDatos()
    },
}
</script>

<style scoped>
.main {
    display: grid;
    width: min(95%, 1275px);
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 15px;
}

.column2 {
    grid-column: span 2;
}

.main .v-card {
    justify-self: center;
    width: 100%;
}

@media only screen and (max-width: 900px) {
    .column2 {
        grid-column: auto;
    }

    .main {
        grid-template-columns: repeat(auto-fill, minmax(90%, 1fr));
    }
}
</style>