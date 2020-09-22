<template>
    <div class="modal inmodal fade in" style="display: block;">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header" style="border-bottom:0px;padding-bottom: 15px;">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true" @click="$emit('close')">&times;</span><span class="sr-only">Close</span></button>
                    <br>
                </div>
                <div class="modal-body" style="background:#FFFFFF;padding:0;min-height:170px">
                    <div class="col-lg-12" style="padding:0; width:100%">
                        <div class="col-lg-7" style="float:left;">
                            <div class="col-lg-12" style="display:inline;">
                                <div class="col-lg-4 text-center" style="text-align:center;">
                                    <div class="m-b-sm" style="display:inline;">
                                        <img alt="image" class="img-circle s_image" src="https://cdn.tutoring.co.kr/uploads/prof_img/prof_img_S" style="width: 90px;height: 90px;">
                                        <h3><span class="text-success s_name" style="font-size: 16px;">이지희 님</span></h3>
                                        <h6><span class="s_part" style="font-size: 10px; text-align:center;">미디어)마케팅3팀/G5</span></h6>
                                    </div>
                                </div>
                                <div class="col-lg-8">
                                    <dl class="dl-horizontal">
                                        <dt>식별ID | </dt>
                                        <dd><span class="s_mail">37QXNK7P</span></dd>
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
                            <div class="col-lg-12" style="margin-top:20px;margin-left: 20px" >
                                <canvas class="s_level_chart" width="275px" height="275px" style="margin: auto; display: block; height: 275px; width: 275px;">10%</canvas>
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
                </div>
                <div class="modal-footer" style="border-top:0px">
                    <button data-toggle="modal" data-target="#userUpdateModal" class="btn btn-success userUpdate" style="float:left;" @click="openModify">학생 수정</button>
                    <button type="button" class="btn btn-white" data-dismiss="modal" @click="$emit('close')">닫기</button>

                </div>
            </div>
        </div>

        <div class="modal inmodal fade in" id="userUpdateModal" v-show="showModify===true">
                        <div class="modal-dialog modal-sm">
                            <div class="modal-content" style="width:450px;">

                                <div class="modal-header" style="border-bottom:0px;padding-bottom: 25px; width:450px;">
                                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true" @click="openModify">×</span><span class="sr-only">Close</span></button>
                                    <br>
                                    <h5 class="modal-title" style="">학습자 정보 변경</h5>
                                    <small>학습자 정보를 변경해주세요.</small>
                                </div>

