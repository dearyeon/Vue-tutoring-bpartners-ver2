<template>
    <div class="row">
  <Modal @close="openUserInfo" v-if="showModal"></Modal>   
        <div class="col-lg-12">
            <div class="ibox float-e-margins">
                <div class="ibox-title" style="height: 65px">
                    <div class="pull-left">
                        <h2>수업 현황</h2>
                    </div>
                    <div class="pull-right">
                        <a id="btnSendOrderEmailLessonStatus" class="btn btn-success btn-w-m" @click="openModal">학습현황 메일 일괄 발송</a>
                        <a id="exportLessonList" class="btn btn-success btn-w-m">엑셀 다운로드</a>
                       
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
                                        <h1>
                                            {{ baseInfo ? baseInfo.company : ''}}
                                            <div class="btn-group p-w-xs" style="vertical-align: bottom;">
                                                <button data-toggle="dropdown" class="btn btn-default btn-sm dropdown-toggle">
                                                    <strong>{{ baseInfo.c_no }}차</strong><span class="caret"></span>
                                                </button>
                                                <ul class="dropdown-menu">
                                                    <!--
                                                    @forelse($baseInfo->orderList as $order)
                                                        <li><a href="{{ route('b2b.lesson',['bs_idx'=>$filters['bs_idx'],'bo_idx'=>$order->idx]) }}">{{$order->c_no}}차</a></li>
                                                    @empty
                                                    @endforelse-->
                                                </ul>
                                            </div>
                                        </h1>
                                    </div>
                                    <div class="col-sm-4" >
                                        <div data-toggle="buttons" class="btn-group btn-radio">
                                            <button class="btn btn-white" v-on:click="setCycle('today')" style="width:50px;" data-type="today">오늘</button>
                                            <button class="btn btn-white" v-on:click="setCycle('week')" style="width:50px;" data-type="week">주</button>
                                            <button class="btn btn-white" v-on:click="setCycle('month')" style="width:50px;" data-type="month">월</button>
                                            <button class="btn btn-white" v-on:click="setCycle('all')" style="width:55px;" data-type="all">전체</button>
                                        </div>
                                    </div>
                                    <div class="col-sm-4 pull-right">
                                        <div class="input-group">
                                            <input type="text" placeholder="성명 or 이메일 or 고객식별ID" v-model="search" v-on:keypress.enter="setSearch(search)" class="form-control">
                                            <span class="input-group-btn">
                                                <button class="btn btn-default" v-on:click="setSearch(search)"> 검색</button>
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
                                    <th style="width:20px"></th>
                                    <th class="pagesubmit sorting" field="order" value="name" @click="sortBy('name')">성명</th>
                                    <th class="pagesubmit sorting" field="order" value="lesson_rate" @click="sortBy('lesson_rate')">달성률</th>
                                    <th class="pagesubmit sorting" field="order" value="lesson_min" @click="sortBy('lesson_min')">수업</th>
                                    <th class="pagesubmit sorting" field="order" value="total_min" @click="sortBy('total_min')">전체</th>
                                    <th class="pagesubmit sorting" field="order" value="email" @click="sortBy('cus_id')">고객식별ID</th>
									<th>이전 레벨</th>
									<th>마지막 레벨</th>
                                    <th class="pagesubmit sorting" field="order" value="part" @click="sortBy('part')">부서<br>(학과)</th>
                                    <th class="pagesubmit sorting" field="order" value="position" @click="sortBy('position')">직급<br>(직책)</th>
                                    <th style="width:35%">수업 히스토리(횟수)
                                        <div class="pull-right">
                                            <div class="square square-empty"></div>
                                            <div class="pull-left">미진행</div>
                                            <div class="square square-pull"></div>
                                            <div class="pull-left">수업완료(3분이상)</div>
                                        </div>
                                    </th>
                                </tr>
                                </thead>
                                
                                <tbody >
                                    
                                    <tr v-for="(item, index) in items" :key="item.id" 
                                        v-show="(!item.name.indexOf(search) || !item.cus_id.indexOf(search) || !item.email.indexOf(search)) && (index>=(currentPage-1)*30 && index<currentPage*30)">
                                        <td>{{ index + 1 }}</td>
                                        <td>사</td>
                                        <!-- <td><img alt="image" class="img-circle" src="{{getProfileImage($item->prof_img,'_S')}}" style="width: 20px;height:20px;" /></td>-->
                                        <td class="userInfo hover-pointer" @click="openUserInfo">{{ item.name }}</td>
                                        <td>
                                            <!--<span class="pie-chart-label">{{ item.lesson_min? item.lesson_min:0 }}/{{ item.total_min? item.total_min:1 }}</span>-->
                                            <span class="lesson-rate">{{ item.lesson_rate? item.lesson_rate+'%':'' }}</span>
                                        </td>
                                        <td>{{ item.lesson_min? item.lesson_min+'분':'-'}} / {{ item.total_lesson_cnt? item.total_lesson_cnt+'회':'-'}}</td>
                                        <td>{{ item.total_min? item.total_min+'분':''}} / {{ item.ticket_cnt? item.ticket_cnt+'회':'-'}}</td>
                                        <td>{{ item.cus_id }}</td>
                                        <td>{{ item.firstTest }}</td>
                                        <td>{{ item.lastTest }}</td>
                                        <td>{{ item.part }}</td>
                                        <td>{{ item.position }}</td>
                                        <td>   
                                            <div v-if="d_type==='all'">
                                                <div v-for="i in baseInfo.max_cnt" :key="i.id">
                                                    <div class="square square-pull" v-if="item.lesson_cnt[i]"></div>
                                                    <div class="square square-empty" v-else></div>
                                                </div>
                                            </div>                                            
                                            <div v-if="d_type==='month'">
                                                <div v-for="i in 31" :key="i.id">
                                                    <div class="square square-pull" style="width:9px" v-if="item.lesson_cnt[i]"></div>
                                                    <div class="square square-empty" style="width:9px" v-else></div>
                                                </div>
                                            </div>
                                            <div v-if="d_type==='week'" style="width:100%">
                                                <div v-for="i in 7" :key="i.id">
                                                    <div class="square square-pull" style="width:40px" v-if="item.lesson_cnt[i]"></div>
                                                    <div class="square square-empty" style="width:40px" v-else></div>
                                                </div>
                                            </div>
                                            <div v-if="d_type==='today'"> 
                                                <div v-for="i in 24" :key="i.id">
                                                    <div class="square square-pull" style="margin:0; width:13px" v-if="item.lesson_cnt[i]"></div>
                                                    <div class="square square-empty" style="margin:0; width:13px" v-else>{{ i==0 || i==12 || i==24?(i==0?'00':i)+'H':''}}</div>
                                                </div>
                                            </div>
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
                        <ul class="pagination">
                            <li><a rel="prev" @click="setPage(currentPage-1)">&laquo;</a></li>
                            <li :class="(currentPage===pn)?'active':''" v-for="pn in totalPage" :key="pn">
                                <a @click="setPage(pn)">{{ pn }}</a>
                            </li>
                            <li><a rel="next" @click="setPage(currentPage+1)">&raquo;</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
