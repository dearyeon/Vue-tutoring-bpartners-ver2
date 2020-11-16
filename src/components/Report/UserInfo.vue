<template>
    <div class="modal inmodal fade in"  style="display: block;">
      <div class="modal-dialog modal-lg">
        <div class="modal-content" style="width:100%">
          <div class="modal-header" style="border-bottom:0px;padding-bottom: 15px;">
            <button type="button" class="close" data-dismiss="modal">
              <span aria-hidden="true" @click="$emit('close')">&times;</span>
              <span class="sr-only">Close</span>
            </button>
            <br />
          </div>
          <div class="modal-body" style="background:#FFFFFF;padding:0;min-height:170px; width:100%;">
                <div class="col-lg-12" style="padding:0;">
                    <div class="row" style="width:100%;display:inline;">
                        <div class="col-lg-7">
                            <div class="col-lg-12 row" style="display:inline;">
                                <div class="col-lg-4"> <!-- center-block -->
                                    <div class="m-b-sm center-block"> <!-- center-block -->
                                        <img alt="image" class="img-circle s_image" src="https://cdn.tutoring.co.kr/uploads/prof_img/prof_img_S" style="width: 90px;height: 90px;">
                                        <div class="text-success center-block s_name" style="font-size: 16px;"><h3>{{ userInfo.user.name }}님</h3></div>
                                        <div class="s_part center-block" style="font-size: 10px; margin-top:-10px"><h6>{{ userInfo.user.department }}/{{ userInfo.user.position }}</h6></div>
                                    </div>
                                </div>
                                <div class="col-lg-8">
                                    <dl class="dl-horizontal">
                                        <dt>고객식별ID | </dt>
                                        <dd><span class="s_mail">{{ userInfo.user.app_user?userInfo.user.app_user.cus_id:'' }}</span></dd>
                                    </dl>
                                </div>
                            </div>
                            <div class="col-lg-12" style="margin-top:20px; display:inline;">
                                수업시간 : <span class="s_lesson_time">{{ userInfo.use_ticket_info && userInfo.ticket_summary && userInfo.goods.charge_plan?userInfo.goods.charge_plan.secs_per_day*(userInfo.use_ticket_info.length+1) - parseInt(userInfo.ticket_summary.sum_remain_secs/60) :'-' }}분/
                                    {{ userInfo.ticket_summary?userInfo.ticket_summary.use_ticket_cnt:'-'}}회</span>
                                <strong><div class="stat-percent s_stat_percent"><!--{{ data.userInfo.total_lesson_cnt? data.userInfo.total_min / data.userInfo.total_lesson_cnt : 0 }}-->%</div></strong> 
                                <progress value="22" max="100" style="width:100%"></progress>
                            </div>
                            <div class="col-lg-12" style="margin-top:20px;">
                                <strong>선택과정</strong>
                                {{ userInfo.goods?userInfo.goods.charge_plan.title:'' }}
                            </div>
                            <div class="col-lg-12">
                                <span class="s_title"></span><span class="cancel_cnt" style="color:red;"></span>
                            </div>
                            <form class="form-inline" style="width:100%">
                                <div class="col-lg-4" style="margin-top:20px;">
                                    <strong>예산지원(A-B)</strong>
                                    <br><span class="s_budget_support">{{userInfo.goods?$shared.nf(userInfo.goods.supply_price-userInfo.goods.charge_price):'-'}}</span>
                                </div>
                                <div class="col-lg-4" style="margin-top:20px;">
                                    <strong>수강료(A)</strong>
                                    <br><span class="s_lesson_fee">{{userInfo.goods?$shared.nf(userInfo.goods.supply_price):'-'}}</span>
                                </div>
                                <div class="col-lg-4" style="margin-top:20px;">
                                    <strong>자기부담금(B)</strong>
                                    <br><span class="s_personal_charge">{{userInfo.goods?$shared.nf(userInfo.goods.charge_price):'-'}}</span>
                                </div>
                            </form>
                            <div class="col-lg-12" style="margin-top:20px;width:100%;">
                                <strong>수업 히스토리</strong>
                                <div class="col-lg-12" style="display:inline-block">
                                <span v-for="i in calBatchDate()" :key="i.id">
                                    <div class="square square-pull" v-if="isUseDt(i-1,userInfo.use_ticket_info)" :data-tooltip="useDtTooltip(i-1,userInfo)"></div>
                                    <div class="square square-empty" v-else></div>
                                </span>
                                </div>
                            </div>
                            <div class="col-lg-12" style="margin-top:20px;">
                                <strong>레벨 테스트 결과비교</strong>
                            </div>
                            <div class="col-lg-12" style="margin-top:20px;margin-left:20px;width:100%" >
                                <div class="center-block" style="height:275px;width:275px">
                            </div>
                            </div>
                        </div>
                        <div class="col-lg-5" style="background-color;">
                            <div class="col-lg-12" style="margin-top:20px;">
                                <form class="form-inline">
                                    <strong>수업 타임라인</strong>
                                    <button class="btn btn-default btn-xs pull-right exportReviewList">
                                        <i class="fa fa-download"></i> 리뷰 다운로드  <!-- click event 추가할 것 -->
                                    </button>
                                </form>
                            </div>
                            <div class="col-lg-12" style="margin-top:20px; background-color">
                                <div class="full-height-scroll" style="overflow: hidden; height: 100%;padding-right:5px;overflow-y:auto;">
                                    <div id="vertical-timeline col-lg-12" class="vertical-container dark-timeline" style="background-color;display: inherit;">
                                        <div class="vertical-timeline-block col-lg-12" v-for="item in userInfo.use_ticket_info" :key="item.id">
                                            <div v-if="item.review" class="vertical-timeline-icon" style="border:0px;">
                                                <img alt="image" class="img-circle s_tutor_image" style="width: 50px;height: 50px;margin-left: -5px;" :src="item.review.tutor.prof_img">
                                            </div>
                                            <div v-if="item.review" class="vertical-timeline-content">
                                                <strong class="s_tutor_name">{{ item.review.tutor.name }}</strong>
                                                <span class="small text-muted pull-right s_lesson_dt">dasfsf</span>
                                                <hr><div class="s_review">{{ item.review.comment }}</div>
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
            <button data-toggle="modal" data-target="#userUpdateModal" class="btn btn-success userUpdate" style="float:left;">학생 수정</button>
            <button type="button" class="btn btn-white" data-dismiss="modal" @click="$emit('close')">닫기</button>
          </div>
          <!--<UserModifyModal v-if="showModify" :item="modalitem" @update="updateItem" @close="openModify"/>-->
        </div>
      </div>
    </div>
