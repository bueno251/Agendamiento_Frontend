<template>
    <div class="content">
        <menuComponent></menuComponent>
        <router-view />
    </div>
</template>
  
<script>

import menuComponent from '@/components/menuComponent.vue'

export default {
    name: 'baseApp',

    components: {
        menuComponent,
    },
};
</script>
  
<style scoped>
.main {
    display: flex;
    width: 100%;
}
</style>