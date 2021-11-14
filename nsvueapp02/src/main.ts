import Vue from 'nativescript-vue'
import App from './components/App.vue'
import VueDevtools from 'nativescript-vue-devtools'
import FontIcon from 'nativescript-vue-fonticon'
import './app.scss'

Vue.use(FontIcon, {
  host: '10.0.3.2',
  componentName: 'FIcon',
  debug: true,
  paths: {
    mdi: './fonts/material-design-icons.css',
  }
})


console.log(`---------------------- [TNS_ENV: ${TNS_ENV} ] ----------------------`);
if (TNS_ENV !== 'production') {
  Vue.use(VueDevtools, { host: '10.0.3.2' })
}


// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')


new Vue({

  render: h => h('frame', [h(App)])
}).$start()
