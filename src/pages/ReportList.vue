<template>
	<div>
		<Header title="수업 현황"
				:use-batch-selection="true" @changeBatch="refresh"
				search-placeholder="이름 or 고객식별ID" @search="setSearch" @reset="setSearch" 
				btn1-text="학습현황 메일 일괄 발송" @btn1-click="openModal" btn1-variant="success"
				btn2-text="엑셀 다운로드" @btn2-click="exportExcel" btn2-variant="success" :btn2-loading="loading">
				<div>
					<div class="row" style="margin-top:-10px">
						<h3 class="pull-left">목표율</h3>
						<h4 class="pull-left" style="margin-left:30px;">{{ batch ? batch.target_rt+'%' : '-' }}</h4>
					</div>
					<div class="row">
						<h3 class="pull-left">평균학습률</h3>
						<h4 class="pull-left" style="margin-left:30px;">{{ avgAttendPct ? Math.round(avgAttendPct)+'%' : '-' }}</h4>
					</div>
				</div>
		</Header>


		<Content>
			<Table :headers="['No',{column:'이름',default:false,var:{var1:'user',var2:'name'}},'고객식별ID','학습언어','수강권',
					{column:'학습률',default:true,var:{var1:'attend_pct'}},
					'수료여부','수업','전체','부서','직위','사번',
					{column:'관리메모',default:false,var:{var1:'mng_memo'}},
					{column:'관리정보',default:false,var:{var1:'mng_info'}},'수업 히스토리(횟수)']"
				:data="orders"
					v-slot="{item, i}" @sort="sort">
				<td>{{ i+1 }}</td>
				<td><NameField :item="item"></NameField></td>
				<td><CusIdField :user="item.user"></CusIdField></td>
				<td>{{ item.goods&&item.goods.charge_plan.mode==='E'?'영어':'중국어' }}</td>
				<td>{{ item.goods&&item.goods.charge_plan.title }}</td>
				<td>{{ item.attend_pct }}%</td>
				<td>{{ item.attend_pct >= batch.target_rt ? '수료':'미수료' }}</td>
				<td>
					{{ item.use_ticket_minutes}}분/
					{{ item.ticket_summary ? item.ticket_summary.use_ticket_cnt : '-' }}회
				</td>
				<td>
					{{ item.goods ? item.goods.charge_plan.ticket_cnt * parseInt(item.goods.charge_plan.secs_per_day / 60) : '' }}분/
					{{ item.goods ? item.goods.charge_plan.ticket_cnt : '' }}회
				</td>
				<td><div class="department">{{ item.user.department }}</div></td>
				<td>{{ item.user.position }}</td>
				<td>{{ item.user.emp_no }}</td>
				<td>
					<MngField btn-title="관리메모" :item="item" :data="item.mng_memo" @click="memoModalOpen"/>
				</td>
				<td>
					<MngField btn-title="관리정보" :item="item" :data="item.mng_info" @click="infoModalOpen"/>
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

		<MngTextModal title="관리정보" :content="content" v-if="showInfoModal" @close="showInfoModal = false" @save="updateInfo"/>

		<MngTextModal title="관리메모" :content="content" v-if="showMemoModal" @close="showMemoModal = false" @save="updateMemo"/>



	</div>
</template>

<script>
import api from "@/common/api"
import moment from 'moment'
import XLSX from 'xlsx'
import _ from 'lodash'
import shared from "@/common/shared"
import Header from "@/components/Header.vue";
import Content from "@/components/Content.vue";
import NameField from "@/components/NameField.vue";
import CusIdField from "@/components/CusIdField.vue";
import Table from "@/components/Table.vue";
import MngTextModal from "@/modals/MngTextModal.vue";
import ItemButton from "@/components/ItemButton.vue";
import MngField from '../components/MngField'


