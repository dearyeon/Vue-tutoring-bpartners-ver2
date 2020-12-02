<template>
<div>
	<Header title="입과 관리"
			:use-batch-selection="true" @changeBatch="refreshData"
			search-placeholder="이름 or 이메일 or 고객식별ID" @search="setSearch" @reset="setSearch"
			switch1-text="취소포함" @switch1-change="toggleCancel"
			btn1-text="일괄 입과" @btn1-click="issueBatchCheck" btn1-variant="primary" :btn1-loading="loading1"
			btn2-text="일괄 취소" @btn2-click="issueCancelBatchCheck" btn2-variant="danger" :btn2-loading="loading2"
			btn3-text="AI 일괄 지급" @btn3-click="aiLevelBatchCheck" btn3-variant="success" :btn3-loading="loading3">
	</Header>


	<Content>
		<Table :headers="['No','이름','고객식별ID','입과번호','이메일','연락처','수강권','수강권번호','입과일시','입과취소일시','AI지급일시','AI지급','입과/취소']"
			:data="orders"
			v-slot="{item, i}">
			<td>{{ i + 1 }}</td>
			<td><NameField :item="item"></NameField></td>
			<td><CusIdField :user="item.user"/></td>
			<td>{{ item.mt_idx }}</td>
			<td>{{ item.user.email}}</td>
			<td>{{ item.user.cel}}</td>
			<td>{{ item.charge_plan && item.charge_plan.title }}</td>
			<td>{{ item.charge_plan && item.charge_plan.idx }}</td>
			<td>{{ item.issue_dt && moment(item.issue_dt).format('YY-MM-DD HH:mm') }}</td>
			<td>{{ item.issue_ccl_dt && moment(item.issue_ccl_dt).format('YY-MM-DD HH:mm') }}</td>
			<td>
				{{ item.alcpt_issue_dt && moment(item.alcpt_issue_dt).format('YY-MM-DD HH:mm') }}
			</td>
			<td>
				<ItemButton text="AI티켓 지급" variant="success btn-outline" @click="aiModalOpen(item)" />
			</td>
			<td>
				<ItemButton v-if="!item.issue_dt" text="입과" variant="success btn-outline" @click="issueModalOpen(item)" />
				<ItemButton v-if="item.issue_dt && !item.issue_ccl_dt" text="취소" variant="danger" @click="issueCancel(item)" />
			</td>
		</Table>
	</Content>


	<IssueDateModal v-if="showIssueModal" title="단건 입과" button-text="입과" :subtitle="`${curOrder.user.name} ( ${curOrder.user.email}) 님을 입과 하시겠습니까?`"  @close="[showIssueModal=false,curOrder=null]" @save="issueOrder"/>

	<IssueDateModal v-if="showIssueBatchModal" button-text="입과" title="일괄 입과" :subtitle="`대상 건수 ${targetCnt}건`" @close="showIssueBatchModal=false" @save="issueBatch"/>

	<IssueDateModal v-if="showAIModal" title="AI 지급" button-text="지급" :is-ai="true" :subtitle="`${curOrder.user.name} ( ${curOrder.user.email}) 님에게 AI 티켓을 입과 하시겠습니까?`" :item="curOrder"  @close="showAIModal = false" @save="issueAILeveltestTicket"/>

	<IssueDateModal v-if="showAIBatchModal" title="AI 일괄 지급" button-text="지급" :is-ai="true" :subtitle="`대상 건수 ${targetCnt}건`" :item="curOrder"  @close="showAIBatchModal = false" @save="issueAILeveltestTicketBatch"/>
</div>
</template>


<script>
import api from "@/common/api"
import moment from 'moment'
import shared from "@/common/shared"
import BatchSelection from "@/components/Common/BatchSelection"
import NameField from "@/components/Common/NameField"
import CusIdField from "@/components/Common/CusIdField"
import Header from "@/components/Common/Header"
import Content from "@/components/Common/Content"
import Table from "@/components/Common/Table"
import ItemButton from "@/components/Common/ItemButton"
import IssueDateModal from '../Modal/IssueDateModal'