//import api from "@/common/api";
import Modal from "@/components/Lesson/UserInfoModal";
export default {
    data() {
        return {
            search: '',
            baseInfo: [],
            items: [],
            d_type: "all",
            currentPage: '',
            totalPage: '',
            sortKey: '',
            showModal: false
        };
    },
    props: {
      id: {
        type: String,
        required: true,
      },
      c_no: {
        type: String,
        required: true
      }
    },
    components: {
        Modal
    },
    created() {
        this.baseInfo = baseInfotemp.baseInfo;
        this.items = tempItems;
        this.totalPage = parseInt(this.items.length/30) + 1;
        this.currentPage = 1;
    },

    methods: {
        setCycle(type) {
           this.d_type = type;
        },
        setSearch(input) {
            this.search = input;
        },
        setPage(page_num) {
            if(page_num > 0 && page_num <= this.totalPage) {
                this.currentPage = page_num;
            }
        },
        sortBy(sortKey) {
            (this.sortKey === sortKey) ? this.items.reverse() : ( this.items.sort(function(a, b) {
                return a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0;
            }))
            this.sortKey = sortKey;
        },
        openModal() {
            this.$swal({
                title: "학습현황 메일 일괄 발송",
                text: "발송 하시겠습니까? (한번만 누르고 기다려 주세요)",
                icon: 'warning',
                showCancelButton: true,
                showCloseButton: true,
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel'
            });
        },
        openUserInfo() {
            this.showModal = !this.showModal;
        } 
    }
}


