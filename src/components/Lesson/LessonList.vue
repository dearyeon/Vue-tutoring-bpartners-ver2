<template>
    <div class="row">
        <div class="col-lg-12">
            <div class="ibox float-e-margins">
                <div class="ibox-title" style="height: 65px">
                    <div class="pull-left">
                        <h2>수업 현황</h2>
                    </div>
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
                                        <th style="width:20px"></th>
                                        <th class="pagesubmit sorting" field="order" value="company" @click="sortBy('company')">고객사명</th>
                                        <th class="pagesubmit sorting text-center" field="order" value="max_c_no" @click="sortBy('c_no')">차수</th>
                                        <th class="pagesubmit text-center" value="status">현재상태</th>
                                        <th>과목</th>
                                        <th class="pagesubmit sorting text-center" field="order" value="fr_dt" @click="sortBy('fr_dt')">시작날짜</th>
                                        <th class="pagesubmit sorting text-center" field="order" value="to_dt" @click="sortBy('to_dt')">종료날짜</th>
                                        <th class="pagesubmit sorting text-center" field="order" value="cnt" @click="sortBy('usersCnt')">인원수</th>
                                    </tr>
                                    </thead>
                                    <tbody>


                                        <tr class="hover-pointer LESSON_INFO" 
                                            v-for="(item, index) in items" :key="`Lesson-${index}`">
                                            <td><img alt="image" class="img-rounded" src="https://cdn.tutoring.co.kr/uploads/prof_img/prof_img_M" style="width:20px;height:20px;"></td>  
                                            <td @click="routeDetailPage(item.idx,item.c_no)">
                                                {{ item.site.company }}
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
				info: [],
				items: [],
				sortKey: '',
				current_page: 1,
				total_page: 1,
				moment: moment
			}
		},
		components: {
			Pagination
		},
		async created () {
			this.info = tempInfo
			const res = await api.get('/partners/lessonList')
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
			sortBy (sortKey) {
				(this.sortKey === sortKey) ? this.items.reverse() : (this.items.sort(function (a, b) {
					return a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0
				}))
				this.sortKey = sortKey
			},
			async setCurrentPage (data) {
				this.current_page = data
				const res = await api.get('/partners/lessonList?page=' + this.current_page)
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
			}
		}
	}

	const tempInfo = {
		this_month_cnt: 10,
		last_month_cnt: 5,
		this_week_cnt: 20,
		last_week_cnt: 25,
		this_three_cnt: 30,
		last_three_cnt: 30,
		today_cnt: 40,
		yesterday_cnt: 50
	}

</script>