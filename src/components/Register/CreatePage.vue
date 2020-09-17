<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="ibox-title title">
        <h2 class="pull-left">페이지 생성(기본 정보 등록)</h2>
        <button class="btn btn-danger pull-right">제거</button>
      </div>
    </div>
    <div class="row">
      <div class="ibox content">
        <div class="ibox-content">
          <div class="col-lg-6">
            <table class="table">
              <tr>
                <th>회사명</th>
                <td>
                  <input type="text" class="form-control" />
                </td>
              </tr>
              <tr>
                <th>B2B사이트</th>
                <td>
                  <Dropdown style="display: flex" defaultValue="선택해주세요" :itemList="b2bList" />
                </td>
              </tr>
              <tr>
                <th>총 학습 개월수 <br />(결제회차기준)</th>
                <td>
                  <div class="input-w-text">
                    <input type="text" class="form-control" />
                    <p>개월</p>
                  </div>
                </td>
              </tr>
              <tr>
                <th>미수료 결제 여부</th>
                <td>
                  <div class="switch">
                    <div class="onoffswitch">
                      <input class="onoffswitch-checkbox form-control" name="en_i" id="en_i" type="checkbox" value="" />
                      <label class="onoffswitch-label" for="en_i">
                        <span class="onoffswitch-inner"></span>
                        <span class="onoffswitch-switch"></span>
                      </label>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <th>수료기준 출석률</th>
                <td>
                  <div class="input-w-text">
                    <input type="text" class="form-control" />
                    <p>%</p>
                  </div>
                </td>
              </tr>
              <tr>
                <th>자기 부담금</th>
                <td>
                  <div class="input-w-text">
                    <input type="text" class="form-control" name="rate" />
                    <p>%</p>
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <div class="col-lg-6">
            <table class="table">
              <tr>
                <th>이메일 도메인 지정</th>
                <td><input type="text" class="form-control" placeholder="@tutoring.co.kr" /></td>
              </tr>
              <tr>
                <th>Access code (키워드)</th>
                <td>
                  <input type="text" class="form-control" />
                </td>
              </tr>
              <tr>
                <th>수강신청기간<br />(사이트 운영일)</th>
                <td>
                  <!--TODO: DATETIMEPICKER-->
                  <input class="form-control" type="text" placeholder="YYYY-MM-DD" />
                </td>
              </tr>
              <tr>
                <th>정기 결제일</th>
                <td><Dropdown style="display: flex" defaultValue="d-5" :itemList="b2bList" /></td>
              </tr>
              <tr>
                <th>추가 결제일</th>
                <td><Dropdown style="display: flex" defaultValue="d+5" :itemList="b2bList" /></td>
              </tr>
              <tr>
                <th>수동 정기 결제일</th>
                <td>
                  <div class="input-w-text">
                    <input type="text" class="form-control" name="dt" />
                    <p>일</p>
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <div class="col-lg-12">
            <table class="table">
              <tbody>
                <tr>
                  <th>수강권 선택(추가)</th>
                  <td>
                    <Dropdown
                      style="display: flex"
                      defaultValue="선택해주세요"
                      :itemList="b2bList"
                      @dropItemClick="addCourse"
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <table class="table">
              <thead>
                <tr>
                  <th>수강권 구분</th>
                  <th>
                    <input type="checkbox" id="og_price" name="og_price" />
                    <label for="og_price">
                      표준 제공가
                    </label>
                  </th>
                  <th>할인율</th>
                  <th>
                    <input type="checkbox" id="company_price" checked />
                    <label for="company_price"> 기업 제공가</label>
                  </th>
                  <th>
                    <input type="checkbox" id="deductible" />
                    <label for="deductible"> 자기 부담금 </label>
                  </th>
                  <th class="text-center">삭제</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in courseList" :key="`CourseItem-${index}`">
                  <td>{{ item }}</td>
                  <td><input class="form-control" type="text" /></td>
                  <td>
                    <div class="input-w-text">
                      <input type="text" class="form-control" />
                      <p>%</p>
                    </div>
                  </td>
                  <td>
                    <div class="input-w-text">
                      <input type="text" class="form-control" />
                      <p>원</p>
                    </div>
                  </td>
                  <td>
                    <div class="input-w-text">
                      <input type="text" class="form-control" />
                      <p>원</p>
                    </div>
                  </td>
                  <td class="text-center"><button class="btn btn-danger">취소</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <button class="btn btn-info pull-right">저장</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Dropdown from "../atom/Dropdown";

export default {
  data() {
    return {
      selected: "",
      b2bList: ["b2b 1", "b2b 2", "b2b 3"],
      courseList: [],
    };
  },
  methods: {
    addCourse: function(index) {
      this.courseList.push(this.b2bList[index]);
    },
  },
  components: {
    Dropdown,
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
.input-w-text {
  display: flex;
  flex-basis: 100;
  align-items: center;
  justify-content: space-between;
}
.input-w-text input {
  flex: 0.95;
}
.input-w-text p {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}
/*tbody {
  border
}*/
.table th,
.table td {
  padding: 6px 12px;
}
.col-lg-6 {
  /*margin-bottom: 40px;*/
}
.table {
  margin-bottom: 16px;
}
label {
  margin: 0px 4px;
}
</style>