const baseInfotemp = {
    baseInfo: {
        "company": "에스에이치엔엠",
        "target_rate": 90,
        "prof_img": null,
        "u_img": null,
        "name": "장혜진",
        "tel": null,
        "email": "soongsiledu@gmail.com",
        "part": null,
        "del_yn": 0,
        "status": 3,
        "fr_dt": "2020.04.07",
        "to_dt": "2020.04.30",
        "c_no": 1,
        "bo_idx": 408,
        "orderList": [
            {
            "idx": 551,
            "c_no": 8
            },
            {
            "idx": 535,
            "c_no": 7
            },
            {
            "idx": 515,
            "c_no": 6
            },
            {
            "idx": 493,
            "c_no": 5
            },
            {
            "idx": 473,
            "c_no": 4
            },
            {
            "idx": 442,
            "c_no": 3
            },
            {
            "idx": 441,
            "c_no": 2
            },
            {
            "idx": 408,
            "c_no": 1
            }
        ],
        "cnt": 3,
        "fr": "2020-04-07",
        "to": "2020-04-30",
        "dateDiff": 23,
        "max_cnt": 23
    },
    "userInfo": {
        "name": "박소현",
        "cus_id": "PY55NQ4P",
        "prof_img": null,
        "com_img": null,
        "lesson_fee": 0,
        "personal_charge": 0,
        "part": "에스에이치앤엠",
        "position": "사원",
        "memo": "",
        "title": "[B2B] Native 1개월 3회(20분)",
        "del_yn": 0,
        "t_cnt": 1,
        "d_cnt": 0,
        "lesson_min": "60",
        "total_lesson_cnt": "3",
        "total_min": "60",
        "firstTest": {
            "l_dt": "2018-07-30 20:05:01",
            "grade": "초급 중",
            "point_0_title": "발음",
            "point_0": 5,
            "point_1_title": "문법",
            "point_1": 4,
            "point_2_title": "어휘",
            "point_2": 5,
            "point_3_title": "이해",
            "point_3": 4,
            "point_4_title": "자신감",
            "point_4": 6,
            "total_point": 24
        },
        "lastTest": null
    },
    "lesson": {
        "u_idx": 980367,
        "lesson_cnt_0": 2,
        "lesson_sec_0": "2403",
        "lesson_cnt_1": 1,
        "lesson_sec_1": "1203",
        "lesson_cnt_2": 0,
        "lesson_sec_2": "0",
        "lesson_cnt_3": 0,
        "lesson_sec_3": "0",
        "lesson_cnt_4": 0,
        "lesson_sec_4": "0",
        "lesson_cnt_5": 0,
        "lesson_sec_5": "0",
        "lesson_cnt_6": 0,
        "lesson_sec_6": "0",
        "lesson_cnt_7": 0,
        "lesson_sec_7": "0",
        "lesson_cnt_8": 0,
        "lesson_sec_8": "0",
        "lesson_cnt_9": 0,
        "lesson_sec_9": "0",
        "lesson_cnt_10": 0,
        "lesson_sec_10": "0",
        "lesson_cnt_11": 0,
        "lesson_sec_11": "0",
        "lesson_cnt_12": 0,
        "lesson_sec_12": "0",
        "lesson_cnt_13": 0,
        "lesson_sec_13": "0",
        "lesson_cnt_14": 0,
        "lesson_sec_14": "0",
        "lesson_cnt_15": 0,
        "lesson_sec_15": "0",
        "lesson_cnt_16": 0,
        "lesson_sec_16": "0",
        "lesson_cnt_17": 0,
        "lesson_sec_17": "0",
        "lesson_cnt_18": 0,
        "lesson_sec_18": "0",
        "lesson_cnt_19": 0,
        "lesson_sec_19": "0",
        "lesson_cnt_20": 0,
        "lesson_sec_20": "0",
        "lesson_cnt_21": 0,
        "lesson_sec_21": "0",
        "lesson_cnt_22": 0,
        "lesson_sec_22": "0",
        "lesson_cnt_23": 0,
        "lesson_sec_23": "0"
    },
    "tooltipText": [
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
        "2020-04-30"
    ],
    "review": [
        {
        "name": "Florence",
        "prof_img": "20170718103029_596d64b59732b",
        "lesson_min": "20",
        "lesson_dt": "2020-04-08 07:51 AM",
        "comment": "Good day! You did a good job during our discussion! Please pay closer attention with (verb tense s/ articles/ prepositions). Try to practice words with (/p/ and /f/, /r/ and /l/ etc) sounds to avoid pronunciation slips. However, I know that you could do better next time. I believe that you can still shape up your skills. You can do it! Enjoy your day!"
        },
        {
        "name": "Sheral",
        "prof_img": "20190626194937_5d134dc105165",
        "lesson_min": "20",
        "lesson_dt": "2020-04-07 09:20 PM",
        "comment": "Joe it was such a pleasure to have you on call today. I really enjoyed playing the guessing game with you today. Have a great night tonight and I hope to speak with you again soon!"
        },
        {
        "name": "Keeaasha",
        "prof_img": "20200523213926_5ec9197ec7c2b.jpeg",
        "lesson_min": "20",
        "lesson_dt": "2020-04-07 03:53 PM",
        "comment": "Joy it has been a plleasure having you as my student. Wonderful reading and pronunciation skills. You did well in this topic and I hope that we have many more classes together."
        }
    ]
}

const tempItems = [
    {
        //prof_img = "",
        idx: 1,
        name: "이지희",
        email: "a",
        lesson_rate: 1,
        lesson_min: 20,
        total_lesson_cnt: 1,
        total_min: 180,
        ticket_cnt: 9,
        cus_id: "P2M4D6DP",
        firstTest: "중급 상",
        lastTest: "",
        part: "",
        position: "",
        lesson_cnt: [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0]
    },
    {
        //prof_img = "",
        idx: 2,
        name: "엔드로",
        email: "b",
        lesson_rate: '',
        lesson_min: '',
        total_lesson_cnt: '',
        total_min: 2,
        ticket_cnt: 5,
        cus_id: "P2M4D6DP",
        firstTest: "",
        lastTest: "",
        part: "",
        position: "",
        lesson_cnt: [ 0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0]
    }
]

</script>

<style scoped>
.row {
    width: 100%;
}
</style>