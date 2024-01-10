<template>
    <div class="content">
        <navNormal></navNormal>
        <router-view />
    </div>
</template>

<script>

import navNormal from '@/components/navNormal.vue'

export default {
    name: 'baseUser',

    components: {
        navNormal,
    },
    data: () => ({
        //
    }),
};
</script>

<style scoped></style>