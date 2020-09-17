<template>
    <div class="row">
        <div class="col-lg-12">
            <div class="ibox float-e-margins">
                <div class="ibox-title" style="height: 65px">
                    <div class="pull-left">
                        <h2>수업 현황</h2>
                    </div>
                </div>
            </div>
            <div class="row ibox p-w-md">
                <div class="col-lg-3">
                    <small>총 수업 수(최근 30일)</small>
                    <h2>{{ info.this_month_cnt }}회
                        <small :class="(info.this_month_cnt - info.last_month_cnt)>=0 ? 'text-info':'text-danger'">
                            {{ info.last_month_cnt==0 ? 100:(info.this_month_cnt-info.last_month_cnt)/info.last_month_cnt * 100 }}%(최근 30일 대비)
                        </small>
                    </h2>
                </div>
                <div class="col-lg-3">
                    <small>총 수업 수(최근 7일)</small>
                    <h2>{{ info.this_week_cnt }}회
                        <small :class="info.this_week_cnt - info.last_week_cnt>=0 ? 'text-info':'text-danger'">
                            {{ info.last_week_cnt==0 ? 100:(info.this_week_cnt-info.last_week_cnt)/info.last_week_cnt * 100 }}%(최근 7일 대비)
                        </small>
                    </h2>
                </div>
                <div class="col-lg-3">
                    <small>총 수업 수(최근 3일)</small>
                    <h2>{{ info.this_three_cnt }}회
                        <small :class="info.this_three_cnt - info.last_three_cnt>=0 ? 'text-info':'text-danger'">
                            {{ info.last_three_cnt==0 ? 100:(info.this_three_cnt-info.last_three_cnt)/info.last_three_cnt * 100 }}%(최근 3일 대비)
                        </small>
                    </h2>
                </div>
                <div class="col-lg-3">
                    <small>총 수업 수(오늘)</small>
                    <h2>{{ info.today_cnt }}회 <small class="text-info"> 어제 {{ info.yesterday_cnt }}회</small></h2>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12 sub-title">
                    <div class="ibox-content">
                        <div class="row">
                            <form id="listform"> 
                                <table class="table table-hover dataTable">
                                    <thead>
                                    <tr>
                                        <th style="width:20px"></th>
                                        <th class="pagesubmit sorting" field="order" value="company" @click="sortBy('company')">고객사명</th>
                                        <th class="pagesubmit sorting text-center" field="order" value="max_c_no" @click="sortBy('orderList[0].c_no')">차수</th>
                                        <th class="pagesubmit sorting text-center" field="order" value="status" @click="sortBy('status')">현재상태</th>
                                        <th>과목</th>
                                        <th class="pagesubmit sorting text-center" field="order" value="fr_dt" @click="sortBy('fr_dt')">시작날짜</th>
                                        <th class="pagesubmit sorting text-center" field="order" value="to_dt" @click="sortBy('to_dt')">종료날짜</th>
                                        <th class="pagesubmit sorting text-center" field="order" value="cnt" @click="sortBy('headcount')">인원수</th>
                                        <th class="pagesubmit sorting" field="order" value="lesson_rate" style="width:35%" @click="sortBy('lesson_rate')">수업 달성률</th>
                                    </tr>
                                    </thead>
                                    <tbody>


                                        <tr class="hover-pointer LESSON_INFO" 
                                            v-for="(item, index) in items" :key="`Lesson-${index}`" 
                                            @click="routeDetailPage(index,item.orderList[0].c_no)" v-show="index>=(currentPage-1)*30 && index<currentPage*30">
                                        <div/>
                                            <!-- <td><img alt="image" class="img-rounded" src="{{ $item->prof_img?getSiteImage($item->prof_img,'_S'):getProfileImage('') }}" style="width: 20px;" /></td>   -->
                                            <td>
                                                {{ item.company }}
                                            </td>
                                            <td class="text-center">
                                                <div class="btn-group p-w-xs">
                                                    <button data-toggle="dropdown" class="btn btn-default btn-xs dropdown-toggle">
                                                        <strong>{{ item.orderList?item.orderList[0].c_no+'차':'-' }}</strong><span class="caret"></span>
                                                    </button>
                                                   <!-- <ul class="dropdown-menu">
                                                        <li class="dropdown-menu__item" v-for="value in 10" v-bind:key="value.id">
                                                            <a class="dropdown-menu__link" href="#">   </a>
                                                        </li>
                                                    </ul> -->



                                                </div>
                                            </td>
                                            <td class="text-center">
                                                <label :class="getstatus(item.status, 1)" style="width:60px;text-align: center">{{ getstatus(item.status, 0) }}</label>
                                            </td>
                                            <td class="text-left">
                                                <label class="btn-info img-circle text-center no-margins" style="width: 20px;height: 20px" v-if="item.e_cnt>0"><strong>AB</strong></label>
                                                <label class="btn-danger img-circle text-center no-margins" style="width: 20px;height: 20px" v-if="item.c_cnt>0"><strong>中</strong></label>
                                            </td>
                                            <td class="text-center">{{ item.fr_dt!=0 ? item.fr_dt:'-'}}</td>
                                            <td class="text-center">{{ item.to_dt!=0 ? item.to_dt:'-'}}</td>
                                            <td class="text-center">{{ item.headcount }}명</td>
                                            <td>
                                                <div class="progress progress-striped active no-margins">
                                                    <span class="progress-value" value="item.lesson_rate">{{ item.lesson_rate? item.lesson_rate : 0 }}%</span>
                                                    <div class="progress-bar progress-bar-success" :style="getProgressStyle(item.lesson_rate)"> </div>
                                                </div>
                                            </td>
                                        </tr>


                                    </tbody>
                                </table>
                            </form>
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
export default {
    data() {
        return {
            info: [],
            items: [],
            currentPage: '',
            totalPage: '',
            sortKey: ''
        };
    },
    created() {
        this.items = tempData;
        this.info = tempInfo;
        this.totalPage = parseInt(this.items.length/30) + 1;
        this.currentPage = 1;
    },
    methods: {
        routeDetailPage(index, c_no) {
            this.$router.push({path: '/lessonDetailsList/'+(index+1)+'/'+c_no});
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
        sortBy(sortKey) {
            (this.sortKey === sortKey) ? this.items.reverse() : ( this.items.sort(function(a, b) {
                return a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0;
            }))
            this.sortKey = sortKey;
        },
        setPage(page_num) {
            if(page_num > 0 && page_num <= this.totalPage) {
                this.currentPage = page_num;
            }
        }
    }
}

const tempInfo = {
        this_month_cnt: 10,
        last_month_cnt: 5,
        this_week_cnt: 20,
        last_week_cnt: 25,
        this_three_cnt: 30,
        last_three_cnt: 30,
        today_cnt: 40,
        yesterday_cnt: 50
}

const tempData = [
    {
        company: "튜터링 테스트",
        orderList: [
            { c_no: 11 }, { c_no: 10 }, { c_no: 9 }
        ],
        status: 2,
        e_cnt: 1,
        c_cnt: 1,
        fr_dt: "2020.09.01",
        to_dt: "2020.09.03",
        headcount: 0,
        lesson_rate: 70
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
        lesson_rate: 100
    }
]
</script>

<style lang="css">

</style>