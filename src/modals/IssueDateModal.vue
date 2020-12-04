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
                            <date-picker v-model="frDt" value-type="format" type="date" placeholder="Select date" format="YYYY-MM-DD"></date-picker>
                        </div>
                        <div class="col-lg-6">
                            <date-picker v-model="toDt" value-type="format" type="date" placeholder="Select date" format="YYYY-MM-DD"></date-picker>
                        </div>
                    </div>
                </div>

                <div class="modal-footer" style="border-top:0px">
                    <button type="button" class="btn btn-close" data-dismiss="modal" @click="$emit('close')">닫기</button>
                    <button type="button" class="btn btn-save" id="userUpdateSubmit" @click="$emit('save',frDt,toDt)">{{buttonText}}</button>
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
	      buttonText: {
        	type: String,
		      default: "지급"
	      },
				isAi: {
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
        this.frDt = moment(shared.getCurBatch().fr_dt).format('YYYY-MM-DD');

	      const aiToDt =  moment(shared.getCurBatch().fr_dt).add(9, 'days').format('YYYY-MM-DD');

        this.toDt = this.isAi ? aiToDt : moment(shared.getCurBatch().to_dt).format('YYYY-MM-DD');
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
.modal-subtitle {
    font-size: 25px;
}
</style>