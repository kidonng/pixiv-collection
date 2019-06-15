import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import zhHans from 'vuetify/es5/locale/zh-Hans'
import 'vuetify/src/stylus/app.styl'
import App from './App'

Vue.use(Vuetify, {
  lang: {
    locales: { zhHans },
    current: 'zhHans'
  }
})

new Vue({
  render: h => h(App)
}).$mount('#app')
