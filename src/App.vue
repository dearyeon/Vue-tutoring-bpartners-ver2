<template>
  <div id="wrapper">
    <Menu></Menu>

    <div id="page-wrapper" class="gray-bg">
      <!-- header begin -->
      <div class="row border-bottom">
        <nav class="navbar navbar-static-top white-bg" role="navigation" style="margin-bottom: 0">
          <ul class="nav navbar-top-links navbar-right">
            <li>
              <a href="https://naver.com"
                 onclick="event.preventDefault();  document.getElementById('logout-form').submit();">
                <i class="fa fa-sign-out"></i> Log out
              </a>
              <form id="logout-form" action="test" method="POST" style="display: none;">
              </form>
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
import Menu from "./components/Menu.vue";
export default {
  name: 'App',
  components: {
    Menu

  }
}
</script>




<style>
@import "./assets/styles/bootstrap.min.css";
@import "./assets/font-awesome/css/font-awesome.css";
@import "./assets/styles/style.css";
@import "./assets/styles/b2b.css";

</style>
