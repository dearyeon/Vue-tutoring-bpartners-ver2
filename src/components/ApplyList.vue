<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="ibox float-e-margins">
        <div class="ibox-title" style="height: 65px">
          <div class="pull-left">
            <h2>수강신청 현황</h2>
          </div>
          <div class="pull-right">
            <a class="btn btn-success">
              수강신청 현황 다운
            </a>
          </div>
        </div>

      </div>

      <div class="row">
        <div class="col-sm-12 sub-title">
          <div class="ibox">
            <div class="ibox-content">

                <div class="row">
                  <div class="col-lg-12" style="padding:0;">
                    <div class="col-sm-6">
                      <h1>
                        남양주 시청
                        <div class="btn-group p-w-xs" style="vertical-align: bottom;">
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
                  <th class="text-center">수강권</th>
                  <th class="text-center">제공가</th>
                  <th class="text-center">회사지원금</th>
                  <th class="text-center">자기부담금</th>
                  <th class="text-center">접수일시</th>
                </tr>
                </thead>
                <tbody id="applyerList">

                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import api from "@/common/api";
import shared from "@/common/shared"

export default {
  name: "ApplyList",

  async created() {
    shared.bast = 'BAT5f5872afe960a5f5872afe964a';
    const res = await api.get('/partners/applyList', {bapIdx:1});
    console.log('kenres', res);
  }
}

</script>

<style scoped>

</style>
