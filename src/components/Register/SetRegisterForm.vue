<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="ibox-title title">
        <h2 class="pull-left">신청 양식 설정</h2>
        <router-link :to="{ path: '/createPage' }">
          <button class="btn btn-blue-line pull-right">
            뒤로가기
          </button>
        </router-link>
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
                    <!-- TODO: image uploader -->
                    <!--<tr class="text-center">-->
                    <tr>
                      <td colspan="2">
                        <img :src="preview" alt="업로드 된 이미지" />
                      </td>
                    </tr>
                    <!--</tr>-->
                    <tr>
                      <td class="col-lg-6">
                        <label class="btn btn-success col-lg-12" for="file">이미지 변경</label>
                        <input type="file" id="file" accept="image/*" ref="image" @change="imageUpload" />
                      </td>
                      <td class="col-lg-6">
                        <button class="btn btn-danger col-lg-12" @click="imageDelete">삭제</button>
                      </td>
                    </tr>
                  </td>
                </tr>
              </table>
            </div>
            <div class="col-lg-6">
              <table class="table">
                <tr>
                  <th>수강신청 문의</th>
                  <td>
                    <textarea name="info" rows="10" readonly>
                        고객센터: 1522-7802(평일 10시 ~ 18시)&#10;이메일 문의: b2b@tutoring.co.kr
                    </textarea>
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <h3 id="step-title">2 step. 신청시 주의 사항(수강 신청 브릿지 화면)</h3>
          <div class="row">
            <div class="col-lg-2">
              <strong>제목</strong>
            </div>
            <div class="col-lg-10"><input type="text" class="form-control" placeholder="제목을 입력해 주세요." /></div>
            <div class="col-lg-2">
              <strong>내용</strong>
            </div>
            <div class="col-lg-10">
              <p>dj</p>
              <!-- TODO: text editor pane -->
            </div>
            <div class="col-lg-2">
              <label class="label-w-checkbox" for="agree">
                동의 항목
              </label>
              <input type="checkbox" id="agree" />
            </div>
            <div class="col-lg-10">
              <input
                type="text"
                class="form-control"
                placeholder="내용을 입력해 주세요. 예) 위 사전 유의사항을 확인하였습니다."
              />
            </div>
          </div>
          <h3 id="step-title">3 step. 개인정보 수집</h3>
          <table class="table">
            <thead>
              <th class="text-center col-lg-1">노출여부</th>
              <th class="text-center col-lg-2">항목</th>
              <th class="text-center col-lg-9">질문 내용</th>
            </thead>
            <tbody>
              <tr>
                <td class="text-center">
                  <input type="checkbox" disabled />
                </td>
                <td><input type="text" class="form-control" value="소속(회사명)" readonly /></td>
                <td><input type="text" class="form-control" placeholder="회사명을 입력해주세요." /></td>
              </tr>
              <tr>
                <td class="text-center">
                  <input type="checkbox" disabled />
                </td>
                <td><input type="text" class="form-control" value="이름" readonly /></td>
                <td><input type="text" class="form-control" placeholder="이름을 입력해주세요." /></td>
              </tr>
              <tr>
                <td class="text-center">
                  <input type="checkbox" disabled />
                </td>
                <td><input type="text" class="form-control" value="연락처" readonly /></td>
                <td><input type="text" class="form-control" placeholder="연락처를 입력해주세요." /></td>
              </tr>
              <tr>
                <td class="text-center">
                  <input type="checkbox" disabled />
                </td>
                <td>
                  <input type="text" class="form-control" value="(사내)이메일" readonly />
                </td>

                <td><input type="text" class="form-control" placeholder="(사내)이메일을 입력해주세요." /></td>
              </tr>
              <tr>
                <td class="text-center">
                  <input type="checkbox" />
                </td>
                <td><input type="text" class="form-control" value="부서" /></td>
                <td><input type="text" class="form-control" placeholder="내용을 입력해주세요." /></td>
              </tr>
              <tr>
                <td class="text-center">
                  <input type="checkbox" />
                </td>
                <td><input type="text" class="form-control" value="직위" /></td>
                <td><input type="text" class="form-control" placeholder="내용을 입력해주세요." /></td>
              </tr>
              <tr>
                <td class="text-center">
                  <input type="checkbox" />
                </td>
                <td><input type="text" class="form-control" value="사번" /></td>
                <td><input type="text" class="form-control" placeholder="내용을 입력해주세요." /></td>
              </tr>
              <tr v-for="item in 5" :key="item">
                <td class="text-center">
                  <input type="checkbox" />
                </td>
                <td><input type="text" class="form-control" placeholder="항목을 입력해주세요." /></td>
                <td><input type="text" class="form-control" placeholder="내용을 입력해주세요." /></td>
              </tr>
            </tbody>
          </table>
          <h3 id="step-title">4 step. 결제시 유의사항</h3>
          <div class="row">
            <div class="col-lg-2">
              <strong>
                유의사항
              </strong>
            </div>
            <div class="col-lg-10">
              <table class="table">
                <tr>
                  <input type="text" class="form-control" value="[결제 유의사항]" />
                </tr>
                <br />
                <textarea rows="5" readonly>
                        입력하신 정보로 정기 결제가 진행됩니다.
                        미출석시 다음달 1일 수강료가 과금될 수 있으니 주의해주세요.
                        학습 종료 후 수료 기준에 따라 차액이 자동 결제 됩니다.
                        수강기간 종료 시 카드 정보는 폐기합니다.
                </textarea>
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
export default {
  data() {
    return {
      image: "",
      preview:
        "https://s3-alpha-sig.figma.com/img/911a/6151/4c7eb8a41cad075d0c95050d0bf9576a?Expires=1601251200&Signature=gGMNkI8zHURCtidWQDFKLvJGqsKcUdIrZUd3JdBrGzBxWndZmZXAoJpK93nZ37edqjSwuD9EG3F18NctLiN7rX-w0oby8mJquoOA8SMJXieOZbVFR7O~Xn3S~N0Ud8a5IX3YXqHrs9Qky3xrPyqXYDW-ro8WpRZaXIC1dE9Ico9Y6fG45PzOUAkhggVNYGhl8YX121Oup9bsGyvGfonKlFRUNtnz4X9cjwe4OjyYh0K0vfq4P40Q0Qklmxg-~uOjNGRiyMW5w9J6SM-LIchcxaXHoxY43qqFgYl5StkwVSTp1UmX-Fv8CNgFyGnJPYA-cKwfLjsH-vqZWV~HyABA3Q__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA",
    };
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
  vertical-align: top;
  border: none;
}
.btn-blue-line {
  color: #1e9ed3;
  background-color: #fff;
  border: 1px solid #1e9ed3;
  border-radius: 0px;
}
textarea {
  resize: none;
  width: 100%;
  border: solid 1px #e5e6e7;
  padding: 8px;
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
</style>
