<template>
    <div class="col-lg-12" style="padding:0; width:100%">
                        <div class="col-lg-7" style="float:left;">
                            <div class="col-lg-12" style="display:inline;">
                                <div class="col-lg-4 text-center">
                                    <div class="m-b-sm" style="display:inline;">
                                        <img alt="image" class="img-circle s_image" src="https://cdn.tutoring.co.kr/uploads/prof_img/prof_img_S" style="width: 90px;height: 90px;">
                                        <h3><span class="text-success s_name" style="font-size: 16px;">{{ data.name }}님</span></h3>
                                        <h6><span class="s_part" style="font-size: 10px; text-align:center;">미디어)마케팅3팀/G5</span></h6>
                                    </div>
                                </div>
                                <div class="col-lg-8">
                                    <dl class="dl-horizontal">
                                        <dt>식별ID | </dt>
                                        <dd><span class="s_mail">{{ data.cus_id }}</span></dd>
                                    </dl>
                                </div>
                            </div>
                            <div class="col-lg-12" style="margin-top: 20px; display: inline;">
                                수업시간 : <span class="s_lesson_time">39분 / 3회</span>
                                <strong><div class="stat-percent s_stat_percent">22%</div></strong>
                                <progress value="22" max="100" style="width:100%"></progress>
                            </div>
                            <div class="col-lg-12" style="margin-top:20px;">
                                <strong>선택과정</strong>
                                [B2B] Native 1개월 9회(20분) X 1회
                            </div>
                            <div class="col-lg-12">
                                <span class="s_title"></span><span class="cancel_cnt" style="color:red;"></span>
                            </div>
                            <div style="display:inline;width:100%">
                                <div class="col-lg-4" style="margin-top:20px;">
                                    <strong>예산지원(A-B)</strong>
                                    <br>-
                                </div>
                                <div class="col-lg-4" style="margin-top:20px;">
                                    <strong>수강료(A)</strong>
                                    <br>-
                                </div>
                                <div class="col-lg-4" style="margin-top:20px;">
                                    <strong>자기부담금(B)</strong>
                                    <br>-
                                </div>
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
                                <div class="col-lg-12 lesson_history" style="margin-top:20px;min-height: 50px; display:inline-block;" >
                                    <div class="square square-empty type-all" v-for="index in 27" :key="index"></div> <!-- 이부분 method처리 -->
                                </div>
                            </div>
                            <div class="col-lg-12" style="margin-top:20px;">
                                <strong>레벨 테스트 결과비교</strong>
                            </div>
                            <div class="col-lg-12" style="margin-top:20px;margin-left: 20px; left:15%" >
                                <chartjs-radar :labels="labels" :datasets="datasets" :option="options" height="275" width="275"></chartjs-radar>
                            </div>
                        </div>
                        <div class="col-lg-5">
                            <div class="col-lg-12" style="margin-top:20px; display:inline;">
                                <strong>수업 타임라인</strong>
                                <button class="btn btn-default btn-xs pull-right exportReviewList">
                                    <i class="fa fa-download"></i> 리뷰 다운로드  <!-- click event 추가할 것 -->
                                </button>
                            </div>
                            <div class="col-lg-12" style="margin-top:20px;">
                                <div class="client-detail" style="height:700px;w">
                                    <div class="full-height-scroll" style="overflow: hidden; height: 100%;padding-right:5px;overflow-y:auto;">
                                        <div id="vertical-timeline" class="vertical-container dark-timeline" style="margin-top:0px;">

                                            <div class="vertical-timeline-block">
                                                <div class="vertical-timeline-icon" style="border:0px">
                                                    <img alt="image" class="img-circle s_tutor_image" style="width: 50px;height: 50px;margin-left: -5px;" src="https://cdn.tutoring.co.kr/uploads/prof_img/2019/04/11/20190411151758_5caedc162c63d_S">
                                                </div>
                                                <div class="vertical-timeline-content">
                                                    <strong class="s_tutor_name">Aldeen</strong>
                                                    <span class="small text-muted pull-right s_lesson_dt">2019-03-18 05:13 PM</span>
                                                    <hr><p class="s_review">[Things you did well]</p>
                                                </div>
                                            </div>
                                            <div class="vertical-timeline-block">
                                                <div class="vertical-timeline-icon">
                                                    <img alt="image" class="img-circle s_tutor_image" src="https://cdn.tutoring.co.kr/uploads/prof_img/2018/11/14/20181114233038_5bec318e274d5_S" style="width: 50px;height: 50px;margin-left: -5px;">
                                                </div>
                                                <div class="vertical-timeline-content">
                                                    <strong class="s_tutor_name">Revai</strong>
                                                    <span class="small text-muted pull-right s_lesson_dt">2019-02-27 04:40 PM</span>
                                                    <hr>
                                                    <p class="s_review">[Things you did well]
                                                        Thank you  for such a energetic class. You participated well . i feel very happy that you chose me to be your teacher today . you have a good personality which makes teaching you easy and good
                                                        [Things you can improve]
                                                        Your performance is exceptional. You are really a model student. Always cheerful and ready to show off your skills  good job. looking forward to a class with you
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="vertical-timeline-block">
                                                <div class="vertical-timeline-icon" style="border:0px">
                                                    <img alt="image" class="img-circle s_tutor_image" src="https://cdn.tutoring.co.kr/uploads/prof_img/2019/05/31/20190531162914_5cf0d7ca562f3_S" style="width: 50px;height: 50px;margin-left: -5px;">
                                                </div>
                                                <div class="vertical-timeline-content">
                                                    <strong class="s_tutor_name">Kierra</strong>
                                                    <span class="small text-muted pull-right s_lesson_dt">2019-08-31 12:05 AM</span>
                                                    <hr>
                                                    <p class="s_review">Practice using complete sentences. Work on your listening skills as you had difficulty following directions. I always suggest students practice the 4 core skills: reading, writing, speaking and listening. I also suggest that students not be afraid to make mistakes. Also, surround yourself in English.</p>
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
import { Radar } from "vue-chartjs";
export default {
  extends: Radar,
    data() {
          return {
            dataentry: null,
            datalabel: null,
            labels: ['발음','문법1','문법2','표현','자신감'],
            datasets: [
                {
                    label: "이전",
                    data: [5,5,5,5,5],
                    borderColor: 'rgba(216, 216, 216, 0.9)',
                    backgroundColor: 'rgba(216, 216, 216, 0.1)',   
                },
                {
                    label: "마지막",
                    data: [7,4,7,7,8],
                    borderColor: 'rgba(25, 179, 147, 0.9)',
                    backgroundColor: 'rgba(25, 179, 147, 0.2)',   
                }, //처음,      이전, 마지막
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
              }
          };
    },
    mounted () {
      this.renderChart(this.chartData)
    },
    props: {
        data: {
        type: Object,
        required: true,
        }
    }
};
</script>

<style scoped>
@media (min-width: 1200px) {
    .col-lg-7 {
        width: 58.33333333%;
        float: left;
        position: relative;
    }
    .col-lg-5 {
        width: 41.66666667%;
        float: right;
        position: absolute;
        left: 58.33333333%;
    }
    .col-lg-1, .col-lg-10, .col-lg-11, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7 {
        float: left;
    }
    .col-lg-4 {
        display: inline;
    }
    .col-lg-9 {
        padding:0;
        line-height: 35px;
        width:60px;
    }
}

.s_lesson_dt {
    font-size: 85%;
}
.vertical-timeline-content {
    display: inline;
}


</style>