<template>
    <v-dialog :value="show" width="95%" persistent>
        <v-card class="pa-5">
            <v-form ref="form" v-model="valid" @submit.prevent="save()">
                <div class="grid">

                    <template v-for="weekday in week">
                        <v-col cols="12" v-bind:key="weekday.nombre">
                            <div class="flex">
                                <label>{{ weekday.name }}</label>
                            </div>
                        </v-col>

                        <v-col cols="12" v-bind:key="weekday.nombre">
                            <v-text-field v-model="weekday.normal" :rules="[rules.required]" dense outlined required>
                                <template v-slot:label>
                                    Precio
                                </template>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12" v-bind:key="weekday.nombre">
                            <v-text-field v-model="weekday.festivo" :rules="[rules.required]" dense outlined required>
                                <template v-slot:label>
                                    Precio Festivos
                                </template>
                            </v-text-field>
                        </v-col>
                    </template>

                </div>

                <div class="buttons">
                    <v-btn @click="close" color="red">cancelar</v-btn>
                    <v-btn :disabled="!valid" type="submit" :loading="loading" color="primary">guardar</v-btn>
                </div>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>

import Swal from 'sweetalert2'
import roomService from '../service/roomService'

export default {
    name: 'PreciosRoom',
    props: {
        show: Boolean,
        id: Number,
    },
    data() {
        return {
            valid: false,
            loading: false,
            week: [
                { name: 'Lunes', normal: '', festivo: '' },
                { name: 'Martes', normal: '', festivo: '' },
                { name: 'Miercoles', normal: '', festivo: '' },
                { name: 'Jueves', normal: '', festivo: '' },
                { name: 'Viernes', normal: '', festivo: '' },
                { name: 'Sabado', normal: '', festivo: '' },
                { name: 'Domingo', normal: '', festivo: '' },
            ],
            rules: {
                required: value => !!value || 'Campo requerido.',
            },
        }
    },
    watch: {
        id: {
            handler(newitem) {
                if (newitem && this.show) {
                    this.getPrecios()
                }
            },
            immediate: true,
        }
    },
    methods: {
        save() {
            this.loading = true

            let data = {
                weekdays: this.week
            }

            roomService.savePrecios(data, this.id)
                .then(res => {
                    this.loading = false
                    this.$emit('create')
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
        getPrecios() {
            roomService.getPrecios(this.id)
                .then(res => {
                    res.forEach((day, index) => {
                        if (day.name == this.week[index].name) {
                            this.week[index].normal = day.normal
                            this.week[index].festivo = day.festivo
                        }
                    });

                    if (res.length == 0) {
                        this.$refs.form.reset()
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        close() {
            this.$refs.form.resetValidation()
            this.$emit('close')
        },
    },
    mounted() {
    },
}
</script>

<style scoped>
.flex {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 70%;
}

.grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-areas:
        'label'
        'input1'
        'input2';
}

.grid> :nth-child(3n-2) {
    grid-area: label;
    grid-column: span 1;
    /* Ocupa una columna */
}

.grid> :nth-child(3n-1) {
    grid-area: input1;
    grid-column: span 1;
    /* Ocupa una columna */
}

.grid> :nth-child(3n) {
    grid-area: input2;
    grid-column: span 1;
    /* Ocupa una columna */
}

.buttons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 15px;
}
</style>