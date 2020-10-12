<template>
    <div class="col-lg-12" style="padding:0;">
        <form class="form-inline">
            <div class="col-lg-7" :style="(comp)? 'width:100%':''">
                <div class="col-lg-12" style="width:100%;">
                    <form class="form-inline"  style="width:100%;">
                        <div :class="(comp)?'col-auto':'col-lg-4'"> <!-- center-block -->
                            <div class="m-b-sm center-block"> <!-- center-block -->
                                <img alt="image" class="img-circle s_image" src="https://cdn.tutoring.co.kr/uploads/prof_img/prof_img_S" style="width: 90px;height: 90px;">
                                <div class="text-success center-block s_name" style="font-size: 16px;"><h3>{{ data.userInfo.name }}님</h3></div>
                                <div class="s_part center-block" style="font-size: 10px; margin-top:-10px"><h6>{{ data.userInfo.part }}/{{ data.userInfo.position }}</h6></div>
                            </div>
                        </div>
                        <div class="col-lg-8" v-if="!comp">
                            <dl class="dl-horizontal">
                                <dt>식별ID | </dt>
                                <dd><span class="s_mail">{{ data.userInfo.cus_id }}</span></dd>
                            </dl>
                        </div>
                    </form>
                </div>
                <div class="col-lg-12" style="margin-top:20px; display:inline; width:100%;">
                    수업시간 : <span class="s_lesson_time">{{ data.userInfo.total_min? data.userInfo.total_min+'분':''}} / {{ data.userInfo.total_lesson_cnt? data.userInfo.total_lesson_cnt+'회':'-'}}</span>
                    <strong><div class="stat-percent s_stat_percent">{{ data.userInfo.total_lesson_cnt? data.userInfo.total_min / data.userInfo.total_lesson_cnt : 0 }}%</div></strong> <!-- 달성률 수식 수정 필요 -->
                    <progress value="22" max="100" style="width:100%"></progress>
                </div>
                <div class="col-lg-12" style="margin-top:20px;">
                    <strong>선택과정</strong>
                    {{ data.userInfo.title }}
                </div>
                <div class="col-lg-12">
                    <span class="s_title"></span><span class="cancel_cnt" style="color:red;"></span>
                </div>
                <form class="form-inline" style="width:100%">
                    <div class="col-lg-4" style="margin-top:20px;">
                        <strong>예산지원(A-B)</strong>
                        <br><span class="s_budget_support">-</span>
                    </div>
                    <div class="col-lg-4" style="margin-top:20px;">
                        <strong>수강료(A)</strong>
                        <br><span class="s_lesson_fee">-</span>
                    </div>
                    <div class="col-lg-4" style="margin-top:20px;">
                        <strong>자기부담금(B)</strong>
                        <br><span class="s_personal_charge">-</span>
                    </div>
                </form>
                <div class="col-lg-12" style="margin-top:20px;width:100%;">
                    <strong>수업 히스토리</strong>
                    <ul class="col-lg-12 list-inline lesson_history" style="margin-top:20px;min-height:50px;width:100%;" >
                        <li class="no-padding" v-for="i in data.baseInfo.max_cnt" :key="i.id">
                            <div class="square square-pull" v-if="data.lesson['lesson_cnt_'+i]"></div>
                            <div class="square square-empty" v-else></div>
                        </li>
                    </ul>
                </div>
                <div class="col-lg-12" style="margin-top:20px;">
                    <strong>레벨 테스트 결과비교</strong>
                </div>
                <div class="col-lg-12" style="margin-top:20px;margin-left:20px;width:100%" >
                    <div class="center-block" style="height:275px;width:275px">
                    <chartjs-radar :labels="labels" :datasets="datasets" :option="options" :height="275" :width="275"></chartjs-radar>
                </div>
                </div>
            </div>
            <div class="col-auto">
                <div class="col-lg-12" style="margin-top:20px;width:100%;">
                    <form class="form-inline">
                        <strong>수업 타임라인</strong>
                        <button class="btn btn-default btn-xs pull-right exportReviewList">
                            <i class="fa fa-download"></i> 리뷰 다운로드  <!-- click event 추가할 것 -->
                        </button>
                    </form>
                </div>
                <div class="col-lg-12" style="margin-top:20px;">
                    <div class="client-detail" style="height:700px;">
                        <div class="full-height-scroll" style="overflow: hidden; height: 100%;padding-right:5px;overflow-y:auto;">
                            <div id="vertical-timeline" class="vertical-container dark-timeline">
                                <div class="vertical-timeline-block" v-for="item in data.review" :key="item.id">
                                    <div class="vertical-timeline-icon" style="border:0px;">
                                        <img alt="image" class="img-circle s_tutor_image" style="width: 50px;height: 50px;margin-left: -5px;" :src="getImageSrc(item.prof_img)">
                                    </div>
                                    <div class="vertical-timeline-content">
                                        <strong class="s_tutor_name">{{ item.name }}</strong>
                                        <span class="small text-muted pull-right s_lesson_dt">{{ item.lesson_dt }}</span>
                                        <hr><p class="s_review">{{ item.comment }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import { Radar } from 'vue-chartjs'

export default {
    extends: Radar,
    mounted () {
        this.renderChart({
        labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
        datasets: [
            {
            label: 'My First dataset',
            backgroundColor: 'rgba(179,181,198,0.2)',
            borderColor: 'rgba(179,181,198,1)',
            pointBackgroundColor: 'rgba(179,181,198,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(179,181,198,1)',
            data: [65, 59, 90, 81, 56, 55, 40]
            },
            {
            label: 'My Second dataset',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            pointBackgroundColor: 'rgba(255,99,132,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(255,99,132,1)',
            data: [28, 48, 40, 19, 96, 27, 100]
            }
        ]
        }, {responsive: true, maintainAspectRatio: false})
    },
    data() {
          return {
            dataentry: null,
            datalabel: null,
            labels: [],
            datasets: [
                {
                    label: "이전",
                    data: [],
                    borderColor: 'rgba(216, 216, 216, 0.9)',
                    backgroundColor: 'rgba(216, 216, 216, 0.1)',   
                },
                {
                    label: "마지막",
                    data: [],
                    borderColor: 'rgba(25, 179, 147, 0.9)',
                    backgroundColor: 'rgba(25, 179, 147, 0.2)',   
                }, 
            ],
            options: {
                scale: {
                    gridLines: {
                        circular: true
                    },
                    ticks: {
                        beginAtZero: true,
                        max: 10,
                    },
                    pointLabels:{
                        fontColor: 'rgba(178, 178, 178, 0.9)',
                    },
                }
              },
          };
    },
    props: {
        data: {
            type: Object,
            required: true,
        },
        comp: {
            type: Number,
            default: 0
        }
    },
    mounted () {
        this.renderChart(this.datasets, this.options)
    },
    created() {
        const firstTest = this.data.userInfo.firstTest;
        const lastTest = this.data.userInfo.lastTest;
        this.labels = [firstTest.point_0_title, firstTest.point_1_title, firstTest.point_2_title, firstTest.point_3_title, firstTest.point_4_title];
        if(lastTest) {
            this.datasets[1].data = [lastTest.point_0, lastTest.point_1, lastTest.point_2, lastTest.point_3, lastTest.point_4];
        } else {
            this.datasets.shift();
            this.datasets[0].label = "처음";
        }
        this.datasets[0].data = [firstTest.point_0, firstTest.point_1, firstTest.point_2, firstTest.point_3, firstTest.point_4];
    },
    methods: {
        getImageSrc(prof_img) {
            return "https://cdn.tutoring.co.kr/uploads/prof_img/"+prof_img.substr(0,4)+"/"+prof_img.substr(4,2)+"/"+prof_img.substr(6,2)+"/"+prof_img;
        }
    }
};
</script>

<style scoped>
.pull-right {
  float: right !important;
}
.s_lesson_dt {
    font-size: 85%;
}
</style>