<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="ibox-title">
        <h2>결제정보 관리</h2>
      </div>
    </div>
    <div class="row">
      <CardList :data="applySite" detailView="billingDetailsList" />
    </div>
  </div>
</template>

<script>
import api from "@/common/api";
import CardList from "../atom/CardList";

export default {
  async created() {
    const res = await api.get("/partners/billingSiteList");
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

<style></style>
