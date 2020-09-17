<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="ibox-title title">
        <h2 class="pull-left">신청페이지 관리</h2>
        <router-link :to="{ path: '/createPage' }">
          <button class="btn btn-success pull-right">
            페이지 생성하기
          </button>
        </router-link>
      </div>
    </div>
    <div class="row">
      <div class="ibox content">
        <div class="ibox-content">
          <table class="table text-center">
            <thead>
              <tr>
                <th class="text-center">No</th>
                <th class="text-center">고객사</th>
                <th class="text-center">담당자</th>
                <th class="text-center">수강신청 기간</th>
                <th class="text-center">신청 양식 설정</th>
                <th class="text-center">신청 양식 수정 일자</th>
                <th class="text-center">URL</th>
              </tr>
            </thead>
            <tr v-for="(register, index) in registers.slice().reverse()" :key="`Register-${index}`">
              <td>{{ registers.length - index }}</td>
              <td>
                {{ register.company }}
              </td>
              <td>{{ register.name }}</td>
              <td>{{ register.course_period }}</td>
              <td>
                <router-link :to="{ path: '/setRegisterForm' }">
                  <button class="btn btn-page-set">페이지 설정</button>
                </router-link>
              </td>
              <td>{{ register.last_edit_dt }}</td>
              <td>
                <a :href="register.url"> {{ register.url }}</a>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      registers: [
        {
          company: "산업 통상 자원부",
          name: "scarlett",
          course_period: "2020-08-01 10:00:00 ~ 2020-08-10 16:00:00",
          last_edit_dt: "2020-07-15 10:00:00",
          url: "https://tutoring.co.kr/client_idx245",
        },
        {
          company: "경기시청",
          name: "snow",
          course_period: "2020-08-01 10:00:00 ~ 2020-08-10 16:00:00",
          last_edit_dt: "2020-07-15 10:00:00",
          url: "https://tutoring.co.kr/client_idx244",
        },
      ],
    };
  },
};
</script>

<style>
.title {
  height: 65px;
}
.content {
  padding: 15px;
}
.table th,
.table td {
  padding-bottom: 8px;
}
.btn-page-set {
  color: #1e9ed3;
  background-color: #fff;
  border: 1px solid #1e9ed3;
  border-radius: 0px;
  width: 100%;
}
.table {
  margin: 0px;
}
</style>
