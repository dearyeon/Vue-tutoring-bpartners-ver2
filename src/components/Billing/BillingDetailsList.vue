<template>
  <div class="row">
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
        <strong>{{ currentItem.bill_card ? currentItem.bill_card.replace(/(\/\d{1})/gi, "") : "" }}</strong>
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
            <td><input type="text" class="form-control" placeholder="MM" v-model="newCardInfo.mm" maxlength="2" /></td>
            <td>월</td>
            <td><input type="text" class="form-control" placeholder="YY" v-model="newCardInfo.yy" maxlength="2" /></td>
            <td>년</td>
          </tr>
          <tr>
            <th>결제비밀번호 (앞 2자리)</th>
            <td>
              <input type="password" class="form-control" placeholder="00" v-model="newCardInfo.pw" maxlength="2" />
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
        <button class="btn btn-danger">삭제</button>
        <button class="btn btn-success" @click="editCardInfo(currentItem.bau_idx)">수정</button>
      </div>
    </Modal>
    <Modal ref="modalTag" v-cloak>
      <div slot="header">
        <h1>관리 태그 입력</h1>
        <p>관리 태그를 입력해 주세요.</p>
      </div>
      <div slot="body">
        <table class="table">
          <tr>
            <th style="vertical-align: top; padding-top:12px;">관리태그</th>
            <td>
              <textarea class="form-control" rows="3" placeholder="내용을 입력해 주세요." v-model="tag"></textarea>
            </td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="pull-right">
        <button class="btn btn-success" @click="[$refs.modalTag.close(), editTag()]">저장</button>
      </div>
    </Modal>
    <div class="col-lg-12">
      <div class="ibox-title title">
        <h2 class="pull-left">결제정보 관리</h2>
      </div>
    </div>
    <div class="row">
      <div class="ibox content">
        <div class="ibox-content">
          <div id="listform">
            <div class="subtitle">
              <h1>{{ bapInfo.site_name }}</h1>
              <Dropdown
                :defaultValue="aNoList.length !== 0 ? aNoList[$route.params.aNo - 1] : ''"
                :itemList="aNoList"
                @dropItemClick="chANo"
              />
              <Dropdown
                :defaultValue="bNoList.length !== 0 ? bNoList[$route.params.bNo - 1] : ''"
                :itemList="bNoList"
                @dropItemClick="chBNo"
              />
            </div>

            <div class="input-group col-lg-3 col-md-12 col-xs-12 pull-left">
              <input
                type="text"
                v-model="search"
                placeholder="성명 or 고객식별ID"
                class="form-control"
              />
            </div>
            <div class="col-lg-5 col-md-12 col-xs-12">
              <div class="col-lg-6 col-md-6 col-xs-6">
                <label class="control-label" for="en_i">결제 실패건 모아보기</label>
                <div class="switch">
                  <div class="onoffswitch">
                    <!-- FIXME: filter 기능 -->
                    <input class="onoffswitch-checkbox form-control" name="en_i" id="en_i" type="checkbox" value="" />
                    <label class="onoffswitch-label" for="en_i">
                      <span class="onoffswitch-inner"></span>
                      <span class="onoffswitch-switch"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="col-lg-6 col-md-6 col-xs-6">
                <label class="control-label" for="en_p">결제 일시정지건 모아보기</label>
                <div class="switch">
                  <div class="onoffswitch">
                    <input class="onoffswitch-checkbox form-control" name="en_p" id="en_p" type="checkbox" value="" />
                    <label class="onoffswitch-label" for="en_p">
                      <span class="onoffswitch-inner"></span>
                      <span class="onoffswitch-switch"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-4 col-md-12 col-xs-12">
              <!-- 정기결제 -->
              <div class="col-lg-12 col-md-6 col-xs-6" v-if="tab === 1">
                <button class="col-lg-5 col-lg-offset-7 btn btn-primary" @click="chargeBatch">결제 대기건 일괄 결제</button>
              </div>
              <!--추가결제-->
              <div class="col-lg-12 col-md-6 col-xs-6" v-if="tab === 2">
                <button class="btn btn-success col-lg-5" @click="updatePChargeTarget">결재대상 판정</button>
                <button class="btn btn-primary col-lg-5 col-lg-offset-1" @click="pChargeBatch">결제 대기건 일괄 결제</button>
              </div>
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
                    <table class="table table-striped text-center table-hover dataTable">
                      <thead>
                        <tr>
                          <th class="text-center">No</th>
                          <th class="text-center">학생</th>
                          <th class="text-center">고객식별 ID</th>
                          <th class="text-center">수강권</th>
                          <th class="text-center">결제회차</th>
                          <th class="text-center">정기결제일시</th>
                          <th class="text-center">실결제일시</th>
                          <th class="text-center">결제처리현황</th>
                          <th class="text-center">결제카드변경</th>
                          <th class="text-center">결제처리결과정보</th>
                          <th class="text-center">트랜잭션 ID</th>
                          <th class="text-center">관리태그</th>
                          <th class="text-center">태그수정</th>
                        </tr>
                      </thead>
                      <tbody id="chargeInfoList">
                        <!--정기 결제 -->
                        <tr
                          v-for="(item, index) in listInfo"
                          :key="`biillingDetailItem-${index}`"
                          class="text-center"
                        >
                          <td>{{ item.no }}</td>
                          <td>{{ item.user_name }}</td>
                          <td>{{ item.cus_id }}</td>
                          <td>{{ item.goods_name }}</td>
                          <td>{{ item.b_no }}</td>
                          <td>
                            {{
                              item.charge_dt &&
                                item.charge_dt.replace(/(\d{4})-(\d{2})-(\d{2})\s(\d{2}).*/gi, "$1년 $2월 $3일 $4시")
                            }}
                          </td>
                          <td>
                            {{
                              item.charged_dt && item.charged_dt.replace(/(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}).*/gi, "$1")
                            }}
                          </td>
                          <td>
                            <button
                              class="btn"
                              :class="chargeBtnStatus(item.charge_status).class"
                              @click="[setCurrentItem(item), chargeBtnStatus(item.charge_status).click && chargeBtnStatus(item.charge_status).click()]"
                            >
                              {{ chargeBtnStatus(item.charge_status).text }}
                            </button>
                          </td>
                          <td>
                            <button class="btn btn-default" @click="[setCurrentItem(item), (newCardInfo = {}), $refs.modalCardEdit.open()]">
                              카드변경
                            </button>
                          </td>
                          <td>
                            {{
                              item.charged_info &&
                                item.charged_info.replace(/\/\d{1}/gi, match => (match === "/0" ? "/신용" : "/직불"))
                            }}
                          </td>
						  <td>{{ item.charged_t_id }}</td>
                          <td>{{ item.mng_tag ? item.mng_tag : '' }}</td>
                          <td>
							<button class="btn btn-default" @click="[setCurrentItem(item), (isPenaltyCharge=false), (tag=(item.mng_tag?item.mng_tag:'')), $refs.modalTag.open()]">수정</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="tab-pane" :class="{ active: tab === 2 }">
                  <div class="row">
                    <table class="table table-striped text-center table-hover dataTable">
                      <thead>
                        <tr>
                          <th class="text-center">No</th>
                          <th class="text-center">학생</th>
                          <th class="text-center">고객식별ID</th>
                          <th class="text-center">수강권</th>
                          <th class="text-center">기준출석률</th>
                          <th class="text-center">달성률</th>
                          <th class="text-center">추가결제회차</th>
                          <th class="text-center">정기결제일시</th>
                          <th class="text-center">실결제일시</th>
                          <th class="text-center">결제처리현황</th>
                          <th class="text-center">결제카드변경</th>
                          <th class="text-center">결제처리결과정보</th>
                          <th class="text-center">트랜잭션 ID</th>
                          <th class="text-center">관리태그</th>
                          <th class="text-center">태그수정</th>
                        </tr>
                      </thead>
                      <tbody id="pchargeInfoList">
                        <tr
                          v-for="(item, index) in listInfo"
                          :key="`biillingDetailItem-${index}`"
                          class="text-center"
                        >
                          <td>{{ item.no }}</td>
                          <td>{{ item.user_name }}</td>
                          <td>{{ item.cus_id }}</td>
                          <td>{{ item.goods_name }}</td>
                          <td>{{ item.penalty_attend_pct }}%</td>
                          <td>{{ item.attend_pct }}%</td>
                          <td>{{ item.b_no }}</td>
                          <td>
                            {{
                              item.pcharge_dt &&
                                item.pcharge_dt.replace(/(\d{4})-(\d{2})-(\d{2})\s(\d{2}).*/gi, "$1년 $2월 $3일 $4시")
                            }}
                          </td>
                          <td>
                            {{
                              item.pcharged_dt && item.pcharged_dt.replace(/(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}).*/gi, "$1")
                            }}
                          </td>
                          <td>
                            <button v-show="item.pcharge_status"
                              class="btn"
                              :class="chargeBtnStatus(item.pcharge_status).class"
                              @click="[setCurrentItem(item), chargeBtnStatus(item.pcharge_status).click && chargeBtnStatus(item.pcharge_status).click()]
                              "
                            >
                              {{ chargeBtnStatus(item.pcharge_status).text }}
                            </button>
                          </td>
                          <td>
                            <button class="btn btn-default" @click="[setCurrentItem(item), (newCardInfo = {}), $refs.modalCardEdit.open()]">
                              카드변경
                            </button>
                          </td>
                          <td>
                            {{
                              item.pcharged_info &&
                                item.pcharged_info.replace(/\/\d{1}/gi, match => (match === "/0" ? "/신용" : "/직불"))
                            }}
                          </td>

						  <td>{{ item.pcharged_t_id }}</td>
                          <td>{{ item.pmng_tag ? item.pmng_tag : '' }}</td>
                          <td>
                            <button class="btn btn-default" @click="[setCurrentItem(item), (isPenaltyCharge=true), (tag=(item.pmng_tag?item.pmng_tag:'')), $refs.modalTag.open()]">수정</button>
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
  </div>
