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

                    <h6 class="modal-title">{{title}}</h6>
	                  <span class="modal-subtitle"><strong>{{subtitle}}</strong></span>

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
                    <button type="button" class="btn btn-success" id="userUpdateSubmit" @click="$emit('save',frDt,toDt)">입과</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import shared from "@/common/shared"
import moment from "moment"
export default {
    props: {
        item: Object,
        datePicker: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        subtitle: {
            type: String,
            default: ''
        },
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
        this.frDt = new Date(shared.getCurBatch().fr_dt)
        this.toDt = new Date(shared.getCurBatch().to_dt)
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