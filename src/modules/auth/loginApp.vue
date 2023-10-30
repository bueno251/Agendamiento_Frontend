<template>
    <div class="content">
        <v-card class="pa-5">
            <v-form v-model="valid">
                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="correo" label="Correo" :rules="[rules.required, rules.email]" prepend-inner-icon="mdi-account" outlined required>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="contraseña" label="Contraseña" :rules="[rules.required, rules.min]" prepend-inner-icon="mdi-key" outlined required>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" class="flex">
                        <v-btn :disabled="!valid">
                            login
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-card>
    </div>
</template>

<script>
export default {
    name: 'loginApp',
    data() {
        return {
            correo: '',
            contraseña: '',
            valid: false,
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

    },
}
</script>

<style scoped>
.content {
    justify-content: center;
}

.flex{
    display: flex;
    justify-content: center;
}
</style>