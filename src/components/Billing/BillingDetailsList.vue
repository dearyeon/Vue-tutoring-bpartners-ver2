<template>
  <div class="row">
    <Modal ref="modalBach" v-cloak>
      <div slot="header">
        <h1>결제 배치 정보</h1>
        <p>결제 배치 정보를 확인해주세요.</p>
      </div>
      <div slot="body">
        <table class="table">
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
    <Modal ref="modalCard" v-cloak>
      <div slot="header">
        <h1>카드정보 관리</h1>
        <p>카드 정보를 확인해주세요.</p>
      </div>
      <div slot="body">
        <span>카드사</span>
        <input class="form-control" type="text" value="신한" readonly />
        <br />
        <span>카드번호</span>
        <input class="form-control" type="text" value="****_****_****_1234" readonly />
      </div>
      <div slot="footer">
        <button class="btn btn-danger pull" @click="$refs.modalCard.close()">카드정보삭제</button>
        <div>
          <button class="btn" @click="$refs.modalCard.close()">일시정지</button>
          <button class="btn btn-success" @click="[$refs.modalCardEdit.open(), $refs.modalCard.close()]">수정</button>
        </div>
      </div>
    </Modal>
    <Modal ref="modalCardEdit" v-cloak>
      <div slot="header">
        <h1>카드 정보 수정</h1>
        <p>카드 정보를 확인해주세요.</p>
      </div>
      <div slot="body">
        <!-- 카드 정보 변경 body -->
      </div>
    </Modal>
    <div class="col-lg-12">
      <div class="ibox-title title">
        <h2 class="pull-left">결제정보 관리</h2>
        <button @click="$refs.modalBach.open()" class="btn btn-success mx-3 pull-right">
          배치 정보 확인
        </button>
      </div>
    </div>
    <div class="row">
      <div class="ibox content">
        <div class="ibox-content">
          <form id="listform">
            <div class="subtitle">
              <h1>{{ bapInfo.idx === 1 ? "남양주 시청" : "한국수력원자력" }}</h1>
              <Dropdown
                :defaultValue="aNoList.length !== 0 ? aNoList[$route.params.aNo - 1] : ''"
                :itemList="aNoList"
                @dropItemClick="chANo"
              />
            </div>

            <div class="input-group col-lg-4 pull-left">
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
            <div class="col-lg-5 col-md-12">
              <div class="col-lg-6 col-md-6">
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

              <div class="col-lg-6 col-md-6">
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

          <div class="col-lg-12">
            <!-- 탭 부분 -->
            <div class="panel blank-panel">
              <div class="panel-options">
                <ul class="nav nav-tabs customer_tab">
                  <li :class="{ active: tab === 1 }"><a @click="chTab(1)">정기결제</a></li>
                  <li :class="{ active: tab === 2 }"><a @click="chTab(2)">추가결제(미수료)</a></li>
                </ul>
              </div>
            </div>

            <div class="panel-body">
              <div class="tab-content">
                <div class="tab-pane" :class="{ active: tab === 1 }">
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
                <div class="tab-pane" :class="{ active: tab === 2 }">
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
                        <tr v-for="(item, index) in listInfo" :key="`biillingDetailItem-${index}`" class="text-center">
                          <td>{{ index + 1 }}</td>
                          <td>{{ item.user.name }}</td>
                          <td>{{ item.goods.charge_plan.title_plan }}</td>
                          <td>%</td>
                          <td>%</td>
                          <td>2(hard)</td>
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
import Modal from "../atom/Modal";
import Dropdown from "../atom/Dropdown";

export default {
  async created() {
    const res = await api.get("/partners/chargeList", { sIdx: this.$route.params.sIdx, aNo: this.$route.params.aNo });
    const resP = await api.get("/partners/pchargeList", { sIdx: this.$route.params.sIdx, aNo: this.$route.params.aNo });
    this.listInfo = res.data.list;
    this.bapInfo = res.data.bap;
    this.listInfoP = resP.data.list;
    this.bapInfoP = resP.data.bap;
    this.aNoList = res.data.aNoList.map(item => this.aNoFormat(item));
  },
  data() {
    return {
      listInfo: "",
      bapInfo: 0,
      listInfoP: "",
      bapInfoP: 0,
      tab: 1,
      aNoList: [],
    };
  },
  computed: {
    defaultDrop() {
      return item => {
        if (item !== undefined)
          return ` | ${item.apply_fr_dt.replace(/(\d{4}-\d{2}-\d{2}).*/, "$1")} ~ ${item.apply_to_dt.replace(
            /(\d{4}-\d{2}-\d{2}).*/,
            "$1",
          )}`;
        else return "";
      };
    },
  },
  methods: {
    chTab: function(index) {
      this.tab = index;
    },
    chANo: async function(index) {
      const res = await api.get("/partners/chargeList", { sIdx: this.$route.params.sIdx, aNo: index + 1 });
      this.listInfo = res.data.list;
      this.bapInfo = res.data.bap;
      this.aNoList = res.data.aNoList.map(item => this.aNoFormat(item));
    },
    aNoFormat: function(item) {
      if (typeof item === "object" && "a_no" in item)
        return `${item.a_no}회차 | ${item.apply_fr_dt.replace(
          /(\d{4}-\d{2}-\d{2}).*/,
          "$1",
        )} ~ ${item.apply_to_dt.replace(/(\d{4}-\d{2}-\d{2}).*/, "$1")}`;
      else return "";
    },
  },
  components: {
    Modal,
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
  display: flex;
  flex-direction: column;
}
.subtitle {
  display: flex;
  align-items: center;
}
.subtitle h1 {
  margin-right: 12px;
}
.input-group {
  padding-bottom: 8px;
}
td {
  vertical-align: middle;
}
</style>
