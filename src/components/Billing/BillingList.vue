<template>
	<div>
		<Header title="정기 결제 관리"
			:use-batch-selection="true" @changeBatch="refresh"
			search-placeholder="이름을 입력하세요." @search="setSearch" @reset="setSearch"
			btn1-text="결제 대기건 일괄 결제" @btn1-click="chargeBatch" btn1-variant="primary" :btn1-loading="false">
			<span>
				<h3 class="pull-left">정기결제일시</h3>
				<h4 class="pull-left" style="margin-left:30px;">{{ batch ? batch.charge_dt? moment(batch.charge_dt).format('YYYY-MM-DD HH:mm') : '-' : '-' }}</h4>
			</span>
		</Header>

		<Content>
			<Table :headers="['No','주문번호','학생','고객식별ID','수강권','결제금액','사용될카드','상태','집행일시','집행카드','집행TID/실패사유','관리메모','메모수정']"
				:data="orders"
					v-slot="{item, i}">
				<td>{{ i + 1 }}</td>
				<td>{{ item.idx }}</td>
				<td><NameField :item="item"></NameField></td>
				<td><CusIdField :user="item.user"></CusIdField></td>
				<td>{{ item.goods ? item.goods.charge_plan.title : '' }}</td>
				<td>{{ $shared.nf(item.goods.charge_price) }}</td>
				<td><ItemButton :text="item.user.card_name?'변경':'등록'"
								:variant="item.user.card_name?'default':'danger'"
								@click="[setCurrentItem(item), (newCardInfo = {}), $refs.modalCardEdit.open()]" />
					<span v-if="item.user.card_no_masked">
						{{ item.user.card_name }}{{ item.user.card_no_masked }}/{{ cardTypeLabel[item.user.card_type] }}
					</span>
				</td>
				<td><ItemButton v-if="item.charge_status" :text="chargeBtnStatus(item.charge_status).text"
								:variant="chargeBtnStatus(item.charge_status).variant"
								:disabled="chargeBtnStatus(item.charge_status).disabled"
								@click="[setCurrentItem(item), chargeBtnStatus(item.charge_status).click && chargeBtnStatus(item.charge_status).click()]" />
				</td>
				<td>{{ item.charged_dt }}</td>
				<td>{{ item.charged_info && item.charged_info.replace(/\/\d{1}/gi, match => (match === "/0" ? "/신용" : "/직불")) }}</td>
				<td :class="{'text-danger':item.charged_bill_dump}">{{ item.charged_t_id ? item.charged_t_id : item.charged_bill_dump }}</td>
				<td>{{ item.mng_memo }}</td>
				<td><ItemButton text="수정" variant="default" @click="[setCurrentItem(item), (memo=(item.mng_memo)), $refs.modalMemo.open()]" /></td>

			</Table>
		</Content>

		<Modal ref="modalWaitPayment" v-cloak>
			<div slot="body" style="align-items:center">
				<h1><strong>작업을 선택해주세요.</strong></h1>
			</div>
			<div slot="footer" style="justify-content: center">
				<button class="btn btn-default m-r" @click="$refs.modalWaitPayment.close()">취소</button>
				<button class="btn btn-warning" @click="WaitPayment('P')">일시정지</button>
				<button class="btn btn-danger" @click="WaitPayment('N')">대상아님</button>
				<button class="btn btn-info" @click="[$refs.modalWaitPayment.close(), makePayment()]">수동결제</button>
			</div>
		</Modal>
		<Modal ref="modalOnSuccess" v-cloak>
			<div slot="body" style="align-items:center">
				<h1><strong>작업을 선택해주세요.</strong></h1>
			</div>
			<div slot="footer" style="justify-content: center">
				<button class="btn btn-default m-r" @click="$refs.modalOnSuccess.close()">취소</button>
				<button class="btn btn-warning" @click="[$refs.modalOnSuccess.close(), refund()]">환불</button>
			</div>
		</Modal>
		<Modal ref="modalCardEdit" v-cloak>
			<div slot="header">
				<h1>카드 정보 수정</h1>
				<p>카드 정보를 확인해주세요.</p>
				<strong>{{ currentItem.user.card_name }} {{ cardTypeLabel[currentItem.user.card_type] }}
					{{ currentItem.user.card_no_masked }}</strong>
			</div>
			<div slot="body">
				<table class="table">
					<tr>
						<th>카드번호</th>
						<td colspan="4">
							<input
								type="text"
								class="form-control"
								placeholder="'-'를 제외한 카드번호를 입력해주세요."
								v-model="newCardInfo.cardNo"
								maxlength="16"
							/>
						</td>
					</tr>
					<tr>
						<th>유효기간</th>
						<td><input type="text" class="form-control" placeholder="MM" v-model="newCardInfo.mm"
								   maxlength="2"/></td>
						<td>월</td>
						<td><input type="text" class="form-control" placeholder="YY" v-model="newCardInfo.yy"
								   maxlength="2"/></td>
						<td>년</td>
					</tr>
					<tr>
						<th>결제비밀번호 (앞 2자리)</th>
						<td>
							<input type="password" class="form-control" placeholder="00" v-model="newCardInfo.pw"
								   maxlength="2"/>
						</td>
						<td colspan="2">* *</td>
					</tr>
					<tr>
						<th>생년월일</th>
						<td colspan="4">
							<input
								type="text"
								class="form-control"
								placeholder="YYMMDD"
								v-model="newCardInfo.birthYYMMDD"
								maxlength="6"
							/>
						</td>
					</tr>
				</table>
			</div>
			<div slot="footer">
				<button class="btn btn-danger" @click="delCardInfo(currentItem.user.idx)">삭제</button>
				<button class="btn btn-success" @click="editCardInfo(currentItem.user.idx)">수정</button>
			</div>
		</Modal>
		<Modal ref="modalMemo" v-cloak>
			<div slot="header">
				<h1>관리메모 입력</h1>
				<p>관리메모를 입력해 주세요.</p>
			</div>
			<div slot="body">
				<table class="table">
					<tr>
						<th style="vertical-align: top; padding-top:12px;">관리메모</th>
						<td>
							<textarea class="form-control" rows="3" placeholder="내용을 입력해 주세요." v-model="memo"></textarea>
						</td>
					</tr>
				</table>
			</div>
			<div slot="footer" class="pull-right">
				<button class="btn btn-success" @click="[$refs.modalMemo.close(), editMemo()]">저장</button>
			</div>
		</Modal>

	</div>
