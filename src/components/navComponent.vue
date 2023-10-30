<template>
    <nav class="elevation-4 nav mb-5">
        <router-link :to="{ name: 'calendario' }" class="link">Calendario</router-link>
        <router-link :to="{ name: 'clientes' }" class="link">Clientes</router-link>
    </nav>
</template>

<script>
export default {
    name: 'navComponents',
    data() {
        return {

        }
    },
    methods: {

    },
}
</script>

<style scoped>
.nav {
    display: flex;
    align-items: center;
    height: 50px;
    position: sticky;
    top: 0;
    z-index: 1;
    background: #ffffff;
    width: 100%;
    justify-self: flex-end;
}

.link {
    text-transform: uppercase;
    text-decoration: none;
    color: black;
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0px 25px;
    transition: background 0.5s;
}

.link:hover {
    background: #20202085;
}
</style>