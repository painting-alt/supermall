import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "@/store";

import toast from 'components/common/toast'

import FastClick from 'fastclick'
import VueLazyload from "vue-lazyload";

Vue.config.productionTip = false

//添加事件总线对象
Vue.prototype.$bus = new Vue()
//安装toast插件
Vue.use(toast)
//解决移动端300ms延迟
FastClick.attach(document.body)
//使用懒加载的插件
Vue.use(VueLazyload)

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
