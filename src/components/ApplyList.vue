<template>
  <div class="applylist">
    <div class="col-lg-12">
      <div class="ibox float-e-margins">
        <div class="ibox-title">
          <div class="pull-left">
            <h2>수강신청 현황</h2>
          </div>
          <div class="pull-right">
            <a class="btn btn-success">
              수강신청 현황 다운
            </a>
          </div>
        </div>

      </div>


      <CardList :data="dummy" detailView="/applyDetailsList" />
       <!-- 
      <router-view></router-view>

         v-if="$route.path === '/applyList/'"
         v-for="data in dummy" v-bind:key="data.id" 
      <router-link to="/applyList/bapIdx/1">
        <div class="ibox" v-if="$route.path === '/applyList'">
          <CardList :data="dummy" detailView="applyList/bapIdx" />  
        </div>
      </router-link> -->


    </div>
  </div>
</template>

<script>
//import api from "@/common/api";
import CardList from "@/components/CardList";

export default {
  name: "ApplyList",
  data() {
    return {
      dummy: [
        { 
          company: "남양주 시청",
          name: "공상원 주사",
          part: "",
          tel: "010-9281-5223",
          email: "ksw0@korea.co.kr"
        },        
        { 
          company: "한국수력원자력",
          name: "김지용",
          part: "인사처 인재양성부",
          tel: "",
          email: "-"
        }
      ]
    };
  },
  components: {
    CardList
  },
  async created() {
    //const res = await api.get('/partners/applyList', {bapIdx:1});
    //console.log('kenres', res);
  }
}

</script>

<style scoped>
.ibox-title {
  height: 65px;
}

.applylist {
  height: 100%;
  width: 100%;
}
</style>
