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
                                            <th class="pagesubmit sorting" field="order" value="lesson_rate" @click="sortBy('lesson_rate')" style="width:65px">달성률</th>
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
                                                v-show="(!item.name.indexOf(search) || !item.cus_id.indexOf(search) || !item.email.indexOf(search)) && (index>=(currentPage-1)*30 && index<currentPage*30)">
                                                <td>{{ index+1 }}</td>
                                                <td></td><!-- 이미지 추가 필요 <img alt="image" class="img-circle" src="{{getProfileImage($item->prof_img,'_S')}}" style="width: 20px;height: 20px" /> -->
                                                <td>{{ item.name }}</td>
                                                <td>
                                                    <div class="pull-left">
                                                        <!-- <span class="pie">{{ item.lesson_min ? item.lesson_min:0 }}/{{ item.total_min ? item.total_min:1}}</span> -->
                                                    </div>
                                                    <div class="pull-right">
                                                        <span class="lesson-rate">{{ item.total_min? parseInt(item.lesson_min/item.total_min*100) +'%':'' }}</span>
                                                    </div>
                                                </td>
                                                <td>{{ item.lesson_min ? item.lesson_min+'분':'-'}} / {{ item.total_lesson_cnt ? item.total_lesson_cnt+'회':'-'}}</td>
                                                <td>
                                                    <label class="btn-info img-circle text-center no-margins" style="width: 14px;height: 14px" v-if="item.e_cnt>0"><strong>AB</strong></label>
                                                    <label class="btn-danger img-circle text-center no-margins" style="width: 14px;height: 14px" v-if="item.c_cnt>0"><strong>中</strong></label>
                                                </td>
                                                <td>{{ item.firstTest}}</td>
                                                <td>{{ item.lastTest}}</td>
                                                <td>{{ item.cus_id }}</td>
                                                <td>{{ item.part }}</td>
                                                <td>{{ item.position }}</td>
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
                    <div class="ibox">
                        <div class="ibox-content" style="min-height: 950px">
                            <div class="tab-content">
                                <div id="contact" class="tab-pane">
                                    <div class="row">
                                        <div class="col-lg-12" style="height: 40px;margin-top: -10px;padding: 0px">
                                            <div class="pull-right social-action dropdown">
                                                <button data-toggle="dropdown" class="dropdown-toggle btn-white">
                                                    <i class="fa fa-angle-down"></i>
                                                </button>
                                                <ul class="dropdown-menu m-t-xs">
                                                    <li><a data-toggle="modal" data-target="#userUpdateModal" class="userUpdate">학생 수정</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="col-lg-12">
                                            <div class="col-lg-4 text-center">
                                                <div class="m-b-sm">
                                                    <img alt="image" class="img-circle s_image" src="" style="width: 90px;height: 90px;">
                                                    <h3><span class="text-success s_name"></span></h3>
                                                    <h6><span class="s_part"></span></h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-12" style="margin-top: 20px;">
                                            수업시간 : <span class="stat-percents_lesson_time"></span>
                                            <strong><div class="stat-percent s_stat_percent">0%</div></strong>
                                            <div class="progress progress-mini">
                                                <div style="width: 0%;" class="progress-bar progress-bar-success s_progress"></div>
                                            </div>
                                        </div>
                                        <div class="col-lg-12" style="margin-top:20px;">
                                            <strong>선택과정</strong>
                                        </div>
                                        <div class="col-lg-12">
                                            <span class="s_title"></span><span class="cancel_cnt" style="color:red;"></span>
                                        </div>
                                        <div class="col-lg-4" style="margin-top:20px;">
                                            <strong>수강료(A)</strong>
                                        </div>
                                        <div class="col-lg-4" style="margin-top:20px;">
                                            <strong>자기부담금(B)</strong>
                                        </div>
                                        <div class="col-lg-4" style="margin-top:20px;">
                                            <strong>예산지원(A-B)</strong>
                                        </div>
                                        <div class="col-lg-4">
                                            <span class="s_budget_support"></span>
                                        </div>
                                        <div class="col-lg-4">
                                            <span class="s_lesson_fee"></span>
                                        </div>
                                        <div class="col-lg-4">
                                            <span class="s_personal_charge"></span>
                                        </div>
                                        <div class="col-lg-12" style="margin-top:20px;">
                                            <strong>수업 히스토리</strong>
                                        </div>
                                        <div class="col-lg-12 lesson_history" style="margin-top:20px;">
                                        </div>
                                        <div class="col-lg-12" style="margin-top:20px;">
                                            <strong>레벨 테스트 결과비교</strong>
                                        </div>
                                        <div class="col-lg-12" style="margin-top:20px;" >
                                            <canvas class="s_level_chart" width="275px" height="275px" style="margin:auto;"></canvas>
                                        </div>
                                        <div class="col-lg-12" style="margin-top:20px;">
                                            <strong>수업 타임라인</strong>
                                            <button class="btn btn-default btn-xs pull-right exportReviewList">
                                                <i class="fa fa-download"></i> 리뷰 다운로드
                                            </button>
                                            <hr style="margin-bottom: 0px"/>
                                        </div>
                                    </div>
                                    <div class="client-detail">
                                        <div class="full-height-scroll">
                                            <div id="vertical-timeline" class="vertical-container dark-timeline" style="margin-top: 0px;">
                                            </div>
                                        </div>
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
import Pagination from "../Pagination";
export default {
    data() {
        return {
            baseInfo: [],
            search: '',
            items: [],
            currentPage: '',
            sortKey: ''
        };
    },
    components: {
        Pagination
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
    created() {
        this.baseInfo = baseInfotemp;
        this.items = tempItems;
        this.currentPage = 1;
    },
    methods: {
        setSearch(input) {
            this.search = input;
        },
        sortBy(sortKey) {
            (this.sortKey === sortKey) ? this.items.reverse() : ( this.items.sort(function(a, b) {
                return a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0;
            }))
            this.sortKey = sortKey;
        },
        setCurrentPage(data) {
            this.currentPage = data;
        }
    }
}

const baseInfotemp = {
    company: "1. 튜터링 테스트",
    c_no: 11,
    orderList: [
        { c_no: 11 }, { c_no: 10 }, { c_no: 9 }
    ],
    max_cnt: 28
}

const tempItems = [
    {
        //prof_img = "",
        idx: 1,
        name: "이지희",
        email: "a",
        e_cnt: 1,
        c_cnt: 1,
        lesson_rate: 1,
        lesson_min: 39,
        total_lesson_cnt: 3,
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
        e_cnt: 1,
        c_cnt: 0,
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