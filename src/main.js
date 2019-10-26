import Vue from 'vue'
import App from './App.vue'

import { products } from './products'
//import axios from 'axios'

//let url = `https://upwest.com/collections/womens-cozy-tops?view=json`

//Vue.config.productionTip = false

new Vue({
  data: {
    products: []
  },
  mounted() {
    this.products = products
    // axios.get(url).then(response => {
    //   this.products = response.data
    // })
  },
  render: h => h(App),
}).$mount('#app')
