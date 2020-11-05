<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="ibox float-e-margins">
        <div class="ibox-title" style="height: 65px">
          <div class="pull-left">
            <h2>수업 현황</h2>
          </div>
          <div class="pull-right">
            <a id="btnSendOrderEmailLessonStatus" class="btn btn-success btn-w-m" @click="openModal">학습현황 메일 일괄 발송</a>&nbsp;
            <a id="exportLessonList" class="btn btn-success btn-w-m" @click="exportExcel">엑셀 다운로드</a>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12 sub-title">
          <div class="ibox-content">
            <div class="row ibox">
              <form id="listform">
                <div class="col-lg-12">
                  <div class="col-sm-4">
                    <ul class="list-inline">
                      <li><h1>{{ company }}</h1></li>
                      <li>
                        <select v-if="batches.length" @change="routeDetailPage($event)">
                            <option value="none" selected disabled hidden>{{ batch.b_no }}차</option>
                            <option v-for="(batch,i) in batches" :value="i" :key="batch.id">{{batch.b_no}}차</option>
                        </select>
                      </li>
                    </ul>
                  </div>
                  <div class="col-sm-4">
                    <div data-toggle="buttons" class="btn-group btn-radio">
                      <button class="btn btn-white" v-on:click="setCycle('today')" style="width:50px;" data-type="today">오늘</button>
                      <button class="btn btn-white" v-on:click="setCycle('week')" style="width:50px;" data-type="week">주</button>
                      <button class="btn btn-white" v-on:click="setCycle('month')" style="width:50px;" data-type="month">월</button>
                      <button class="btn btn-white" v-on:click="setCycle('all')" style="width:55px;" data-type="all">전체</button>
                    </div>
                  </div>
                  <div class="col-sm-4 pull-right">
                    <div class="input-group">
                      <input type="text" placeholder="성명 or 이메일 or 고객식별ID" v-model="search" v-on:keypress.enter="setSearch(search)" class="form-control"/>
                      <span class="input-group-btn">
                        <button class="btn btn-default" v-on:click="setSearch(search)">검색</button>
                      </span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div class="row">
              <table class="table table-striped table-hover dataTable">
                <thead>
                  <tr>
                    <th>No</th>
                    <th class="pagesubmit sorting" field="order" value="name" >성명</th> <!--@click="sortBy('name')"-->
                    <th class="pagesubmit sorting" field="order" value="lesson_rate">달성률</th> <!-- lesson_rate? -->
                    <th class="pagesubmit sorting text-center" field="order" value="lesson_min">수업</th>
                    <th class="pagesubmit sorting" field="order" value="total_min">전체</th>
                    <th class="pagesubmit sorting" field="order" value="email">고객식별ID</th>
                    <th>학습 레벨</th>
                    <th class="pagesubmit sorting" field="order" value="part">부서</th>
                    <th class="pagesubmit sorting" field="order" value="position">직위<br/>(직책)</th>
                    <th class="pagesubmit sorting" field="order" value="position">사번<br/>(고유값)</th>
                    <th>메모1</th>
                    <th>메모2</th>
                    <th style="width:35%">
                      수업 히스토리(횟수)
                      <div class="pull-right">
                        <div class="square square-empty"></div>
                        <div class="pull-left">미진행</div>
                        <div class="square square-pull"></div>
                        <div class="pull-left">수업완료(3분이상)</div>
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr class="text-center" v-for="(item, index) in items" :key="item.id" v-show="!item.user.name.indexOf(search)">
                    <td>{{ item.user.idx }}</td>
                    <td class="userInfo hover-pointer" @click="openUserInfo(index)">{{ item.user.name }}</td>
                    <td>
                      <span class="lesson-rate">{{ item.attend_pct }}%</span>
                    </td>
                    <td>
                      {{ item.use_ticket_info && item.ticket_summary ? item.goods.charge_plan.secs_per_day*(item.use_ticket_info.length+1) - item.ticket_summary.sum_remain_secs/60 :'-' }}분/
                      {{ item.ticket_summary?item.ticket_summary.use_ticket_cnt:'-'}}회
                    </td>
                    <td>
                      {{ item.ticket_summary ? item.ticket_summary.ticket_cnt*item.goods.charge_plan.secs_per_day/60:'-'}}분/
                      {{ item.ticket_summary ? item.ticket_summary.ticket_cnt:'-'}}회
                    </td>
                    <td></td>
                    <td></td>
                    <td>{{ item.user.department }}</td>
                    <td>{{ item.user.position }}</td>
                    <td>{{ item.user.emp_no }}</td>
                    <td></td>
                    <td></td>
                    <td>
                      <div v-for="i in calBatchDate()" :key="i.id">
                        <div class="square square-pull" v-if="isUseDt(i-1,item.use_ticket_info)"></div>
                        <div class="square square-empty" v-else></div>
                      </div>

                      <!--
                      <div v-if="d_type==='all'">
                        <div v-for="i in item.baseInfo.max_cnt" :key="i.id">
                          <div class="square square-pull" v-if="item.lesson['lesson_cnt_'+i]"></div>
                          <div class="square square-empty" v-else></div>
                        </div>
                      </div>
                      <div v-if="d_type==='month'">
                        <div v-for="i in 31" :key="i.id"> 
                          <div class="square square-pull" style="width:9px" v-if="item.lesson['lesson_cnt_'+i]"></div>
                          <div class="square square-empty" style="width:9px" v-else></div>
                        </div>
                      </div>
                      <div v-if="d_type==='week'" style="width:100%">
                        <div v-for="i in 7" :key="i.id">
                          <div class="square square-pull" style="width:40px" v-if="item.lesson['lesson_cnt_'+i]"></div>
                          <div class="square square-empty" style="width:40px" v-else></div>
                        </div>
                      </div>
                      <div v-if="d_type==='today'">
                        <div v-for="i in 24" :key="i.id">
                          <div class="square square-pull" style="margin:0; width:13px" v-if="item.lesson['lesson_cnt_'+i]"></div>
                          <div class="square square-empty" style="margin:0; width:13px" v-else>{{ i==0 || i==12 || i==24?(i==0?'00':i)+'H':''}}</div>
                        </div>
                      </div>-->
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="row">
          <div class="text-center">
            <Pagination :currentPage="parseInt(current_page)" :totalPage="parseInt(total_page)" @returnPage="setCurrentPage" />
          </div>
        </div>
      </div>
    </div>

    <div class="modal inmodal fade in"  style="display: block;" v-if="showModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header" style="border-bottom:0px;padding-bottom: 15px;">
            <button type="button" class="close" data-dismiss="modal">
              <span aria-hidden="true" @click="closeModal">&times;</span>
              <span class="sr-only">Close</span>
            </button>
            <br />
          </div>
          <div class="modal-body" style="background:#FFFFFF;padding:0;min-height:170px">
            <UserInfo :data="modalitem"/> 
          </div>
          <div class="modal-footer" style="border-top:0px">
            <button data-toggle="modal" data-target="#userUpdateModal" class="btn btn-success userUpdate" style="float:left;" @click="openModify">학생 수정</button>
            <button type="button" class="btn btn-white" data-dismiss="modal" @click="closeModal">닫기</button>
          </div>
          <UserModifyModal v-if="showModify" :item="modalitem" @update="updateItem" @close="openModify"/>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import api from "@/common/api";
