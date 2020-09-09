<template>
  <div id="wrapper">
    <Menu></Menu>

    <div id="page-wrapper" class="gray-bg">
      <!-- header begin -->
      <div class="row border-bottom">
        <nav class="navbar navbar-static-top white-bg" role="navigation" style="margin-bottom: 0">
          <ul class="nav navbar-top-links navbar-right">
            <li>
              <a href="#" v-on:click="logout">
                <i class="fa fa-sign-out"></i> Log out
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <!--header end-->


      <!-- content begin -->
      <div class="wrapper wrapper-content">
        <router-view></router-view>
      </div>
      <!-- content begin -->


      <!-- footer begin -->
      <div class="footer">
        <div class="pull-right">
          TUTORING All Rights Reserved.
        </div>
        <div>
          <strong>Copyright</strong> Mycroft &copy; 2018
        </div>
      </div>
      <!-- footer end -->

    </div>
  </div>
</template>





<script>
import Menu from "@/components/Menu.vue";
import shared from "@/common/shared";

export default {
  methods: {
    logout() {
      shared.setToken(null)
      this.$router.push('/login')
    }
  },

  components: {
    Menu
  },
  created() {
  }
}
</script>




<style>
#wrapper {
  height: 100%;
}
</style>
