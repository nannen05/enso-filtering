<template>
      <div>
        <section class="collection__section">
          <div class="collection__header">
              <h4>{{ data.title }} </h4>
          </div>
          <div class="collection__count">
              <p>{{ data.products.length }} Colors</p>
          </div>

          <!-- Show 7 Products and More Tile -->
          <div class="collection__products" v-if="data.showMore">
            <div class="collection__tile product__tile" v-for="(product, i) in data.products.slice(0, 7)" v-bind:key="i">
                <div class="card-section">
                    <img src="http://lorempixel.com/640/360"/>
                    <p> {{ product.title }} - {{ product.filters.color }} - {{ product.filters.size }}  - {{ product.price }}</p>
                </div>
             </div>
             <div class="collection__tile product__tile" @click="data.showMore = !data.showMore">
                <div class="card-section">
                    <div class="collection__tile--count">
                        {{ data.products.length - 7 }} More Products
                    </div>
                    <p> Show More</p>
                </div>
             </div>
          </div>
          <div class="collection__products" v-else>
            <div class="collection__tile product__tile" v-for="(product, i) in data.products" v-bind:key="i">
                <div class="card-section">
                    <img src="http://lorempixel.com/640/360"/>
                    <p> {{ product.title }} - {{ product.filters.color }} - {{ product.filters.size }}  - {{ product.price }}</p>
                </div>
             </div>
          </div>

       </section>
      </div>
      
</template>

<script>
export default {
  name: 'ProductSection',
  props: {
    data: {
        type: Object,
    }
  },
  mounted: function () {
    console.log(this.data)
  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-section {
    position: relative;
}
.card-section img {
    width: 100%;
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