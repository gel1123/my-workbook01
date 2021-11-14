import Vue from 'nativescript-vue'
import App from './components/App.vue'
import VueDevtools from 'nativescript-vue-devtools'

// 型定義ファイルのないモジュールであるため、下記コードの場合は警告が出力される
// ```
// import FontIcon from 'nativescript-vue-fonticon'
// ```
// => 「モジュールの宣言ファイルが見つかりませんでした」
// 
// なので、いくつか対処法が考えられるがとりあえずもっとも手っ取り早いものをいったん採用
// 参考：https://qiita.com/Nossa/items/726cc3e67527e896ed1e
const FontIcon = require('nativescript-vue-fonticon');
import './app.scss'

import { Carousel, CarouselItem } from 'nativescript-carousel'

Vue.registerElement('Carousel', () => Carousel)
Vue.registerElement('CarouselItem', () => CarouselItem)

Vue.use(FontIcon, {
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
