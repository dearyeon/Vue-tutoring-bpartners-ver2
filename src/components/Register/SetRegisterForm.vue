<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="ibox-title title">
        <h2 class="pull-left">신청 양식 설정</h2>
        <button class="btn btn-blue-line pull-right" @click="$router.go(-1)">
          뒤로가기
        </button>
      </div>
    </div>
    <div class="row">
      <div class="ibox content">
        <div class="ibox-content">
          <h3 id="step-title">기본 정보</h3>
          <div class="row">
            <div class="col-lg-6">
              <table class="table">
                <tr>
                  <th>BTB 사이트 선택</th>
                  <td><input type="text" class="form-control" :placeholder="company" disabled/></td>
                </tr>
                <tr>
                  <th>이메일 도메인 지정</th>
                  <td><input type="text" class="form-control" placeholder="이메일 도메인을 입력해주세요." v-model="emailDomain"/></td>
                </tr>
                <tr>
                  <th>수료기준 출석률</th>
                  <td><input type="text" class="form-control" placeholder="출석률을 입력해 주세요." v-model="penaltyAttendPct"/></td>
                </tr>
              </table>
            </div>
            <div class="col-lg-6">
              <table class="table">
                <tr>
                  <th>자기 부담금</th>
                  <td><input type="text" class="form-control" placeholder="자기 부담금을 입력해 주세요." v-model="chargeRatePct"/></td>
                </tr>
                <tr style="height:50px;">
                  <th>수강신청기간</th>
                  <td>
                      <datepicker class="col-lg-3" :minimumView="'day'" style="right:15px;" v-model="applyToDt" placeholder="Select Date" />
                      <datepicker class="col-lg-3" v-model="applyFrDt" placeholder="Select Date"/>
                  </td>
                </tr>
                <tr style="height:50px;">
                <th>오픈 여부</th>
                  <td>
                    <div class="switch">
                      <div class="onoffswitch">
                        <input class="onoffswitch-checkbox form-control" name="en_i" id="en_i" type="checkbox" v-model="openYn" />
                        <label class="onoffswitch-label" for="en_i">
                          <span class="onoffswitch-inner"></span>
                          <span class="onoffswitch-switch"></span>
                        </label>
                      </div>
                    </div>  
                  </td>
                </tr>
                
              </table>
            </div>
          </div>

          <h3 id="step-title">1 step. 액세스 홈</h3>
          <div class="row">
            <div class="col-lg-6">
              <table class="table">
                <tr>
                  <th>Access code</th>
                  <td><input type="text" class="form-control" v-model="accessCode" placeholder="Access code를 입력해 주세요." /></td>
                </tr>
                <tr>
                  <th>CI/BI 등록</th>
                  <td>
                    <tr>
                      <td colspan="2">
                        <img :src="preview" alt="업로드 된 이미지" />
                      </td>
                    </tr>
                    <tr>
                      <td class="col-lg-6 col-md-6 col-xs-6">
                        <label class="btn btn-success col-lg-12 col-md-12 col-xs-12" for="file">이미지 변경</label>
                        <input type="file" id="file" accept="image/*" ref="image" @change="imageUpload" />
                      </td>
                      <td class="col-lg-6 col-md-6 col-xs-6">
                        <button class="btn btn-danger col-lg-12 col-md-12 col-xs-12" @click="imageDelete">삭제</button>
                      </td>
                    </tr>
                  </td>
                </tr>
              </table>
            </div>
            <div class="col-lg-6">
              <table class="table">
                <tr>
                  <th style="vertical-align: top; padding-top: 12px; width:20%">수강신청 문의</th>
                  <td>
                    <textarea id="disclaimer" class="form-control" v-model="contacts" style="height:250px"></textarea>
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <h3 id="step-title">2 step. 신청시 주의 사항(수강 신청 브릿지 화면)</h3>
          <table class="table">
            <tr>
              <th class="col-lg-2">
                <strong class="label-w-checkbox">내용</strong>
              </th>
              <td class="col-lg-10">
                <textarea id="disclaimer" class="form-control" v-model="notice"></textarea>
              </td>
            </tr>
          </table>

          <h3 id="step-title">3 step. 개인정보 수집</h3>
          <div class="drag">
            <table class="table table-bordered">
              <thead>
                <th class="text-center col-lg-1">노출여부</th>
                <th class="text-center col-lg-2">항목</th>
                <th class="text-center col-lg-9">질문 내용</th>
              </thead>
              <draggable :list="list" tag="tbody">
                <tr v-for="element in list" :key="element.id">
                  <td class="text-center">
                    <input v-if="element.read" type="checkbox" disabled/>
                    <input v-else type="checkbox" v-model="element.check"/>
                  </td>
                  <td>
                    <input v-if="element.read" type="text" class="form-control" :value="element.value" readonly />
                    <input v-else type="text" class="form-control" v-model="element.value" :placeholder="element.value?'':'항목을 입력해주세요.'"/>
                  </td>
                  <td><input type="text" class="form-control" v-model="element.content" :placeholder="element.placeholder?element.placeholder:'내용을 입력해주세요.'" /></td>
                </tr>
              </draggable>
            </table>
          </div>

          <h3 id="step-title">4 step. 결제시 유의사항</h3>
          <div class="row">
            <div class="col-lg-2">
              <strong class="label-w-checkbox">유의사항</strong>
            </div>
            <div class="col-lg-10">
              <textarea id="disclaimer" class="form-control" v-model="billNotice"></textarea>
            </div>
          </div>
          <div class="pull-right">
            <button class="btn btn-primary" @click="[sendNum(), setForm()]">저장</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import draggable from 'vuedraggable'
