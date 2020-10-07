<template>
    <div class="row">
        <div class="col-lg-12">
            <div class="ibox float-e-margins">
                <div class="ibox-title" style="height: 65px">
                    <div class="pull-left">
                        <h2>학생 현황</h2>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-8 sub-title">
                    <div class="ibox">
                        <div class="ibox-content">
                            <form id="listform">
                                <div class="row">
                                    <div class="col-lg-12">
                                        <div class="col-sm-6">
                                            <h1>
                                                {{ baseInfo ? baseInfo.company : '' }}
                                                <div class="btn-group p-w-xs" style="vertical-align: bottom;">
                                                    <button data-toggle="dropdown" class="btn btn-default btn-sm dropdown-toggle">
                                                        <strong>{{ baseInfo.c_no+'차' }}</strong><span class="caret"></span>
                                                    </button>
                                                    <ul class="dropdown-menu">
                                                        <!-- 커스텀 필요
                                                        @forelse($baseInfo->orderList as $order)
                                                            <li><a href="{{ route('b2b.user',['bs_idx'=>$filters['bs_idx'],'bo_idx'=>$order->idx]) }}">{{$order->c_no}}차</a></li>
                                                        @empty
                                                        @endforelse
                                                        -->
                                                    </ul>
                                                </div>
                                            </h1>
                                        </div>
                                        <div class="col-sm-5 pull-right">
                                            <div class="input-group">
                                                <input type="text" placeholder="성명 or 이메일 or 고객식별ID" class="form-control"
                                                        v-model="search" v-on:keypress.enter="setSearch(search)">
                                                <span class="input-group-btn">
                                                    <button id="search" class="btn btn-default"> 검색</button>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <table class="table table-striped table-hover dataTable" style="font-size: 10px">
                                        <thead>
                                        <tr>
                                            <th>No</th>
                                            <th style="width:20px"></th>
                                            <th class="pagesubmit sorting" field="order" value="name" @click="sortBy('name')">성명</th>
                                            <th class="pagesubmit sorting" field="order" value="lesson_rate" @click="sortBy('target_rate')" style="width:65px">달성률</th>
                                            <th class="pagesubmit sorting" field="order" value="lesson_min" @click="sortBy('lesson_min')">수업시간</th>
                                            <th class="pagesubmit sorting" field="order" value="mode" @click="sortBy('e_cnt')">과목</th>
                                            <th>이전 레벨</th>
                                            <th>마지막 레벨</th>
                                            <th>고객식별ID</th>
                                            <th class="pagesubmit sorting" field="order" value="part" @click="sortBy('part')">부서(학과)</th>
                                            <th class="pagesubmit sorting" field="order" value="position" @click="sortBy('position')">직급(직책)</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            <tr class="hover-pointer userInfo" v-for="(item, index) in items" :key="item.id" 
                                                v-show="getPage(item, index)">
                                                <td>{{ index+1 }}</td>
                                                <td></td><!-- 이미지 추가 필요 <img alt="image" class="img-circle" src="{{getProfileImage($item->prof_img,'_S')}}" style="width: 20px;height: 20px" /> -->
                                                <td @click="openUserInfo(index)">{{ item.userInfo.name }}</td>
                                                <td>
                                                    <div class="pull-left">
                                                        <!-- <span class="pie">{{ item.lesson_min ? item.lesson_min:0 }}/{{ item.total_min ? item.total_min:1}}</span> -->
                                                    </div>
                                                    <div class="pull-right">
                                                        <span class="lesson-rate">{{ item.baseInfo.target_rate? item.baseInfo.target_rate+'%':'' }}</span>
                                                    </div>
                                                </td>
                                                <td>{{ item.userInfo.lesson_min? item.userInfo.lesson_min+'분':'-'}} / {{ item.userInfo.total_lesson_cnt? item.userInfo.total_lesson_cnt+'회':'-'}}</td>
                                                <td>
                                                    <label class="btn-info img-circle text-center no-margins" style="width: 14px;height: 14px" v-if="item.e_cnt>0"><strong>AB</strong></label>
                                                    <label class="btn-danger img-circle text-center no-margins" style="width: 14px;height: 14px" v-if="item.c_cnt>0"><strong>中</strong></label>
                                                </td>
                                                <td>{{ item.userInfo.firstTest.grade }}</td>
                                                <td><div v-if="item.userInfo.lastTest">{{ item.userInfo.lastTest.grade }}</div></td>
                                                <td>{{ item.userInfo.cus_id }}</td>
                                                <td>{{ item.userInfo.part }}</td>
                                                <td>{{ item.userInfo.position }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </form>
                            <div>
                                <div class="row">
                                    <div class="text-center">
                                        <Pagination :totalPage="parseInt(this.items.length/30) + 1" @returnPage="setCurrentPage" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-4">
                    <div class="ibox" style="height:100%;">
                      <div class="col-sm-12" style="height:100%;">
                        <div class="ibox-content" style="min-height: 900px; overflow:auto; margin:0px -15px;">
                          <button class="btn btn-default btn-xs pull-right exportReviewList" @click="openModify">학생 수정</button>
                          <div style="margin:0px -20px">
                            <UserInfo :data="items[UserNum]" :comp="1"/>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
            </div>
        </div>
        <UserModifyModal v-if="showModify" :item="items[UserNum]" @update="updateItem" @close="openModify"/>
    </div>
</template>


<script>
import UserInfo from "@/components/atom/UserInfo";
import UserModifyModal from "@/components/atom/UserModifyModal";
import Pagination from "../Pagination";
export default {
    data() {
        return {
            baseInfo: [],
            search: '',
            items: [],
            UserNum: '',
            currentPage: '',
            sortKey: '',
            showModify: false,
        };
    },
    components: {
        UserInfo,
        UserModifyModal,
        Pagination
    },
    created() {
        this.baseInfo = tempItems[0].baseInfo;
        this.items = tempItems;
        this.UserNum = 0;
        this.currentPage = 1;
    },
    methods: {
        setSearch(input) {
            this.search = input;
        },
        sortBy(sortKey) {
            this.sortKey === sortKey ? this.items.reverse() : this.items.sort(function (a, b) {
                    return a.userInfo[sortKey] < b.userInfo[sortKey] ? -1 : a.userInfo[sortKey] > b.userInfo[sortKey] ? 1 : 0;
                });
            this.sortKey = sortKey;
        },
        setCurrentPage(data) {
            this.currentPage = data;
        },
        getPage(item, index) {
            return (!item.userInfo.name.indexOf(this.search) || !item.userInfo.cus_id.indexOf(this.search) || !item.baseInfo.email.indexOf(this.search)) && (index>=(this.currentPage-1)*30 && index<this.currentPage*30)
        },
        openUserInfo(index) {
          this.UserNum = index;
          this.modalitem = this.items[this.UserNum];
        },
        openModify() {
          this.showModify = !this.showModify;
        },
        updateItem(item) {
          this.items[this.UserNum] = JSON.parse(JSON.stringify(item));
        }
    }
}

const tempItems = [
{
  baseInfo: {
    company: "에스에이치엔엠",
    target_rate: 90,
    prof_img: null,
    u_img: null,
    name: "장혜진",
    tel: null,
    email: "soongsiledu@gmail.com",
    part: null,
    del_yn: 0,
    status: 3,
    fr_dt: "2020.04.07",
    to_dt: "2020.04.30",
    c_no: 1,
    bo_idx: 408,
    orderList: [
      {
        idx: 551,
        c_no: 8,
      },
      {
        idx: 535,
        c_no: 7,
      },
      {
        idx: 515,
        c_no: 6,
      },
      {
        idx: 493,
        c_no: 5,
      },
      {
        idx: 473,
        c_no: 4,
      },
      {
        idx: 442,
        c_no: 3,
      },
      {
        idx: 441,
        c_no: 2,
      },
      {
        idx: 408,
        c_no: 1,
      },
    ],
    cnt: 1,
    fr: "2020-04-07",
    to: "2020-04-30",
    dateDiff: 23,
    max_cnt: 23,
  },
  userInfo: {
    name: "박소현",
    cus_id: "PY55NQ4P",
    prof_img: null,
    com_img: null,
    lesson_fee: 0,
    personal_charge: 0,
    part: "",
    position: "사원",
    memo: "",
    title: "[B2B] Native 1개월 3회(20분)",
    del_yn: 0,
    t_cnt: 1,
    d_cnt: 0,
    lesson_min: "60",
    total_lesson_cnt: "3",
    total_min: "60",
    firstTest: {
      l_dt: "2018-07-30 20:05:01",
      grade: "초급 중",
      point_0_title: "발음",
      point_0: 5,
      point_1_title: "문법",
      point_1: 4,
      point_2_title: "어휘",
      point_2: 5,
      point_3_title: "이해",
      point_3: 4,
      point_4_title: "자신감",
      point_4: 6,
      total_point: 24,
    },
    lastTest: null,
  },
  lesson: {
    u_idx: 980367,
    lesson_cnt_0: 2,
    lesson_sec_0: "2403",
    lesson_cnt_1: 1,
    lesson_sec_1: "1203",
    lesson_cnt_2: 0,
    lesson_sec_2: "0",
    lesson_cnt_3: 0,
    lesson_sec_3: "0",
    lesson_cnt_4: 0,
    lesson_sec_4: "0",
    lesson_cnt_5: 0,
    lesson_sec_5: "0",
    lesson_cnt_6: 0,
    lesson_sec_6: "0",
    lesson_cnt_7: 0,
    lesson_sec_7: "0",
    lesson_cnt_8: 0,
    lesson_sec_8: "0",
    lesson_cnt_9: 0,
    lesson_sec_9: "0",
    lesson_cnt_10: 0,
    lesson_sec_10: "0",
    lesson_cnt_11: 0,
    lesson_sec_11: "0",
    lesson_cnt_12: 0,
    lesson_sec_12: "0",
    lesson_cnt_13: 0,
    lesson_sec_13: "0",
    lesson_cnt_14: 1,
    lesson_sec_14: "0",
    lesson_cnt_15: 0,
    lesson_sec_15: "0",
    lesson_cnt_16: 0,
    lesson_sec_16: "0",
    lesson_cnt_17: 0,
    lesson_sec_17: "0",
    lesson_cnt_18: 0,
    lesson_sec_18: "0",
    lesson_cnt_19: 0,
    lesson_sec_19: "0",
    lesson_cnt_20: 0,
    lesson_sec_20: "0",
    lesson_cnt_21: 0,
    lesson_sec_21: "0",
    lesson_cnt_22: 0,
    lesson_sec_22: "0",
    lesson_cnt_23: 0,
    lesson_sec_23: "0",
  },
  tooltipText: [
    "2020-04-07",
    "2020-04-08",
    "2020-04-09",
    "2020-04-10",
    "2020-04-11",
    "2020-04-12",
    "2020-04-13",
    "2020-04-14",
    "2020-04-15",
    "2020-04-16",
    "2020-04-17",
    "2020-04-18",
    "2020-04-19",
    "2020-04-20",
    "2020-04-21",
    "2020-04-22",
    "2020-04-23",
    "2020-04-24",
    "2020-04-25",
    "2020-04-26",
    "2020-04-27",
    "2020-04-28",
    "2020-04-29",
    "2020-04-30",
  ],
  review: [
    {
      name: "Florence",
      prof_img: "20170718103029_596d64b59732b",
      lesson_min: "20",
      lesson_dt: "2020-04-08 07:51 AM",
      comment:
        "Good day! You did a good job during our discussion! Please pay closer attention with (verb tense s/ articles/ prepositions). Try to practice words with (/p/ and /f/, /r/ and /l/ etc) sounds to avoid pronunciation slips. However, I know that you could do better next time. I believe that you can still shape up your skills. You can do it! Enjoy your day!",
    },
    {
      name: "Sheral",
      prof_img: "20190626194937_5d134dc105165",
      lesson_min: "20",
      lesson_dt: "2020-04-07 09:20 PM",
      comment:
        "Joe it was such a pleasure to have you on call today. I really enjoyed playing the guessing game with you today. Have a great night tonight and I hope to speak with you again soon!",
    },
    {
      name: "Keeaasha",
      prof_img: "20200523213926_5ec9197ec7c2b.jpeg",
      lesson_min: "20",
      lesson_dt: "2020-04-07 03:53 PM",
      comment:
        "Joy it has been a plleasure having you as my student. Wonderful reading and pronunciation skills. You did well in this topic and I hope that we have many more classes together.",
    }
  ],
},
{
  baseInfo: {
    company: "튜터링 회사",
    target_rate: 90,
    prof_img: null,
    u_img: null,
    name: "엔드로",
    tel: null,
    email: "soongsiledu@gmail.com",
    part: null,
    del_yn: 0,
    status: 3,
    fr_dt: "2020.04.07",
    to_dt: "2020.04.30",
    c_no: 2,
    bo_idx: 408,
    orderList: [
      {
        idx: 551,
        c_no: 8,
      },
      {
        idx: 535,
        c_no: 7,
      },
      {
        idx: 515,
        c_no: 6,
      },
      {
        idx: 493,
        c_no: 5,
      },
      {
        idx: 473,
        c_no: 4,
      },
      {
        idx: 442,
        c_no: 3,
      },
      {
        idx: 441,
        c_no: 2,
      },
      {
        idx: 408,
        c_no: 1,
      },
    ],
    cnt: 2,
    fr: "2020-04-07",
    to: "2020-04-30",
    dateDiff: 23,
    max_cnt: 23,
  },
  userInfo: {
    name: "앤드로",
    cus_id: "PY55NQ4A",
    prof_img: null,
    com_img: null,
    lesson_fee: 0,
    personal_charge: 0,
    part: "미디어)마케팅3팀",
    position: "G5",
    memo: "",
    title: "[B2B] Global 1개월 3회(20분)",
    del_yn: 0,
    t_cnt: 1,
    d_cnt: 0,
    lesson_min: "60",
    total_lesson_cnt: "3",
    total_min: "60",
    firstTest: {
      l_dt: "2018-07-30 20:05:01",
      grade: "중급 상",
      point_0_title: "발음",
      point_0: 3,
      point_1_title: "문법",
      point_1: 2,
      point_2_title: "어휘",
      point_2: 5,
      point_3_title: "이해",
      point_3: 4,
      point_4_title: "자신감",
      point_4: 5,
      total_point: 24,
    },
    lastTest: {
      l_dt: "2018-07-30 20:05:01",
      grade: "중급 상",
      point_0_title: "발음",
      point_0: 9,
      point_1_title: "문법",
      point_1: 4,
      point_2_title: "어휘",
      point_2: 5,
      point_3_title: "이해",
      point_3: 5,
      point_4_title: "자신감",
      point_4: 6,
      total_point: 24,
    },
  },
  lesson: {
    u_idx: 980367,
    lesson_cnt_0: 2,
    lesson_sec_0: "2403",
    lesson_cnt_1: 1,
    lesson_sec_1: "1203",
    lesson_cnt_2: 0,
    lesson_sec_2: "0",
    lesson_cnt_3: 0,
    lesson_sec_3: "0",
    lesson_cnt_4: 0,
    lesson_sec_4: "0",
    lesson_cnt_5: 0,
    lesson_sec_5: "0",
    lesson_cnt_6: 0,
    lesson_sec_6: "0",
    lesson_cnt_7: 0,
    lesson_sec_7: "0",
    lesson_cnt_8: 0,
    lesson_sec_8: "0",
    lesson_cnt_9: 0,
    lesson_sec_9: "0",
    lesson_cnt_10: 0,
    lesson_sec_10: "0",
    lesson_cnt_11: 0,
    lesson_sec_11: "0",
    lesson_cnt_12: 0,
    lesson_sec_12: "0",
    lesson_cnt_13: 0,
    lesson_sec_13: "0",
    lesson_cnt_14: 0,
    lesson_sec_14: "0",
    lesson_cnt_15: 0,
    lesson_sec_15: "0",
    lesson_cnt_16: 0,
    lesson_sec_16: "0",
    lesson_cnt_17: 0,
    lesson_sec_17: "0",
    lesson_cnt_18: 0,
    lesson_sec_18: "0",
    lesson_cnt_19: 0,
    lesson_sec_19: "0",
    lesson_cnt_20: 0,
    lesson_sec_20: "0",
    lesson_cnt_21: 0,
    lesson_sec_21: "0",
    lesson_cnt_22: 1,
    lesson_sec_22: "0",
    lesson_cnt_23: 1,
    lesson_sec_23: "0",
  },
  tooltipText: [
    "2020-04-07",
    "2020-04-08",
    "2020-04-09",
    "2020-04-10",
    "2020-04-11",
    "2020-04-12",
    "2020-04-13",
    "2020-04-14",
    "2020-04-15",
    "2020-04-16",
    "2020-04-17",
    "2020-04-18",
    "2020-04-19",
    "2020-04-20",
    "2020-04-21",
    "2020-04-22",
    "2020-04-23",
    "2020-04-24",
    "2020-04-25",
    "2020-04-26",
    "2020-04-27",
    "2020-04-28",
    "2020-04-29",
    "2020-04-30",
  ],
  review: [
    {
      name: "Florence",
      prof_img: "20170718103029_596d64b59732b",
      lesson_min: "20",
      lesson_dt: "2020-04-08 07:51 AM",
      comment:
        "Good day! You did a good job during our discussion! Please pay closer attention with (verb tense s/ articles/ prepositions). Try to practice words with (/p/ and /f/, /r/ and /l/ etc) sounds to avoid pronunciation slips. However, I know that you could do better next time. I believe that you can still shape up your skills. You can do it! Enjoy your day!",
    },
    {
      name: "Sheral",
      prof_img: "20190626194937_5d134dc105165",
      lesson_min: "20",
      lesson_dt: "2020-04-07 09:20 PM",
      comment:
        "Joe it was such a pleasure to have you on call today. I really enjoyed playing the guessing game with you today. Have a great night tonight and I hope to speak with you again soon!",
    },
    {
      name: "Keeaasha",
      prof_img: "20200523213926_5ec9197ec7c2b.jpeg",
      lesson_min: "20",
      lesson_dt: "2020-04-07 03:53 PM",
      comment:
        "Joy it has been a plleasure having you as my student. Wonderful reading and pronunciation skills. You did well in this topic and I hope that we have many more classes together.",
    },
  ],
}
];
</script>


<style scoped>
.dl-horizontal{
    height: 50px;
    margin-top: 25px;
    margin-bottom: 15px;
}
.dl-horizontal dt{
    width:50px;
}
.dl-horizontal dd{
    margin-left:55px;
}
</style>