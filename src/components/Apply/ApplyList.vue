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
          <div class="row ibox-content">
						<table class="table text-center table-hover dataTable">
              <thead>
                <tr>
                  <th style="width:20px"></th>
                  <th class="pagesubmit sorting" field="order" value="company" @click="$shared.sortBy('company')">고객사명</th>
                  <th class="pagesubmit sorting text-center" field="order" value="max_c_no">차수</th>
                  <th class="pagesubmit text-center" value="status">현재상태</th>
                  <th>과목</th>
                  <th class="pagesubmit sorting text-center" field="order" value="fr_dt" @click="$shared.sortBy('apply.apply_fr_dt')">신청시작일시</th>
                  <th class="pagesubmit sorting text-center" field="order" value="to_dt" @click="$shared.sortBy('apply.apply_to_dt')">신청종료일시</th>
                  <th class="pagesubmit sorting text-center" field="order" value="fr_dt" @click="$shared.sortBy('fr_dt')">수업시작일</th>
                  <th class="pagesubmit sorting text-center" field="order" value="to_dt" @click="$shared.sortBy('to_dt')">수업종료일</th>
                  <th class="pagesubmit sorting text-center" field="order" value="cnt" @click="$shared.sortBy('applyCnt')">인원수</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in applySite" :key="`apply-${index}`">
                    <td></td>
                    <td class="text-left" @click="routeDetailPage(item.idx,item.batches)">{{ item.company }}</td>
                    <td>
                      <select v-if="item.batches.length" @change="routeDetailPage(item.idx,item.batches,$event)">
                        <option value="none" selected disabled hidden>{{item.batches[0].b_no}}차</option>
                        <option v-for="(apply,i) in item.batches" :value="i" :key="apply.id">{{apply.b_no}}차</option>
                      </select>
                    </td>
                    <td class="text-center">
                      <label v-if="item.batches.length" :class="currentStatus(item.batches[0].fr_dt,item.batches[0].to_dt,1)" style="width:60px;text-align: center">{{ currentStatus(item.batches[0].fr_dt,item.batches[0].to_dt,0) }}</label>
                    </td>
                    <td></td>
                    <td class="text-center">{{ item.apply?moment(item.apply.apply_fr_dt).format('YYYY-MM-DD HH:mm'):''  }}</td>
                    <td class="text-center">{{ item.apply?moment(item.apply.apply_to_dt).format('YYYY-MM-DD HH:mm'):'' }}</td>
                    <td class="text-center">{{ item.batches.length?moment(item.batches[0].fr_dt).format('YYYY-MM-DD'):'' }}</td>
                    <td class="text-center">{{ item.batches.length?moment(item.batches[0].to_dt).format('YYYY-MM-DD'):'' }}</td>
                    <td class="text-center">{{ item.applyCnt }}명</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="row">
        <div class="text-center">
            <Pagination :currentPage="parseInt(current_page)" :totalPage="parseInt(total_page)" @returnPage="setCurrentPage" />
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
      applySite: [],
      searchKey: '',
			sortKey: '',
      current_page: 1,
      total_page: 1,
      moment: moment
    };
  },
  components: {
		Pagination
	},
  async created() {
    const res = await api.get("/partners/applySiteList");
    this.applySite = res.data.data;
    this.current_page = res.data.current_page
		this.total_page = res.data.last_page
  },
  methods: {
    routeDetailPage(s_idx, aNo, event) {
      let a_no;
      if (event) a_no = aNo[0].b_no - event.target.value;
      this.$router.push({
          name: "applyDetailsList",
          params: { sIdx: s_idx, aNo:a_no?a_no:aNo }
      })
    },
    currentStatus (fr_dt, to_dt, val) {
      const date = moment().format('YYYY-MM-DD')
      if (date < fr_dt) {
        return val ? 'b-r-sm bg-warning' : '대기중'
      } else if (date >= fr_dt && date <= to_dt) {
        return val ? 'b-r-sm bg-primary' : '진행중'
      } else if (date > to_dt) {
        return val ? 'b-r-sm bg-success' : '완료'
      } else {
        return val ? 'b-r-sm bg-danger' : '취소됨'
      }
    },
    async setCurrentPage (data) {
			this.current_page = data
			const res = await api.get('/partners/applySiteList?page=' + this.current_page)
      this.applySite = res.data.data
		},
    async setSearch(input) {
      const res = await api.get('/partners/applySiteList', { sk:input })
      this.current_page = res.data.current_page
      this.total_page = res.data.last_page
      this.applySite = res.data.data
    },
  }
};
</script>

<style scoped>
.title {
  height: 65px;
}
tr {
  padding: 10px;
}
</style>
