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
                                        <th class="pagesubmit sorting text-center" field="order" value="max_c_no" @click="sortBy('c_no')">차수</th>
                                        <th class="pagesubmit sorting text-center" field="order" value="status">현재상태</th> <!--@click="sortBy('status')"-->
                                        <th>과목</th>
                                        <th class="pagesubmit sorting text-center" field="order" value="fr_dt" @click="sortBy('fr_dt')">시작날짜</th>
                                        <th class="pagesubmit sorting text-center" field="order" value="to_dt" @click="sortBy('to_dt')">종료날짜</th>
                                        <th class="pagesubmit sorting text-center" field="order" value="cnt" @click="sortBy('usersCnt')">인원수</th>
                                    </tr>
                                    </thead>
                                    <tbody>


                                        <tr class="hover-pointer LESSON_INFO" 
                                            v-for="(item, index) in items" :key="`Lesson-${index}`"> <!--v-show="perPage(index)"-->
                                            <td><!--<img alt="image" class="img-rounded" src="{{ $item->prof_img?getSiteImage($item->prof_img,'_S'):getProfileImage('') }}" style="width: 20px;" /> --></td>  
                                            <td @click="routeDetailPage(index,item.c_no)">
                                                {{ item.site.company }}
                                            </td>
                                            <td class="text-center">
                                                <select>
									                <option v-for="i in item.c_no" :value="i+1" :key="i.id">{{item.c_no-i+1}}차</option> <!-- click event 추가> -->
                                                </select>
                                            </td>
                                            <td class="text-center">
                                                <label :class="currentStatus(item.fr_dt,item.to_dt,1)" style="width:60px;text-align: center">{{ currentStatus(item.fr_dt,item.to_dt,0) }}</label>
                                            </td>
                                            <td class="text-left">
                                                <!--<label class="btn-info img-circle text-center no-margins" style="width: 20px;height: 20px" v-if="item.e_cnt>0"><strong>AB</strong></label>
                                                <label class="btn-danger img-circle text-center no-margins" style="width: 20px;height: 20px" v-if="item.c_cnt>0"><strong>中</strong></label>-->
                                            </td>
                                            <td class="text-center">{{ moment(item.fr_dt).format('YYYY-MM-DD') }}</td>
                                            <td class="text-center">{{ moment(item.to_dt).format('YYYY-MM-DD') }}</td>
                                            <td class="text-center">{{ item.usersCnt }}명</td>
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
                        <Pagination :currentPage="parseInt(current_page)" :totalPage="parseInt(total_page)" @returnPage="setCurrentPage" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import api from "@/common/api";
import moment from "moment";
import Pagination from "@/components/atom/Pagination";
export default {
    data() {
        return {
            info: [],
            items: [],
            sortKey: '',
            current_page: 1,
            total_page: 1,
            per_page: '',
			moment: moment
        };
    },
    components: {
        Pagination
    },
    async created() {
        this.info = tempInfo;
        const res = await api.get("/partners/lessonList");
        this.current_page = res.data.current_page;
        this.total_page = res.data.last_page;
        this.per_page = res.data.per_page;
        this.items = res.data.data;
    },
    methods: {
        routeDetailPage(index, c_no) {
            this.$router.push({
                name: "lessonDetailsList",
                params: { id: index+1, c_no:c_no }
            })
        },
        perPage(index) {
            return index>=(this.current_page-1)*this.per_page && index<this.current_page*this.per_page;
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
        async setCurrentPage(data) {
            this.current_page = data;
            const res = await api.get("/partners/lessonList?page="+this.current_page);
            this.current_page = res.data.current_page;
            this.items = res.data.data;
        },
        currentStatus(fr_dt, to_dt, val) {
            const date = moment().format('YYYY-MM-DD');
            if( date < fr_dt ) {
                return val ? "b-r-sm bg-warning": "대기중"
            } else if( date >= fr_dt && date <= to_dt) {
                return val ? "b-r-sm bg-primary": "진행중"
            } else if( date > to_dt) {
                return val ? "b-r-sm bg-success": "완료"
            } else {
                return val ? "b-r-sm bg-danger": "취소됨"
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

/*const tempData = [
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
        cnt: 0,
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
        cnt: 0,
        lesson_rate: 100
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
]*/
</script>