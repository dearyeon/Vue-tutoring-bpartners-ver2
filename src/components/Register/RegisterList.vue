<template>
	<div class="row">
		<div class="col-lg-12">
			<div class="ibox-title title">
				<h2 class="pull-left">차수 관리</h2>
				<router-link :to="{ path: '/register/createPage' }">
				</router-link>
			</div>
		</div>
		<div class="row">
			<div class="ibox content">
				<div class="ibox-content">
					<table class="table text-center">
						<thead>
						<tr>
							<th class="text-center">No</th>
							<th class="text-center">고객사</th>
							<th class="text-center">담당자</th>
							<th class="text-center">회차</th>
							<th class="text-center">달성률</th>
							<th class="text-center">빌링</th>
							<th class="text-center">정기결제일</th>
							<th class="text-center">추가결제일</th>
							<th class="text-center">취소됨</th>
							<th class="text-center">수정일시</th>
							<th class="text-center">차수관리</th>
							<th class="text-center">신청양식설정</th>
							<th class="text-center"></th>
							<th class="text-center">URL</th>
						</tr>
						</thead>
						<tr v-for="(item, index) in list" :key="`Register-${index}`">
							<td>{{ index+1 }}</td>
							<td>
								{{ item.company }}
							</td>
							<td>{{ item.name }}</td>
							<td>
								<select v-model="item.selectedApplyIdx">
									<option v-for="(apply,i) in item.batches" :value="i" :key="apply.id">
										{{apply.b_no}}회차 | {{ moment(apply.fr_dt).format('YY-MM-DD') }} - {{moment(apply.to_dt).format('YY-MM-DD') }}
									</option>
								</select>
							</td>
							<td>{{ item.batches[item.selectedApplyIdx].target_rt }}%</td>
							<td>{{ item.batches[item.selectedApplyIdx].use_billing?'Y':'-' }}</td>
							<td>{{ item.batches[item.selectedApplyIdx].charge_dt }}</td>
							<td>{{ item.batches[item.selectedApplyIdx].pcharge_dt }}</td>
							<td>{{ item.batches[item.selectedApplyIdx].del_yn?'Y':'-' }}</td>
							<td>{{ item.upd_dt ? moment(item.upd_dt).format('YY-MM-DD HH:MM:ss'):'-' }}</td>
							<td>
								<button class="btn btn-page-set" @click="createBatchPage(item.idx)">추가</button>
								<button class="btn btn-page-set" @click="editBatchPage(item.batches[item.selectedApplyIdx].idx)">수정</button>
							</td>
							<td>
								<button v-if="!!item.batches[item.selectedApplyIdx].apply" class="btn btn-page-set" @click="editApplyPage(item.batches[item.selectedApplyIdx].apply.idx)">페이지 수정</button>
								<button v-else class="btn btn-page-set" @click="createApplyPage(item.batches[item.selectedApplyIdx].idx)">페이지 등록</button>
							</td>
							<td>
								<button class="btn btn-primary" v-if="item.batches[item.selectedApplyIdx].apply" @click="goToApplyPage('https://apply.tutoring.co.kr/'+item.batches[item.selectedApplyIdx].apply.hash+'/7788')">페이지 보러 가기</button>
							</td>
							<td>
								<a v-if="item.batches[item.selectedApplyIdx].apply" @click="copyText($event,index)">https://apply.tutoring.co.kr/{{ item.batches[item.selectedApplyIdx].apply.hash }}</a>
								<div class="alert alert-success no-padding" role="alert" v-show="item.isCopy" :id="'clipBoardAlert'+index">
									<a href="#" class="alert-link">클립보드에 복사되었습니다.</a>
								</div>
							</td>
						</tr>
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
			console.log(this.current_page);
			const res = await api.get('/partners/siteBatchList?page=' + this.current_page)
			let list = res.data.data;
			list.forEach(item => {
				item.selectedApplyIdx = 0,
				item.isCopy = false
			})
			this.list = list
			this.current_page = res.data.current_page
		},
		createBatchPage (bsIdx) {
			this.$router.push({
				name: 'batchNew',
				params: { bsIdx:bsIdx }
			})
		},
		editBatchPage (idx) {
			this.$router.push({
				name: 'batchEdit',
				params: { idx:idx }
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
		}
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
	width: 100%;
}

.table {
	margin: 0px;
}
</style>
