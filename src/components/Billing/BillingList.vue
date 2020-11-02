<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="ibox-title">
        <div class="pull-left col-lg-3">
          <h2>결제정보 관리</h2>
        </div>
        <form id="listform">
          <div class="row">
              <div class="col-sm-3">
                  <input type="text" placeholder="고객사 명" class="form-control" v-model="searchKey" v-on:keypress.enter="setSearch(searchKey)" >
              </div>
              <div class="col-sm-1">
                  <button class="btn btn-primary" v-on:click="setSearch(searchKey)">검색</button>
              </div>
          </div>
        </form>
      </div>
    </div>
    <div class="row">
			<div class="ibox content">
        <div class="ibox-content">
          <div class="row">
						<table class="table text-center table-hover dataTable">
              <thead>
                <tr>
									<th class="text-left sorting" field="order" @click="$shared.sortBy(chargeSite,'company')">고객사명</th>
									<th class="text-center">차수</th>
									<th class="text-center">현재상태</th>
									<th class="text-center">과목</th>
									<th class="text-center">정기결제일</th>
									<th class="text-center">추가결제일</th>
									<th class="text-center sorting" field="order" @click="$shared.sortBy(chargeSite,'applyCnt')">인원수</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in chargeSite" :key="`billing-${index}`">
                    <td class="text-left" @click="routeDetailPage(item.idx,item.batches)">{{ item.company?item.company:'-' }}</td>
                    <td>
                      <select v-if="item.batches.length" @change="routeDetailPage(item.idx,item.batches,$event)">
                        <option value="none" selected disabled hidden>{{item.batches[0].b_no}}차</option>   
                        <option v-for="(batch,i) in item.batches" :value="i" :key="i.id">{{batch.b_no}}차</option>
                      </select>
                    </td>
                    <td class="text-center">
                      <!--<label :class="currentStatus(item,1)" style="width:60px;text-align: center">{{ currentStatus(item,0) }}</label>-->
                    </td>
                    <td class="text-center"></td>
                    <td class="text-center">{{ item.batches?item.batches[0].charge_dt?moment(item.batches[0].charge_dt).format('YYYY-MM-DD'):'-':'-' }}</td>
                    <td class="text-center">{{ item.batches?item.batches[0].pcharge_dt?moment(item.batches[0].pcharge_dt).format('YYYY-MM-DD'):'-':'-' }}</td>
                    <td class="text-center"></td>
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
import api from "@/common/api"
import moment from 'moment'
import Pagination from '@/components/atom/Pagination'

export default {
  data() {
    return {
      chargeSite: [],
      searchKey: '',
      current_page: 1,
      total_page: 1,
      moment: moment
    };
  },
  components: {
		Pagination
	},
  async created() {
    const res = await api.get("/partners/chargeSiteList");
    this.chargeSite = res.data.data;
    this.current_page = res.data.current_page;
    this.total_page = res.data.last_page;
  },
  methods: {
    routeDetailPage(idx, batches, event) {
      if(batches.length) {
        this.$router.push({
            name: "billingDetailsList",
            params: { sIdx: idx, aNo:event?batches[event.target.value].b_no:batches[0].b_no, bNo:1 }
        
        })
      }
    },
    currentStatus (item, val) {
      const date = moment().format('YYYY-MM-DD')
      if (item.batches.length && date < item.batches[0].fr_dt) {
        return val ? 'b-r-sm bg-warning' : '대기중'
      } else if (item.apply && date >= item.apply.apply_fr_dt && date <= item.apply.apply_to_dt) {
        return val ? 'b-r-sm btn-apply' : '신청중'
      } else if (item.batches.length && date >= item.batches[0].fr_dt && date <= item.batches[0].to_dt) {
        return val ? 'b-r-sm bg-primary' : '진행중'
      } else if (item.batches.length && date > item.batches[0].to_dt) {
        return val ? 'b-r-sm bg-success' : '완료'
      }
    },
    async setSearch(input) {
      const res = await api.get('/partners/chargeSiteList', { sk:input })
      this.chargeSite = res.data.data
      this.current_page = res.data.current_page
      this.total_page = res.data.last_page
    },
  }
};
</script>

<style scoped>
</style>
