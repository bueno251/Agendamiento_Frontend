<template>
    <div class="content">
        <v-card class="pa-5" width="90%" max-width="500px">
            <v-form v-model="valid">
                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="correo" label="Correo" :rules="[rules.required, rules.email]"
                            prepend-inner-icon="mdi-account" outlined required>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="password" label="Contraseña" :rules="[rules.required, rules.min]"
                            :type="show ? 'text' : 'password'" prepend-inner-icon="mdi-key"
                            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" @click:append="show = !show" outlined required>
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

// import Swal from 'sweetalert2'
import authService from './service/authService'

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
                min: value => value.length >= 5 || 'Minimo 5 caracteres',
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Correo invalido.'
                },
            },
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
                    this.$store.dispatch('setToken', res.token)
                    this.$store.dispatch('setUser', res.user)
                    this.$router.push({ name: 'reservas' })
                })
                .catch(err => {
                    this.loading = false
                    // Swal.fire({
                    //     icon: 'error',
                    //     title: 'Oops...',
                    //     text: err,
                    // })
                    console.log(err);
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