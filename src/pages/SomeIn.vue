<!--
- src/pages/SomeIn.vue
-->
<template>
  <section id="here">
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
    name: 'SomeIn',
    data: () => ({
      name: ''     // Wouldn't it be great to be able to use Promise's...
    }),
    created() {
      userProm.then( (user) => {
        this.name = user.displayName
      })
    }
  }
</script>

