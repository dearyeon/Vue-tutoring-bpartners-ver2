<template>
<div>
	<Header title="본인정보 수정"></Header>

    <div class="row">
        <div class="ibox content">
            <div class="ibox-content">

                <div class="row">
                    <div class="col-md-offset-1 col-lg-4">
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
                    <div class="col-md-offset-1 col-lg-4">
                        <table class="table">
                            <tr style="height:50px;">
                                <table>
                                    <tr>
                                    </tr>
                                </table>
                            </tr>
                        </table>
                    </div>
                </div>



            </div>
        </div>
    </div>
                
</div>
</template>

<script>
import api from "@/common/api"
import Header from "@/components/Common/Header"
export default {
    data() {
        return {
            newPassword: '',
            oldPassword: '',
            oldPasswordCheck: '',
        }
    },
    components: {
        Header
    }
}
</script>

<style scoped>

</style>