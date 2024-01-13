<template>
    <nav class="nav blue text--accent-4">

        <div>
            Logo
        </div>

        <!-- <div class="search-field">
            <v-text-field class="rounded-pill" prepend-inner-icon="mdi-magnify" type="text" width="500px" clearable dense
                outlined></v-text-field>
        </div> -->

        <div>
            <v-menu :offset-y="true" transition="scale-transition">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-avatar size="50px">
                            <v-icon>
                                mdi-account-circle
                            </v-icon>
                        </v-avatar>
                    </v-btn>
                </template>
                <v-list v-if="!vuex.state.token">
                    <v-list-item link @click="dialogLogin = true">
                        <v-list-item-title v-text="'Iniciar Sesión'"></v-list-item-title>
                    </v-list-item>
                    <v-list-item link>
                        <v-list-item-title v-text="'Registrarse'"></v-list-item-title>
                    </v-list-item>
                </v-list>
                <v-list v-else>
                    <v-list-item link :to="{ name: 'myReservas' }">
                        <v-list-item-title v-text="'Mis Reservas'"></v-list-item-title>
                    </v-list-item>
                    <v-list-item link @click="logout">
                        <v-list-item-title v-text="'Cerrar Sesión'"></v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>

        <v-dialog :value="dialogLogin" max-width="500px" persistent>
            <v-card class="pa-5">
                <v-form v-model="valid" @submit.prevent="login()">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="correo" label="Correo" :rules="[rules.required, rules.email]"
                                prepend-inner-icon="mdi-account" outlined required>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field v-model="password" label="Contraseña" :rules="[rules.required, rules.min]"
                                :type="show ? 'text' : 'password'" prepend-inner-icon="mdi-key"
                                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" @click:append="show = !show" outlined
                                required>
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <div class="buttons">
                        <v-btn @click="dialogLogin = false" color="red">cancelar</v-btn>
                        <v-btn :disabled="!valid" :loading="loading" color="light-green" type="submit">
                            Iniciar sesión
                        </v-btn>
                    </div>
                </v-form>
            </v-card>
        </v-dialog>
    </nav>
</template>

<script>

import vuex from "@/store";
import Swal from "sweetalert2";
import authService from '@/modules/auth/service/authService'

export default {
    name: 'navNormal',
    data() {
        return {
            correo: '',
            password: '',
            valid: false,
            loading: false,
            dialogLogin: false,
            show: false,
            rules: {
                required: value => !!value || 'Campo requerido.',
                min: value => value.length >= 5 || 'Minimo 5 caracteres',
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Correo invalido.'
                },
            },
            vuex: vuex,
        }
    },
    methods: {
        login() {
            this.loading = true

            let data = {
                correo: this.correo,
                password: this.password,
            }

            authService.login(data)
                .then(res => {
                    this.loading = false
                    this.dialogLogin = false
                    this.$store.dispatch('setToken', res.token)
                    this.$store.dispatch('setUser', res.user)
                    Swal.fire({
                        icon: 'success',
                        text: 'Inicio De Sesión Exitoso',
                    })
                })
                .catch(err => {
                    this.loading = false
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: err.response.data,
                    })
                })
        },
        logout() {
            this.$store.dispatch('logout')
            this.$router.push({name: 'viewRooms'})
        }
    },
}
</script>

<style scoped>
.nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px 50px;
}

.search-field {
    width: 50%;
}
</style>