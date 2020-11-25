<template>
<div>
    <UserModifyModal :item="userInfo" v-if="modify" @close="showModify"/>
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
                                    <div class="col-lg-4 text-center">
                                        <div class="m-b-sm" style="display: inline;">
                                            <img alt="image" class="img-circle s_image" src="https://cdn.tutoring.co.kr/uploads/prof_img/prof_img_S" style="width: 90px;height: 90px;">
                                            <div class="text-success center-block s_name" style="font-size: 16px;"><h3>{{ userInfo.user.name }}님</h3></div>
                                            <div class="s_part center-block" style="font-size: 10px; margin-top:-10px"><h6>{{ userInfo.user.department }}/{{ userInfo.user.position }}</h6></div>
                                        </div>
                                    </div>
                                    <div class="col-lg-8">
                                        <dl class="dl-horizontal">
                                            <dt>고객식별ID | </dt>
                                            <dd><span>{{ userInfo.user.cus_id }}</span></dd>
                                        </dl>
                                    </div>
                                </div>
                                <div class="col-lg-12" style="margin-top:20px; display:inline;">
                                    수업시간 : <span class="s_lesson_time">{{ userInfo.use_ticket_info && userInfo.ticket_summary && userInfo.goods.charge_plan?
                                        parseInt(userInfo.goods.charge_plan.secs_per_day/60)*(userInfo.use_ticket_info.length+1) :'-' }}분/
                                        {{ userInfo.ticket_summary?userInfo.ticket_summary.use_ticket_cnt:'-'}}회</span>
                                    <strong><div class="stat-percent s_stat_percent">{{ userInfo.attend_pct }}%</div></strong> 
                                    <progress :value="userInfo.attend_pct" max="100" style="width:100%"></progress>
                                </div>
                                <div class="col-lg-12" style="margin-top:20px;">
                                    <strong>선택과정</strong>
                                    {{ userInfo.goods?userInfo.goods.charge_plan.title:'' }}
                                </div>
                                <div class="col-lg-12">
                                    <span class="s_title"></span><span class="cancel_cnt" style="color:red;"></span>
                                </div>
                                <div class="form-inline" style="display:inline;width:100%">
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
                                </div>
                                <div class="col-lg-12" style="margin-top:20px;width:100%;padding-bottom:30px">
                                    <strong>수업 히스토리</strong>
                                    <div class="col-lg-12" style="display:inline-block;padding-top:10px;">
                                    <span v-for="i in calBatchDate()" :key="i.id">
                                        <div class="square square-pull" v-if="isUseDt(i-1,userInfo.use_ticket_info)" :data-tooltip="useDtTooltip(i-1,userInfo)"></div>
                                        <div class="square square-empty" v-else></div>
                                    </span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-5" style="max-height:500px;">
                                <div class="col-lg-12" style="margin-top:20px;">
                                    <div class="form-inline" style="display:inline;">
                                        <strong>수업 타임라인</strong>
                                        <button class="btn btn-default btn-xs pull-right exportReviewList">
                                            <i class="fa fa-download"></i> 리뷰 다운로드  <!-- click event 추가할 것 -->
                                        </button>
                                    </div>
                                </div>
                                <div class="col-lg-12" style="margin-top:20px;">
                                    <div class="full-height-scroll" style="width:auto;overflow:hidden;height:100%;padding-right:5px;overflow-y:auto;">
                                        <div id="vertical-timeline" class="vertical-container dark-timeline">
                                            <div class="vertical-timeline-block" v-for="item in userInfo.use_ticket_info" :key="item.id">
                                                <div v-if="item.review" class="vertical-timeline-icon" style="border:0px;">
                                                    <img alt="image" class="img-circle s_tutor_image" style="width: 50px;height: 50px;margin-left: -5px;" :src="item.review.tutor.prof_img">
                                                </div>
                                                <div v-if="item.review" class="vertical-timeline-content">
                                                    <strong class="s_tutor_name">{{ item.review.tutor.name }}</strong>
                                                    <span class="small text-muted pull-right s_lesson_dt">{{ item.review.reg_dt }}</span>
                                                    <hr>
                                                    <span><p class="s_review" style="word-break:break-all;">{{ item.review.comment }}</p></span>
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
                    <button data-toggle="modal" data-target="#userUpdateModal" class="btn btn-success userUpdate" style="float:left;" @click="showModify">학생 수정</button>
                    <button type="button" class="btn btn-white" data-dismiss="modal" @click="$emit('close')">닫기</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import UserModifyModal from "@/components/Modal/UserModifyModal"
import moment from 'moment'
export default {
    data() {
        return {
            batch: null,
            userInfo: null,
            moment: moment,
            modify: false
        }
    },
    props: {
        data: {
            type: Object,
            required: true,
        },
    },
    components: {
        UserModifyModal
    },
    created() {
        this.batch = this.data.batch
        this.userInfo = this.data.userInfo
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
        },
        showModify() {
            this.modify = !this.modify
        }
    }
};
</script>

<style scoped>
.s_lesson_dt {
    font-size: 85%;
}

.modal-body div {
    align-items: inherit;
}

.vertical-timeline-content {
    display: block;
}
</style>