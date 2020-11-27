<template>
    <div class="modal inmodal fade in" id="userUpdateModal" style="display: block;">
        <div class="modal-dialog modal-sm">
            <div class="modal-content" style="width:450px;">
                <div class="modal-header" style="border-bottom:0px;padding-bottom: 25px;">
                    <button type="button" class="close" data-dismiss="modal">
                        <span aria-hidden="true" @click="$emit('close')">×</span>
                        <span class="sr-only">Close</span>
                    </button>
                    <br />
                    <span v-if="item">
                        <h6 class="modal-title">개별입과</h6>
                        <strong>{{item.user.name}}({{item.user.email}})</strong>
                        <span class="modal-subtitle">님을 입과 하시겠습니까?</span>
                    </span>
                    <span v-else>
                        <h6 class="modal-title"> <strong>일괄 입과 하시겠습니까?</strong></h6>
                        <span class="modal-subtitle">대상 건수 <strong>{{targetCnt}}</strong>건</span>
                    </span>
                </div>

                <div class="modal-body" style="background:#FFFFFF;padding:0;min-height:70px; width:100%">
                    <div class="col-lg-12" style="display:inline">
                        <div class="col-lg-6">
                            <date-picker v-model="frDt" type="date" placeholder="Select date"></date-picker>
                        </div>
                        <div class="col-lg-6">
                            <date-picker v-model="toDt" type="date" placeholder="Select date"></date-picker>
                        </div>
                    </div>
                </div>

                <div class="modal-footer" style="border-top:0px">
                    <button type="button" class="btn btn-white" data-dismiss="modal" @click="$emit('close')">닫기</button>
                    <button type="button" class="btn btn-success" id="userUpdateSubmit" @click="$emit('save',frDt,toDt)">변경 완료</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import api from "@/common/api"
import shared from "@/common/shared"
import moment from "moment"
export default {
    props: {
        item: Object,
        batch: Object,
        datePicker: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            frDt: '',
            toDt: '',
            moment:moment,
            targetCnt: '',
        }
    },
    components: {
		DatePicker
    },
    async created() {
        this.frDt = new Date(this.batch.fr_dt)
        this.toDt = new Date(this.batch.to_dt)
        const bbIdx = shared.getCurBatch().idx
        if(!this.item) {
            const res = await api.get("/partners/issueBatchCheck", {bbIdx});
            this.targetCnt = res.data.targetCnt
        }
    }
}
</script>

<style scoped>
.modal {
    z-index: 2001 !important;
}
.modal-body div {
    align-items: center;
}
</style>