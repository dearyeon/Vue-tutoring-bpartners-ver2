<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="ibox-title">
        <h2>결제정보 관리</h2>
      </div>
    </div>
    <div class="row">
      <CardList :data="response" detailView="/billingDetailsList" />
    </div>
  </div>
</template>

<script>
//import api from "@/common/api";
import CardList from "./CardList";

export default {
  async created() {
    //const res = await api.get("/partners/apply/applyList");
    //console.log(res);
  },
  name: "BillingList",
  data() {
    return {
      response: [
        {
          company: "남양주 시청",
          name: "공상원 주사",
          part: "인사팀",
          tel: "010-1111-1111",
          email: "ksw0@korea,kr",
        },
        { company: "남양주 시청2", name: "공상원 주사" },
        { company: "남양주 시청3", name: "공상원 주사", tel: "010-1111-1111" },
        { company: "남양주 시청4", name: "공상원 주사", tel: "010-1111-1111", email: "ksw0@korea,kr" },
        { company: "남양주 시청5", name: "공상원 주사", tel: "010-1111-1111", email: "ksw0@korea,kr" },
        { company: "남양주 시청6", name: "공상원 주사", tel: "010-1111-1111", email: "ksw0@korea,kr" },
        { company: "남양주 시청7", name: "공상원 주사", tel: "010-1111-1111", email: "ksw0@korea,kr" },
        { company: "남양주 시청8", name: "공상원 주사", tel: "010-1111-1111", email: "ksw0@korea,kr" },
        { company: "남양주 시청9", name: "공상원 주사", tel: "010-1111-1111", email: "ksw0@korea,kr" },
        { company: "남양주 시청10", name: "공상원 주사", tel: "010-1111-1111", email: "ksw0@korea,kr" },
        { company: "남양주 시청11", name: "공상원 주사", tel: "010-1111-1111", email: "ksw0@korea,kr" },
        { company: "남양주 시청12", name: "공상원 주사", tel: "010-1111-1111", email: "ksw0@korea,kr" },
        { company: "남양주 시청13", name: "공상원 주사", tel: "010-1111-1111", email: "ksw0@korea,kr" },
        { company: "남양주 시청14", name: "공상원 주사", tel: "010-1111-1111", email: "ksw0@korea,kr" },
        { company: "남양주 시청15", name: "공상원 주사", tel: "010-1111-1111", email: "ksw0@korea,kr" },
        { company: "남양주 시청16", name: "공상원 주사", tel: "010-1111-1111", email: "ksw0@korea,kr" },
        { company: "남양주 시청17", name: "공상원 주사", tel: "010-1111-1111", email: "ksw0@korea,kr" },
        { company: "남양주 시청18", name: "공상원 주사", tel: "010-1111-1111", email: "ksw0@korea,kr" },
        { company: "남양주 시청19", name: "공상원 주사", tel: "010-1111-1111", email: "ksw0@korea,kr" },
        { company: "남양주 시청20", name: "공상원 주사", tel: "010-1111-1111", email: "ksw0@korea,kr" },
        { company: "남양주 시청21", name: "공상원 주사", tel: "010-1111-1111", email: "ksw0@korea,kr" },
        { company: "남양주 시청22", name: "공상원 주사", tel: "010-1111-1111", email: "ksw0@korea,kr" },
        { company: "남양주 시청23", name: "공상원 주사", tel: "010-1111-1111", email: "ksw0@korea,kr" },
        { company: "남양주 시청24", name: "공상원 주사", tel: "010-1111-1111", email: "ksw0@korea,kr" },
        { company: "남양주 시청25", name: "공상원 주사", tel: "010-1111-1111", email: "ksw0@korea,kr" },
      ],
    };
  },
  components: {
    CardList,
  },
};
</script>

<style></style>
