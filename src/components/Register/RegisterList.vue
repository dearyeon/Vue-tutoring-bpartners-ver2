<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="ibox-title title">
        <h2 class="pull-left">신청페이지 관리</h2>
        <router-link :to="{ path: '/createPage' }">
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
            <tr v-for="(register, index) in registers" :key="`Register-${index}`">
              <td>{{ register.idx }}</td>
              <td>
                {{ register.company }}
              </td>
              <td>{{ register.name }}</td>
              <td>
                <Dropdown :defaultValue="aNoList[index][aNoList[index].length - 1]" :itemList="aNoList[index]" />
              </td>
              <td>
                <router-link :to="{ path: '/setRegisterForm' }">
                  <button class="btn btn-page-set">페이지 설정</button>
                </router-link>
              </td>
              <td>{{ register.updDt }}</td>
              <td>
                <a @click="copyText($event,register.siteUrl)">{{ register.siteUrl }}</a>
              </td>
              <td>
                <button class="btn btn-primary" @click="goToApplyPage(register.url)">페이지 보러 가기</button>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/common/api";
import Dropdown from "../atom/Dropdown";

export default {
	async created () {
		const res = await api.get('/partners/applyPageList')
		if (res.result === 2000) {
			res.forEach(item => {
				let registeredPage = {}
				registeredPage.idx = item.applys[0].idx
				registeredPage.company = item.site.company
				registeredPage.name = item.site.name
				registeredPage.updDt = item.applys[0].upd_dt
				registeredPage.siteUrl = 'https://apply.tutoring.co.kr/' + item.applys[0].hash
				registeredPage.url = 'https://apply.tutoring.co.kr/' + item.applys[0].hash + '/7788'

				this.registers.push(registeredPage)

			})
			this.aNoList = res.map(register => register.applys.map(item => this.aNoFormat(item)))
			this.currentANo = res.map(() => 0)
		} else {
			console.log(res.message)
		}

	},
  data() {
    return {
      registers: [],
      aNoList: [],
      currentANo: [],
      applyPageLink:'',
    };
  },
  methods: {
    aNoFormat: function(item) {
      if (typeof item === "object" && "a_no" in item)
        return `${item.a_no}회차 | ${item.apply_fr_dt.replace(
          /(\d{4}-\d{2}-\d{2}).*/,
          "$1",
        )} ~ ${item.apply_to_dt.replace(/(\d{4}-\d{2}-\d{2}).*/, "$1")}`;
      else return "";
    },
    chANo: function(index, pick) {
      this.currentANo[index] = pick;
    },
    copyText: function (e,value) {

			let tempElem = document.createElement('textarea')
			tempElem.value = value
			document.body.appendChild(tempElem)

			tempElem.select()
			document.execCommand('copy')
			document.body.removeChild(tempElem)
    },
		goToApplyPage: function (url) {
			window.open(url, '_blank');
		}
  },
  components: {
    Dropdown,
  },
};
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