export default {
	data() {
		return {
			sk: '',
			batch: null,
			ordersAll: [],
			orders: [],
			moment: moment,
			memoNum: null,
			showMemoModal: false,
			showInfoModal: false,
			content:'',
			curOrderIdx: '',
			loading: false,
			curBBIdx: 0,
			avgAttendPct: 0
		};
	},
	components: {
		Header,
		Content,
		NameField,
		CusIdField,
		Table,
		MngTextModal,
		ItemButton,
		MngField
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
			this.orders.forEach(order => {
				this.avgAttendPct += order.attend_pct
			})
			this.avgAttendPct /= this.orders.length
			this.batch = data.batch
			console.log(this.batch)
			this.filteredData()
		},

		async setSearch(sk) {
			this.sk = sk
			this.filteredData()
		},

		filteredData() {
			this.orders = this.ordersAll
			if (this.sk) {
				this.orders = this.orders.filter((order) => {
					return !order.user.name.indexOf(this.sk) ||
						(order.user.cus_id && !order.user.cus_id.indexOf(this.sk)) ||
						(order.user.email && !order.user.email.indexOf(this.sk))
				})
			}
		},

		calBatchDate() {
			const a = moment(this.batch.fr_dt);
			const b = moment(this.batch.to_dt);
			return b.diff(a, 'days') + 1;
		},

		isUseDt(i, use_ticket_info) {
			if (use_ticket_info.length) {
				for (let element of use_ticket_info) {
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
				for (let element of item.use_ticket_info) {
					if (moment(this.batch.fr_dt).add(i, "days").isSame(element.use_dt, 'day')) {
						total += item.goods.charge_plan.secs_per_day - element.remain_secs
						count++
					}
				}
				min = Math.round(total / 60)
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
			const orders = res.data.orders.sort(function (a, b) {
				return !a['attend_pct'] ? 1 : !b['attend_pct'] ? -1 : a['attend_pct'] > b['attend_pct'] ? -1 : a['attend_pct'] < b['attend_pct'] ? 1 : 0
			})


			let dataWs = []
			orders.forEach((order, index) => {

				let dateInfo = {}
				calendar.forEach(date => {
					let count = 0
					if (order.use_ticket_info) {
						order.use_ticket_info.find(element => {
							if (date.substring(0, 2) + '-' + date.substring(3, 5) === element.use_dt.substring(5, 10)) {
								count++
							}
						})
						dateInfo[date] = count ? count + '회' : ''
					}
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
						'학습 시간': order.use_ticket_minutes + '분',
						'학습률': order.attend_pct+'%',
						'학습 목표율': batch.target_rt+'%',
						'관리정보': order.mng_info,
						'관리메모': order.mng_memo,
						'고객식별ID': order.user.app_user ? order.user.app_user.cus_id : '',
						'코멘트_1': order.first_lesson_review ? order.first_lesson_review.comment : '',
						'코멘트_2': order.last_lesson_review ? order.last_lesson_review.comment : '',
					}, //
					dateInfo
				));
			});
			var ws = XLSX.utils.json_to_sheet(dataWs);
			for (const key in ws) {
				if(key !== '!ref') {
					ws[key].s = {
						font: {
							sz: 11, // font size
							bold: true // bold
						}
					}
				}
				// console.log(ws[key])
			}
			var wb = XLSX.utils.book_new();
			//wb.add_format({'bold': true})
			const test1 = XLSX.utils.book_append_sheet(wb, ws, '수업현황');
			const test = XLSX.writeFile(wb, shared.getCurBatch().company + ' 수업현황 ' + shared.getCurBatch().b_no + '회차.xlsx');
			//console.log(test1,test)
			this.loading = false
		}, 500),

		openModal() {
			//this.$shared.swal('개발 진행중인 기능입니다.')
			this.$swal({
				title:'개발 진행중인 기능입니다.',
				confirmButtonColor: '#ed5565'
			});
			// this.$swal({
			// 	title: "학습현황 메일 일괄 발송",
			// 	text: "발송 하시겠습니까? (한번만 누르고 기다려 주세요)",
			// 	showCancelButton: true,
			// 	showCloseButton: true,
			// 	confirmButtonText: "OK",
			// 	cancelButtonText: "Cancel",
			// });
		},

		memoModalOpen(order, content) {
			this.content = content
			this.curOrder = order
			this.showMemoModal = !this.showMemoModal
		},

		infoModalOpen(order, content) {
			this.content = content
			this.curOrder = order
			this.showInfoModal = !this.showInfoModal
		},

		async updateMemo(text) {
			this.showMemoModal = !this.showMemoModal
			const response = await shared.updateMemo(this.curOrder.idx,text);
			if (response === 2000) {
				this.refresh()
			}
		},

		async updateInfo(text) {
			this.showInfoModal = !this.showInfoModal
			const response = await shared.updateInfo(this.curOrder.idx, text)
			if (response === 2000) {
				this.refresh()
			}
		},
		sort(sortKey) {
			this.$shared.sortBy(this.orders,sortKey.var1,sortKey.var2)
		}
	},
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

.department {
	overflow: hidden;
	text-overflow: ellipsis;
	width: 80px;
	white-space: nowrap;
}
</style>
