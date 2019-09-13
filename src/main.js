import Vue from 'vue'
import vuetify from './plugins/vuetify'
import './plugins/composition-api'
import './plugins/analytics'
import App from './App'

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
