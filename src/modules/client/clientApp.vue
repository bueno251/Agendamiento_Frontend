<template>
    <div class="container">
        <h1>
            Consultar Clientes
        </h1>
        <v-card width="90%" class="my-5">
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                    hide-details></v-text-field>
                <v-btn class="mx-5" @click="dialogCreate = true" color="primary">
                    <v-icon>mdi-plus-circle</v-icon> agregar cliente
                </v-btn>
            </v-card-title>
            <v-data-table :headers="headers" :items="desserts" :search="search" :loading="loading"
                no-results-text="No hay ningun cliente que coincida" no-data-text="No hay clientes"
                loading-text="Cargando... Por favor espera"
                :footer-props="{ itemsPerPageText: 'Número de filas', pageText: '{0}-{1} de {2}' }">
                <template v-slot:item="row">
                    <tr>
                        <td>
                            <v-menu :offset-x="true" transition="scale-transition">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn icon v-bind="attrs" v-on="on">
                                        <v-icon>mdi-dots-vertical</v-icon>
                                    </v-btn>
                                </template>
                                <v-list>
                                    <v-list-item link>
                                        <v-list-item-title v-text="'Ajustes'"></v-list-item-title>
                                    </v-list-item>
                                    <v-list-item link>
                                        <v-list-item-title v-text="'Eliminar'"></v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                        <td>{{ row.item.fullname }}</td>
                        <td>{{ row.item.direccion }}</td>
                        <td>{{ row.item.documento }}</td>
                        <td>{{ row.item.correo }}</td>
                        <td>{{ row.item.observacion }}</td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-model="dialogCreate" width="90%" persistent>
            <v-card class="pa-5">
                <form @submit.prevent="newClient">
                    <v-row>
                        <v-col cols="12" md="4">
                            <v-select v-model="tipoDocumento" :items="tipoDocuments" :rules="[rules.required]"
                                no-data-text="Espere un momento..." item-text="tipo" item-value="id" outlined required>
                                <template v-slot:label>
                                    Tipo de documento<span class="red--text">*</span>
                                </template>
                            </v-select>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="documento" :rules="[rules.required, rules.min]" outlined required
                                append-icon="mdi-magnify" @click:append="searchDocument">
                                <template v-slot:label>
                                    Documento<span class="red--text">*</span>
                                </template>
                                <template v-slot:append-outer>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-icon v-on="on">
                                                mdi-help-circle-outline
                                            </v-icon>
                                        </template>
                                        Buscar documento
                                    </v-tooltip>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-text-field v-model="nombre1" :rules="[rules.required]" outlined required>
                                <template v-slot:label>
                                    Primer Nombre<span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-text-field v-model="nombre2" outlined>
                                <template v-slot:label>
                                    Segundo Nombre
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-text-field v-model="apellido1" :rules="[rules.required]" outlined required>
                                <template v-slot:label>
                                    Primer Apellido<span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-text-field v-model="apellido2" outlined>
                                <template v-slot:label>
                                    Segundo Apellido
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="direccion" :rules="[rules.required]" append-icon="mdi-map-marker"
                                outlined required>
                                <template v-slot:label>
                                    Direccion<span class="red--text">*</span>
                                </template></v-text-field>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-select v-model="pais" :items="countries" item-text="country_name" item-value="country_name"
                                :rules="[rules.required]" @change="getStates" no-data-text="Espere un momento..." outlined
                                required>
                                <template v-slot:label>
                                    País<span class="red--text">*</span>
                                </template>
                            </v-select>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-select v-model="departamento" :items="states" item-text="state_name" item-value="state_name"
                                :loading="loadingState" @change="getCities" no-data-text="Selecione un país" outlined>
                                <template v-slot:label>
                                    Departamento<span class="red--text">*</span>
                                </template>
                            </v-select>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-select v-model="ciudad" :items="cities" item-text="city_name" item-value="city_name"
                                :loading="loadingCity" no-data-text="Selecione una ciudad" outlined>
                                <template v-slot:label>
                                    Ciudad<span class="red--text">*</span>
                                </template>
                            </v-select>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-text-field v-model="correo" :rules="[rules.required, rules.email]" outlined required>
                                <template v-slot:label>
                                    Correo<span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-text-field v-model="telefono" :rules="[rules.required]" append-icon="mdi-cellphone" outlined
                                required>
                                <template v-slot:label>
                                    Teléfono Celular<span class="red--text">*</span>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-text-field v-model="telefonoAlt" append-icon="mdi-phone" outlined>
                                <template v-slot:label>
                                    Teléfono Alternativo
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-select v-model="tipoPersona" :items="tipoPeople" no-data-text="Espere un momento..."
                                item-text="tipo" item-value="id" outlined>
                                <template v-slot:label>
                                    Tipo de Persona
                                </template>
                            </v-select>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-select v-model="tipoObligacion" :items="tipoObligations" no-data-text="Espere un momento..."
                                item-text="tipo" item-value="id" outlined>
                                <template v-slot:label>
                                    Tipo de Obligación
                                </template>
                            </v-select>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-select v-model="tipoRegimen" :items="tipoRegimens" no-data-text="Espere un momento..."
                                item-text="tipo" item-value="id" outlined>
                                <template v-slot:label>
                                    Tipo de Régimen
                                </template>
                            </v-select>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea v-model="observacion" auto-grow rows="5" dense label="Observaciones"
                                outlined></v-textarea>
                        </v-col>
                    </v-row>
                    <div class="buttons">
                        <v-btn @click="dialogCreate = false" color="red">cancelar</v-btn>
                        <v-btn type="submit" :loading="loadingbtn" color="light-green">crear</v-btn>
                    </div>
                </form>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import Swal from 'sweetalert2'

