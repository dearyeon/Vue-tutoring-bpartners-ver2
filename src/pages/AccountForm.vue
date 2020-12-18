<template>
    <div class="row">
		<div class="col-lg-12">
			<div class="ibox-title title">
				<h2 class="pull-left">계정 {{$route.params.idx?'수정':'등록'}}</h2>
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
							<h3 class="col-xs-2 no-margins">계정 정보</h3>
						</div>
						<div class="row">
							<div class="col-md-offset-1 col-lg-4">
								<table class="table">
									<tr>
										<th>ID</th>
										<td><input type="text" class="form-control" placeholder="ID를 입력해 주세요." v-model="id"/></td>
									</tr>
									<tr>
										<th>이름</th>
										<td><input type="text" class="form-control" placeholder="이름을 입력해 주세요." v-model="name"/></td>
									</tr>
									<tr>
										<th>이메일</th>
										<td><input type="text" class="form-control" placeholder="이메일을 입력해 주세요." v-model="email"/></td>
									</tr>
									<tr>
										<th>연락처</th>
										<td><input type="text" class="form-control" placeholder="연락처를 입력해 주세요." v-model="tel"/></td>
									</tr>
								</table>
							</div>
							<div class="col-md-offset-2 col-lg-4">
								<table class="table">
                                    <tr>
										<th>권한</th>
										<td>
                                            <select class="col-xs-12" style="font-size:15px" v-model="acc_level" @change="SelectedAuthority($event)">
                                                <option value="">-- 선택하세요. --</option>
                                                <option value="S">사이트관리자</option>
                                                <option value="P">리셀러</option>
                                                <option value="V" v-if="$route.params.idx">슈퍼바이저</option>
                                            </select>
                                        </td>
									</tr>
									<tr v-show="acc_level==='S'">
										<th>사이트</th>
										<td>
                                            <select class="col-xs-12" style="font-size:15px" @change="SelectedCompany($event)">
                                                <option value="">-- 선택하세요. --</option>
                                                <option v-for="(site,index) in sites" :key="index" :value="site.idx">{{site.company}}</option>
                                            </select>
										</td>
									</tr>
									<tr v-show="acc_level==='P'">
										<th>파트너</th>
										<td>
                                            <select class="col-xs-12" style="font-size:15px" @change="SelectedCompany($event)">
                                                <option value="">-- 선택하세요. --</option>
                                                <option v-for="(partner,index) in partners" :key="index" :value="partner.idx">{{partner.company}}</option>
                                            </select>
										</td>
									</tr>
								</table>
							</div>
						</div>
					</div>
					<div class="col-xs-12  p-h-xl">
                        <div v-if="$route.params.idx">
						<button class="pull-left btn btn-primary" @click="accountPwReset">비밀번호 초기화</button>
                        <button class="pull-left btn btn-primary" style="margin-left:10px" @click="accountRemove">계정삭제</button>
                        </div>
                        <button class="pull-right col-xs-2 btn btn-success" @click="save">수정</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import api from '@/common/api'
import modal from "@/common/modal.js";

export default {
    data () {
        return {
            id: '',
            name: '',
            siteIdx: '',
            email: '',
            tel: '',
            authority: '',
            acc_level: '',
            bp_idx: '',
            bs_idx: '',
            sites: [],
            partners: []
        }
    },
    async created () {
        console.log(this.$route.params.idx)
        if(this.$route.params.idx) {
            const res = await api.get('/partners/account', { idx:this.$route.params.idx })
            const data = res.data
            this.id = data.id
            this.name = data.name
            this.email = data.email
            this.tel = data.tel
            this.acc_level = data.acc_level
            this.bp_idx = data.bp_idx
            this.bs_idx = data.bs_idx
        }
        this.refresh()
    },
    methods: {
        async refresh () {
            const res1 = await api.get('/partners/siteSelectList')
            const res2 = await api.get('/partners/partnerSelectList')
            this.sites = res1.data
            this.partners = res2.data
        },
        SelectedAuthority (event) {
            this.acc_level = event.target.value
            console.log(this.acc_level)
        },
        SelectedCompany (event) {
            this.siteIdx = event.target.value
            console.log(this.siteIdx)
        },
        accountRemove() {
            this.$swal.fire({
					title: `<strong>정말로 계정을 삭제하시겠습니까?</strong>`,
					icon: 'warning',
					confirmButtonText: '삭제',
					confirmButtonColor: '#ed5565',
					cancelButtonText: '닫기',
					cancelButtonColor: '#808080',
					showCancelButton: true,
					reverseButtons: true,
				}).then(async (r) => {
					if (r.isConfirmed) {
                        const {result, data} = await api.get('/partners/accountRemove', {idx: this.$route.params.idx})
                        if (result === 2000) {
                            this.$swal.fire({
                                title: '계정을 삭제하였습니다.',
                                confirmButtonText: '확인',
                                confirmButtonColor: '#ed5565'
                            }).then(async (r) => {
                                if (r.isConfirmed) {
                                    this.$router.go(-1)
                                }
                            })
                        } else if (result === 1000) {
					        modal.simple('계정 삭제에 실패하였습니다.')
                        }
					}
				})
        },
        accountPwReset() {
            this.$swal.fire({
					title: `<strong>비밀번호를 초기화 하시겠습니까?</strong>`,
					icon: 'warning',
					confirmButtonText: '초기화',
					confirmButtonColor: '#ed5565',
					cancelButtonText: '닫기',
					cancelButtonColor: '#808080',
					showCancelButton: true,
					reverseButtons: true,
				}).then(async (r) => {
					if (r.isConfirmed) {
                        const {result, data} = await api.get('/partners/accountPwReset', {idx: this.$route.params.idx})
                        if (result === 2000) {
                            this.$swal.fire({
                                title: '비밀번호를 초기화 하였습니다.',
                                confirmButtonText: '확인',
                                confirmButtonColor: '#ed5565'
                            }).then(async (r) => {
                                if (r.isConfirmed) {
                                    this.$router.go(-1)
                                }
                            })
                        } else if (result === 1000) {
					        modal.simple('비밀번호를 초기화에 실패하였습니다.')
                        }
					}
				})
        },
        save() {
            this.$swal.fire({
					title: `<strong>수정 하시겠습니까?</strong>`,
					icon: 'warning',
					confirmButtonText: '수정',
					confirmButtonColor: '#ed5565',
					cancelButtonText: '닫기',
					cancelButtonColor: '#808080',
					showCancelButton: true,
					reverseButtons: true,
				}).then(async (r) => {
					if (r.isConfirmed) {
                        let params = { 
                            name:this.name,
                            email:this.email,
                            tel:this.tel,
                            accLevel:this.acc_level
                        }
                        if (this.$route.params.idx) {
                            params.idx=this.$route.params.idx
                        }
                        if (this.acc_level==='S') {
                            params.bsIdx =this.bs_idx
                        }                        
                        if (this.acc_level==='P') {
                            params.bpIdx =this.bp_idx
                        }
                        console.log('test:',params)
                        const {result, data} = await api.post('/partners/account', params)
                        if (result === 2000) {
                            this.$swal.fire({
                                title: '수정하였습니다.',
                                icon: 'success',
                                confirmButtonText: '확인',
                                confirmButtonColor: '#ed5565'
                            }).then(async (r) => {
                                if (r.isConfirmed) {
                                    this.$router.go(-1)
                                }
                            })
                        } else if (result === 1000) {
					        modal.simple('수정에 실패하였습니다.')
                        }
					}
				})
        }
    }
}
</script>

<style scoped>

</style>