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
import CardList from "./CardList";

export default {
  async created() {},
  name: "BillingList",
  data() {
    return {
      response: [
        {
          company: "남양주 시청",
          name: "공상원 주사",
          part: "",
          tel: "010-9281-5223",
          email: "ksw0@korea.kr",
        },
        { company: "한국수력원자력", name: "김지용", part: "인사처 인재양성부", tel: "", email: "" },
      ],
    };
  },
  components: {
    CardList,
  },
};
</script>

<style></style>
