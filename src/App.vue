<template>
  <v-app>
      <navComponent></navComponent>
      <router-view/>
  </v-app>
</template>

<script>

import navComponent from '@/components/navComponent.vue'

export default {
  name: 'App',

  components: {
    navComponent
  },
  data: () => ({
    //
  }),
};
</script>
