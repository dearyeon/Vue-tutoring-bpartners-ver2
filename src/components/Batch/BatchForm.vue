<template>
	<div class="row">
		<div class="col-lg-12">
			<div class="ibox-title title">
				<h2 class="pull-left">차수 설정</h2>
				<button class="btn btn-blue-line pull-right" @click="$router.go(-1)">
					뒤로가기
				</button>
			</div>
		</div>
		<div class="row">
			<div class="ibox content">
				<div class="ibox-content">

					<div class="form-group">
						<div class="well col-xs-12">
							<h3 class="col-xs-2 no-margins">기본 정보</h3>
							<div class="col-xs-3 pull-right">
								<h3 class="col-xs-6 no-margins">취소 여부</h3>
								<div class="col-xs-6">
									<div class="switch">
										<div class="onoffswitch">
											<input class="onoffswitch-checkbox form-control" name="cancel_bach" id="cancel_bach" type="checkbox" v-model="isCancel"/>
											<label class="onoffswitch-label" for="cancel_bach">
												<span class="onoffswitch-inner"></span>
												<span class="onoffswitch-switch"></span>
											</label>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-lg-6">
								<table class="table">
									<tr>
										<th>BTB 사이트 선택</th>
										<td><input type="text" class="form-control" :placeholder="company" disabled/></td>
									</tr>
									<tr>
										<th>수료기준 출석률</th>
										<td><input type="number" class="form-control" placeholder="출석률을 입력해 주세요." v-model="targetRt"/></td>
									</tr>
									<tr>
										<th>자기 부담요율</th>
										<td>
											<input type="text" class="form-control" placeholder="자기 부담금을 입력해 주세요." v-model="selfChargeRt"/>
										</td>
									</tr>
								</table>
							</div>
							<div class="col-lg-6">
								<table class="table">
									<tr style="height:50px;">
										<table>
											<tr>
												<th>수강기간</th>
												<td>
													<date-picker v-model="applyRange" type="date" range placeholder="Select date"></date-picker>
												</td>
											</tr>
										</table>
									</tr>
								</table>
							</div>
						</div>
					</div>

					<div class="hr-line-dashed"></div>

					<div class="form-group">
						<h3 class="well">1 step. 수강권 세팅</h3>
						<div class="row">
							<div class="col-xs-3">
								<div class="col-xs-12 no-padding m-b-md">
									<strong class="col-xs-10 control-label">수강권 검색</strong>
									<div class="col-xs-12 no-padding">
										<input type="text" class="form-control" v-model="planTitle">
									</div>
								</div>

								<strong class="col-xs-12">수강권 선택</strong>
								<select class="col-xs-12" @change="addSelectedGoods($event)">
									<option v-if="!planTitle" value="">-- 수강권을 선택하세요. --</option>
									<option v-for="(goods,index) in filterdChargePlanList(chargePlanList)" :key="index" :value="goods.idx">{{goods.title}}</option>
								</select>
							</div>

							<div class="col-xs-8">
								<table class="table">
									<thead>
										<tr>
											<th>CP IDX</th>
											<th>수강권 구분</th>
											<th>
												표준 제공가
											</th>
											<th>할인율</th>
											<th>
												기업 제공가
											</th>
											<th>
												자기 부담금
											</th>
											<th class="text-center">표시여부</th>
											<th class="text-center">취소</th>
										</tr>
									</thead>
									<tbody>

										<tr v-for="(item, index) in goodsList" :key="index">
											<td>{{ item.charge_plan.idx }}</td>
											<td>{{ item.charge_plan.title }}</td>
											<td>
												<input class="form-control" type="text" v-model="item.list_price" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');" />
											</td>
											<td>
												<div class="input-w-text row">
													<span class="col-md-8 no-padding">
														<input class="form-control" type="text" v-model="item.dc_rt" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');" />
													</span>
													<span class="col-md-4">%</span>
												</div>
											</td>
											<td>
												<div class="input-w-text row">
													<span class="col-md-8 no-padding">
														<input class="form-control" type="text" v-model="item.supply_price" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');" />
													</span>
													<span class="col-md-4">원</span>
												</div>
											</td>
											<td>
												<div class="input-w-text row">
													<span class="col-md-8 no-padding">
														<input class="form-control" type="text" v-model="item.charge_price" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');" />
													</span>
													<span class="col-md-4">원</span>
												</div>
											</td>
											<td class="text-center">
												<input type="checkbox" class="btn btn-danger" v-model="item.disp_yn"/>
											</td>
											<td class="text-center">
												<button v-if="!item.idx" class="btn btn-danger" @click="deleteSelectedGoods(item.charge_plan.idx)">취소</button>
												<button v-if="item.idx" class="btn btn-default" disabled @click="deleteSelectedGoods(item.charge_plan.idx)">취소불가</button>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>

						<div class="hr-line-dashed"></div>

					</div>

					<div class="form-group row">
						<h3 class="col-sm-1 control-label">결제 여부</h3>
						<div class="col-sm-10">
							<div class="switch">
								<div class="onoffswitch">
									<input class="onoffswitch-checkbox form-control" name="use_billing" id="use_billing" type="checkbox" v-model="useBilling"/>
									<label class="onoffswitch-label" for="use_billing">
										<span class="onoffswitch-inner"></span>
										<span class="onoffswitch-switch"></span>
									</label>
								</div>
							</div>
						</div>
					</div>

					<div class="form-group" v-if="useBilling">
						<h3 class="well col-xs-12">2 step. 결제정보 입력</h3>
						<div class="row">
							<div class="col-xs-6 no-padding">
								<span class="col-xs-5">
									<div class="p-h-xs">
										<label for="chargeDt" class="m-b-xs">정기 결제일</label><br/>
										<date-picker id="chargeDt" name="chargeDt" v-model="chargeDt" type="datetime" value-type="YYYY-MM-DD hh:00:00" format="YYYY-MM-DD hh:00:00" placeholder="Select date"></date-picker>
									</div>
								</span>
								<span class="col-xs-5">
									<div class="p-h-xs">
										<label for="pChargeDt" class="m-b-xs">추가 결제일</label><br/>
										<date-picker id="pChargeDt" name="pChargeDt" v-model="pchargeDt" type="datetime" value-type="YYYY-MM-DD hh:00:00" format="YYYY-MM-DD hh:00:00" placeholder="Select date"></date-picker>
									</div>
								</span>
							</div>

						</div>
					</div>

					<div v-if="useBilling" class="hr-line-dashed"></div>

					<div class="col-xs-6 pull-right p-h-xl">
						<button class="col-xs-8 col-xs-offset-1 btn btn-lg btn-primary" @click="setBatchInfo(isNew)">저장</button>
					</div>

				</div>
			</div>
		</div>
	</div>
