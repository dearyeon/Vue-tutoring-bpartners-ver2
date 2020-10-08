<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="ibox-title">
        <h2>수강신청 현황</h2>
      </div>
    </div>
    <div class="row">
      <div class="ibox content">
        <div class="ibox-content">
          <div class="subtitle">
            <h1>{{ sitedata.site.company }}</h1>
            <Dropdown
              :defaultValue="aNoList.length !== 0 ? aNoList[$route.params.aNo - 1] : ''"
              :itemList="aNoList"
              @dropItemClick="chANo"
            />
          </div>

          <table class="table table-striped table-hover text-center dataTable">
            <thead>
              <tr>
                <th class="text-center">No</th>
                <th class="text-center">부서</th>
                <th class="text-center">직위</th>
                <th class="text-center" v-if="bap.idx!==1">사번</th>
                <th class="text-center">이름</th>
                <th class="text-center">이메일</th>
                <th class="text-center">연락처</th>
                <th class="text-center">수강권</th>
                <th class="text-center">제공가</th>
                <th class="text-center">회사지원금</th>
                <th class="text-center">자기부담금</th>
                <th class="text-center">접수일시</th>
              </tr>
            </thead>
            <tbody id="applyerList">
              <tr
                data-toggle=""
                data-target=""
                class="userInfo hover-pointer"
                data-u_idx="2393501"
                data-bs_idx="58"
                data-bo_idx="410"
                v-for="(data, index) in list"
                v-bind:key="data.id"
              >
                <td class="number" style="vertical-align: middle;">{{ index + 1 }}</td>
                <td class="part">{{ data.user.department }}</td>
                <td class="position">{{ data.user.position }}</td>
                <td class="emp_no" v-if="bap.idx!==1">{{ data.user.emp_no }}</td>
                <td
                  class="hover-pointer name"
                  data-toggle="modal"
                  data-target="#applyerInfoModal"
                  data-name=""
                  data-cel=""
                  data-email=""
                >
                  {{ data.user.name }}
                </td>
                <td class="email">
                  {{ data.user.email_id ? data.user.email_id + "@" + bap.email_domain : "[정보 보안]" }}
                </td>
                <td class="cel">{{ data.user.cel ? data.user.cel : "[정보 보안]" }}</td>
                <td class="charge-plan__title">{{ data.__ob__.value.goods.charge_plan.title_plan }}</td>
                <td class="supply_price">{{ $shared.nf(data.__ob__.value.goods.supply_price) }}</td>
                <td class="company-charge__price" v-on:cmpprice="companyChargePrice" style="vertical-align: middle;">
                  {{ $shared.nf(companyChargePrice(index)) }}
                </td>
                <td class="charge_price">{{ $shared.nf(data.__ob__.value.goods.charge_price) }}</td>
                <td class="apply_dt">{{ data.apply_dt }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/common/api";
import Dropdown from "../atom/Dropdown";

export default {
  async created() {
    const res = await api.get("/partners/applyList", {
      sIdx: this.$route.params.sIdx,
      aNo: this.$route.params.aNo,
    });
    this.list = res.data.list;
    this.bap = res.data.bap;
    this.aNoList = res.data.aNoList.map(item => this.aNoFormat(item));
  },
  data() {
    return {
      bap: "",
      list: [],
      aNoList: [],
    };
  },
  props: {
    sitedata: {
      type: Object,
      required: true,
    }
  },
  methods: {
    companyChargePrice(index) {
      return this.list[index].__ob__.value.goods.supply_price - this.list[index].__ob__.value.goods.charge_price;
    },
    chANo: async function(index) {
      const res = await api.get("/partners/applyList", { sIdx: this.$route.params.sIdx, aNo: index + 1 });
      this.list = res.data.list;
      this.bap = res.data.bap;
      this.aNoList = res.data.aNoList.map(item => this.aNoFormat(item));
    },
    aNoFormat: function(item) {
      if (typeof item === "object" && "a_no" in item)
        return `${item.a_no}회차 | ${item.apply_fr_dt.replace(
          /(\d{4}-\d{2}-\d{2}).*/,
          "$1",
        )} ~ ${item.apply_to_dt.replace(/(\d{4}-\d{2}-\d{2}).*/, "$1")}`;
      else return "";
    },
  },
  components: {
    Dropdown,
  },
};
</script>

<style scoped>
.subtitle {
  display: flex;
  align-items: center;
}
#applyList {
  vertical-align: middle;
}
</style>
