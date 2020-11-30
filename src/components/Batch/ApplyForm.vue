<template>
	<div class="row">
		<div class="col-lg-12">
			<div class="ibox-title title">
				<h2 class="pull-left">신청 양식 설정</h2>
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
							<h3 class="col-xs-2 no-margins">1 step. 액세스 홈</h3>
							<div class="col-xs-3 pull-right">
								<h3 class="col-xs-6 no-margins">오픈 여부</h3>
								<div class="col-xs-6">
									<div class="switch">
										<div class="onoffswitch">
											<input class="onoffswitch-checkbox form-control" name="cancel_bach" id="cancel_bach" type="checkbox" v-model="openYn"/>
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
										<th>Access code</th>
										<td><input type="text" class="form-control" v-model="accessCode" placeholder="Access code를 입력해 주세요." /></td>
									</tr>
									<tr>
										<th>이메일 도메인 지정</th>
										<td><input type="text" class="form-control" placeholder="이메일 도메인을 입력해주세요." v-model="emailDomain"/></td>
									</tr>
									<tr>
										<th>제한 인원수</th>
										<td><input type="text" class="form-control" placeholder="제한 인원수를 입력해 주세요." v-model="limitCnt"/></td>
									</tr>
								</table>
							</div>
							<div class="col-lg-6">
								<table class="table">
									<tr>
									<th style="vertical-align: top; padding-top: 12px; width:20%">수강신청 문의</th>
									<td>
										<textarea class="form-control" v-model="contacts" style="height:250px"></textarea>
									</td>
									</tr>
									<tr>
										<th>수강신청기간</th>
										<td>
											<date-picker v-model="applyRange" type="datetime"  format="YYYY-MM-DD HH:mm" range placeholder="Select date"></date-picker>
										</td>
									</tr>
								</table>
							</div>
						</div>
					</div>

					<div class="hr-line-dashed"></div>
					<div class="form-group">
						<h3 class="well">2 step. 신청시 주의 사항(수강 신청 브릿지 화면)</h3>
						<table class="table">
							<tr>
								<th class="col-lg-2">
									<strong class="label-w-checkbox">내용</strong>
								</th>
								<td class="col-lg-10">
									<textarea class="form-control" v-model="notice" style="height:250px"></textarea>
								</td>
							</tr>
						</table>
					</div>

					<div class="form-group">
						<div class="hr-line-dashed"></div>
						<h3 class="well">3 step. 개인정보 수집</h3>
						<div class="drag">
							<table class="table table-bordered">
							<thead>
								<th class="text-center">순서</th>
								<th class="text-center">노출여부</th>
								<th class="text-center">필수입력</th>
								<th class="text-center">column Name</th>
								<th class="text-center ">항목</th>
								<th class="text-center">질문 내용</th>
								<th class="text-center">타입</th>
								<th class="text-center">
									<button class="btn btn-success" @click="addFormList">row 추가</button>
								</th>
							</thead>
								<draggable :list="applyerFormList" tag="tbody">
									<tr v-for="(item,index) in applyerFormList" :key="item.id">
										<td class="text-center">
											{{sortNumber(item,index)}}
										</td>
										<td class="text-center">
											<input v-model="item.disp_yn" type="checkbox" :checked="item.disp_yn"/>
										</td>
										<td class="text-center">
											<input v-model="item.required" type="checkbox" :checked="item.required"/>
										</td>
										<td>
											<input type="text" class="form-control" v-model="item.col_id" readonly placeholder="column Name을 입력해주세요."/>
										</td>
										<td>
											<input type="text" class="form-control" v-model="item.title" placeholder="항목을 입력해주세요."/>
										</td>
										<td>
											<input type="text" class="form-control" v-model="item.description" placeholder="내용을 입력해주세요."/>
										</td>
										<td class="text-center">
											<div class="col-xs-2">
												<select v-model="item.type">
													<option value="T">Text</option>
													<option value="S">Select</option>
												</select>
											</div>

											<div class="col-xs-10" v-if="item.type === 'S'">
											<span class="col-xs-6">
											<input type="text" class="form-control" v-model="item.opts" placeholder="option을 '|' 로 구분해서 작성해 주세요."/>
											</span>
												<span class="col-xs-6">
											<input type="text" class="form-control" v-model="item.vals" placeholder="value를 '|' 로 구분해서 작성해 주세요."/>
											</span>
											</div>
										</td>
										<td class="text-center" v-if="item.isCf">
											<button class="btn btn-danger" @click="deleteFormList(item.col_id)">삭제</button>
										</td>
									</tr>
								</draggable>
							</table>
						</div>
					</div>

					<div class="hr-line-dashed"></div>
						<div class="form-group">
							<h3 class="well col-xs-12">4 step. 결제정보 입력</h3>
							<div class="row">
								<div class="col-lg-2">
									<strong class="label-w-checkbox">유의사항</strong>
								</div>
								<div class="col-lg-10">
									<textarea class="form-control" v-model="billNotice"></textarea>
								</div>
							</div>
						</div>

					<div class="col-xs-4 pull-right p-h-xl">
						<button class="col-xs-12 btn btn-lg btn-primary" @click="[sendNum(),setForm()]">저장</button>
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
import _ from 'lodash'

