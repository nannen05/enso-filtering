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
                @click="clearFilter(filter, $event)">
                {{ filter }} - X
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
                  @click="toggleFilter(filter, 'color', 'add', $event)">
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
                  @click="toggleFilter(filter, 'size', 'add', $event)">
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
                  @click="toggleFilter(filter, 'width', 'add', $event)">
                  {{ filter }}
              </button>
          </div>
      </div>

    </div>

    <!-- Build Sections -->
    <template v-if="activeFilters.length == 0 && parentProductSections.length > 0">
        <div v-for="(section, index) in sections" v-bind:key="index">
            <div class="collection__body">
                <Reviews type="Reviews" v-if="section.sectionType === 'Reviews'"/>
                <Callouts type="Callouts" v-else-if="section.sectionType === 'Callouts'"/>
                <ProductSection v-else :data="section"></ProductSection>
            </div>
        </div> 
    </template>
    <!-- End Sections -->

    <!-- Display By Sections -->
    <template v-if="activeFilters.length == 0 && parentProductSections.length > 0">

      <section class="collection__section" v-for="(parent, index) in parentProductSections" v-bind:key="index">
          <div class="collection__header">
              <h4>{{ parent.title }}</h4>
          </div>
          <div class="collection__count">
              <p>{{ parent.products.length }} Colors</p>
          </div>

          <!-- Show 7 Products and More Tile -->
          <div class="collection__products" v-if="parent.showMore">
            <div class="collection__tile product__tile" v-for="(product, i) in parent.products.slice(0, 7)" v-bind:key="i">
                <div class="card-section">
                    <p> {{ product.title }} - {{ product.filters.color }} - {{ product.filters.size }}  - {{ product.price }}</p>
                </div>
             </div>
             <div class="collection__tile product__tile" @click="parent.showMore = !parent.showMore">
                <div class="card-section">
                    <div class="collection__tile--count">
                        {{ parent.products.length - 7 }} More Products
                    </div>
                    <p> Show More</p>
                </div>
             </div>
          </div>
          <div class="collection__products" v-else>
            <div class="collection__tile product__tile" v-for="(product, i) in parent.products" v-bind:key="i">
                <div class="card-section">
                    <p> {{ product.title }} - {{ product.filters.color }} - {{ product.filters.size }}  - {{ product.price }}</p>
                </div>
             </div>
          </div>

      </section>

    </template>

    <!-- Display With Active Filter -->
    <template v-if="filteredProducts.length > 0 && activeFilters.length > 0">
      <section class="collection__section">
        <div class="collection__products">
            <div class="collection__tile product__tile" v-for="(product, index) in filteredProducts" v-bind:key="index">
                <div class="card">
                    <div class="card-section">
                    <p> {{ product.title }} - {{ product.filters.color }} - {{ product.price }}</p>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </template>

  </div>
</template>

<script>

//Sections
import ProductSection from './components/ProductSection.vue'
import Reviews from './components/Reviews.vue'
import Callouts from './components/Callouts.vue'

//Mock Data
import { products } from './products';
import { contentSections } from './sections'
//import axios from 'axios'

