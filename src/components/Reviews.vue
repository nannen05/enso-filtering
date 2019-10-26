<template>
  <section class="collection__reviews">
      <h1>{{ type }}</h1>
  </section>
</template>

<script>
export default {
  name: 'Reviews',
  props: {
    type: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.collection__reviews {
    min-height: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 1000px;
    margin: 0 auto;
    background: gainsboro;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