import Datepicker from 'vuejs-datepicker'
import moment from "moment"
import api from '@/common/api'
export default {
  data() {
    return {
      image: "",
      preview:
        "https://s3-alpha-sig.figma.com/img/911a/6151/4c7eb8a41cad075d0c95050d0bf9576a?Expires=1602460800&Signature=YuUFI8EGRfBtnq8MZrlqnwUlUuCdjr20SSE3~yMeXS5x9vjpqOsQrK4CyqtuH9d2v7l1VzqCjVDiOHg53SFGHYG5JcsbKoPwdo78yirNBB5DRQBuNmzLAxikSRwV5sel1K9HkMdG5cbxDxtK54piFZuVQMP30MCF271EJkLajk44AyClnXau-pT~mxR6zov1KxaMpdp7tNJyyZwpZXJfRg53-cVIS2Q9Z8Ml6o0LM4JuV5wok5-7g6q4nLhvbhJBgwefVucy2~ehgCwrzNlJX7jcFX8-2DtRqItU5L~Z-2M56VE4p3AwbJspxnJm~~ACwiqk0VpSuLZtQHB5wkGxgQ__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA",
      company: '',
      accessCode: '',
      emailDomain: '',
      contacts: '',
      notice: '',
      billNotice: '',
      chargeRatePct: '',
      penaltyAttendPct: '',
      applyFrDt: '',
      applyToDt: '',
      openYn: false,
      list: [
        {num:0, value:'소속(회사명)', content:'', placeholder:'회사명을 입력해주세요.', read:1, checked:1},
        {num:1, value:'이름', content:'', placeholder:'이름을 입력해주세요.', read:1, checked:1},
        {num:2, value:'연락처', content:'', placeholder:'연락처를 입력해주세요.', read:1, checked:1},
        {num:3, value:'(사내)이메일', content:'', placeholder:'(사내)이메일을 입력해주세요.', read:1, checked:1},
        {num:4, value:'부서', content:'', placeholder:'부서를 입력해주세요.', checked:0},
        {num:5, value:'직위', content:'', placeholder:'직위를 입력해주세요.', checked:0},
        {num:6, value:'사번', content:'', placeholder:'사번을 입력해주세요.', checked:0},
        {num:7, value:'', content:'', checked:0},
        {num:8, value:'', content:'', checked:0},
        {num:9, value:'', content:'', checked:0},
        {num:10, value:'', content:'', checked:0},
        {num:11, value:'', content:'', checked:0}
      ]
    };
  },
  components: {
    draggable, Datepicker
  },
  async created() {
      const res = await api.get('/partners/applyPage', { idx: this.$route.params.idx });
      console.log(res.data);
      this.company = res.data.site.company;
      this.accessCode = res.data.access_code;
      this.emailDomain = res.data.email_domain;
      this.contacts = res.data.contacts;
      this.notice = res.data.notice;
      this.billNotice = res.data.bill_notice;
      this.chargeRatePct = res.data.charge_rate_pct;
      this.penaltyAttendPct = res.data.penalty_attend_pct;
      this.applyFrDt = res.data.apply_fr_dt;
      this.applyToDt = res.data.apply_to_dt;
      this.openYn = res.data.open_yn ? true : false;
  },
  watch: {
    image: function(val) {
      this.preview = URL.createObjectURL(val);
    }
  },
  methods: {
    imageUpload: function() {
      this.image = this.$refs.image.files[0];
    },
    imageDelete: function() {
      this.image = "";
      this.preview =
        "https://s3-alpha-sig.figma.com/img/911a/6151/4c7eb8a41cad075d0c95050d0bf9576a?Expires=1601251200&Signature=gGMNkI8zHURCtidWQDFKLvJGqsKcUdIrZUd3JdBrGzBxWndZmZXAoJpK93nZ37edqjSwuD9EG3F18NctLiN7rX-w0oby8mJquoOA8SMJXieOZbVFR7O~Xn3S~N0Ud8a5IX3YXqHrs9Qky3xrPyqXYDW-ro8WpRZaXIC1dE9Ico9Y6fG45PzOUAkhggVNYGhl8YX121Oup9bsGyvGfonKlFRUNtnz4X9cjwe4OjyYh0K0vfq4P40Q0Qklmxg-~uOjNGRiyMW5w9J6SM-LIchcxaXHoxY43qqFgYl5StkwVSTp1UmX-Fv8CNgFyGnJPYA-cKwfLjsH-vqZWV~HyABA3Q__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA";
    },
    sendNum() {
      let numlist = [];
      this.list.forEach(el => numlist.push(el.num));
      console.log(numlist);
    },
    setForm: async function () {
			const res = await api.post('/partners/applyPage', { 
        idx: this.$route.params.idx, 
        accessCode: this.accessCode,
        emailDomain: this.emailDomain,
        contacts: this.contacts,
        notice: this.notice,
        billNotice: this.billNotice,
        chargeRatePct: this.chargeRatePct ? parseInt(this.chargeRatePct):0,
        penaltyAttendPct: this.penaltyAttendPct ? parseInt(this.penaltyAttendPct):0,
        applyFrDt: moment(this.applyFrDt).format('YYYY-MM-DD HH:mm:ss'),
        applyToDt: moment(this.applyToDt).format('YYYY-MM-DD HH:mm:ss'),
        openYn: this.openYn ? 1:0
      });
      console.log(res);
      const test = await api.get('/partners/applyPage', { idx: this.$route.params.idx });
      console.log(test);
    }
  }
};
</script>

<style>
.title {
  height: 65px;
}
.content {
  padding: 15px;
}
.table th,
.table td,
.table tbody tr td {
  padding-top: 6px;
  border: none;
}
.btn-blue-line {
  color: #1e9ed3;
  background-color: #fff;
  border: 1px solid #1e9ed3;
  border-radius: 0px;
}
#text-area {
  width: 100%;
  height: 150px;
  border: solid 1px #e5e6e7;
  padding-top: 20px;
}
#text-area li {
  line-height: 24px;
}
#step-title {
  margin: 40px auto 20px;
  padding: 12px;
  background-color: #f0f0f0;
}
#step-title:nth-child(1) {
  margin: 0px auto 20px;
}
.save {
  display: flex;
  width: 250px;
  justify-content: space-between;
}
.save .btn {
  width: 100px;
}
.label-w-checkbox {
  margin: 0px;
  padding: 6px 12px;
}
input[type="file"] {
  display: none;
}
img {
  width: 340px;
  height: 240px;
  object-fit: contain;
  background-color: rgba(255, 0, 0, 0.06);
}
#disclaimer {
  height: 300px;
}
</style>