export default {
  name: 'app',
  //props:['products'],
  data: () => {
      return {
        allProducts : products,
        parentProducts : [],
        parentProductSections: [],
        contentSections: [],
        sections: [],
        filteredProducts: [],
        activeFilters: []
      }
  },
  methods: {
      init() {
          this.filterVariantProducts()
          this.filterParentProducts()
          this.findSections()
          this.buildSections()
          this.toggleFilter()
      },
      toggleFilter(filter, filterType, option, event) {
          let filteredProducts = [];
          let filteredFilters;
          let url = new URL(window.location);
          let activeFilters = this.activeFilters

          if(window.location.search && event !== 'click' && activeFilters.length != 1) {
            let searchFilter;
            let urlParams = new URLSearchParams(window.location.search);

            console.log(urlParams)

            if(urlParams.has('color')) {
                searchFilter = urlParams.get('color')
                activeFilters.push(decodeURIComponent(searchFilter))
            }
            if(urlParams.has('size')) {
                searchFilter = urlParams.get('size')
                activeFilters.push(decodeURIComponent(searchFilter))
            }
            if(urlParams.has('width')) {
                searchFilter = urlParams.get('width')
                activeFilters.push(decodeURIComponent(searchFilter))
            }
          }

          const resetProducts = () => {
            this.filteredProducts = this.parentProducts
            this.activeFilters = []
            activeFilters = []
          }

          const clearUrlParams = () => {
              let newUrl = window.location.href.replace(window.location.search,'');
              window.history.pushState('', '', newUrl);
          }

          if(option === 'add') {
              activeFilters.push(filter)
              url.searchParams.append(filterType, filter)
              window.history.pushState('', '', url.href);
            // Check for Duplicate Filters
            //
            ///
            //   let urlParams = new URLSearchParams(window.location.search);
            //   if(urlParams.has(filterType)) {
            //       if(urlParams.get(filterType) !== filter) {

            //       }
            //   }
          }

          if(option === 'remove') {
              if(activeFilters.length == 1) {
                  resetProducts()
                  clearUrlParams()
              }
              if(activeFilters.length > 1) {
                  let index = activeFilters.indexOf(filter)

                  if(index == 0) {
                      activeFilters.pop()
                      clearUrlParams()
                  }

                  if(index >= 1) {
                      activeFilters = activeFilters.slice(0, index);
                  }
              }   
          }

          if(option === 'clear') {
              resetProducts()
              clearUrlParams()
          }

          filteredFilters = activeFilters.filter((v, i) => activeFilters.indexOf(v) === i)

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
      clearFilter(filter, event) {
          //console.log(event, 'clearFilter')
          this.toggleFilter(filter, null, 'remove', event)
      },
      clearAllFilters() {
          this.toggleFilter(null, null, 'clear')
      },
      findSections() {
          if(contentSections.length > 0) {
              console.log(true)
          }
      },
      buildSections() {
          this.sections = this.parentProductSections.concat(contentSections)
          let sections = this.sections

          function insertAndShift(arr, from, to) {
            let cutOut = arr.splice(from, 1) [0]; 
            arr.splice(to, 0, cutOut);
          }

          sections.forEach((section, index) => {
                if(section.sectionType !== 'product'){
                    if(section.order == 1) {
                        insertAndShift(sections, index, 1)
                    }
                    if(section.order == 2 && sections.length > 2) {
                        insertAndShift(sections, index, 3)
                    }  
                }   
          })
      },
      // Filter Parents into Groups by Product Name
      filterParentProducts() {
            let productTitles = [];          
            let parentProducts = this.parentProducts

            parentProducts.forEach((product) => {
                if(product){
                    productTitles.push(product.title);
                }
            })

            let parentProductTitles = productTitles.filter((v,i) => productTitles.indexOf(v) === i)

            //console.log(parentProductTitles)

            parentProductTitles.forEach((element, index) => {
                let products = parentProducts.filter(function (entry) { return entry.title === element; })
                console.log(products)
                let showMore = false
                if(products.length >= 8) showMore = true

                this.parentProductSections.push({
                    "showMore": showMore,
                    "sectionType": "product",
                    "order": index,
                    "title": element,
                    "products": products
                })
            })

            //console.log(this.parentProductSections)
      },
      // Filter Variant Products into Parent Product by Color
      filterVariantProducts() {
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

                return trimmedArray;

            }

            this.filteredProducts = removeDuplicates(this.allProducts, 'color', 'title');
            this.parentProducts = removeDuplicates(this.allProducts, 'color', 'title');
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
    ProductSection,
    Reviews,
    Callouts
  },
  mounted() {
    this.init()
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
.collection__section {
    display: flex;
    flex-direction: column;
    max-width: 1000px;
    margin: 0 auto;
    text-align: left;
}
.collection__products {
    display: flex;
    flex-wrap: wrap;
}
.collection__tile {
    width: 25%;
    min-height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
