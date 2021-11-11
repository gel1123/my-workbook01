import Vue from 'nativescript-vue'
import App from './components/App.vue'
import VueDevtools from 'nativescript-vue-devtools'

console.log(`---------------------- [TNS_ENV: ${TNS_ENV} ] ----------------------`);
if (TNS_ENV !== 'production') {
  Vue.use(VueDevtools, { host: '10.0.3.2' })
}
import store from './store'

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')


new Vue({
  store,
  render: h => h('frame', [h(App)])
}).$start()
