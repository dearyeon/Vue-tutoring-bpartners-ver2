<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="ibox-title">
        <h2>수강신청 현황</h2>
      </div>
    </div>
    <CardList :data="applySite" detailView="applyDetailsList" />
  </div>
</template>

<script>
import api from "@/common/api";
import CardList from "../atom/CardList";

export default {
  async created() {
    const res = await api.get("/partners/applySiteList");
    this.applySite = res.data;
  },
  data() {
    return {
      applySite: [],
    };
  },
  components: {
    CardList,
  },
};
</script>

<style>
.title {
  height: 65px;
}
</style>
