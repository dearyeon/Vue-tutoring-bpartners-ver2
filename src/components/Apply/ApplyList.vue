<template>
	<div><!-- v-model:isCancel-->
		<Header title="신청 관리"
			:use-batch-selection="true" @changeBatch="refreshData"
			search-placeholder="이름 or 이메일 or 고객식별ID" @search="setSearch"
			switch1-text="취소포함" @switch1-change="toggleCancel"
			btn1-text="개별 신청" @btn1-click="routeIndivApply" btn1-variant="warning" 
			btn2-text="일괄 신청" @btn2-click="$refs.file.click()" btn2-variant="primary" :btn2-loading="loading"
      btn3-text="일괄 승인" @btn3-click="approveBatchCheck" btn3-variant="success btn-outline" :btn3-loading="loading"
			btn4-text="신청양식 다운로드" @btn4-click="exportFormat" btn4-variant="success" :btn4-loading="loading">
		</Header>
		<input type="file" id="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ref="file" @change="importExcel" />

		<Content>
			<Table :headers="['No','이름','이메일/고객식별ID','소속','부서','직위','사번'].concat(cfs.map(a => a.title), ['수강권','제공가','회사지원금','자기부담금','관리메모','관리정보','접수일시','취소일시','승인일시','취소/복원'].concat( applyError ? '승인결과' : ''))"
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
					<p v-if="item.mng_memo" class="mng-text" @click="openMemoModal(item.idx,item.mng_memo)">{{item.mng_memo}}</p>
					<ItemButton v-else text="관리메모" variant="default" @click="openMemoModal(item.idx)"/>
				</td>
				<td>
					<p v-if="item.mng_info" class="mng-text" @click="openInfoModal(item.idx,item.mng_info)">{{item.mng_info}}</p>
					<ItemButton v-else text="관리정보" variant="default" @click="openInfoModal(item.idx)"/>
				</td>
				<td>{{ moment(item.apply_dt).format('YYYY-MM-DD HH:mm') }}</td>
				<td>{{ item.apply_ccl_dt && moment(item.apply_ccl_dt).format('YYYY-MM-DD HH:mm') }}</td>
				<td v-if="!!item.approve_dt">{{ item.approve_dt && moment(item.approve_dt).format('YYYY-MM-DD HH:mm') }}</td>
				<td v-else>
					<ItemButton text="승인" variant="success btn-outline" @click="approve(item.idx,item.user.name,item.user.email )"/>
				</td>
				<td v-if="!!item.apply_ccl_dt"><ItemButton text="복원" variant="primary" @click="" /></td>
				<td v-else><ItemButton text="취소" variant="danger" @click="cancel(item)" /></td>
				<td v-if="applyError"><p class="mng-text">{{item.mng_memo}}</p></td>
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
	data () {
		return {
			company: '',
			batches: [],
			cfs: [],
			applyError: false,
			orders: [],
			includeCancel: false,
			curBBIdx: 0,
			selectIdx: 0,
			loading: false,
			showUserInfoModal: false,
			showMemoModal: false,
			showInfoModal: false,
			content: '',
			moment: moment,
			approveBatchObj: {
				btnText: '일괄 승인 검사',
				func: 'approveBatchCheck',
				btnClass: 'success btn-outline'
			}
		}
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
	created () {
		this.refreshData()
	},
	methods: {
		async refreshData (sk) {
			this.curBBIdx = shared.getCurBatch().idx
			const res = await api.get('/partners/applyOrderList', {
				bbIdx: this.curBBIdx
			})
			const data = res.data
			this.company = data.company
			this.batches = data.batches
			this.cfs = data.cfs

			if (this.includeCancel) {
				this.orders = data.orders
			} else {
				this.orders = data.orders.filter((order) => {
					return order.apply_ccl_dt === null
				})
			}
			if(sk) this.orders = this.orders.filter((order) => { 
				return !order.user.name.indexOf(sk) || 
						(order.user.cus_id && !order.user.cus_id.indexOf(sk)) || 
						(order.user.email && !order.user.email.indexOf(sk))
			})
		},
		getGTP (type, val) {
			if (type == 'S') {
				return val ? this.cfs[1].opts[1] : this.cfs[1].opts[0]
			} else {
				return val
			}
		},
		importExcel: _.debounce(function (event) {
			this.loading = true

			let input = event.target.files[0]
			let reader = new FileReader()
			let value = []
			reader.onload = async () => {
				let data = reader.result
				let workBook = XLSX.read(data, { type: 'binary' })
				workBook.SheetNames.forEach(async function (sheetName) {
					let rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName])
					rows.forEach(row =>
						value.push(Object.assign({
							'no': row.No ? row.No : '',
							'name': row.이름 ? row.이름 : '',
							'email': row.이메일 ? row.이메일 : '',
							'cpIdx': row.수강권idx ? row.수강권idx : '',
							'수강권': row.수강권 ? row.수강권 : '',
							'company': row.소속 ? row.소속 : '',
							'department': row.부서 ? row.부서 : '',
							'position': row.직급 ? row.직급 : '',
							'empNo': row.사번 ? row.사번 : '',
							'cel': row.연락처 ? row.연락처 : '',
							'cf1': row.CF1 ? row.CF1 : '',
							'cf2': row.CF2 ? row.CF2 : '',
						}))
					)
				})
				const res = await api.post('/partners/importApplyListToExcel', {
					bbIdx: shared.getCurBatch().idx,
					rows: JSON.stringify(value)
				})
				if (res.result === 2000) {
					this.$swal.fire({
						title: '일괄 신청이 완료 되었습니다.',
						confirmButtonText: 'OK',
					})
					this.refreshData()
				} else if (res.result === 1000) {
					this.$swal.fire({
						title: res.message,
						text: res.data.errMsg,
						icon: 'warning',
						confirmButtonText: 'OK'
					})
				}
			}
			reader.readAsBinaryString(input)
			this.loading = false
		}, 500),
		exportFormat: _.debounce(async function () {
			this.loading = true
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
			}))
			var ws = XLSX.utils.json_to_sheet(dataWs)
			var wb = XLSX.utils.book_new()
			XLSX.utils.book_append_sheet(wb, ws, this.company + ' ' + shared.getCurBatch().b_no + '주차 신청관리')
			const test = XLSX.writeFile(wb, this.company + ' ' + shared.getCurBatch().b_no + '주차 신청관리.xlsx')
			this.loading = false
		}, 500),
		toggleCancel (event) {
			this.includeCancel = event
			this.refreshData()
		},
		openMemoModal (idx, content) {
			this.content = content
			this.selectIdx = idx
			this.showMemoModal = !this.showMemoModal
		},
		openInfoModal (idx, content) {
			this.content = content
			this.selectIdx = idx
			this.showInfoModal = !this.showInfoModal
		},
		async openUserInfo (boIdx) {
			this.modalitem = await shared.getUserInfo(boIdx)
			this.showUserInfoModal = !this.showUserInfoModal
		},
		async updateMemo (text) {
			this.showMemoModal = !this.showMemoModal
			const res = await api.post('/partners/updateMemo', { boIdx: this.selectIdx, memo: text }).catch((e) => {
				console.log('error : updateMemo ' + e)
			})
			if (res.result === 2000) {
				this.refreshData()
			}
		},
		async updateInfo (text) {
			this.showInfoModal = !this.showInfoModal
			const res = await api.post('/partners/updateInfo', { boIdx: this.selectIdx, info: text }).catch((e) => {
				console.log('error : updateInfo ' + e)
			})
			if (res.result === 2000) {
				this.refreshData()
			}
		},
		approve (idx, name, email) {
			this.$swal.fire({
				html: `<strong>${name}(${email})</strong>님<br/>을 승인 하시겠습니까?`,
				showCancelButton: true,
				cancelButtonColor: '#ed5565',
				cancelButtonText: '취소',
				confirmButtonColor: '#8FD0F5',
				confirmButtonText: '확인',
				showLoaderOnConfirm: true,
				reverseButtons: true,
			}).then(async (r) => {
				if (r.isConfirmed) {
					const res = await api.post('/partners/approveOrder', { boIdx: idx }).catch((e) => {
						console.log('error : approveOrder ' + e)
					})

					if (res.result === 2000) {
						this.$swal('신청이 완료되었습니다.').then(r => {
							if (r.isConfirmed) this.refreshData()
						})
					} else {
						this.$swal
							.fire({
								html: `<strong>${res.message}</strong>`,
								icon: 'error',
								confirmButtonColor: '#8FD0F5',
								confirmButtonText: '확인',
								showLoaderOnConfirm: true,
								reverseButtons: true,
							})

					}
				}
			})
		},
		routeIndivApply () {
			this.$router.push({
				name: 'indivApplyNew',
				params: { bbIdx: shared.getCurBatch().idx }
			})
		},
		async cancel (item) {
			this.$swal.fire({
					icon: 'warning',
					title: '취소 하시겠습니까?',
					showCancelButton: true,
					confirmButtonText: 'OK',
					confirmButtonColor: '#ff7674',

				})
				.then(async result => {
					if (result.isConfirmed) {
						const res = await api.post('/partners/applyCancel', { boIdx: item.idx, buIdx: item.user.idx })
						if (res.result === 2000) {
							this.$swal.fire({
								text: '취소가 완료되었습니다.',
								icon: 'success',
								confirmButtonText: '확인',
								confirmButtonColor: '#8FD0F5',
							})
							this.refreshData()
						} else {
							this.$swal({
								title: '다시 시도 해주세요',
								text: res.message.errMsg,
								icon: 'error',
								confirmButtonText: '확인',
								confirmButtonColor: '#8FD0F5',
							})
						}
					}
				})
		},

		async approveBatchCheck () {
			const res = await api.get('/partners/approveBatchCheck', { bbIdx: this.curBBIdx }).catch((e) => {
				console.log('error : approveBatchCheck ' + e)
			})

			if (res.result === 2000) {

				this.$swal.fire({
					title:`<strong>일괄 승인</strong> 하시겠습니까?`,
					html: `대상 건수 <strong>${res.data.targetCnt}</strong>건<br/>`,
					icon: 'info',
					confirmButtonText: '일괄 승인하기',
					confirmButtonColor: '#8FD0F5',
					showCancelButton: true,
					cancelButtonColor: '#ed5565',
					cancelButtonText: '취소',
					reverseButtons: true,
				}).then( async (r) => {
					if(r.isConfirmed) {
						this.approveBatch();
					}
				})
			}
		},

		async approveBatch () {
			const res = await api.post('/partners/approveBatch', { bbIdx: this.curBBIdx }).catch((e) => {
				console.log('error : approveBatch ' + e)
			})

			if(res.result === 2000) {
				this.$swal.fire({
					title: `일괄 신청 결과 입니다.`,
					html: `대상 건수 <strong>${res.data.targetCnt}</strong>건<br/>성공 건수 <strong>${res.data.successCnt}</strong>건<br/>실패 건수 <strong>${res.data.failCnt}</strong>건<br/>`,
				}).then( r => {
					if(r.isConfirmed) {
						if(res.data.errorMsgs) {

						}
						this.refreshData()
					}
				})
			}
		},
		setSearch(sk){
			this.refreshData(sk)
		}
	},
}
</script>

<style scoped>
	.mng-text {
		overflow: hidden;
		text-overflow: ellipsis;
		width: 70px;
		white-space:nowrap;
	}
</style>
