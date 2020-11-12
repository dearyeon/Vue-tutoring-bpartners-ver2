<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="ibox-title">
        <div class="pull-left col-lg-3">
          <h2>결제정보 관리</h2>
        </div>
        <div>
          <div class="row">
              <div class="col-sm-3">
                  <input type="text" placeholder="고객사 명" class="form-control" v-model="searchKey" v-on:keypress.enter="setSearch(searchKey)" >
              </div>
              <div class="col-sm-1">
                  <button class="btn btn-primary" v-on:click="setSearch(searchKey)">검색</button>
              </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
			<div class="ibox content">
        <div class="ibox-content">
          <div class="row">
						<table class="table table-hover dataTable">
              <thead>
                <tr>
									<th class="text-left sorting" field="order" @click="$shared.sortBy(chargeSite,'company')">고객사명</th>
									<th>차수</th>
									<th class="text-center">현재상태</th>
									<th>과목</th>
									<th>정기결제일</th>
									<th>추가결제일</th>
									<th class="sorting" field="order" @click="$shared.sortBy(chargeSite,'applyCnt')">인원수</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in chargeSite" :key="`billing-${index}`">
                    <td @click="routeDetailPage(item.batches)">{{ item.company?item.company:'-' }}</td>
                    <td>
                      <select v-if="item.batches.length" style="height:30px;" @change="routeDetailPage(item.batches,$event)">
                        <option value="none" selected disabled hidden>{{item.batches[0].b_no}}회차 ({{moment(item.batches[0].fr_dt).format('YY.MM.DD')}}-{{moment(item.batches[0].to_dt).format('MM.DD')}})</option>   
                        <option v-for="(batch,i) in item.batches" :value="i" :key="i.id">{{batch.b_no}}회차 ({{moment(batch.fr_dt).format('YY.MM.DD')}}-{{moment(batch.to_dt).format('MM.DD')}})</option>
                      </select>
                    </td>
                    <td>
                      <!--<label :class="currentStatus(item,1)" style="width:60px;text-align: center">{{ currentStatus(item,0) }}</label>-->
                    </td>
                    <td></td>
                    <td>{{ item.batches?item.batches[0].charge_dt?moment(item.batches[0].charge_dt).format('YYYY-MM-DD'):'-':'-' }}</td>
                    <td>{{ item.batches?item.batches[0].pcharge_dt?moment(item.batches[0].pcharge_dt).format('YYYY-MM-DD'):'-':'-' }}</td>
                    <td></td>
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
    routeDetailPage(batches, event) {
      if(batches.length) {
        this.$router.push({
            name: "billingDetailsList",
            params: { bbIdx:event?batches[event.target.value].idx:batches[0].idx }
        
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
