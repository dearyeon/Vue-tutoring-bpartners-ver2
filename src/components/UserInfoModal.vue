<template>
    <div class="modal inmodal fade" id="userInfoModal" tabindex="-1" role="dialog"  aria-hidden="true" name="userInfoModal">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header" style="border-bottom:0px;padding-bottom: 15px;">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                    <br>
                </div>
                <div class="modal-body" style="background:#FFFFFF;padding:0;min-height:170px">
                    <div class="col-lg-12" style="padding:0;">
                        <div class="col-lg-7">
                            <div class="col-lg-12">
                                <div class="col-lg-4 text-center">
                                    <div class="m-b-sm">
                                        <img alt="image" class="img-circle s_image" src="" style="width: 90px;height: 90px;">
                                        <h3><span class="text-success s_name"></span></h3>
                                        <h6><span class="s_part"></span></h6>
                                    </div>
                                </div>
                                <div class="col-lg-8">
                                    <dl class="dl-horizontal">
                                        <dt>식별ID | </dt>
                                        <dd><span class="s_mail"></span></dd>
                                    </dl>
                                </div>
                            </div>
                            <div class="col-lg-12" style="margin-top: 20px;">
                                수업시간 : <span class="s_lesson_time"></span>
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
                                <strong>예산지원(A-B)</strong>
                            </div>
                            <div class="col-lg-4" style="margin-top:20px;">
                                <strong>수강료(A)</strong>
                            </div>
                            <div class="col-lg-4" style="margin-top:20px;">
                                <strong>자기부담금(B)</strong>
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
                            <div class="col-lg-12 lesson_history" style="margin-top:20px;min-height: 50px;">
                            </div>
                            <div class="col-lg-12" style="margin-top:20px;">
                                <strong>레벨 테스트 결과비교</strong>
                            </div>
                            <div class="col-lg-12" style="margin-top:20px;margin-left: 20px" >
                                <canvas class="s_level_chart" width="275px" height="275px" style="margin:auto;"></canvas>
                            </div>
                        </div>
                        <div class="col-lg-5">
                            <div class="col-lg-12" style="margin-top:20px;">
                                <strong>수업 타임라인</strong>
                                <button class="btn btn-default btn-xs pull-right exportReviewList">
                                    <i class="fa fa-download"></i> 리뷰 다운로드
                                </button>
                            </div>
                            <div class="col-lg-12" style="margin-top:20px;">
                                <div class="client-detail" style="height:700px;">
                                    <div class="full-height-scroll">
                                        <div id="vertical-timeline" class="vertical-container dark-timeline" style="margin-top: 0px;">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="border-top:0px">
                    <button data-toggle="modal" data-target="#userUpdateModal" class="btn btn-success userUpdate" style="float:left;">학생 수정</button>
                    <button type="button" class="btn btn-white" data-dismiss="modal">닫기</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      require: true,
      default: false
    }
  },
  methods: {
    closeModal(){
      this.$emit('update:visible', false)
    },
  }
}
</script>