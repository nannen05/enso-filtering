<template>
  <div id="app">
    <!-- 
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <Products prods={products}/></Products> 
    -->
    <div class="collection">

      <div class="collection__acitve-filters">

          <div v-if="activeFilters.length > 0">
              <div 
                @click="clearAllFilters($event)">
                 Clear All Filters
              </div>
          </div>

          <div v-if="activeFilters.length > 0">
              <div 
                v-for="(filter, index) in activeFilters" 
                v-bind:key="index"
                @click="clearFilter(filter, 'remove', $event)">
                {{ filter}} - X
              </div>
          </div>

      </div>

      <div class="collection__header">
          <div class="collection__filters" v-if="filters.color.length > 0">
              <div class="collection__filter--title">
                  Color
              </div>
              <button
                  class="collection__filter" 
                  v-for="(filter, index) in filters.color" 
                  v-bind:key="index"
                  @click="toggleFilter(filter, 'add', $event)">
                  {{ filter }}
              </button>
          </div>

          <div class="collection__filters" v-if="filters.size.length > 0">
              <div class="collection__filter--title">
                  Size
              </div>
              <button
                  class="collection__filter" 
                  v-for="(filter, index) in filters.size" 
                  v-bind:key="index"
                  @click="toggleFilter(filter, 'add', $event)">
                  {{ filter }}
              </button>
          </div>

          <div class="collection__filters" v-if="filters.width.length > 0">
              <div class="collection__filter--title">
                  Width
              </div>
              <button
                  class="collection__filter" 
                  v-for="(filter, index) in filters.width" 
                  v-bind:key="index"
                  @click="toggleFilter(filter, 'add', $event)">
                  {{ filter }}
              </button>
          </div>
      </div>

      <div class="collectoin__body">

      </div>

    </div>

    <!-- Display By Sections -->
    <template v-if="activeFilters.length == 0">

      <div class="columns medium-4" v-for="(product, index) in allProducts" v-bind:key="index">
          <div class="card">
            <div class="card-section">
              <p> {{ product.title }} - {{ product.filters.color }} - {{ product.filters.size }}  - {{ product.price }}</p>
            </div>
          </div>
      </div>

    </template>

    <!-- Display With Active Filter -->
    <template v-if="filteredProducts.length > 0 && activeFilters.length > 0">

      <div class="columns medium-4" v-for="(product, index) in filteredProducts" v-bind:key="index">
          <div class="card">
            <div class="card-section">
               <p> {{ product.title }} - {{ product.filters.color }} - {{ product.price }}</p>
            </div>
          </div>
      </div>

    </template>

  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
//import Products from './components/Products.vue'

import { products } from './products'
//import axios from 'axios'


export default {
  name: 'app',
  //props:['products'],
  data: () => {
      return {
        allProducts : products,
        parentProducts : [],
        filteredProducts: [],
        activeFilters: []
      }
  },
  methods: {
      toggleFilter(filter, option) {
          let filteredProducts = [];

          let activeFilters = this.activeFilters

          const resetProducts = () => {
            this.filteredProducts = this.parentProducts
            this.activeFilters = []
            activeFilters = []
          }

          if(option === 'add') {
              activeFilters.push(filter)
          }

          if(option === 'remove') {
              if(activeFilters.length == 1) {
                  resetProducts()
              }
              if(activeFilters.length > 1) {
                  let index = activeFilters.indexOf(filter)

                  if(index == 0) {
                      activeFilters.pop()
                  }

                  if(index >= 1) {
                      activeFilters = activeFilters.slice(0, index);
                  }
              }   
          }

          if(option === 'clear') {
              resetProducts()
          }

          let filteredFilters = activeFilters.filter((v, i) => activeFilters.indexOf(v) === i)

          let products = this.parentProducts;

          products.forEach((item) => {
              
              let filters = item.filters
              
              filteredFilters.forEach((itemfilter) => {
                  Object.keys(filters).forEach((filter) => {
                      if(filters[filter] === itemfilter) {
                          filteredProducts.push(item)
                      }
                  })
              });
          })

          // Filter out Duplicate products
          filteredProducts = filteredProducts.filter((v,i) => filteredProducts.indexOf(v) === i) 

          if(filteredProducts.length > 0) {
              this.filteredProducts = filteredProducts
              this.activeFilters = filteredFilters
          }

      },
      clearFilter(filter) {
          this.toggleFilter(filter, 'remove')
      },
      clearAllFilters() {
          this.toggleFilter(null, 'clear')
      }
  },
  computed: {
      filters() {
        const products = this.allProducts;
        window.products = products;
        let allSizes = [];
        let allWidths = [];
        let allColors = [];
        products.forEach((product) => {
          if(product){
            allSizes.push(Number(product.filters.size));
            allWidths.push(product.filters.width);
            allColors.push(product.filters.color);
          }
        });

        const filterList = {
          color: allColors.filter((v,i) => allColors.indexOf(v) === i),
          size: allSizes.filter((v,i) => allSizes.indexOf(v) === i).sort((a, b) => a - b),
          width: allWidths.filter((v,i) => allWidths.indexOf(v) === i)
        };
        
        return filterList;
      },
      sort() {
          return true
      }
  },
  components: {
    //HelloWorld,
    //Products
  },
  mounted() {
        
        let productTitles = [];
        let colors = [];

        products.forEach((product) => {
            if(product){
                productTitles.push(product.title);
                colors.push(product.filters.color);
            }
        });

        let parentProductTitles = productTitles.filter((v,i) => productTitles.indexOf(v) === i)

        function removeDuplicates(originalArray) {
            var trimmedArray = [];

            parentProductTitles.forEach((element, index) => {
                let products = originalArray.filter(function (entry) { return entry.title === element; })
                let colors = [];
                //let sizes = products.filter(function (entry) { return entry.filter.size === element; })
                
                for(var i = 0; i < products.length; i++) {
                    let color = products[i]['filters']['color'];
                    //let size = products[i]['filters']['size']
                    //sizes.push(products[i]['filters']['size'])
                    
                    if(colors.indexOf(index)) {
                        //console.log('product', products[i])
                    }
                    if(colors.indexOf(color) === -1) {
                        //products[i].childrenSizes = sizes
                        trimmedArray.push(products[i]);
                        colors.push(color);
                    }
                }    
            });

            //console.log(trimmedArray)

            return trimmedArray;

        }

        this.filteredProducts = removeDuplicates(this.allProducts, 'color', 'title');
        this.parentProducts = removeDuplicates(this.allProducts, 'color', 'title');
  },
  created: {

  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
