<template>
	<div class="row">
		<div class="col-sm-6 welcome-box">
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
			<div class="logo-title">모바일 원어민 회화 1위</div>
			<div method="POST" class="m-t" role="form" action="http://partners.tutoring.co.kr/register">
				<input type="hidden" name="_token" value="SnyHyUnOZ5jfec4G4Qet3PK63Ja49wCcXA5ccrYH">
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
			</div>
		</div>
		<div class="brochure-box">
			<div class="row">
				<strong>튜터링은<br>함께하고<br>싶습니다</strong>
			</div>
			<div class="row">
				<a class="btn btn-xs btn-outline btn-brochure" href="http://partners.tutoring.co.kr/pdfViewer" target="_blank">회사 소개서다운로드<div class="down-icon pull-right"></div></a>
			</div>
		</div>
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
