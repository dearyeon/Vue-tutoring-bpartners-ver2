<template>
<div class="body-bg">
    <div class="middle-box loginscreen animated fadeInDown">
        <div class="row">
            <div class="col-sm-6 welcome-box text-center">
                <h2 class="welcome-text">B2B 파트너 신청</h2>
                <p>신청 프로세스를 알려드립니다.</p>
                <br><br>
                <div class="row step-box">
                    <div class="step-title">1</div>
                    <div>
                        주요 정보를 입력 후,<br>
                        파트너 신청을 완료해 주세요.
                    </div>
                </div>
                <div class="row step-box">
                    <div class="step-title">2</div>
                    <div>
                        제휴 안내서와 함께<br>
                        3일 내에 답신을 드리겠습니다.
                    </div>
                </div>
                <div class="row step-box">
                    <div class="step-title">3</div>
                    <div>
                        인원 규모 및 기간에 따라,<br>
                        다양한 제휴 옵션을 선택하실 수 있습니다.
                    </div>
                </div>
                <div class="row step-box">
                    <div class="step-title">4</div>
                    <div>
                        모든 구성원들의  수업 내역은<br>
                        대시보드를 통해 실시간 확인 가능합니다.
                    </div>
                </div>
                <div class="row step-box">
                    <div class="step-title">5</div>
                    <div>
                        지금 튜터링의 다양한,<br>
                        B2B 제휴 혜택을 확인해보세요 !
                    </div>
                </div>
            </div>
            <div class="col-sm-6 login-box">
                <div class="logo"></div>
                <div class="logo-title text-center">모바일 원어민 회화 1위</div>
                <form method="POST" class="m-t" role="form" action="https://dev-partners.tutoring.co.kr/register">
                    <input type="hidden" name="_token" value="4mB3sjQDvpzy8tfQwm05PJhKjTw1dl8hjFiiMFau">
                    <div class="form-group">
                        <input type="text" name="name" class="form-control" placeholder="담당자명" required="">
                    </div>
                    <div class="form-group">
                        <input type="text" name="tel" class="form-control" placeholder="연락처" required="">
                    </div>
                    <div class="form-group">
                        <input type="text" name="email" class="form-control" placeholder="이메일주소" required="">
                    </div>
                    <div class="form-group">
                        <input type="text" name="company" class="form-control" placeholder="회사명/근무 부서" required="">
                    </div>
                    <div class="form-group">
                        <input type="text" name="position" class="form-control" placeholder="직책" required="">
                    </div>

                    <button type="submit" class="btn btn-success block full-width m-b">신청완료</button>
                </form>
            </div>
            <div class="brochure-box text-center">
                <div class="row">
                    <strong>튜터링은<br>함께하고<br>싶습니다</strong>
                </div>
                <div class="row">
                    <a class="btn btn-xs btn-outline btn-brochure" href="https://dev-partners.tutoring.co.kr/pdfViewer" target="_blank">회사 소개서다운로드<div class="down-icon pull-right"></div></a>
                </div>
            </div>
        </div>
        <div class="fixed-bottom text-center">
            <small>©2018<strong>TUTORING</strong> All Rights Reserved.</small>
        </div>
    </div>
	<!--<link href="/template/admin/css/bootstrap.min.css" rel="stylesheet">
    <link href="/template/admin/font-awesome/css/font-awesome.css" rel="stylesheet">
    <link href="/template/admin/css/animate.css" rel="stylesheet">
    <link href="/template/admin/css/style.css" rel="stylesheet">-->
</div>
</template>

<script>

	export default {
		data() {
			return {

			}
		},
		async created() {

		},
		methods: {

		}
	}
</script>


<style scoped>
/*@import '/template/admin/css/bootstrap.min.css';*/
/*@import '/template/admin/font-awesome/css/font-awesome.css';*/
/*@import '/template/admin/css/animate.css';*/
/*@import '/template/admin/css/style.css';*/
.body-bg {
	background-color: rgb(47, 64, 79);
}
.loginscreen.middle-box{
	width : 700px;
	max-width : 700px;
	margin: auto;
	padding-top : 150px;
}

.logo{
	width:139.8px;
	height: 23.6px;
	margin:auto;
	background: url(//res.tutoring.co.kr/res/img/b2b/logo.svg) no-repeat;
	background-size: cover;
	background-position: center;
}

.logo-title{
	margin-top : 4.8px;
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
.welcome-text{
	font-weight:bold;
	margin:0px;

}

.welcome-box{
	width:260px;
	height:420px;
	padding-left: 0px;
	text-align: left;
	font-size: 10px;
	color:rgb(255, 255, 255);
	background-color: rgb(52, 188, 255);
	padding:30px 10px;
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
}

.step-box{
	margin : 20px 5px 0;
}

.step-title{
	float: left;
	font-size: 30px;
	font-weight: bold;
	vertical-align: text-top;
	margin-right:10px;
	margin-top : -10px;
}

.login-box{
	width:260px;
	height:420px;
	padding:30px;
	margin-left:0px;
	background-color: #ffffff;
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
	float:left;
}
.brochure-box{
	position: absolute;
	margin-top : 250px;
	width: 169px;
	height: 169px;
	border-radius: 10px;
	border-top-left-radius: 80px;
	padding : 20px;
	font-size: 22px;
	background-color: rgb(38, 57, 73);
  	display: inline;
	float: left;
}
.fixed-bottom {
	margin-top:20px;
}

.btn-brochure{
	color : rgb(168, 168, 168);
	border: 1px solid;
	display: flex;
}
.btn-brochure:hover{
	color : white;
}

.down-icon{
	margin-left:13.7px;
	width: 10.8px;
	height: 13.7px;
	background: url(//res.tutoring.co.kr/res/img/b2b/shape.svg) no-repeat;
	background-size: cover;
	background-position: center;
}

.btn-password{
	color:rgb(182, 182, 182);
}

.btn-success{
	background-color: rgb(52, 188, 255);
	border : 0px;
}
</style>