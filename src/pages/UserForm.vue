<template>
<div>
	<Header title="본인정보 수정"></Header>
    <div id="content" class="ibox-content">
        <div class="row">
            <div class="col-md-offset-3">
                <div>
                    <div class="field">
                        <th>현재 비밀번호</th>
                        <td><input type="password" class="form-control" v-model="curPw"/></td>
                    </div><br/>
                    <div class="field" style="margin-top:10px">
                        <th>새 비밀번호</th>
                        <td><input type="password" class="form-control" v-model="newPw"/></td>
                    </div><br/>
                    <div class="field">
                        <th>새 비밀번호 확인</th>
                        <td><input type="password" class="form-control" v-model="newPwCheck"/></td>
                    </div><br/>
                </div>
            </div>
        </div>
        <div class="col-md-offset-3">
            <span class="notice">
                ❊ 비밀번호는 대,소문자,숫자,특수기호 조합으로 10글자 이상으로 설정하셔야 합니다.<br/>
                ❊ 본 시스템은 개인정보등 민감한 정보를 취급하므로 비밀번호가 유출되지 않도록 각별히 주의 바랍니다.<br/>
                ❊ 비밀번호 등 접속 계정 정보 관리 소홀로 발생하는 민형사상 모든 책임은 계정 담당자에게 있습니다.<br/>
            </span>
        </div>
        <div class="hr-line-dashed"></div>
        <div class="row">
            <div class="col-md-offset-3">
                <div>
                    <div class="field">
                        <th>이름</th>
                        <td><input type="text" class="form-control" v-model="name"/></td>
                        <span v-if="!name" :style="notice?'color:red':''" style="margin-left:25px;">이름을 입력해 주세요.</span>
                    </div><br/>
                    <div class="field">
                        <th>이메일</th>
                        <td><input type="text" class="form-control" v-model="email"/></td>
                        <span v-if="!email" :style="notice?'color:red':''" style="margin-left:25px;">이메일을 입력해 주세요.</span>
                    </div><br/>
                    <div class="field">
                        <th>전화/휴대폰</th>
                        <td><input type="text" class="form-control" v-model="tel"/></td>
                        <span v-if="!tel" :style="notice?'color:red':''" style="margin-left:25px;">전화/휴대폰을 입력해 주세요.</span>
                    </div><br/>
                </div>
                <!--
                <table class="table">
                    <tr>
                        <th>이름</th>
                        <td><input type="text" class="form-control" :placeholder="$shared.getAccount().name" v-model="name"/></td>
                    </tr>
                    <span v-if="!name" :style="notice?'color:red':''">이름을 입력해 주세요.</span>
                </table>
                </div>
                <table class="table">
                    <tr>
                        <th>이메일</th>
                        <td><input type="text" class="form-control" :placeholder="$shared.getAccount().email" v-model="email"/></td>
                        <span v-if="!email" :style="notice?'color:red':''">이메일을 입력해 주세요.</span>
                    </tr>
                    <tr>
                        <th>전화/휴대폰</th>
                        <td><input type="text" class="form-control" :placeholder="$shared.getAccount().tel" v-model="tel"/></td>
                        <span v-if="!tel" :style="notice?'color:red':''">전화/휴대폰을 입력해 주세요.</span>
                    </tr>
                </table>
                -->
            </div>
        </div>
        <div class="text-center">
            <br/><br/><a class="btn btn-success" @click="save">수정</a>
        </div>
    </div>
</div>
</template>

<script>
import Header from "@/components/Header.vue";
import shared from "@/common/shared";
import api from "@/common/api";

export default {
    data() {
        return {
            curPw: '',
            newPw: '',
            newPwCheck: '',
            name: '',
            email: '',
            tel: '',
            notice: false
        }
    },
    components: {
        Header
    },
    created() {
        this.name = this.$shared.getAccount().name
        this.email = this.$shared.getAccount().email
        this.tel = this.$shared.getAccount().tel
    },
    methods: {
        save() {
            if(!this.name || !this.email || !this.tel) {
                this.notice = true
            } else if(this.newPw !== this.newPwCheck) {
                this.$swal.fire({
                    title: `새 비밀번호가 서로 일치하지 않습니다.`,
                    icon: 'warning',
                    confirmButtonColor: '#ed5565'
                })
            } else {
                this.$swal.fire({
                    title: `수정하시겠습니까?`,
                    icon: 'warning',
                    showCancelButton: true,
                    cancelButtonText: '닫기',
                    cancelButtonColor: '#808080',
                    confirmButtonColor: '#ed5565',
                    reverseButtons: true,
                }).then (async r => {
					if (r.isConfirmed) {
                        let params
                        if(this.newPwCheck) params = { name:this.name, email:this.email, tel:this.tel, curPw:this.curPw, newPw:this.newPw }
                        else params = { name:this.name, email:this.email, tel:this.tel }

                        const { result, message } = await api.post("/partners/account", params );
                        if(result === 2000) {
                            let account = this.$shared.getAccount()
                            account.name = this.name
                            account.email = this.email
                            account.tel = this.tel
                            this.$shared.setAccount(account)
                            this.$swal.fire({
                                title: `수정되었습니다.`,
                                icon: 'success',
                                confirmButtonColor: '#ed5565',
                            })
                        } else if(result === 1000) {
                            this.$swal.fire({
                                title: message,
                                icon: 'warning',
                                confirmButtonText: 'OK',
                                confirmButtonColor: '#ed5565',
                            })
                        }
                    }
                })
            }

        }
    }
}
</script>

<style scoped>
.notice {
    color: red;
}
#content {
	line-height: 1.8;
	padding: 12px 15px;
	margin: 0px 10px;
}
th {
    width: 140px;
    padding-top: 6px;
}
td {
    width: 250px;
    padding-top: 6px;
}
.field {
    display: inline;
    padding-top: 6px;
}
</style>