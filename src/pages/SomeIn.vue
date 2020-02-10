<!--
- src/pages/SomeIn.vue
-->
<template>
  <section>
    <app-profile />
    <div>
      TO BE DONE 🏂
    </div>

    <h2>Hi {{name}}</h2>
  </section>
</template>

<script>
  export default {
    data() {
      return{
        name: ''    // tbd. can we set it to 'null'?
      }
    },
    created() {
      // tbd. Is this method better or the one in root level?
      this.name = firebase.auth().currentUser.displayName;
    },
    methods: {
      signOut(){
        firebase.auth().signOut();
        this.$router.push('/');
      }
    }
  }
</script>

<style scoped>
</style>

