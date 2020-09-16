import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import shared from './common/shared'
import routes from "@/routes";
import swal from 'vue-sweetalert2';

Vue.use(VueRouter)
Vue.use(shared)
Vue.use(swal)

Vue.config.productionTip = false

const router = new VueRouter({routes});
router.beforeEach((to, from, next) => {
  if (to.path!='/login' && !shared.isLoggedIn()) {
    next({
      path: '/login'
    })
  } else {
    next()
  }
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
