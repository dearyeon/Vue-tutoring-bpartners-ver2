<template>
	<div class="row">
		<div class="col-lg-12">
			<div class="ibox-title title">
				<h2 class="pull-left">고객사 설정</h2>
				<button class="btn btn-blue-line pull-right" @click="$router.go(-1)">
					뒤로가기
				</button>
			</div>
		</div>
		<div class="row">
			<div class="ibox content">
				<div class="ibox-content">
					<div class="form-group">
						<h3 class="well">고객사 정보 입력</h3>
						<div class="row">
							<div class="col-lg-6">
								<table class="table">
									<tr>
										<th>고객사 명</th>
										<td><input type="text" class="form-control" v-model="company" placeholder="고객사 명을 입력해 주세요."/></td>
									</tr>
									<tr>
										<th>담당자 이름</th>
										<td><input type="text" class="form-control" v-model="name" placeholder="담당자 이름을 입력해 주세요."/></td>
									</tr>
									<tr>
										<th>CI/BI 등록</th>
										<td>
											<table>
												<tr>
													<td colspan="2">
														<img :src="previewSrc" alt="업로드 된 이미지"/>
													</td>
												</tr>
												<tr>
													<td class="col-lg-6 col-md-6 col-xs-6">
														<label class="btn btn-success col-lg-12 col-md-12 col-xs-12" for="file">이미지 변경</label>
														<input type="file" id="file" accept="image/*" ref="image" @change="imageSelected"/>
													</td>
													<td class="col-lg-6 col-md-6 col-xs-6">
														<button class="btn btn-danger col-lg-12 col-md-12 col-xs-12" @click="imageCancel">취소
														</button>
													</td>
												</tr>
											</table>
										</td>
									</tr>
								</table>
							</div>
							<div class="col-lg-6">
								<table class="table">
									<tr>
										<th>부서</th>
										<td><input type="text" class="form-control" v-model="part" placeholder="부서를 입력해 주세요."/></td>
									</tr>
									<tr>
										<th>전화번호</th>
										<td><input type="text" class="form-control" placeholder="전화번호를 입력해주세요." v-model="tel"/></td>
									</tr>
									<tr>
										<th>이메일</th>
										<td><input type="text" class="form-control" placeholder="이메일을 입력해주세요." v-model="email"/></td>
									</tr>
								</table>

								<hr class="m-t-xl m-b-xl"/>

								<table class="table">
									<tr>
										<th>쿠폰 등록</th>
										<td><input type="text" class="form-control" placeholder=""/></td>
									</tr>
									<tr>
										<th>기업 도메인</th>
										<td><input type="text" class="form-control" placeholder=""/></td>
									</tr>
									<tr>
										<th>지정사용자</th>
										<td><input type="text" class="form-control" placeholder="" /></td>
									</tr>
									<tr>
										<th>쿠폰지급기간</th>
										<td><input type="text" class="form-control" placeholder="" /></td>
									</tr>
								</table>
							</div>
						</div>
					</div>

					<div class="col-xs-4 pull-right p-h-xl">
						<button class="col-xs-12 btn btn-lg btn-primary" @click="setForm">저장</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import api from '@/common/api'
export default {
    data() {
        return {
            company: '',
            name: '',
            part: '',
            tel: '',
            email: '',
            previewSrc: '',
            image: '',
			ciImg: ''
        }
    },
    async created() {
        if (this.$route.params.idx) {
            const res = await api.get('/partners/site', { idx : this.$route.params.idx })
            const site = res.data;
            this.company = site.company;
            this.name = site.name;
            this.part = site.part;
            this.tel = site.tel;
            this.email = site.email;
            this.ciImg = site.ci_img;
            this.previewSrc = this.$shared.getSiteImgUrl(this.ciImg)
        } else {
            this.previewSrc = this.$shared.getSiteImgUrl(this.ciImg)
        }
    },
    methods: {
        imageSelected: function() {
            this.image = this.$refs.image.files[0];
            if(this.image) {
                this.previewSrc = URL.createObjectURL(this.image);
            }
        },
        imageCancel: function() {
            this.image = null;
            this.previewSrc = this.$shared.getSiteImgUrl(this.ciImg)
        },
        async setForm() {
            const params = {
                company: this.company?this.company:'',
                name: this.name?this.name:'',
                part: this.part?this.part:'',
                tel: this.tel?this.tel:'',
                email: this.email?this.email:'',
                ciImg: this.image?this.image:''
            }
            if(this.$route.params.idx) params['idx'] = this.$route.params.idx
            let res;
            if(this.company) {
                res = await api.upload('/partners/site', params);
            } else {
                this.$swal('고객사 명을 입력해주세요.');
                return;
            }
            if( res.result === 2000 ) {
                this.$swal('성공').then(result => {
				    this.$router.push({name: "siteList"})
		    	})
            } else {
                this.$swal('실패!');
            }
        }
    }
}
</script>
