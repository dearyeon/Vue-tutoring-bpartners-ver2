<template>
    <div class="modal inmodal fade in" id="addSiteModal" style="display: block;">
        <div class="modal-dialog modal-sm">
            <div class="modal-content" style="width:350px;">
                <div class="modal-header" style="border-bottom:0px;padding-bottom: 15px;">
                    <div style="background: url('//res.tutoring.co.kr/res/img/b2b/site_logo.png');background-repeat: no-repeat;background-size: contain;background-position:center; width:100px;height:100px;margin:auto"></div>
                    <h5 class="modal-title">고객사 등록</h5>
                    <small>고객사의 정보를 입력해 주세요.</small>
                </div>
                <div class="modal-body" style="background:#FFFFFF;padding:0;min-height:160px">
                    <div class="col-lg-12" style="margin-bottom:5px;display:inline;">
                        <div class="col-lg-3" style="padding:0;line-height:35px ">
                            리셀러
                        </div>
                        <div class="col-lg-9" style="padding:0;">
                            <select name="site_reseller" class="form-control">
                            </select>
                        </div>
                    </div>
                    <div class="col-lg-12" style="margin-bottom:5px;display:inline;">
                        <div class="col-lg-3" style="padding:0;line-height:35px">
                            고객사 명
                        </div>
                        <div class="col-lg-9" style="padding:0;">
                            <input type="text" name="site_company" class="form-control" v-model="company">
                        </div>
                    </div>
                    <div class="col-lg-12" style="margin-bottom:5px;display:inline;">
                        <div class="col-lg-3" style="padding:0;line-height:35px ">
                            담당자 이름
                        </div>
                        <div class="col-lg-9" style="padding:0;">
                            <input type="text" name="site_u_name" class="form-control" v-model="name">
                        </div>
                    </div>
                    <div class="col-lg-12" style="margin-bottom:5px;display:inline;">
                        <div class="col-lg-3" style="padding:0;line-height:35px ">
                            부서
                        </div>
                        <div class="col-lg-9" style="padding:0;">
                            <input type="text" name="site_u_part" class="form-control" v-model="part">
                        </div>
                    </div>
                    <div class="col-lg-12" style="margin-bottom:5px;display:inline;">
                        <div class="col-lg-3" style="padding:0;line-height:35px ">
                            전화번호
                        </div>
                        <div class="col-lg-9" style="padding:0;">
                            <input type="text" name="site_u_tel" class="form-control" v-model="tel">
                        </div>
                    </div>
                    <div class="col-lg-12" style="margin-bottom:5px;display:inline;">
                        <div class="col-lg-3" style="padding:0;line-height:35px ">
                            이메일
                        </div>
                        <div class="col-lg-9" style="padding:0;">
                            <input type="text" name="site_u_email" class="form-control" v-model="email">
                        </div>
                    </div>
                    <div class="col-lg-12" style="margin-bottom:5px;display:inline;">
                        <div class="col-lg-3" style="padding:0;line-height:35px ">
                            차수번호
                        </div>
                        <div class="col-lg-9" style="padding:0;">
                            <input type="text" value="1" class="form-control" readonly>
                        </div>
                    </div>
                    <div class="col-lg-12" style="margin-bottom:5px;display:inline;">
                        <div class="col-lg-3" style="padding:0;line-height:40px">
                            시작날짜
                        </div>
                        <div class="col-lg-9" style="padding:0;">
				            <date-picker class="datepicker" format="YYYY-MM-DD" type="date" v-model="fr_dt"></date-picker>
                        </div>
                    </div>
                    <div class="col-lg-12" style="margin-bottom:10px;display:inline;">
                        <div class="col-lg-3" style="padding:0;line-height:40px">
                            종료날짜
                        </div>
                        <div class="col-lg-9" style="padding:0;">
				            <date-picker class="datepicker" format="YYYY-MM-DD" type="date" v-model="to_dt"></date-picker>
                        </div>
                    </div>
                    <div class="col-lg-12" style="margin-bottom:10px;display:inline;">
                        <div class="col-lg-3" style="padding:0;line-height:35px">
                            목표설정
                        </div>
                        <div class="col-lg-9" style="padding:0;">
                            <select name="site_target_rate" class="form-control" v-model="goalrate">
                                <option v-for="index in 20" :key="index.id" :value="index*5" selected>{{ index*5 }}%</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="border-top:0px">
                    <button type="button" class="btn btn-close" data-dismiss="modal" @click="$emit('close')">닫기</button>
                    <button type="button" class="btn btn-save" id="addSiteSubmit" @click="registerModal">고객사 등록</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
export default {
    data() {
        return {
            company: '',
            name: '',
            part: '',
            tel: '',
            email: '',
            fr_dt: null,
            to_dt: null,
            goalrate: ''
        };
    },
    components: {
        DatePicker
    },
    methods: {
        registerModal() {
            var column;
            if(this.company === '') column = '고객사 명'
            else if(this.name === '') column = '담당자 이름'
            else if(this.fr_dt === null || this.to_dt === null) column = '일자'
            if (column) {
                this.$swal({
                    title: column + " 입력",
                    text: column + "를 입력해주세요.",
                    icon: "warning",
                    confirmButtonText: "OK",
					confirmButtonColor: '#d8d8d8',
                });
            } else {
                this.$swal({
                    title: "고객사 등록",
                    text: "고객사를 추가 하시겠습니까?",
                    icon: "warning",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancel",
					confirmButtonColor: '#8FD0F5',
                    showCancelButton: true,
                });     
            }
        },
    }
}
</script>

<style scoped>
.modal {
    z-index: 1 !important;
    background-color: rgba(0, 0, 0, 0.5);
    overflow-y: auto;
}
.datepicker{
    z-index: 9999 !important;
}
</style>