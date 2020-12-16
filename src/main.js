import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import shared from './common/shared'
import routes from "@/routes";
import swal from 'vue-sweetalert2';
import VueClipboard from 'vue-clipboard2'
import { CoolSelectPlugin } from 'vue-cool-select'
import 'vue-cool-select/dist/themes/material-design.css'

Vue.use(VueRouter)
Vue.use(shared)
Vue.use(swal)
Vue.use(VueClipboard)
Vue.use(CoolSelectPlugin)
Vue.config.productionTip = false

const router = new VueRouter({routes});
router.beforeEach((to, from, next) => {
	if(to.path == '/findPass') {
		next()
	}
	else if (to.path !='/login' && !shared.isLoggedIn()) {
		next({path: '/login'})
	}
	else if(to.path !='/login' && to.path !='/account' && shared.getAccount().needChangePw) {
		next({path: '/account'})
	}
	else {
		next()
	}
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
