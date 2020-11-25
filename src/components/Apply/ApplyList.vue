<template>
	<div><!-- v-model:isCancel-->
		<Header title="신청 관리"
			:use-batch-selection="true" @changeBatch="refreshData"
			switch1-text="취소포함" @switch1-change="toggleCancel"
			btn1-text="개별 신청" @btn1-click="routeIndivApply" btn1-variant="warning" 
			btn2-text="일괄 신청" @btn2-click="$refs.file.click()" btn2-variant="primary" :btn2-loading="loading1"
			btn3-text="신청양식 다운로드" @btn3-click="exportFormat" btn3-variant="success" :btn3-loading="loading2">
		</Header>
		<input type="file" id="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ref="file" @change="importExcel" />

		<Content>
			<Table :headers="['No','이름','이메일/고객식별ID','소속','부서','직위','사번'].concat(cfs.map(a => a.title), ['수강권','제공가','회사지원금','자기부담금','관리메모','관리정보','접수일시','취소일시','취소/복원'])"
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
				<td>
					<p v-if="item.mng_memo" @click="openMemoModal(item.idx,item.mng_memo)">{{item.mng_memo}}</p>
					<button v-else class="btn btn-default" @click="openMemoModal(item.idx)">관리메모</button>
				</td>
				<td>
					<p v-if="item.mng_info" @click="openInfoModal(item.idx,item.mng_info)">{{item.mng_info}}</p>
					<button v-else class="btn btn-default" @click="openInfoModal(item.idx)">관리정보</button>
				</td>
				<td>{{ moment(item.apply_dt).format('YYYY-MM-DD HH:mm') }}</td>
				<td>{{ item.apply_ccl_dt && moment(item.apply_ccl_dt).format('YYYY-MM-DD HH:mm') }}</td>
				<td v-if="!!item.apply_ccl_dt"><ItemButton text="복원" variant="primary" @click="" /></td>
				<td v-else><ItemButton text="취소" variant="danger" @click="" /></td>
			</Table>
		</Content>

		<UserInfoModal :data="modalitem" v-if="showUserInfoModal" @close="showUserInfoModal = !showUserInfoModal"/>
		<MngTextModal title="관리메모" :content="content" v-if="showMemoModal" @close="showMemoModal = !showMemoModal" @save="updateMemo"/>
		<MngTextModal title="관리정보" :content="content" v-if="showInfoModal" @close="showInfoModal = !showInfoModal" @save="updateInfo"/>

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
import MngTextModal from '../Modal/MngTextModal'

export default {
	data() {
		return {
			company: '',
			batches: [],
			cfs: [],
			orders: [],
			includeCancel: false,
      		curBBIdx: 0,
			selectIdx: 0,
      		loading1: false,
			loading2: false,
			showUserInfoModal: false,
			showMemoModal: false,
			showInfoModal: false,
			content:'',
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
		UserInfoModal,
		MngTextModal
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
						params: {bbIdx: this.curBBIdx }
					})
					this.refreshData();
				}
			}
		},
		importExcel: _.debounce(function (event) {
			//bbIdx = this.$route.params.bbIdx
			this.loading1 = true


			let input = event.target.files[0]
			let reader = new FileReader()
			let value = []
    		
			reader.onload = async () => {
				let data = reader.result;
				let workBook = XLSX.read(data, { type: 'binary' });
				workBook.SheetNames.forEach(async function (sheetName) {
					let rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
					rows.forEach(row =>
						value.push(Object.assign({
							'no': row.No?row.No:'',
							'name': row.이름?row.이름:'',
							'email': row.이메일?row.이메일:'',
							'cpIdx': row.수강권idx?row.수강권idx:'',
							'수강권': row.수강권?row.수강권:'',
							'company': row.소속?row.소속:'',
							'department': row.부서?row.부서:'',
							'position': row.직급?row.직급:'',
							'empNo': row.사번?row.사번:'',
							'cel': row.연락처?row.연락처:'',
							'cf1': row.CF1?row.CF1:'',
							'cf2': row.CF2?row.CF2:'',
						}))
					)
				})
				console.log(JSON.stringify(value));
				const res = await api.post('/partners/importApplyListToExcel', {bbIdx: shared.getCurBatch().idx , rows:JSON.stringify(value)})
				console.log(res)
				if(res.result === 2000){
					this.$swal.fire({
						title: '일괄 신청이 완료 되었습니다.',
						confirmButtonText: 'OK',
					})
					this.refreshData();
				} else if (res.result === 1000) {
					this.$swal.fire({
						title: res.message,
						text: res.data.errMsg,
						icon: "warning",
						confirmButtonText: "OK"
					})
				}
			};
			reader.readAsBinaryString(input)
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
		openMemoModal(idx, content) {
			this.content = content
			this.selectIdx = idx
			this.showMemoModal = !this.showMemoModal
		},
		openInfoModal(idx, content) {
			this.content = content
			this.selectIdx = idx
			this.showInfoModal = !this.showInfoModal
		},
		async openUserInfo(boIdx) {
			this.modalitem = await shared.getUserInfo(boIdx)
			this.showUserInfoModal = !this.showUserInfoModal
		},
		async updateMemo(text) {
			console.log(text);
			this.showMemoModal = !this.showMemoModal
			const res = await api.post('/partners/updateMemo', { boIdx: this.selectIdx, memo: text})
			if(res.result === 2000) {
				this.refreshData();
			}
		},
		async updateInfo(text) {
			this.showInfoModal = !this.showInfoModal
			const res = await api.post('/partners/updateInfo', { boIdx: this.selectIdx, info: text })
			if(res.result === 2000) {
				this.refreshData();
			}
		},
		routeIndivApply () {
			this.$router.push({
				name: 'indivApplyNew',
				params: { bbIdx:shared.getCurBatch().idx }
			})
		}
	},
};
</script>

<style scoped>
</style>
