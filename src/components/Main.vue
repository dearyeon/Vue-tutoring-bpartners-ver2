<template>
  <div id="wrapper">
    <Menu class="menu" :menuToggle="menuToggle"></Menu>
    <div :id="menuToggle?'page-wrapper':'container'" class="gray-bg" > <!-- :class="menuToggle?'':'col-lg-11 col-lg-offset-1'"-->
    <button style="background-color: rgb(38, 57, 73);" @click="menuToggle = !menuToggle"><i class="fa fa-bars"/></button>

      <!-- header begin -->
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
          <strong>Copyright</strong> TUTORING &copy; 2020
        </div>
      </div>
      <!-- footer end -->

    </div>
  </div>
</template>





<script>
import Menu from "@/components/Menu.vue";

export default {
  components: {
    Menu
  },
  data() {
    return {
      menuToggle: true,
    }
  }
}
</script>




<style>
#wrapper {
  height: 100%;
}
#page-wrapper {
  padding: 0;
}
#container {
  height: 100%;
}
</style>
