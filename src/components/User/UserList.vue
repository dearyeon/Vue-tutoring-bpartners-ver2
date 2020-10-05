<template>
    <div class="row">
        <div class="col-lg-12">
            <div class="ibox float-e-margins">
                <div class="ibox-title" style="height: 65px">
                    <div class="pull-left">
                        <h2>학생 현황</h2>
                    </div>
                    <div class="pull-right">
                        <a href="" class="btn btn-success btn-outline" data-toggle="tooltip" data-placement="left" title="Refresh inbox"><i class="fa fa-plus"></i> 고객사 등록</a>
                    </div>
                </div>
                <div class="ibox-content m-b-sm border-bottom">
                    <form id="listform">
                        <div class="row">
                            <div class="col-sm-3">
                                <label class="control-label" for="customer_name">검색어</label>
                                <input type="text" placeholder="Search Word" class="form-control" 
                                        v-model="search" v-on:keypress.enter="setSearch(search)" >
                            </div>
                            <div class="col-sm-1" style="margin-top:23px">
                                <button class="btn btn-primary" v-on:click="setSearch(search)">검색</button>
                            </div>
                        </div>
                    </form>
                </div>

                <div>
                    <div class="row">
                        <div v-for="(item, index) in items" :key="item.id"
                        @click="routeDetailPage(index,item.orderList[0].c_no)"
                        v-show="!item.company.indexOf(search) && (index>=(currentPage-1)*30 && index<currentPage*30)">
                        <div class="col-sm-6 col-md-3 col-lg-4">
                            <div class="ibox">
                                <div class="ibox-title">
                                    <div class="col-sm-4" style="padding:0px">
                                        <h4 class="no-margins">{{ item.company }}</h4>
                                        <h6 class="no-margins">{{ item.fr_dt!=0?item.fr_dt:'' }} ~ {{ item.to_dt!=0?item.to_dt:'' }}</h6>
                                    </div>
                                    <div class="col-sm-3" style="padding:0px">
                                            <button data-toggle="dropdown" class="btn btn-default btn-xs dropdown-toggle" v-if="item.orderList.length > 0">
                                                <strong>{{ item.orderList ? item.orderList[0].c_no+'차':'-' }}</strong><span class="caret"></span>
                                            </button>
                                            <ul class="dropdown-menu" v-for="order in item.orderList" :key="order.id">
                                                    <li><a>{{ order.c_no }}차</a></li> <!-- <a href="{{ route('b2b.customer',['bs_idx'=>$item->idx,'bo_idx'=>$order->idx]) }}"> -->
                                            </ul>
                                    </div>
                                    <div class="col-sm-2 text-right" style="padding:0px;margin-top: 1.5px">
                                                <label class="btn-info img-circle text-center no-margins" style="width: 20px;height: 20px" v-if="item.e_cnt>0"><strong>AB</strong></label>
                                                <label class="btn-danger img-circle text-center no-margins" style="width: 20px;height: 20px" v-if="item.c_cnt>0"><strong>中</strong></label>
                                    </div>
                                    <div class="col-sm-3 text-right" style="padding:0px;margin-top: 2px">
                                        <label :class="getstatus(item.status, 1)" style="width:60px;text-align: center">{{ getstatus(item.status, 0) }}</label>
                                    </div>
                                </div>
                                <a style="color:black">
                                    <div class="ibox-content" style="min-height: 300px;padding-bottom: 0px">
                                        <div>
                                            <span>목표 달성률</span>
                                            <div class="stat-percent">{{ item.lesson_rate? item.lesson_rate:0 }}%</div>
                                            <div class="progress progress-mini">
                                                <div class="progress-bar progress-bar-success" :style="getProgressStyle(item.lesson_rate)"> </div>
                                            </div>
                                        </div>
                                        <div class="row m-t-md">
                                            <div class="col-sm-6">
                                                <div><span class="font-bold">수업 랭킹</span>(최근 7일)</div>
                                            </div>
                                            <div class="col-sm-6 text-right">
                                                <div><span class="font-bold">총 인원수</span> {{ item.cnt }}명</div>
                                            </div>
                                        </div>

                                        <div class="row m-t-sm" style="height:210px;">
                                            <div class="full-height-scroll" v-if="item.userList">
                                                    <div class="col-sm-12 p-h-xs" v-for="user in item.userList" :key="user.id">
                                                        <div class="col-sm-2">
                                                            {{ user.id }}위 <!-- 순위 매기는 메서드 작업하기 -->
                                                        </div>
                                                        <div class="col-sm-6">
                                                            <!-- 사진 필요 -->
                                                            <!-- <img alt="image" class="img-circle" src="{{getProfileImage($user->prof_img,'_S')}}" style="width: 20px;height: 20px;" /> -->
                                                            {{ user.name }}
                                                        </div> 
                                                        <div class="col-sm-4 text-right">
                                                            {{ user.lesson_min }}분 / {{ user.total_lesson_cnt }}회 
                                                        </div>
                                                    </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="text-center">
                            <Pagination :totalPage="parseInt(this.items.length/30) + 1" @returnPage="setCurrentPage" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>



<script>
import Pagination from "../Pagination";
export default {
    data() {
        return {
            items: [],
            currentPage: '',
            search: ''
        };
    },
    components: {
        Pagination
    },
    created() {
        this.items = tempItems;
        this.currentPage = 1;
    },
    methods: {
        setSearch(input) {
            this.search = input;
        },
        routeDetailPage(index, c_no) {
            this.$router.push({
                name: "userDetailsList",
                params: { id: index+1, c_no:c_no }
            })
        },
        getstatus(status,value) {
            switch(status) {
            case 1:
                return value ? "b-r-sm bg-warning": "대기중"
            case 2:
                return value ? "b-r-sm bg-primary": "진행중"
            case 3:
                return value ? "b-r-sm bg-success": "완료"
            case 4:
                return value ? "b-r-sm bg-danger": "취소됨"
            }
        },
        getProgressStyle(lesson_rate) {
            return "width:" + (lesson_rate && lesson_rate > 90 ? 100 : lesson_rate) + "%"
        },
        setCurrentPage(data) {
            this.currentPage = data;
        }
    }
}

const tempItems = [
    {
        company: "튜터링 테스트",
        fr_dt: "2020.09.01",
        to_dt: "2020.09.03",
        orderList: [
            { c_no: 11 }, { c_no: 10 }, { c_no: 9 }
        ],
        status: 2,
        e_cnt: 1,
        c_cnt: 1,
        headcount: 0,
        lesson_rate: 70,
        cnt: 0,
        userList: [
            {
                name: "이지희",
                lesson_min: 20,
                total_lesson_cnt: 1
            },
            {
                name: "엔드로",
                lesson_min: '',
                total_lesson_cnt: ''
            }
        ]
    },
    {
        company: "클레어회사",
        orderList: [
            { c_no: 5 }, { c_no: 4 }, { c_no: 3 }
        ],
        status: 3,
        e_cnt: 1,
        c_cnt: 0,
        fr_dt: "2020.04.01",
        to_dt: "2020.06.30",
        headcount: 0,
        lesson_rate: 100,
        cnt: 0,
        userList: [
            {
                name: "김지희",
                lesson_min: 20,
                total_lesson_cnt: 1
            },
            {
                name: "홍길동",
                lesson_min: '',
                total_lesson_cnt: ''
            }
        ]
    },
    {
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
    }
]
</script>