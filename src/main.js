import Vue from 'vue'
import Multiselect from './Multiselect.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(Multiselect),
}).$mount('#app')
