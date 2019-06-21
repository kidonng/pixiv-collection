import Vue from 'vue'
import vuetify from './plugins/vuetify'
import App from './App'

Vue.prototype.api = '/api'

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
