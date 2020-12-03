<template>
<div>
	<Header title="본인정보 수정"></Header>
    <div id="content" class="ibox-content">
        <div class="row">
            <div class="col-md-offset-3 col-lg-4">
                <table class="table">
                    <tr>
                        <th>현재 비밀번호</th>
                        <td><input type="text" class="form-control" v-model="oldPassword"/></td>
                    </tr>
                    <tr>
                        <th>새 비밀번호</th>
                        <td><input type="number" class="form-control" v-model="newPassword"/></td>
                    </tr>
                    <tr>
                        <th>새 비밀번호 확인</th>
                        <td>
                            <input type="text" class="form-control" v-model="newPasswordCheck"/>
                        </td>
                    </tr>
                </table>
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
            <div class="col-md-offset-3 col-lg-4">
                <table class="table">
                    <tr>
                        <th>이름</th>
                        <td><input type="text" class="form-control" v-model="name"/></td>
                    </tr>
                    <tr>
                        <th>이메일</th>
                        <td><input type="number" class="form-control" v-model="email"/></td>
                    </tr>
                    <tr>
                        <th>전화/휴대폰</th>
                        <td>
                            <input type="text" class="form-control" v-model="cel"/>
                        </td>
                    </tr>
                </table>
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

export default {
    data() {
        return {
            oldPassword: '',
            newPassword: '',
            newPasswordCheck: '',
            name: '',
            email: '',
            cel: '',
        }
    },
    components: {
        Header
    },
    methods: {
        save() {
            this.$swal.fire({
                title: `수정하시겠습니까?`,
                icon: 'warning',
				showCancelButton: true,
            }).then (r => {
                this.$swal.fire({
                    title: `수정되었습니다.`,
                    icon: 'success'
                })
            })

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
</style>