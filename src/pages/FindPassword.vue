<template>
	<div class="middle-box loginscreen animated fadeInDown">
		<div class="row">
			<div class="login-box text-center">
				<div class="logo"></div>
				<div class="logo-title">모바일 원어민 회화 1위</div>
				<h2 class="welcome-text">비밀번호 재설정</h2>
				<p>비밀번호를<br />메일로 보내드립니다.</p>
				<br><br><br>
				<div class="form-group">
					<input v-model="email" type="text" name="email" class="form-control" placeholder="이메일 주소" required>
				</div>

				<button type="button" class="btn btn-success block full-width m-b" @click="sendResetpasswordEmail">이메일 보내기</button>
				<button type="button" class="btn btn-outline btn-link" @click="goToLogin">
					<small>로그인으로 돌아가기</small>
				</button>
			</div>

		</div>
		<div class="fixed-bottom text-center">
			<small>&copy;2020<strong>TUTORING</strong> All Rights Reserved.</small>
		</div>
	</div>
</template>


<script>

	import api from '../common/api'
	import modal from '../common/modal'

	export default {
		data() {
			return {
				email:""
			}
		},

		methods: {
			async sendResetpasswordEmail() {
				const res = await api.post('/partners/findPassword',{email: this.email})

				if (res.result === 2000) {
					console.log(res)
					this.$swal.fire({
						title: `해당 이메일로 임시 비밀번호가 <br> 전송 되었습니다. <br><br> 로그인 후 <br>비밀번호를 변경 해주세요.`,
						confirmButtonColor: '#ed5565',
						reverseButtons: true,
					}).then ( r => {
						if(r.isConfirmed) {
							this.$router.push('/login')
						}
					})

				} else {
					modal.simple(res.message)
				}
			},
			goToLogin() {
				this.$router.push('/login');
			}

		},
	}
</script>


<style scoped>
	.loginscreen.middle-box {
		width: 670px;
		max-width: 670px;
		margin: auto;
		padding-top: 150px;
	}

	.logo {
		width: 139.8px;
		height: 23.6px;
		margin: auto;
		background: url(//res.tutoring.co.kr/res/img/b2b/logo.svg) no-repeat;
		background-size: cover;
		background-position: center;
	}

	.logo-title {
		margin-top: 4.8px;
		margin-bottom: 40px;
		font-family: NotoSansCJKkr;
		font-size: 10px;
		font-weight: bold;
		font-style: normal;
		font-stretch: normal;
		line-height: normal;
		letter-spacing: -0.3px;
		color: rgb(200, 200, 200);
	}

	.welcome-text {
		font-weight: bold;
	}

	.login-box {
		width: 320px;
		padding: 40px;
		margin-left: 180px;
		background-color: #ffffff;
		border-radius: 5px;
		float: left;
	}

	.fixed-bottom {
		margin-top: 20px;
	}

	.btn-success {
		background-color: rgb(52, 188, 255);
		border: 0px;
	}
</style>
