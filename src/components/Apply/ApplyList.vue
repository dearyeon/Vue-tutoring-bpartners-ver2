<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="ibox-title">
        <h2>수강신청 현황</h2>
      </div>
    </div>
    <!--<CardList :data="applySite" detailView="applyDetailsList" />-->
    <div class="row">
			<div class="ibox content">
        <div class="ibox-content">
          <div class="row">
					  <table class="table text-center">
              <thead>
                <tr>
                    <th class="text-left">고객사명</th>
                    <th class="text-center">차수</th>
                    <th class="text-center">담당자</th>
                    <th class="text-center">부서</th>
                    <th class="text-center">연락처</th>
                    <th class="text-center">이메일</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in applySite" :key="`apply-${index}`">
                    <td class="text-left" @click="routeDetailPage(item.s_idx,item.last_a_no)">{{ item.site.company?item.site.company:'-' }}</td>
                    <td>
                      <select @change="routeDetailPage(item.s_idx,item.last_a_no,$event)">
                        <option value="none" selected disabled hidden>{{item.last_a_no}}차</option>   
                        <option v-for="i in item.last_a_no" :value="i" :key="i.id">{{item.last_a_no-i+1}}차</option>
                      </select>
                    </td>
                    <td class="text-center">{{ item.site.name?item.site.name:'-' }}</td>
                    <td class="text-center">{{ item.site.part?item.site.part:'-' }}</td>
                    <td class="text-center">{{ item.site.tel?item.site.tel:'-' }}</td>
                    <td class="text-center">{{ item.site.email?item.site.email:'-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/common/api";

export default {
  async created() {
    const res = await api.get("/partners/applySiteList");
    this.applySite = res.data;
  },
  data() {
    return {
      applySite: [],
      selectaNo: ''
    };
  },
  methods: {
    routeDetailPage(s_idx, aNo, event) {
      let a_no;
      if (event) a_no = aNo - event.target.value + 1;
      this.$router.push({
          name: "applyDetailsList",
          params: { sIdx: s_idx, aNo:a_no?a_no:aNo }
      })
    },
  }
};
</script>

<style scoped>
.title {
  height: 65px;
}
tr {
  border-bottom: 1px solid #f2f2f2;
  padding: 10px;
}
</style>
