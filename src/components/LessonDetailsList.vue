<template>
    <div class="row">
        <div class="col-lg-12">
            <div class="ibox float-e-margins">
                <div class="ibox-title" style="height: 65px">
                    <div class="pull-left">
                        <h2>수업 현황</h2>
                    </div>
                    <div class="pull-right">
                        <a id="btnSendOrderEmailLessonStatus" class="btn btn-success btn-w-m" @click="showModal">학습현황 메일 일괄 발송</a>
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
                                        <td data-toggle="modal" data-target="#userInfoModal" class="userInfo hover-pointer" @click="openUserInfo">{{ item.name }}</td>
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
//import UserInfoModal from "./UserInfoModal";

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
            visible: false
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
        //UserInfoModal
    },
    created() {
        this.baseInfo = baseInfotemp;
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
        showModal() {
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
            this.visible = !this.visible;
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