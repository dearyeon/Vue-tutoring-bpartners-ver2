<template>
  <nav class="navbar-default navbar-static-side" style="height: 100%;" role="navigation">
    <div class="sidebar-collapse">

      <ul class="nav metismenu" id="side-menu">
        <li class="nav-header">
          <div class="dropdown profile-element">
              <span class="clear">
                      <span class="block m-t-xs" style="color:white"> <strong class="font-bold"> {{ '튜터링' }} </strong></span>
                      <span class="text-muted text-xs block"> {{ '켄'}} </span>
                  </span>
          </div>
          <div class="logo-element">
            M
          </div>
        </li>

        <li>
          <router-link to="/applyList">
            <span class="nav-label">
              <i class="fa fa-star"/> 수강신청 현황
            </span>
          </router-link>
        </li>

        <li>
          <router-link to="/billingList">
            <span class="nav-label">
              <i class="fa fa-star"/> 결제정보 관리
            </span>
          </router-link>
        </li>

      </ul>

    </div>
  </nav>
</template>



<script>
export default {
  name: "Menu",
  created() {
    const aaa = "bbb";
    console.log(aaa);
  }
}
</script>




<style scoped>

</style>