</template>


<script>
	import draggable from 'vuedraggable'
	import DatePicker from 'vue2-datepicker'
	import 'vue2-datepicker/index.css'
	import moment from "moment"
	import api from '@/common/api'
	import {refreshAllBatches} from "@/components/Common/BatchSelection";

	export default {
		data() {
			return {
				isNew: false,
				batchFrDt: '',
				batchToDt: '',
				targetRt:'',
				useBilling: false,
				chargeDt: '',
				pchargeDt: '',
				selfChargeRt:'',
				chargePlanList:[],
				goodsList: [],
				company: '',
				planTitle:'',
				isCancel: 0
			};
		},

		components: {
			draggable, DatePicker
		},

		created() {
			// 수정
			if(this.$route.params.bIdx) {
				this.getBacthApi(this.$route.params.bIdx)
			}

			// 생성
			if(this.$route.params.bsIdx) {
				this.isNew = true
				this.company = this.$route.params.company
				this.getBacthApi(this.$route.params.bsIdx)
			}

		},

		methods: {
			async setBatchInfo(isNew) {
				if (this.batchFrDt === "Invalid date" || this.batchToDt === "Invalid date" || !this.batchFrDt || !this.batchToDt) {
					this.$swal('수강 기간을 선택 해주세요.')
					return;
				} if(!this.targetRt || parseInt(this.targetRt) > 100) {
					this.$swal('수료기준 출석률을 100% 이하로 입력해주세요.')
					return;
				} if(parseInt(this.selfChargeRt) > 100) {
					this.$swal('자기 부담요율을 100% 이하로 입력해주세요.')
					return;
				} else {
					let idxParam = ''
					let batchData = {
						frDt: this.batchFrDt,
						toDt: this.batchToDt,
						targetRt: this.targetRt,
						useBilling: this.useBilling ? 1: 0,
						chargeDt: this.useBilling ? this.chargeDt : '',
						pchargeDt: this.useBilling ? this.pchargeDt : '',
						selfChargeRt: this.selfChargeRt,
						delYn: this.isCancel ? 1 : 0
					}

					let batchGoodsApiRes = null
					if(isNew) {
						idxParam = this.$route.params.bsIdx
						batchData['bsIdx'] = idxParam
					} else {
						idxParam = this.$route.params.bIdx
						batchData['idx'] = idxParam
					}

					const batchApiRes = await api.post('/partners/batch',batchData)


					if(this.goodsList.length !== 0 && batchApiRes.result === 2000) {
						const goodsParams = []
						let i=0;
						goodsParams['bbIdx'] = batchApiRes.data.idx
						for(const item of this.goodsList) {
							if (parseInt(item.dc_rt) > 100) {this.$swal('할인율의 최대 수치는 100%입니다.'); return;}
							if(item.idx) {
								goodsParams['goods[' + i + '][idx]'] = item.idx
							}else {
								goodsParams['goods[' + i + '][cpIdx]'] = item.charge_plan.idx
							}
							goodsParams['goods[' + i + '][listPrice]'] = item.list_price
							goodsParams['goods[' + i + '][supplyPrice]'] = item.supply_price
							goodsParams['goods[' + i + '][chargePrice]'] = item.charge_price
							goodsParams['goods[' + i + '][dcRt]'] = item.dc_rt
							goodsParams['goods[' + i + '][dispYn]'] = item.disp_yn ? 1 : 0
							i++
						}

						batchGoodsApiRes = await api.post('/partners/batchGoods', goodsParams)
					}


					refreshAllBatches();

					if(batchGoodsApiRes ? batchGoodsApiRes.result===2000 : 'true' && batchApiRes.result === 2000) {
						this.$swal('성공')
						this.$router.go(-1)
					}
				}
			},

			refresh(idx) {
				this.getBacthApi(idx)
			},

			async getBacthApi (idx) {
				const res = await api.get('/partners/chargePlanList');
				this.chargePlanList = res.data

				if(idx === this.$route.params.bIdx) {
					const {result, data} = await api.get('/partners/batch', { idx: idx })
					if(result === 2000) {
						this.company = data.site.company
						this.batchFrDt = moment(data.fr_dt).format('YYYY-MM-DD')
						this.batchToDt = moment(data.to_dt).format('YYYY-MM-DD')
						this.targetRt = data.target_rt
						this.selfChargeRt = data.self_charge_rt
						this.useBilling = data.use_billing
						this.chargeDt = data.charge_dt
						this.pchargeDt = data.pcharge_dt

						this.goodsList = data.goods
						this.isCancel = data.del_yn
					}

				} else {

					const {result, data} = await api.get('/partners/batch', { bsIdx: idx })
					if(result === 2000) {
						this.company = data.site.company
						this.batchFrDt = moment(data.fr_dt).format('YYYY-MM-DD')
						this.batchToDt = moment(data.to_dt).format('YYYY-MM-DD')
						this.targetRt = data.target_rt
						this.selfChargeRt = data.self_charge_rt
						this.useBilling = data.use_billing
						this.chargeDt = data.charge_dt
						this.pchargeDt = data.pcharge_dt

						this.goodsList = data.goods
						this.goodsList.forEach(item=>{
							item.idx = null
						})
						this.isCancel = data.del_yn
					}

				}

			},

			addSelectedGoods (event) {
				const cp = this.chargePlanList.find(item => item.idx === Number(event.target.value))
				if (!this.goodsList.find( item => item.cp_idx === cp.idx)) {
					let goods = {
						charge_plan: {
							idx: cp.idx,
							title: cp.title
						},
						list_price: 0,
						supply_price: 0,
						charge_price: 0,
						dc_rt: 0,
						disp_yn: 1
					}
					this.goodsList.push(goods)
				}
				else {
					this.$swal('이미 추가된 수강권 입니다.')
				}
			},

			deleteSelectedGoods (cpIdx) {
				const itemToRemove = this.goodsList.find( item => item.charge_plan.idx == cpIdx )
				this.$shared.removeElementInArray(this.goodsList, itemToRemove)
			}
		},

		computed: {
			applyRange: {
				get() {
					return [new Date(this.batchFrDt), new Date(this.batchToDt)];
				},
				set(value) {
					this.batchFrDt = moment(value[0]).format('YYYY-MM-DD');
					this.batchToDt = moment(value[1]).format('YYYY-MM-DD');
				}
			},

			filterdChargePlanList: function () {
				return (chargePlanList) => {

					let filterdList = []
					if(this.planTitle) filterdList = chargePlanList.filter(goods => goods.title.indexOf(this.planTitle) >= 0)
					else filterdList = chargePlanList

					return filterdList
				}
			}
		}
	}
</script>





<style>
	.title {
		height: 65px;
	}
	.content {
		padding: 15px;
	}
	.table th,
	.table td,
	.table tbody tr td {
		padding-top: 6px;
		border: none;
	}
	.btn-blue-line {
		color: #1e9ed3;
		background-color: #fff;
		border: 1px solid #1e9ed3;
		border-radius: 0px;
	}
	#text-area {
		width: 100%;
		height: 150px;
		border: solid 1px #e5e6e7;
		padding-top: 20px;
	}
	#text-area li {
		line-height: 24px;
	}
	#step-title {
		margin: 40px auto 20px;
		padding: 12px;
		background-color: #f0f0f0;
	}
	#step-title:nth-child(1) {
		margin: 0px auto 20px;
	}
	.save {
		display: flex;
		width: 250px;
		justify-content: space-between;
	}
	.save .btn {
		width: 100px;
	}
	.label-w-checkbox {
		margin: 0px;
		padding: 6px 12px;
	}
	input[type="file"] {
		display: none;
	}
	img {
		width: 340px;
		height: 240px;
		object-fit: contain;
		background-color: rgba(255, 0, 0, 0.06);
	}
	#disclaimer {
		height: 300px;
	}
</style>
