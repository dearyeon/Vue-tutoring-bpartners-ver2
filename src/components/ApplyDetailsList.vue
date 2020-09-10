<template>
    <div class="row">
        <div class="col-sm-12 sub-title">
          <div class="ibox">
            <div class="ibox-content">

                <div class="row">
                  <div class="col-lg-12">
                    <div class="col-sm-6">
                      <h1>
                        남양주 시청
                        <div class="btn-group p-w-xs">
                          <button data-toggle="dropdown" class="btn btn-default btn-sm dropdown-toggle">
                            <strong>1차</strong><span class="caret"></span>
                          </button>
                          <ul class="dropdown-menu">
                            <li><router-link to="aaa">1차</router-link></li>
                          </ul>
                        </div>
                      </h1>
                    </div>
                  </div>
                </div>

              <table class="table table-striped table-hover text-center dataTable">
                <thead>
                <tr>
                  <th class="text-center">No</th>
                  <th class="text-center">부서</th>
                  <th class="text-center">직위</th>
                  <th class="text-center">이름</th>
                  <th class="text-center">이메일</th>
                  <th class="text-center">연락처</th>
                  <th class="text-center">수강권</th>
                  <th class="text-center">제공가</th>
                  <th class="text-center">회사지원금</th>
                  <th class="text-center">자기부담금</th>
                  <th class="text-center">접수일시</th>
                </tr>
                </thead>
                <tbody id="applyerList">
                    <tr data-toggle="" data-target="" class="userInfo hover-pointer" data-u_idx="2393501" data-bs_idx="58" data-bo_idx="410"
                        v-for="(data, index) in list" v-bind:key="data.id">
                        <td class="number" style="vertical-align: middle;">{{ index + 1 }}</td>
                        <td class="part">{{ data.user.department }}</td>
                        <td class="position">{{ data.user.position }}</td>
                        <td class="hover-pointer name" data-toggle="modal" data-target="#applyerInfoModal" data-name="" data-cel="" data-email="">{{ data.user.name }}</td>
                        <td class="email">{{ data.user.email_id ? data.user.email_id+'@'+bap.email_domain : '[정보 보안]' }}</td>
                        <td class="cel">{{ data.user.cel ? data.user.cel : '[정보 보안]' }}</td>
                        <td class="charge-plan__title">{{ data.__ob__.value.goods.charge_plan.title_plan }}</td>
                        <td class="supply_price" >{{ data.__ob__.value.goods.supply_price }}</td>
                        <td class="company-charge__price" v-on:cmpprice="companyChargePrice" style="vertical-align: middle;">{{ companyChargePrice(index) }}</td>
                        <td class="charge_price">{{ data.__ob__.value.goods.charge_price }}</td>
                        <td class="apply_dt">{{ data.apply_dt }}</td>
                    </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

  </div>
</template>

<script>
import api from "@/common/api";

export default {
    data() {
        return {
            bap: "",
            list: []
        };
    },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    async created() {
        const res = await api.get('/partners/applyList', { bapIdx: this.id });
        this.list = res.data.list;
        this.bap = res.data.bap;
        console.log(this.id);
        console.log(this.bap);
    },
    methods: {
        companyChargePrice(index) {
            return this.list[index].__ob__.value.goods.supply_price - this.list[index].__ob__.value.goods.charge_price;
        }
    }
}
</script>



<style scoped>
.col-lg-12 {
  padding: 0;
}

.btn-group.p-w-xs {
  vertical-align: bottom;
}

#applyList {
  vertical-align: middle;
}


</style>
