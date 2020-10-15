<template>
  <div id="wrapper">
    <Menu class="menu" :menuToggle="menuToggle"></Menu>
    <div :id="menuToggle?'page-wrapper':'container'" class="gray-bg animated" > <!-- :class="menuToggle?'':'col-lg-11 col-lg-offset-1'"-->
    <button @click="menuToggle = !menuToggle"><i class="fa fa-bars"/></button>

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

<style scoped>
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-leave-to {
  transform: translateX(-100px);
  opacity: 0;
}
.slide-fade-enter {
  transform: translateX(10px);
  opacity: 0;
}
</style>





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
button {
  border: 0;
  outline: none;
  background-color: rgb(38, 57, 73);
}
</style>
