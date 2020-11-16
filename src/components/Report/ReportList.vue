<template>
	<div class="row">
		<div class="col-lg-12">
			<div class="ibox float-e-margins">
				<div class="ibox-title" style="height: 65px;">
					<div class="pull-left">
						<h2>수업 현황</h2>
					</div>
					<div class="batch-selection pull-left">
						<BatchSelection @change="refresh" />
					</div>
					<div class="col-sm-3">
						<div class="input-group">
							<input type="text" placeholder="성명 or 고객식별ID" v-model="search"
									v-on:keypress.enter="setSearch" class="form-control"/>
							<span class="input-group-btn">
								<button class="btn btn-default" v-on:click="setSearch">검색</button>
							</span>
						</div>
					</div>
					<div class="pull-right">
						<a id="btnSendOrderEmailLessonStatus" class="btn btn-success btn-w-m" @click="openModal">학습현황 메일
							일괄 발송</a>&nbsp;
						<a id="exportLessonList" class="btn btn-success btn-w-m" @click="exportExcel">
							<span v-if="!loading">엑셀 다운로드</span>
							<clip-loader :loading="loading" color="rgba(256, 256, 256, 0.7)" size="15px"></clip-loader>
						</a>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-lg-12 sub-title">
					<div class="ibox-content">

						<div class="row">
							<table class="table table-striped table-hover dataTable">
								<thead>
								<tr>
									<th>No</th>
									<th class="pagesubmit sorting" field="order" value="name">성명</th>
									<!--@click="sortBy('name')"-->
									<th class="pagesubmit sorting" field="order" value="lesson_rate">달성률</th>
									<!-- lesson_rate? -->
									<th class="pagesubmit sorting text-center" field="order" value="lesson_min">수업</th>
									<th class="pagesubmit sorting" field="order" value="total_min">전체</th>
									<th class="pagesubmit sorting" field="order" value="email">고객식별ID</th>
									<th>학습 레벨</th>
									<th class="pagesubmit sorting" field="order" value="part">부서</th>
									<th class="pagesubmit sorting" field="order" value="position">직위<br/>(직책)</th>
									<th class="pagesubmit sorting" field="order" value="position">사번<br/>(고유값)</th>
									<th class="text-center">메모1</th>
									<th class="text-center">메모2</th>
									<th style="width:35%">
										수업 히스토리(횟수)
										<div class="pull-right">
											<div class="square square-empty"></div>
											<div class="pull-left">미진행</div>
											<div class="square square-pull"></div>
											<div class="pull-left">수업완료(3분이상)</div>
										</div>
									</th>
								</tr>
								</thead>

								<tbody>
								<tr class="text-center" v-for="(item,index) in items" :key="item.id">
									<td>{{ index + 1 }}</td>
									<td class="userInfo hover-pointer" @click="openUserInfo(item)">{{
											item.user.name
										}}
									</td>
									<td>
										<span class="lesson-rate">{{ item.attend_pct }}%</span>
									</td>
									<td>
										{{
											item.use_ticket_info && item.ticket_summary ? item.goods.charge_plan.secs_per_day * (item.use_ticket_info.length + 1) - parseInt(item.ticket_summary.sum_remain_secs / 60) : '-'
										}}분/
										{{ item.ticket_summary ? item.ticket_summary.use_ticket_cnt : '-' }}회
									</td>
									<td>
										{{
											item.goods ? item.goods.charge_plan.ticket_cnt * parseInt(item.goods.charge_plan.secs_per_day / 60) : ''
										}}분/
										{{ item.goods ? item.goods.charge_plan.ticket_cnt : '' }}회
									</td>
									<td>{{ item.user.app_user ? item.user.app_user.cus_id : '' }}</td>
									<td>{{ item.user.app_user ? item.user.app_user.level : '' }}</td>
									<td>{{ item.user.department }}</td>
									<td>{{ item.user.position }}</td>
									<td>{{ item.user.emp_no }}</td>
									<td @click="[memoNum=true,setMemo(item.user)]">
										<div class="memo" v-if="item.user.memo1">{{
												item.user.memo1.length > 6 ? item.user.memo1.substring(0, 6) + '...' : item.user.memo1
											}}
										</div>
										<div v-else>
											<button class="btn-xs btn-default">등록</button>
										</div>
									</td>
									<td @click="[memoNum=false,setMemo(item.user)]">
										<div class="memo" v-if="item.user.memo2">{{
												item.user.memo2.length > 6 ? item.user.memo2.substring(0, 6) + '...' : item.user.memo2
											}}
										</div>
										<div v-else>
											<button class="btn-xs btn-default">등록</button>
										</div>
									</td>
									<td>
										<div v-for="i in calBatchDate()" :key="i.id">
											<div class="square square-pull" v-if="isUseDt(i-1,item.use_ticket_info)"
												 :data-tooltip="useDtTooltip(i-1,item)"></div>
											<div class="square square-empty" v-else></div>
										</div>
									</td>
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
						<Pagination :currentPage="parseInt(current_page)" :totalPage="parseInt(total_page)"
									@returnPage="setCurrentPage"/>
					</div>
				</div>
			</div>
		</div>

		<UserInfo style="" :data="modalitem" v-if="showModal" @close="showModal = !showModal"/>
		<!--div class="modal inmodal fade in"  style="display: block;" v-if="showModal">
		  <div class="modal-dialog modal-lg">
			<div class="modal-content" style="width:100%">
			  <div class="modal-header" style="border-bottom:0px;padding-bottom: 15px;">
				<button type="button" class="close" data-dismiss="modal">
				  <span aria-hidden="true" @click="closeModal">&times;</span>
				  <span class="sr-only">Close</span>
				</button>
				<br />
			  </div>
			  <div class="modal-body" style="background:#FFFFFF;padding:0;min-height:170px; width:100%">
			  </div>
			  <div class="modal-footer" style="border-top:0px">
				<button data-toggle="modal" data-target="#userUpdateModal" class="btn btn-success userUpdate" style="float:left;" @click="openModify">학생 수정</button>
				<button type="button" class="btn btn-white" data-dismiss="modal" @click="closeModal">닫기</button>
			  </div>
			  <UserModifyModal v-if="showModify" :item="modalitem" @update="updateItem" @close="openModify"/>
			</div>
		  </div>
		</div>-->

		<div class="modal inmodal fade in" id="addSiteModal" style="display: block;" v-show="showMemo">
			<div class="modal-dialog modal-sm">
				<div class="modal-content" style="width:350px;">
					<div class="modal-header" style="border-bottom:0px;padding-bottom: 15px;">
						<h5 class="modal-title">메모 입력</h5>
						<small>메모를 입력해 주세요.</small>
					</div>
					<div class="col-lg-12" style="margin-bottom:5px;display:inline;">
						<textarea class="form-control" v-model="memo" style="height:150px"></textarea>
					</div>
					<div class="modal-footer" style="border-top:0px">
						<button type="button" class="btn btn-white" data-dismiss="modal" @click="showMemo = false">닫기
						</button>
						<button type="button" class="btn btn-success" id="addSiteSubmit" @click="applyMemo">OK</button>
					</div>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
