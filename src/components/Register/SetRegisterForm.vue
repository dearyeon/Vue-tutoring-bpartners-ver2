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
                <tr>
                  <th>자기 부담금</th>
                  <td>
                    <input type="text" class="form-control" placeholder="자기 부담금을 입력해 주세요." v-model="chargeRatePct"/>
                  </td>
                </tr>
              </table>
            </div>
            <div class="col-lg-6">
              <table class="table">
                <tr style="height:50px;">
	                <table>
		                <tr>
			                <th>수강신청기간</th>
			                <td>
				                <date-picker v-model="applyRange" type="datetime" range placeholder="Select date"></date-picker>
			                </td>
		                </tr>
	                </table>
                </tr>
                <tr>
	                <table>
		                <tr style="height:50px;">
		                  <th>오픈 여부</th>
		                  <td>
		                    <div class="switch">
		                      <div class="onoffswitch">
		                        <input class="onoffswitch-checkbox form-control" name="open_yn" id="open_yn" type="checkbox" v-model="openYn" />
		                        <label class="onoffswitch-label" for="open_yn">
		                          <span class="onoffswitch-inner"></span>
		                          <span class="onoffswitch-switch"></span>
		                        </label>
		                      </div>
		                    </div>
		                  </td>
		                </tr>
	                </table>
                </tr>
	              <tr>
		              <table>
			              <tr style="height:50px;">
				              <th>결제 여부</th>
				              <td>
					              <div class="switch">
						              <div class="onoffswitch">
							              <input class="onoffswitch-checkbox form-control" name="use_billing" id="use_billing" type="checkbox" v-model="useBilling" />
							              <label class="onoffswitch-label" for="use_billing">
								              <span class="onoffswitch-inner"></span>
								              <span class="onoffswitch-switch"></span>
							              </label>
						              </div>
					              </div>
				              </td>
			              </tr>
		              </table>
	              </tr>
	              <tr>
		              <table>
			              <tr v-show="useBilling">
				              <td>
				                <label for="chargeDay">정기 결제일</label><br/>
					              <date-picker v-for="index in billingCnt" :key="index.id" id="chargeDay" name="chargeDay" v-model="chargeDay[index-1]" type="datetime" placeholder="Select date"></date-picker>
                      </td>
				              <td>
					              <label for="pChargeDay">추가 결제일</label><br/>
					              <date-picker v-for="index in billingCnt" :key="index.id" id="pChargeDay" name="pChargeDay" v-model="pChargeDay[index-1]" type="datetime" placeholder="Select date"></date-picker>
                      </td>
			              </tr>

		              </table>
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
	                  <table>
	                    <tr>
	                      <td colspan="2">
	                        <img :src="previewSrc" alt="업로드 된 이미지" />
	                      </td>
	                    </tr>
	                    <tr>
	                      <td class="col-lg-6 col-md-6 col-xs-6">
	                        <label class="btn btn-success col-lg-12 col-md-12 col-xs-12" for="file">이미지 변경</label>
	                        <input type="file" id="file" accept="image/*" ref="image" @change="imageSelected" />
	                      </td>
	                      <td class="col-lg-6 col-md-6 col-xs-6">
	                        <button class="btn btn-danger col-lg-12 col-md-12 col-xs-12" @click="imageCancel">취소</button>
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
                  <th style="vertical-align: top; padding-top: 12px; width:20%">수강신청 문의</th>
                  <td>
                    <textarea class="form-control" v-model="contacts" style="height:250px"></textarea>
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
                <textarea class="form-control" v-model="notice" style="height:250px"></textarea>
              </td>
            </tr>
          </table>

          <h3 id="step-title">3 step. 개인정보 수집</h3>
          <div class="drag">
            <table class="table table-bordered">
              <thead>
	              <th class="text-center">순서</th>
                <th class="text-center">노출여부</th>
                <th class="text-center">필수입력</th>
                <th class="text-center ">항목</th>
                <th class="text-center">질문 내용</th>
                <th class="text-center">타입</th>
              </thead>
              <draggable :list="list" tag="tbody">
                <tr v-for="(item,index) in list" :key="item.col_id">
	                <td class="text-center">
		                {{sortNumber(item,index)}}
	                </td>
                  <td class="text-center">
                    <input v-model="item.disp_yn" type="checkbox" :checked="item.disp_yn"/>
                  </td>
	                <td class="text-center">
		                <input v-model="item.required" type="checkbox" :checked="item.required"/>
	                </td>
                  <td>
                    <input type="text" class="form-control" v-model="item.title" placeholder="항목을 입력해주세요."/>
                  </td>
                  <td>
	                  <input type="text" class="form-control" v-model="item.content" placeholder="내용을 입력해주세요." />
                  </td>
	                <td class="text-center">
		                <div class="col-xs-4">
			                <input type="radio" :name="item.col_id+'type'" value="T" :checked="item.type === 'T'" v-model="item.type" :id="item.col_id+'T'" style="width:15px;height:15px;"><label :for="item.col_id+'T'">Text</label>
			                <input type="radio" :name="item.col_id+'type'" value="S" :checked="item.type === 'S'" v-model="item.type" :id="item.col_id+'S'" style="width:15px;height:15px;"><label :for="item.col_id+'S'">Select</label>
		                </div>
		                <div class="col-xs-8" v-if="item.type === 'T'">
			                <span class="col-xs-12">
		                    <input type="text" class="form-control" placeholder="placeholder를 입력해 주세요." />
			                </span>
		                </div>
                    <div class="col-xs-8" v-if="item.type === 'S'">
			                <span class="col-xs-6">
		                    <input type="text" class="form-control" v-model="item.opts" placeholder="'|' 로 구분해서 작성해 주세요." />
			                </span>
			                <span class="col-xs-6">
			                  <input type="text" class="form-control" v-model="item.vals" placeholder="'|' 로 구분해서 작성해 주세요." />
			                </span>
		                </div>
	                </td>
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
              <textarea class="form-control" v-model="billNotice"></textarea>
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
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import moment from "moment"
import api from '@/common/api'