<!--
                                <div class="modal-body" style="background:#FFFFFF;padding:0;min-height:170px">
                                    <div class="col-lg-12" style="text-align:center;margin-bottom: 15px">
                                        <img alt="image" id="ui_image" class="img-circle" src="https://cdn.tutoring.co.kr/uploads/prof_img/prof_img_S" style="width: 90px;height: 90px;">
                                    </div>
                                    <div class="col-lg-12" style="margin-bottom: 5px">
                                        <div class="col-lg-9" style="padding:0;line-height: 35px;text-align: right;">
                                            고객식별ID
                                        </div>
                                        <div class="col-lg-8">
                                            <input name="ui_email" type="text" class="form-control" readonly="">
                                        </div>
                                    </div>
                                    <div class="col-lg-12" style="margin-bottom: 5px">
                                        <div class="col-lg-9" style="padding:0;line-height: 35px;text-align: right;">
                                            학습자 이름
                                        </div>
                                        <div class="col-lg-8">
                                            <input name="ui_name" type="text" class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-lg-12" style="margin-bottom: 5px">
                                        <div class="col-lg-9" style="padding:0;line-height: 35px;text-align: right;">
                                            부서
                                        </div>
                                        <div class="col-lg-8">
                                            <input name="ui_part" type="text" class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-lg-12">
                                        <div class="col-lg-9" style="padding:0;line-height: 35px;text-align: right;">
                                            직책
                                        </div>
                                        <div class="col-lg-8">
                                            <input name="ui_position" type="text" class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-lg-12" style="margin-bottom: 25px">
                                        <div class="col-lg-9" style="padding:0;line-height: 35px;text-align: right;">
                                            비고
                                        </div>
                                        <div class="col-lg-8">
                                            <input name="ui_memo" type="text" class="form-control">
                                        </div>
                                    </div>
                                    <div style="position: absolute;left: -9999px;">
                                        <input name="bo_idx" type="text" class="form-control">
                                    </div>
                                </div> -->
                            </div>
                        </div>
                       <!-- <div class="modal-dialog modal-sm">
                            <div class="modal-content" style="width:450px;height:450px">
                                <div class="modal-header" style="border-bottom:0px;padding-bottom: 25px; display: inline;">
                                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true" @click="openModify">×</span><span class="sr-only">Close</span></button>
                                    <br>
                                    <h5 class="modal-title">학습자 정보 변경</h5>
                                    <small>학습자 정보를 변경해주세요.</small>
                                </div>

                                
                                <div class="modal-body" style="background:#FFFFFF;padding:0;min-height:170px">
                                    <div class="col-lg-12" style="text-align:center;margin-bottom: 15px">
                                        <img alt="image" id="ui_image" class="img-circle" src="https://cdn.tutoring.co.kr/uploads/prof_img/prof_img_S" style="width: 90px;height: 90px;">
                                    </div>
                                    <div class="col-lg-12" style="margin-bottom: 5px">
                                        <div class="col-lg-9" style="padding:0;line-height: 35px;text-align: right;">
                                            고객식별ID
                                        </div>
                                        <div class="col-lg-8">
                                            <input name="ui_email" type="text" class="form-control" readonly="">
                                        </div>
                                    </div>
                                    <div class="col-lg-12" style="margin-bottom: 5px">
                                        <div class="col-lg-9" style="padding:0;line-height: 35px;text-align: right;">
                                            학습자 이름
                                        </div>
                                        <div class="col-lg-8">
                                            <input name="ui_name" type="text" class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-lg-12" style="margin-bottom: 5px">
                                        <div class="col-lg-9" style="padding:0;line-height: 35px;text-align: right;">
                                            부서
                                        </div>
                                        <div class="col-lg-8">
                                            <input name="ui_part" type="text" class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-lg-12">
                                        <div class="col-lg-9" style="padding:0;line-height: 35px;text-align: right;">
                                            직책
                                        </div>
                                        <div class="col-lg-8">
                                            <input name="ui_position" type="text" class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-lg-12" style="margin-bottom: 25px">
                                        <div class="col-lg-9" style="padding:0;line-height: 35px;text-align: right;">
                                            비고
                                        </div>
                                        <div class="col-lg-8">
                                            <input name="ui_memo" type="text" class="form-control">
                                        </div>
                                    </div>
                                    <div style="position: absolute;left: -9999px;">
                                        <input name="bo_idx" type="text" class="form-control">
                                    </div>
                                </div>

                                <div class="modal-footer" style="border-top:0px">
                                    <button type="button" class="btn btn-white" data-dismiss="modal" @click="openModify">닫기</button>
                                    <button type="button" class="btn btn-success" id="userUpdateSubmit">변경 완료</button>
                                </div>
                            </div>
                        </div>-->
                    </div>
    </div>

    
</template>

<script>
export default {
    data() {
        return {
            showModify: false
        }
    },
    methods: {
        openModify() {
            this.showModify = !this.showModify;
            console.log(this.showModify);
        }
    }
}
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
    .col-lg-1, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9 {
        float: left;
    }
    .col-lg-4 {
        display: inline;
    }
}
.s_lesson_dt {
    font-size: 85%;
}
.vertical-timeline-content {
    display: inline;
}

.modal {
    background-color: rgba(0, 0, 0, .5);
    overflow-y: auto;
}
</style>