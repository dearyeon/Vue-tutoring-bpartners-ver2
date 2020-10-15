<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="ibox-title title">
        <h2 class="pull-left">신청페이지 관리</h2>
        <router-link :to="{ path: '/register/createPage' }">
          <button class="btn btn-success pull-right">
            페이지 생성하기
          </button>
        </router-link>
      </div>
    </div>
    <div class="row">
      <div class="ibox content">
        <div class="ibox-content">
          <table class="table text-center">
            <thead>
              <tr>
                <th class="text-center">No</th>
                <th class="text-center">고객사</th>
                <th class="text-center">담당자</th>
                <th class="text-center">신청차수</th>
                <th class="text-center">신청양식설정</th>
                <th class="text-center">신청양식수정일자</th>
                <th class="text-center">URL</th>
              </tr>
            </thead>
            <tr v-for="(item, index) in list" :key="`Register-${index}`">
              <td>{{ item.no }}</td>
              <td>
                {{ item.site.company }}
              </td>
              <td>{{ item.site.name }}</td>
              <td>
								<select v-model="item.selectedApplyIdx">
									<option v-for="(apply,i) in item.applys" :value="i">
										{{apply.a_no}}회차 | {{ moment(apply.apply_to_dt).format('YYYY-MM-DD') }} - {{moment(apply.apply_fr_dt).format('YYYY-MM-DD') }}
									</option>
								</select>
							</td>
							<td>
								<button class="btn btn-page-set" @click="routeFormPage(item.applys[item.selectedApplyIdx].idx)">페이지 설정</button>
							</td>
							<td>{{ moment(item.applys[item.selectedApplyIdx].upd_dt).format('YYYY-MM-DD hh:mm:ss') }}</td>
							<td>
								<a @click="copyText($event,index)">https://apply.tutoring.co.kr/{{ item.applys[item.selectedApplyIdx].hash }}</a>
								<div class="alert alert-success no-padding" role="alert" v-show="item.isCopy" :id="'clipBoardAlert'+index">
									<a href="#" class="alert-link">클립보드에 복사되었습니다.</a>
								</div>
							</td>
							<td>
								<button class="btn btn-primary" @click="goToApplyPage(item.applyAdminUrl)">페이지 보러 가기</button>
							</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import api from '@/common/api'
	import Dropdown from '../atom/Dropdown'
	import moment from 'moment'

	export default {
		data () {
			return {
				list: [],
				moment: moment,
				registers: [],
				currentANo: [],
				applyPageLink: ''
			}
		},
		async created () {
			const res = await api.get('/partners/applyPageList')
			const list = res;
			list.forEach(item => {
				item.selectedApplyIdx = 0,
				item.applyAdminUrl = 'https://apply.tutoring.co.kr/'+item.applys[item.selectedApplyIdx].hash+'/7788'
			})
			this.list = list
		},
		methods: {
			chANo: function (index, pick) {
				this.currentANo[index] = pick
			},
			copyText: function (e, index) {
				this.$copyText(e.target.innerText).then((e) => {
					this.registers[index].isCopy = true
					let $targetElement = document.getElementById('clipBoardAlert' + index)
					this.fadeout($targetElement, index)
					console.log(e)
				}, (e) => {
					console.log(e)
				})
			},
			goToApplyPage: function (url) {
				window.open(url, '_blank')
			},
			fadeout: function (element, index) {
				var op = 1  // initial opacity
				var timer = setInterval(() => {
					if (op <= 0.1) {
						clearInterval(timer)
						this.registers[index].isCopy = false
					}
					element.style.opacity = op
					element.style.filter = 'alpha(opacity=' + op * 100 + ')'
					op -= op * 0.1
				}, 50)
			},
			routeFormPage (idx) {
				this.$router.push({
					name: 'setRegisterForm',
					params: { idx: idx }
				})
			},
		},
		components: {
			Dropdown,
		},
	}
</script>

<style scoped>
	.title {
		height: 65px;
	}

	.content {
		padding: 15px;
	}

	.table th,
	.table td {
		padding-bottom: 8px;
	}

	.btn-page-set {
		color: #1e9ed3;
		background-color: #fff;
		border: 1px solid #1e9ed3;
		border-radius: 0px;
		width: 100%;
	}

	.table {
		margin: 0px;
	}
</style>
