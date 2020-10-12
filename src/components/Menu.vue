<template>
  <nav class="navbar-default navbar-static-side" style="height: 100%;" role="navigation">
    <div class="sidebar-collapse">

      <ul class="nav metismenu" id="side-menu">
        <li class="nav-header">
          <div class="dropdown profile-element">
              <span class="clear">
                      <span class="block m-t-xs" style="color:white"> <strong class="font-bold"> {{ (account.site && account.site.company) || (account.partner && account.partner.company) }} </strong></span>
                      <span class="text-muted text-xs block"> {{account.name}} </span>
                  </span>
          </div>
          <div class="logo-element">
            M
          </div>
        </li>


        <li v-for="m in menus" :key="m.id" :class="{active: m.isActive}" v-on:click="selectMenu(m.id)">
          <router-link :to="m.path">
            <span class="nav-label">
              <i :class="['fa', 'fa-'+m.icon]"/> {{ m.name }}
            </span>
          </router-link>
        </li>

      </ul>

    </div>
  </nav>
</template>



<script>

import menus from "@/menus";

export default {
  name: "Menu",
  data() {
    for(const i in menus) {
      const menu = menus[i]
			const m = menu.path.split('/')
      const r = this.$route.path.split('/')
      menu.isActive = (m[1]==r[1])
    }

    return {
      menus,
			account: this.$shared.getAccount()
    }
  },
  methods: {
    selectMenu(menuId) {
      for(const i in menus) {
        const m = menus[i]
        m.isActive = (m.id==menuId)
      }
    }
  },

}
</script>




<style scoped>

</style>
