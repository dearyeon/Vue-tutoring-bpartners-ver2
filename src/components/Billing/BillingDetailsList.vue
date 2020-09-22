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
            <td><input class="form-control" type="text" :value="bapInfo.charge_day" readonly /></td>
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
        <button class="btn btn-danger" @click="$refs.modalCard.close()">카드정보삭제</button>
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
        <table class="table">
          <tr>
            <th>카드번호</th>
            <td colspan="4"><input type="text" class="form-control" placeholder="1234-1234-1234-1234" /></td>
          </tr>
          <tr>
            <th>유효기간</th>
            <td><input type="text" class="form-control" placeholder="YY" /></td>
            <td>년</td>
            <td><input type="text" class="form-control" placeholder="MM" /></td>
            <td>월</td>
          </tr>
          <tr>
            <th>결제비밀번호 (앞 2자리)</th>
            <td><input type="password" class="form-control" value="00" /></td>
            <td colspan="2">* *</td>
          </tr>
          <tr>
            <th>생년월일</th>
            <td colspan="4"><input type="text" class="form-control" placeholder="YYYY-MM-DD" /></td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="pull-right">
        <button class="btn btn-success" @click="$refs.modalCardEdit.close()">저장</button>
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
        <button class="btn btn-success" @click="[$refs.modalTag.close()]">저장</button>
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

            <div class="input-group col-lg-4 col-md-12 col-xs-12 pull-left">
              <input
                type="text"
                v-model="search"
                placeholder="성명 or 이메일 or 고객식별ID"
                class="form-control"
                @keydown.enter.prevent
              />
            </div>
            <div class="col-lg-5 col-md-12 col-xs-12">
              <div class="col-lg-6 col-md-6 col-xs-6">
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
                        <tr
                          v-for="(item, index) in filteredList(listInfo)"
                          :key="`biillingDetailItem-${index}`"
                          class="text-center"
                        >
                          <td>{{ index + 1 }}</td>
                          <td>{{ item.user.name }}</td>
                          <td>{{ item.goods.charge_plan.title_plan }}</td>
                          <td>{{ bapInfo.charge_day }}</td>
                          <td>결제 처리 현황</td>
                          <td>
                            <button
                              class="btn"
                              :class="[item.bill_status === 'R' ? 'btn-primary' : 'disabled']"
                              @click="handleBillStatus"
                            >
                              {{ item.bill_status === "R" ? "결제 대기" : "결제 완료" }}
                            </button>
                          </td>
                          <td><button class="btn btn-default" @click="handleSkip">skip</button></td>
                          <td><button class="btn btn-default" @click="$refs.modalCard.open()">확인</button></td>
                          <td>{{ tag === "" ? "관리 태그" : tag }}</td>
                          <td><button class="btn btn-default" @click="$refs.modalTag.open()">입력</button></td>
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
                        <tr
                          v-for="(item, index) in filteredList(listInfoP)"
                          :key="`biillingDetailItem-${index}`"
                          class="text-center"
                        >
                          <td>{{ index + 1 }}</td>
                          <td>{{ item.user.name }}</td>
                          <td>{{ item.goods.charge_plan.title_plan }}</td>
                          <td>%</td>
                          <td>%</td>
                          <td>2(hard)</td>
                          <td>결제 처리 현황</td>
                          <td>
                            <button
                              class="btn"
                              :class="[item.bill_status === 'R' ? 'btn-primary' : 'disabled']"
                              @click="handleBillStatus"
                            >
                              {{ item.bill_status === "R" ? "결제 대기" : "결제 완료" }}
                            </button>
                          </td>
                          <td><button class="btn btn-default" @click="handleSkip">skip</button></td>
                          <td><button class="btn btn-default" @click="$refs.modalCard.open()">확인</button></td>
                          <td>{{ tag === "" ? "관리 태그" : tag }}</td>
                          <td><button class="btn btn-default" @click="$refs.modalTag.open()">입력</button></td>
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
      tag: "",
      search: "",
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
    filteredList() {
      return list => {
        if (list.length !== 0) return list.filter(item => item.user.name.includes(this.search.trim()));
      };
      //TODO: email, 고객식별 id 추가
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
    handleSkip: function() {
      this.$swal
        .fire({
          title: "",
          html: "<strong>MM월 DD일 N회차</strong> 결제가 skip됩니다.<br>수정하시겠습니까?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#8fd0f5",
          cancelButtonColor: "#d8d8d8",
          cancelButtonText: "취소",
          confirmButtonText: "확인",
          padding: "3em",
          reverseButtons: true,
        })
        .then(result => {
          if (result.isConfirmed) {
            //TODO: bill.status
            this.$swal.fire({
              text: "작업이 완료되었습니다.",
              icon: "success",
              confirmButtonText: "확인",
            });
          }
        });
    },
    handleBillStatus: function() {
      this.$swal
        .fire({
          html: "<strong>N회차</strong> 수강료가 결제됩니다.<br>결제 하시겠습니까?",
          icon: "warning",
          showCancelButton: true,
          cancelButtonColor: "#d8d8d8",
          cancelButtonText: "취소",
          confirmButtonColor: "#8FD0F5",
          confirmButtonText: "확인",
          reverseButtons: true,
        })
        .then(result => {
          if (result.isConfirmed) {
            this.$swal.fire({
              text: "결제 처리 되었습니다",
              icon: "success",
              confirmButtonText: "확인",
              confirmButtonColor: "#8FD0F5",
            });
          }
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
</style>
