<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="ibox-title">
        <div class="pull-left col-lg-3">
          <h2>신청/입과 관리</h2>
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
          <div class="row ibox-content">
						<table class="table table-hover dataTable">
              <thead>
                <tr>
                  <th class="pagesubmit sorting" field="order" value="company" @click="$shared.sortBy(applySite,'company')">고객사명</th>
                  <th class="pagesubmit" value="b_no">차수</th>
                  <th class="pagesubmit text-center" value="status">현재상태</th>
                  <th>과목</th>
                  <th class="pagesubmit sorting" field="order" value="fr_dt" @click="$shared.sortBy(applySite,'apply','apply_fr_dt')">신청시작일시</th>
                  <th class="pagesubmit sorting" field="order" value="to_dt" @click="$shared.sortBy(applySite,'apply','apply_to_dt')">신청종료일시</th>
                  <th class="pagesubmit" value="fr_dt">수업시작일</th>
                  <th class="pagesubmit" value="to_dt">수업종료일</th>
                  <th class="pagesubmit sorting" field="order" value="cnt" @click="$shared.sortBy(applySite,'applyCnt')">인원수</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in applySite" :key="`apply-${index}`">
                    <td @click="routeDetailPage(item.idx,item.batches)">{{ item.company }}</td>
                    <td>
                      <SelectBox
                            :batches="item.batches"
                            @input="value => { console.log(value) }"
                      ></SelectBox>
                      <!--<select v-if="item.batches.length" style="height:30px;font-size:14px;" @change="routeDetailPage(item.idx,item.batches,$event)">
                        <option value="none" selected disabled hidden>{{item.batches[0].b_no}}회차 ({{moment(item.batches[0].fr_dt).format('YY.MM.DD')}}-{{moment(item.batches[0].to_dt).format('MM.DD')}})</option>
                        <option v-for="(apply,i) in item.batches" :value="i" :key="apply.id">{{apply.b_no}}회차 ({{moment(apply.fr_dt).format('YY.MM.DD')}}-{{moment(apply.to_dt).format('MM.DD')}})</option>
                      </select>-->
                    </td>
                    <td class="text-center">
                      <label :class="currentStatus(item,1)" style="width:60px;text-align: center">{{ currentStatus(item,0) }}</label>
                    </td>
                    <td></td>
                    <td>{{ item.apply?moment(item.apply.apply_fr_dt).format('YYYY-MM-DD HH:mm'):''  }}</td>
                    <td>{{ item.apply?moment(item.apply.apply_to_dt).format('YYYY-MM-DD HH:mm'):'' }}</td>
                    <td>{{ item.batches.length?moment(item.batches[0].fr_dt).format('YYYY-MM-DD'):'' }}</td>
                    <td>{{ item.batches.length?moment(item.batches[0].to_dt).format('YYYY-MM-DD'):'' }}</td>
                    <td>{{ item.applyCnt }}명</td>
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
import SelectBox from '@/components/atom/SelectBox'
export default {
  data() {
    return {
      applySite: [],
      searchKey: '',
      current_page: 1,
      total_page: 1,
      moment: moment
    };
  },
  components: {
		Pagination,SelectBox
	},
  async created() {
    const res = await api.get("/partners/applySiteList");
    this.applySite = res.data.data;
    this.current_page = res.data.current_page
    this.total_page = res.data.last_page
  },
  methods: {
    routeDetailPage(s_idx, batches, event) {
      if(batches.length) {
        this.$router.push({
          name: "applyDetailsList",
          params: { sIdx: s_idx, bbIdx:event?batches[event.target.value].idx:batches[0].idx }
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
    async setCurrentPage (data) {
			this.current_page = data
			const res = await api.get('/partners/applySiteList?page=' + this.current_page)
      this.applySite = res.data.data
		},
    async setSearch(input) {
      const res = await api.get('/partners/applySiteList', { sk:input })
      this.applySite = res.data.data
      this.current_page = res.data.current_page
      this.total_page = res.data.last_page
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
.btn-apply {
	color: #1e9ed3;
	background-color: #fff;
	border: 1px solid #1e9ed3;
	border-radius: 0px;
}
</style>
