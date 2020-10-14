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
            <tr v-for="(register, index) in registers" :key="`Register-${index}`">
              <td>{{ register.no }}</td>
              <td>
                {{ register.company }}
              </td>
              <td>{{ register.name }}</td>
              <td>
                <Dropdown :defaultValue="aNoList[index][aNoList[index].length - 1]" :itemList="aNoList[index]" />
              </td>
              <td>
                <button class="btn btn-page-set" @click="routeFormPage(index, register.company)">페이지 설정</button>
              </td>
              <td>{{ register.updDt }}</td>
              <td>
	              <a @click="copyText($event,register.siteUrl,index)">{{ register.siteUrl }}</a>
	              <div class="alert alert-success no-padding" role="alert" v-show="register.isCopy" :id="'clipBoardAlert'+index">
		              <a href="#" class="alert-link">클립보드에 복사되었습니다.</a>
	              </div>
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
			res.forEach( item=> {
				let registeredPage = {}
				registeredPage.no = item.no
				registeredPage.idx = item.applys[0].idx
				registeredPage.company = item.site.company
				registeredPage.name = item.site.name
				registeredPage.updDt = item.applys[0].upd_dt
				registeredPage.siteUrl = 'https://apply.tutoring.co.kr/' + item.applys[0].hash
				registeredPage.url = 'https://apply.tutoring.co.kr/' + item.applys[0].hash + '/7788'
		    registeredPage.isCopy = false

				this.registers.push(registeredPage)

			this.aNoList = res.map(register => register.applys.map(item => this.aNoFormat(item)))
			this.currentANo = res.map(() => 0)

		})
	},
  data() {
    return {
      registers: [],
      aNoList: [],
      currentANo: [],
      applyPageLink:''
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
	  copyText: function (e,value,index) {
		  this.$copyText(value).then((e) => {
		    this.registers[index].isCopy = true
				let $targetElement = document.getElementById('clipBoardAlert'+index)
				this.fadeout($targetElement,index)
				console.log(e)
		  }, (e) => {
			  console.log(e)
		  })
	  },
	  goToApplyPage: function (url) {
		  window.open(url, '_blank')
	  },
	  fadeout: function (element,index) {
		  var op = 1  // initial opacity
		  var timer = setInterval( () => {
			  if (op <= 0.1) {
				  clearInterval(timer)
					this.registers[index].isCopy = false
			  }
			  element.style.opacity = op
			  element.style.filter = 'alpha(opacity=' + op * 100 + ')'
			  op -= op * 0.1
      }, 50)
    },
    routeFormPage(index,name) {
      this.$router.push({
        name: 'setRegisterForm' ,
        params: { idx: index+1, company: name }
      })
    },
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
