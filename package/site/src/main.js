import config from './config'
import Vue from 'vue'
import vuetify from './plugins/vuetify'
import galite from 'ga-lite'
import App from './App'

if (config.googleAnalyticsID) {
  galite('create', config.googleAnalyticsID, 'auto')
  galite('send', 'pageview')
}

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
