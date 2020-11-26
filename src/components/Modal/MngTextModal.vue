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
                    <h5 class="modal-title">{{title}}</h5>
                    <small class="modal-subtitle">{{subtitle}}</small>
                  </div>

                  <div class="modal-body" style="background:#FFFFFF;padding:0;min-height:170px; width:100%">

                    <div class="col-lg-12" style="margin-bottom:5px;display:inline;">
                      <div class="col-lg-12">
	                      <textarea type="text" class="form-control" style="height: 165px" v-model="text"></textarea>
                      </div>
                    </div>

                  </div>

                  <div class="modal-footer" style="border-top:0px">
                    <button type="button" class="btn btn-white" data-dismiss="modal" @click="$emit('close')">닫기</button>
                    <button type="button" class="btn btn-success" id="userUpdateSubmit" @click="$emit('save',text)">변경 완료</button>
                  </div>
                </div>
              </div>
            </div>
</template>

<script>
	export default {

		props: {
			title: {
				type: String,
				default: ''
      },
      subtitle: {
				type: String,
				default: ''
			},
			content: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				text: this.content
			}
		},
		created () {

		},
		methods: {}
	}
</script>

<style scoped>
.modal {
  z-index: 2051 !important;
}
</style>