</template>

<script>
import moment from 'moment'
export default {
    data() {
        return {
            batch: null,
            userInfo: null,
            moment: moment,
        }
    },
    props: {
        data: {
            type: Object,
            required: true,
        },
    },
    created() {
        console.log(this.data,"paramsData");
        this.batch = this.data.batch
        this.userInfo = this.data.userInfo
        console.log(this.userInfo.use_ticket_info, "review")
    },
    methods: {
        getImageSrc(prof_img) {
            return prof_img?"":"https://cdn.tutoring.co.kr/uploads/b2b_site_img/"+prof_img.substr(0,4)+"/"+prof_img.substr(4,2)+"/"+prof_img.substr(6,2)+"/"+prof_img+'_S';
        },
         calBatchDate() {
      const a = moment(this.batch.fr_dt);
      const b = moment(this.batch.to_dt);
      return b.diff(a, 'days')+1;
    },
    isUseDt(i,use_ticket_info) {
      if(use_ticket_info.length) {
        for(var element of use_ticket_info) {
          if(moment(this.batch.fr_dt).add(i, "days").isSame(element.use_dt,'day')) {
            return true;
          }
        }
        return false;
      } else return false;
    },
    useDtTooltip(i,item) {
      if(item.use_ticket_info.length) {
        let str = moment(this.batch.fr_dt).add(i, "days").format('YYYY-MM-DD')
        let count=0, total = 0, min, secs;
        for(var element of item.use_ticket_info) {
          if(moment(this.batch.fr_dt).add(i, "days").isSame(element.use_dt,'day')) {
            total += item.goods.charge_plan.secs_per_day - element.remain_secs
            count++
          }
        }
        min = parseInt(total/60)
        secs = total - min*60
        str+='\n'+count+'회 - '+min+'분 '+secs+'초'
        return str;
      }
    }
    }
};
</script>

<style scoped>
.s_lesson_dt {
    font-size: 85%;
}

.modal-body div {
}
</style>