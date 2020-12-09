<template>
    <div class="row">
		<div class="col-lg-12">
			<div class="ibox-title title">
				<h2 class="pull-left">{{ company+' '+b_no }}차 단건 신청</h2>
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
						</div>
						<div class="row">
							<div class="col-md-offset-1 col-lg-4">
								<table class="table">
									<tr>
										<th>이메일</th>
										<td style="display:flex">
											<input type="text" class="form-control" placeholder="이메일을 입력해 주세요." v-model="email" :readonly="emailCheck"/>
											<button class="btn btn-default" @click="checkUser" :disabled="emailCheck">불러오기</button>
										</td>
									</tr>
									<tr>
										<th>이름</th>
										<td><input type="text" class="form-control" placeholder="이름을 입력해 주세요." v-model="name"/></td>
									</tr>
									<tr>
										<th>연락처</th>
										<td>
											<input type="text" class="form-control" placeholder="연락처를 입력해 주세요." v-model="cel"/>
										</td>
									</tr>
									<tr>
										<th>cf1</th>
										<td>
											<input type="text" class="form-control" placeholder="cf1을 입력해 주세요." v-model="cf1"/>
										</td>
									</tr>
									<tr>
										<th>cf2</th>
										<td>
											<input type="text" class="form-control" placeholder="cf2를 입력해 주세요." v-model="cf2"/>
										</td>
									</tr>
								</table>
							</div>
							<div class="col-md-offset-2 col-lg-4">
								<table class="table">
									<tr>
										<th>소속(회사)</th>
										<td><input type="text" class="form-control" placeholder="소속을 입력해 주세요." v-model="affiliation"/></td>
									</tr>
									<tr>
										<th>부서</th>
										<td><input type="text" class="form-control" placeholder="부서를 입력해 주세요." v-model="department"/></td>
									</tr>
									<tr>
										<th>직급</th>
										<td>
											<input type="text" class="form-control" placeholder="직급을 입력해 주세요." v-model="position"/>
										</td>
									</tr>
									<tr>
										<th>사번</th>
										<td><input type="text" class="form-control" placeholder="사번을 입력해 주세요." v-model="empNo"/></td>
									</tr>
								</table>
							</div>
						</div>
					</div>
					<div class="hr-line-dashed"></div>
					<div class="form-group">
						<h3 class="well">수강권 선택</h3>
						<div class="row">
							<div class="col-xs-4">
								<strong class="col-xs-12">수강권 선택</strong>
								<select class="col-xs-12" style="font-size:15px" @change="SelectedGoods($event)">
									<option value="">-- 수강권을 선택하세요. --</option>
									<option v-for="(item,index) in goods" :key="index" :value="item.charge_plan.idx">{{item.charge_plan.title}}</option>
								</select>
							</div>
						</div>
					</div>
					<div class="col-xs-6 pull-right p-h-xl">
						<button class="pull-right col-xs-3 col-xs-offset-1 btn btn-lg btn-primary" @click="setIndivApply" :disabled="isDisabled()">저장</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import api from '@/common/api'

	export default {
		data () {
			return {
				company: '',
				b_no: '',
				goods: [],
				name: '',
				email: '',
				emailCheck: false,
				cel: '',
				affiliation: '',
				department: '',
				position: '',
				empNo: '',
				cpIdx: '',
				cf1: '',
				cf2: '',
				callEmail: false,
			}
		},
		created () {
			this.refresh()
		},
		methods: {
			async refresh () {
				const res = await api.get('/partners/batch', { idx: this.$route.params.bbIdx })
				const data = res.data
				this.company = data.site.company
				this.b_no = data.b_no
				this.goods = data.goods
				console.log(this.goods)
			},
			SelectedGoods (event) {
				this.cpIdx = event.target.value
			},
			async setIndivApply () {
				const form = {
					bbIdx: this.$route.params.bbIdx,
					email: this.email,
					cpIdx: this.cpIdx,
					name: this.name,
					company: this.affiliation,
					department: this.department,
					position: this.position,
					empNo: this.empNo,
					cel: this.cel,
					cf1: this.cf1,
					cf2: this.cf2
				}
				if (!this.calEmail) {
					this.$swal.fire({
						title: '신청 실패',
						text: '이메일을 조회해 주세요.',
						icon: 'warning',
						confirmButtonText: 'OK',
						confirmButtonColor: '#ed5565',
					})
				} else if (!this.email || !this.name || !this.cpIdx) {
					this.$swal.fire({
						title: '신청 실패',
						text: '이메일, 이름, 수강권은 필수 항목 입니다.',
						icon: 'warning',
						confirmButtonText: 'OK',
						confirmButtonColor: '#ed5565',
					})
				} else {
					const res = await api.post('/partners/importApply', form)
					if (res.result === 2000) {
						this.$swal.fire({
							title: '단건 신청이 완료 되었습니다.',
							confirmButtonText: 'OK',
							confirmButtonColor: '#ed5565',
						})
						this.$router.go(-1)
					} else if (res.result === 1000) {
						this.$swal.fire({
							title: res.message,
							text: res.data.errMsg,
							icon: 'warning',
							confirmButtonText: 'OK',
							confirmButtonColor: '#ed5565',
						})
					}
				}
			},
			async checkUser () {
				if (!this.email) {
					this.$swal.fire({
						title: '이메일을 입력하세요.',
						icon: 'warning',
						confirmButtonText: 'OK',
						confirmButtonColor: '#ed5565',
					})
					return
				}
				this.calEmail = true
				const res = await api.get('/partners/checkUser', { email: this.email }).catch(e => {
					console.log('error checkUser : ' + e)
				})
				if (res.result === 2000) {
					const data = res.data
					this.name = data.name
					// 승인된 유저의 경우 이메일 정보가 없음. => input에 email을 입력값 그대로 read only 로 해야함.
					this.cel = data.cel
					this.affiliation = data.company
					this.department = data.department
					this.position = data.position
					this.empNo = data.emp_no
					this.cf1 = data.cf1
					this.cf2 = data.cf2

					this.emailCheck = true
				} else {
					this.$swal(res.message)
				}

			},
			isDisabled () {
				if (this.email && this.name && this.cpIdx) return false
				else return true
			}
		}
	}
</script>

<style scoped>

</style>