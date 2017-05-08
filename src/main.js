// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
(function() {
  let desW = 1920,
    winW = document.documentElement.clientWidth||document.body.clientWidth,
    ratio = winW / desW;
  document.documentElement.style.fontSize = ratio * 100 + 'px';
})();


import Vue from 'vue'
import App from './App'
import routes from './router'
import vueResoure from 'vue-resource'
import vueRouter from 'vue-router'
import 'assets/css/index.css'
import 'assets/css/el.css'
import store from  './vuex/store'
import MessageBox from 'element-ui'
import Tree from 'element-ui'


import dialog from 'element-ui'

import 'element-ui/lib/theme-default/index.css'
import 'element-ui/lib/index'
Vue.use(vueRouter);
Vue.use(vueResoure);
Vue.use(MessageBox);

Vue.use(Tree);


Vue.use(dialog);

const router=new vueRouter({
  mode:'history',
  routes
});



new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#root')


