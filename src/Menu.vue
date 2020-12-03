<template>
	<transition name="slide-fade">
		<nav class="navbar-default navbar-toggleable-lg navbar-static-side" style="height: 100%;" role="navigation"
			v-show="menuToggle">

			<div class="sidebar-collapse">
				<ul class="nav metismenu" id="side-menu">
					<li class="nav-header">
						<div class="dropdown profile-element">
							  <span class="clear">
								  <span class="block m-t-xs" style="color:white"> <strong class="font-bold"> {{
										  (account.site && account.site.company) || (account.partner && account.partner.company)
									  }} </strong></span>
								  <span class="text-muted text-xs block"> {{ account.name }} </span>
							  </span>
						</div>
						<div class="logo-element">
							M
						</div>
					</li>

					<li v-for="m in menus" v-if="permitted(m)" :key="m.id" :class="{active: m.isActive}">
						<router-link :to="m.path">
							<span class="nav-label">
							  <i :class="['fa', 'fa-'+m.icon]"/><span>{{ m.name }}</span>
							</span>
						</router-link>
					</li>

					<div class="pull-left" style="margin-bottom: 0; position:fixed; bottom:0;">
						<ul class="nav navbar-top-links">
							<li>
								<a href="#" v-on:click="$shared.logout('로그아웃 되었습니다.')">
									<i class="fa fa-sign-out"></i> Log out
								</a>
							</li>
						</ul>
					</div>

				</ul>
			</div>
		</nav>
	</transition>
</template>


<script>
import menus from "@/menus";
import {consts} from "@/common/shared";

export default {
	name: "Menu",
	data() {
		return {
			menus,
			account: this.$shared.getAccount()
		}
	},
	props: {
		menuToggle: {
			type: Boolean,
			required: true,
		}
	},
	methods: {
		selectMenu(route) {
			const r = route.path.split('/')
			for (const i in menus) {
				const menu = menus[i]
				const m = menu.path.split('/')
				menu.isActive = (m[1] == r[1])
			}
			console.log(menus)
		}
	},
	computed: {
		permitted() {
			return menu => {
				if (this.account.acc_level == consts.ACCOUNT_LEVEL_SUPERVISOR) {
					return true
				} else {
					return menu && menu.accLevel.indexOf(this.account.acc_level) > -1
				}
			}
		}
	},
	watch: {
		$route(to) {
			this.selectMenu(to)
			this.$forceUpdate()
		}
	},
	created() {
		this.selectMenu(this.$route)
	}
}
</script>


<style scoped>
.slide-fade-enter {
	opacity: 0;
}

.slide-fade-enter-active, .slide-fade-leave-active {
	transition: all .4s ease;
}

.slide-fade-leave-to {
	opacity: 0;
	transform: translateX(-100px);
}

.slide-fade-enter {
	opacity: 0;
	transform: translateX(0px);
}
</style>
