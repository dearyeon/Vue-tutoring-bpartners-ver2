<template>
  <div class="row">
    <Modal ref="modalWaitPayment" v-cloak>
      <div slot="body" style="align-items:center">
        <h1><strong>결제 방법을 선택해주세요.</strong></h1>
      </div>
      <div slot="footer" style="justify-content: center">
        <button class="btn btn-warning" @click="$refs.modalWaitPayment.close()">일시정지</button>
        <button class="btn btn-info" @click="[$refs.modalWaitPayment.close(), makePayment()]">수동결제</button>
      </div>
    </Modal>
    <Modal ref="modalCardEdit" v-cloak>
      <div slot="header">
        <h1>카드 정보 수정</h1>
        <p>카드 정보를 확인해주세요.</p>
        <strong>{{ currentItem.bill_card ? currentItem.bill_card.replace(/(\/\d{1})/gi, "") : "" }}</strong>
      </div>
      <div slot="body">
        <table class="table">
          <tr>
            <th>카드번호</th>
            <td colspan="4">
              <input
                type="text"
                class="form-control"
                placeholder="'-'를 제외한 카드번호를 입력해주세요."
                v-model="newCardInfo.cardNo"
                maxlength="16"
              />
            </td>
          </tr>
          <tr>
            <th>유효기간</th>
            <td><input type="text" class="form-control" placeholder="MM" v-model="newCardInfo.mm" maxlength="2" /></td>
            <td>월</td>
            <td><input type="text" class="form-control" placeholder="YY" v-model="newCardInfo.yy" maxlength="2" /></td>
            <td>년</td>
          </tr>
          <tr>
            <th>결제비밀번호 (앞 2자리)</th>
            <td>
              <input type="password" class="form-control" placeholder="00" v-model="newCardInfo.pw" maxlength="2" />
            </td>
            <td colspan="2">* *</td>
          </tr>
          <tr>
            <th>생년월일</th>
            <td colspan="4">
              <input
                type="text"
                class="form-control"
                placeholder="YYMMDD"
                v-model="newCardInfo.birthYYMMDD"
                maxlength="6"
              />
            </td>
          </tr>
        </table>
      </div>
      <div slot="footer">
        <button class="btn btn-danger">삭제</button>
        <button class="btn btn-success" @click="editCardInfo(currentItem.bau_idx)">수정</button>
      </div>
    </Modal>
    <Modal ref="modalTag" v-cloak>
      <div slot="header">
        <h1>관리 태그 입력</h1>
        <p>관리 태그를 입력해 주세요.</p>
      </div>
      <div slot="body">
        <table class="table">
          <tr>
            <th style="vertical-align: top; padding-top:12px;">관리태그</th>
            <td>
              <textarea class="form-control" rows="3" placeholder="내용을 입력해 주세요." v-model="tag"></textarea>
            </td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="pull-right">
        <button class="btn btn-success" @click="[$refs.modalTag.close(), editTag()]">저장</button>
      </div>
    </Modal>
    <div class="col-lg-12">
      <div class="ibox-title title">
        <h2 class="pull-left">결제정보 관리</h2>
      </div>
    </div>
    <div class="row">
      <div class="ibox content">
        <div class="ibox-content">
          <form id="listform">
            <div class="subtitle">
              <h1>{{ bapInfo.site_name }}</h1>
              <Dropdown
                :defaultValue="aNoList.length !== 0 ? aNoList[$route.params.aNo - 1] : ''"
                :itemList="aNoList"
                @dropItemClick="chANo"
              />
              <Dropdown
                :defaultValue="bNoList.length !== 0 ? bNoList[$route.params.bNo - 1] : ''"
                :itemList="bNoList"
                @dropItemClick="chBNo"
              />
            </div>

            <div class="input-group col-lg-4 col-md-12 col-xs-12 pull-left">
              <input
                type="text"
                v-model="search"
                placeholder="성명 or 고객식별ID"
                class="form-control"
                @keydown.enter.prevent
              />
            </div>
            <div class="col-lg-5 col-md-12 col-xs-12">
              <div class="col-lg-6 col-md-6 col-xs-6">
                <label class="control-label" for="en_i">결제 실패건 모아보기</label>
                <div class="switch">
                  <div class="onoffswitch">
                    <!-- FIXME: filter 기능 -->
                    <input class="onoffswitch-checkbox form-control" name="en_i" id="en_i" type="checkbox" value="" />
                    <label class="onoffswitch-label" for="en_i">
                      <span class="onoffswitch-inner"></span>
                      <span class="onoffswitch-switch"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="col-lg-6 col-md-6 col-xs-6">
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
                          <th class="text-center">고객식별 ID</th>
                          <th class="text-center">수강권</th>
                          <th class="text-center">결제회차</th>
                          <th class="text-center">정기결제일시</th>
                          <th class="text-center">실결제일시</th>
                          <th class="text-center">결제처리현황</th>
                          <th class="text-center">결제카드변경</th>
                          <th class="text-center">결제처리결과정보</th>
                          <th class="text-center">관리태그</th>
                          <th class="text-center">태그수정</th>
                        </tr>
                      </thead>
                      <tbody id="chargeInfoList">
                        <!--정기 결제 -->
                        <tr
                          v-for="(item, index) in filteredList(listInfo)"
                          :key="`biillingDetailItem-${index}`"
                          class="text-center"
                          @click="setCurrentItem(item)"
                        >
                          <td>{{ item.no }}</td>
                          <td>{{ item.user_name }}</td>
                          <td>{{ item.cus_id }}</td>
                          <td>{{ item.goods_name }}</td>
                          <td>{{ item.b_no }}</td>
                          <td>
                            {{
                              item.charge_dt &&
                                item.charge_dt.replace(/(\d{4})-(\d{2})-(\d{2})\s(\d{2}).*/gi, "$1년 $2월 $3일 $4시")
                            }}
                          </td>
                          <td>
                            {{
                              item.charged_dt && item.charged_dt.replace(/(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}).*/gi, "$1")
                            }}
                          </td>
                          <td>
                            <button
                              class="btn"
                              :class="chargeBtnStatus(item.charge_status).class"
                              @click="
                                [
                                  chargeBtnStatus(item.charge_status).click &&
                                    chargeBtnStatus(item.charge_status).click(),
                                ]
                              "
                            >
                              {{ chargeBtnStatus(item.charge_status).text }}
                            </button>
                          </td>
                          <td>
                            <button class="btn btn-default" @click="[(newCardInfo = {}), $refs.modalCardEdit.open()]">
                              카드변경
                            </button>
                          </td>
                          <td>
                            {{
                              item.charged_info &&
                                item.charged_info.replace(/\/\d{1}/gi, match => (match === "/0" ? "/신용" : "/직불"))
                            }}
                          </td>
                          <td>{{ item.mng_tag ? item.mng_tag : "" }}</td>
                          <td>
                            <button class="btn btn-default" @click="$refs.modalTag.open()">수정</button>
                          </td>
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
                          <th class="text-center">고객식별ID</th>
                          <th class="text-center">수강권</th>
                          <th class="text-center">기준출석률</th>
                          <th class="text-center">달성률</th>
                          <th class="text-center">추가결제회차</th>
                          <th class="text-center">정기결제일시</th>
                          <th class="text-center">실결제일시</th>
                          <th class="text-center">결제처리현황</th>
                          <th class="text-center">결제카드변경</th>
                          <th class="text-center">결제처리결과정보</th>
                          <th class="text-center">관리태그</th>
                          <th class="text-center">태그수정</th>
                        </tr>
                      </thead>
                      <tbody id="pchargeInfoList">
                        <tr
                          v-for="(item, index) in filteredList(listInfoP)"
                          :key="`biillingDetailItem-${index}`"
                          class="text-center"
                          @click="setCurrentItem(item)"
                        >
                          <td>{{ item.no }}</td>
                          <td>{{ item.user_name }}</td>
                          <td>{{ item.cus_id }}</td>
                          <td>{{ item.goods_name }}</td>
                          <td>{{ item.penalty_attend_pct }}%</td>
                          <td>{{ item.attend_pct }}%</td>
                          <td>{{ item.b_no }}</td>
                          <td>
                            {{
                              item.pcharge_dt &&
                                item.pcharge_dt.replace(/(\d{4})-(\d{2})-(\d{2})\s(\d{2}).*/gi, "$1년 $2월 $3일 $4시")
                            }}
                          </td>
                          <td>
                            {{
                              item.pcharged_dt && item.pcharged_dt.replace(/(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}).*/gi, "$1")
                            }}
                          </td>
                          <td>
                            <button
                              class="btn"
                              :class="chargeBtnStatus(item.pcharge_status).class"
                              @click="
                                [
                                  chargeBtnStatus(item.pcharge_status).click &&
                                    chargeBtnStatus(item.pcharge_status).click(),
                                ]
                              "
                            >
                              {{ chargeBtnStatus(item.pcharge_status).text }}
                            </button>
                          </td>
                          <td>
                            <button class="btn btn-default" @click="[(newCardInfo = {}), $refs.modalCardEdit.open()]">
                              카드변경
                            </button>
                          </td>
                          <td>
                            {{
                              item.pcharged_info &&
                                item.pcharged_info.replace(/\/\d{1}/gi, match => (match === "/0" ? "/신용" : "/직불"))
                            }}
                          </td>
                          <td>{{ item.mng_tag ? item.mng_tag : "" }}</td>
                          <td>
                            <button class="btn btn-default" @click="$refs.modalTag.open()">수정</button>
                          </td>
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
    this.apiCall(this.$route.params.aNo, this.$route.params.bNo);
  },
  data() {
    return {
      listInfo: "",
      bapInfo: 0,
      listInfoP: "",
      bapInfoP: 0,
      tab: 1,
      aNoList: [],
      bNoList: [],
      tag: "",
      search: "",
      newCardInfo: { cardNo: "", yy: "", mm: "", pw: "", birthYYMMDD: "" },
      currentItem: {},
    };
  },
  computed: {
    filteredList() {
      return list => {
        if (list.length !== 0)
          return list.filter(
            item =>
              (item.user_name && item.user_name.includes(this.search.trim())) ||
              (item.cus_id && item.cus_id.includes(this.search.trim())),
          );
      };
    },
    chargeBtnStatus() {
      return status => {
        if (status === "B") return { class: "btn-primary", text: "결제 대기", click: this.$refs.modalWaitPayment.open };
        if (status === "P") return { class: "btn-warning", text: "일시 정지", click: this.pausePayment };
        if (status === "F") return { class: "btn-danger", text: "결제 실패", click: this.paymentFailed };
        if (status === "S") return { class: "disabled", text: "결제 성공" };
        if (status === "Q") return { class: "btn-success", text: "환불 요청" };
        return { class: "btn-info", text: "환불 완료" }; //status === "R"
      };
    },
    setCurrentItem() {
      return item => {
        if (item) {
          this.currentItem = item;
          this.tag = item.mng_tag;
        }
      };
    },
  },
  methods: {
    apiCall: async function(aNo, bNo) {
      const res = await api.get("/partners/chargeList", {
        sIdx: this.$route.params.sIdx,
        aNo: aNo,
        bNo: bNo,
      });
      const resP = await api.get("/partners/pchargeList", {
        sIdx: this.$route.params.sIdx,
        aNo: aNo,
        bNo: bNo,
      });
      this.listInfo = res.data.list;
      this.bapInfo = res.data.bap;
      this.listInfoP = resP.data.list;
      this.bapInfoP = resP.data.bap;
      this.aNoList = res.data.aNoList.map(item => this.aNoFormat(item));
      this.bNoList = res.data.bNoList.map(item => this.bNoFormat(item));
    },
    refresh: function() {
      this.apiCall(this.$route.params.aNo, this.$route.params.bNo);
    },
    chTab: function(index) {
      this.tab = index;
    },
    chANo: async function(index) {
      this.apiCall(index + 1, 1);
      this.$router.push({
        name: "billingDetailsList",
        params: { sIdx: this.$route.params.sIdx, aNo: index + 1, bNo: 1 },
      });
    },
    chBNo: async function(index) {
      this.apiCall(this.$route.params.aNo, index + 1);
      this.$router.push({
        name: "billingDetailsList",
        params: { sIdx: this.$route.params.sIdx, aNo: this.$route.params.aNo, bNo: index + 1 },
      });
    },
    aNoFormat: function(item) {
      if (typeof item === "object" && "a_no" in item)
        return `${item.a_no}회차 | ${item.apply_fr_dt.replace(
          /(\d{4}-\d{2}-\d{2}).*/,
          "$1",
        )} ~ ${item.apply_to_dt.replace(/(\d{4}-\d{2}-\d{2}).*/, "$1")}`;
      else return "";
    },
    bNoFormat: function(item) {
      if (typeof item === "object" && "b_no" in item)
        return `${item.b_no} | ${item.charge_dt.replace(
          /(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})/gi,
          "$2.$3",
        )}`;
    },
    pausePayment: function() {
      this.$swal.fire({
        title: "일시 정지를 해제하시겠습니까?",
        confirmButtonColor: "#8FD0F5",
        confirmButtonText: "확인",
      });
    },
    editCardInfo: function(bauIdx) {
      this.$swal
        .fire({
          title: "수정 하시겠습니까?",
          confirmButtonText: "확인",
          confirmButtonColor: "#8FD0F5",
        })
        .then(async result => {
          if (result.isConfirmed) {
            const res = await api.post("/partners/updateBillkey", { bauIdx, ...this.newCardInfo });
            if (res.result === 2000)
              this.$swal
                .fire({
                  text: "결제 카드 정보가 수정되었습니다",
                  icon: "success",
                  confirmButtonText: "확인",
                  confirmButtonColor: "#8FD0F5",
                })
                .then(result => {
                  if (result.isConfirmed) {
                    this.$refs.modalCardEdit.close();
                    this.refresh();
                  }
                });
            else
              this.$swal({
                title: "다시 시도 해주세요",
                text: res.message.errMsg,
                icon: "error",
                confirmButtonText: "확인",
                confirmButtonColor: "#8FD0F5",
              });
          }
        });
    },
    editTag: async function() {
      const res = await api.post("/partners/updateMngTag", { idx: this.currentItem.idx, mngTag: this.tag });
      if (res) this.refresh();
    },
    makePayment: function() {
      this.$swal
        .fire({
          html: `${this.currentItem.user_name}님 <strong>${this.$route.params.aNo}회차(baoidx: ${this.currentItem.idx})</strong> 수강료가 결제됩니다.<br>결제 하시겠습니까?`,
          icon: "warning",
          showCancelButton: true,
          cancelButtonColor: "#d8d8d8",
          cancelButtonText: "취소",
          confirmButtonColor: "#8FD0F5",
          confirmButtonText: "확인",
          showLoaderOnConfirm: true,
          reverseButtons: true,
          preConfirm: async () => {
            const chargeOrder = await api.post("/partners/chargeOrder", {
              baoIdx: this.currentItem.idx,
              isPenaltyCharge: this.tab - 1,
            });
            if (chargeOrder.result === 1000)
              this.$swal
                .fire({
                  text: "결제 처리에 실패하였습니다",
                  icon: "error",
                  confirmButtonText: "확인",
                  confirmButtonColor: "#8FD0F5",
                })
                .then(result => {
                  if (result.isConfirmed) this.refresh();
                });
          },
        })
        .then(result => {
          if (result.isConfirmed)
            this.$swal
              .fire({
                text: "결제 처리 되었습니다",
                icon: "success",
                confirmButtonText: "확인",
                confirmButtonColor: "#8FD0F5",
              })
              .then(result => {
                if (result.isConfirmed) this.refresh();
              });
        });
    },
    paymentFailed: function() {
      console.log(this.currentItem);
      this.$swal
        .fire({
          html: `${this.currentItem.user_name}`,
          icon: "error",
          confirmButtonText: "수동 재결제",
          confirmButtonColor: "#8FD0F5",
          showCancelButton: true,
          cancelButtonColor: "#d8d8d8",
          cancelButtonText: "취소",
          reverseButtons: true,
        })
        .then(result => {
          if (result.isConfirmed) this.makePayment();
        });
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
textarea {
  resize: none;
  width: 100%;
}
.swal2-popup {
  font-size: 1.3rem !important;
}
.swal2-container {
  z-index: 300000 !important;
}
</style>
