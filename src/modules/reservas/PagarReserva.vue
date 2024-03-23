<template>
    <div class="main">

        <v-card class="pa-5 d-flex flex-column justify-space-between" elevation="5">
            <div>
                <h3>Información De La Reserva</h3>
                <p>
                    <strong>
                        Habitacion:
                    </strong>
                    {{ reserva.room.nombre }} (x{{ reserva.noches }} {{ reserva.noches > 1 ? 'Noches' : 'Noche' }})
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
                        TOTAL: ${{ comaEnMiles(reserva.precioTotal) }} {{ divisa.codigo }}
                    </strong>
                </h2>
            </div>
        </v-card>

        <v-card class="pa-5" elevation="5">
            <v-form ref="formPagos" v-model="validPagos" @submit.prevent="modalDatosUser = true">
                <v-row>
                    <v-col cols="12" v-if="metodosPago.length > 1">
                        <label>Selecciona un método de pago <span class="red--text">*</span></label>
                        <v-select v-model="metodoPago" :items="metodosPago"
                            no-data-text="No hay metodos de pago validas" :rules="[rules.required]" item-text="nombre"
                            return-object outlined dense required>
                        </v-select>
                    </v-col>

                    <template v-if="metodoPago.id == '1'">
                        <v-col cols="12">
                            <label>Número para transacciones: 123456789</label>
                        </v-col>

                        <v-col cols="12" md="6" sm="6">
                            <label>Monto <span class="red--text">*</span></label>
                            <v-text-field v-model="monto" :rules="[rules.required]" readonly dense outlined required>
                            </v-text-field>
                        </v-col>

                        <v-col v-if="metodoPago.requiereComprobante" cols="12" md="6" sm="6">
                            <label>Comprobante de pago <span class="red--text">*</span></label>
                            <v-file-input v-model="file" :rules="[rules.file]" :clearable="false" accept="image/*,.pdf"
                                truncate-length="15" chips outlined dense required></v-file-input>
                        </v-col>
                    </template>
                </v-row>

                <div class="buttons">
                    <v-btn @click="$router.back()" color="blue">cancelar</v-btn>
                    <v-btn :disabled="!validPagos" :loading="loading" color="light-green" type="submit">
                        {{ metodoPago.requiereComprobante ? 'Guardar' : 'Pagar' }}
                    </v-btn>
                </div>
            </v-form>
        </v-card>

        <v-dialog :value="modalDatosUser" width="90%" persistent>
            <v-card class="pa-5" elevation="5">
                <v-toolbar elevation="0">
                    <h2>{{ titulos[steps] }}</h2>
                    <v-spacer></v-spacer>
                    <v-btn icon class="ml-3" @click="modalDatosUser = false"><v-icon>mdi-close-box</v-icon></v-btn>
                </v-toolbar>

                <v-window v-model="steps">
                    <v-window-item>
                        <v-form ref="form" v-model="validInfo" @submit.prevent="steps++">
                            <v-row class="pt-5">

                                <v-col class="py-0" cols="12" md="6" sm="6">
                                    <label>
                                        Tipo de documento <span class="red--text">*</span>
                                    </label>
                                    <v-select v-model="tipoDocumento" :items="tipoDocuments" :rules="[rules.required]"
                                        no-data-text="Espere un momento..." item-text="tipo" item-value="id" dense
                                        outlined required>
                                    </v-select>
                                </v-col>

                                <v-col class="py-0" cols="12" md="6" sm="6">
                                    <label>Número Documento <span class="red--text">*</span></label>
                                    <v-text-field v-model="documento" :rules="[rules.required]" type="number"
                                        hide-spin-buttons dense outlined required>
                                    </v-text-field>
                                </v-col>

                                <v-col class="py-0" cols="12" md="6" sm="6">
                                    <label>Correo <span v-if="correoRequired" class="red--text">*</span></label>
                                    <v-text-field v-model="correo" :rules="[rules.email]" type="email"
                                        :required="correoRequired" dense outlined>
                                    </v-text-field>
                                </v-col>

                                <v-col class="py-0" cols="12" md="6" sm="6">
                                    <label>Telefono <span class="red--text">*</span></label>
                                    <v-text-field v-model="telefono" :rules="[rules.required, rules.phone]"
                                        type="number" hide-spin-buttons dense outlined required>
                                    </v-text-field>
                                </v-col>

                                <v-col class="py-0" cols="12" md="4" sm="6">
                                    <label>País De Residencia <span class="red--text">*</span></label>
                                    <v-select v-model="paisResidencia" :items="paises"
                                        no-data-text="Espere un momento..." @change="getDepartamentos('Residencia')"
                                        :rules="[rules.required]" item-text="nombre" item-value="id" outlined dense
                                        required>
                                    </v-select>
                                </v-col>

                                <v-col class="py-0" cols="12" md="4" sm="6">
                                    <label>Departamento De Residencia <span class="red--text">*</span></label>
                                    <v-select v-model="departamentoResidencia" :items="departamentosResidencia"
                                        no-data-text="Seleccione un pais" @change="getCiudades('Residencia')"
                                        :rules="[rules.required]" :loading="loadingDepartamentosResidencia"
                                        item-text="nombre" item-value="id" outlined dense required>
                                    </v-select>
                                </v-col>

                                <v-col class="py-0" cols="12" md="4" sm="6">
                                    <label>Ciudad De Residencia <span class="red--text">*</span></label>
                                    <v-select v-model="ciudadResidencia" :items="ciudadesResidencia"
                                        no-data-text="Seleccione un departamento" :rules="[rules.required]"
                                        :loading="loadingCiudadesResidencia" item-text="nombre" item-value="id" outlined
                                        dense required>
                                    </v-select>
                                </v-col>

                                <v-col class="py-0" cols="12" md="4" sm="6">
                                    <label>País De Procedencia <span class="red--text">*</span></label>
                                    <v-select v-model="paisProcedencia" :items="paises"
                                        no-data-text="Espere un momento..." @change="getDepartamentos('Procedencia')"
                                        :rules="[rules.required]" item-text="nombre" item-value="id" outlined dense
                                        required>
                                    </v-select>
                                </v-col>

                                <v-col class="py-0" cols="12" md="4" sm="6">
                                    <label>Departamento De Procedencia<span class="red--text">*</span></label>
                                    <v-select v-model="departamentoProcedencia" :items="departamentosProcedencia"
                                        no-data-text="Seleccione un pais" @change="getCiudades('Procedencia')"
                                        :rules="[rules.required]" :loading="loadingDepartamentosProcedencia"
                                        item-text="nombre" item-value="id" outlined dense required>
                                    </v-select>
                                </v-col>

                                <v-col class="py-0" cols="12" md="4" sm="6">
                                    <label>Ciudad De Procedencia<span class="red--text">*</span></label>
                                    <v-select v-model="ciudadProcedencia" :items="ciudadesProcedencia"
                                        no-data-text="Seleccione un departamento" :rules="[rules.required]"
                                        :loading="loadingCiudadesProcedencia" item-text="nombre" item-value="id"
                                        outlined dense required>
                                    </v-select>
                                </v-col>

                                <v-col class="py-0" cols="12" md="6" sm="6">
                                    <label>Motivo De Viaje <span class="red--text">*</span></label>
                                    <v-select v-model="motivo" :items="motivos" no-data-text="No hay motivos"
                                        :rules="[rules.required]" item-text="nombre" item-value="id" outlined dense
                                        required>
                                    </v-select>
                                </v-col>

                            </v-row>

                            <div class="buttons">
                                <v-btn @click="modalDatosUser = false" color="blue">
                                    cancelar
                                </v-btn>
                                <v-btn :disabled="!validInfo" :loading="loading" color="light-green" type="submit">
                                    Continuar
                                </v-btn>
                            </div>
                        </v-form>
                    </v-window-item>

                    <v-window-item>
                        <v-form ref="form" v-model="validHuespedes" @submit.prevent="checkHuespedes">
                            <v-row class="pt-5">

                                <v-col class="py-0" cols="12" md="6" sm="6">
                                    <label>
                                        Huesped
                                    </label>
                                    <v-select v-model="huesped" :items="huespedes"
                                        :item-text="item => `${item.nombre} ${item.apellido}`" return-object dense
                                        outlined required>
                                    </v-select>
                                </v-col>

                                <v-col class="py-0" cols="12" md="6" sm="6">
                                    <label>Nombre <span class="red--text">*</span></label>
                                    <v-text-field v-model="huesped.nombre" :rules="[rules.required]" dense outlined
                                        required>
                                    </v-text-field>
                                </v-col>

                                <v-col class="py-0" cols="12" md="6" sm="6">
                                    <label>Apellido <span class="red--text">*</span></label>
                                    <v-text-field v-model="huesped.apellido" :rules="[rules.required]" dense outlined
                                        required>
                                    </v-text-field>
                                </v-col>

                            </v-row>

                            <div class="buttons">
                                <v-btn @click="steps--" color="blue">
                                    cancelar
                                </v-btn>
                                <v-btn :disabled="!validHuespedes" :loading="loading" color="light-green" type="submit">
                                    Continuar
                                </v-btn>
                            </div>
                        </v-form>
                    </v-window-item>
                </v-window>

            </v-card>
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
            documento: vuex.state.reserva.documento,
            roomid: vuex.state.reserva.room.id,
            tipoDocumento: '',
            correo: '',
            telefono: vuex.state.reserva.telefono,
            monto: this.comaEnMiles(vuex.state.reserva.precioTotal),
            motivo: 1,
            steps: 0,
            metodoPago: { id: 0 },
            porcentajeSeparacion: 0,
            validPagos: false,
            validInfo: false,
            validHuespedes: false,
            modalDatosUser: false,
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
            titulos: [
                'Información de contacto',
                'Información de huespedes',
            ],
            huespedes: [],
            huesped: {},
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
                documento: this.documento,
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
                verificacion_pago: this.metodoPago.id == 1 ? 0 : 1,
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
        checkHuespedes() {
            for (let i = 0; i < this.huespedes.length; i++) {
                const huesped = this.huespedes[i]

                if (huesped.nombre == "" || huesped.apellido == "") {
                    this.huesped = huesped
                    return
                }
            }

            Swal.fire({
                icon: 'success',
                text: 'Guardar Reserva(pendiente)',
            })
        },
        async getDatos() {
            service.obtenerMetodosPago()
                .then(res => {
                    this.metodosPago = res
                    this.metodoPago = res[0]
                })
                .catch(err => {
                    console.error(err)
                })

            service.obtenerConfigReserva()
                .then(res => {
                    this.correoRequired = res.correoObligatorio
                    this.porcentajeSeparacion = res.porcentajeSeparacion
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

                        for (let i = 0; i < this.reserva.adultos; i++) {
                            let huesped = {
                                nombre: `Huesped ${i + 1}`,
                                apellido: '',
                            }

                            this.huespedes.push(huesped)
                        }

                        this.huesped = this.huespedes[0]
                    }
                })
                .catch(err => {
                    console.error(err)
                })

            await service.encontrarClienteDocumento(this.documento)
                .then(res => {
                    if ('id' in res) {
                        this.tipoDocumento = res.tipo_documento_id
                        this.huespedes[0].nombre = res.nombre1 + (res.nombre2 ? ' ' + res.nombre2 : '')
                        this.huespedes[0].apellido = res.apellido1 + (res.apellido2 ? ' ' + res.apellido2 : '')
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
    display: flex;
    flex-direction: column;
    width: 95%;
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