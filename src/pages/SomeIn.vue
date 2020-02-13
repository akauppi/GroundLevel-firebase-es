<!--
- src/pages/SomeIn.vue
-->
<template>
  <section id="here">
    <app-profile />
    <div>
      TO BE DONE 🏂
    </div>

    <h2>Hi {{ name }}</h2>
  </section>
</template>

<style scoped>
  #here {
    text-align: center;
  }
</style>

<script>
  import { userProm } from '../auth.js';

  export default {
    name: 'SomeIn',     // tbd. is this needed?
    data() {
      return{
        name: userProm      // Wouldn't it be great to be able to use Promise's...
      }
    }
  }
</script>