export default {
	components: {
		Header,
		Content,
		NameField,
		CusIdField,
		Table,
		ItemButton,
		IssueDateModal
	},
	data() {
		return {
			orders: [],
			ordersAll: [],
			moment: moment,
			showIssueModal: false,
			showIssueBatchModal: false,
			showAIModal: false,
			showAIBatchModal: false,
			includeCancel: false,
			batch: null,
			curOrder: null,
			targetCnt: 0,
			loading1:false,
			loading2:false,
			loading3:false,
		};
	},
	created() {
		this.refreshData();
	},
	methods: {
		async refreshData() {
			this.batch = shared.getCurBatch()
			const { result, data } = await api.get("/partners/issueOrderList", {bbIdx:this.batch.idx})

			if(result === 2000) {
				this.ordersAll = data.orders
				this.orders = this.ordersAll

				this.filteredData()
			}

		},

		filteredData() {
			this.orders = this.ordersAll
			if(!this.includeCancel) {
				this.orders = this.orders.filter((order) => {
					return order.issue_ccl_dt === null
				})
			}
			if(this.sk) this.orders = this.orders.filter((order) => {
				return !order.user.name.indexOf(this.sk) ||
						(order.user.cus_id && !order.user.cus_id.indexOf(this.sk)) ||
						(order.user.email && !order.user.email.indexOf(this.sk))
			})
		},

		setSearch(sk) {
			this.sk = sk
			this.filteredData()
		},

		toggleCancel(event){
			this.includeCancel = event;
			this.filteredData();
		},

		aiModalOpen(order) {
			this.curOrder = order
			this.showAIModal = true
		},

		issueModalOpen(order) {
			this.curOrder = order
			this.showIssueModal = true
		},

		async issueOrder(frDt, toDt) {
			this.showIssueModal = false
			const { result,message } = await api.post("/partners/issueOrder", {boIdx:this.curOrder.idx,frDate:frDt,toDate:toDt});

			if (result === 2000) {
				this.$swal.fire({
					title: `${this.curOrder.user.name}님에게 입과 완료 되었습니다.`,
				}).then( r => {
					if(r.isConfirmed) {
						this.refreshData()
						this.curOrder = null
					}
				})
			} else if (result === 1000) {
				this.$swal.fire({
					title: message,
					icon: 'warning',
					confirmButtonText: 'OK'
				})
			}
		},

		async issueBatch(frDt, toDt) {
			this.loading1 = true
			this.showIssueBatchModal = false
			const { result, data, errorMsgs} = await api.post("/partners/issueBatch", {bbIdx:shared.getCurBatch().idx, frDate:frDt, toDate:toDt});
			if (result === 2000) {
				this.$swal.fire({
					title: '입과 완료 되었습니다.',
					icon: 'success',
					html: `대상 건수 <strong>${data.targetCnt}</strong>건<br/>성공 건수 <strong>${data.successCnt}</strong>건<br/>실패 건수 <strong>${data.failCnt}</strong>건<br/>`,
					confirmButtonText: 'OK',
				})
				this.refreshData()
			} else if (result === 1000) {
				this.$swal.fire({
					title: errorMsgs,
					icon: 'warning',
					confirmButtonText: 'OK'
				})
			}
			this.loading1 = false

		},

		async issueAILeveltestTicket(frDt, toDt) {
			this.showAIModal = false

			const { result, message } = await api.post("/partners/aiLevelOrder", {boIdx:this.curOrder.idx, frDate: frDt, toDate: toDt});

			if(result === 2000) {
				this.$swal.fire({
					title:`${this.curOrder.user.name}님에게 AI 레벨테스트 티켓이 지급 되었습니다.`
				}).then( r => {
					if(r.isConfirmed) {
						this.refreshData()
					}
				})
			} else if(result === 1000) {
				this.$swal.fire({
					title: '취소 실패',
					icon: 'warning',
					text: message,
					confirmButtonText: 'OK'
				})
			}

		},

		async issueAILeveltestTicketBatch(frDt, toDt) {
			this.loading3 = true;
			this.showAIBatchModal = false

			const { result, data } = await api.post("/partners/aiLevelBatch", {bbIdx:shared.getCurBatch().idx, frDate: frDt, toDate: toDt});

			if(result === 2000) {
				this.$swal.fire({
					title: '입과 완료 되었습니다.',
					icon: 'success',
					html: `대상 건수 <strong>${data.targetCnt}</strong>건<br/>성공 건수 <strong>${data.successCnt}</strong>건<br/>실패 건수 <strong>${data.failCnt}</strong>건<br/>`,
					confirmButtonText: 'OK',
				})
				this.refreshData()
			}
			this.loading3 = false
		},

		async issueBatchCheck() {
			const { result, data } = await api.get("/partners/issueBatchCheck", {bbIdx:shared.getCurBatch().idx});
			if(result === 2000) {
				this.targetCnt =  data.targetCnt
				this.showIssueBatchModal = true
			}
		},

		async aiLevelBatchCheck() {
			const { result, data } = await api.get("/partners/aiLevelBatchCheck", {bbIdx:shared.getCurBatch().idx});
			if(result === 2000) {
				this.targetCnt =  data.targetCnt
				this.showAIBatchModal = true
			}
		},
		async issueCancel(item) {
			console.log(item)
			this.$swal.fire({
				title:`${item.user.name}님 입과 취소하시겠습니까?`,
				confirmButtonText: 'OK',
				showCancelButton: true,
				cancelButtonText: 'Cancel',
			}).then( async r => {
				if(r.isConfirmed) {
					const {result,message} = await api.post("/partners/issueCancel", {boIdx:item.idx});
					if(result === 2000) {
						this.$swal.fire({
							title:`${item.user.name}님 입과 취소가 완료되었습니다.`,
							confirmButtonText: 'OK',
						})
						this.refreshData()
					} else if(result === 1000) {
						this.$swal.fire({
							title: '취소 실패',
							text: message,
							icon: 'warning',
							confirmButtonText: 'OK'
						})
					}
				}
			})
			
		},
		async issueCancelBatchCheck () {
			const {result, data} = await api.get("/partners/issueCancelBatchCheck", {bbIdx:shared.getCurBatch().idx});
			if (result === 2000) {
				this.$swal.fire({
					title: `대상 건수 <strong>${data.targetCnt}</strong>건<br/>`,
					html: `<strong>일괄 취소</strong> 하시겠습니까?`,
					confirmButtonText: '일괄 취소하기',
					confirmButtonColor: '#8FD0F5',
					showCancelButton: true,
					cancelButtonColor: '#ed5565',
					cancelButtonText: '취소',
					reverseButtons: true,
				}).then((r) => {
					if (r.isConfirmed) {
						this.issueCancelBatch()
					}
				})
			}
		},
		async issueCancelBatch() {
			this.loading2 = true
			const {result,data} = await api.post("/partners/issueCancelBatch", {bbIdx:shared.getCurBatch().idx});
			console.log(result)
			if (result === 2000) {
				this.$swal.fire({
					title: `일괄 취소 결과 입니다.`,
					html: `대상 건수 <strong>${data.targetCnt}</strong>건<br/>성공 건수 <strong>${data.successCnt}</strong>건<br/>실패 건수 <strong>${data.failCnt}</strong>건<br/>`,
				})
				this.refreshData()
			} else if(result === 1000) {
				this.$swal.fire({
					title: '취소 실패',
					icon: 'warning',
					confirmButtonText: 'OK'
				})
			}
			this.loading2 = false
		}

	}
};
</script>



<style scoped>
.swal2-container {
	z-index: 300000 !important;
}
</style>
