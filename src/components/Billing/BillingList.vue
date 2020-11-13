<template>
	<div class="row">
		<div class="col-lg-12">
			<div class="ibox-title header">
				<h2 class="pull-left">결제 관리</h2>
				<div class="pull-left batch-selection">
					<BatchSelection @change="refresh" />
				</div>
				<div class="col-lg-4 col-md-12 col-xs-12 pull-right">
					<!-- 정기결제 -->
					<div class="col-lg-12 col-md-6 col-xs-6 pull-right" v-if="tab === 1">
						<button class="col-lg-6 col-lg-offset-7 btn btn-primary" @click="chargeBatch">결제 대기건 일괄 결제
						</button>
					</div>
					<!--추가결제-->
					<div class="col-lg-12 col-md-6 col-xs-6 pull-right" v-if="tab === 2">
						<button class="btn btn-success col-lg-5" @click="updatePChargeTarget">결제대상 판정</button>
						<button class="btn btn-primary col-lg-6 col-lg-offset-1" @click="pChargeBatch">결제 대기건 일괄 결제
						</button>
					</div>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="ibox content">
				<div class="ibox-content">
					<div id="listform">
						<div class="subtitle">
							<div v-if="tab===1" class="text-left col-lg-5" style="margin-left:40px;">
								<h3 class="col-lg-4">정기결제일시</h3>
								<h4 v-if="batches.length" class="col-lg-8">{{
										batch.charge_dt ? batch.charge_dt : '-'
									}}</h4>
							</div>
							<div v-if="tab===2" class="text-left col-lg-5" style="margin-left:40px;">
								<div class="col-lg-12">
									<h3 class="col-lg-4">추가결제일시</h3>
									<h4 v-if="batches.length" class="col-lg-8">
										{{ batch.pcharge_dt ? batch.pcharge_dt : '-' }}</h4>
								</div>
								<div class="col-lg-12">
									<h3 class="col-lg-4">기준출석률</h3>
									<h4 v-if="batches.length" class="col-lg-8">
										{{ batch.target_rt ? batch.target_rt + '%' : '-' }}</h4>
								</div>
							</div>
						</div>

						<div class="input-group col-lg-3 col-md-12 col-xs-12 pull-left">
							<input type="text" v-model="search" placeholder="성명을 입력하세요." class="form-control"/>
						</div>

					</div>

					<div class="col-lg-12">
						<!-- 탭 부분 -->
						<div class="panel blank-panel">
							<div class="panel-options">
								<ul class="nav nav-tabs customer_tab">
									<li :class="{ active: tab === 1 }"><a @click="chTab(1)">정기결제</a></li>
									<li :class="{ active: tab === 2 }"><a @click="chTab(2)">추가결제(미수료)</a></li>
								</ul>
							</div>
						</div>

						<div class="panel-body">
							<div class="tab-content">
								<div class="tab-pane" :class="{ active: tab === 1 }">
									<div class="row">
										<table class="table table-striped table-hover dataTable">
											<thead>
											<tr>
												<th>No</th>
												<th>주문번호</th>
												<th>학생</th>
												<th>수강권</th>
												<th>결제금액</th>
												<th>사용될카드</th>
												<th>상태</th>
												<th>집행일시</th>
												<th>집행카드</th>
												<th>집행TID/실패사유</th>
												<th>관리메모</th>
												<th>메모수정</th>
											</tr>
											</thead>
											<tbody id="chargeInfoList">
											<!--정기 결제 -->
											<tr v-for="(item, index) in orders"
												:key="`biillingDetailItem-${index}`" v-show="setSearch(item)">
												<td>{{ index + 1 }}</td>
												<td>{{ item.idx }}</td>
												<td>{{ item.user.name }}</td>
												<td>{{ item.goods ? item.goods.charge_plan.title : '' }}</td>
												<td>{{ $shared.nf(item.goods.charge_price) }}</td>
												<td>
													<button
														:class="{'btn':true, 'btn-outline':true, 'btn-default':item.user.card_name, 'btn-danger':!item.user.card_name}"
														@click="[setCurrentItem(item), (newCardInfo = {}), $refs.modalCardEdit.open()]">
														{{ item.user.card_name ? '변경' : '등록' }}
													</button>
													<span>
														{{ item.user.card_name }}{{ item.user.card_no_masked }}/{{ cardTypeLabel[item.user.card_type] }}
													</span>
												</td>
												<td>
													<button v-if="item.charge_status"
															class="btn"
															:class="chargeBtnStatus(item.charge_status).class"
															@click="[setCurrentItem(item), chargeBtnStatus(item.charge_status).click && chargeBtnStatus(item.charge_status).click()]"
													>
														{{ chargeBtnStatus(item.charge_status).text }}
													</button>
												</td>
												<td>{{ item.charged_dt }}</td>
												<td>
													{{
														item.charged_info &&
														item.charged_info.replace(/\/\d{1}/gi, match => (match === "/0" ? "/신용" : "/직불"))
													}}
												</td>
												<td :class="{'text-danger':item.charged_bill_dump}">
													{{ item.charged_t_id ? item.charged_t_id : item.charged_bill_dump }}
												</td>
												<td>{{ item.mng_memo }}</td>
												<td>
													<button class="btn btn-default"
															@click="[setCurrentItem(item), (isPenaltyCharge=false), (memo=(item.mng_memo)), $refs.modalMemo.open()]">
														수정
													</button>
												</td>
											</tr>
											</tbody>
										</table>
									</div>
								</div>
								<div class="tab-pane" :class="{ active: tab === 2 }">
									<div class="row">
										<table class="table table-striped table-hover dataTable">
											<thead>
											<tr>
												<th>No</th>
												<th>주문번호</th>
												<th>학생</th>
												<th>수강권</th>
												<th>결제금액</th>
												<th>사용될카드</th>
												<th>달성률</th>
												<th>상태</th>
												<th>집행일시</th>
												<th>집행카드</th>
												<th>집행TID/실패사유</th>
												<th>관리메모</th>
												<th>메모수정</th>
											</tr>
											</thead>
											<tbody id="pchargeInfoList">
											<tr v-for="(item, index) in orders" :key="`biillingDetailItem-${index}`" v-show="setSearch(item)">
												<td>{{ index + 1 }}</td>
												<td>{{ item.idx }}</td>
												<td>{{ item.user.name }}</td>
												<td>{{ item.goods ? item.goods.charge_plan.title : '' }}</td>
												<td>{{ $shared.nf(item.goods.supply_price - item.goods.charge_price) }}</td>
												<td>
													<button
														:class="{'btn':true, 'btn-outline':true, 'btn-default':item.user.card_name, 'btn-danger':!item.user.card_name}"
														@click="[setCurrentItem(item), (newCardInfo = {}), $refs.modalCardEdit.open()]">
														{{ item.user.card_name ? '변경' : '등록' }}
													</button>
													<span>
														{{ item.user.card_name }}{{ item.user.card_no_masked }}/{{ cardTypeLabel[item.user.card_type] }}
													</span>
												</td>
												<td>{{ item.attend_pct }}%</td>

												<td>
													<button v-if="item.pcharge_status"
															class="btn"
															:class="chargeBtnStatus(item.pcharge_status).class"
															@click="[setCurrentItem(item), chargeBtnStatus(item.pcharge_status).click && chargeBtnStatus(item.pcharge_status).click()]"
													>
														{{ chargeBtnStatus(item.pcharge_status).text }}
													</button>
												</td>


												<td>{{
														item.pcharged_dt && item.pcharged_dt.replace(/(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}).*/gi, "$1")
													}}
												</td>
												<td>
													{{
														item.pcharged_info &&
														item.pcharged_info.replace(/\/\d{1}/gi, match => (match === "/0" ? "/신용" : "/직불"))
													}}
												</td>

												<td :class="{'text-danger':item.pcharged_bill_dump}">
													{{ item.pcharged_t_id ? item.pcharged_t_id : item.pcharged_bill_dump }}
												</td>
												<td>{{ item.mng_memo }}</td>
												<td>
													<button class="btn btn-default"
															@click="[setCurrentItem(item), (isPenaltyCharge=true), (memo=(item.mng_memo)), $refs.modalMemo.open()]">
														수정
													</button>
												</td>
											</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>



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
import shared from "@/common/shared";
import BatchSelection from "@/components/Common/BatchSelection";

