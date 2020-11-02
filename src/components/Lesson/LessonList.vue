<template>
    <div class="row">
        <div class="col-lg-12">
            <div class="ibox float-e-margins">
                <!--<div class="ibox-title" style="height: 65px">
                    <div class="pull-left">
                        <h2>수업 현황</h2>
                    </div>
                </div>-->


                      <div class="ibox-title">
        <div class="pull-left col-lg-3">
          <h2>수업 현황</h2>
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
                <div class="col-lg-12 sub-title">
                    <div class="ibox-content">
                        <div class="row">
                            <form id="listform"> 
                                <table class="table table-hover dataTable">
                                    <thead>
                                    <tr>
                                        <th class="pagesubmit sorting" field="order" value="company" @click="$shared.sortBy(items,'site','company')">고객사명</th>
                                        <th class="pagesubmit sorting text-center" field="order" value="c_no" @click="$shared.sortBy(items,'c_no')">차수</th>
                                        <th class="pagesubmit text-center" value="status">현재상태</th>
                                        <th>과목</th>
                                        <th class="pagesubmit sorting text-center" field="order" value="fr_dt" @click="$shared.sortBy(items,'fr_dt')">시작날짜</th>
                                        <th class="pagesubmit sorting text-center" field="order" value="to_dt" @click="$shared.sortBy(items,'to_dt')">종료날짜</th>
                                        <th class="pagesubmit sorting text-center" field="order" value="cnt" @click="$shared.sortBy(items,'usersCnt')">인원수</th>
                                    </tr>
                                    </thead>
                                    <tbody>


                                        <tr class="hover-pointer LESSON_INFO" 
                                            v-for="(item, index) in items" :key="`Lesson-${index}`">
                                            <td @click="routeDetailPage(item.idx,item.c_no)">
                                                {{ item.company }}
                                            </td>
                                            <td class="text-center">
                                                <select @change="routeDetailPage(item.idx,item.c_no,$event)">
                                                    <option value="none" selected disabled hidden>{{item.c_no}}차</option>
                                                    <option v-for="i in item.c_no" :value="i" :key="i.id">{{item.c_no-i+1}}차</option>
                                                </select>
                                            </td>
                                            <td class="text-center">
                                                <label :class="currentStatus(item.fr_dt,item.to_dt,1)" style="width:60px;text-align: center">{{ currentStatus(item.fr_dt,item.to_dt,0) }}</label>
                                            </td>
                                            <td class="text-left">
                                                <!--<label class="btn-info img-circle text-center no-margins" style="width: 20px;height: 20px" v-if="item.e_cnt>0"><strong>AB</strong></label>
                                                <label class="btn-danger img-circle text-center no-margins" style="width: 20px;height: 20px" v-if="item.c_cnt>0"><strong>中</strong></label>-->
                                            </td>
                                            <td class="text-center">{{ moment(item.fr_dt).format('YYYY-MM-DD') }}</td>
                                            <td class="text-center">{{ moment(item.to_dt).format('YYYY-MM-DD') }}</td>
                                            <td class="text-center">{{ item.usersCnt }}명</td>
                                        </tr>


                                    </tbody>
                                </table>
                            </form>
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
    </div>
</template>


<script>
import api from '@/common/api'
import moment from 'moment'
import Pagination from '@/components/atom/Pagination'

export default {
	data () {
		return {
			items: [],
			current_page: 1,
            total_page: 1,
            searchKey: '',
			moment: moment
		}
	},
	components: {
		Pagination
	},
	async created () {
		const res = await api.get('/partners/reportSiteList')
		this.current_page = res.data.current_page
		this.total_page = res.data.last_page
		this.items = res.data.data
	},
	methods: {
		routeDetailPage (idx, c_no, event) {
			let cNo
			if (event) cNo = c_no - event.target.value + 1
			this.$router.push({
				name: 'lessonDetailsList',
				params: { id: idx, c_no: cNo ? cNo : c_no }
			})
		},
		async setCurrentPage (data) {
			this.current_page = data
			const res = await api.get('/partners/reportSiteList?page=' + this.current_page)
			this.current_page = res.data.current_page
			this.items = res.data.data
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
        async setSearch(input) {
            const res = await api.get('/partners/reportSiteList', { sk:input })
            this.current_page = res.data.current_page
            this.total_page = res.data.last_page
            this.applySite = res.data.data
        },
	}
}
</script>