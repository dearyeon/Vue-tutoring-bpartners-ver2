<template>
	<div>
		<Header title="수업 현황"
				:use-batch-selection="true" @changeBatch="refresh"
				search-placeholder="이름 or 고객식별ID" @search="setSearch" @reset="setSearch" 
				btn1-text="학습현황 메일 일괄 발송" @btn1-click="openModal" btn1-variant="success"
				btn2-text="엑셀 다운로드" @btn2-click="exportExcel" btn2-variant="success" :btn2-loading="loading">
		</Header>


		<Content>
			<Table :headers="['No','이름','고객식별ID','학습률','수업','전체','학습 레벨','부서','직위','사번']
							.concat($shared.isSupervisor()?['메모1','메모2']:null)
							.concat(['수업 히스토리(횟수)'])"
				:data="orders"
					v-slot="{item, i}">
				<td>{{ i+1 }}</td>
				<td><NameField :item="item"></NameField></td>
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
				<td v-if="$shared.isSupervisor()" @click="[memoNum=true,setMemo(item.user)]">
					<div class="mng-text" v-if="item.user.memo1">{{item.user.memo1}}</div>
					<div v-else><button class="btn-xs btn-default">등록</button></div>
				</td>
				<td v-if="$shared.isSupervisor()" @click="[memoNum=false,setMemo(item.user)]">
					<div class="mng-text" v-if="item.user.memo2">{{item.user.memo2}}</div>
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

		<MngTextModal title="메모 입력" subtitle="메모를 입력해 주세요."
					  :content="memo" v-if="showMemo" @close="showMemo = false" @save="applyMemo"/>

	</div>
</template>

<script>
import api from "@/common/api"
import Pagination from "@/components/atom/Pagination"
import moment from 'moment'
import XLSX from 'xlsx'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import _ from 'lodash'
import shared from "@/common/shared"
import BatchSelection from "@/components/Common/BatchSelection"
import NameField from "@/components/Common/NameField"
import CusIdField from "@/components/Common/CusIdField"
import Header from "@/components/Common/Header"
import Content from "@/components/Common/Content"
import Table from "@/components/Common/Table"
import ItemButton from "@/components/Common/ItemButton"
import MngTextModal from '../Modal/MngTextModal'

export default {
	data() {
		return {
			sk: '',
			batch: null,
			ordersAll: [],
			orders: [],
			moment: moment,
			memoNum: null,
			showMemo: false,
			memo: '',
			presentIdx: '',
			loading: false,
			curBBIdx: 0
		};
	},
	components: {
		Pagination,
		ClipLoader,
		Header,
		Content,
		NameField,
		CusIdField,
		BatchSelection,
		Table,
		ItemButton,
		MngTextModal
	},
	async created() {
		this.refresh()
	},
	methods: {
		async refresh() {
			this.curBBIdx = shared.getCurBatch().idx;
			const res = await api.get('/partners/reportList', {bbIdx:this.curBBIdx})
			const data = res.data
			this.ordersAll = data.orders.sort(function (a, b) {
				return !a['attend_pct'] ? 1 : !b['attend_pct'] ? -1 : a['attend_pct'] > b['attend_pct'] ? -1 : a['attend_pct'] < b['attend_pct'] ? 1 : 0
			})
			this.orders = this.ordersAll
			this.batch = data.batch
			this.filteredData()
		},
		async setSearch(sk) {
			this.sk = sk
			this.filteredData()
		},
		filteredData() {
			this.orders = this.ordersAll
			if (this.sk) {this.orders = this.orders.filter((order) => {
				return !order.user.name.indexOf(this.sk) ||
					(order.user.cus_id && !order.user.cus_id.indexOf(this.sk)) ||
					(order.user.email && !order.user.email.indexOf(this.sk))
			})}
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
						dateInfo[date] = order.use_ticket_info ? order.use_ticket_info.find(element => date.substring(0, 2) + '-' + date.substring(3, 5) === element.use_dt.substring(5, 10)) ? order.use_ticket_info.length+'회' : '' : ''
				})

				dataWs.push(Object.assign(
					{
						'번호': index + 1,
						'소속': order.user.company,
						'부서': order.user.part,
						'직위': order.user.position,
						'사번': order.user.emp_no,
						'성명': order.user.name,
						'학습 레벨': order.user.app_user ? order.user.app_user.level : '',
						'차수': batch.b_no,
						'학습시작일': moment(batch.fr_dt).format('YY.MM.DD'),
						'학습종료일': moment(batch.to_dt).format('YY.MM.DD'),
						'학습언어': order.goods ? order.goods.charge_plan.mode === 'C' ? '중국어' : '영어' : '',
						'학습구분(수강권)': order.goods ? order.goods.charge_plan.title : '',
						'전체수업수': order.goods ? order.goods.charge_plan.ticket_cnt + '회' : '',
						'전체수업시간': order.goods ? order.goods.charge_plan.ticket_cnt * order.goods.charge_plan.secs_per_day / 60 + '분' : '',
						'학습 횟수': order.ticket_summary ? order.ticket_summary.use_ticket_cnt + '회' : '',
						'학습 시간': order.use_ticket_info && order.goods ? parseInt(order.goods.charge_plan.secs_per_day/60) * (order.use_ticket_info.length) + '분' : '',
						'학습률': order.attend_pct+'%',
						'학습 목표율': batch.target_rt+'%',
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
			const test = XLSX.writeFile(wb, shared.getCurBatch().company + ' 수업현황 ' + shared.getCurBatch().b_no + '회차.xlsx');
			this.loading = false
		}, 500),
		openModal() {
			this.$swal('개발 진행중인 기능입니다.')
			// this.$swal({
			// 	title: "학습현황 메일 일괄 발송",
			// 	text: "발송 하시겠습니까? (한번만 누르고 기다려 주세요)",
			// 	showCancelButton: true,
			// 	showCloseButton: true,
			// 	confirmButtonText: "OK",
			// 	cancelButtonText: "Cancel",
			// });
		},
		setMemo(user) {
			if (this.memoNum) this.memo = user.memo1;
			else this.memo = user.memo2;
			this.presentIdx = user.idx;
			this.showMemo = true;
		},
		async applyMemo(memo) {
			const params = this.memoNum ? {buIdx: this.presentIdx, memo1: memo} : {buIdx: this.presentIdx, memo2: memo}
			await api.post('/partners/setMemo', params)
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

.mng-text {
	overflow: hidden;
	text-overflow: ellipsis;
	width: 70px;
	white-space:nowrap;
}
</style>