export default {
    data() {
        return {
            search: '',
            tipoDocumento: 1,
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
            telefonoAlt: '',
            tipoPersona: '',
            tipoObligacion: '',
            tipoRegimen: '',
            observacion: '',
            token: '',
            loading: false,
            loadingbtn: false,
            loadingState: false,
            loadingCity: false,
            dialogCreate: false,
            tipoDocuments: [],
            tipoObligations: [],
            tipoPeople: [],
            tipoRegimens: [],
            countries: [],
            cities: [],
            states: [],
            desserts: [],
            headers: [
                { text: '', key: 'actions', sortable: false },
                { text: 'Nombre', key: 'nombre', value: 'fullname' },
                { text: 'Dirección', key: 'direccion', value: 'direccion' },
                { text: 'Documento', key: 'documento', value: 'documento' },
                { text: 'Correo', key: 'correo', value: 'correo' },
                { text: 'Observaciones', key: 'observaciones', value: 'observaciones' },
            ],
            rules: {
                required: value => !!value || 'Campo requerido.',
                max: value => value.length <= 20 || 'Maximo 20 caracteres',
                min: value => value.length >= 5 || 'Minimo 5 caracteres',
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Correo invalido.'
                },
            },
        }
    },
    methods: {
        newClient() {
            this.loadingbtn = true
            let url = "client/create"

            let data = {
                nombre1: this.nombre1,
                nombre2: this.nombre2,
                apellido1: this.apellido1,
                apellido2: this.apellido2,
                tipoDocumento: this.tipoDocumento,
                documento: this.documento,
                direccion: this.direccion,
                pais: this.pais,
                departamento: this.departamento,
                ciudad: this.ciudad,
                correo: this.correo,
                telefono: this.telefono,
                telefonoAlt: this.telefonoAlt,
                tipoPersona: this.tipoPersona,
                tipoObligacion: this.tipoObligacion,
                tipoRegimen: this.tipoRegimen,
                observacion: this.observacion,
            }

            this.$axios.post(url, data)
                .then(res => {
                    this.loadingbtn = false
                    this.dialogCreate = false
                    this.tipoDocumento = ''
                    this.documento = ''
                    this.nombre1 = ''
                    this.nombre2 = ''
                    this.apellido1 = ''
                    this.apellido2 = ''
                    this.direccion = ''
                    this.pais = ''
                    this.departamento = ''
                    this.ciudad = ''
                    this.correo = ''
                    this.telefono = ''
                    this.telefonoAlt = ''
                    this.tipoPersona = ''
                    this.tipoObligacion = ''
                    this.tipoRegimen = ''
                    this.observacion = ''
                    this.getClients()
                    Swal.fire({
                        icon: 'success',
                        text: res.data,
                    })
                })
                .catch(err => {
                    this.loadingbtn = false
                    console.log(err);
                    Swal.fire({
                        icon: 'error',
                        text: 'Ocurrio un error codigo de error: ' + err.response.status,
                    })
                })
        },
        getClients() {
            this.loading = true

            let url = "client/read"

            this.$axios.get(url)
                .then(res => {
                    this.loading = false
                    this.desserts = res.data
                })
                .catch(err => {
                    console.log(err);
                    this.loading = false
                })
        },
        getTypes() {
            let url = 'client/type/all'

            this.$axios.get(url)
                .then(res => {
                    this.tipoDocuments = res.data.documents
                    this.tipoObligations = res.data.obligations
                    this.tipoPeople = res.data.people
                    this.tipoRegimens = res.data.regimens
                })
                .catch(err => {
                    console.log(err);
                })
        },
        getToken() {
            let url = 'https://www.universal-tutorial.com/api/getaccesstoken'

            let config = {
                headers: {
                    'api-token': 'QI0MUcpx9szH0xDIPAAtevqD9bEH8NAZfuP1FN4eBkcrjRwG-0IdQqwHvM4f-vbFTuk',
                    'user-email': 'sr.hadoken777@gmail.com'
                }
            }

            this.$axios.get(url, config)
                .then(res => {
                    this.token = res.data.auth_token
                    this.getCountries()
                })
                .catch(err => {
                    console.log(err);
                })
        },
        getCountries() {
            let url = 'https://www.universal-tutorial.com/api/countries'

            let config = {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                }
            }

            this.$axios.get(url, config)
                .then(res => {
                    this.countries = res.data
                })
                .catch(err => {
                    console.log(err);
                })
        },
        getStates() {
            this.loadingState = true
            let url = `https://www.universal-tutorial.com/api/states/${this.pais}`

            let config = {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                }
            }

            this.$axios.get(url, config)
                .then(res => {
                    this.states = res.data
                    this.loadingState = false
                })
                .catch(err => {
                    console.log(err);
                    this.loadingState = false
                })
        },
        getCities() {
            this.loadingCity = true
            let url = `https://www.universal-tutorial.com/api/cities/${this.departamento}`

            let config = {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                }
            }

            this.$axios.get(url, config)
                .then(res => {
                    this.cities = res.data
                    this.loadingCity = false
                })
                .catch(err => {
                    console.log(err);
                    this.loadingCity = false
                })
        },
        searchDocument() {
            alert('hello')
        }
    },
    mounted() {
        this.getClients()
        this.getTypes()
        this.getToken()
    },
}
</script>

<style scoped>
.buttons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 15px;
}
</style>