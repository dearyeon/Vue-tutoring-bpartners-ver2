<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="ibox-title">
        <h2>신청현황 리스트</h2>
      </div>
    </div>
    <div class="row">
      <div class="ibox content">
        <div class="ibox-content">
          <div class="subtitle">
            <h1>{{ company }}</h1>
            <select v-if="batches.length" @change="routeDetailPage($event)">
              <option value="none" selected disabled hidden>{{tempbatch.b_no}}회차 | {{ moment(tempbatch.fr_dt).format('YY.MM.DD') }} - {{moment(tempbatch.to_dt).format('YY.MM.DD') }}</option>
              <option v-for="(apply,i) in batches" :value="i" :key="apply.id">{{apply.b_no}}회차 | {{ moment(apply.fr_dt).format('YY.MM.DD') }} - {{moment(apply.to_dt).format('YY.MM.DD') }}</option>
            </select>
          </div>

          <table class="table table-striped table-hover dataTable">
            <thead>
              <tr>
                <th>No</th>
                <th>이름</th>
                <th>고객사 명</th>
                <th>부서</th>
                <th>직위</th>
                <th>사번</th>
                <th v-for="col in cfs" :key="col.id">{{ col.title }}</th>
                <th>수강권</th>
                <th>제공가</th>
                <th>회사지원금</th>
                <th>자기부담금</th>
                <th>접수일시</th>
              </tr>
            </thead>
            <tbody id="applyerList">
              <tr class="userInfo hover-pointer" v-for="(order, index) in orders" v-bind:key="order.id">
                <td class="number" style="vertical-align: middle;">{{ index+1 }}</td>
                <td class="part">{{ order.user.name }}</td>
                <td class="company">{{ order.user.company }}</td>
                <td class="department">{{ order.user.department }}</td>
                <td class="position">{{ order.user.position }}</td>
                <td class="emp_no">{{ order.user.emp_no }}</td>
                <td v-if="order.user.cf1">{{ getGTP('T',order.user.cf2) }}</td>
                <td v-if="order.user.cf2">{{ getGTP('S',order.user.cf1) }}</td>
                <td class="charge-plan__title text-left">{{ order.goods.charge_plan.title }}</td>
                <td class="supply_price">{{ $shared.nf(order.goods.supply_price) }}</td>
                <td>{{ $shared.nf(order.goods.supply_price - order.goods.charge_price) }}</td>
                <td class="company-charge__price">{{ $shared.nf(order.goods.charge_price) }}</td>
                <td class="apply_dt">{{ moment(order.apply_dt).format('YYYY-MM-DD HH:mm') }}</td>
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
import moment from 'moment'
export default {
  data() {
    return {
      company: '',
      batches: [],
      tempbatch: null,
      cfs: [],
      orders: [],
      aNoList: [],
      moment: moment
    };
  },
  created() {
    this.refreshData();
  },
  methods: {
    async refreshData() {
			const res = await api.get("/partners/applyOrderList", {
				bbIdx: this.$route.params.bbIdx
      });
      const data = res.data;
			this.company = data.company;
      this.batches = data.batches;
			this.tempbatch = data.batches.find(element => element.idx === parseInt(this.$route.params.bbIdx));
			this.cfs = data.cfs;
			this.orders = data.orders;
		},
    getGTP(type, val) {
    	if(type=='S') {
				return val ? this.cfs[1].opts[1] : this.cfs[1].opts[0]
			}else {
    		return val
			}
    },
    routeDetailPage(event) {
      if(this.batches.length) {
        if(parseInt(this.$route.params.bbIdx) !== this.batches[event.target.value].idx) {
          this.$router.push({
            name: "applyDetailsList",
            params: { sIdx: this.$route.params.sIdx, bbIdx:this.batches[event.target.value].idx }
          })
          this.refreshData();
        }
      }
    }
  }
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
