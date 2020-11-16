<template>
	<div class="row">
		<div class="col-lg-12">
			<div class="ibox float-e-margins">
				<div class="ibox-title" style="height: 65px;">
					<div class="pull-left">
						<h2>신청 관리</h2>
					</div>
					<div class="batch-selection">
						<BatchSelection @change="refreshData" />
					</div>
          <div class="pull-right">
						<a v-if="!loading" class="btn btn-danger btn-w-m">취소 포함</a>&nbsp;
            			<clip-loader :loading="loading" color="rgba(256, 256, 256, 0.7)" size="15px"></clip-loader>
						<a v-if="!loading" class="btn btn-success btn-w-m" @click="exportFormat">포맷 다운로드</a>&nbsp;
            			<clip-loader :loading="loading" color="rgba(256, 256, 256, 0.7)" size="15px"></clip-loader>
						<a class="btn btn-primary btn-w-m">엑셀 업로드</a>
						<input type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
            			<clip-loader :loading="loading" color="rgba(256, 256, 256, 0.7)" size="15px"></clip-loader>
					</div>
				</div>
			</div>
    </div>

		<div class="row">
			<div class="ibox content">
				<div class="ibox-content">
					<table class="table table-striped table-hover dataTable">
						<thead>
						<tr>
							<th>No</th>
							<th>이름</th>
							<th>고객사 명</th>
							<th>부서</th>
							<th>직위</th>
							<th>사번</th>
							<th v-for="col in cfs" :key="col.id">{{ col.title }}</th>
							<th>수강권</th>
							<th>제공가</th>
							<th>회사지원금</th>
							<th>자기부담금</th>
							<th>접수일시</th>
						</tr>
						</thead>
						<tbody id="applyerList">
						<tr class="userInfo hover-pointer" v-for="(order, index) in orders" v-bind:key="order.id">
							<td class="number" style="vertical-align: middle;">{{ index + 1 }}</td>
							<td class="part">{{ order.user.name }}</td>
							<td class="company">{{ order.user.company }}</td>
							<td class="department">{{ order.user.department }}</td>
							<td class="position">{{ order.user.position }}</td>
							<td class="emp_no">{{ order.user.emp_no }}</td>
							<td v-if="order.user.cf1">{{ getGTP('T', order.user.cf2) }}</td>
							<td v-if="order.user.cf2">{{ getGTP('S', order.user.cf1) }}</td>
							<td class="charge-plan__title text-left">{{
									order.goods ? order.goods.charge_plan.title : ''
								}}
							</td>
							<td class="supply_price">{{ order.goods ? $shared.nf(order.goods.supply_price) : '' }}</td>
							<td>{{
									order.goods ? $shared.nf(order.goods.supply_price - order.goods.charge_price) : ''
								}}
							</td>
							<td class="company-charge__price">{{
									order.goods ? $shared.nf(order.goods.charge_price) : ''
								}}
							</td>
							<td class="apply_dt">{{ moment(order.apply_dt).format('YYYY-MM-DD HH:mm') }}</td>
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
import moment from 'moment'
import BatchSelection from "@/components/Common/BatchSelection";
import shared from "@/common/shared";
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import XLSX from 'xlsx'
import _ from 'lodash'

export default {
	components: {
		BatchSelection, ClipLoader
	},
	data() {
		return {
			company: '',
			batches: [],
			cfs: [],
			orders: [],
			moment: moment,
      curBBIdx: 0,
      loading: false,
		};
	},
	created() {
		this.refreshData();
	},
	methods: {
		async refreshData() {
			this.curBBIdx = shared.getCurBatch().idx
			const res = await api.get("/partners/applyOrderList", {
				bbIdx: this.curBBIdx
			});
			const data = res.data;
			this.company = data.company;
      this.batches = data.batches;
      console.log(this.batches);console.log(shared.getCurBatch().b_no)
			this.cfs = data.cfs;
			this.orders = data.orders;
		},
		getGTP(type, val) {
			if (type == 'S') {
				return val ? this.cfs[1].opts[1] : this.cfs[1].opts[0]
			} else {
				return val
			}
		},
		routeDetailPage(event) {
			if (this.batches.length) {
				if (parseInt(this.$route.params.bbIdx) !== this.batches[event.target.value].idx) {
					this.$router.push({
						name: "applyDetailsList",
						params: {bbIdx: this.curBBIdx}
					})
					this.refreshData();
				}
			}
    },
    exportFormat: _.debounce(async function () {
          this.loading = true

          let dataWs = []
            dataWs.push(Object.assign(
              {
                '': this.company +' '+ shared.getCurBatch().b_no + '주차 신청관리',
                'No': '',
                '이름': '',
                '이메일': '',
                '수강권': '',
                '소속': '',
                '부서': '',
                '직급': '',
                '사번': '',
                '연락처': '',
                'CF1': '',
                'CF2': '',
              }
            ));
          var ws = XLSX.utils.json_to_sheet(dataWs);
          var wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, '신청관리');
          const test = XLSX.writeFile(wb, this.company +' '+ shared.getCurBatch().b_no + '주차 신청관리.xlsx');
          this.loading = false
        }, 500),
		importExcel: _.debounce(async function () {
          this.loading = true


          this.loading = false
        }, 500),
	},
};
</script>

<style scoped>
</style>
