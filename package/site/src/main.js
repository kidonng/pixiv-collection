import Vue from 'vue'
import './plugins/function-api'
import vuetify from './plugins/vuetify'
import './plugins/analytics'
import App from './App'

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
