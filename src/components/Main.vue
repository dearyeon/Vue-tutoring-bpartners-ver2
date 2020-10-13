<template>
  <div id="wrapper">
    <Menu></Menu>

    <div id="page-wrapper" class="gray-bg">
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
  created() {
  }
}
</script>




<style>
#wrapper {
  height: 100%;
}
</style>
