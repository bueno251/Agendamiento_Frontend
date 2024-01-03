<template>
    <v-dialog :value="show" width="80%" max-width="500px" persistent>
        <v-card class="pa-5">
            <v-form ref="form" v-model="valid" @submit.prevent="crear">
                <v-row>

                    <v-col>
                        <label>Cedula<span class="red--text">*</span></label>
                        <v-text-field v-model="cedula" :rules="[rules.required]" dense outlined required>
                        </v-text-field>
                    </v-col>

                    <v-col>
                        <label>Teléfono<span class="red--text">*</span></label>
                        <v-text-field v-model="telefono" :rules="[rules.required]" dense outlined required>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12">
                        <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="dates"
                            transition="scale-transition" offset-y min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-row>
                                    <v-col>
                                        <label>Fecha De LLegada<span class="red--text">*</span></label>
                                        <v-text-field v-model="fechaLlegada" :rules="[rules.required]"
                                            prepend-inner-icon="mdi-calendar" v-bind="attrs" v-on="on" readonly dense
                                            outlined required>
                                        </v-text-field>
                                    </v-col>

                                    <v-col>
                                        <label>Fecha De Salida</label>
                                        <v-text-field v-model="fechaSalida" prepend-inner-icon="mdi-calendar" v-bind="attrs"
                                            v-on="on" readonly dense outlined>
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                            </template>

                            <v-date-picker v-model="dates" :min="hoy" locale="es" range no-title scrollable>
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="menu = false">
                                    cancelar
                                </v-btn>
                                <v-btn text color="primary" @click="$refs.menu.save(dates)">
                                    aceptar
                                </v-btn>
                            </v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-col cols="6">
                        <div class="d-flex justify-space-between align-center gap">
                            <label>Adultos</label>
                            <div>
                                <v-btn icon @click="adultos--" :disabled="adultos <= 1">
                                    <v-icon>
                                        mdi-minus-circle
                                    </v-icon>
                                </v-btn>
                                <span>
                                    {{ adultos }}
                                </span>
                                <v-btn icon @click="adultos++">
                                    <v-icon>
                                        mdi-plus-circle
                                    </v-icon>
                                </v-btn>
                            </div>
                        </div>
                    </v-col>

                    <v-col cols="6">
                        <div class="d-flex justify-space-between align-center gap">
                            <label>Niños</label>
                            <div>
                                <v-btn icon @click="niños--" :disabled="niños <= 0">
                                    <v-icon>
                                        mdi-minus-circle
                                    </v-icon>
                                </v-btn>
                                {{ niños }}
                                <v-btn icon @click="niños++">
                                    <v-icon>
                                        mdi-plus-circle
                                    </v-icon>
                                </v-btn>
                            </div>
                        </div>
                    </v-col>
                </v-row>

                <div class="buttons mt-5">
                    <v-btn @click="close" color="red">cancelar</v-btn>
                    <v-btn :disabled="!valid" type="submit" :loading="loading" color="light-green">aceptar</v-btn>
                </div>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>

// import Swal from 'sweetalert2'
// import roomService from '../service/roomService'

export default {
    name: 'AgendarRoom',
    props: {
        show: Boolean,
    },
    data() {
        return {
            cedula: '',
            telefono: '',
            adultos: 2,
            niños: 0,
            menu: false,
            valid: false,
            loading: false,
            dates: [],
            hoy: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            rules: {
                required: value => !!value || 'Campo requerido.',
            },
        }
    },
    computed: {
        fechaLlegada() {
            return this.dates[0] || ''
        },
        fechaSalida() {
            return this.dates[1] || ''
        },
    },
    watch: {
        fechaSalida: function () {
            if (this.dates.length > 1) {
                let fecha1 = new Date(this.dates[0]);
                let fecha2 = new Date(this.dates[1]);

                if (fecha1.toISOString().slice(0, 10) === fecha2.toISOString().slice(0, 10)) {
                    fecha2.setDate(fecha2.getDate() + 1);
                    this.dates[1] = fecha2.toISOString().slice(0, 10);
                }

                let sortDates = this.dates.toSorted()
                this.dates = sortDates
            }
        },
    },
    methods: {
        crear() {
            // this.loading = true

            // let data = {
            //     nombre: this.nombre,
            //     descripcion: this.descripcion,
            //     roomTipo: this.tipo,
            //     adultos: this.adultos,
            //     estado: this.estado,
            // }

            // roomService.crearRoom(data)
            //     .then(res => {
            //         this.loading = false
            //         this.$emit('create')
            //         Swal.fire({
            //             icon: 'success',
            //             text: res.message,
            //         })
            //     })
            //     .catch(err => {
            //         this.loading = false
            //         Swal.fire({
            //             icon: 'error',
            //             text: err.response.data.message,
            //         })
            //         console.log(err)
            //     })
        },
        close() {
            this.$emit('close')
        },
    },
    mounted() {
    },
}
</script>

<style scoped>
.gap {
    gap: 10px;
}
</style>