</template>

<script>
	import api from '@/common/api'
	import Modal from '../atom/Modal'
	import Dropdown from '../atom/Dropdown'

	export default {
		async created () {
			this.apiCall(this.$route.params.aNo, this.$route.params.bNo);
		},
		data () {
			return {
				listInfo: '',
				bapInfo: {},
				tab: 1,
				aNoList: [],
				bNoList: [],
				tag: '',
        		isPenaltyCharge: false,
				search: '',
				newCardInfo: { cardNo: '', yy: '', mm: '', pw: '', birthYYMMDD: '' },
				currentItem: {},
				targetCountCheck: false,
			}
		},
		computed: {
			filteredList () {
				return list => {
					if (list.length !== 0)
						return list.filter(
							item =>
								(item.user_name && item.user_name.includes(this.search.trim())) ||
								(item.cus_id && item.cus_id.includes(this.search.trim())),
						)
				}
			},
			chargeBtnStatus () {
				return status => {
					if (status === 'B') return {
						class: 'btn-primary',
						text: '결제 대기',
						click: this.$refs.modalWaitPayment.open
					}
					if (status === 'P') return { class: 'btn-warning', text: '일시 정지', click: this.pausePayment }
					if (status === 'F') return { class: 'btn-danger', text: '결제 실패', click: this.paymentFailed }
					if (status === 'S') return { class: 'btn-default', text: '결제 성공', click: this.$refs.modalOnSuccess.open }
					if (status === 'N') return { class: '', text: '대상 아님' }
					if (status === 'R') return { class: 'btn-info disabled', text: '환불 완료' }
					return { class: '', text: '' } //status === "R"
				}
			},
			setCurrentItem () {
				return async item => {
					if (item) {
						this.currentItem = item;
					}
				}
			},
		},
		methods: {
			apiCall: async function (aNo, bNo) {
				let res
				if (this.tab === 1) {
					res = await api.get('/partners/chargeList', {
						sIdx: this.$route.params.sIdx,
						aNo: aNo,
						bNo: bNo,
					})
					this.aNoList = res.data.aNoList.map(item => this.aNoFormat(item))
					this.bNoList = res.data.bNoList.map(item => this.bNoFormat(item))
				} else {
					res = await api.get('/partners/pchargeList', {
						sIdx: this.$route.params.sIdx,
						aNo: aNo,
						bNo: bNo,
					})
				}

				this.listInfo = res.data.list
				this.bapInfo = res.data.bap
			},
			refresh: function () {
				this.apiCall(this.$route.params.aNo, this.$route.params.bNo)
			},
			chTab: function (index) {
				this.tab = index
				this.apiCall(this.$route.params.aNo, this.$route.params.bNo)
			},
			chANo: async function (index) {
				this.apiCall(index + 1, 1)
				this.$router.push({
					name: 'billingDetailsList',
					params: { sIdx: this.$route.params.sIdx, aNo: index + 1, bNo: 1 },
				})
			},
			chBNo: async function (index) {
				this.apiCall(this.$route.params.aNo, index + 1)
				this.$router.push({
					name: 'billingDetailsList',
					params: { sIdx: this.$route.params.sIdx, aNo: this.$route.params.aNo, bNo: index + 1 },
				})
			},
			aNoFormat: function (item) {
				if (typeof item === 'object' && 'a_no' in item)
					return `${item.a_no}회차 | ${item.apply_fr_dt.replace(
						/(\d{4}-\d{2}-\d{2}).*/,
						'$1',
					)} ~ ${item.apply_to_dt.replace(/(\d{4}-\d{2}-\d{2}).*/, '$1')}`
				else return ''
			},
			bNoFormat: function (item) {
				if (typeof item === 'object' && 'b_no' in item)
					return `${item.b_no} | ${item.charge_dt.replace(
						/(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})/gi,
						'$2.$3',
					)}(정기) / ${item.pcharge_dt.replace(/(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})/gi,
						'$2.$3',)}(추가)`
			},
			pausePayment: function () {
				this.$swal
				.fire({
					title: '일시 정지를 해제하시겠습니까?',
					confirmButtonColor: '#8FD0F5',
					confirmButtonText: '확인',
        			showCloseButton: true,
				})
				.then(async result => {
					if (result.isConfirmed) {
						if (this.tab === 1){
							const res = await api.post('/partners/chargeStatus', { baoIdx: this.currentItem.idx, status: 'B' });
						} else { 
							const res = await api.post('/partners/pchargeStatus', { baoIdx: this.currentItem.idx, status: 'B' });
						}
						this.refresh();
					}
				})
			},
			editCardInfo: function (bauIdx) {
				this.$swal
					.fire({
						title: '수정 하시겠습니까?',
						confirmButtonText: '확인',
						confirmButtonColor: '#8FD0F5',
					})
					.then(async result => {
						if (result.isConfirmed) {
							const res = await api.post('/partners/updateBillkey', { bauIdx, ...this.newCardInfo })
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
			editTag: async function () {
				const params = { idx: this.currentItem.idx }
				this.isPenaltyCharge ? params.pmngTag=this.tag : params.mngTag=this.tag;

				const res = await api.post('/partners/updateMngTag', params)
				if (res) this.refresh()
			},
      refund: function () {
				const isPenaltyCharge = (this.tab!=1)
        this.$swal
            .fire({
              html: `<strong>[baoIdx:${this.currentItem.idx}] ${this.currentItem.user_name}</strong>님<br/>`
									+ `<strong>${this.currentItem.goods_name}</strong><br/>`
									+ `${isPenaltyCharge?'추가':'정기'}결제 건 <strong>${this.$shared.nf(this.currentItem[isPenaltyCharge?'pcharged_amt':'charged_amt'])}</strong>원이 환불됩니다.<br/>`
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
            .then( async r => {
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
				const isPenaltyCharge = (this.tab!=1)
				this.$swal
					.fire({
						html: `<strong>[baoIdx:${this.currentItem.idx}] ${this.currentItem.user_name}</strong>님<br/>`
								+ `<strong>${this.currentItem.goods_name}</strong><br/>`
								+ `${isPenaltyCharge?'추가':'정기'}결제 건 <strong>${this.$shared.nf(this.currentItem.charge_price)}</strong>원이 결제됩니다.<br/>`
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
					.then( async r => {
						if(r.isConfirmed) {
							const res = await api.post('/partners/chargeOrder', {
								baoIdx: this.currentItem.idx,
								isPenaltyCharge: this.tab - 1,
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
							}
							else {
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
				this.$swal
					.fire({
						html: `실패이유: ${this.currentItem.charged_bill_dump}`,
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
						bapIdx: this.bapInfo.idx,
						bNo: this.$route.params.bNo
					})
				} else {
					res = await api.post('/partners/chargeBatch', {
						bapIdx: this.bapInfo.idx,
						bNo: this.$route.params.bNo,
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
						bapIdx: this.bapInfo.idx,
						bNo: this.$route.params.bNo
					})
				} else {
					res = await api.post('/partners/pchargeBatch', {
						bapIdx: this.bapInfo.idx,
						bNo: this.$route.params.bNo,
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
					bapIdx: 1,
					bNo: this.$route.params.bNo
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
			WaitPayment (val) {
				let text = val === 'P' ? '일시정지' : '대상아님'

				this.$swal.fire({
					title: text + ' 하시겠습니까?',
					confirmButtonText: '확인',
					confirmButtonColor: '#8FD0F5',
        			showCloseButton: true,
				}).then(async result => {
					if (result.isConfirmed) {

						if (this.tab === 1) await api.post('/partners/chargeStatus', { baoIdx: this.currentItem.idx, status: val })
						else await api.post('/partners/pchargeStatus', { baoIdx: this.currentItem.idx, status: val })

						this.$refs.modalWaitPayment.close()
						this.refresh()
					}
				})
			}
		},
		components: {
			Modal,
			Dropdown,
		},
	}
</script>

<style>
  .title {
    height: 65px;
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
</style>
