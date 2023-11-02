<template>
    <v-card width="90%">
        <v-card-title class="blue lighten-2">
            Reservas
        </v-card-title>
        <v-container fluid>
            <v-row>
                <v-col cols="auto">
                    <div class="flex">
                        Usuario puede reservar?
                        <v-switch v-model="canReservar" :label="canReservar ? 'Si' : 'No'" inset></v-switch>
                    </div>
                </v-col>
            </v-row>
            <div class="buttons">
                <v-btn @click="save" color="primary">
                    guardar
                </v-btn>
            </div>
        </v-container>
    </v-card>
</template>

<script>
export default {
    props: {
        bolean: Array,
        id: Number,
    },
    data() {
        return {
            canReservar: true,
        }
    },
    methods: {
        save() {

        }
    },
    watch: {
        bolean: {
            handler(newbolean) {
                this.canReservar = newbolean
            },
            immediate: true,
        }
    },
}
</script>

<style scoped>
.flex {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    gap: 10px;
}
</style>