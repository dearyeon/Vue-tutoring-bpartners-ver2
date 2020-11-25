<template>
	<div>
		<Header title="수업 현황"
				:use-batch-selection="true" @changeBatch="refresh"
				@search="setSearch" search-placeholder="이름 or 고객식별ID"
				btn1-text="학습현황 메일 일괄 발송" @btn1-click="openModal" btn1-variant="success"
				btn2-text="엑셀 다운로드" @btn2-click="exportExcel" btn2-variant="success" :btn2-loading="loading">
		</Header>


		<Content>
			<Table :headers="['No','이름','고객식별ID','달성률','수업','전체','학습 레벨','부서','직위(직책)','사번(고유값)','메모1','메모2','수업 히스토리(횟수)']"
				:data="items"
					v-slot="{item, i}">
				<td>{{ sk?i+1:total - ((current_page-1)*per_page) - i }}</td>
				<td @click="openUserInfo(item.idx)">{{ item.user.name }}</td>
				<td><CusIdField :user="item.user"></CusIdField></td>
				<td>{{ item.attend_pct }}%</td>
				<td>
					{{ item.use_ticket_info && item.ticket_summary ? parseInt(item.goods.charge_plan.secs_per_day/60) * (item.use_ticket_info.length) : '-'}}분/
					{{ item.ticket_summary ? item.ticket_summary.use_ticket_cnt : '-' }}회
				</td>
				<td>
					{{ item.goods ? item.goods.charge_plan.ticket_cnt * parseInt(item.goods.charge_plan.secs_per_day / 60) : '' }}분/
					{{ item.goods ? item.goods.charge_plan.ticket_cnt : '' }}회
				</td>
				<td>{{ item.user.app_user ? item.user.app_user.level : '' }}</td>
				<td>{{ item.user.department }}</td>
				<td>{{ item.user.position }}</td>
				<td>{{ item.user.emp_no }}</td>
				<td @click="[memoNum=true,setMemo(item.user)]">
					<div class="memo" v-if="item.user.memo1">{{item.user.memo1.length > 6 ? item.user.memo1.substring(0, 6) + '...' : item.user.memo1}}</div>
					<div v-else><button class="btn-xs btn-default">등록</button></div>
				</td>
				<td @click="[memoNum=false,setMemo(item.user)]">
					<div class="memo" v-if="item.user.memo2">{{item.user.memo2.length > 6 ? item.user.memo2.substring(0, 6) + '...' : item.user.memo2}}</div>
					<div v-else><button class="btn-xs btn-default">등록</button></div>
				</td>
				<td>
					<div v-for="i in calBatchDate()" :key="i.id">
						<div class="square square-pull" v-if="isUseDt(i-1,item.use_ticket_info)"
								:data-tooltip="useDtTooltip(i-1,item)"></div>
						<div class="square square-empty" v-else></div>
					</div>
				</td>
			</Table>
		</Content>

		<Pagination :currentPage="parseInt(current_page)" :totalPage="parseInt(total_page)" @returnPage="setCurrentPage"/>

		<UserInfoModal :data="modalitem" v-if="showModal" @close="showModal = !showModal"/>


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
import api from "@/common/api"
import UserInfoModal from "@/components/Modal/UserInfoModal"
import Pagination from "@/components/atom/Pagination"
import moment from 'moment'
import XLSX from 'xlsx'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import _ from 'lodash'
import shared from "@/common/shared"
import BatchSelection from "@/components/Common/BatchSelection"
import CusIdField from "@/components/Common/CusIdField"
import Header from "@/components/Common/Header"
import Content from "@/components/Common/Content"
import Table from "@/components/Common/Table"
import ItemButton from "@/components/Common/ItemButton"

export default {
	data() {
		return {
			sk: '',
			batch: null,
			items: [],
			current_page: 1,
			total_page: 1,
			per_page: 1,
			total: 1,
			moment: moment,
			memoNum: null,
			showMemo: false,
			memo: '',
			presentIdx: '',
			loading: false,
			showModal: false,
			modalitem: null,
			curBBIdx: 0
		};
	},
	components: {
		UserInfoModal,
		Pagination,
		ClipLoader,
		Header,
		Content,
		CusIdField,
		BatchSelection,
		Table,
		ItemButton
	},
	async created() {
		this.refresh()
	},
	methods: {
		async refresh() {
			this.curBBIdx = shared.getCurBatch().idx;
			const res = await api.get('/partners/reportList', {bbIdx:this.curBBIdx})
			const data = res.data
			this.items = data.orders.data
			this.batch = data.batch;
			this.current_page = data.orders.current_page
			this.total_page = data.orders.last_page
			this.per_page = data.orders.per_page
			this.total = data.orders.total
		},
		async setSearch(sk) {
			this.sk = sk
			const res = await api.get('/partners/reportList', {bbIdx: this.curBBIdx, sk:this.sk})
			this.items = res.data.orders.data
			this.current_page = res.data.orders.current_page
			this.total_page = res.data.orders.last_page
			this.per_page = res.data.orders.per_page
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
				page: this.current_page,
				bbIdx: this.curBBIdx
			})
			this.items = res.data.orders.data
			this.batch = res.data.batch
		},
		exportExcel: _.debounce(async function () {
			this.loading = true
			const res = await api.get('/partners/exportReportToExcel', {bbIdx: this.curBBIdx})
			const calendar = res.data.calendar
			const batch = res.data.batch
			const orders = res.data.orders
			const company = res.data.company

			let dataWs = []
			orders.forEach((order, index) => {

				let dateInfo = {}
				calendar.forEach(date => {
					if (order.use_ticket_info)
						dateInfo[date] = order.use_ticket_info ? order.use_ticket_info.find(element => date.substring(0, 2) + '-' + date.substring(3, 5) === element.use_dt.substring(5, 10)) ? order.use_ticket_info.length+'회' : '' : ''
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
			const test = XLSX.writeFile(wb, company + ' 수업현황 ' + batch.b_no + '주차.xlsx');
			this.loading = false
		}, 500),
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
		async openUserInfo(boIdx) {
			this.modalitem = await shared.getUserInfo(boIdx)
			this.showModal = !this.showModal
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
.s_lesson_dt {
	font-size: 85%;
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
