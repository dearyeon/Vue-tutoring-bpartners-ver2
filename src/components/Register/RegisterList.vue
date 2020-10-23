<template>
	<div class="row">
		<div class="col-lg-12">
			<div class="ibox-title">
				    <div class="pull-left col-lg-2">
                        <h2>차수 관리</h2>
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
				<router-link :to="{ path: '/register/createPage' }">
				</router-link>
			</div>
		</div>
		<div class="row">
			<div class="ibox content">
				<div class="ibox-content">
					<table class="table text-center table-hover dataTable">
						<thead>
						<tr>
							<th class="text-center">No</th>
							<th class="text-left">고객사</th>
							<th class="text-left">담당자</th>
							<th class="text-left">회차</th>
							<th class="text-center">달성률</th>
							<th class="text-center">빌링</th>
							<th class="text-center">정기결제일</th>
							<th class="text-center">추가결제일</th>
							<th class="text-center">수정일시</th>
							<th class="text-center">차수관리</th>
							<th class="text-center">신청양식설정</th>
							<th class="text-center"></th>
							<th class="text-center">URL</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="(item, index) in list" :key="`Register-${index}`">
							<td>{{ index+1 }}</td>
							<td class="text-left">{{ item.company }}</td>
							<td class="text-left">{{ item.name }}</td>
							<td class="text-left">
								<select v-model="item.selectedApplyIdx" v-if="item.batches.length">
									<option v-for="(apply,i) in item.batches" :value="i" :key="apply.id">
										{{apply.b_no}}회차 | {{ moment(apply.fr_dt).format('YY.MM.DD') }} - {{moment(apply.to_dt).format('YY.MM.DD') }}{{item.batches[item.selectedApplyIdx].del_yn?'(취소)':''}}
									</option>
								</select>
							</td>
							<td>{{ item.batches.length?item.batches[item.selectedApplyIdx].target_rt+'%':'' }}</td>
							<td>{{ item.batches.length?(item.batches[item.selectedApplyIdx].use_billing?'빌링':''):'' }}</td>
							<td>{{ item.batches.length?(item.batches[item.selectedApplyIdx].charge_dt?moment(item.batches[item.selectedApplyIdx].charge_dt).format('YY-MM-DD HH:MM'):''):'' }}</td>
							<td>{{ item.batches.length?(item.batches[item.selectedApplyIdx].pcharge_dt?moment(item.batches[item.selectedApplyIdx].pcharge_dt).format('YY-MM-DD HH:MM'):''):'' }}</td>
							<td>{{ item.upd_dt ? moment(item.upd_dt).format('YY-MM-DD HH:MM'):'' }}</td>
							<td class="text-left" style='white-space: nowrap;'>
								<button class="btn btn-page-set" @click="createBatchPage(item.idx,item.company)">추가</button>
								<button v-if="item.batches.length?(!!item.batches[item.selectedApplyIdx].idx):0" class="btn btn-page-set" @click="editBatchPage(item.batches[item.selectedApplyIdx].idx)">수정</button>
							</td>
							<td style='white-space: nowrap'>
								<div v-if="item.batches.length">
								<button v-if="!!item.batches[item.selectedApplyIdx].apply" class="btn btn-page-set" @click="editApplyPage(item.batches[item.selectedApplyIdx].apply.idx)">페이지 수정</button>
								<button v-else class="btn btn-page-set" @click="createApplyPage(item.batches[item.selectedApplyIdx].idx)">페이지 등록</button>
								</div>
							</td>
							<td>
								<button class="btn btn-primary" v-if="item.batches.length?item.batches[item.selectedApplyIdx].apply:0" @click="goToApplyPage('https://apply.tutoring.co.kr/'+item.batches[item.selectedApplyIdx].apply.hash+'/7788')">신청 페이지</button>
							</td>
							<td>
								<a v-if="item.batches.length?item.batches[item.selectedApplyIdx].apply:0" @click="copyText($event,index)">https://apply.tutoring.co.kr/{{ item.batches[item.selectedApplyIdx].apply.hash }}</a>
								<div class="alert alert-success no-padding" role="alert" v-show="item.isCopy" :id="'clipBoardAlert'+index">
									<a href="#" class="alert-link">클립보드에 복사되었습니다.</a>
								</div>
							</td>
						</tr>
						</tbody>
					</table>
				</div>
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
import Dropdown from '../atom/Dropdown'
import moment from 'moment'
import Pagination from '@/components/atom/Pagination'

export default {
	data () {
		return {
			list: [],
			current_page: 1,
			total_page: 1,
			searchKey: '',
			moment: moment
		}
	},
	components: {
		Dropdown, Pagination
	},
	async created () {
		const res = await api.get('/partners/siteBatchList');
		let list = res.data.data;
		list.forEach(item => {
			item.selectedApplyIdx = 0,
			item.isCopy = false
		})
		this.list = list
		this.current_page = res.data.current_page
		this.total_page = res.data.last_page
	},
	methods: {
		copyText: function (e, index) {
			this.$copyText(e.target.innerText).then((e) => {
				this.list[index].isCopy = true
				let $targetElement = document.getElementById('clipBoardAlert' + index)
				this.fadeout($targetElement, index)
				console.log(e)
			}, (e) => {
				console.log(e)
			})
		},
		goToApplyPage: function (url) {
			window.open(url, '_blank')
		},
		fadeout: function (element, index) {
			var op = 1  // initial opacity
			var timer = setInterval(() => {
				if (op <= 0.1) {
					clearInterval(timer)
					this.list[index].isCopy = false
				}
				element.style.opacity = op
				element.style.filter = 'alpha(opacity=' + op * 100 + ')'
				op -= op * 0.1
			}, 50)
		},
		routeFormPage (idx) {
			this.$router.push({
				name: 'applyForm',
				params: { idx: idx }
			})
		},
		async setCurrentPage (data) {
			this.current_page = data
			const res = await api.get('/partners/siteBatchList?page=' + this.current_page)
			let list = res.data.data;
			list.forEach(item => {
				item.selectedApplyIdx = 0,
				item.isCopy = false
			})
			this.list = list
			this.current_page = res.data.current_page
		},
		createBatchPage (bsIdx,company) {
			this.$router.push({
				name: 'batchNew',
				params: { bsIdx:bsIdx, company:company}
			})
		},
		editBatchPage (bIdx) {
			this.$router.push({
				name: 'batchEdit',
				params: { bIdx:bIdx }
			})
		},
		editApplyPage(bapIdx) {
			this.$router.push({
				name: 'applyEdit',
				params: { bapIdx: bapIdx }
			})
		},
		createApplyPage(bIdx) {
			this.$router.push({
				name: 'applyNew',
				params: { bIdx: bIdx }
			})
		},
		async setSearch(input) {
            const res = await api.get('/partners/siteBatchList', { sk:input })
			let list = res.data.data;
			list.forEach(item => {
				item.selectedApplyIdx = 0,
				item.isCopy = false
			})
			this.list = list
			this.current_page = res.data.current_page
			this.total_page = res.data.last_page
        },
	}
}
</script>

<style scoped>
.title {
	height: 65px;
}

.content {
	padding: 15px;
}

.table th,
.table td {
	padding-bottom: 8px;
}

.btn-page-set {
	color: #1e9ed3;
	background-color: #fff;
	border: 1px solid #1e9ed3;
	border-radius: 0px;
}

.table {
	margin: 0px;
}
</style>