let bap = null;

export default {
  data() {
    return {
      image: "",
      previewSrc: '',
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
      useBilling: false,
      billingCnt: 3,
      chargeDay: ['','',''],
      pChargeDay: ['','',''],
      list: []
    };
  },
  components: {
    draggable, DatePicker
  },
  async created() {
      const res = await api.get('/partners/applyPage', { idx: this.$route.params.idx });
      bap = res.data;
      this.company = bap.site.company;
      this.accessCode = bap.access_code;
      this.emailDomain =bap.email_domain;
      this.contacts = bap.contacts;
      this.notice = bap.notice;
      this.billNotice = bap.bill_notice;
      this.chargeRatePct = bap.charge_rate_pct;
      this.penaltyAttendPct = bap.penalty_attend_pct;
      this.applyFrDt = bap.apply_fr_dt;
      this.applyToDt = bap.apply_to_dt;
      this.openYn = bap.open_yn ? true : false;
      this.previewSrc = `https://cdn.tutoring.co.kr/uploads/b2b/site/${bap.site.ci_img}`
		  this.useBilling = bap.bill_notice ? true : false

		  this.list = bap.form
  },
  methods: {
	  sortNumber: function (item,index) {
			  item.sort_no = index + 1
			  return item.sort_no
	  },
    imageSelected: function() {
      this.image = this.$refs.image.files[0];
      if(this.image) {
				this.previewSrc = URL.createObjectURL(this.image);
			}
    },
    imageCancel: function() {
      this.image = null;
      this.previewSrc = `https://cdn.tutoring.co.kr/uploads/b2b/site/${bap.site.ci_img}`
		},
    sendNum() {
      let numlist = [];
      this.list.forEach(el => numlist.push(el.num));
      console.log(numlist);
    },
    setForm: async function () {
			const params = {
				idx: this.$route.params.idx,
				accessCode: this.accessCode,
				emailDomain: this.emailDomain,
				contacts: this.contacts,
				notice: this.notice,
				billNotice: this.billNotice,
				chargeRatePct: this.chargeRatePct ? parseInt(this.chargeRatePct) : 0,
				penaltyAttendPct: this.penaltyAttendPct ? parseInt(this.penaltyAttendPct) : 0,
				applyFrDt: moment(this.applyFrDt).format('YYYY-MM-DD HH:mm:ss'),
				applyToDt: moment(this.applyToDt).format('YYYY-MM-DD HH:mm:ss'),
				openYn: this.openYn ? 1 : 0
			}
			if(this.image) params.ciImage = this.image

			await api.upload('/partners/applyPage', params);
			//
			// this.$swal('성공')
      // console.log(res);
      // const test = await api.get('/partners/applyPage', { idx: this.$route.params.idx });
      // console.log(test);
    }
  },
  computed: {
    applyRange: {
      get() {
        return [new Date(this.applyFrDt), new Date(this.applyToDt)];
      },
      set(value) {
        this.applyFrDt = moment(value[0]).format('YYYY-MM-DD HH:mm:ss');
        this.applyToDt = moment(value[1]).format('YYYY-MM-DD HH:mm:ss');
      }
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