let bap = null;

export default {
	data () {
		return {
			image: '',
			previewSrc: '',
			accessCode: '',
			emailDomain: '',
			contacts: '',
			notice: '',
			billNotice: '',
			applyFrDt: '',
			applyToDt: '',
			openYn: false,
			applyerFormList: [],
			cfCnt: 0,
			request: 1,
			limitCnt: ''
		}
	},
	components: {
		draggable, DatePicker
	},
	async created () {
		// 수정
		if(this.$route.params.baIdx) {
			this.getApplyPageApi(this.$route.params.baIdx)
		}

		// 생성
		if(this.$route.params.bIdx && this.$route.params.bsIdx) {
			this.getApplyPageApi(this.$route.params.bsIdx)
		}

		// this.getApplyPageApi()
	},
	methods: {
		refresh: async function () {
			this.getApplyPageApi()
		},
		getApplyPageApi: async function (idx) {

			// 수정일 경우
			if (idx === this.$route.params.baIdx) {
				const {result, data} = await api.get('/partners/apply', { idx: idx }).catch( (e) => { console.log(e) })

				console.log(data);
				if(result === 2000) {
					this.accessCode = data.access_code
					this.emailDomain = data.email_domain
					this.contacts = data.contacts
					this.notice = data.notice
					this.billNotice = data.bill_notice
					this.applyFrDt = data.apply_fr_dt
					this.applyToDt = data.apply_to_dt
					this.applyRange = [new Date(this.applyFrDt), new Date(this.applyToDt)]
					this.openYn = data.open_yn ? true : false
					this.limitCnt = data.limit_cnt
					this.applyerFormList = data.user_fields

					this.applyerFormList.forEach( item => {
						item['isCf'] = false
						if (item.col_id.slice(0, 2) === 'cf') this.cfCnt++
					})
				}
			}
			// 생성일 경우
			else {
				const { result, data } = await api.get('/partners/apply', { bsIdx : idx }).catch( (e) => { console.log(e) })

				if(result === 2000 && data) {
					this.accessCode = data.access_code
					this.emailDomain = data.email_domain
					this.contacts = data.contacts
					this.notice = data.notice
					this.billNotice = data.bill_notice
					this.applyRange = [new Date(this.applyFrDt), new Date(this.applyToDt)]
					this.openYn = data.open_yn ? true : false
					this.limitCnt = data.limit_cnt
					this.applyerFormList = data.user_fields

					this.applyerFormList.forEach( item => {
						item['isCf'] = false
						if (item.col_id.slice(0, 2) === 'cf') this.cfCnt++
					})
				}
			}


			if (this.applyerFormList.length === 0) {
				const col = [
					{
						disp_yn: 1,
						required: 1,
						col_id: 'company',
						title: '소속(회사명)',
						description: '회사명을 입력해주세요.',
						type: 'T',
						opts: null,
						vals: null
					},
					{
						disp_yn: 1,
						required: 1,
						col_id: 'department',
						title: '부서',
						description: '정확한 부서명을 기재해주시기 바랍니다.',
						type: 'T',
						opts: null,
						vals: null
					},
					{
						disp_yn: 1,
						required: 1,
						col_id: 'position',
						title: '직급',
						description: '정확한 직급을 기재해주시기 바랍니다.',
						type: 'T',
						opts: null,
						vals: null
					},
					{
						disp_yn: 1,
						required: 1,
						col_id: 'emp_no',
						title: '사번',
						description: '8자리 사번을 정확하게 기재해주시기 바랍니다.',
						type: 'T',
						opts: null,
						vals: null
					},
					{
						disp_yn: 1,
						required: 1,
						col_id: 'name',
						title: '이름(한글 성명)',
						description: '이름을 입력해주세요.',
						type: 'T',
						opts: null,
						vals: null
					},
					{
						disp_yn: 1,
						required: 1,
						col_id: 'cel',
						title: '전화번호',
						description: '핸드폰 번호를 입력해주세요.',
						type: 'T',
						opts: null,
						vals: null
					},
				]
				this.applyerFormList = col
			}

		},
		sortNumber: function (item, index) {
			item.sort_no = index + 1
			return item.sort_no
		},
		imageSelected: function () {
			this.image = this.$refs.image.files[0]
			if (this.image) {
				this.previewSrc = URL.createObjectURL(this.image)
			}
		},
		imageCancel: function () {
			this.image = null
			this.previewSrc = `https://cdn.tutoring.co.kr/uploads/b2b/site/${bap.site.ci_img}`
		},
		sendNum () {
			let numlist = []
			this.applyerFormList.forEach(el => numlist.push(el.num))
		},
		setForm: _.debounce(async function () {
			if (this.applyFrDt === 'Invalid date' || !this.applyFrDt || this.applyToDt === 'Invalid date' || !this.applyToDt) {
				this.$swal('수강신청 기간을 설정해주세요.')
				return
			}

			const idx = this.$route.params.bIdx ? this.$route.params.bIdx : this.$route.params.baIdx
			const params = {
				applyFrDt: moment(this.applyFrDt).format('YYYY-MM-DD HH:mm'),
				applyToDt: moment(this.applyToDt).format('YYYY-MM-DD HH:mm'),
				openYn: this.openYn ? 1 : 0,
				accessCode: this.accessCode,
				emailDomain: this.emailDomain,
				contacts: this.contacts,
				notice: this.notice,
				billNotice: this.billNotice,
				limitCnt: this.limitCnt
			}
			if (this.$route.params.bIdx) params.bbIdx = idx
			else params.idx = idx

			const applyPageFormParams = []

			for (const [i, col] of this.applyerFormList.entries()) {
				if (!col.title) {
					this.$swal('항목을 모두 채워주세요.')
					return
				}
				applyPageFormParams['cols[' + i + '][dispYn]'] = col.disp_yn ? 1 : 0
				applyPageFormParams['cols[' + i + '][colId]'] = col.col_id
				applyPageFormParams['cols[' + i + '][title]'] = col.title
				applyPageFormParams['cols[' + i + '][description]'] = col.description
				applyPageFormParams['cols[' + i + '][required]'] = col.required ? 1 : 0
				applyPageFormParams['cols[' + i + '][type]'] = col.type
				applyPageFormParams['cols[' + i + '][opts]'] = col.opts
				applyPageFormParams['cols[' + i + '][vals]'] = col.vals
			}
			let res = await api.post('/partners/apply', params)
			applyPageFormParams['baIdx'] = this.$route.params.baIdx ? this.$route.params.baIdx : res.data.idx

			let applyPageFormRes = await api.post('/partners/applyUserField', applyPageFormParams)

			if (res.result === 2000 && applyPageFormRes.result === 2000) {
				this.$swal('성공').then( result => {
					this.$router.push('/batch/list')
				})
			} else {
				this.$swal('실패')
			}
		}, 500),
		addFormList: function () {
			if(this.cfCnt >= 2) {
				this.$swal('최대 2개까지 추가할 수 있습니다.')
			} else {
				this.cfCnt += 1
				let row = {
					col_id: 'cf' + this.cfCnt,
					description: '',
					disp_yn: 0,
					isCf: true,
					opts: null,
					required: 0,
					title: '',
					type: 'T',
					vals: null
				}
				this.applyerFormList.push(row)
			}
		},
		deleteFormList: function (colId) {
			const itemToFind = this.applyerFormList.find(item => {return item.col_id === colId})
			const idx = this.applyerFormList.indexOf(itemToFind)
			if (idx > -1) {
				this.applyerFormList.splice(idx, 1)
				this.cfCnt--
			}
		}
	},
	computed: {
		applyRange: {
			get () {
				return [new Date(this.applyFrDt), new Date(this.applyToDt)]
			},
			set (value) {
				this.applyFrDt = moment(value[0]).format('YYYY-MM-DD HH:mm')
				this.applyToDt = moment(value[1]).format('YYYY-MM-DD HH:mm')
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
