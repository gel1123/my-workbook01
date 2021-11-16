// import store from './store'
import Vue from 'nativescript-vue'
import VueDevtools from 'nativescript-vue-devtools'
import App from '@/components/App.vue'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { VueConstructor } from 'vue';

console.log(`--------------[ ${TNS_ENV}] ---------------------`)
if (TNS_ENV !== 'production') {
  Vue.use(VueDevtools, { host: '10.0.3.2' })
}

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

Vue.registerElement(
  'RadSideDrawer',
  () => RadSideDrawer
)

interface IMethods { }
interface IApp {
  name: string;
  components: object;
  methods: IMethods;
}

new Vue({
  // store,
  render: h => h(App as IApp & VueConstructor)
}).$start()