import api from "@/common/api";
import UserInfo from "@/components/Report/UserInfo";
import UserModifyModal from "@/components/Report/UserModifyModal";
import Pagination from "@/components/atom/Pagination";
import moment from 'moment'
import XLSX from 'xlsx'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import _ from 'lodash'
import shared from "@/common/shared";
import BatchSelection from "@/components/Common/BatchSelection";

export default {
	data() {
		return {
			search: '',
			company: '',
			batches: [],
			batch: null,
			items: [],
			current_page: 1,
			total_page: 1,
			moment: moment,
			memoNum: null,
			showMemo: false,
			memo: '',
			presentIdx: '',
			loading: false,
			showModal: false,
			modalitem: null,

			d_type: "all",
			showModify: false,
			curBBIdx: 0
		};
	},
	components: {
		BatchSelection,
		UserInfo,
		UserModifyModal,
		Pagination,
		ClipLoader,
	},
	async created() {
		this.refresh()
	},
	methods: {
		async refresh() {
			this.curBBIdx = shared.getCurBatch().idx;
			const res = await api.get('/partners/reportList', {bbIdx:this.curBBIdx})
			this.current_page = res.data.orders.current_page
			this.total_page = res.data.orders.last_page
			this.items = res.data.orders.data
			this.batch = res.data.batch;
		},
		routeDetailPage(event) {
			if (this.batches.length) {
				let bbIdx;
				if (event) bbIdx = this.batches[event.target.value].idx;
				else bbIdx = this.batches[0].idx;
				this.$router.push({
					name: 'lessonDetailsList',
					params: {bbIdx: bbIdx}
				})
				this.refresh();
			}
		},
		async setSearch() {
			const res = await api.get('/partners/reportList', {bbIdx: this.curBBIdx, sk: this.search})
			this.items = res.data.orders.data
			this.current_page = res.data.orders.current_page
			this.total_page = res.data.orders.last_page
		},
		sortBy(sortKey) {
			this.sortKey === sortKey ? this.items.reverse() : this.items.sort(function (a, b) {
				return a.userInfo[sortKey] < b.userInfo[sortKey] ? -1 : a.userInfo[sortKey] > b.userInfo[sortKey] ? 1 : 0;
			});
			this.sortKey = sortKey;
		},
		calBatchDate() {
			const a = moment(this.batch.fr_dt);
			const b = moment(this.batch.to_dt);
			return b.diff(a, 'days') + 1;
		},
		isUseDt(i, use_ticket_info) {
			if (use_ticket_info.length) {
				for (var element of use_ticket_info) {
					if (moment(this.batch.fr_dt).add(i, "days").isSame(element.use_dt, 'day')) {
						return true;
					}
				}
				return false;
			} else return false;
		},
		useDtTooltip(i, item) {
			if (item.use_ticket_info.length) {
				let str = moment(this.batch.fr_dt).add(i, "days").format('YYYY-MM-DD')
				let count = 0, total = 0, min, secs;
				for (var element of item.use_ticket_info) {
					if (moment(this.batch.fr_dt).add(i, "days").isSame(element.use_dt, 'day')) {
						total += item.goods.charge_plan.secs_per_day - element.remain_secs
						count++
					}
				}
				min = parseInt(total / 60)
				secs = total - min * 60
				str += '\n' + count + '회 - ' + min + '분 ' + secs + '초'
				return str;
			}
		},
		async setCurrentPage(data) {
			this.current_page = data;
			const res = await api.get('/partners/reportList', {
				bbIdx: this.$route.params.bbIdx,
				page: this.current_page
			})
			this.items = res.data.orders.data
			this.company = res.data.company
			this.batches = res.data.batches
			this.batch = this.batches.find(element => element.idx === parseInt(this.curBBIdx));
		},
		exportExcel: _.debounce(async function () {
			this.loading = true
			const res = await api.get('/partners/exportReportToExcel', {bbIdx: this.curBBIdx})
			const calendar = res.data.calendar
			const batch = res.data.batch
			const orders = res.data.orders

			let dataWs = []
			orders.forEach((order, index) => {

				let dateInfo = {}
				calendar.forEach(date => {
					if (order.use_ticket_info)
						dateInfo[date] = order.use_ticket_info ? order.use_ticket_info.find(element => date.substring(0, 2) + '-' + date.substring(3, 5) === element.use_dt.substring(5, 10)) ? 'O' : '' : ''
				})

				dataWs.push(Object.assign(
					{
						'번호': index + 1,
						'소속': order.user.company,
						'부서': order.user.part,
						'직위(직책)': order.user.position,
						'사번(고유값)': order.user.emp_no,
						'성명': order.user.name,
						'학습 레벨': order.user.app_user ? order.user.app_user.level : '',
						'차수': batch.b_no,
						'학습시작일': batch.fr_dt,
						'학습종료일': batch.to_dt,
						'학습언어': order.goods ? order.goods.charge_plan.mode === 'C' ? '중국어' : '영어' : '',
						'학습구분(수강권)': order.goods ? order.goods.charge_plan.title : '',
						'전체수업수': order.goods ? order.goods.charge_plan.ticket_cnt + '회' : '',
						'전체수업시간': order.goods ? order.goods.charge_plan.ticket_cnt * order.goods.charge_plan.secs_per_day / 60 + '분' : '',
						'학습 횟수': order.ticket_summary ? order.ticket_summary.use_ticket_cnt + '회' : '',
						'학습 시간': order.use_ticket_info && order.ticket_summary && order.goods ? order.goods.charge_plan.secs_per_day * (order.use_ticket_info.length + 1) - order.ticket_summary.sum_remain_secs / 60 + '분' : '',
						'학습률': order.attend_pct,
						'학습 목표율': batch.target_rt,
						'메모1': order.user.memo1,
						'메모2': order.user.memo2,
						'고객식별ID': order.user.app_user ? order.user.app_user.cus_id : '',
						'코멘트_1': order.first_lesson_review ? order.first_lesson_review.comment : '',
						'코멘트_2': order.last_lesson_review ? order.last_lesson_review.comment : '',
					}, //
					dateInfo
				));
			});
			var ws = XLSX.utils.json_to_sheet(dataWs);
			var wb = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(wb, ws, '수업현황');
			const test = XLSX.writeFile(wb, this.company + ' 수업현황 ' + batch.b_no + '주차.xlsx');
			this.loading = false
		}, 500),
		setCycle(type) {
			this.d_type = type;
		},
		openModal() {
			this.$swal({
				title: "학습현황 메일 일괄 발송",
				text: "발송 하시겠습니까? (한번만 누르고 기다려 주세요)",
				icon: "warning",
				showCancelButton: true,
				showCloseButton: true,
				confirmButtonText: "OK",
				cancelButtonText: "Cancel",
			});
		},
		async openUserInfo(item) {
			const res = await api.get('/partners/report', {
				uIdx: item.user.idx,
				bIdx: this.curBBIdx,
				bbgIdx: item.goods.idx
			})
			this.modalitem = res.data;
			this.showModal = !this.showModal;
		},
		closeModal() {
			this.showModal = !this.showModal;
		},
		openModify() {
			this.showModify = !this.showModify;
		},
		updateItem(item) {
			this.items[this.UserNum] = JSON.parse(JSON.stringify(item));
			this.modalitem = this.items[this.UserNum];
		},
		setMemo(user) {
			if (this.memoNum) this.memo = user.memo1;
			else this.memo = user.memo2;
			this.presentIdx = user.idx;
			this.showMemo = true;
		},
		async applyMemo() {
			if (this.memoNum) await api.post('/partners/setMemo', {buIdx: this.presentIdx, memo1: this.memo})
			else await api.post('/partners/setMemo', {buIdx: this.presentIdx, memo2: this.memo})
			this.showMemo = false;
			this.refresh();
		}
	}
};
</script>

<style scoped>
.row {
	width: 100%;
}

.modal {
	background-color: rgba(0, 0, 0, 0.5);
	overflow-y: auto;
	z-index: 1;
}

.s_lesson_dt {
	font-size: 85%;
}

.vertical-timeline-content {
	display: inline;
}

.swal2-container {
	z-index: 300000 !important;
}

.memo:hover {
	background-color: rgba(0, 0, 0, 0.1);
	cursor: pointer;
}

.loader {
	display: block;
	position: fixed;
	z-index: 1031;
	top: 63px;
	right: 105px;
}
</style>
