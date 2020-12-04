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
                    <h5 class="modal-title">학습자 정보 변경</h5>
                    <small>학습자 정보를 변경해주세요.</small>
                  </div>

                  <div class="modal-body" style="background:#FFFFFF;padding:0;min-height:170px; width:100%">
                    <div class="col-lg-12" style="margin-bottom: 15px; position:absoulte; left:35%">
                      <img alt="image" id="ui_image" class="img-circle" src="https://cdn.tutoring.co.kr/uploads/prof_img/prof_img_S" style="width:90px;height:90px;"/>
                    </div>

                    <div class="col-lg-12" style="margin-bottom:5px;display:inline;">
                      <div class="col-lg-4" style="padding:0;line-height:35px;align-items:flex-end;">고객식별ID</div>
                      <div class="col-lg-8">
                        <input name="ui_email" type="text" class="form-control" :placeholder="modifyItem.user.app_user?modifyItem.user.app_user.cus_id:''" readonly/>
                      </div>
                    </div>
                    <div class="col-lg-12" style="margin-bottom:5px;display:inline;">
                      <div class="col-lg-4" style="padding:0;line-height:35px;align-items:flex-end;">학습자 이름</div>
                      <div class="col-lg-8">
                        <input name="ui_name" type="text" class="form-control" v-model="modifyItem.user.name"/>
                      </div>
                    </div>
                    <div class="col-lg-12" style="margin-bottom:5px;display:inline;">
                      <div class="col-lg-4" style="padding:0;line-height:35px;align-items:flex-end;">부서</div>
                      <div class="col-lg-8">
                        <input name="ui_part" type="text" class="form-control" v-model="modifyItem.user.department"/>
                      </div>
                    </div>
                    <div class="col-lg-12" style="margin-bottom:5px;display:inline;">
                      <div class="col-lg-4" style="padding:0;line-height:35px;align-items:flex-end;">직책</div>
                      <div class="col-lg-8">
                        <input name="ui_position" type="text" class="form-control" v-model="modifyItem.user.position"/>
                      </div>
                    </div>
                    <div class="col-lg-12" style="margin-bottom:5px;display:inline;">
                      <div class="col-lg-4" style="padding:0;line-height:35px;align-items:flex-end;">비고1</div>
                      <div class="col-lg-8">
                        <input name="ui_memo" type="text" class="form-control" v-model="modifyItem.user.memo1"/>
                      </div>
                    </div>
                    <div style="position: absolute;left: -9999px;">
                      <input name="bo_idx" type="text" class="form-control" />
                    </div>
                  </div>

                  <div class="modal-footer" style="border-top:0px">
                    <button type="button" class="btn btn-close" data-dismiss="modal" @click="$emit('close')">닫기</button>
                    <button type="button" class="btn btn-save" id="userUpdateSubmit" @click="applyModify">변경 완료</button>
                  </div>
                </div>
              </div>
            </div>
</template>

<script>
export default {
    data() {
        return {
            modifyItem: null
        }
    },
    props: {
        item: {
            type: Object,
            required: true,
        }
    },
    created(){
        this.modifyItem = JSON.parse(JSON.stringify(this.item));
        console.log(this.modifyItem);
    },
    methods: {
        applyModify() {
            var self = this;
            this.$swal({
                title: "정보 변경",
                text: "학습자 정보를 변경 하시겠습니까?",
                icon: "warning",
                confirmButtonText: "OK",
                confirmButtonColor: '#ed5565',
                showCancelButton: true,
                cancelButtonText: '닫기',
                cancelButtonColor: '#808080',
                reverseButtons: true,
            }).then((isConfirmed) => {
                if(isConfirmed.isConfirmed){
                    self.$emit("update", self.modifyItem);
                    self.modifyItem.length = 0;
                    self.$swal({
                        title: "정보 변경",
                        text: "정보가 변경 됐습니다.",
                        icon: "success",
                        confirmButtonText: "OK",
                        confirmButtonColor: '#ed5565',
                    })
                }
            });
        }
    }
}
</script>

<style scoped>
.modal {
  z-index: 2051 !important;
}
</style>