</template>

<script>
import api from '@/common/api'
import Modal from '../atom/Modal'
import Dropdown from '../atom/Dropdown'
import moment from 'moment'
import shared from "@/common/shared"
import BatchSelection from "@/components/Common/BatchSelection"
import NameField from "@/components/Common/NameField"
import CusIdField from "@/components/Common/CusIdField"
import Header from "@/components/Common/Header"
import Content from "@/components/Common/Content"
import Table from "@/components/Common/Table"
import ItemButton from "@/components/Common/ItemButton"

export default {
	components: {
		Header,
		Content,
		NameField,
		CusIdField,
		BatchSelection,
		Table,
		ItemButton,
		Modal,
		Dropdown,
	},
	async created() {
		this.refresh();
	},
	data() {
		return {
			orders: [],
			ordersAll: [],
			search: '',
			currentItem: {
				user: {}
			},
			batch: null,
			company: '',
			memo: '',
			moment: moment,
			listInfo: '',
			newCardInfo: {cardNo: '', yy: '', mm: '', pw: '', birthYYMMDD: ''},
			targetCountCheck: false,
			cardTypeLabel: ['신용', '직불'],
			sk: ''
		}
	},
	methods: {
		refresh: async function (sk) {
			const bbIdx = shared.getCurBatch().idx
			const params = sk?{bbIdx, sk}:{bbIdx}
			const res = await api.get('/partners/chargeOrderList',params)
			const data = res.data
			this.ordersAll = data.orders
			this.orders = this.ordersAll
			this.batch = data.batches.find(element => element.idx === bbIdx)
			this.company = data.company
			this.listInfo = data.list

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
		pausePayment: function () {
			this.$swal
				.fire({
					title: '일시 정지를 해제하시겠습니까?',
					confirmButtonColor: '#8FD0F5',
					confirmButtonText: '확인',
					showCancelButton: true,
					cancelButtonText: '취소',
					cancelButtonColor: '#d8d8d8',
				})
				.then(async result => {
					if (result.isConfirmed) {
						const res = await api.post('/partners/chargeStatus', {
							boIdx: this.currentItem.idx,
							status: 'B'
						});
						this.refresh();
					}
				})
		},
		editCardInfo: function (buIdx) {
			this.$swal
				.fire({
					title: '수정 하시겠습니까?',
					confirmButtonText: '확인',
					confirmButtonColor: '#8FD0F5',
				})
				.then(async result => {
					if (result.isConfirmed) {
						const res = await api.post('/partners/updateBillkey', {buIdx, ...this.newCardInfo})
						if (res.result === 2000)
							this.$swal
								.fire({
									text: '결제 카드 정보가 수정되었습니다',
									icon: 'success',
									confirmButtonText: '확인',
									confirmButtonColor: '#8FD0F5',
								})
								.then(result => {
									if (result.isConfirmed) {
										this.$refs.modalCardEdit.close()
										this.refresh()
									}
								})
						else
							this.$swal({
								title: '다시 시도 해주세요',
								text: res.message.errMsg,
								icon: 'error',
								confirmButtonText: '확인',
								confirmButtonColor: '#8FD0F5',
							})
					}
				})
		},
		delCardInfo: function (buIdx) {
			this.$swal
				.fire({
					title: '삭제 하시겠습니까?',
					confirmButtonText: '확인',
					confirmButtonColor: '#8FD0F5',
				})
				.then(async result => {
					if (result.isConfirmed) {
						const res = await api.post('/partners/deleteBillkey', {buIdx})
						if (res.result === 2000) {
							this.$swal
								.fire({
									text: '결제 카드 정보가 삭제되었습니다',
									icon: 'success',
									confirmButtonText: '확인',
									confirmButtonColor: '#8FD0F5',
								})
								.then(result => {
									if (result.isConfirmed) {
										this.$refs.modalCardEdit.close()
										this.refresh()
									}
								})
						}
					}
				})
		},
		editMemo: async function () {
			const params = {boIdx: this.currentItem.idx, memo: this.memo}
			const res = await api.post('/partners/updateMemo', params)
			if (res) this.refresh()
		},
		refund: function () {
			this.$swal
				.fire({
					html: `<strong>[baoIdx:${this.currentItem.idx}] ${this.currentItem.user.name}</strong>님<br/>`
						+ `<strong>${this.currentItem.goods.charge_plan.title}</strong><br/>`
						+ `$정기결제 건 <strong>${this.$shared.nf(this.currentItem.goods['charge_price'])}</strong>원이 환불됩니다.<br/>`
						+ `<br/>환불 처리 하시겠습니까?`,
					icon: 'warning',
					showCancelButton: true,
					cancelButtonColor: '#d8d8d8',
					cancelButtonText: '취소',
					confirmButtonColor: '#8FD0F5',
					confirmButtonText: '확인',
					showLoaderOnConfirm: true,
					reverseButtons: true,
				})
				.then(async r => {
					if (r.isConfirmed) {
						const res = await api.post('/partners/refundOrder', {
							baoIdx: this.currentItem.idx,
							isPenaltyCharge: 0,
						})
						if (res.result === 1000) {
							this.$swal
								.fire({
									html: '환불 처리에 실패하였습니다.<br/>' + res.message,
									icon: 'error',
									confirmButtonText: '확인',
									confirmButtonColor: '#8FD0F5',
								})
								.then(result => {
									if (result.isConfirmed) this.refresh()
								})
						} else {
							this.$swal
								.fire({
									text: '환불 처리 되었습니다',
									icon: 'success',
									confirmButtonText: '확인',
									confirmButtonColor: '#8FD0F5',
								})
								.then(result => {
									if (result.isConfirmed) this.refresh()
								})
						}
					}
				})
		},
		makePayment: function () {
			this.$swal
				.fire({
					html: `<strong>[주문번호:${this.currentItem.idx}] ${this.currentItem.user.name}</strong>님<br/>`
						+ `<strong>${this.currentItem.goods.charge_plan.title}</strong><br/>`
						+ `$정기결제 건 <strong>${this.$shared.nf(this.currentItem.goods.charge_price)}</strong>원이 결제됩니다.<br/>`
						+ `<br/>결제 진행 하시겠습니까?`,
					icon: 'warning',
					showCancelButton: true,
					cancelButtonColor: '#d8d8d8',
					cancelButtonText: '취소',
					confirmButtonColor: '#8FD0F5',
					confirmButtonText: '확인',
					showLoaderOnConfirm: true,
					reverseButtons: true,
				})
				.then(async r => {
					if (r.isConfirmed) {
						const res = await api.post('/partners/chargeOrder', {
							boIdx: this.currentItem.idx,
							isPenaltyCharge: 0,
						})
						if (res.result === 1000) {
							this.$swal
								.fire({
									html: '결제 처리에 실패하였습니다.<br/>' + res.message,
									icon: 'error',
									confirmButtonText: '확인',
									confirmButtonColor: '#8FD0F5',
								})
								.then(result => {
									if (result.isConfirmed) this.refresh()
								})
						} else {
							this.$swal
								.fire({
									text: '결제 처리 되었습니다',
									icon: 'success',
									confirmButtonText: '확인',
									confirmButtonColor: '#8FD0F5',
								})
								.then(result => {
									if (result.isConfirmed) this.refresh()
								})
						}
					}
				})
		},
		paymentFailed: function () {
			const info = this.currentItem.charged_bill_dump
			this.$swal
				.fire({
					html: `실패사유: ${info}`,
					confirmButtonText: '수동 재결제',
					confirmButtonColor: '#8FD0F5',
					showCancelButton: true,
					cancelButtonColor: '#d8d8d8',
					cancelButtonText: '취소',
					reverseButtons: true,
				})
				.then(result => {
					if (result.isConfirmed) this.makePayment()
				})
		},
		chargeBatch: async function () {
			let res
			if (this.targetCountCheck) {
				res = await api.post('/partners/chargeBatch', {
					bbIdx: this.batch.idx
				})
			} else {
				res = await api.post('/partners/chargeBatch', {
					bbIdx: this.batch.idx,
					check: 1,
				})
			}

			if (res.result === 2000) {
				if (res.data.targetCnt !== undefined && res.data.targetCnt > 0) {
					this.$swal.fire({
						title: '총 ' + res.data.targetCnt + '명의 일괄결제가 진행 됩니다.',
						confirmButtonText: '확인',
						confirmButtonColor: '#8FD0F5',
						showCancelButton: true,
						cancelButtonText: '취소',
						cancelButtonColor: '#ff7674'
					}).then(result => {
						if (result.isConfirmed) {
							this.targetCountCheck = true
							this.chargeBatch()
						}
					})
				} else if (res.data.targetCnt !== undefined && res.data.targetCnt === 0) {
					this.$swal.fire({
						title: '결제할 인원이 없습니다.',
						confirmButtonText: '확인',
						confirmButtonColor: '#8FD0F5'
					})
				} else {
					this.$swal.fire({
						title: '성공건수:' + res.data.successCnt + '<br/>실패건수:' + res.data.failCnt,
						confirmButtonText: '확인',
						confirmButtonColor: '#8FD0F5'
					}).then(result => {
						if (result.isConfirmed) {
							this.targetCountCheck = false
							this.apiCall(this.$route.params.aNo, this.$route.params.bNo)
						}
					})
				}
			} else {
				this.$swal
					.fire({
						title: res.message,
						confirmButtonText: '확인',
						confirmButtonColor: '#8FD0F5',
					})
			}
		},
		pChargeBatch: async function () {
			let res
			if (this.targetCountCheck) {
				res = await api.post('/partners/pchargeBatch', {
					bbIdx: this.batch.idx,
				})
			} else {
				res = await api.post('/partners/pchargeBatch', {
					bbIdx: this.batch.idx,
					check: 1,
				})
			}

			if (res.result === 2000) {
				if (res.data.targetCnt !== undefined && res.data.targetCnt > 0) {
					this.$swal.fire({
						title: '총 ' + res.data.targetCnt + '명의 일괄결제가 진행 됩니다.',
						confirmButtonText: '확인',
						confirmButtonColor: '#8FD0F5',
						showCancelButton: true,
						cancelButtonText: '취소',
						cancelButtonColor: '#ff7674'
					}).then(result => {
						if (result.isConfirmed) {
							this.targetCountCheck = true
							this.pChargeBatch()
						}
					})
				} else if (res.data.targetCnt !== undefined && res.data.targetCnt === 0) {
					this.$swal.fire({
						title: '결제할 인원이 없습니다.',
						confirmButtonText: '확인',
						confirmButtonColor: '#8FD0F5'
					})
				} else {
					this.$swal.fire({
						title: '성공건수:' + res.data.successCnt + '<br/>실패건수:' + res.data.failCnt,
						confirmButtonText: '확인',
						confirmButtonColor: '#8FD0F5'
					}).then(result => {
						if (result.isConfirmed) {
							this.targetCountCheck = false
							this.apiCall(this.$route.params.aNo, this.$route.params.bNo)
						}
					})
				}
			} else {
				this.$swal
					.fire({
						title: res.message,
						confirmButtonText: '확인',
						confirmButtonColor: '#8FD0F5',
					})
			}

		},
		updatePChargeTarget: async function () {
			const res = await api.post('/partners/updatePChargeTarget', {
				bbIdx: this.batch.idx
			})
			if (res.result === 2000) {
				this.$swal.fire({
					title: 'success',
					confirmButtonText: '확인',
					confirmButtonColor: '#8FD0F5',
				}).then(result => {
					if (result.isConfirmed) {
						this.refresh();
					}
				})
			} else {
				this.$swal
					.fire({
						title: res.message,
						confirmButtonText: '확인',
						confirmButtonColor: '#8FD0F5',
					})
			}

		},
		WaitPayment(val) {
			let text = val === 'P' ? '일시정지' : '대상아님'

			this.$swal.fire({
				title: text + ' 하시겠습니까?',
				confirmButtonText: '확인',
				confirmButtonColor: '#8FD0F5',
				showCancelButton: true,
				cancelButtonText: '취소',
				cancelButtonColor: '#d8d8d8',
			}).then(async result => {
				if (result.isConfirmed) {
					await api.post('/partners/chargeStatus', {
						boIdx: this.currentItem.idx,
						status: val
					})
					this.$refs.modalWaitPayment.close()
					this.refresh()
				}
			})
		},
		setSearch(sk) {
			this.sk = sk
			this.filteredData()
		},
	},
	computed: {
		chargeBtnStatus() {
			return status => {
				if (status === 'B') return {
					variant: 'primary',
					text: '결제 대기',
					click: this.$refs.modalWaitPayment.open
				}
				if (status === 'P') return {variant: 'warning', text: '일시 정지', click: this.pausePayment}
				if (status === 'F') return {variant: 'danger', text: '결제 실패', click: this.paymentFailed}
				if (status === 'S') return {variant: 'success', text: '결제 성공', click: this.$refs.modalOnSuccess.open}
				if (status === 'N') return {variant: 'default', text: '대상 아님'}
				if (status === 'R') return {variant: 'info', text: '환불 완료', disabled:true}
				return {variant: '', text: ''} //status === "R"
			}
		},
		setCurrentItem() {
			return async item => {
				if (item) {
					this.currentItem = item;
				}
			}
		},
	},
}
</script>

<style scoped>
.search-input {
	width: 150px;
}
.content {
	padding: 15px;
	display: flex;
	flex-direction: column;
}

.subtitle {
	display: flex;
	align-items: center;
}

.subtitle h1 {
	margin-right: 12px;
}

.input-group {
	padding-bottom: 8px;
}

td {
	vertical-align: middle;
}

textarea {
	resize: none;
	width: 100%;
}

.swal2-popup {
	font-size: 1.3rem !important;
}

.swal2-container {
	z-index: 300000 !important;
}

.btn-page-set {
	color: #1e9ed3;
	background-color: #fff;
	border: 1px solid #1e9ed3;
	border-radius: 0px;
}
</style>