import UserInfo from "@/components/atom/UserInfo";
import UserModifyModal from "@/components/atom/UserModifyModal";
import Pagination from "@/components/atom/Pagination";
import moment from 'moment'
import XLSX from 'xlsx'
export default {
  data() {
    return {
      search: '',
      company: '',
      batches: [],
      batch: null,
      items: [],
      current_page: 1,
      total_page: 1,
			moment: moment,

      d_type: "all",
      showModal: false,
      showModify: false,
      UserNum: '',
      modalitem: [],
    };
  },
  components: {
    UserInfo,
    UserModifyModal,
    Pagination,
  },
  async created() {
		const res = await api.get('/partners/reportList', { bbIdx: this.$route.params.bbIdx })
		this.current_page = res.data.orders.current_page
		this.total_page = res.data.orders.last_page
    this.items = res.data.orders.data
    this.company = res.data.company
    this.batches = res.data.batches
    this.batch = this.batches.find(element => element.idx === parseInt(this.$route.params.bbIdx));
  },
  methods: {
    routeDetailPage (event) {
      if(this.batches.length){
        let bbIdx;
        if (event) bbIdx = this.batches[event.target.value].idx;
        else bbIdx = this.batches[0].idx;
        if(bbIdx !== parseInt(this.$route.params.bbIdx)){
          this.$router.push({
              name: 'lessonDetailsList',
              params: { bbIdx:bbIdx }
          })
        }
      }
		},
    setSearch(input) {
      this.search = input;
    },
    sortBy(sortKey) {
      this.sortKey === sortKey ? this.items.reverse() : this.items.sort(function (a, b) {
            return a.userInfo[sortKey] < b.userInfo[sortKey] ? -1 : a.userInfo[sortKey] > b.userInfo[sortKey] ? 1 : 0;
          });
      this.sortKey = sortKey;
    },
    calBatchDate() {
      const a = moment(this.batch.fr_dt);
      const b = moment(this.batch.to_dt);
      return b.diff(a, 'days')+1;
    },
    isUseDt(i,use_ticket_info) {
      if(use_ticket_info.length) {
        for(var element of use_ticket_info) {
          if(moment('2020-11-01').add(i, "days").isSame(element.use_dt,'day')) {
            return true;
          }
        }
        return false;
      } else return false;
    },
    async setCurrentPage(data) {
        this.current_page = data;
    },
    exportExcel() {
      let dataWs = [];
      this.items.forEach((element,index) => {
        dataWs.push({
          '': '',
          '번호': index+1,
          '소속': this.company, 
          '부서': element.userInfo.part,
          '직급': element.userInfo.position,
          '성명': element.userInfo.name,
          '이전 레벨': element.userInfo.firstTest,
          '이전 레벨(점수)': element.userInfo.firstTest.grade,
          '마지막 레벨': element.userInfo.lastTest,
          '마지막 레벨(점수)': element.userInfo.lastTest?element.userInfo.lastTest.grade:'',
          '회차': this.$route.params.c_no,
          '학습시작일': element.userInfo.firstTest.l_dt,
          '학습종료': element.userInfo.lastTest?element.userInfo.lastTest.l_dt:'',
          '학습언어': '',
          '학습구분(수강권)': element.userInfo.title,
          '전체수업수': element.userInfo.total_lesson_cnt,
          '전체수업시간': element.userInfo.total_min,
          '수업진행수': element.userInfo.t_cnt,
          '수업진행시간': element.userInfo.lesson_min,
          '수업참여율': '',
          '학습 목표율': '',//this.baseInfo.target_rate,
          '고객식별ID': element.userInfo.cus_id
        });
      });
      var ws = XLSX.utils.json_to_sheet(dataWs);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws,'수업현황');
      XLSX.writeFile(wb, this.company+' 수업현황 '+this.$route.params.c_no+'주차.xlsx');
    },
    setCycle(type) {
      this.d_type = type;
    },
    openModal() {
      this.$swal({
        title: "학습현황 메일 일괄 발송",
        text: "발송 하시겠습니까? (한번만 누르고 기다려 주세요)",
        icon: "warning",
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
      });
    },
    openUserInfo(index) {
      this.UserNum = index;
      this.modalitem = this.items[this.UserNum];
      this.showModal = !this.showModal;
    },
    closeModal() {
      this.showModal = !this.showModal;
    },
    openModify() {
      this.showModify = !this.showModify;
    },
    updateItem(item) {
      this.items[this.UserNum] = JSON.parse(JSON.stringify(item));
      this.modalitem = this.items[this.UserNum];
    }
  }
};
</script>

<style scoped>
.row {
  width: 100%;
}

.modal {
  background-color: rgba(0, 0, 0, 0.5);
  overflow-y: auto;
  z-index: 1;
}

.s_lesson_dt {
  font-size: 85%;
}
.vertical-timeline-content {
  display: inline;
}
.swal2-container {
  z-index: 300000 !important;
}
</style>