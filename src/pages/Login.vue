<template>
	<div class="middle-box loginscreen animated fadeInDown">
		<div class="row">
			<div class="login-box text-center">
				<div class="logo"></div>
				<div class="logo-title">모바일 원어민 회화 1위</div>
				<h2 class="welcome-text">어서오세요!</h2>
				<p>B2B 파트너사이트에 오신 것을 환영합니다.</p>
				<br><br><br>
				<div class="form-group">
					<input v-model="id" type="text" name="email" class="form-control" placeholder="ID" required>
				</div>
				<div class="form-group">
					<input v-model="pw" type="password" name="password" class="form-control" placeholder="PASSWORD" required
						   v-on:keyup.enter="loginSubmit"
					/>
				</div>
				<button type="submit" class="btn btn-success block full-width m-b" v-on:click="loginSubmit">로그인</button>
        <button type="button" class="btn btn-outline btn-link" @click="goToFindPassword">
          <small>비밀번호를 잊으셨습니까?</small>
        </button>
        <br>
<!--        <button class="btn btn-sm btn-white btn-block" @click="goToRegister" >B2B 파트너 신청하기</button>-->
			</div>
			<div class="brochure-box">
				<div class="row text-center">
					<strong>튜터링은<br>함께하고<br>싶습니다</strong>
				</div>
				<div class="row">
					<a class="btn btn-xs btn-outline btn-brochure" href="https://res.tutoring.co.kr/res/pdf/Tutoring_brochure.pdf" target="_blank">
						회사 소개서다운로드
						<div class="down-icon pull-right"></div>
					</a>
				</div>
			</div>
		</div>
		<div class="fixed-bottom text-center">
			<small>&copy;2020<strong>TUTORING</strong> All Rights Reserved.</small>
		</div>
	</div>
</template>


<script>
import api from "@/common/api";
import shared from "@/common/shared";

export default {
	data() {
		return {
			id: '',
			pw: ''
		}
	},

	methods: {
		async loginSubmit() {
			const res = await api.post('/partners/login', {id: this.id, pw: this.pw})

			if (res.result == 1000 || !res.data) {
				alert('로그인 실패')
			} else {
				shared.setToken(res.data.bast)

				const me = res.data.account
				shared.setAccount(me)
				if(me.needChangePw) {
					this.$router.push('/account')
				}else {
					this.$router.push('/main')
				}
			}
		},
		goToRegister() {
			this.$router.push('/register')
		},
		goToFindPassword() {
			this.$router.push('/findPass')
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

.brochure-box {
	position: absolute;
	margin-top: 320px;
	width: 169px;
	height: 169px;
	border-radius: 10px;
	border-top-left-radius: 80px;
	padding: 20px;
	font-size: 22px;
	background-color: rgb(38, 57, 73);
	display: inline;
	float: left;
}

.fixed-bottom {
	margin-top: 20px;
}

.btn-brochure {
	color: rgb(168, 168, 168);
	border: 1px solid;
	display: flex;
}

.btn-brochure:hover {
	color: white;
}

.down-icon {
	margin-left: 13.7px;
	width: 10.8px;
	height: 13.7px;
	background: url(//res.tutoring.co.kr/res/img/b2b/shape.svg) no-repeat;
	background-size: cover;
	background-position: center;
}

.btn-password {
	color: rgb(182, 182, 182);
}

.btn-success {
	background-color: rgb(52, 188, 255);
	border: 0px;
}
</style>
