<template>

  <nav class="navbar-default navbar-toggleable-lg navbar-static-side" style="height: 100%;" role="navigation">
       <!--<button class="navbar-toggler navbar-toggler-right py-2" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
          <span>X</span>
       </button>-->
     
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
        
        <div class="pull-left" style="margin-bottom: 0; position:fixed; bottom:0;">
          <ul class="nav navbar-top-links">
            <li>
              <a href="#" v-on:click="logout">
                <i class="fa fa-sign-out"></i> Log out
              </a>
            </li>
          </ul>
        </div>
        
      </ul>
    </div>
  </nav>
</template>



<script>
import shared from "@/common/shared";
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
    },
    logout() {
      shared.setToken(null)
      this.$router.push('/login')
    },
    closeMenu() {
      $('#navbar-default').collapse('hide');
      //document.getElementById("navbar-default").style.top = "0";
    }
  }
}
</script>




<style scoped>

</style>
