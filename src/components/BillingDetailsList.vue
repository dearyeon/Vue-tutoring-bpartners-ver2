<template>
  <div class="row">
    <Modal ref="modalBach">
      <div slot="header">
        <h2>결제 배치 정보</h2>
        <p>결제 배치 정보를 확인해주세요.</p>
      </div>
      <div slot="body">
        <table>
          <tr>
            <td>고객사명</td>
            <td><input class="form-control" type="text" value="남양주시청" readonly /></td>
          </tr>
          <tr>
            <td>자동결제 예정일</td>
            <td><input class="form-control" type="text" value="2020-08-05 10:00:00" readonly /></td>
          </tr>
          <tr>
            <td>수동결제 예정일</td>
            <td><input class="form-control" type="text" value="2020-08-05 10:00:00" readonly /></td>
          </tr>
        </table>
      </div>
    </Modal>
    <Modal ref="modalCard">
      <div slot="header">
        <h2>카드정보 관리</h2>
        <p>결제 배치 정보를 확인해주세요.</p>
      </div>
      <div slot="body">
        <table>
          <tr>
            <td>카드사</td>
            <td><input class="form-control" type="text" value="신한" readonly /></td>
          </tr>
          <tr>
            <td>카드번호</td>
            <td><input class="form-control" type="text" value="****_****_****_1234" readonly /></td>
          </tr>
        </table>
      </div>
    </Modal>
    <div class="col-lg-12">
      <div class="ibox-title title">
        <h2 class="pull-left">결제정보 관리</h2>
        <button
          @click="$refs.modalBach.open()"
          class="btn btn-success mx-3 pull-right"
          data-toggle="modal"
          data-target="#bachInfoModal"
        >
          배치 정보 확인
        </button>
      </div>
    </div>
    <div class="row">
      <div class="ibox content">
        <div class="ibox-content">
          <!--<form id="listform" action="{{ route('b2b.payInfoAdmin') }}">-->
          <form id="listform">
            <div class="subtitle">
              <h1>{{ this.id === 1 ? "남양주 시청" : "한국수력원자력" }}</h1>
              <div class="btn-group p-w-xs" style="vertical-align: bottom;">
                <button data-toggle="dropdown" class="btn btn-default btn-sm dropdown-toggle" aria-expanded="false">
                  <strong>1차</strong><span class="caret"></span>
                </button>
                <ul class="dropdown-menu">
                  <li>1차</li>
                </ul>
              </div>
            </div>

            <div class="formOptions">
              <div class="input-group">
                <input
                  type="text"
                  name="q"
                  value=""
                  placeholder="성명 or 이메일 or 고객식별ID"
                  class="form-control"
                  aria-describedby="basic-addon2"
                />
                <span class="input-group-addon" id="basic-addon2">검색</span>
              </div>
              <div class="form-group">
                <label class="control-label" for="en_i">결제 실패건 모아보기</label>
                <div class="switch">
                  <div class="onoffswitch">
                    <input class="onoffswitch-checkbox form-control" name="en_i" id="en_i" type="checkbox" value="" />
                    <label class="onoffswitch-label" for="en_i">
                      <span class="onoffswitch-inner"></span>
                      <span class="onoffswitch-switch"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="control-label" for="en_p">결제 일시정지건 모아보기</label>
                <div class="switch">
                  <div class="onoffswitch">
                    <input class="onoffswitch-checkbox form-control" name="en_p" id="en_p" type="checkbox" value="" />
                    <label class="onoffswitch-label" for="en_p">
                      <span class="onoffswitch-inner"></span>
                      <span class="onoffswitch-switch"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </form>

          <div>
            <!-- 탭 부분 -->
            <div class="panel blank-panel">
              <div class="panel-options">
                <ul class="nav nav-tabs customer_tab">
                  <li class="active"><a data-toggle="tab" data-index="1">정기결제</a></li>
                  <li class=""><a data-toggle="tab" data-index="2">추가결제(미수료)</a></li>
                </ul>
              </div>
            </div>

            <div class="panel-body">
              <div class="tab-content">
                <div class="tab-pane active" id="tab-1">
                  <div class="row">
                    <table class="table table-striped text-center table-hover dataTable">
                      <thead>
                        <tr>
                          <th class="text-center">No</th>
                          <th class="text-center">학생</th>
                          <th class="text-center">수강권</th>
                          <th class="text-center">정기 결제 일자</th>
                          <th class="text-center">결제 처리 현황</th>
                          <th class="text-center">자동 결제 실패건 처리</th>
                          <th class="text-center">당월 결제 skip</th>
                          <th class="text-center">카드정보 관리</th>
                          <th class="text-center">관리 태그</th>
                          <th class="text-center">태그입력</th>
                        </tr>
                      </thead>
                      <tbody id="chargeInfoList">
                        <!--정기 결제 -->
                        <tr v-for="(item, index) in listInfo" :key="`biillingDetailItem-${index}`" class="text-center">
                          <td>{{ index + 1 }}</td>
                          <td>{{ item.user.name }}</td>
                          <td>{{ item.goods.charge_plan.title_plan }}</td>
                          <td>{{ bapInfo.charge_day }}</td>
                          <td>결제 처리 현황</td>
                          <td>
                            <button class="btn" :class="[item.bill_status === 'R' ? 'btn-primary' : 'disabled']">
                              {{ item.bill_status === "R" ? "결제 대기" : "결제 완료" }}
                            </button>
                          </td>
                          <td><button class="btn btn-default">skip</button></td>
                          <td><button class="btn btn-default" @click="$refs.modalCard.open()">확인</button></td>
                          <td>관리 태그</td>
                          <td><button class="btn btn-default">입력</button></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="tab-pane" id="tab-2">
                  <div class="row">
                    <table class="table table-striped text-center table-hover dataTable">
                      <thead>
                        <tr>
                          <th class="text-center">No</th>
                          <th class="text-center">학생</th>
                          <th class="text-center">수강권</th>
                          <th class="text-center">기준 출석률</th>
                          <th class="text-center">달성률</th>
                          <th class="text-center">추가 결제 일자</th>
                          <th class="text-center">추가 결제 처리현황</th>
                          <th class="text-center">자동 결제 실패건 처리</th>
                          <th class="text-center">당월 결제 skip</th>
                          <th class="text-center">카드정보 관리</th>
                          <th class="text-center">관리 태그</th>
                          <th class="text-center">태그입력</th>
                        </tr>
                      </thead>
                      <tbody id="pchargeInfoList">
                        <!--추가 결제 -->
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/common/api";
import Modal from "./Modal";

export default {
  async created() {
    const res = await api.get("/partners/chargeList", { bapIdx: this.id });
    this.listInfo = res.data.list;
    this.bapInfo = res.data.bap;
    console.log(res);
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      listInfo: "",
      bapInfo: 0,
    };
  },
  watch: {
    listInfo: function(val) {
      this.listInfo = val;
    },
    bapInfo: function(val) {
      this.bapInfo = val;
    },
  },
  components: {
    Modal,
  },
};
</script>

<style>
.title {
  height: 65px;
}
.content {
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.subtitle {
  display: flex;
  align-items: center;
}

.formOptions {
  display: flex;
  align-items: center;
}

.input-group {
  flex: 0.4;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 0.2;
  margin: 8px;
}
</style>
