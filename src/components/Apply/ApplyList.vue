<template>
	<div>
		<Header title="신청 관리"
			:use-batch-selection="true" @changeBatch="refreshData"
			btn1-text="포맷 다운로드" @btn1click="exportFormat" btn1-variant="primary" :btn1-loading="false"
			btn2-text="엑셀 업로드" @btn2click="$refs.file.click()" btn2-variant="primary" :btn2-loading="false">
		</Header>
		<input type="file" id="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ref="file" @change="importExcel" />

		<div class="row">
			<div class="ibox content">
				<div class="ibox-content">
					<div class="col-xs-3 pull-right">
						<h3 class="col-xs-6 no-margins">취소 포함</h3>
						<div class="col-xs-6">
							<div class="switch">
								<div class="onoffswitch">
									<input class="onoffswitch-checkbox form-control" name="cancel_bach" id="cancel_bach" type="checkbox" v-model="isCancel"/>
									<label class="onoffswitch-label" for="cancel_bach">
										<span class="onoffswitch-inner"></span>
										<span class="onoffswitch-switch"></span>
									</label>
								</div>
							</div>
						</div>
					</div>
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
							<th>취소/복원</th>
						</tr>
						</thead>
						<tbody id="applyerList">
						<tr class="userInfo hover-pointer" v-for="(order, index) in isCancel?cancelOrders:orders" v-bind:key="order.id">
							<td class="number" style="vertical-align: middle;">{{ index + 1 }}</td>
							<td class="part">{{ order.user.name }}</td>
							<td class="company">{{ order.user.company }}</td>
							<td class="department">{{ order.user.department }}</td>
							<td class="position">{{ order.user.position }}</td>
							<td class="emp_no">{{ order.user.emp_no }}</td>
							<td v-for="col in cfs" :key="col.id">{{ getGTP(col.type, order.user[col.col_id]) }}</td>
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
							<td>
								<div v-if="order.idx === 14321" class="btn btn-del">취소</div> <!--TODO-->
								<div v-else class="btn btn-reset">복원</div>
							</td>
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
import shared from "@/common/shared";
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import XLSX from 'xlsx'
import _ from 'lodash'
import BatchSelection from "@/components/Common/BatchSelection"
import CusIdField from "@/components/Common/CusIdField"
import Header from "@/components/Common/Header"
import Content from "@/components/Common/Content"
import Table from "@/components/Common/Table"
import ItemButton from "@/components/Common/ItemButton"

export default {
	data() {
		return {
			company: '',
			batches: [],
			cfs: [],
			orders: [],
			cancelOrders: [],
			isCancel: false,
      		curBBIdx: 0,
      		loading1: false,
      		loading2: false,
			moment: moment,
		};
	},
	components: {
		Header,
		Content,
		CusIdField,
		BatchSelection,
		Table,
		ItemButton,
		ClipLoader
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
			this.cfs = data.cfs;
			this.orders = data.orders;
			this.orders.forEach(element => { //TODO
				if(element.idx !== 14321) this.cancelOrders.push(element)
			});
			console.log(this.cfs);
			console.log(data);
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
          this.loading1 = true

          let dataWs = []
            dataWs.push(Object.assign(
              {
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
          XLSX.utils.book_append_sheet(wb, ws, this.company +' '+ shared.getCurBatch().b_no + '주차 신청관리');
          const test = XLSX.writeFile(wb, this.company +' '+ shared.getCurBatch().b_no + '주차 신청관리.xlsx');
          this.loading1 = false
        }, 500),
		importExcel: _.debounce(function (event) {
			this.loading2 = true
			let input = event.target.files[0]
			let reader = new FileReader()
			reader.onload = function () {
				let data = reader.result;
				let workBook = XLSX.read(data, { type: 'binary' });
				workBook.SheetNames.forEach(function (sheetName) {
					console.log('SheetName: ' + sheetName);
					let rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
					console.log(JSON.stringify(rows));
				})
			};
    		reader.readAsBinaryString(input);
			this.loading2 = false
		}, 500),
	},
};
</script>

<style scoped>
.btn-del {
	color: #d31e1e;
	background-color: #fff;
	border: 1px solid #d31e1e;
	border-radius: 0px;
}
.btn-reset {
	color: #1e9ed3;
	background-color: #fff;
	border: 1px solid #1e9ed3;
	border-radius: 0px;
}
</style>