export default {
	components: {
		Modal,
		Dropdown,
		BatchSelection,
	},
	async created() {
		this.refresh();
	},
	data() {
		return {
			orders: [],
			isPenaltyCharge: false,
			search: '',
			currentItem: {
				user: {}
			},
			batches: [],
			batch: null,
			company: '',
			tab: 1,
			memo: '',
			moment: moment,
			listInfo: '',
			newCardInfo: {cardNo: '', yy: '', mm: '', pw: '', birthYYMMDD: ''},
			targetCountCheck: false,
			cardTypeLabel: ['신용', '직불']
		}
	},
	methods: {
		refresh: async function () {
			const bbIdx = shared.getCurBatch().idx;
			let res
			if (this.tab === 1) {
				res = await api.get('/partners/chargeOrderList', {bbIdx})
				this.orders = res.data.orders;
				this.batches = res.data.batches;
				this.batch = this.batches.find(element => element.idx === bbIdx);
				this.company = res.data.company;
			} else {
				res = await api.get('/partners/pchargeOrderList', {bbIdx})
				this.orders = res.data.orders;
			}

			this.listInfo = res.data.list
		},
		chTab: function (index) {
			this.tab = index
			this.refresh()
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
						if (this.tab === 1) {
							const res = await api.post('/partners/chargeStatus', {
								boIdx: this.currentItem.idx,
								status: 'B'
							});
						} else {
							const res = await api.post('/partners/pchargeStatus', {
								boIdx: this.currentItem.idx,
								status: 'B'
							});
						}
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
			const isPenaltyCharge = (this.tab != 1)
			this.$swal
				.fire({
					html: `<strong>[baoIdx:${this.currentItem.idx}] ${this.currentItem.user.name}</strong>님<br/>`
						+ `<strong>${this.currentItem.goods.charge_plan.title}</strong><br/>`
						+ `${isPenaltyCharge ? '추가' : '정기'}결제 건 <strong>${this.$shared.nf(this.currentItem.goods[isPenaltyCharge ? 'pcharge_price' : 'charge_price'])}</strong>원이 환불됩니다.<br/>`
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
							isPenaltyCharge: isPenaltyCharge ? 1 : 0,
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
			const isPenaltyCharge = (this.tab != 1)
			const chargeType = isPenaltyCharge ? '추가' : '정기'
			const price = isPenaltyCharge ? this.currentItem.goods.supply_price - this.currentItem.goods.charge_price : this.currentItem.goods.charge_price
			this.$swal
				.fire({
					html: `<strong>[주문번호:${this.currentItem.idx}] ${this.currentItem.user.name}</strong>님<br/>`
						+ `<strong>${this.currentItem.goods.charge_plan.title}</strong><br/>`
						+ `${chargeType}결제 건 <strong>${this.$shared.nf(price)}</strong>원이 결제됩니다.<br/>`
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
							isPenaltyCharge: (isPenaltyCharge?1:0),
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
			const isPenaltyCharge = (this.tab != 1)
			const info = isPenaltyCharge ? this.currentItem.pcharged_bill_dump : this.currentItem.charged_bill_dump
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

					if (this.tab === 1) await api.post('/partners/chargeStatus', {
						boIdx: this.currentItem.idx,
						status: val
					})
					else await api.post('/partners/pchargeStatus', {boIdx: this.currentItem.idx, status: val})

					this.$refs.modalWaitPayment.close()
					this.refresh()
				}
			})
		},
		setSearch(item) {
			return !item.user.name.indexOf(this.search)
		},
	},
	computed: {
		chargeBtnStatus() {
			return status => {
				if (status === 'B') return {
					class: 'btn-primary',
					text: '결제 대기',
					click: this.$refs.modalWaitPayment.open
				}
				if (status === 'P') return {class: 'btn-warning', text: '일시 정지', click: this.pausePayment}
				if (status === 'F') return {class: 'btn-danger', text: '결제 실패', click: this.paymentFailed}
				if (status === 'S') return {class: 'btn-page-set', text: '결제 성공', click: this.$refs.modalOnSuccess.open}
				if (status === 'N') return {class: 'btn-default', text: '대상 아님'}
				if (status === 'R') return {class: 'btn-info disabled', text: '환불 완료'}
				return {class: '', text: ''} //status === "R"
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

<style>
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
