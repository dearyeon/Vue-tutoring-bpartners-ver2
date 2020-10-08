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
          <h3 id="step-title">1 step. 액세스 홈</h3>
          <div class="row">
            <div class="col-lg-6">
              <table class="table">
                <tr>
                  <th>고객사</th>
                  <td><input type="text" class="form-control" placeholder="기업명을 입력해주세요." /></td>
                </tr>
                <tr>
                  <th>Access code</th>
                  <td><input type="text" class="form-control" value="namyangjoo_244" readonly /></td>
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
                  <th style="vertical-align: top; padding-top: 12px;">수강신청 문의</th>
                  <td>
                    <div id="text-area">
                      <ul>
                        <li>
                          고객센터: 1522-7802(평일 10시 ~ 18시)
                        </li>
                        <li>
                          이메일 문의: b2b@tutoring.co.kr
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <h3 id="step-title">2 step. 신청시 주의 사항(수강 신청 브릿지 화면)</h3>
          <table class="table">
            <tr>
              <th class="col-lg-2">
                <strong class="label-w-checkbox">제목</strong>
              </th>
              <td class="col-lg-10"><input type="text" class="form-control" placeholder="제목을 입력해 주세요." /></td>
            </tr>
            <tr>
              <th class="col-lg-2">
                <strong class="label-w-checkbox">내용</strong>
              </th>
              <td class="col-lg-10">
                <textarea id="disclaimer" class="form-control" v-model="disclaimer"></textarea>
              </td>
            </tr>
            <tr>
              <th class="col-lg-2">
                <label class="label-w-checkbox" for="agree">
                  동의 항목
                </label>
                <input type="checkbox" id="agree" />
              </th>
              <td class="col-lg-10">
                <input
                  type="text"
                  class="form-control"
                  placeholder="내용을 입력해 주세요. 예) 위 사전 유의사항을 확인하였습니다."
                />
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
                    <input v-else type="text" class="form-control" :value="element.value" :placeholder="value?'':'내용을 입력해주세요.'"/>
                  </td>
                  <td><input type="text" class="form-control" :placeholder="element.placeholder" /></td>
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
              <table class="table">
                <tr>
                  <input type="text" class="form-control" value="[결제 유의사항]" />
                </tr>
                <br />
                <div id="text-area">
                  <ul>
                    <li>입력하신 정보로 정기 결제가 진행됩니다.</li>
                    <li>미출석시 다음달 1일 수강료가 과금될 수 있으니 주의해주세요.</li>
                    <li>학습 종료 후 수료 기준에 따라 차액이 자동 결제 됩니다.</li>
                    <li>수강기간 종료 시 카드 정보는 폐기합니다.</li>
                  </ul>
                </div>
              </table>
            </div>
          </div>
          <div class="save pull-right">
            <button class="btn btn-blue-line">임시 저장</button>
            <button class="btn btn-primary">저장</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  data() {
    return {
      image: "",
      preview:
        "https://s3-alpha-sig.figma.com/img/911a/6151/4c7eb8a41cad075d0c95050d0bf9576a?Expires=1602460800&Signature=YuUFI8EGRfBtnq8MZrlqnwUlUuCdjr20SSE3~yMeXS5x9vjpqOsQrK4CyqtuH9d2v7l1VzqCjVDiOHg53SFGHYG5JcsbKoPwdo78yirNBB5DRQBuNmzLAxikSRwV5sel1K9HkMdG5cbxDxtK54piFZuVQMP30MCF271EJkLajk44AyClnXau-pT~mxR6zov1KxaMpdp7tNJyyZwpZXJfRg53-cVIS2Q9Z8Ml6o0LM4JuV5wok5-7g6q4nLhvbhJBgwefVucy2~ehgCwrzNlJX7jcFX8-2DtRqItU5L~Z-2M56VE4p3AwbJspxnJm~~ACwiqk0VpSuLZtQHB5wkGxgQ__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA",
      disclaimer:
        "*신청시 주의 사항을 확인해주세요\n*프로그램은 인당 월 1개에 한해 가능합니다.\n(중복 신청시 마지막 신청 정보로 반영)\n*신청 및 정정은 기한내에만 가능합니다.\n(신청~25일까지, 정정 및 취소 26~말일까지)\n*신청 기한내(~25일) 정정은 재 신청 해주시고, 신청 기한 이후(26일~말일) 정정 및 취소는 하기 메일로 요청 해주시기 바랍니다.(b2b@tutoring.co.kr)\n*신청자에 한해 27일 학습 안내 메일이 발송될 예정입니다.\n*GTP 대상/비대상에 따라 급여공제가 진행되므로 GTP여부를 반드시 확인 후 신청 해주시기 바랍니다.(비용 익월 공제)",
      list: [
        {value:'소속(회사명)', placeholder:'회사명을 입력해주세요.', read:1},
        {value:'이름', placeholder:'이름을 입력해주세요.', read:1},
        {value:'연락처', placeholder:'연락처를 입력해주세요.', read:1},
        {value:'(사내)이메일', placeholder:'(사내)이메일을 입력해주세요.', read:1},
        {value:'부서', placeholder:'내용을 입력해주세요.', checked:0},
        {value:'직위', placeholder:'내용을 입력해주세요.', checked:0},
        {value:'사번', placeholder:'내용을 입력해주세요.', checked:0},
        {value:'', placeholder:'내용을 입력해주세요.', checked:0},
        {value:'', placeholder:'내용을 입력해주세요.', checked:0},
        {value:'', placeholder:'내용을 입력해주세요.', checked:0},
        {value:'', placeholder:'내용을 입력해주세요.', checked:0},
        {value:'', placeholder:'내용을 입력해주세요.', checked:0}
      ]
    };
  },
  components: {
    draggable
  },
  watch: {
    image: function(val) {
      this.preview = URL.createObjectURL(val);
    },
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
  },
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
