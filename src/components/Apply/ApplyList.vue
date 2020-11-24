<template>
	<div><!-- v-model:isCancel-->
		<Header title="신청 관리"
			:use-batch-selection="true" @changeBatch="refreshData"
			switch1-text="취소포함" @switch1-change="toggleCancel"
			btn1-text="일괄 신청" @btn1-click="$refs.file.click()" btn1-variant="primary" :btn1-loading="loading1"
			btn2-text="신청엑셀 다운로드" @btn2-click="exportFormat" btn2-variant="success" :btn2-loading="loading2">
		</Header>
		<input type="file" id="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ref="file" @change="importExcel" />

		<Content>
			<Table :headers="['No','이름','이메일/고객식별ID','소속','부서','직위','사번'].concat(cfs.map(a => a.title), ['수강권','제공가','회사지원금','자기부담금','접수일시','취소일시','취소/복원'])"
				:data="orders"
					v-slot="{item, i}">
				<td>{{ i + 1 }}</td>
				<td @click="openUserInfo(item.idx)">{{ item.user.name }}</td>
				<td><CusIdField :user="item.user"></CusIdField></td>
				<td>{{ item.user.company }}</td>
				<td>{{ item.user.department }}</td>
				<td>{{ item.user.position}}</td>
				<td>{{ item.user.emp_no }}</td>
				<td v-for="col in cfs" :key="col.id">{{ getGTP(col.type, item.user[col.col_id]) }}</td>
				<td>{{ item.goods ? item.goods.charge_plan.title : '' }}</td>
				<td>{{ item.goods ? $shared.nf(item.goods.supply_price) : '' }}</td>
				<td>{{ item.goods ? $shared.nf(item.goods.supply_price - item.goods.charge_price) : '' }}</td>
				<td>{{ item.goods ? $shared.nf(item.goods.charge_price) : '' }}</td>
				<td>{{ moment(item.apply_dt).format('YYYY-MM-DD HH:mm') }}</td>
				<td>{{ item.apply_ccl_dt && moment(item.apply_ccl_dt).format('YYYY-MM-DD HH:mm') }}</td>
				<td v-if="!!item.apply_ccl_dt"><ItemButton text="복원" variant="primary" @click="" /></td>
				<td v-else><ItemButton text="취소" variant="danger" @click="" /></td>
			</Table>
		</Content>

		<UserInfoModal :data="modalitem" v-if="showModal" @close="showModal = !showModal"/>
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
import UserInfoModal from "@/components/Modal/UserInfoModal"

export default {
	data() {
		return {
			company: '',
			batches: [],
			cfs: [],
			orders: [],
			includeCancel: false,
      		curBBIdx: 0,
      		loading1: false,
			loading2: false,
			showModal: false,
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
		ClipLoader,
		UserInfoModal
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

			if(this.includeCancel) {
				this.orders = data.orders;
			} else {
				this.orders = data.orders.filter( (order) => {
					return order.apply_ccl_dt === null
				})
			}
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
		importExcel: _.debounce(function (event) {
			this.loading1 = true
			let input = event.target.files[0]
			let reader = new FileReader()
    		reader.readAsBinaryString(input)
			reader.onload = function () {
				let data = reader.result;
				let workBook = XLSX.read(data, { type: 'binary' });
				workBook.SheetNames.forEach(function (sheetName) {
					console.log('SheetName: ' + sheetName);
					let rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
					console.log(JSON.stringify(rows));
				})
			};
			this.loading1 = false
		}, 500),
    	exportFormat: _.debounce(async function () {
		  	this.loading2 = true
          	let dataWs = []
            dataWs.push(Object.assign({
                'No': '',
                '이름': '',
                '이메일': '',
                '수강권idx': '',
                '수강권': '',
                '소속': '',
                '부서': '',
                '직급': '',
                '사번': '',
                '연락처': '',
                'CF1': '',
                'CF2': '',
              }));
			var ws = XLSX.utils.json_to_sheet(dataWs);
			var wb = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(wb, ws, this.company +' '+ shared.getCurBatch().b_no + '주차 신청관리');
			const test = XLSX.writeFile(wb, this.company +' '+ shared.getCurBatch().b_no + '주차 신청관리.xlsx');
			this.loading2 = false
        }, 500),
		toggleCancel(event){
			this.includeCancel = event;
			this.refreshData();
		},
		async openUserInfo(boIdx) {
			this.modalitem = await shared.getUserInfo(boIdx)
			this.showModal = !this.showModal
		},
	},
};
</script>

<style scoped>
</style>
