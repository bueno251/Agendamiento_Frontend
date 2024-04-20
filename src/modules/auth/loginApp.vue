<template>
    <div class="content">
        <v-card class="pa-5" width="90%" max-width="500px">
            <v-form v-model="valid">
                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="correo" label="Correo" :rules="[rules.required, rules.email]"
                            prepend-inner-icon="mdi-account" dense outlined required>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="password" label="Contraseña" :rules="[rules.required, rules.min]"
                            :type="show ? 'text' : 'password'" prepend-inner-icon="mdi-key"
                            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" @click:append="show = !show" dense outlined required>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" class="flex">
                        <v-btn :disabled="!valid" :loading="loading" @click="login">
                            iniciar sesión
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-card>
    </div>
</template>

<script>

import Swal from 'sweetalert2'
import AuthService from './service/authService'

export default {
    name: 'loginApp',
    data() {
        return {
            correo: '',
            password: '',
            valid: false,
            loading: false,
            show: false,
            rules: {
                required: value => !!value || 'Campo requerido.',
                min: value => value.length >= 4 || 'Minimo 4 caracteres',
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Correo invalido.'
                },
            },
        }
    },
    methods: {
        /**
        * Realiza el inicio de sesión del usuario.
        */
        login() {
            // Habilitar la animación de carga
            this.loading = true

            // Crear un objeto con los datos de inicio de sesión
            let data = {
                correo: this.correo,
                password: this.password,
            }

            // Llamar al servicio de autenticación para iniciar sesión
            AuthService.login(data)
                .then(res => {
                    // Desactivar la animación de carga
                    this.loading = false

                    // Almacenar el token y la información del usuario en el almacenamiento local
                    this.$store.dispatch('setToken', res.token)
                    this.$store.dispatch('setUser', res.user)

                    // Redirigir a la página de reservas después del inicio de sesión exitoso
                    this.$router.push({ name: 'reservasApp' })
                })
                .catch(err => {
                    // Desactivar la animación de carga
                    this.loading = false

                    // Mostrar mensaje de error utilizando SweetAlert
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: err.response.data.message,
                    })

                    // Registrar detalles del error en la consola
                    console.error(err)
                })
        },
    },
}
</script>

<style scoped>
.content {
    justify-content: center;
}

.flex {
    display: flex;
    justify-content: center;
}
</style>